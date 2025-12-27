import Ez from "./Ez.ts";
import {Op, Transaction} from "sequelize";
import models from '../db/index.ts';

class Notification extends Ez {
    constructor(data: any, user: any = {}) {
        super(data,  models.notification, user);
    }

    static async listNotification(method: string, options: Record<string, any> = {}) {
        const instance = new Notification({});
        return await instance.list(method, options);
    }

    static async listNotificationByPk(id: number, options: Record<string, any> = {}) {
        const instance = new Notification({});
        return await instance.listByPk(id, options);
    }

    static async createNotificationFactory(transaction: Transaction | undefined, notification: any, user: any) {
        let newNotification = new Notification(notification, user);
        return await newNotification.create(transaction);
    }

    static async updateNotification(transaction: Transaction | undefined, record: Record<string, any>, options: any, user: any) {
        const instance = new Notification(record, user);
        return await instance.update(transaction, options);
    }

    static async updateNotificationFactory(transaction: Transaction | undefined, record: Record<string, any>, user: any) {
        let options = {
            where: {
                notification_id: {
                    [Op.eq]: record.notification_id
                }
            }
        };

        return await Notification.updateNotification(transaction, record, options, user);
    }

    static async deleteNotification(transaction: Transaction | undefined, notification_id: number, user: any) {
        const instance = new Notification({}, user);
        return await instance.delete(transaction, notification_id);
    }
}

export default Notification;