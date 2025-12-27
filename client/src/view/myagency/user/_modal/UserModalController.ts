import { SignalController} from "@/signals/signalController/SignalController.ts";
import type {SignalType} from "@/signals/SignalClass.ts";

export const UserModalController: SignalType<any, any> = new SignalController({
    editMap: {
        user: async function() {
            // {fields, id, who}

        }
    }
}, {

}).signal