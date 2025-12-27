import GenericModal from "@/components/modal/GenericModal.tsx";
import {useLayoutEffect, useMemo} from "react";
import {Stack, Switch} from "@mantine/core";
import FormGenerator from "@/components/form/FormGenerator.tsx";
import EzText from "@/ezMantine/text/EzText.tsx";
import {AssetModalController} from "@/view/asset/_modal/AssetModalController.ts";

export default function AddEditAssetOptionModal({
    assetId,
    modalId
}: {
    modalId: string
    assetId?: number,
}) {
    const {
        modalData,
        formData,
        handleInput,
        errors,
        checkRequired,
        handleEditAssetOption,
        handleSaveAssetOption,
        resetState,
    } = AssetModalController
    const isCheck = formData?.['asset_option']?.['asset_option_active']

    const FIELDS =
        useMemo(() => [
            {
                type: 'component',
                name: 'asset_option_active',
                component: (
                    <Stack gap={8}>
                        <EzText>Active</EzText>
                        <Switch
                            checked={isCheck}
                            size="md"
                            onChange={(v) =>
                                handleInput('asset_option', 'asset_option_active', v.target.checked)}
                        />
                    </Stack>
                ),
            },
            {
                name: 'asset_option_name',
                label: 'Asset Option Name',
                required: true,
            }
        ], [isCheck])

    useLayoutEffect(() => {
        if (assetId) modalData('assetOption', FIELDS, +assetId).then()
    }, []);

    async function handleSubmit(){
        if (checkRequired('asset_option', FIELDS)) {
            return await window.toast.U({
                modalId,
                id: {
                    title: `${assetId ? 'Editing' : 'Creating'} asset option.`,
                    message: 'Please wait...',
                },
                update: {
                    success: `Asset Option ${assetId ? 'updated' : 'created'} successfully.`,
                    error: `Failed to ${assetId ? 'update' : 'create'} asset option.`
                },
                cb: async () => {
                    if (assetId) return await handleEditAssetOption(modalId)
                    await handleSaveAssetOption(modalId)
                }
            })
        }
    }

    return (
        <GenericModal
            accept={handleSubmit}
            cancel={() => {
                resetState()
                window.closeModal(modalId)
            }}
        >
            <FormGenerator
                field={FIELDS}
                structure={[2]}
                handleInput={(name: any, value: any) =>
                    handleInput('asset_option', name, value)}
                formData={formData?.['asset_option']}
                errors={errors?.['asset_option']}
            />
        </GenericModal>
    );
}