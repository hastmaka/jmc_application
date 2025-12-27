import {SignalController} from "@/signals/signalController/SignalController.ts";
import type {SignalType} from "@/signals/SignalClass.ts";

export const TestController: SignalType<any, any> = new SignalController({},{}).signal