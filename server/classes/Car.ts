import Ez from "./Ez.ts";
import {Op, Transaction} from "sequelize";
import models from '../db/index.ts';
import {checkRequirement} from "../utils/index.ts";

class Car extends Ez {
    constructor(data: any, user: any = {}) {
        super(data,  models.car, user);
    }

    static async listCar(method: string, options: Record<string, any> = {}) {
        const instance = new Car({});
        return await instance.list(method, options);
    }

    static async listCarByPk(id: number, options: Record<string, any> = {}) {
        const instance = new Car({});
        return await instance.listByPk(id, options);
    }

    static async createCarFactory(transaction: Transaction | undefined, car: any, user: any) {
        checkRequirement(models.car, car);

        let newCar = new Car(car, user);

        return await newCar.create(transaction);
    }

    static async updateCar(transaction: Transaction | undefined, record: Record<string, any>, options: any, user: any) {
        const instance = new Car(record, user);
        return await instance.update(transaction, options);
    }

    static async updateCarFactory(transaction: Transaction | undefined, record: Record<string, any>, user: any) {
        let options = {
            where: {
                car_id: {
                    [Op.eq]: record.car_id
                }
            }
        };

        return await Car.updateCar(transaction, record, options, user);
    }

    static async deleteCar(transaction: Transaction | undefined, car_id: number, user: any) {
        const instance = new Car({}, user);
        return await instance.delete(transaction, car_id);
    }
}

export default Car;