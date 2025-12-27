import {Divider, Flex, Stack} from "@mantine/core";
import SaveCancelDeleteBtns from "@/components/SaveCancelDeleteBtns.tsx";
import {useEffect, useLayoutEffect, useRef} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader";
import {deepSignal} from "deepsignal/react";
import type {FormField} from "@/types";
import { SkillsAndBehaviorController } from "../SkillsAndBehaviorController";

const FIELDS: FormField[] = [
    {
        name: "skill_behavior_name",
        label: "Name",
        required: true,
    },
    {
        name: "skill_behavior_start_date",
        label: "Start Date",
        type: "date",
        required: true,
    },
    {
        name: "skill_behavior_intensity",
        label: "Intensity",
        type: "select",
        fieldProps: {
            url: "v1/asset/maladaptive_intensity",
        }
    },
    {
        name: "skill_behavior_measure",
        label: "Measure",
        type: "select",
        fieldProps: {
            url: "v1/asset/maladaptive_measure",
        },
        required: true,
    },
    {
        name: "skill_behavior_status",
        label: "Status",
        type: "select",
        fieldProps: {
            url: "v1/asset/maladaptive_status",
        },
        required: true,
    },
    {
        name: "skill_behavior_functions",
        label: "Functions",
        type: "multiSelect",
        fieldProps: {
            url: "v1/asset/maladaptive_function",
        },
    },
    {
        name: "skill_behavior_topography",
        label: "Topography",
        type: "textarea",
        autosize: true,
        minRows: 11,
    },
];

interface MaladaptiveBehaviorModalProps {
    id?: number;
}

export default function MaladaptiveBehaviorModal({id}: MaladaptiveBehaviorModalProps) {
    const {
        resetState,
        handleInput,
        errors,
        formData,
        checkRequired,
        handleSubmitSkillBehavior,
        modal,
        modalData,
    } = SkillsAndBehaviorController;

    // we have to keep track of the previous value of the measure for user cases
    const local = useRef(
        deepSignal<{ tempSkillBehaviorMeasure: string | undefined }>({
            tempSkillBehaviorMeasure: formData["skill_behavior"]?.["skill_behavior_measure"],
        })
    ).current;

    useEffect(() => {
        local.tempSkillBehaviorMeasure = formData["skill_behavior"]?.["skill_behavior_measure"];
    }, [modal.loading]);

    useLayoutEffect(() => {
        modalData("skill_behavior", id, 1).then();
    }, [id]);

    const handleCancel = () => {
        resetState();
        closeModal("maladaptive_behavior");
    };

    const handleSubmit = async () => {
        if (checkRequired("skill_behavior", FIELDS)) {
            await toast.U({
                modalId: "maladaptive_behavior",
                id: {
                    title: id ? "Updating" : `Saving`,
                    message: `${id ? "Updating" : `Saving`} maladaptive behavior...`,
                },
                update: {
                    success: `Maladaptive behavior ${id ? "updated" : "created"} successfully`,
                    error: `Maladaptive behavior couldn't be ${id ? "update" : "create"}`,
                },
                cb: async () => handleSubmitSkillBehavior(1),
            });
            closeModal("maladaptive_behavior");
            resetState();
        }
    };

    const handleMeasureChange = async (name: string, value: unknown, api?: string) => {
        if (checkRequired("skill_behavior", FIELDS)) {
            handleInput("skill_behavior", name, value, api);
            await toast.U({
                modalId: "update_measure",
                id: {
                    title: "Updating",
                    message: "Updating measure...",
                },
                update: {
                    success: "Measure updated successfully",
                    error: `Measure couldn't be updated`,
                },
                cb: async () => handleSubmitSkillBehavior(1),
            });
            closeModal("update_measure");
        } else {
            closeModal("update_measure");
            toast.W("Please fill all required fields");
        }
    };

    if (modal.loading) return <EzLoader h={700}/>;

    return (
        <Stack>
            <Flex gap={8} flex={1}>
                <TabContainer flex={1} pr={4}>
                    <FormGenerator
                        field={FIELDS}
                        handleInput={(name: string, value: unknown, api?: string) => {
                            if (name === "skill_behavior_measure" && value && modal.state === "edit") {
                                if (value !== local.tempSkillBehaviorMeasure) {
                                    return openModal({
                                        modalId: "update_measure",
                                        title: "Confirm Action",
                                        size: "sm",
                                        children: (
                                            <SaveChangeModal
                                                message="You are about to change the measure, this will reset Measure"
                                                handleCancel={() => closeModal("update_measure")}
                                                handleSave={async () => {
                                                    await handleMeasureChange(name, value, api);
                                                }}
                                            />
                                        ),
                                        onClose: () => {
                                        },
                                    });
                                }
                                handleInput("skill_behavior", name, value, api);
                            }
                            handleInput("skill_behavior", name, value, api);
                        }}
                        structure={[1, 2, 2, 1, 1]}
                        formData={formData["skill_behavior"]}
                        errors={errors["skill_behavior"]}
                    />
                </TabContainer>
                <Divider orientation="vertical"/>

                {modal.state === "create" ? (
                    <CreateTabs signal={SkillsAndBehaviorController} who={1}/>
                ) : (
                    <EditTabs signal={SkillsAndBehaviorController} who={1}/>
                )}
            </Flex>

            <SaveCancelDeleteBtns cancel={handleCancel} accept={handleSubmit}/>
        </Stack>
    );
}