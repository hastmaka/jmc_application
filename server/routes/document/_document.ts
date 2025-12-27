import {Request, Response} from "express";
import Document from '../../classes/Document.ts'
import {handleDataToReturn, handleError} from "../../utils/index.js";
import models from '../../db/index.ts';
import {Transaction} from "sequelize";

export const _document = {
    async listDocument(req: Request, res: Response) {
        try {
            const query = {
                include: [{
                    model: models.asset_option, as: 'document_primary_option', required: false
                }, {
                    model: models.car, required: false
                }, {
                    model: models.employee, required: false
                }]
            }

            const document = await Document.listDocument('findAndCountAll', query)
            res.json(await handleDataToReturn(document, req?.authUser?.auth));
        } catch (e: any) {
            console.log(e.message);
            handleError(res, e)
        }
    },

    async listDocumentByPk(req: Request, res: Response) {
        const {document_id} = req.params

        try {
            const query = {
                include: [{
                    model: models.asset_option, as: 'document_primary_option', required: false
                }, {
                    model: models.car, required: false
                }, {
                    model: models.employee, required: false
                }]
            }

            const document = await Document.listDocumentByPk(+document_id, query);
            res.json(await handleDataToReturn(document, req?.authUser?.auth));
        } catch (e: any) {
            console.log(e.message);
            handleError(res, e)
        }
    },

    async createDocument(req: Request, res: Response) {
        let data = req.body;
        let transaction: Transaction | undefined;
        try {
            transaction = await models.sequelize!.transaction();

            await Document.createDocumentFactory(transaction, data, req.authUser);

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

    async updateDocument(req: Request, res: Response) {
        let data = req.body;
        let transaction: Transaction | undefined;
        try {
            transaction = await models.sequelize!.transaction();

            await Document.updateDocumentFactory(transaction, data, req.authUser);

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

    async deleteDocument(req: Request, res: Response) {
        const {document_id} = req.params
        let transaction: Transaction | undefined;
        try {
            transaction = await models.sequelize!.transaction();
            await Document.deleteDocument(transaction, +document_id, req?.authUser?.auth);
            await transaction.commit();
            res.json(await handleDataToReturn({}, req?.authUser?.auth));
        } catch (e: any) {
            console.log(e.message);
            handleError(res, e)
        }
    },
}
