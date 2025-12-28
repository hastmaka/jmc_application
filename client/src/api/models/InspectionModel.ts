import EzModel from "../model/EzModel.ts";

export default class InspectionModel extends EzModel {
    static modelName = "inspection";

    constructor(data: Record<string, any>) {
        super({
            fields: [{
                name: 'inspection_id', type: 'int'
            }, {
                name: 'employee_employee_id', type: 'int'
            }, {
                name: 'inspection_date', type: 'string'
            }, {
                name: 'inspection_start_time', type: 'string'
            }, {
                name: 'inspection_end_time', type: 'string'
            }, {
                name: 'inspection_breaks', type: 'array'
            }, {
                name: 'inspection_notes', type: 'string'
            }, {
                name: 'inspection_signature', type: 'string'
            }, {
                name: 'employee_name', type: 'string', mapping: 'inspection_employee',
                render: (value) => {
                    return value?.employee_full_name || null
                }
            }, {
                name: 'inspection_vehicles', type: 'array'
            }],
            data
        });
    }
}
