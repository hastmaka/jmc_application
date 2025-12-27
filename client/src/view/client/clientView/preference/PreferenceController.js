import {SignalController} from "@/signals/SignalController.js";

export const PreferenceController = new SignalController({
    editMap: {
        preference: async () => {
            debugger
        }
    }
}, {
    preferenceGetData: async () => {
        setTimeout(() => {
            PreferenceController.preferenceLoading = false
        }, 200)
    },
    handlePreferenceSubmit: async (keyId) => {debugger},
    handleEdit: async (id) => {debugger},
    handleDelete: async (id) => {debugger},
}).signal