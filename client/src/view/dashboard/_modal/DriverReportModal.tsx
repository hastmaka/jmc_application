import {useLayoutEffect, useMemo, useState} from "react";
import {ActionIcon, Button, Card, Fieldset, Flex, Group, SimpleGrid, Stack} from "@mantine/core";
import FormGenerator from "@/components/form/FormGenerator.tsx";
import EzText from "@/ezMantine/text/EzText.tsx";
import {DashboardModalController} from "@/view/dashboard/_modal/DashboardModalController.ts";
import { IconPlus, IconTrash} from "@tabler/icons-react";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";
import SaveCancelDeleteBtns from "@/components/SaveCancelDeleteBtns.tsx";
import VehicleSection from "@/view/dashboard/_modal/VehicleSection.tsx";
import ReservationsSection from "@/view/dashboard/_modal/ReservationsSection.tsx";
import {getVehicleRequiredFields} from "@/view/dashboard/_modal/vehicleFields.tsx";
import TimeInputWithPicker from "@/components/TimeInputWithPicker.tsx";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import GenericModal from "@/components/modal/GenericModal.tsx";

export default function DriverReportModal({
    inspectionId,
    modalId
}: {
    modalId: string
    inspectionId?: number,
}) {
    const {
        modalData,
        formData,
        handleInput,
        errors,
        modal,
        checkRequired,
        handleEditInspection,
        handleSaveInspection,
        resetState,
        breakCount,
        addBreak,
        updateBreak,
        removeBreak,
        vehicleCount,
        addVehicle,
    } = DashboardModalController;

    const [submitted, setSubmitted] = useState(false);
    const inspectionDate = formData?.inspection?.inspection_date;

    const FIELDS = useMemo(() => [
        {
            name: 'employee_employee_id',
            label: 'Driver',
            type: 'select',
            required: true,
            fieldProps: {
                url: 'v1/employee/asset',
                iterator: {label: 'employee_full_name', value: 'employee_id'},
            },
        },
        {
            name: 'inspection_date',
            label: 'Date',
            type: 'date',
            required: true,
        },
        {
            name: 'inspection_start_time',
            label: 'Start Time',
            type: 'time',
            required: true,
        },
        {
            name: 'inspection_end_time',
            label: 'End Time',
            type: 'time',
            required: true,
        },
        {
            name: 'inspection_notes',
            label: 'Notes',
            type: 'textarea',
        },
    ], []);

    useLayoutEffect(() => {
        if (inspectionId) { modalData('inspection', FIELDS, +inspectionId) }
    }, [inspectionId]);

    async function handleSubmit() {
        setSubmitted(true);

        // Validate breaks - if added, must have start and end
        let hasInvalidBreaks = false;
        for (let i = 0; i < breakCount; i++) {
            const brk = formData[`break${i}`];
            if (!brk?.start || !brk?.end) hasInvalidBreaks = true;
        }

        // Validate vehicles - check all required fields for each vehicle
        let hasValidVehicles = true;
        for (let i = 0; i < vehicleCount; i++) {
            if (!checkRequired(`vehicle${i}`, getVehicleRequiredFields(i))) hasValidVehicles = false;
        }

        // Validate inspection fields
        const hasValidInspection = checkRequired('inspection', FIELDS);

        // Only proceed if all validations pass
        if (hasInvalidBreaks || !hasValidVehicles || !hasValidInspection) return;

        // Check if at least one reservation is selected
        let totalSelectedReservations = 0;
        for (let i = 0; i < vehicleCount; i++) {
            totalSelectedReservations += formData[`vehicle${i}`]?.inspection_vehicle_reservation_ids?.length || 0;
        }
        if (totalSelectedReservations === 0) {
            return window.toast.W('Please select at least one reservation.');
        }

        if (inspectionId) {
            // Edit mode
            return await window.toast.U({
                modalId,
                id: {
                    title: 'Editing inspection.',
                    message: 'Please wait...',
                },
                update: {
                    success: 'Inspection updated successfully.',
                    error: 'Failed to update inspection.'
                },
                cb: async () => await handleEditInspection(modalId)
            });
        }

        // Create mode - handle existing inspection case
        return await window.toast.U({
            modalId,
            id: {
                title: 'Creating inspection.',
                message: 'Please wait...',
            },
            update: {
                success: 'Inspection created successfully.',
                error: 'Failed to create inspection.'
            },
            cb: async () => await handleSaveInspection(modalId, (existingId: any) => {
                const acceptModal = 'accept-edit-existing-inspection'
                window.openModal({
                    modalId: acceptModal,
                    title: 'Warning',
                    size: 'sm',
                    children: (
                        <GenericModal
                            cancel={() => {
                                window.closeModal(acceptModal)
                                setSubmitted(false);
                            }}
                            accept={() => {
                                window.closeModal(modalId)
                                window.closeModal(acceptModal)
                                const _modalId = 'edit-existing-inspection'
                                window.openModal({
                                    modalId: _modalId,
                                    fullScreen: true,
                                    title: 'Re-Editing Driver Report',
                                    children: <DriverReportModal modalId={_modalId} inspectionId={existingId}/>,
                                    onClose: () => {}
                                })
                            }}
                        >
                            <Stack>
                                <EzText>An inspection already exists for this driver on this date.</EzText>
                                <EzText>Want to edit existing inspection?</EzText>
                            </Stack>
                        </GenericModal>
                    ),
                    onClose: () => {}
                })
            })
        });
    }

    if(modal.loading) return <EzLoader h='100vh'/>

    return (
        <Stack flex={1}>
            <EzScroll h='calc(100vh - 90px)' p='0 .5rem 0 1rem' needPaddingBottom>
                <Stack gap={16}>
                    <Fieldset legend='Info'>
                        <FormGenerator
                            field={FIELDS.slice(0, 4)}
                            structure={[4]}
                            handleInput={(name: any, value: any) =>
                                handleInput('inspection', name, value)}
                            formData={formData?.['inspection']}
                            errors={errors?.['inspection']}
                        />
                    </Fieldset>

                    <Card withBorder shadow='none'>
                        <Stack gap={8}>
                            <Group justify="space-between">
                                <EzText fw="bold">Break Log</EzText>
                                <ActionIcon onClick={() => { setSubmitted(false); addBreak(); }}>
                                    <IconPlus size={16}/>
                                </ActionIcon>
                            </Group>
                            {Array.from({length: breakCount}, (_, index) => {
                                const brk = formData[`break${index}`] || {};
                                return (
                                    <Flex key={index} gap={8} align="flex-end">
                                        <TimeInputWithPicker
                                            label={index === 0 ? "Start" : undefined}
                                            value={brk.start}
                                            onChange={(e) => updateBreak(index, 'start', e.target.value)}
                                            style={{flex: 1}}
                                            required
                                            error={submitted && !brk.start}
                                        />
                                        <TimeInputWithPicker
                                            label={index === 0 ? "End" : undefined}
                                            value={brk.end}
                                            onChange={(e) => updateBreak(index, 'end', e.target.value)}
                                            style={{flex: 1}}
                                            required
                                            error={submitted && !brk.end}
                                        />
                                        <ActionIcon
                                            color="red"
                                            mb={2}
                                            size={34}
                                            onClick={() => removeBreak(index)}
                                        >
                                            <IconTrash size={16}/>
                                        </ActionIcon>
                                    </Flex>
                                );
                            })}
                            {breakCount === 0 && (
                                <EzText size="sm" c="dimmed">No breaks added</EzText>
                            )}
                        </Stack>
                    </Card>

                    {/* Vehicles Section */}
                    <Stack gap={8}>
                        <Group justify="space-between">
                            <EzText fw="bold" size="lg">Vehicles</EzText>
                            <Button leftSection={<IconPlus size={14} />} onClick={addVehicle}>
                                Add Vehicle
                            </Button>
                        </Group>

                        <SimpleGrid cols={vehicleCount > 1 ? 2 : 1} spacing="sm">
                            {Array.from({length: vehicleCount}, (_, index) => (
                                <VehicleSection
                                    key={index}
                                    index={index}
                                    inspectionDate={inspectionDate}
                                    canRemove={vehicleCount > 1}
                                />
                            ))}
                        </SimpleGrid>
                    </Stack>

                    {/* Combined Reservations from all vehicles */}
                    <ReservationsSection />

                    <FormGenerator
                        field={FIELDS.slice(FIELDS.length - 1)}
                        structure={[1]}
                        handleInput={(name: any, value: any) =>
                            handleInput('inspection', name, value)}
                        formData={formData?.['inspection']}
                        errors={errors?.['inspection']}
                    />
                </Stack>
            </EzScroll>

            <SaveCancelDeleteBtns
                withScroll
                accept={handleSubmit}
                cancel={() => {
                    resetState()
                    window.closeModal(modalId)
                }}
                label={{accept: 'Save', cancel: 'Cancel'}}
            />
        </Stack>
    );
}
