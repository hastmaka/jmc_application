import {SignalController} from "@/signals/SignalController.js";

export const DiagnosisController = new SignalController({
    editMap: {
        diagnosis: async () => {
            debugger
        }
    }
}, {
    diagnosisGetData: async () => {
        setTimeout(() => {
            DiagnosisController.diagnosisLoading = false
        }, 200)
    },
    handleDeleteDiagnosis: async (id) => {debugger},
    handleAddDiagnosis: async (id) => {debugger},
}).signal