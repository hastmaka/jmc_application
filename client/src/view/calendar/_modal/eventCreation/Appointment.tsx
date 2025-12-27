import {Select, Stack} from "@mantine/core";
import FormGenerator from "@/components/form/FormGenerator.tsx";
import {EventCreationModalController} from "./EventCreationModalController.ts";
import SegmentedView from "@/view/calendar/_modal/eventCreation/SegmentedView.tsx";
import type {FormFieldProps} from "@/types";

export const APPOINTMENTITEMS = [
    {label: "Behavior Treatment", value: "behavior_treatment"},
    {label: "Family Training", value: "family_training"},
    {label: "RBT Supervision", value: "rbt_supervision"},
    {label: "BCaBA Supervision", value: "bcaba_supervision"},
    {label: "RBT Competency", value: "rbt_competency"},
    {label: "Medical Visit", value: "medical_visit"},
    {label: "Assessment", value: "assessment"},
    {label: "Reassessment", value: "reassessment"},
];

function Appointment({
     fields
}: {
    fields: Record<string, FormFieldProps[]>
}) {
    const {
        formData,
        handleInput,
        errors,
        activeSelect,
        setActiveSelect,
        updateModalHeaderFromClient,
        updateModalHeaderFromRbt,
        modal
    } = EventCreationModalController;

    const isSegmentedView = ["rbt_supervision", "bcaba_supervision"].includes(activeSelect);

    const STRUCTURE: Record<string, number[]> = {
        behavior_treatment: [ 2, 4, 1],
        family_training: [2, 4, 1, 1],
        rbt_supervision_individual: [3, 4, 1],
        rbt_supervision_group: [1, 4, 2, 1],
        bcaba_supervision_individual: [3, 4, 1],
        bcaba_supervision_group: [1, 4, 2, 1],
        rbt_competency: [3, 4],
        medical_visit: [2, 4],
        assessment: [1],
        reassessment: [1],
    }

    return (
        <Stack>
            <Select
                value={activeSelect}
                disabled={modal.state === 'editing'}
                label="Select Type of Appointment"
                placeholder="Pick value"
                checkIconPosition="left"
                data={APPOINTMENTITEMS}
                onChange={(v) => {
                    if (v) setActiveSelect(v);
                }}
            />

            {isSegmentedView ? (
                <SegmentedView fields={fields} structure={STRUCTURE}/>
            ) : (
                <FormGenerator
                    field={(fields as any)[activeSelect]}
                    structure={STRUCTURE[activeSelect]}
                    handleInput={async (name, value, api) => {
                        handleInput("appointment", name, value, api);

                        if (name === "client_client_id" && value) {
                            await updateModalHeaderFromClient(value)
                        }
                        if (name === 'rbt_name' && value)
                            await updateModalHeaderFromRbt(value)

                    }}
                    formData={formData!["appointment"]}
                    errors={errors!["appointment"]}
                />
            )}
        </Stack>
    );
}

export default Appointment;