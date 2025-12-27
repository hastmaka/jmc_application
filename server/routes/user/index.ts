import express from 'express';
const router = express.Router();
import {_user} from './_user.ts';

router.post('/', _user.login);
router.put('/', _user.updateUser);
router.put('/preference', _user.updateUserPreference);

export default router;