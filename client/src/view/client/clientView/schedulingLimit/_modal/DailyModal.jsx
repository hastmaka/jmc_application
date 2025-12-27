import FormGenerator from "@/components/forms/FormGenerator.jsx";
import SaveCancelBtns from "@/components/SaveCancelBtns.jsx";
import {Stack} from "@mantine/core";
import {SchedulingLimitController} from "../SchedulingLimitController.js";

const FIELDS = [
    {
        name: 'procedure',
        label: 'Choose a Procedure',
        placeholder: 'Choose a Procedure',
        type: 'select',
        url: 'v1/asset/scheduling_limit_procedures_daily',
        flex: 2
    },
    {
        name: 'max_hours',
        label: 'Change Max Hours',
        placeholder: 'Change Max Hours',
        type: 'number',
    }
]

export default function DailyModal() {
    const {
        resetState,
        handleInput, errors, formData, checkRequired,
        modal
    } = SchedulingLimitController

    const handleCancel = () => {
        resetState()
        closeModal('daily')
    }
    const handleSave = async () => {
        checkRequired('daily', FIELDS)
        if (!Object.keys(errors['daily']).length > 0) {
            debugger
            resetState()
            closeModal('daily')
        }
    }

    return (
        <Stack>
            <FormGenerator
                field={FIELDS}
                structure={[2]}
                handleInput={(name, value, api) => handleInput('daily', name, value, api)}
                formData={formData['daily']}
                errors={errors['daily']}
            />

            <SaveCancelBtns
                cancel={handleCancel}
                accept={handleSave}
            />
        </Stack>
    )
}
