import {FetchApi} from "@/api/FetchApi.ts";
import {SignalController} from "@/signals/signalController/SignalController.ts";
import type {SignalType} from "@/signals/SignalClass.ts";

export const AssetController: SignalType<any, any> = new SignalController({
    selectedAsset: null as string | null,
    searchFilter: '',
    isAddingOrEditing: false,
}, {
    // Asset
    assetGetData: async function(this: any) {
        const response = await FetchApi('v1/asset');
        this.assetData = response.data;
        this.assetLoading = false;
    },

    // Options - auto creates optionsData: [] and optionsLoading: true
    optionsGetData: async function(this: any) {
        const response = await FetchApi(`v1/asset/return-all/${this.selectedAsset}`);
        this.optionsData = response.data;
        this.optionsLoading = false;
    },

    // Selection & filtering
    handleSelectAsset: async function(this: any, key: string) {
        this.selectedAsset = key;
        this.optionsLoading = true;
        await this.optionsGetData();
    },

    handleDeleteAssetOption: async function(this: any, asset_option_id: number, modalId: string) {
        const response = await FetchApi(`v1/asset-option/${asset_option_id}`, 'DELETE')

        if (response.success) {
            this.optionsLoading = true
            window.closeModal(modalId)
            await this.optionsGetData()
        } else {
            throw response
        }
    },

    setSearchFilter: function(this: any, value: string) {
        this.searchFilter = value;
    },

    handleToggleAssetOptionActive: async function(this: any, asset_option_id: number, asset_option_active: boolean) {
        const response = await FetchApi(
            'v1/asset-option',
            'PUT',
            {asset_option_id, asset_option_active: !asset_option_active}
        )

        if (response.success) {
            this.optionsLoading = true
            await this.optionsGetData()
        } else {
            throw response
        }
    },

    // Computed getters
    getFilteredKeys: function(this: any): string[] {
        if (!this.assetData) return [];
        const keys = Object.keys(this.assetData);
        if (!this.searchFilter) return keys;
        return keys.filter((key: string) =>
            key.toLowerCase().includes(this.searchFilter.toLowerCase())
        );
    },

    getSelectedOptions: function(this: any): any[] {
        if (!this.optionsData || !this.selectedAsset) return [];
        return this.optionsData;
    },

    getOptionCount: function(this: any, key: string): number {
        if (!this.assetData || !this.assetData[key]) return 0;
        return this.assetData[key].length;
    },
}).signal
