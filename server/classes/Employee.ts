import Ez from "./Ez.ts";
import {Op, Transaction} from "sequelize";
import models from '../db/index.ts';
import {checkRequirement} from "../utils/index.ts";

class Employee extends Ez {
    constructor(data: any, user: any = {}) {
        super(data,  models.employee, user);
    }

    static async listEmployee(method: string, options: Record<string, any> = {}) {
        const instance = new Employee({});
        return await instance.list(method, options);
    }

    static async listEmployeeByPk(id: number, options: Record<string, any> = {}) {
        const instance = new Employee({});
        return await instance.listByPk(id, options);
    }

    static async createEmployeeFactory(transaction: Transaction | undefined, employee: any, user: any) {
        checkRequirement(models.employee, employee);

        let newEmployee = new Employee(employee, user);

        return await newEmployee.create(transaction);
    }

    static async updateEmployee(transaction: Transaction | undefined, employee: Record<string, any>, options: any, user: any) {
        const instance = new Employee(employee, user);
        return await instance.update(transaction, options);
    }

    static async updateEmployeeFactory(transaction: Transaction | undefined, employee: Record<string, any>, user: any) {
        let options = {
            where: {
                employee_id: {
                    [Op.eq]: employee.employee_id
                }
            }
        };

        return await Employee.updateEmployee(transaction, employee, options, user);
    }

    static async deleteEmployee(transaction: Transaction | undefined, employee_id: number, user: any) {
        const instance = new Employee({}, user);
        return await instance.delete(transaction, employee_id);
    }
}

export default Employee;