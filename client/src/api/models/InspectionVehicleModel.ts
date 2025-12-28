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
                name: 'car_car_id', type: 'int'
            }, {
                name: 'inspection_vehicle_odometer_start', type: 'int'
            }, {
                name: 'inspection_vehicle_odometer_end', type: 'int'
            }, {
                name: 'inspection_vehicle_gas_gallons', type: 'money'
            }, {
                name: 'inspection_vehicle_gas_cost', type: 'money'
            }, {
                name: 'inspection_vehicle_reservation_ids', type: 'array'
            }, {
                name: 'car_name', type: 'string', mapping: 'vehicle_car',
                render: (value) => {
                    return value?.car_name || null
                }
            }],
            data
        });
    }
}
