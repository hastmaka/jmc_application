import express from 'express';
const router = express.Router();
import {_notification} from './_notification.ts'

router.get('/', _notification.list);

export default router;