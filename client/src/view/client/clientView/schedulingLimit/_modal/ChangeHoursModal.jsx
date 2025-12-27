import PropTypes from "prop-types";
import {Stack} from "@mantine/core";
import FormGenerator from "@/components/forms/FormGenerator.jsx";
import SaveCancelBtns from "@/components/SaveCancelBtns.jsx";
import {SchedulingLimitController} from "../SchedulingLimitController.js";

export default function ChangeHoursModal({modalId}) {
    const {
        resetState,
        handleInput, errors, formData, checkRequired,
        modal
    } = SchedulingLimitController

    const FIELDS = [{
        name: `${modalId}_max_hours`,
        label: 'Max Hours',
        type: 'number'
    }]

    const handleCancel = () => {
        resetState()
        closeModal(modalId)
    }
    const handleSave = async () => {
        checkRequired('approval', FIELDS)
        if (!Object.keys(errors[modalId]).length > 0) {
            debugger
            resetState()
            closeModal(modalId)
        }
    }

    return (
        <Stack>
            <FormGenerator
                field={FIELDS}
                structure={[1]}
                handleInput={(name, value, api) => handleInput(modalId, name, value, api)}
                formData={formData[modalId]}
                errors={errors[modalId]}
            />

            <SaveCancelBtns
                cancel={handleCancel}
                accept={handleSave}
            />
        </Stack>
    )
}

ChangeHoursModal.propTypes = {
    modalId: PropTypes.string.isRequired
}
