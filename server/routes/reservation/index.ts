import express from 'express';
const router = express.Router();
import {_reservation} from './_reservation.ts';

router.get('/', _reservation.listReservation);
router.get('/check-availability', _reservation.checkAvailability);
// router.get('/backfill', _reservation.backfillReservation);
router.get('/:reservation_id', _reservation.listReservationByPk);

router.post('/', _reservation.createReservation);
router.put('/', _reservation.updateReservation);
router.delete('/:reservation_id', _reservation.deleteReservation);

export default router;