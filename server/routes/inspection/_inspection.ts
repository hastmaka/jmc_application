import {Request, Response} from "express";
import Inspection from '../../classes/Inspection.ts'
import InspectionVehicle from '../../classes/InspectionVehicle.ts'
import {handleDataToReturn, handleError, manageFilter} from "../../utils/index.js";
import models from '../../db/index.ts';
import {Transaction} from "sequelize";

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

            const inspection = await Inspection.listInspection('findAndCountAll', query)
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
