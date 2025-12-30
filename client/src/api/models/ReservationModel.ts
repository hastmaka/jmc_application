import EzModel from "../model/EzModel.ts";

export default class ReservationModel extends EzModel {
    static modelName = "reservation";
	constructor(data: Record<string, any>) {
        super({
            fields: [
                { name: 'reservation_id', type: 'int' },
                { name: 'reservation_passenger_name', type: 'string' },
                {
                    name: 'select_car', type: 'object', mapping: 'reservation_car',
                    render: (_value: any, row: any) => {
                        // Return object {label, value} for EzSelect
                        if (!row.car_car_id) return null;
                        return {
                            label: row.reservation_car?.car_plate || '',
                            value: row.car_car_id
                        };
                    }
                },
                {
                    name: 'car_color', type: 'string', mapping: 'reservation_car',
                    render: (value) => value?.car_color || null
                },
                {
                    name: 'reservation_car', type: 'string',
                    render: (value) => value?.car_plate || null
                },
                {
                    name: 'select_source', type: 'object', mapping: 'reservation_source_option',
                    render: (_value: any, row: any) => {
                        // Return object {label, value} for EzSelect
                        if (!row.reservation_source) return null;
                        return {
                            label: row.reservation_source_option?.asset_option_name || '',
                            value: row.reservation_source
                        };
                    }
                },
                { name: 'reservation_email', type: 'string' },
                { name: 'reservation_phone', type: 'string' },
                { name: 'reservation_date', type: 'string'},
                { name: 'reservation_time', type: 'string'},
                {
                    name: 'select_airline', type: 'object',
                    render: (_value: any, row: any) => {
                        // Return object {label, value} for EzSelect (local data select)
                        if (!row.reservation_airline) return null;
                        return {
                            label: row.reservation_airline,
                            value: row.reservation_airline
                        };
                    }
                },
                { name: 'reservation_service_type', type: 'string'},
                { name: 'reservation_fly_info', type: 'string'},
                { name: 'reservation_pickup_location', type: 'string'},
                {
                    name: 'reservation_pickup_location_name', type: 'string', mapping: 'reservation_pickup_location',
                    render: (value, row) => {
                        if (row.reservation_fly_info) return `${row.reservation_airline} ${row.reservation_fly_info}`
                        return value
                    }
                },
                { name: 'reservation_dropoff_location', type: 'string' },
                {
                    name: 'reservation_hour', type: 'string',
                    render: (value) => {
                        return parseFloat(value).toString()
                    }
                },
                { name: 'reservation_passengers', type: 'string' },

                { name: 'reservation_base', type: 'money' },
                { name: 'reservation_m_and_g', type: 'money' },
                { name: 'reservation_fuel', type: 'money' },
                { name: 'reservation_airport_fee', type: 'money' },
                { name: 'reservation_total', type: 'money' },
                { name: 'reservation_real_value', type: 'money' },

                { name: 'reservation_tax', type: 'string' },
                { name: 'reservation_tips', type: 'string' },
                {
                    name: 'reservation_status', type: 'string', mapping: 'reservation_status_option',
                    render: (value) => value?.asset_option_name || null
                },
                {
                    name: 'select_service_type', type: 'object', mapping: 'reservation_service_type_option',
                    render: (_value: any, row: any) => {
                        // Return object {label, value} for EzSelect
                        if (!row.reservation_service_type) return null;
                        return {
                            label: row.reservation_service_type_option?.asset_option_name || '',
                            value: row.reservation_service_type
                        };
                    }
                },
                { name: 'reservation_datetime', type: 'string' },
                { name: 'reservation_sign', type: 'string' },
                { name: 'reservation_stop', type: 'string' },
                { name: 'reservation_special_instructions', type: 'string' },
                { name: 'reservation_itinerary', type: 'json'},
                { name: 'reservation_charter_order', type: 'string'},
                { name: 'created_at', type: 'string'},
            ],
            data,
        });
	}
}