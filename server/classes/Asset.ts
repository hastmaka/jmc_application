import Ez from "./Ez.ts";
import {Op, Transaction} from "sequelize";
import models from '../db/index.ts';

class Asset extends Ez {
    constructor(data: any, user: any = {}) {
        super(data,  models.asset, user);
    }

    static async listAsset(method: string, options: Record<string, any> = {}) {
        const instance = new Asset({});
        return await instance.list(method, options);
    }

    static async listAssetByPk(id: number, options: Record<string, any> = {}) {
        const instance = new Asset({});
        return await instance.listByPk(id, options);
    }

    static async createAssetFactory(transaction: Transaction | undefined, asset: any, user: any) {
        checkAssetRequirement(asset);

        let newAsset = new Asset(asset, user);

        return await newAsset.create(transaction);
    }

    static async updateAsset(transaction: Transaction | undefined, record: Record<string, any>, options: any, user: any) {
        const instance = new Asset(record, user);
        return await instance.update(transaction, options);
    }

    static async updateAssetFactory(transaction: Transaction | undefined, record: Record<string, any>, user: any) {
        let options = {
            where: {
                asset_id: {
                    [Op.eq]: record.asset_id
                }
            }
        };

        return await Asset.updateAsset(transaction, record, options, user);
    }

    static async deleteAsset(transaction: Transaction | undefined, asset_id: number, user: any) {
        const instance = new Asset({}, user);
        return await instance.delete(transaction, asset_id);
    }
}

function checkAssetRequirement(asset: any) {
    if (!asset.asset_name) {
        throw new Error('Asset Name is required');
    }
}

export default Asset;