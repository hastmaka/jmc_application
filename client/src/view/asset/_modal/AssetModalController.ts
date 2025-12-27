import {SignalController} from "@/signals/signalController/SignalController.ts";
import type {SignalType} from "@/signals/SignalClass.ts";
import {FetchApi} from "@/api/FetchApi.ts";
import {AssetController} from "@/view/asset/AssetController.ts";

export const AssetModalController: SignalType<any, any> = new SignalController({
    editMap: {
        asset: async function() {},
        assetOption: async function(fields, id) {
            const response = await FetchApi(`v1/asset-option/${id}`)
            AssetModalController.fields = fields
            AssetModalController.populateForm('asset_option', fields, response.data)
        }
    }
}, {
    // Asset Option CRUD
    handleSaveAssetOption: async function(this: any, modalId: string) {
        const assetOption = {
            ...this.formData.asset_option,
            asset_name: AssetController.selectedAsset
        }

        const response = await FetchApi(
            'v1/asset-option',
            'POST',
            assetOption
        )

        if (response.success) {
            await AssetController.optionsGetData()
            window.closeModal(modalId)
        } else {
            throw response
        }
    },
    handleEditAssetOption: async function(this: any, modalId: string) {
        const response = await FetchApi(
            'v1/asset-option',
            'PUT',
            this.dirtyFields
        )

        if (response.success) {
            await AssetController.optionsGetData()
            window.closeModal(modalId)
        } else {
            throw response
        }
    },

    // Asset CRUD
    handleSaveAsset: async function(this: any, modalId: string) {
        const asset = this.formData.asset

        const response = await FetchApi(
            'v1/asset',
            'POST',
            asset
        )

        if (response.success) {
            await AssetController.assetGetData()
            window.closeModal(modalId)
        } else {
            throw response
        }
    },
}).signal
