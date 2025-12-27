import {SignalController} from "@/signals/SignalController.js";

export const MedicationController = new SignalController({
    editMap: {
        medication: async () => {
            debugger
        }
    }
}, {
    medicationGetData: async () => {
        setTimeout(() => {
            MedicationController.medicationLoading = false
        }, 200)
    },
    handleMedicationSubmit: async (keyId) => {debugger},
    handleDelete: async (id) => {debugger},
}).signal