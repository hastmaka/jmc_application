import EzModel from "../model/EzModel.ts";

export default class CarModel extends EzModel {
    static modelName = "car";

    constructor(data: Record<string, any>) {
        super({
            fields: [{
                name: 'car_id', type: 'int'
            }, {
                name: 'car_color', type: 'string',
            }, {
                name: 'car_capacity', type: 'int',
            }, {
                name: 'car_inspection_date', type: 'string',
            }, {
                name: 'car_insurance_expiration', type: 'string',
            }, {
                name: 'car_make', type: 'string',
            }, {
                name: 'car_model', type: 'string',
            }, {
                name: 'car_note', type: 'string'
            }, {
                name: 'car_plate', type: 'string'
            }, {
                name: 'car_registration_expiration', type: 'string'
            }, {
                name: 'select_status', type: 'object', mapping: 'car_status_option',
                render: (_value: any, row: any) => {
                    // Return object {label, value} for EzSelect
                    if (!row.car_status) return null;
                    return {
                        label: row.car_status_option?.asset_option_name || '',
                        value: row.car_status
                    };
                }
            }, {
                name: 'select_type', type: 'object', mapping: 'car_type_option',
                render: (_value: any, row: any) => {
                    // Return object {label, value} for EzSelect
                    if (!row.car_type) return null;
                    return {
                        label: row.car_type_option?.asset_option_name || '',
                        value: row.car_type
                    };
                }
            }, {
                name: 'car_vin', type: 'string'
            }, {
                name: 'car_year', type: 'string',
            }, {
                name: 'car_name', type: 'string',
            }, {
                name: 'car_odometer_current', type: 'string'
            }, {
                name: 'car_maintenance_interval_miles', type: 'string'
            }, {
                name: 'car_service_next_odometer', type: 'string',
            }, {
                name: 'car_document_image', type: 'array', mapping: 'car_document',
                render: (value) => {
                    if (!value.length) return []
                    return value.filter((doc: any) => doc.document_type === 47);
                }
            }],
            data
        });
    }
}