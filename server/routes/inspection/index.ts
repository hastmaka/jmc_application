import express from 'express';
const router = express.Router();
import {_inspection} from './_inspection.ts';

router.get('/', _inspection.listInspection)
router.get('/:inspection_id', _inspection.listInspectionByPk)

router.post('/', _inspection.createInspection)
router.put('/', _inspection.updateInspection)

router.delete('/:inspection_id', _inspection.deleteInspection)

export default router;
