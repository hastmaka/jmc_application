import {Request, Response} from "express";
import Inspection from '../../classes/Inspection.ts'
import InspectionVehicle from '../../classes/InspectionVehicle.ts'
import {handleDataToReturn, handleError, manageFilter} from "../../utils/index.js";
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

    for (const vehicle of vehicles) {
        const carId = vehicle.car_car_id;
        if (!carId || !inspectionDate) continue;

        // Fetch all reservations for this car on this date
        const reservations = await models.reservation.findAll({
            where: {
                car_car_id: carId,
                reservation_date: inspectionDate,
                reservation_status: 7
            }
        });

        vehicle.dataValues.vehicle_reservations = reservations.map((r: any) => r.toJSON());
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
            console.log(e.message);
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
            console.log(e.message);
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
                    return res.status(409).json({
                        success: false,
                        existingId: existing.get('inspection_id'),
                        message: 'An inspection already exists for this driver on this date.'
                    });
                }
            }

            console.log(e.message);
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

            // Handle vehicles: delete existing and recreate
            if (vehicles && Array.isArray(vehicles)) {
                // Delete existing vehicles for this inspection
                await InspectionVehicle.deleteByInspectionId(transaction, inspectionId, req.authUser);

                // Create new vehicles
                for (const vehicle of vehicles) {
                    await InspectionVehicle.createInspectionVehicleFactory(transaction, {
                        ...vehicle,
                        inspection_inspection_id: inspectionId
                    }, req.authUser);
                }
            }

            await transaction.commit();

            res.json(await handleDataToReturn({}, req?.authUser?.auth));
        } catch (e: any) {
            if (transaction) {
                await transaction.rollback();
            }
            console.log(e.message);
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
            res.json(await handleDataToReturn({}, req?.authUser?.auth));
        } catch (e: any) {
            if (transaction) {
                await transaction.rollback();
            }
            console.log(e.message);
            handleError(res, e)
        }
    },
}
