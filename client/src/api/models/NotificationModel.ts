import EzModel from "../model/EzModel.ts";

export default class NotificationModel extends EzModel {
    static modelName = "notification";

    constructor(data: Record<string, any>) {
        super({
            fields: [{
                name: "notification_id", type: "int"
            }, {
                name: "agency_agency_id", type: "int"
            }, {
                name: "caregiver_caregiver_id", type: "int"
            }, {
                name: "client_client_id", type: "int"
            }, {
                name: "employee_employee_id", type: "int"
            }, {
                name: "user_user_id", type: "int"
            }, {
                name: 'notification_info', type: 'string'
            }, {
                name: 'notification_message', type: 'string'
            }, {
                name: 'notification_read', type: 'int'
            }, {
                name: 'notification_result', type: 'string'
            }, {
                name: 'notification_title', type: 'string'
            }, {
                name: 'notification_type', type: 'string'
            }],
            data, suffix: 'notification', requiresPrimary: false
        });
    }
}