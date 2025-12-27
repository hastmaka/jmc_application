import GenericModal from "@/components/modal/GenericModal.tsx";
import {useMemo} from "react";
import FormGenerator from "@/components/form/FormGenerator.tsx";
import {AssetModalController} from "@/view/asset/_modal/AssetModalController.ts";

export default function AddEditAssetModal({
    modalId
}: {
    modalId: string
}) {
    const {
        formData,
        handleInput,
        errors,
        checkRequired,
        handleSaveAsset,
        resetState,
    } = AssetModalController

    const FIELDS = useMemo(() => [
        {
            name: 'asset_name',
            label: 'Category Name',
            placeholder: 'e.g. car_status, payment_method',
            required: true,
        }
    ], [])

    async function handleSubmit() {
        if (checkRequired('asset', FIELDS)) {
            return await window.toast.U({
                modalId,
                id: {
                    title: 'Creating category.',
                    message: 'Please wait...',
                },
                update: {
                    success: 'Category created successfully.',
                    error: 'Failed to create category.'
                },
                cb: async () => {
                    await handleSaveAsset(modalId)
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
                structure={[1]}
                handleInput={(name: any, value: any) =>
                    handleInput('asset', name, value)}
                formData={formData?.['asset']}
                errors={errors?.['asset']}
            />
        </GenericModal>
    );
}
