import {SignalController} from "@/signals/signalController/SignalController.ts";
import type {SignalType} from "@/signals/SignalClass.ts";
import {FetchApi} from "@/api/FetchApi.ts";
import {DashboardController} from "@/view/dashboard/DashboardController.ts";
import {getModel} from "@/api/models";

export const DashboardModalController: SignalType<any, any> =
    new SignalController({
        breaks: [] as Array<{start: string, end: string, initial: string}>,
        currentInspectionId: null as number | null,
        editMap: {
            inspection: async function(fields: string[], id: number) {
                const response = await FetchApi(`v1/inspection/${id}`);
                const inspection = new (getModel('inspection'))(response.data);
                DashboardModalController.fields = fields;
                DashboardModalController.populateForm('inspection', fields, inspection);
                DashboardModalController.breaks = response.data?.inspection_breaks || [];
            }
        }
    }, {
        setCurrentInspectionId: function(this: any, inspectionId?: number) {
            this.currentInspectionId = inspectionId || null;
        },

        clearModalState: function(this: any) {
            this.breaks = [];
            this.currentInspectionId = null;
            this.resetState();
        },

        handleSaveInspection: async function(this: any, modalId: string) {
            const inspection = {
                ...this.formData.inspection,
                inspection_breaks: this.breaks.length ? this.breaks : null
            };

            const response = await FetchApi(
                'v1/inspection',
                'POST',
                inspection
            );

            if (response.success) {
                await DashboardController.inspectionGetData();
                this.breaks = [];
                this.resetState();
                window.closeModal(modalId);
            } else {
                throw response;
            }
        },

        handleEditInspection: async function(this: any, modalId: string) {
            const payload = {
                ...this.dirtyFields,
                inspection_breaks: this.breaks.length ? this.breaks : null
            };

            const response = await FetchApi(
                'v1/inspection',
                'PUT',
                payload
            );

            if (response.success) {
                await DashboardController.inspectionGetData();
                this.breaks = [];
                this.resetState();
                window.closeModal(modalId);
            } else {
                throw response;
            }
        },

        handleDeleteInspection: async function(this: any, inspectionId: number, modalId: string) {
            const response = await FetchApi(`v1/inspection/${inspectionId}`, 'DELETE');

            if (response.success) {
                await DashboardController.inspectionGetData();
                this.breaks = [];
                this.resetState();
                window.closeModal(modalId);
            } else {
                throw response;
            }
        },

        addBreak: function(this: any) {
            this.breaks = [...this.breaks, {start: '', end: '', initial: ''}];
        },

        updateBreak: function(this: any, index: number, field: string, value: string) {
            const newBreaks = [...this.breaks];
            newBreaks[index] = {...newBreaks[index], [field]: value};
            this.breaks = newBreaks;
        },

        removeBreak: function(this: any, index: number) {
            this.breaks = this.breaks.filter((_: any, i: number) => i !== index);
        },

        calculateTotals: function(this: any) {
            const form = this.formData.inspection || {};
            const odometerStart = parseInt(form.inspection_odometer_start) || 0;
            const odometerEnd = parseInt(form.inspection_odometer_end) || 0;
            const totalMiles = odometerEnd - odometerStart;

            const grandTotal = parseFloat(form.inspection_grand_total) || 0;
            const gasDeduction = parseFloat(form.inspection_gas_cost) || 0;
            const subTotal = grandTotal - gasDeduction;
            const driverAtm = parseFloat(form.inspection_driver_atm) || 0;
            const totalToCompany = subTotal - driverAtm;

            return {
                totalMiles: totalMiles > 0 ? totalMiles : 0,
                subTotal: subTotal.toFixed(2),
                totalToCompany: totalToCompany.toFixed(2)
            };
        }
    }).signal