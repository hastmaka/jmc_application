import EzModel from "../model/EzModel.ts";

export default class InspectionVehicleModel extends EzModel {
    static modelName = "inspection_vehicle";

    constructor(data: Record<string, any>) {
        super({
            fields: [{
                name: 'inspection_vehicle_id', type: 'int'
            }, {
                name: 'inspection_inspection_id', type: 'int'
            }, {
                name: 'car_car_id', type: 'string', mapping: 'vehicle_car',
                render: (value: any) => {
                    return value?.car_name || null
                }
            }, {
                name: 'inspection_vehicle_odometer_start', type: 'string'
            }, {
                name: 'inspection_vehicle_odometer_end', type: 'string'
            }, {
                name: 'inspection_vehicle_gas_gallons', type: 'string'
            }, {
                name: 'inspection_vehicle_gas_cost', type: 'money'
            }, {
                name: 'inspection_vehicle_reservation_ids', type: 'array'
            }, {
                name: 'car_name', type: 'string', mapping: 'vehicle_car',
                render: (value) => {
                    return value?.car_name || null
                }
            }, {
                name: 'car_plate', type: 'string', mapping: 'vehicle_car',
                render: (value) => {
                    return value?.car_plate || null
                }
            }, {
                name: 'car_color', type: 'string', mapping: 'vehicle_car',
                render: (value) => {
                    return value?.car_color || null
                }
            }],
            data
        });
    }
}
