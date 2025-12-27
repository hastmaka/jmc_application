import PropTypes from "prop-types";
import {SkillsAndBehaviorController} from "../SkillsAndBehaviorController.js";
import {Divider, Flex, Stack} from "@mantine/core";
import FormGenerator from "@/components/forms/FormGenerator.jsx";
import SaveCancelBtns from "@/components/SaveCancelBtns.jsx";
import CreateTabs from "@/components/modal/createEditTabs/CreateTabs.jsx";
import EditTabs from "@/components/modal/createEditTabs/EditTabs.jsx";
import TabContainer from "@/components/modal/createEditTabs/_local/TabContainer.jsx";
import {useEffect, useLayoutEffect, useRef} from "react";
import {deepSignal} from "deepsignal/react";
import {SaveChangeModal} from "@/components/modal/SaveChangeModal.jsx";
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
        name: 'skill_behavior_measure',
        label: 'Measure',
        type: 'select',
        url: 'v1/asset/maladaptive_measure',
        required: true
    },
    {
        name: 'skill_behavior_status',
        label: 'Status',
        type: 'select',
        url: 'v1/asset/maladaptive_status',
        required: true
    },
    {
        name: 'skill_behavior_objective',
        label: 'Objectives',
        type: 'textarea',
        autosize: true,
        minRows: 2
    },
    {
        name: 'skill_behavior_definition',
        label: 'Definition',
        type: 'textarea',
        autosize: true,
        minRows: 2
    },
    {
        name: 'skill_behavior_barrier',
        label: 'Barrier',
        type: 'textarea',
        autosize: true,
        minRows: 2
    },
    {
        name: 'skill_behavior_procedure',
        label: 'Procedures',
        type: 'textarea',
        autosize: true,
        minRows: 2
    },
    {
        name: 'skill_behavior_teaching_material',
        label: 'Teaching Material',
        type: 'textarea',
        autosize: true,
        minRows: 2
    },
]

export default function ReplacementBehaviorModal({id}) {
    const {
        resetState,
        handleInput,
        errors,
        formData,
        checkRequired,
        handleSubmitSkillBehavior,
        modal,
        modalData,
    } = SkillsAndBehaviorController

    // we have to keep track of the previous value of the measure for user cases
    const local = useRef(deepSignal({
        tempSkillBehaviorMeasure: formData['skill_behavior']?.['skill_behavior_measure']
    })).current

    useEffect(() => {
        local.tempSkillBehaviorMeasure = formData['skill_behavior']?.['skill_behavior_measure']
    }, [modal.loading])

    useLayoutEffect(() => {modalData('skill_behavior', id, 2).then()}, [id])

    const handleCancel = () => {
        resetState()
        closeModal('replacement_behavior')
    }
    const handleSubmit = async () => {
        if (checkRequired('skill_behavior', FIELDS)) {
            await toast.U({
                modalId: 'replacement_behavior',
                id: {
                    title: id ? 'Updating' : `Saving`,
                    message: `${id ? 'Updating' : `Saving`} replacement behavior...`
                },
                update: {
                    success: `Replacement behavior ${id ? 'updated' : 'created'} successfully`,
                    error: `Replacement behavior couldn't be ${id ? 'update' : 'create'}`
                },
                cb: async () => handleSubmitSkillBehavior(2)
            })
            closeModal('replacement_behavior')
            resetState()
        }
    }
    const handleMeasureChange = async (name, value, api) => {
        if (checkRequired('skill_behavior', FIELDS)) {
            handleInput('skill_behavior', name, value, api)
            await toast.U({
                modalId: 'update_measure',
                id: {
                    title: 'Updating',
                    message: 'Updating measure...'
                },
                update: {
                    success: 'Measure updated successfully',
                    error: `Measure couldn't be updated`
                },
                cb: async () => handleSubmitSkillBehavior(2)
            })
            closeModal('update_measure')
        } else {
            closeModal('update_measure')
            toast.W('Please fill all required fields')
        }
    }

    if (modal.loading) return <EzLoader h={700}/>

    return (
        <Stack>
            <Flex gap={8} flex={1}>
                <TabContainer flex={1} pr={4}>
                    <FormGenerator
                        field={FIELDS}
                        structure={[2,2,1,1,1,1,1]}
                        handleInput={(name, value, api) => {
                            // because we need to know if measure changed, to reset STOs and LTOs
                            if (name === 'skill_behavior_measure' && value && modal.state === 'edit') {
                                // we store the previous value in a state and compare it
                                // const tempSkillBehaviorMeasure = formData['skill_behavior']['skill_behavior_measure']
                                if (value !== local.tempSkillBehaviorMeasure) {
                                    return openModal({
                                        modalId: 'update_replacement_behavior',
                                        title: 'Confirm Action',
                                        size: 'sm',
                                        children: (
                                            <SaveChangeModal
                                                message='You are about to change the measure, this will reset Measure'
                                                handleCancel={() => closeModal('update_replacement_behavior')}
                                                handleSave={async () => {
                                                    await handleMeasureChange(name, value, api)
                                                }}
                                            />
                                        ),
                                        onClose: () => {}
                                    })
                                }
                                handleInput('skill_behavior', name, value, api)
                            }
                            handleInput('skill_behavior', name, value, api)
                        }}
                        formData={formData['skill_behavior']}
                        errors={errors['skill_behavior']}
                    />
                </TabContainer>
                <Divider orientation='vertical'/>

                {modal.state === 'create'
                    ? <CreateTabs signal={SkillsAndBehaviorController} who={2}/>
                    : <EditTabs signal={SkillsAndBehaviorController} who={2}/>
                }

            </Flex>

            <SaveCancelBtns
                cancel={handleCancel}
                accept={handleSubmit}
            />
        </Stack>
    )
}

ReplacementBehaviorModal.propTypes = {
    id: PropTypes.number
}
