import {type BasePropsType, SignalController} from "@/signals/signalController/SignalController.js";
import type {SignalType} from "@/signals/SignalClass.ts";

type DocumentControllerProps = BasePropsType & {

}

type DocumentControllerMethods = {
    documentGetData: () => Promise<void>;
}

export type DocumentControllerType = SignalType<DocumentControllerProps, DocumentControllerMethods>

export const DocumentController: DocumentControllerType = new SignalController({

}, {
    documentGetData: async () => {},
    sending: function (this: DocumentControllerType){
        this.modal!.loading = true
    },
}).signal