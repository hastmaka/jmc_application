import {Request, Response} from "express";
import AssetOption from "../../classes/AssetOption.ts";
import Asset from "../../classes/Asset.ts";
import models from "../../db/index.ts";
import {handleDataToReturn, handleError} from "../../utils/index.ts";
import {Op, Transaction} from "sequelize";

export const _asset_option = {
    async listAssetOption(req: Request, res: Response) {
        try {
            let options = {
                where: {
                    deleted_at: null
                },
                include:[{
                    model: models.asset_option,
                    required: false,
                    where: {
                        deleted_at: null
                    }
                }]
            }
            const asset_option = await AssetOption.listAssetOption('findAndCountAll', options)
            res.json(await handleDataToReturn(asset_option, req?.authUser?.auth));
        } catch (e: any) {
            console.log(e.message);
            handleError(res, e.message)
        }
    },

    async listAssetOptionByIdName(req: Request, res: Response): Promise<any> {
        const {asset_id_name} = req.params;

        try {
            let id = parseInt(asset_id_name, 10);
            if (!isNaN(id)) {
                const options = {
                    where: {
                        asset_asset_id: id,
                        deleted_at: null
                    },
                }
                const asset_option = await AssetOption.listAssetOption('findAll', options);
                return res.json(await handleDataToReturn(asset_option, req?.authUser?.auth));
            } else {
                let asset = await Asset.listAsset('findOne', {
                    where: {
                        asset_name: {
                            [Op.eq]: asset_id_name
                        },
                        deleted_at: null
                    },
                    include:[{
                        model: models.asset_option,
                        required: true,
                        where: {
                            deleted_at: null
                        }
                    }]
                });

                return res.json(await handleDataToReturn(asset?.asset_options || [], req?.authUser?.auth));
            }
        } catch (e: any) {
            console.log(e.message);
            handleError(res, e.message)
        }
    },

    async createAssetOption(req: Request, res: Response) {
        let data = req.body;
        let transaction: Transaction | undefined;
        try {
            transaction = await models.sequelize!.transaction();

            await AssetOption.createAssetOptionFactory(transaction, data, req.authUser);

            await transaction.commit();

            res.json(await handleDataToReturn({}, req?.authUser?.auth));
        } catch (e: any) {
            if (transaction) {
                await transaction.rollback();
            }
            console.log(e.message);
            handleError(res, e.message)
        }
    },

    async updateAssetOption(req: Request, res: Response) {
        let data = req.body;
        let transaction: Transaction | undefined;
        try {
            transaction = await models.sequelize!.transaction();

            await AssetOption.updateAssetOptionFactory(transaction, data, req.authUser);

            await transaction.commit();

            res.json(await handleDataToReturn({}, req?.authUser?.auth));
        } catch (e: any) {
            if (transaction) {
                await transaction.rollback();
            }
            console.log(e.message);
            handleError(res, e.message)
        }
    },

    async deleteAssetOption(req: Request, res: Response) {
        const {asset_option_id} = req.params;
        let transaction: Transaction | undefined;
        try {
            transaction = await models.sequelize!.transaction();
            await AssetOption.deleteAssetOption(transaction, parseInt(asset_option_id, 10), req.authUser);

            await transaction.commit();

            res.json(await handleDataToReturn({}, req?.authUser?.auth));
        } catch (e: any) {
            if (transaction) {
                await transaction.rollback();
            }
            console.log(e.message);
            handleError(res, e.message)
        }
    }
}