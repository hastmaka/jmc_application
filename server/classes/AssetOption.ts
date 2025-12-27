import Ez from "./Ez.ts";
import {Op, Transaction} from "sequelize";
import models from '../db/index.ts'
import Asset from "./Asset.ts";

class AssetOption extends Ez {
    constructor(data: any, user: any = {}) {
        super(data,  models.asset_option, user);
    }

    static async listAssetOption(method: string, options: Record<string, any> = {}) {
        const instance = new AssetOption({});
        return await instance.list(method, options);
    }

    static async listAssetOptionByPk(id: number, options: Record<string, any> = {}) {
        const instance = new AssetOption({});
        return await instance.listByPk(id, options);
    }

    static async createAssetOptionFactory(transaction: Transaction | undefined, asset_option: any, user: any) {
        // If asset_name is provided instead of asset_asset_id, resolve it
        if (!asset_option.asset_asset_id && asset_option.asset_name) {
            const asset = await Asset.listAsset('findOne', {
                where: { asset_name: { [Op.eq]: asset_option.asset_name } }
            });
            if (!asset) {
                throw new Error(`Asset with name '${asset_option.asset_name}' not found`);
            }
            asset_option.asset_asset_id = asset.asset_id;
        }

        checkAssetOptionRequirement(asset_option);

        let newAssetOption = new AssetOption(asset_option, user);

        return await newAssetOption.create(transaction);
    }

    static async updateAssetOption(transaction: Transaction | undefined, record: Record<string, any>, options: any, user: any) {
        const instance = new AssetOption(record, user);
        return await instance.update(transaction, options);
    }

    static async updateAssetOptionFactory(transaction: Transaction | undefined, record: Record<string, any>, user: any) {
        let options = {
            where: {
                asset_option_id: {
                    [Op.eq]: record.asset_option_id
                }
            }
        };

        return await AssetOption.updateAssetOption(transaction, record, options, user);
    }

    static async deleteAssetOption(transaction: Transaction | undefined, asset_option_id: number, user: any) {
        const instance = new AssetOption({}, user);
        return await instance.delete(transaction, asset_option_id);
    }
}

function checkAssetOptionRequirement(asset_option: any) {
    if (!asset_option.asset_option_name) {
        throw new Error('Asset Option Name is required');
    }
    if (!asset_option.asset_asset_id) {
        throw new Error('Asset ID is required');
    }
}

export default AssetOption;