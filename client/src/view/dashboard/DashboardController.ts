import {SignalController} from "@/signals/signalController/SignalController.ts";
import {FetchApi} from "@/api/FetchApi.ts";
import {getModel} from "@/api/models";
import type {SignalType} from "@/signals/SignalClass.ts";
import dayjs from "dayjs";

export const DashboardController: SignalType<any, any> =
    new SignalController({
        inspectionLoading: false,
        fuelLoading: false,
        milesLoading: false,
    },{
        inspectionGetData: async function(this: any) {
            const dateRange = this.formData?.driver?.date_range;
            const employeeId = this.formData?.driver?.employee_id?.value;

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
        },

        // ═══════════════════════════════════════════════════════════════════
        // FUEL SECTION
        // ═══════════════════════════════════════════════════════════════════

        fuelGetData: async function(this: any) {
            const dateRange = this.formData?.fuel?.date_range;
            const carId = this.formData?.fuel?.select_car?.value;

            // Require both date range AND car to fetch
            if (!dateRange?.[0] || !dateRange?.[1] || !carId) {
                this.fuelData = [];
                this.fuelLoading = false;
                return;
            }

            this.fuelLoading = true;
            const formatDate = (d: Date | string) => typeof d === 'string'
                ? d
                : d.toISOString().split('T')[0];

            const filters = [
                { fieldName: 'inspection_date', operator: '>=', value: formatDate(dateRange[0]) },
                { fieldName: 'inspection_date', operator: '<=', value: formatDate(dateRange[1]) },
            ];

            const response = await FetchApi('v1/inspection', 'GET', null, { filters });

            // Filter vehicles by car_id and store
            const inspections = response.data || [];
            const carIdNum = parseInt(carId);
            this.fuelData = inspections.map((ins: any) => {
                const vehicles = (ins.inspection_vehicles || []).filter(
                    (v: any) => v.car_car_id === carIdNum
                );
                return { ...ins, inspection_vehicles: vehicles };
            }).filter((ins: any) => ins.inspection_vehicles.length > 0);

            this.fuelLoading = false;
        },

        getFuelAggregates: function(this: any) {
            const inspections = this.fuelData || [];
            let totalGasCost = 0;
            let totalGallons = 0;
            let totalMiles = 0;
            const dailyCosts: Record<string, number> = {};

            for (const insp of inspections) {
                const date = insp.inspection_date;
                const vehicles = insp.inspection_vehicles || [];

                for (const v of vehicles) {
                    const gasCost = (parseInt(v.inspection_vehicle_gas_cost) || 0) / 100;
                    const gallons = parseInt(v.inspection_vehicle_gas_gallons) || 0;
                    const odomStart = parseInt(v.inspection_vehicle_odometer_start) || 0;
                    const odomEnd = parseInt(v.inspection_vehicle_odometer_end) || 0;

                    totalGasCost += gasCost;
                    totalGallons += gallons;
                    totalMiles += Math.max(0, odomEnd - odomStart);

                    // Aggregate by date for chart
                    if (date) {
                        dailyCosts[date] = (dailyCosts[date] || 0) + gasCost;
                    }
                }
            }

            const costPerMile = totalMiles > 0 ? totalGasCost / totalMiles : 0;

            // Build chart data sorted by date
            const chartData = Object.entries(dailyCosts)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([date, cost]) => ({
                    date: dayjs(date).format('MMM D'),
                    cost: parseFloat(cost.toFixed(2))
                }));

            return {
                totalGasCost,
                totalGallons,
                totalMiles,
                costPerMile,
                chartData
            };
        },

        // ═══════════════════════════════════════════════════════════════════
        // MILES SECTION
        // ═══════════════════════════════════════════════════════════════════

        milesGetData: async function(this: any) {
            const dateRange = this.formData?.miles?.date_range;
            const carId = this.formData?.miles?.select_car?.value;

            // Require both date range AND car to fetch
            if (!dateRange?.[0] || !dateRange?.[1] || !carId) {
                this.milesData = [];
                this.milesLoading = false;
                return;
            }

            this.milesLoading = true;
            const formatDate = (d: Date | string) => typeof d === 'string'
                ? d
                : d.toISOString().split('T')[0];

            const filters = [
                { fieldName: 'inspection_date', operator: '>=', value: formatDate(dateRange[0]) },
                { fieldName: 'inspection_date', operator: '<=', value: formatDate(dateRange[1]) },
            ];

            const response = await FetchApi('v1/inspection', 'GET', null, { filters });

            // Filter vehicles by car_id and store
            const inspections = response.data || [];
            const carIdNum = parseInt(carId);
            this.milesData = inspections.map((ins: any) => {
                const vehicles = (ins.inspection_vehicles || []).filter(
                    (v: any) => v.car_car_id === carIdNum
                );
                return { ...ins, inspection_vehicles: vehicles };
            }).filter((ins: any) => ins.inspection_vehicles.length > 0);

            this.milesLoading = false;
        },

        getMilesAggregates: function(this: any) {
            const inspections = this.milesData || [];
            let totalMiles = 0;
            const dailyMiles: Record<string, number> = {};

            for (const insp of inspections) {
                const date = insp.inspection_date;
                const vehicles = insp.inspection_vehicles || [];

                for (const v of vehicles) {
                    const odomStart = parseInt(v.inspection_vehicle_odometer_start) || 0;
                    const odomEnd = parseInt(v.inspection_vehicle_odometer_end) || 0;
                    const miles = Math.max(0, odomEnd - odomStart);

                    totalMiles += miles;

                    // Aggregate by date for chart
                    if (date) {
                        dailyMiles[date] = (dailyMiles[date] || 0) + miles;
                    }
                }
            }

            const daysWithData = Object.keys(dailyMiles).length;
            const avgDailyMiles = daysWithData > 0 ? totalMiles / daysWithData : 0;

            // Build chart data sorted by date
            const chartData = Object.entries(dailyMiles)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([date, miles]) => ({
                    date: dayjs(date).format('MMM D'),
                    miles
                }));

            return {
                totalMiles,
                avgDailyMiles,
                daysWithData,
                chartData
            };
        }
    }).signal