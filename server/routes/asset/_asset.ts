import {Request, Response} from "express";
import Asset from "../../classes/Asset.ts";
import models from "../../db/index.ts";
import {handleDataToReturn, handleError} from "../../utils/index.ts";
import {Op, Transaction} from "sequelize";

export const _asset = {
    async listAsset(req: Request, res: Response) {
        try {
            let query = {
                include:[{
                    model: models.asset_option, required: false
                }]
            }
            const asset = await Asset.listAsset('findAndCountAll', query);
            let newAsset: any = {};

            if (asset.rows.length) {
                for (let row of asset.rows) {
                    newAsset[row.asset_name] = row?.asset_options || [];
                }
            }
            res.json(await handleDataToReturn(newAsset, req?.authUser?.auth));
        } catch (e: any) {
            console.log(e.message);
            handleError(res, e)
        }
    },

    async listAssetByIdNameReturningAll(req: Request, res: Response): Promise<any> {
        const {asset_name} = req.params;

        try {
            let id = parseInt(asset_name, 10);
            if (!isNaN(id)) {
                let query = {
                    where: {
                        asset_id: id
                    },
                    include:[{
                        model: models.asset_option, required: false
                    }]
                }
                const insurance = await Asset.listAssetByPk(id, query);
                return res.json(await handleDataToReturn(insurance, req?.authUser?.auth));
            }
            else {
                let query = {
                    where: {
                        asset_name: {
                            [Op.eq]: asset_name
                        }
                    },
                    include:[{
                        model: models.asset_option, required: false
                    }]
                }
                const asset = await Asset.listAsset('findOne', query);
                res.json(await handleDataToReturn(asset?.asset_options || [], req?.authUser?.auth));
            }
        } catch (e: any) {
            console.log(e.message);
            handleError(res, e)
        }
    },

    async listAssetByIdName(req: Request, res: Response): Promise<any> {
        const {asset_name} = req.params;

        try {
            let id = parseInt(asset_name, 10);
            if (!isNaN(id)) {
                let query = {
                    where: {
                        asset_id: id
                    },
                    include:[{
                        model: models.asset_option,
                        required: false,
                        where: { asset_option_active: true }
                    }]
                }
                const insurance = await Asset.listAssetByPk(id, query);
                return res.json(await handleDataToReturn(insurance, req?.authUser?.auth));
            }
            else {
                let query = {
                    where: {
                        asset_name: {
                            [Op.eq]: asset_name
                        }
                    },
                    include:[{
                        model: models.asset_option,
                        required: false,
                        where: { asset_option_active: true }
                    }]
                }
                const asset = await Asset.listAsset('findOne', query);
                res.json(await handleDataToReturn(asset?.asset_options || [], req?.authUser?.auth));
            }
        } catch (e: any) {
            console.log(e.message);
            handleError(res, e)
        }
    },

    async createAsset(req: Request, res: Response) {
        let data = req.body;
        let transaction: Transaction | undefined;
        try {
            transaction = await models.sequelize!.transaction();

            let asset = await Asset.createAssetFactory(transaction, data, req.authUser);

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

    async updateAsset(req: Request, res: Response) {
        let data = req.body;
        let transaction: Transaction | undefined;
        try {
            transaction = await models.sequelize!.transaction();

            let asset = await Asset.updateAssetFactory(transaction, data, req.authUser);

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

    async deleteAsset(req: Request, res: Response) {
        const {asset_id} = req.params;
        let transaction: Transaction | undefined;
        try {
            transaction = await models.sequelize!.transaction();
            await Asset.deleteAsset(transaction, parseInt(asset_id, 10), req.authUser);

            await transaction.commit();

            res.json(await handleDataToReturn({}, req?.authUser?.auth));
        } catch (e: any) {
            if (transaction) {
                await transaction.rollback();
            }
            console.log(e.message);
            handleError(res, e)
        }
    }
}