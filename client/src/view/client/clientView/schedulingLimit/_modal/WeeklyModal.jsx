import FormGenerator from "@/components/forms/FormGenerator.jsx";
import SaveCancelBtns from "@/components/SaveCancelBtns.jsx";
import {modals} from "@mantine/modals";
import {Stack} from "@mantine/core";
import {SchedulingLimitController} from "../SchedulingLimitController.js";

const FIELDS = [
    {
        name: 'procedure',
        label: 'Choose a Procedure',
        placeholder: 'Choose a Procedure',
        type: 'remoteSelect',
        api: {
            url: 'v1/asset/scheduling_limit_procedures_weekly',
            reference: 'procedureFields',
        },
        flex: 2
    },
    {
        name: 'max_hours',
        label: 'Change Max Hours',
        placeholder: 'Change Max Hours',
        type: 'number'
    }
]

export default function DailyModal() {
    const {handleInput, formData, handleDailySubmit, modal, modalData} = SchedulingLimitController
    return (
        <Stack>
            <FormGenerator
                field={FIELDS}
                formData={formData}
                structure={[2]}
                handleInput={handleInput}
            />

            <SaveCancelBtns
                cancel={() => closeModal('weekly')}
                accept={handleDailySubmit}
            />
        </Stack>
    )
}
