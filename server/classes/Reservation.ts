import Ez from "./Ez.ts";
import {Op, Transaction} from "sequelize";
import models from '../db/index.ts';
import {checkRequirement} from "../utils/index.ts";

class Reservation extends Ez {
    constructor(data: any, user: any = {}) {
        super(data,  models.reservation, user);
    }

    static async listReservation(method: string, options: Record<string, any> = {}) {
        const instance = new Reservation({});
        return await instance.list(method, options);
    }

    static async listReservationByPk(id: number, options: Record<string, any> = {}) {
        const instance = new Reservation({});
        return await instance.listByPk(id, options);
    }

    static async createReservationFactory(transaction: Transaction | undefined, reservation: any, user: any) {
        checkRequirement(models.reservation, reservation);

        let newReservation = new Reservation(reservation, user);

        return await newReservation.create(transaction);
    }

    static async updateReservation(transaction: Transaction | undefined, record: Record<string, any>, options: any, user: any) {
        const instance = new Reservation(record, user);
        return await instance.update(transaction, options);
    }

    static async updateReservationFactory(transaction: Transaction | undefined, record: Record<string, any>, user: any) {
        let options = {
            where: {
                reservation_id: {
                    [Op.eq]: record.reservation_id
                }
            }
        };

        return await Reservation.updateReservation(transaction, record, options, user);
    }

    static async deleteReservation(transaction: Transaction | undefined, reservation_id: number, user: any) {
        const instance = new Reservation({}, user);
        return await instance.delete(transaction, reservation_id);
    }
}

export default Reservation;