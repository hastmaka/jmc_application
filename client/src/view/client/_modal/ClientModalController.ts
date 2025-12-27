import {type BasePropsType, SignalController} from "@/signals/signalController/SignalController.ts";
import type {SignalType} from "@/signals/SignalClass.ts";

type ClientModalControllerProps = BasePropsType &{

}

type ClientModalControllerMethods = {
    handleSubmit: () => void,
}


export type ClientModalControllerType = SignalType<ClientModalControllerProps, ClientModalControllerMethods>
export const ClientModalController: ClientModalControllerType = new SignalController({

},{
    async handleSubmit(){
        debugger
    }
}).signal