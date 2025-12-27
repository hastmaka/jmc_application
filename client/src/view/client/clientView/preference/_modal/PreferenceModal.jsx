import FormGenerator from "@/components/forms/FormGenerator.jsx";
import SaveCancelBtns from "@/components/SaveCancelBtns.jsx";
import {Stack} from "@mantine/core";
import {PreferenceController} from "../PreferenceController.js";
import {useLayoutEffect, useMemo} from "react";

export default function PreferenceModal() {
    const {
        resetState,
        handleInput, errors, formData, checkRequired,
        handlePreferenceSubmit,
        modal
    } = PreferenceController;
    const needSubCategory = ['2', '3'].includes(formData?.['preference']?.['preference_category'])
    const categoryValue = formData?.['preference']?.['preference_category'];
    const subCategoryUrl = categoryValue === '2'
        ? 'v1/asset/preference_sub_category_tangibles'
        : 'v1/asset/preference_sub_category_activities'

    useLayoutEffect(() => {
        formData.preference = {}
        formData.preference.preference_sub_category = '';
    }, [])

    useLayoutEffect(() => {
        if ('preference' in formData) {
            if (needSubCategory && formData?.['preference']?.['preference_sub_category'] || !needSubCategory) {
                formData['preference']['preference_sub_category'] = ''
            }
        }

    }, [categoryValue]);

    const FIELDS = useMemo(() => [
        {
            name: 'preference_name',
            label: 'Name',
            placeholder: 'Name',
            required: true
        },
        {
            name: 'preference_category',
            label: 'Category',
            placeholder: 'Category',
            url: 'v1/asset/preference_category',
            type: 'select',
            required: true
        },
        {
            name: 'preference_sub_category',
            label: 'Sub Category',
            placeholder: 'Sub Category',
            url: subCategoryUrl,
            type: 'select',
            required: needSubCategory,
            disabled: !needSubCategory,
        },
        {
            name: 'preference_start_date',
            label: 'Start Date',
            type: 'date',
            required: true
        },
        {
            name: 'preference_end_date',
            label: 'Start Date',
            type: 'date'
        },
    ], [needSubCategory, subCategoryUrl])

    const handleCancel = () => {
        resetState()
        closeModal('preference')
    }
    const handleSave = async () => {
        checkRequired('preference', FIELDS)
        if (!Object.keys(errors['preference']).length > 0) {
            debugger
            await handlePreferenceSubmit('preference')
            resetState()
            closeModal('preference')
        }
    }

    return (
        <Stack>
            {/*<EzLoadingOverlay modal={modal}/>*/}
            <FormGenerator
                field={FIELDS}
                structure={[3,2]}
                handleInput={(name, value, api) => handleInput('preference', name, value, api)}
                formData={formData['preference']}
                errors={errors['preference']}
            />

            <SaveCancelBtns
                cancel={handleCancel}
                accept={handleSave}
            />
        </Stack>
    )
}

PreferenceModal.propTypes = {}
