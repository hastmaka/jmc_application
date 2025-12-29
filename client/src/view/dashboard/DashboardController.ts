import {SignalController} from "@/signals/signalController/SignalController.ts";
import {FetchApi} from "@/api/FetchApi.ts";
import {getModel} from "@/api/models";
import type {SignalType} from "@/signals/SignalClass.ts";

export const DashboardController: SignalType<any, any> =
    new SignalController({
        inspectionLoading: false
    },{
        inspectionGetData: async function(this: any) {
            const dateRange = this.formData?.driver?.date_range;
            const employeeId = this.formData?.driver?.employee_id;

            // Require both date range AND employee to fetch
            if (!dateRange?.[0] || !dateRange?.[1] || !employeeId) {
                this.inspectionData = [];
                this.inspectionLoading = false;
                return;
            }

            this.inspectionLoading = true;
            const formatDate = (d: Date | string) => typeof d === 'string'
                ? d
                : d.toISOString().split('T')[0];
            const filters = [
                { fieldName: 'inspection_date', operator: '>=', value: formatDate(dateRange[0]) },
                { fieldName: 'inspection_date', operator: '<=', value: formatDate(dateRange[1]) },
                { fieldName: 'employee_employee_id', operator: '=', value: parseInt(employeeId) }
            ];

            const response = await FetchApi('v1/inspection', 'GET', null, { filters });
            this.inspectionData = response.data.map((ins: any) => new (getModel('inspection'))(ins))
            this.inspectionLoading = false;
        },

        carGetData: async function(this: any) {
            const response = await FetchApi('v1/car');
            if (response?.data?.rows) {
                const CarModel = getModel('car');
                this.carData = CarModel.instantiate(response.data.rows);
            }
            this.carLoading = false;
        },

        getAggregates: function(this: any) {
            const inspections = this.inspectionData || [];
            let totalGasCost = 0;
            let totalMiles = 0;
            let totalGrandTotal = 0;
            let tripCount = 0;

            for (const insp of inspections) {
                const vehicles = insp.get('inspection_vehicles') || [];
                for (const v of vehicles) {
                    const odomStart = parseInt(v.inspection_vehicle_odometer_start) || 0;
                    const odomEnd = parseInt(v.inspection_vehicle_odometer_end) || 0;
                    totalMiles += Math.max(0, odomEnd - odomStart);
                    totalGasCost += (parseInt(v.inspection_vehicle_gas_cost) || 0) / 100;

                    const reservations = v.vehicle_reservations || [];
                    tripCount += reservations.length;
                    for (const r of reservations) {
                        totalGrandTotal += (parseInt(r.reservation_total) || 0) / 100;
                    }
                }
            }

            const totalToCompany = totalGrandTotal - totalGasCost;

            return {
                totalGasCost,
                totalMiles,
                totalGrandTotal,
                totalToCompany,
                tripCount
            };
        },

        getEmployeeOptions: function(this: any) {
            if (!this.employeeData?.length) return [];
            return this.employeeData.map((emp: any) => ({
                value: String(emp.get('employee_id')),
                label: emp.get('employee_full_name') || 'Unknown'
            }));
        },

        getBreakLogData: function(this: any) {
            if (!this.inspectionData?.length) return [];
            return this.inspectionData.flatMap((insp: any, idx: number) => {
                const breaks = insp.get('inspection_breaks') || [];
                return breaks.map((b: any, i: number) => ({
                    id: `${idx}-${i}`,
                    start: b.start || '',
                    end: b.end || '',
                    initial: b.initial || ''
                }));
            });
        },

        getMileageData: function(this: any) {
            if (!this.inspectionData?.length) return [];
            return this.inspectionData.map((insp: any, idx: number) => ({
                id: idx,
                start: insp.get('inspection_odometer_start') || 0,
                end: insp.get('inspection_odometer_end') || 0,
                total: insp.get('inspection_total_miles') || 0
            }));
        },

        getGasLogData: function(this: any) {
            if (!this.inspectionData?.length) return [];
            return this.inspectionData.map((insp: any, idx: number) => ({
                id: idx,
                gallons: insp.get('inspection_gas_gallons') || 0,
                cost: `$${(parseFloat(insp.get('inspection_gas_cost')) || 0).toFixed(2)}`
            }));
        },

        getInspectionTableData: function(this: any) {
            if (!this.inspectionData?.length) return [];
            return this.inspectionData.map((insp: any) => ({
                id: insp.get('inspection_id'),
                inspection_date: insp.get('inspection_date'),
                employee_name: insp.get('employee_name'),
                car_name: insp.get('car_name'),
                inspection_start_time: insp.get('inspection_start_time'),
                inspection_end_time: insp.get('inspection_end_time'),
                inspection_total_miles: insp.get('inspection_total_miles'),
                inspection_gas_cost: insp.get('inspection_gas_cost'),
                inspection_grand_total: insp.get('inspection_grand_total'),
            }));
        }
    }).signal