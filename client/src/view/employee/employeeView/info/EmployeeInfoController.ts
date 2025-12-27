import type {SignalType} from "@/signals/SignalClass.ts";
import {SignalController} from "@/signals/signalController/SignalController.ts";
import {FetchApi} from "@/api/FetchApi.ts";
import {getModel} from "@/api/models";

export const EmployeeInfoController: SignalType<any, any> =
    new SignalController({
        editMap: {}
    },{
        employeePersonalGetData: async function(this: any): Promise<void> {
            const response = await FetchApi(`v1/employee/${this?.recordId}`)
            this.employeePersonalData = new (getModel('employee'))(response.data)
            this.employeePersonalLoading = false
        },
        employeeDetailGetData: async function(this: any): Promise<void> {
            const response = await FetchApi(`v1/employee/${this?.recordId}`)
            this.employeeDetailData = new (getModel('employee'))(response.data)
            this.employeeDetailLoading = false
        },
        employeePhoneGetData: async function(this: any): Promise<void> {
            const response = await FetchApi(`v1/employee/${this?.recordId}`)
            this.employeePhoneData = new (getModel('employee'))(response.data)
            this.employeePhoneLoading = false
        },
        employeeAddressGetData: async function(this: any): Promise<void> {
            const response = await FetchApi(`v1/employee/${this?.recordId}`)
            this.employeeAddressData = new (getModel('employee'))(response.data)
            this.employeeAddressLoading = false
        },
        employeeClientGetData: async function(this: any): Promise<void> {
            const response = await FetchApi(`v1/employee/${this?.recordId}`)
            this.employeeClientData = new (getModel('employee'))(response.data)
            this.employeeClientLoading = false
        },
        employeeDocumentStatusGetData: async function(this: any): Promise<void> {
            const response = await FetchApi(`v1/employee/${this?.recordId}`)
            this.employeeDocumentStatusData = new (getModel('employee'))(response.data)
            this.employeeDocumentStatusLoading = false
        },
    }).signal