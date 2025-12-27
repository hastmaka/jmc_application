import {SignalController} from "@/signals/signalController/SignalController.ts";

export const DownloadController = new SignalController({
    activeTab: 'combustible',
    filterMode: 'month' as 'day' | 'month' | 'year',
    selectedDate: new Date(),
    selectedDriver: null as string | null,
},{
    setActiveTab: function(this: any, tab: string) {
        this.activeTab = tab;
    },
    setFilterMode: function(this: any, mode: 'day' | 'month' | 'year') {
        this.filterMode = mode;
    },
    setSelectedDate: function(this: any, date: Date) {
        this.selectedDate = date;
    },
    setSelectedDriver: function(this: any, driverId: string | null) {
        this.selectedDriver = driverId;
    }
}).signal
