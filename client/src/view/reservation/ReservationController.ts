import {SignalGridClass} from "@/signals/signalGridClass/SignalGridClass.ts";
import {getModel} from "@/api/models";
import type {Filter, GridStore} from "@/types";
import type {SignalType} from "@/signals/SignalClass.ts";

export const ReservationController: SignalType<any, any> =
    new SignalGridClass({
        store: {
            model: {
                main: getModel('reservation'),
            },
            filterFields: {} as Record<string, Filter>,
            limit: 20,
            api: {
                read: `v1/reservation`,
                create: 'client',
                update: 'client',
                delete: 'client'
            },
            filterBy: [
                'reservation_passenger_name',
                'reservation_email',
                'reservation_phone',
                'reservation_charter_order'
            ]
        } as GridStore,
    },{
        _handleInput: function (this: any, name: string, value: any) {
            this[name] = value
        }
    }).signal