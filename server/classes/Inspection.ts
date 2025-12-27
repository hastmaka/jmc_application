import Ez from "./Ez.ts";
import {Op, Transaction} from "sequelize";
import models from '../db/index.ts';
import {checkRequirement} from "../utils/index.ts";

class Inspection extends Ez {
    constructor(data: any, user: any = {}) {
        super(data, models.inspection, user);
    }

    static async listInspection(method: string, options: Record<string, any> = {}) {
        const instance = new Inspection({});
        return await instance.list(method, options);
    }

    static async listInspectionByPk(id: number, options: Record<string, any> = {}) {
        const instance = new Inspection({});
        return await instance.listByPk(id, options);
    }

    static async createInspectionFactory(transaction: Transaction | undefined, inspection: any, user: any) {
        checkRequirement(models.inspection, inspection);

        let newInspection = new Inspection(inspection, user);

        return await newInspection.create(transaction);
    }

    static async updateInspection(transaction: Transaction | undefined, record: Record<string, any>, options: any, user: any) {
        const instance = new Inspection(record, user);
        return await instance.update(transaction, options);
    }

    static async updateInspectionFactory(transaction: Transaction | undefined, record: Record<string, any>, user: any) {
        let options = {
            where: {
                inspection_id: {
                    [Op.eq]: record.inspection_id
                }
            }
        };

        return await Inspection.updateInspection(transaction, record, options, user);
    }

    static async deleteInspection(transaction: Transaction | undefined, inspection_id: number, user: any) {
        const instance = new Inspection({}, user);
        return await instance.delete(transaction, inspection_id);
    }
}

export default Inspection;
