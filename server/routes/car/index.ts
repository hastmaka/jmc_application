import express from 'express';
const router = express.Router();
import {_car} from './_car.ts';

router.get('/', _car.listCar)
router.get('/asset', _car.listCarAsset)
router.get('/:car_id', _car.listCarByPk)

router.post('/', _car.createCar)
router.put('/', _car.updateCar)

router.delete('/:car_id', _car.deleteCar)

export default router;