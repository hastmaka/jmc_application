import PropTypes from "prop-types";
import {Divider, Flex, Stack} from "@mantine/core";
import FormGenerator from "@/components/forms/FormGenerator.jsx";
import CreateTabs from "@/components/modal/createEditTabs/CreateTabs.jsx";
import EditTabs from "@/components/modal/createEditTabs/EditTabs.jsx";
import SaveCancelBtns from "@/components/SaveCancelBtns.jsx";
import {CompetenceController} from "../CompetenceController.js";
import {useLayoutEffect} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";

const FIELDS = [
    {
        name: 'skill_behavior_name',
        label: 'Name',
        required: true
    },
    {
        name: 'skill_behavior_start_date',
        label: 'Start Date',
        type: 'date',
        required: true
    },
    {
        name: 'skill_behavior_status',
        label: 'Status',
        type: 'select',
        url: 'v1/asset/competence_status',
        required: true
    },
    {
        name: 'skill_behavior_procedure',
        label: 'Procedure',
        type: 'textarea',
        autosize: true,
        minRows: 11
    }
]

export default function RbtCompetenceModal({id}) {
    const {
        resetState,
        handleInput, errors, formData, checkRequired,
        handleSubmitCompetence,
        modal,
        modalData
    } = CompetenceController

    useLayoutEffect(() => {modalData('rbt_caregiver_competence', id, 5).then()}, [id])

    const handleCancel = () => {
        resetState()
        closeModal('rbt_competence')
    }
    const handleSave = async () => {
        if (checkRequired('skill_behavior', FIELDS)) {
            await toast.U({
                modalId: 'rbt_competence',
                id: {
                    title: id ? 'Updating' : `Saving`,
                    message: `${id ? 'Updating' : `Saving`} rbt competence...`
                },
                update: {
                    success: `Rbt Competence ${id ? 'updated' : 'created'} successfully`,
                    error: `Rbt Competence couldn't be ${id ? 'update' : 'create'}`
                },
                cb: async () => handleSubmitCompetence(5)
            })
            resetState()
            closeModal('rbt_competence')
        }
    }

    if (modal.loading) return <EzLoader h={700}/>

    return (
        <Stack>
            <Flex gap={16} flex={1}>
                <FormGenerator
                    field={FIELDS}
                    structure={[1,2,1]}
                    handleInput={(name, value, api) => handleInput('skill_behavior', name, value, api)}
                    formData={{...formData['skill_behavior']}}
                    errors={errors['skill_behavior']}
                />

                <Divider orientation='vertical'/>

                {modal.state === 'create'
                    ? <CreateTabs signal={CompetenceController} task who={5}/>
                    : <EditTabs signal={CompetenceController} task who={5}/>
                }

            </Flex>

            <SaveCancelBtns
                cancel={handleCancel}
                accept={handleSave}
            />
        </Stack>
    )
}

RbtCompetenceModal.propTypes = {
    id: PropTypes.number
}
