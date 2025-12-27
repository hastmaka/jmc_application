import {SignalController} from "@/signals/signalController/SignalController.ts";
import {FetchApi} from "@/api/FetchApi.ts";
import {getModel} from "@/api/models";

export const DashboardController = new SignalController({
    rangeDateValue: [null, null],
    selectedEmployee: null as number | null,
    selectedCar: null as number | null,
},{
    handleDateRangeChange: function(this: any, dateRange: [Date | null, Date | null]) {
        this.rangeDateValue = dateRange;
        if (dateRange[0] && dateRange[1]) {
            this.inspectionGetData();
        }
    },

    handleEmployeeChange: function(this: any, employeeId: string | null) {
        this.selectedEmployee = employeeId ? parseInt(employeeId) : null;
    },

    handleCarChange: function(this: any, carId: string | null) {
        this.selectedCar = carId ? parseInt(carId) : null;
    },

    inspectionGetData: async function(this: any) {
        const [startDate, endDate] = this.rangeDateValue;
        const filters: any[] = [];

        if (startDate && endDate) {
            const formatDate = (d: Date) => d.toISOString().split('T')[0];
            filters.push({ fieldName: 'inspection_date', operator: '>=', value: formatDate(startDate) });
            filters.push({ fieldName: 'inspection_date', operator: '<=', value: formatDate(endDate) });
        }

        if (this.selectedEmployee) {
            filters.push({ fieldName: 'employee_employee_id', operator: '=', value: this.selectedEmployee });
        }

        if (this.selectedCar) {
            filters.push({ fieldName: 'car_car_id', operator: '=', value: this.selectedCar });
        }

        const query: Record<string, any> = {};
        if (filters.length) query.filters = filters;

        const response = await FetchApi('v1/inspection', 'GET', null, query);
        if (response?.data?.rows) {
            const InspectionModel = getModel('inspection');
            this.inspectionData = InspectionModel.instantiate(response.data.rows);
        }
        this.inspectionLoading = false;
    },

    employeeGetData: async function(this: any) {
        const response = await FetchApi('v1/employee');
        if (response?.data?.rows) {
            const EmployeeModel = getModel('employee');
            this.employeeData = EmployeeModel.instantiate(response.data.rows);
        }
        this.employeeLoading = false;
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
        let totalGasGallons = 0;
        let totalMiles = 0;
        let totalGrandTotal = 0;
        let totalToCompany = 0;

        for (const insp of inspections) {
            totalGasCost += parseFloat(insp.get('inspection_gas_cost')) || 0;
            totalGasGallons += parseFloat(insp.get('inspection_gas_gallons')) || 0;
            totalMiles += parseInt(insp.get('inspection_total_miles')) || 0;
            totalGrandTotal += parseFloat(insp.get('inspection_grand_total')) || 0;
            totalToCompany += parseFloat(insp.get('inspection_total_to_company')) || 0;
        }

        return {
            totalGasCost,
            totalGasGallons,
            totalMiles,
            totalGrandTotal,
            totalToCompany,
            tripCount: inspections.length
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