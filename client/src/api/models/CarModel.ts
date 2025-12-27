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
                name: 'car_status', type: 'string', mapping: 'car_status_option',
                render: (value) => {
                    return value?.asset_option_name || null
                }
            }, {
                name: 'car_type', type: 'string', mapping: 'car_type_option',
                render: (value) => {
                    return value?.asset_option_name || null
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