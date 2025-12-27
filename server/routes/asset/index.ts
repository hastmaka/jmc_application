import express from 'express';
const router = express.Router();
import {_asset} from './_asset.ts';

router.get('/', _asset.listAsset);
router.get('/:asset_name', _asset.listAssetByIdName);
router.get('/return-all/:asset_name', _asset.listAssetByIdNameReturningAll);

router.post('/', _asset.createAsset);
router.put('/:asset_id', _asset.updateAsset);

router.delete('/:asset_id', _asset.deleteAsset);

export default router;