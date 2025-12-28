import Ez from "./Ez.ts";
import {Op, Transaction} from "sequelize";
import models from '../db/index.ts';
import {checkRequirement} from "../utils/index.ts";

class InspectionVehicle extends Ez {
    constructor(data: any, user: any = {}) {
        super(data, models.inspection_vehicle, user);
    }

    static async listInspectionVehicle(method: string, options: Record<string, any> = {}) {
        const instance = new InspectionVehicle({});
        return await instance.list(method, options);
    }

    static async listInspectionVehicleByPk(id: number, options: Record<string, any> = {}) {
        const instance = new InspectionVehicle({});
        return await instance.listByPk(id, options);
    }

    static async createInspectionVehicleFactory(transaction: Transaction | undefined, vehicle: any, user: any) {
        checkRequirement(models.inspection_vehicle, vehicle);

        let newVehicle = new InspectionVehicle(vehicle, user);

        return await newVehicle.create(transaction);
    }

    static async bulkCreateInspectionVehicles(transaction: Transaction | undefined, vehicles: any[], user: any) {
        const instance = new InspectionVehicle({}, user);
        return await instance.bulkCreate(transaction, vehicles);
    }

    static async updateInspectionVehicle(transaction: Transaction | undefined, record: Record<string, any>, options: any, user: any) {
        const instance = new InspectionVehicle(record, user);
        return await instance.update(transaction, options);
    }

    static async updateInspectionVehicleFactory(transaction: Transaction | undefined, record: Record<string, any>, user: any) {
        let options = {
            where: {
                inspection_vehicle_id: {
                    [Op.eq]: record.inspection_vehicle_id
                }
            }
        };

        return await InspectionVehicle.updateInspectionVehicle(transaction, record, options, user);
    }

    static async deleteInspectionVehicle(transaction: Transaction | undefined, inspection_vehicle_id: number, user: any) {
        const instance = new InspectionVehicle({}, user);
        return await instance.delete(transaction, inspection_vehicle_id);
    }

    static async deleteByInspectionId(transaction: Transaction | undefined, inspection_id: number, user: any) {
        const instance = new InspectionVehicle({}, user);
        return await instance.deleteGeneric(transaction, {
            inspection_inspection_id: { [Op.eq]: inspection_id }
        });
    }
}

export default InspectionVehicle;
