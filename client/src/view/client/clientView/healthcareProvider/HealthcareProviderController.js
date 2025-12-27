import {SignalController} from "@/signals/SignalController.js";

export const HealthcareProviderController = new SignalController({
    editMap: {
        healthcare_provider: async () => {
            debugger
        }
    }
}, {
    healthcareProviderGetData: async () => {
        setTimeout(() => {
            HealthcareProviderController.healthcareProviderLoading = false
        }, 200)
    },
    handleAddHealthcareProvider: async (id) => {debugger},
    handleDeleteHealthcareProvider: async (id) => {debugger},
}).signal