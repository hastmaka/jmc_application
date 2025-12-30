import EzModel from "../model/EzModel.ts";

export default class EmployeeModel extends EzModel {
    static modelName = "employee";
    constructor(data: Record<string, any>) {
        super({
            fields: [{
                name: 'employee_id', type: 'int'
            }, {
                name: 'employee_first_name', type: 'string'
            }, {
                name: 'employee_middle_name', type: 'string'
            }, {
                name: 'employee_last_name', type: 'string'
            }, {
                name: 'employee_full_name', type: 'string'
            }, {
                name: 'employee_email', type: 'string'
            }, {
                name: 'employee_certification', type: 'string'
            }, {
                name: 'employee_driver_license', type: 'string'
            }, {
                name: 'employee_note', type: 'string'
            }, {
                name: 'employee_hire_date', type: 'string'
            }, {
                name: 'employee_termination_date', type: 'string'
            }, {
                name: 'select_role', type: 'object', mapping: 'employee_role_option',
                render: (_value: any, row: any) => {
                    // Return object {label, value} for EzSelect
                    if (!row.employee_role_option) return {label: '', value: ''};
                    return {
                        label: row.employee_role_option?.asset_option_name || '',
                        value: row.employee_role
                    };
                }
            },
            //     {
            //     name: 'phone_phone_id', type: 'int'
            // }, {
            //     name: 'address_address_id', type: 'int'
            // },
                {
                    name: 'employee_phone', type: 'string'
                },
                {
                    name: 'employee_address', type: 'string'
                },
                {
                name: 'user_user_id', type: 'int'
            }, {
                name: 'employee_document', type: 'array'
            }, {
                name: 'created_at', type: 'date'
            }, {
                name: 'updated_at', type: 'date'
            }, {
                name: 'deleted_at', type: 'date'
            }],
            data
        });
    }
}