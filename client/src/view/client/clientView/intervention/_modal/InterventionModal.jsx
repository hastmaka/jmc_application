import FormGenerator from "@/components/forms/FormGenerator.jsx";
import {Flex, Stack} from "@mantine/core";
import SaveCancelBtns from "@/components/SaveCancelBtns.jsx";
import {InterventionController} from "../InterventionController.js";
import {useLayoutEffect} from "react";
import PropTypes from "prop-types";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";

const FIELDS = [
    {
        name: 'skill_behavior_name',
        label: 'Enter Intervention',
        required: true
    },
    {
        name: 'skill_behavior_start_date',
        label: 'Start Date',
        type: 'date',
        required: true
    },
    {
        name: 'skill_behavior_end_date',
        label: 'End Date',
        type: 'date'
    },
    {
        name: 'skill_behavior_functions',
        label: 'Functions',
        type: 'multiSelect',
        url: 'v1/asset/maladaptive_function',
        required: true
    },
    {
        name: 'skill_behavior_definition',
        label: 'Description',
        type: 'textarea',
        autosize: true,
        minRows: 8
    },
    {
        name: 'skill_behavior_antecedent',
        label: 'Antecedent',
        type: 'checkbox',
        flex: null
    },
    {
        name: 'skill_behavior_consequence',
        label: 'Consequence',
        type: 'checkbox',
    }
]

export default function InterventionModal({id}) {
    const {
        handleInput,
        formData,
        handleInterventionSubmit,
        modal,
        modalData, errors, resetState,
        checkRequired
    } = InterventionController;

    useLayoutEffect(() => {modalData('intervention', id).then()}, [id])

    const handleSubmit = async () => {
        if (checkRequired('intervention', FIELDS)) {
            await toast.U({
                modalId: 'intervention',
                id: {
                    title: id ? 'Updating' : `Saving`,
                    message: `${id ? 'Updating' : `Saving`} intervention...`
                },
                update: {
                    success: `Intervention ${id ? 'updated' : 'created'} successfully`,
                    error: `Intervention couldn't be ${id ? 'update' : 'create'}`
                },
                cb: handleInterventionSubmit
            })
            closeModal('intervention')
            resetState()
        }
    }
    const handleCancel = () => {
        closeModal('intervention')
        resetState()
    }

    if (modal.loading) return <EzLoader h={400}/>

    return (
        <Stack>
            <Flex gap={16} flex={1}>
                <FormGenerator
                    field={FIELDS}
                    structure={[1,2,1,1,2]}
                    handleInput={(name, value, api) => handleInput('intervention', name, value, api)}
                    // inputContainer={{gap: 8}}
                    formData={{...formData['intervention']}}
                    errors={errors['intervention']}
                />
            </Flex>

            <SaveCancelBtns
                cancel={handleCancel}
                accept={handleSubmit}
            />
        </Stack>
    )
}

InterventionModal.propTypes = {
    id: PropTypes.number
}
