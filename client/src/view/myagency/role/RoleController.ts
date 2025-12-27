import {SignalGridClass} from "@/signals/signalGridClass/SignalGridClass.ts";
import {getModel} from "@/api/models";
import type {Filter, GridStore} from "@/types";

export const RoleController = new SignalGridClass({
    store: {
        model: {
            main: getModel('role'),
        },
        filterFields: {} as Record<string, Filter>,
        limit: 20,
        api: {
            read: 'v1/role',
            create: 'client',
            update: 'client',
            delete: 'client'
        }
    } as GridStore,
},{

}).signal