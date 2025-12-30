import {Request, Response} from "express";
import Inspection from '../../classes/Inspection.ts'
import InspectionVehicle from '../../classes/InspectionVehicle.ts'
import {handleDataToReturn, handleError, manageFilter, logger} from "../../utils/index.js";
import models from '../../db/index.ts';
import {Op, Transaction} from "sequelize";

async function attachReservationsToVehicles(inspectionData: any) {
    const rows = Array.isArray(inspectionData) ? inspectionData : inspectionData?.rows || [];

    // Collect all reservation IDs from all vehicles
    const allReservationIds: number[] = [];
    for (const inspection of rows) {
        const vehicles = inspection.inspection_vehicles || [];
        for (const vehicle of vehicles) {
            const ids = vehicle.inspection_vehicle_reservation_ids || [];
            allReservationIds.push(...ids);
        }
    }

    if (allReservationIds.length === 0) return inspectionData;

    // Fetch all reservations in one query
    const reservations = await models.reservation.findAll({
        where: { reservation_id: { [Op.in]: allReservationIds } }
    });

    // Create a map for quick lookup
    const reservationMap = new Map(reservations.map((r: any) => [r.reservation_id, r.toJSON()]));

    // Attach reservations to each vehicle
    for (const inspection of rows) {
        const vehicles = inspection.inspection_vehicles || [];
        for (const vehicle of vehicles) {
            const ids = vehicle.inspection_vehicle_reservation_ids || [];
            vehicle.dataValues.vehicle_reservations = ids.map((id: number) => reservationMap.get(id)).filter(Boolean);
        }
    }

    return inspectionData;
}

// For edit mode: fetch ALL reservations for each vehicle's car+date (not just selected)
async function attachAllReservationsToVehicles(inspection: any) {
    if (!inspection) return inspection;

    const inspectionDate = inspection.inspection_date;
    const vehicles = inspection.inspection_vehicles || [];

    // Collect all car IDs to fetch reservations in one query
    const carIds = vehicles.map((v: any) => v.car_car_id).filter(Boolean);

    if (carIds.length === 0 || !inspectionDate) return inspection;

    // Fetch all reservations for all cars on this date in one query
    const reservations = await models.reservation.findAll({
        where: {
            car_car_id: { [Op.in]: carIds },
            reservation_date: inspectionDate,
            reservation_status: 7
        }
    });

    // Group reservations by car_car_id
    const reservationsByCarId = new Map<number, any[]>();
    for (const r of reservations) {
        const carId = r.car_car_id;
        if (!reservationsByCarId.has(carId)) {
            reservationsByCarId.set(carId, []);
        }
        reservationsByCarId.get(carId)!.push(r.toJSON());
    }

    // Attach reservations to each vehicle
    for (const vehicle of vehicles) {
        const carId = vehicle.car_car_id;
        vehicle.dataValues.vehicle_reservations = reservationsByCarId.get(carId) || [];
    }

    return inspection;
}

export const _inspection = {
    async listInspection(req: Request, res: Response) {
        try {
            const _query = manageFilter(req.query, models.inspection);

            const query = {
                ..._query,
                include: [{
                    model: models.employee, as: 'inspection_employee', required: false
                }, {
                    model: models.inspection_vehicle,
                    as: 'inspection_vehicles',
                    required: false,
                    include: [{
                        model: models.car, as: 'vehicle_car', required: false
                    }]
                }],
                order: [['inspection_date', 'DESC']]
            }

            const inspection = await Inspection.listInspection('findAndCountAll', query);
            await attachReservationsToVehicles(inspection);
            res.json(await handleDataToReturn(inspection, req?.authUser?.auth));
        } catch (e: any) {
            handleError(res, e)
        }
    },

    async listInspectionByPk(req: Request, res: Response) {
        const {inspection_id} = req.params

        try {
            const query = {
                include: [{
                    model: models.employee, as: 'inspection_employee', required: false
                }, {
                    model: models.inspection_vehicle,
                    as: 'inspection_vehicles',
                    required: false,
                    include: [{
                        model: models.car, as: 'vehicle_car', required: false
                    }]
                }]
            }

            const inspection = await Inspection.listInspectionByPk(+inspection_id, query);
            if (inspection) {
                // Fetch ALL reservations for each vehicle's car+date (for edit mode)
                await attachAllReservationsToVehicles(inspection);
            }
            res.json(await handleDataToReturn(inspection, req?.authUser?.auth));
        } catch (e: any) {
            handleError(res, e)
        }
    },

    async createInspection(req: Request, res: Response) {
        let transaction: Transaction | undefined;
        try {
            transaction = await models.sequelize!.transaction();

            const { vehicles, ...inspectionData } = req.body;

            // Create inspection
            const inspection = await Inspection.createInspectionFactory(transaction, inspectionData, req.authUser);
            const inspectionId = inspection.get('inspection_id');

            // Create vehicles if provided
            if (vehicles && Array.isArray(vehicles) && vehicles.length > 0) {
                for (const vehicle of vehicles) {
                    await InspectionVehicle.createInspectionVehicleFactory(transaction, {
                        ...vehicle,
                        inspection_inspection_id: inspectionId
                    }, req.authUser);
                }
            }

            await transaction.commit();

            logger.audit('CREATE', {
                resource: 'inspection',
                resourceId: inspectionId,
                userId: req.authUser?.user_id
            });

            res.json(await handleDataToReturn({ inspection_id: inspectionId }, req?.authUser?.auth));
        } catch (e: any) {
            if (transaction) {
                await transaction.rollback();
            }

            // Handle unique constraint violation
            if (e.name === 'SequelizeUniqueConstraintError') {
                const { vehicles, ...inspectionData } = req.body;
                const existing = await models.inspection.findOne({
                    where: {
                        employee_employee_id: inspectionData.employee_employee_id,
                        inspection_date: inspectionData.inspection_date,
                    }
                });

                if (existing) {
                    logger.warn('Duplicate inspection attempt', {
                        existingId: existing.get('inspection_id'),
                        employeeId: inspectionData.employee_employee_id,
                        date: inspectionData.inspection_date
                    });
                    return res.status(409).json({
                        success: false,
                        existingId: existing.get('inspection_id'),
                        message: 'An inspection already exists for this driver on this date.'
                    });
                }
            }

            handleError(res, e)
        }
    },

    async updateInspection(req: Request, res: Response) {
        let transaction: Transaction | undefined;
        try {
            transaction = await models.sequelize!.transaction();

            const { vehicles, ...inspectionData } = req.body;
            const inspectionId = inspectionData.inspection_id;

            // Update inspection
            await Inspection.updateInspectionFactory(transaction, inspectionData, req.authUser);

            // Handle vehicles: smart update (update existing, delete removed, create new)
            if (vehicles && Array.isArray(vehicles)) {
                // Get existing vehicle IDs for this inspection
                const existingVehicles = await models.inspection_vehicle.findAll({
                    where: { inspection_inspection_id: inspectionId },
                    attributes: ['inspection_vehicle_id', 'car_car_id'],
                    transaction
                });
                const existingMap = new Map(existingVehicles.map((v: any) => [v.car_car_id, v.inspection_vehicle_id]));

                const incomingCarIds = new Set(vehicles.map((v: any) => v.car_car_id));

                // Delete vehicles that are no longer in the list
                for (const existing of existingVehicles) {
                    if (!incomingCarIds.has(existing.car_car_id)) {
                        await InspectionVehicle.deleteInspectionVehicle(transaction, existing.inspection_vehicle_id, req.authUser);
                    }
                }

                // Update or create vehicles
                for (const vehicle of vehicles) {
                    const existingId = existingMap.get(vehicle.car_car_id);
                    if (existingId) {
                        // Update existing vehicle
                        await InspectionVehicle.updateInspectionVehicleFactory(transaction, {
                            ...vehicle,
                            inspection_vehicle_id: existingId
                        }, req.authUser);
                    } else {
                        // Create new vehicle
                        await InspectionVehicle.createInspectionVehicleFactory(transaction, {
                            ...vehicle,
                            inspection_inspection_id: inspectionId
                        }, req.authUser);
                    }
                }
            }

            await transaction.commit();

            logger.audit('UPDATE', {
                resource: 'inspection',
                resourceId: inspectionId,
                userId: req.authUser?.user_id
            });

            res.json(await handleDataToReturn({}, req?.authUser?.auth));
        } catch (e: any) {
            if (transaction) {
                await transaction.rollback();
            }
            handleError(res, e)
        }
    },

    async deleteInspection(req: Request, res: Response) {
        const {inspection_id} = req.params
        let transaction: Transaction | undefined;
        try {
            transaction = await models.sequelize!.transaction();

            // Delete vehicles first (or rely on CASCADE)
            await InspectionVehicle.deleteByInspectionId(transaction, +inspection_id, req?.authUser?.auth);

            // Delete inspection
            await Inspection.deleteInspection(transaction, +inspection_id, req?.authUser?.auth);

            await transaction.commit();

            logger.audit('DELETE', {
                resource: 'inspection',
                resourceId: +inspection_id,
                userId: req.authUser?.user_id
            });

            res.json(await handleDataToReturn({}, req?.authUser?.auth));
        } catch (e: any) {
            if (transaction) {
                await transaction.rollback();
            }
            handleError(res, e)
        }
    },
}
