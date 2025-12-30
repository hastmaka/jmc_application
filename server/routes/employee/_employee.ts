import {Request, Response} from 'express';
import {handleDataToReturn, handleError, logger} from "../../utils/index.ts";
import models from '../../db/index.ts';
import Employee from "../../classes/Employee.ts";
import Document from "../../classes/Document.ts";
import {Transaction} from "sequelize";

export const _employee = {
    listEmployee: async (req: Request, res: Response) => {
        try {
            const query = {
                include: [
                //     {
                //     model: models.phone, as: 'employee_phone', required: false
                // }, {
                //     model: models.address, as: 'employee_address', required: false
                // },
                    {
                    model: models.user, as: 'user', required: false
                }, {
                    model: models.document, as: 'employee_document', required: false
                }]
            }

            const employee = await Employee.listEmployee('findAndCountAll', query)
            res.json(await handleDataToReturn(employee, req?.authUser?.auth));
        } catch (e: any) {
            handleError(res, e)
        }
    },
    async listEmployeeAsset(req: Request, res: Response) {
        try {
            const employee = await Employee.listEmployee('findAll')
            res.json(await handleDataToReturn(employee, req?.authUser?.auth));
        } catch (e: any) {
            handleError(res, e)
        }
    },
    listEmployeeById: async (req: Request, res: Response) => {
        const {employee_id} = req.params

        try {
            const query = {
                include: [
                //     {
                //     model: models.phone, as: 'employee_phone', required: false
                // }, {
                //     model: models.address, as: 'employee_address', required: false
                // },
                    {
                    model: models.user, as: 'user', required: false
                }, {
                    model: models.document, as: 'employee_document', required: false,
                    include: [{
                        model: models.asset_option, as: 'document_type_option',required: false,
                    }]
                }, {
                    model: models.asset_option, as: 'employee_role_option', required: false
                }]
            }

            const employee = await Employee.listEmployeeByPk(+employee_id, query);
            res.json(await handleDataToReturn(employee, req?.authUser?.auth));
        } catch (e: any) {
            handleError(res, e)
        }
    },
    createEmployee: async (req: Request, res: Response) => {
        let {document, ...rest} = req.body;
        let transaction: Transaction | undefined;

        try {
            transaction = await models.sequelize!.transaction();

            const _employee = await Employee.createEmployeeFactory(transaction, rest, req.authUser);

            if (document?.length) {
                for (const doc of document) {
                    await Document.createDocumentFactory(transaction, {...doc, employee_employee_id: _employee.employee_id}, req.authUser);
                }
            }

            await transaction.commit();

            logger.audit('CREATE', {
                resource: 'employee',
                resourceId: _employee.employee_id,
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
    updateEmployee: async (req: Request, res: Response) => {
        let {document, ...rest} = req.body;
        let transaction: Transaction | undefined;

        try {
            transaction = await models.sequelize!.transaction();

            await Employee.updateEmployeeFactory(transaction, rest, req.authUser);

            if (document?.length) {
                for (const doc of document) {
                    await Document.createDocumentFactory(transaction, {...doc, employee_employee_id: rest.employee_id}, req.authUser);
                }
            }

            await transaction.commit();

            logger.audit('UPDATE', {
                resource: 'employee',
                resourceId: rest.employee_id,
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
    deleteEmployeeById: async (req: Request, res: Response) => {
        const {employee_id} = req.params
        let transaction: Transaction | undefined;

        try {
            transaction = await models.sequelize!.transaction();
            await Employee.deleteEmployee(transaction, +employee_id, req?.authUser?.auth);
            await transaction.commit();

            logger.audit('DELETE', {
                resource: 'employee',
                resourceId: +employee_id,
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