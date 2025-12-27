import {SignalGridClass} from "@/signals/signalGridClass/SignalGridClass.ts";
import {getModel} from "@/api/models";
import type {Filter, GridStore} from "@/types";
import {ClientController} from "@/view/client/ClientController.ts";

export const ClientGridController = new SignalGridClass({
    store: {
        model: {
            main: getModel('client'),
        },
        filterFields: {} as Record<string, Filter>,
        limit: 20,
        api: {
            read: 'v1/client',
            create: 'client',
            update: 'client',
            delete: 'client'
        }
    } as GridStore,
}, {
    onDoubleClick(row: any){
        ClientController.setParentTabsList(row).then()
    }
}).signal