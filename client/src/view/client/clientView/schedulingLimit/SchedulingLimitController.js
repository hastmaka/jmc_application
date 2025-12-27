import {SignalController} from "@/signals/SignalController.js";

export const SchedulingLimitController = new SignalController({
    editMap: {
        daily: async () => {debugger},
        weekly: async () => {debugger},
    }
}, {
    dailyGetData: async () => {
        setTimeout(() => {
            SchedulingLimitController.dailyLoading = false
            SchedulingLimitController.dailyData = [
                {
                    text: 'Max daily hours for procedure 97153:',
                    hours: 8
                },
                {
                    text: 'Max daily hours for procedure 97153:',
                    hours: 8
                },
                {
                    text: 'Max daily hours for procedure 97153:',
                    hours: 8
                },
            ]
        }, 200)
    },
    weeklyGetData: async () => {
        setTimeout(() => {
            SchedulingLimitController.weeklyLoading = false
            SchedulingLimitController.weeklyData = [
                {
                    text: 'Max daily hours for procedure 97153:',
                    hours: 8
                },
                {
                    text: 'Max daily hours for procedure 97153:',
                    hours: 8
                },
                {
                    text: 'Max daily hours for procedure 97153:',
                    hours: 8
                }
            ]
        }, 200)
    },

    handleDailySubmit: async () => {},

    handleDelete: async (action, id, signal) => {},

}).signal