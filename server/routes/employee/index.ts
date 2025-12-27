import express from 'express';
const router = express.Router();
import {_employee} from './_employee.ts';

router.get('/', _employee.listEmployee);
router.get('/asset', _employee.listEmployeeAsset);
router.get('/:employee_id', _employee.listEmployeeById);

router.post('/', _employee.createEmployee);
router.put('/', _employee.updateEmployee);
router.delete('/:employee_id', _employee.deleteEmployeeById);

export default router;