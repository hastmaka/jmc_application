import {SignalController} from "@/signals/SignalController.js";

export const RestrictionController = new SignalController({
    editMap: {
        restriction: async () => {
            debugger
        }
    }
}, {
    restrictionGetData: async () => {
        setTimeout(() => {
            RestrictionController.restrictionLoading = false
        }, 200)
    },
    handleSubmitRestriction: async (action, signal) => {},
    handleDelete: async (action, id, signal) => {},
}).signal