import {SignalController} from "@/signals/SignalController.js";

export const ApprovalController = new SignalController({
    editMap: {
        approval: async () => {
            debugger
        }
    }
}, {
    approvalGetData: async () => {
        let recordId = ApprovalController['recordId']
        setTimeout(() => {
            ApprovalController.approvalLoading = false
        }, 200)
    },
    handleDelete: async (action, id, signal) => {},
    handleSubmitApproval: async (keyId) => {
        debugger
    },
}).signal