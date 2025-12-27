import EzGrid from "@/ezMantine/gridLayout/EzGrid.tsx";
import {Checkbox, Flex, Stack} from "@mantine/core";
import SaveCancelDeleteBtns from "@/components/SaveCancelDeleteBtns.tsx";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";
import {EventCreationModalController} from "./eventCreation/EventCreationModalController.ts";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {useLayoutEffect} from "react";
import EzText from "@/ezMantine/text/EzText.tsx";
import classes from './AssignRbtModal.module.scss';
import AsyncImage from "@/components/asyncImage/AsyncImage.tsx";

function AssignRbtModal() {
    const {
        assignRbtGetData,
        assignRbtData,
        assignRbtLoading,
        selectedRbt,
        handleAssignRbt
    } = EventCreationModalController

    useLayoutEffect(() => {
        assignRbtGetData().then()
        return () => {
            EventCreationModalController.selectedRbt = null
            EventCreationModalController.assignRbtData = []
            EventCreationModalController.assignRbtLoading = true
        }
    }, [])

    async function handleSave() {
        await window.toast.U({
            modalId: 'assign-rbt-modal',
            id: {
                title: `Assigning Therapist`,
                message: 'Please wait...',
            },
            update: {
                success: `Therapist assign successfully`,
                error: `Failed to assign therapist`
            },
            cb: handleAssignRbt
        })
        window.closeModal('assign-rbt-modal')
    }

    function handleCancel() {
        window.closeModal('assign-rbt-modal')
    }

    if (assignRbtLoading) return <EzLoader h={340}/>

    return (
        <Stack>
            <EzScroll needPaddingBottom mah={600}>
                {assignRbtData.length > 0
                    ? (
                        <EzGrid>
                            {assignRbtData.map((rbt: any) => {
                                return (
                                    <Checkbox.Card
                                        key={rbt.employee_id}
                                        className={classes.root}
                                        checked={selectedRbt === rbt.employee_id}
                                        radius="md"
                                        onClick={() => {
                                            EventCreationModalController.selectedRbt = rbt.employee_id;
                                        }}
                                    >
                                        <Flex gap={8}>
                                            <Checkbox.Indicator/>
                                            <AsyncImage
                                                url={rbt.employee_url_link}
                                                radius='md'
                                                mah={120}
                                                maw={120}
                                                altImg='/no_person.avif'
                                            />
                                            <Stack gap={8}>
                                                <EzText>Name: {rbt.employee_full_name}</EzText>
                                                <EzText>Certification: {rbt.employee_certification}</EzText>
                                            </Stack>
                                        </Flex>
                                    </Checkbox.Card>
                                )
                            })}
                        </EzGrid>
                    ) : (
                        <EzText>Nothing to show.</EzText>
                    )}
            </EzScroll>

            <SaveCancelDeleteBtns
                cancel={handleCancel}
                withScroll
                {...(assignRbtData.length > 0 && {
                    accept: handleSave
                })}
            />
        </Stack>
    );
}

export default AssignRbtModal;