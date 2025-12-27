import express from 'express';
const router = express.Router();
import {_document} from './_document.ts';

router.get('/', _document.listDocument)
router.get('/:document_id', _document.listDocumentByPk)

router.post('/', _document.createDocument)
router.put('/', _document.updateDocument)

router.delete('/:document_id', _document.deleteDocument)

export default router;
