import {SignalController} from "@/signals/signalController/SignalController.ts";
import type {SignalType} from "@/signals/SignalClass.ts";

export const ClientViewController: SignalType<any, any> = new SignalController({
    clientId: '',
    activeTab: {},
},{
    setActiveTab: function (this: any, clientId: string, tab=null)  {
        this.clientId = clientId
        const hasValue = this.activeTab[clientId]
        this.activeTab = {
            ...this.activeTab,
            [clientId]: tab ? tab : hasValue || 'client-info'
            // [clientId]: tab ? tab : hasValue || 'client-approval'
        }
    },
}).signal


// 'client-info'
// 'client-document'
// 'client-skill'
// 'client-interventions'
// 'client-competences'
// 'client-approval'
// 'client-healthcare-provider'
// 'client-diagnosis'
// 'client-medication'
// 'client-preference'
// 'client-abc'
// 'client-restriction'
// 'client-scheduling-limit'
// 'client-personal-setting'