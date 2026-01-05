import {SignalController} from "@/signals/signalController/SignalController.ts";
import type {SignalType} from "@/signals/SignalClass.ts";
import {FetchApi} from "@/api/FetchApi.ts";
import {DashboardController} from "@/view/dashboard/DashboardController.ts";
import {getModel} from "@/api/models";
import {handleInput as baseHandleInput} from "@/signals/signalController/methods";

/**
 * DashboardModalController
 *
 * Manages state and operations for the Driver Report Modal.
 * Handles inspection creation/editing with multiple vehicles, breaks, and reservation selection.
 *
 * State:
 * - currentInspectionId: ID of inspection being edited (null for create mode)
 * - breaks: Array of break entries {start, end}
 * - vehicleData: Array of vehicles with mileage, gas, and selected reservations
 *
 * Methods are grouped by functionality:
 * - Modal State: clearModalState, setCurrentInspectionId
 * - Vehicle CRUD: addVehicle, removeVehicle, updateVehicle
 * - Vehicle Reservations: vehicleReservationGetData, toggleVehicleReservation, select/deselect
 * - Break Log: addBreak, updateBreak, removeBreak
 * - API Operations: handleSaveInspection, handleEditInspection, handleDeleteInspection
 * - Computed/Getters: getVehicleTotals, getCombinedReservations, getReservationTotals
 */

function parseIntOrNull(val: any): number | null {
    if (val == null || val === '') return null;
    const num = parseInt(val);
    return isNaN(num) ? null : num;
}

function parseFloatOrNull(val: any): number | null {
    if (val == null || val === '') return null;
    const num = parseFloat(val);
    return isNaN(num) ? null : num;
}

function buildVehiclePayload(v: any) {
    if (!v) return null;
    // select_car is an object {label, value} from EzSelect
    const carId = v.select_car?.value ?? null;
    return {
        car_car_id: carId,
        inspection_vehicle_odometer_start: parseIntOrNull(v.inspection_vehicle_odometer_start),
        inspection_vehicle_odometer_end: parseIntOrNull(v.inspection_vehicle_odometer_end),
        inspection_vehicle_gas_gallons: parseIntOrNull(v.inspection_vehicle_gas_gallons),
        inspection_vehicle_gas_cost: parseFloatOrNull(v.inspection_vehicle_gas_cost) != null
            ? Math.round(parseFloatOrNull(v.inspection_vehicle_gas_cost)! * 100)
            : null,
        inspection_vehicle_reservation_ids: v.inspection_vehicle_reservation_ids?.length > 0 ? v.inspection_vehicle_reservation_ids : null,
    };
}

function buildVehiclesPayloadFromFormData(formData: any, vehicleCount: number) {
    const vehicles = [];
    for (let i = 0; i < vehicleCount; i++) {
        const v = formData?.[`vehicle${i}`];
        if (v?.select_car?.value) {
            vehicles.push(buildVehiclePayload(v));
        }
    }
    return vehicles;
}

function isVehiclesDirty(formData: any, vehicleCount: number, originalPayload: any[] | null): boolean {
    if (!originalPayload) return true;
    const currentPayload = buildVehiclesPayloadFromFormData(formData, vehicleCount);
    return JSON.stringify(currentPayload) !== JSON.stringify(originalPayload);
}

function buildBreaksPayloadFromFormData(formData: any, breakCount: number) {
    const breaks = [];
    for (let i = 0; i < breakCount; i++) {
        const b = formData?.[`break${i}`];
        if (b?.start || b?.end) {
            breaks.push({ start: b.start || '', end: b.end || '' });
        }
    }
    return breaks;
}

function isBreaksDirty(formData: any, breakCount: number, originalPayload: any[] | null): boolean {
    if (!originalPayload) return true;
    const currentPayload = buildBreaksPayloadFromFormData(formData, breakCount);
    return JSON.stringify(currentPayload) !== JSON.stringify(originalPayload);
}

export const DashboardModalController: SignalType<any, any> =
    new SignalController({
        currentInspectionId: null as number | null,
        breakCount: 0,
        vehicleCount: 1,
        originalBreakPayload: null as any[] | null,
        originalVehiclePayload: null as any[] | null,
        inspectionDetailData: null as any,
        inspectionDetailLoading: false,
        editMap: {
            inspection: async function(fields: string[], id: number) {
                const response = await FetchApi(`v1/inspection/${id}`);
                const inspection = new (getModel('inspection'))(response.data);
                DashboardModalController.fields = fields;
                DashboardModalController.currentInspectionId = id;
                DashboardModalController.populateForm('inspection', fields, inspection);

                // Populate formData for each break
                const breaks = response.data?.inspection_breaks || [];
                DashboardModalController.breakCount = breaks.length;
                breaks.forEach((b: any, index: number) => {
                    DashboardModalController.formData[`break${index}`] = { start: b.start || '', end: b.end || '' };
                });
                // Store original payload for dirty checking
                DashboardModalController.originalBreakPayload = buildBreaksPayloadFromFormData(
                    DashboardModalController.formData,
                    breaks.length
                );

                const vehicles = response.data?.inspection_vehicles || [];
                DashboardModalController.vehicleCount = vehicles.length || 1;

                // Populate formData for each vehicle
                vehicles.forEach((v: any, index: number) => {
                    const vehicleModel = new (getModel('inspectionVehicle'))(v);
                    DashboardModalController.formData[`vehicle${index}`] = {
                        ...vehicleModel,
                        // select_car is {label, value} object from model
                        inspection_vehicle_reservation_ids: vehicleModel.inspection_vehicle_reservation_ids || [],
                        reservationData: (v.vehicle_reservations || []).map((r: any) => new (getModel('reservation'))(r)),
                        reservationLoading: false,
                    };
                });

                // Store original payload for dirty checking
                DashboardModalController.originalVehiclePayload = buildVehiclesPayloadFromFormData(
                    DashboardModalController.formData,
                    vehicles.length
                );
            }
        }
    }, {
        // ═══════════════════════════════════════════════════════════════════
        // MODAL STATE
        // Methods for managing modal lifecycle and state reset
        // ═══════════════════════════════════════════════════════════════════

        /** Sets the current inspection ID for edit mode */
        setCurrentInspectionId: function(this: any, inspectionId?: number) {
            this.currentInspectionId = inspectionId || null;
        },
        /** Resets all modal state to initial values */
        clearModalState: function(this: any) {
            this.currentInspectionId = null;
            this.breakCount = 0;
            this.vehicleCount = 1;
            this.originalBreakPayload = null;
            this.originalVehiclePayload = null;
            this.inspectionDetailData = null;
            this.inspectionDetailLoading = false;
            this.resetState();
        },
        /** Fetches inspection details for read-only view */
        inspectionDetailGetData: async function(this: any, inspectionId: number) {
            const response = await FetchApi(`v1/inspection/${inspectionId}`);
            this.inspectionDetailData = response.data;
            this.inspectionDetailLoading = false;
        },
        /** Custom handleInput - clears reservationData when select_car or date changes */
        handleInput: function(this: any, type: string, name: string, value: any): void {
            // Clear reservationData when car changes on a vehicle
            if (type.startsWith('vehicle') && name === 'select_car') {
                if (!this.formData[type]) this.formData[type] = {};
                this.formData[type].reservationData = [];
                this.formData[type].inspection_vehicle_reservation_ids = [];
            }
            // Clear all vehicle reservations when inspection date changes
            if (type === 'inspection' && name === 'inspection_date') {
                for (let i = 0; i < this.vehicleCount; i++) {
                    const vehicleKey = `vehicle${i}`;
                    if (this.formData[vehicleKey]) {
                        this.formData[vehicleKey].reservationData = [];
                        this.formData[vehicleKey].inspection_vehicle_reservation_ids = [];
                    }
                }
            }
            baseHandleInput.call(this, type, name, value);
        },

        // ═══════════════════════════════════════════════════════════════════
        // VEHICLE CRUD
        // Methods for adding, removing, and updating vehicle entries
        // ═══════════════════════════════════════════════════════════════════

        /** Adds a new empty vehicle entry */
        addVehicle: function(this: any) {
            const newIndex = this.vehicleCount;
            this.formData[`vehicle${newIndex}`] = {
                select_car: null,
                inspection_vehicle_odometer_start: '',
                inspection_vehicle_odometer_end: '',
                inspection_vehicle_gas_gallons: '',
                inspection_vehicle_gas_cost: '',
                inspection_vehicle_reservation_ids: [],
                reservationData: [],
                reservationLoading: false,
            };
            this.vehicleCount += 1;
        },
        /** Removes a vehicle by index (minimum 1 vehicle required) */
        removeVehicle: function(this: any, index: number) {
            if (this.vehicleCount <= 1) return;
            // Shift formData keys down after removal
            for (let i = index; i < this.vehicleCount - 1; i++) {
                this.formData[`vehicle${i}`] = this.formData[`vehicle${i + 1}`];
            }
            delete this.formData[`vehicle${this.vehicleCount - 1}`];
            this.vehicleCount -= 1;
        },

        // ═══════════════════════════════════════════════════════════════════
        // VEHICLE RESERVATIONS
        // Methods for fetching and selecting reservations per vehicle
        // ═══════════════════════════════════════════════════════════════════

        /** Fetches reservations for a vehicle based on car and date */
        vehicleReservationGetData: async function(this: any, index: number, carId: number, date: string) {
            const vehicleKey = `vehicle${index}`;
            if (!carId || !date) {
                this.handleInput(vehicleKey, 'reservationData', []);
                this.handleInput(vehicleKey, 'inspection_vehicle_reservation_ids', []);
                return;
            }

            const vehicle = this.formData[vehicleKey];
            const existingIds = vehicle?.inspection_vehicle_reservation_ids || [];

            this.handleInput(vehicleKey, 'reservationLoading', true);

            const filters = JSON.stringify([
                { fieldName: 'car_car_id', operator: '=', value: carId },
                { fieldName: 'reservation_date', operator: '=', value: date },
                { fieldName: 'reservation_status', operator: '=', value: 7 }
            ]);

            const response = await FetchApi('v1/reservation', undefined, null, { filters });

            if (response.success) {
                const reservations = response.data.map((r: any) =>
                    new (getModel('reservation'))(r));
                this.handleInput(vehicleKey, 'reservationData', reservations);
                // Preserve existing selection in edit mode, otherwise select all
                if (existingIds.length === 0) {
                    this.handleInput(vehicleKey, 'inspection_vehicle_reservation_ids', reservations.map((r: any) => r.reservation_id));
                }
            } else {
                this.handleInput(vehicleKey, 'reservationData', []);
                this.handleInput(vehicleKey, 'inspection_vehicle_reservation_ids', []);
            }

            this.handleInput(vehicleKey, 'reservationLoading', false);
        },
        /** Toggles selection of a single reservation */
        toggleVehicleReservation: function(this: any, vehicleIndex: number, reservationId: number) {
            const vehicleKey = `vehicle${vehicleIndex}`;
            const vehicle = this.formData[vehicleKey];
            const current = [...(vehicle?.inspection_vehicle_reservation_ids || [])];
            const idx = current.indexOf(reservationId);

            if (idx === -1) {
                current.push(reservationId);
            } else {
                current.splice(idx, 1);
            }

            this.handleInput(vehicleKey, 'inspection_vehicle_reservation_ids', current);
        },
        /** Selects all reservations for a specific vehicle */
        selectAllVehicleReservation: function(this: any, vehicleIndex: number) {
            const vehicleKey = `vehicle${vehicleIndex}`;
            const vehicle = this.formData[vehicleKey];
            const allIds = (vehicle?.reservationData || []).map((r: any) => r.reservation_id);
            this.handleInput(vehicleKey, 'inspection_vehicle_reservation_ids', allIds);
        },
        /** Deselects all reservations for a specific vehicle */
        deselectAllVehicleReservation: function(this: any, vehicleIndex: number) {
            const vehicleKey = `vehicle${vehicleIndex}`;
            this.handleInput(vehicleKey, 'inspection_vehicle_reservation_ids', []);
        },
        /** Selects all reservations across all vehicles */
        selectAllReservations: function(this: any) {
            for (let i = 0; i < this.vehicleCount; i++) {
                this.selectAllVehicleReservation(i);
            }
        },
        /** Deselects all reservations across all vehicles */
        deselectAllReservations: function(this: any) {
            for (let i = 0; i < this.vehicleCount; i++) {
                this.deselectAllVehicleReservation(i);
            }
        },

        // ═══════════════════════════════════════════════════════════════════
        // BREAK LOG
        // Methods for managing driver break entries
        // ═══════════════════════════════════════════════════════════════════

        /** Adds a new empty break entry */
        addBreak: function(this: any) {
            this.formData[`break${this.breakCount}`] = { start: '', end: '' };
            this.breakCount += 1;
        },
        /** Updates a specific field on a break entry */
        updateBreak: function(this: any, index: number, field: string, value: string) {
            this.handleInput(`break${index}`, field, value);
        },
        /** Removes a break entry by index */
        removeBreak: function(this: any, index: number) {
            if (this.breakCount <= 0) return;
            for (let i = index; i < this.breakCount - 1; i++) {
                this.formData[`break${i}`] = this.formData[`break${i + 1}`];
            }
            delete this.formData[`break${this.breakCount - 1}`];
            this.breakCount -= 1;
        },

        // ═══════════════════════════════════════════════════════════════════
        // INSPECTION CRUD
        // Methods for saving, editing, and deleting inspections
        // ═══════════════════════════════════════════════════════════════════

        /** Creates a new inspection with vehicles */
        handleSaveInspection: async function(this: any, modalId: string, onExistingFound?: (existingId: number) => void) {
            const vehicles = buildVehiclesPayloadFromFormData(this.formData, this.vehicleCount);
            const breaks = buildBreaksPayloadFromFormData(this.formData, this.breakCount);

            // Extract .value from select_employee (checkRequired already validated)
            const inspectionData = { ...this.formData.inspection };
            inspectionData.employee_employee_id = inspectionData.select_employee?.value;
            delete inspectionData.select_employee;

            const payload = {
                ...inspectionData,
                inspection_breaks: breaks.length ? breaks : null,
                vehicles,
            };

            const response = await FetchApi('v1/inspection', 'POST', payload);

            if (response.success) {
                await DashboardController.inspectionGetData();
                this.clearModalState();
                window.closeModal(modalId);
            } else if (response.existingId && onExistingFound) {
                // Inspection already exists, let caller handle it
                onExistingFound(response.existingId);
            } else {
                throw response;
            }
        },
        /** Updates an existing inspection with vehicles */
        handleEditInspection: async function(this: any, modalId: string) {
            // Extract .value from select_employee if changed
            const dirtyFieldsCopy = { ...this.dirtyFields };
            if (dirtyFieldsCopy.select_employee) {
                dirtyFieldsCopy.employee_employee_id = dirtyFieldsCopy.select_employee.value;
                delete dirtyFieldsCopy.select_employee;
            }

            const payload: Record<string, any> = {
                inspection_id: this.currentInspectionId,
                ...dirtyFieldsCopy,
            };

            // Only include breaks if they changed
            if (isBreaksDirty(this.formData, this.breakCount, this.originalBreakPayload)) {
                const breaks = buildBreaksPayloadFromFormData(this.formData, this.breakCount);
                payload.inspection_breaks = breaks.length ? breaks : null;
            }

            // Only include vehicles if they changed
            if (isVehiclesDirty(this.formData, this.vehicleCount, this.originalVehiclePayload)) {
                payload.vehicles = buildVehiclesPayloadFromFormData(this.formData, this.vehicleCount);
            }

            const response = await FetchApi('v1/inspection', 'PUT', payload);

            if (response.success) {
                await DashboardController.inspectionGetData();
                this.clearModalState();
                window.closeModal(modalId);
            } else {
                throw response;
            }
        },
        /** Deletes an inspection by ID */
        handleDeleteInspection: async function(this: any, inspectionId: number, modalId: string) {
            const response = await FetchApi(`v1/inspection/${inspectionId}`, 'DELETE');

            if (response.success) {
                await DashboardController.inspectionGetData();
                this.clearModalState();
                window.closeModal(modalId);
            } else {
                throw response;
            }
        },

        // ═══════════════════════════════════════════════════════════════════
        // COMPUTED / GETTERS
        // Methods for calculating totals and aggregating data
        // ═══════════════════════════════════════════════════════════════════

        /** Calculates totals for a specific vehicle (miles, $/gallon) */
        getVehicleTotals: function(this: any, vehicleIndex: number) {
            const vehicle = this.formData[`vehicle${vehicleIndex}`];
            if (!vehicle) {
                return { totalMiles: 0, pricePerGallon: '0.00' };
            }
            const odometerStart = parseInt(vehicle.inspection_vehicle_odometer_start) || 0;
            const odometerEnd = parseInt(vehicle.inspection_vehicle_odometer_end) || 0;
            const totalMiles = odometerEnd - odometerStart;
            const gasCost = parseFloat(vehicle.inspection_vehicle_gas_cost) || 0;
            const gasGallons = parseFloat(vehicle.inspection_vehicle_gas_gallons) || 0;
            const pricePerGallon = gasGallons > 0 ? gasCost / gasGallons : 0;

            return {
                totalMiles: totalMiles > 0 ? totalMiles : 0,
                pricePerGallon: pricePerGallon.toFixed(2)
            };
        },
        /** Combines reservations from all vehicles into a single array */
        getCombinedReservations: function(this: any) {
            const combined: any[] = [];
            let isLoading = false;
            let hasCarAndDate = false;

            for (let i = 0; i < this.vehicleCount; i++) {
                const vehicle = this.formData[`vehicle${i}`];
                if (!vehicle) continue;

                if (vehicle.reservationLoading) isLoading = true;
                if (vehicle.select_car?.value) hasCarAndDate = true;

                vehicle.reservationData?.forEach((reservation: any) => {
                    combined.push({
                        ...reservation,
                        _vehicleIndex: i,
                        _vehicleNumber: i + 1,
                        _isSelected: vehicle.inspection_vehicle_reservation_ids?.includes(reservation.reservation_id),
                    });
                });
            }

            return { combined, isLoading, hasCarAndDate };
        },
        /** Calculates reservation totals (selected count, grand total) */
        getReservationTotals: function(this: any) {
            let totalReservations = 0;
            let grandTotal = 0;
            let totalSelected = 0;

            for (let i = 0; i < this.vehicleCount; i++) {
                const vehicle = this.formData[`vehicle${i}`];
                if (!vehicle) continue;

                const reservations = vehicle.reservationData || [];
                const selectedIds = vehicle.inspection_vehicle_reservation_ids || [];
                totalReservations += reservations.length;
                totalSelected += selectedIds.length;

                reservations.forEach((r: any) => {
                    if (selectedIds.includes(r.reservation_id)) {
                        grandTotal += parseFloat(r.reservation_total) || 0;
                    }
                });
            }

            return { totalSelected, grandTotal, totalReservations };
        }
    }).signal
