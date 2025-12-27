import FormGenerator from "@/components/forms/FormGenerator.jsx";
import SaveCancelBtns from "@/components/SaveCancelBtns.jsx";
import {Stack} from "@mantine/core";
import {AbcController} from "../AbcController.js";

const FIELDS = [
    {
        name: 'antecedent',
        label: 'Antecedent',
        placeholder: 'Antecedent',
        type: 'textarea'
    },
    {
        name: 'behavior',
        label: 'Behavior',
        placeholder: 'Behavior',
        type: 'textarea'
    },
    {
        name: 'maladaptive_behavior',
        label: 'Maladaptive Behavior',
        placeholder: 'Maladaptive Behavior',
        type: 'select',
        url: 'v1/asset/abc_maladaptive_behavior',
    },
    {
        name: 'consequence',
        label: 'Consequence',
        placeholder: 'Consequence',
        type: 'textarea'
    },
    {
        name: 'date',
        label: 'Start Date',
        type: 'date'
    },
]

export default function AbcModal() {
    const {
        resetState,
        handleInput, errors, formData, checkRequired,
        handleAbcSubmit,
        modal
    } = AbcController

    const handleCancel = () => {
        resetState()
        closeModal('abc')
    }
    const handleSave = async () => {
        checkRequired('approval', FIELDS)
        if (!Object.keys(errors['approval']).length > 0) {
            debugger
            await handleAbcSubmit('approval')
            resetState()
            closeModal('approval')
        }
    }

    return (
        <Stack>
            <FormGenerator
                field={FIELDS}
                structure={[1,2,2]}
                formData={formData['abc']}
                handleInput={(name, value, api) => handleInput('abc', name, value, api)}
                errors={errors['abc']}
            />

            <SaveCancelBtns
                handleCancel={handleCancel}
                handleSave={handleSave}
            />
        </Stack>
    )
}

AbcModal.propTypes = {}
