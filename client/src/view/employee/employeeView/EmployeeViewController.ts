import {SignalController} from "@/signals/signalController/SignalController.ts";
import type {SignalType} from "@/signals/SignalClass.ts";

export const EmployeeViewController: SignalType<any, any> = new SignalController({
    employeeId: '',
    activeTab: {},
},{
    setActiveTab: function (this: any, employeeId: string, tab=null)  {
        this.employeeId = employeeId
        const hasValue = this.activeTab[employeeId]
        this.activeTab = {
            ...this.activeTab,
            [employeeId]: tab ? tab : hasValue || 'employee-info'
        }
    },
}).signal