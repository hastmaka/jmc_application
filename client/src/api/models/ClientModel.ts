import EzModel from "../model/EzModel.ts";

export default class ClientModel extends EzModel {
    static modelName = "client";

    constructor(data: Record<string, any>) {
        super({
            fields: [{
                name: 'client_id', type: 'int'
            }, {
                name: 'client_sex', type: 'string'
            }, {
                name: 'client_first_name', type: 'string',
            }, {
                name: 'client_middle_name', type: 'string',
            }, {
                name: 'client_last_name', type: 'string',
            }, {
                name: 'client_full_name', type: 'string',
            }, {
                name: 'client_pfp_url', type: 'string',
            }, {
                name: 'client_start_date', type: 'string',
            }, {
                name: 'client_end_date', type: 'string',
            }, {
                name: 'client_dob', type: 'date',
            },{
                name: 'client_birth_place', type: 'string',
            },{
                name: 'client_chart_id', type: 'string',
            }, {
                name: 'client_case_number', type: 'string',
            }, {
                name: 'client_eqhealth_id', type: 'string',
            }, {
                name: 'phone_number', type: 'string',
            },{
                name: 'phone_id', type: 'int',
            }, {
                name: 'client_language', type: 'array',
            }, {
                name: 'client_primary_language', type: 'string', mapping: 'client_language',
                render: function(data) {
                    return data.length ? data[0] : 'Not Set'
                }
            }, {
                name: 'client_primary_insurance', type: 'string',
            },{
                name: 'client_insurance_number', type: 'string', mapping: 'client_insurances',
                render: function(data: any) {
                    return data.length ? data[0].client_insurance_number : 'Not Set'
                }
            }, {
                name: 'client_primary_address', type: 'string',
            }, {
                name: 'client_primary_caregiver', type: 'string',
            }, {
                name: 'created_at', type: 'string',
            }, {
                name: 'client_primary_insurance_effective_start_date', type: 'string',
            }, {
                name: 'client_primary_insurance_effective_end_date', type: 'string',
            }, {
                name: 'client_primary_phone', type: 'string',
            }],
            data
        });
    }
}