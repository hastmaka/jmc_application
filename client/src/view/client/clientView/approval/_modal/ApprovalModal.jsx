import {useLayoutEffect, useMemo} from "react";
import {Flex, Stack} from "@mantine/core";
import FormGenerator from "@/components/forms/FormGenerator.jsx";
import SaveCancelBtns from "@/components/SaveCancelBtns.jsx";
import {ApprovalController} from "../ApprovalController.js";

export default function ApprovalModal() {
    const {
        resetState,
        handleInput, errors, formData, checkRequired,
        handleSubmitApproval,
        modal
    } = ApprovalController
    const isProvisional = formData?.['approval']?.['set_as_provisional']
    const isAvailableUnits = formData?.['approval']?.['set_available_units']

    useLayoutEffect(() => {
        formData.approval = {}
        formData.approval.pa_number = ''
    }, [])

    useLayoutEffect(() => {
        if ('approval' in formData) {
            formData.approval.pa_number = isProvisional ? 'Provisional' : ''
        }
    }, [isProvisional]);

    const FIELDS = useMemo(() => [
        {
            name: 'set_as_provisional',
            label: 'Set as Provisional',
            // description: 'Create this record as a provisional record',
            type: 'checkbox',
        },
        {
            name: 'set_available_units',
            label: 'Set Available Units',
            // description: 'Create this record as a provisional record',
            type: 'checkbox',
        },
        {
            name: 'pa_number',
            label: 'PA Number',
            required: true,
            disabled: isProvisional
        },
        {
            name: 'procedure',
            label: 'Procedure',
            type: 'select',
            url: 'v1/asset/approval_procedures',
            required: true
        },
        {
            name: 'unit',
            label: 'Units',
            required: true
        },
        {
            name: 'available_units',
            label: 'Available Units',
            placeholder: 'Check set available units',
            type: 'number',
            disabled: !isAvailableUnits
        },
        {
            name: 'start_date',
            label: 'Start Date',
            type: 'date',
            required: true
        },
        {
            name: 'end_date',
            label: 'Start Date',
            type: 'date',
            required: true
        },
    ], [isProvisional, isAvailableUnits])

    const handleCancel = () => {
        resetState()
        closeModal('approval')
    }
    const handleSave = async () => {
        if (checkRequired('approval', FIELDS)) {
            debugger
            await handleSubmitApproval('approval')
            resetState()
            closeModal('approval')
        }
    }

    return (
        <Stack>
            <Flex gap={16} flex={1}>
                <FormGenerator
                    field={FIELDS}
                    structure={[2, 2, 2, 2]}
                    handleInput={(name, value, api) => handleInput('approval', name, value, api)}
                    formData={formData['approval']}
                    errors={errors['approval']}
                />
            </Flex>

            <SaveCancelBtns
                cancel={handleCancel}
                accept={handleSave}
            />
        </Stack>
    )
}

ApprovalModal.propTypes = {}
