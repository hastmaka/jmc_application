import {SignalController} from "@/signals/signalController/SignalController.ts";
import type {SignalType} from "@/signals/SignalClass.ts";
import {FetchApi} from "@/api/FetchApi.ts";
import {DashboardController} from "@/view/dashboard/DashboardController.ts";
import {getModel} from "@/api/models";

/**
 * DashboardModalController
 *
 * Manages state and operations for the Driver Report Modal.
 * Handles inspection creation/editing with multiple vehicles, breaks, and reservation selection.
 *
 * State:
 * - currentInspectionId: ID of inspection being edited (null for create mode)
 * - breaks: Array of break entries {start, end, initial}
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

type VehicleEntry = {
    car_car_id: string | null;
    odometer_start: string;
    odometer_end: string;
    gas_gallons: string;
    gas_cost: string;
    reservationData: any[];
    selectedReservationIds: number[];
    reservationLoading: boolean;
};

const createEmptyVehicle = (): VehicleEntry => ({
    car_car_id: null,
    odometer_start: '',
    odometer_end: '',
    gas_gallons: '',
    gas_cost: '',
    reservationData: [],
    selectedReservationIds: [],
    reservationLoading: false,
});

export const DashboardModalController: SignalType<any, any> =
    new SignalController({
        manualReset: ['vehicleData'],
        currentInspectionId: null as number | null,
        breaks: [],
        vehicleData: [createEmptyVehicle()],
        editMap: {
            inspection: async function(fields: string[], id: number) {
                const response = await FetchApi(`v1/inspection/${id}`);
                const inspection = new (getModel('inspection'))(response.data);
                DashboardModalController.fields = fields;
                DashboardModalController.populateForm('inspection', fields, inspection);
                DashboardModalController.breaks = response.data?.inspection_breaks || [];

                const vehicles = response.data?.inspection_vehicles || [];
                if (vehicles.length > 0) {
                    DashboardModalController.vehicleData = vehicles.map((v: any) => ({
                        car_car_id: v.car_car_id,
                        odometer_start: v.inspection_vehicle_odometer_start?.toString() || '',
                        odometer_end: v.inspection_vehicle_odometer_end?.toString() || '',
                        gas_gallons: v.inspection_vehicle_gas_gallons?.toString() || '',
                        gas_cost: v.inspection_vehicle_gas_cost?.toString() || '',
                        reservationData: [],
                        selectedReservationIds: v.inspection_vehicle_reservation_ids || [],
                        reservationLoading: false,
                    }));
                } else {
                    DashboardModalController.vehicleData = [createEmptyVehicle()];
                }
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
            this.breaks = [];
            this.currentInspectionId = null;
            this.vehicleData = [createEmptyVehicle()];
            this.resetState();
        },

        // ═══════════════════════════════════════════════════════════════════
        // VEHICLE CRUD
        // Methods for adding, removing, and updating vehicle entries
        // ═══════════════════════════════════════════════════════════════════

        /** Adds a new empty vehicle entry */
        addVehicle: function(this: any) {
            this.vehicleData = [...this.vehicleData, createEmptyVehicle()];
        },

        /** Removes a vehicle by index (minimum 1 vehicle required) */
        removeVehicle: function(this: any, index: number) {
            if (this.vehicleData.length <= 1) return;
            this.vehicleData = this.vehicleData.filter((_: any, i: number) => i !== index);
        },

        /** Updates a specific field on a vehicle entry */
        updateVehicle: function(this: any, index: number, field: string, value: any) {
            const newVehicleData = [...this.vehicleData];
            newVehicleData[index] = { ...newVehicleData[index], [field]: value };
            this.vehicleData = newVehicleData;
        },

        // ═══════════════════════════════════════════════════════════════════
        // VEHICLE RESERVATIONS
        // Methods for fetching and selecting reservations per vehicle
        // ═══════════════════════════════════════════════════════════════════

        /** Fetches reservations for a vehicle based on car and date */
        vehicleReservationGetData: async function(this: any, index: number, carId: number, date: string) {
            if (!carId || !date) {
                this.updateVehicle(index, 'reservationData', []);
                this.updateVehicle(index, 'selectedReservationIds', []);
                return;
            }

            this.updateVehicle(index, 'reservationLoading', true);

            const filters = JSON.stringify([
                { fieldName: 'car_car_id', operator: '=', value: carId },
                { fieldName: 'reservation_date', operator: '=', value: date }
            ]);

            const response = await FetchApi('v1/reservation', undefined, null, { filters });

            if (response.success) {
                const reservations = response.data.map((r: any) => new (getModel('reservation'))(r));
                this.updateVehicle(index, 'reservationData', reservations);
                this.updateVehicle(index, 'selectedReservationIds', reservations.map((r: any) => r.get('reservation_id')));
            } else {
                this.updateVehicle(index, 'reservationData', []);
                this.updateVehicle(index, 'selectedReservationIds', []);
            }

            this.updateVehicle(index, 'reservationLoading', false);
        },

        /** Toggles selection of a single reservation */
        toggleVehicleReservation: function(this: any, vehicleIndex: number, reservationId: number) {
            const vehicle = this.vehicleData[vehicleIndex];
            const current = [...vehicle.selectedReservationIds];
            const index = current.indexOf(reservationId);

            if (index === -1) {
                current.push(reservationId);
            } else {
                current.splice(index, 1);
            }

            this.updateVehicle(vehicleIndex, 'selectedReservationIds', current);
        },

        /** Selects all reservations for a specific vehicle */
        selectAllVehicleReservation: function(this: any, vehicleIndex: number) {
            const vehicle = this.vehicleData[vehicleIndex];
            const allIds = vehicle.reservationData.map((r: any) => r.get('reservation_id'));
            this.updateVehicle(vehicleIndex, 'selectedReservationIds', allIds);
        },

        /** Deselects all reservations for a specific vehicle */
        deselectAllVehicleReservation: function(this: any, vehicleIndex: number) {
            this.updateVehicle(vehicleIndex, 'selectedReservationIds', []);
        },

        /** Selects all reservations across all vehicles */
        selectAllReservations: function(this: any) {
            if (!this.vehicleData) return;
            this.vehicleData.forEach((_: any, index: number) => {
                this.selectAllVehicleReservation(index);
            });
        },

        /** Deselects all reservations across all vehicles */
        deselectAllReservations: function(this: any) {
            if (!this.vehicleData) return;
            this.vehicleData.forEach((_: any, index: number) => {
                this.deselectAllVehicleReservation(index);
            });
        },

        // ═══════════════════════════════════════════════════════════════════
        // BREAK LOG
        // Methods for managing driver break entries
        // ═══════════════════════════════════════════════════════════════════

        /** Adds a new empty break entry */
        addBreak: function(this: any) {
            this.breaks = [...this.breaks, {start: '', end: '', initial: ''}];
        },

        /** Updates a specific field on a break entry */
        updateBreak: function(this: any, index: number, field: string, value: string) {
            const newBreaks = [...this.breaks];
            newBreaks[index] = {...newBreaks[index], [field]: value};
            this.breaks = newBreaks;
        },

        /** Removes a break entry by index */
        removeBreak: function(this: any, index: number) {
            this.breaks = this.breaks.filter((_: any, i: number) => i !== index);
        },

        // ═══════════════════════════════════════════════════════════════════
        // API OPERATIONS
        // Methods for saving, editing, and deleting inspections
        // ═══════════════════════════════════════════════════════════════════

        /** Builds the vehicles array payload for API requests */
        buildVehiclesPayload: function(this: any) {
            if (!this.vehicleData) return [];
            return this.vehicleData
                .filter((v: VehicleEntry) => v.car_car_id)
                .map((v: VehicleEntry) => ({
                    car_car_id: v.car_car_id,
                    inspection_vehicle_odometer_start: v.odometer_start ? parseInt(v.odometer_start) : null,
                    inspection_vehicle_odometer_end: v.odometer_end ? parseInt(v.odometer_end) : null,
                    inspection_vehicle_gas_gallons: v.gas_gallons ? parseFloat(v.gas_gallons) : null,
                    inspection_vehicle_gas_cost: v.gas_cost ? parseFloat(v.gas_cost) : null,
                    inspection_vehicle_reservation_ids: v.selectedReservationIds.length > 0 ? v.selectedReservationIds : null,
                }));
        },

        /** Creates a new inspection with vehicles */
        handleSaveInspection: async function(this: any, modalId: string) {
            const vehicles = this.buildVehiclesPayload();

            const payload = {
                ...this.formData.inspection,
                inspection_breaks: this.breaks.length ? this.breaks : null,
                vehicles,
            };

            const response = await FetchApi('v1/inspection', 'POST', payload);

            if (response.success) {
                await DashboardController.inspectionGetData();
                this.clearModalState();
                window.closeModal(modalId);
            } else {
                throw response;
            }
        },

        /** Updates an existing inspection with vehicles */
        handleEditInspection: async function(this: any, modalId: string) {
            const vehicles = this.buildVehiclesPayload();

            const payload = {
                ...this.dirtyFields,
                inspection_breaks: this.breaks.length ? this.breaks : null,
                vehicles,
            };

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
            if (!this.vehicleData || !this.vehicleData[vehicleIndex]) {
                return { totalMiles: 0, pricePerGallon: '0.00' };
            }
            const vehicle = this.vehicleData[vehicleIndex];
            const odometerStart = parseInt(vehicle.odometer_start) || 0;
            const odometerEnd = parseInt(vehicle.odometer_end) || 0;
            const totalMiles = odometerEnd - odometerStart;
            const gasCost = parseFloat(vehicle.gas_cost) || 0;
            const gasGallons = parseFloat(vehicle.gas_gallons) || 0;
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

            if (!this.vehicleData) {
                return { combined, isLoading, hasCarAndDate };
            }

            this.vehicleData.forEach((vehicle: any, vehicleIndex: number) => {
                if (vehicle.reservationLoading) isLoading = true;
                if (vehicle.car_car_id) hasCarAndDate = true;

                vehicle.reservationData?.forEach((reservation: any) => {
                    combined.push({
                        _vehicleIndex: vehicleIndex,
                        _vehicleNumber: vehicleIndex + 1,
                        _isSelected: vehicle.selectedReservationIds?.includes(reservation.get('reservation_id')),
                        reservation_id: reservation.get('reservation_id'),
                        reservation_charter_order: reservation.get('reservation_charter_order'),
                        reservation_time: reservation.get('reservation_time'),
                        reservation_passenger_name: reservation.get('reservation_passenger_name'),
                        reservation_pickup_location: reservation.get('reservation_pickup_location'),
                        reservation_dropoff_location: reservation.get('reservation_dropoff_location'),
                        reservation_total: reservation.get('reservation_total'),
                    });
                });
            });

            return { combined, isLoading, hasCarAndDate };
        },

        /** Calculates reservation totals (selected count, grand total) */
        getReservationTotals: function(this: any) {
            const { combined } = this.getCombinedReservations();

            if (!this.vehicleData) {
                return { totalSelected: 0, grandTotal: 0, totalReservations: 0 };
            }

            const totalSelected = this.vehicleData.reduce((sum: number, v: any) =>
                sum + (v.selectedReservationIds?.length || 0), 0);

            const grandTotal = combined
                .filter((r: any) => r._isSelected)
                .reduce((sum: number, r: any) => sum + (parseFloat(r.reservation_total) || 0), 0);

            return { totalSelected, grandTotal, totalReservations: combined.length };
        }
    }).signal
