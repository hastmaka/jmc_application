import FormGenerator from "@/components/forms/FormGenerator.jsx";
import SaveCancelBtns from "@/components/SaveCancelBtns.jsx";
import {Stack} from "@mantine/core";
import {RestrictionController} from "../RestrictionController.js";

const FIELDS = [

    {
        name: 'start_date',
        label: 'Start Date',
        type: 'dateTimePicker'
    },
    {
        name: 'end_date',
        label: 'End Date',
        type: 'dateTimePicker'
    },
    {
        name: 'description',
        label: 'Description',
        placeholder: 'Description',
        type: 'textarea'
    },
]

export default function RestrictionModal() {
    const {
        resetState,
        handleInput, errors, formData, checkRequired,
        handleSubmitRestriction,
        modal
    } = RestrictionController;

    const handleCancel = () => {
        resetState()
        closeModal('restriction')
    }
    const handleSave = async () => {
        checkRequired('approval', FIELDS)
        if (!Object.keys(errors['approval']).length > 0) {
            debugger
            await handleSubmitRestriction('restriction')
            resetState()
            closeModal('restriction')
        }
    }

    return (
        <Stack>
            <FormGenerator
                field={FIELDS}
                structure={[2,1]}
                handleInput={(name, value, api) => handleInput('restriction', name, value, api)}
                formData={formData['restriction']}
                errors={errors['restriction']}
            />

            <SaveCancelBtns
                cancel={handleCancel}
                accept={handleSave}
            />
        </Stack>
    )
}

RestrictionModal.propTypes = {}
