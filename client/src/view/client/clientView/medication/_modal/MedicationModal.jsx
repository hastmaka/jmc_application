import FormGenerator from "@/components/forms/FormGenerator.jsx";
import SaveCancelBtns from "@/components/SaveCancelBtns.jsx";
import {Stack} from "@mantine/core";
import {MedicationController} from "@/view/client/clientGrid/clientView/medication/MedicationController.js";

const FIELDS = [
    {
        name: 'name',
        label: 'Name',
        placeholder: 'Name',
        required: true
    },
    {
        name: 'purpose',
        label: 'Purpose',
        placeholder: 'Purpose',
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
        type: 'date'
    },
    {
        name: 'dosage',
        label: 'Dosage',
        placeholder: 'Dosage',
        required: true
    },
    {
        name: 'schedule',
        label: 'Schedule',
        placeholder: 'Schedule',
        required: true
    },
    {
        name: 'side_effects',
        label: 'Side Effects',
        placeholder: 'Side Effects',
    },
    {
        name: 'prescribed_by',
        label: 'Prescribed By',
        placeholder: 'Prescribed By',
    }
]

export default function MedicationModal() {
    const {
        resetState,
        handleInput, errors, formData, checkRequired,
        handleMedicationSubmit,
        modal
    } = MedicationController;

    const handleCancel = () => {
        resetState()
        closeModal('medication')
    }
    const handleSave = async () => {
        checkRequired('medication', FIELDS)
        if (!Object.keys(errors['medication']).length > 0) {
            debugger
            await handleMedicationSubmit('medication')
            resetState()
            closeModal('medication')
        }
    }

    return (
        <Stack>
            <FormGenerator
                field={FIELDS}
                structure={[2,2,2,2]}
                handleInput={(name, value, api) => handleInput('medication', name, value, api)}
                formData={formData['medication']}
                errors={errors['medication']}
            />

            <SaveCancelBtns
                cancel={handleCancel}
                accept={handleSave}
            />
        </Stack>
    )
}

MedicationModal.propTypes = {}
