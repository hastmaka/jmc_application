import {SignalController} from "@/signals/SignalController.js";

export const AbcController = new SignalController({
    editMap: {
        abc: async () => {
            debugger
        }
    }
}, {
    abcGetData: async () => {
        setTimeout(() => {
            AbcController.abcLoading = false
        }, 200)
    },
    handleAbcSubmit: async (action, signal) => {},
    handleDelete: async (action, id, signal) => {},
}).signal