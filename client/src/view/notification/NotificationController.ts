import {SignalController} from "@/signals/signalController/SignalController.ts";
import type {SignalType} from "@/signals/SignalClass.ts";
import {FetchApi} from "@/api/FetchApi.ts";
import {getModel} from "@/api/models";
// import {socket} from "@/signals/ioSignal.ts";

export const NotificationController: SignalType<any, any> =
    new SignalController({
        notiTotal: null
    }, {
        notificationGetData: async function(this: any){
            const response = await FetchApi('v1/notification')
            this.notiTotal = response.data.length
            this.notificationData = response.data.map((noti: any) =>
                new (getModel("notification"))(noti)
            );
            this.notificationLoading = false
        },
    }).signal;

// socket.on("clients", (_data: any) => {
    // NotificationController.notiTotal = 9
// })