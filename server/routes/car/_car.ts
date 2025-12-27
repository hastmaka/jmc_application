import {Request, Response} from "express";
import Car from '../../classes/Car.ts'
import Document from "../../classes/Document.ts";
import {handleDataToReturn, handleError} from "../../utils/index.js";
import models from '../../db/index.ts';
import {Op, Transaction} from "sequelize";

export const _car = {
    async listCar(req: Request, res: Response) {
        try {
            const query = {
                include: [{
                    model: models.asset_option, as: 'car_status_option', required: false
                }, {
                    model: models.asset_option, as: 'car_type_option', required: false
                }, {
                    model: models.document, as: 'car_document', required: false
                }]
            }

            const car = await Car.listCar('findAndCountAll', query)
            res.json(await handleDataToReturn(car, req?.authUser?.auth));
        } catch (e: any) {
            console.log(e.message);
            handleError(res, e)
        }
    },

    async listCarAsset(req: Request, res: Response) {
        try {
            const query = {
                where: {
                    car_status: {
                        [Op.like]: 9
                    }
                },
            }

            const car = await Car.listCar('findAll', query)
            res.json(await handleDataToReturn(car, req?.authUser?.auth));
        } catch (e: any) {
            console.log(e.message);
            handleError(res, e)
        }
    },

    async listCarByPk(req: Request, res: Response) {
        const {car_id} = req.params

        try {
            const query = {
                include: [{
                    model: models.asset_option, as: 'car_status_option', required: false
                }, {
                    model: models.asset_option, as: 'car_type_option', required: false
                }, {
                    model: models.document, as: 'car_document', required: false
                }]
            }

            const car = await Car.listCarByPk(+car_id, query);
            res.json(await handleDataToReturn(car, req?.authUser?.auth));
        } catch (e: any) {
            console.log(e.message);
            handleError(res, e)
        }
    },

    async createCar(req: Request, res: Response) {
        let {document, ...rest} = req.body;
        let transaction: Transaction | undefined;
        try {
            transaction = await models.sequelize!.transaction();

            const _car = await Car.createCarFactory(transaction, rest, req.authUser);

            if (document?.length) {
                for (const doc of document) {
                    await Document.createDocumentFactory(transaction, {...doc, car_car_id: _car.car_id}, req.authUser);
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

    async updateCar(req: Request, res: Response) {
        let {document, ...rest} = req.body;
        let transaction: Transaction | undefined;
        try {
            transaction = await models.sequelize!.transaction();

            await Car.updateCarFactory(transaction, rest, req.authUser);

            if (document?.length) {
                for (const doc of document) {
                    await Document.createDocumentFactory(transaction, {...doc, car_car_id: rest.car_id}, req.authUser);
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

    async deleteCar(req: Request, res: Response) {
        const {car_id} = req.params
        let transaction: Transaction | undefined;
        try {
            transaction = await models.sequelize!.transaction();
            await Car.deleteCar(transaction, +car_id, req?.authUser?.auth);
            await transaction.commit();
            res.json(await handleDataToReturn({}, req?.authUser?.auth));
        } catch (e: any) {
            console.log(e.message);
            handleError(res, e)
        }
    },
}