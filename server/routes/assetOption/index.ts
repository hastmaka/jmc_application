import express from 'express';
const router = express.Router();
import {_asset_option} from './_assetOption.ts';

router.get('/', _asset_option.listAssetOption);
router.get('/:asset_id_name', _asset_option.listAssetOptionByIdName);

router.post('/', _asset_option.createAssetOption);
router.put('/', _asset_option.updateAssetOption);

router.delete('/:asset_option_id', _asset_option.deleteAssetOption);

export default router;