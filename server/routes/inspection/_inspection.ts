import {Request, Response} from "express";
import Inspection from '../../classes/Inspection.ts'
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
                    model: models.car, as: 'inspection_car', required: false
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
                    model: models.car, as: 'inspection_car', required: false
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

            await Inspection.createInspectionFactory(transaction, req.body, req.authUser);

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

    async updateInspection(req: Request, res: Response) {
        let transaction: Transaction | undefined;
        try {
            transaction = await models.sequelize!.transaction();

            await Inspection.updateInspectionFactory(transaction, req.body, req.authUser);

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
            await Inspection.deleteInspection(transaction, +inspection_id, req?.authUser?.auth);
            await transaction.commit();
            res.json(await handleDataToReturn({}, req?.authUser?.auth));
        } catch (e: any) {
            console.log(e.message);
            handleError(res, e)
        }
    },
}
