import {SignalGridClass} from "@/signals/signalGridClass/SignalGridClass.ts";
import {getModel} from "@/api/models";
import type {Filter, GridStore} from "@/types";
import {EmployeeController} from "./EmployeeController.ts";
import type {SignalType} from "@/signals/SignalClass.ts";

export const EmployeeGridController: SignalType<any, any> =
    new SignalGridClass({
        store: {
            model: {
                main: getModel('employee'),
            },
            filterFields: {} as Record<string, Filter>,
            limit: 20,
            api: {
                read: 'v1/employee',
                create: 'employee',
                update: 'employee',
                delete: 'employee'
            }
        } as GridStore,
    }, {
        onDoubleClick(row: any){
            EmployeeController.setParentTabsList(row).then()
        }
    }).signal