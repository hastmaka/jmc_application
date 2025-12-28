import React, {useLayoutEffect, useMemo, useRef} from "react";
import {ActionIcon, Button, Card, Fieldset, Flex, Group, SimpleGrid, Stack, TextInput} from "@mantine/core";
import FormGenerator from "@/components/form/FormGenerator.tsx";
import EzText from "@/ezMantine/text/EzText.tsx";
import {DashboardModalController} from "@/view/dashboard/_modal/DashboardModalController.ts";
import {IconClock, IconPlus, IconTrash} from "@tabler/icons-react";
import {TimeInput} from "@mantine/dates";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";
import SaveCancelDeleteBtns from "@/components/SaveCancelDeleteBtns.tsx";
import VehicleSection from "@/view/dashboard/_modal/VehicleSection.tsx";
import ReservationsSection from "@/view/dashboard/_modal/ReservationsSection.tsx";

function TimeInputWithPicker({label, value, onChange, style}: {
    label?: string,
    value: string,
    onChange: (e: any) => void,
    style?: React.CSSProperties
}) {
    const ref = useRef<HTMLInputElement>(null);
    return (
        <TimeInput
            label={label}
            value={value}
            onChange={onChange}
            style={style}
            ref={ref}
            rightSection={
                <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
                    <IconClock size={16} stroke={1.5}/>
                </ActionIcon>
            }
        />
    );
}

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
        checkRequired,
        handleEditInspection,
        handleSaveInspection,
        resetState,
        breaks,
        addBreak,
        updateBreak,
        removeBreak,
        vehicleData,
        addVehicle,
    } = DashboardModalController;

    const inspectionDate = formData?.inspection?.inspection_date;

    useLayoutEffect(() => {
        if (inspectionId) { modalData('inspection', FIELDS, +inspectionId) }
    }, [inspectionId]);

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
        },
        {
            name: 'inspection_end_time',
            label: 'End Time',
            type: 'time',
        },
        {
            name: 'inspection_notes',
            label: 'Notes',
            type: 'textarea',
        },
    ], []);

    async function handleSubmit() {
        if (checkRequired('inspection', FIELDS)) {
            return await window.toast.U({
                modalId,
                id: {
                    title: `${inspectionId ? 'Editing' : 'Creating'} inspection.`,
                    message: 'Please wait...',
                },
                update: {
                    success: `Inspection ${inspectionId ? 'updated' : 'created'} successfully.`,
                    error: `Failed to ${inspectionId ? 'update' : 'create'} inspection.`
                },
                cb: async () => {
                    if (inspectionId) return await handleEditInspection(modalId);
                    await handleSaveInspection(modalId);
                }
            });
        }
    }

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
                                <ActionIcon variant="light" onClick={addBreak}>
                                    <IconPlus size={16}/>
                                </ActionIcon>
                            </Group>
                            {breaks?.map((brk: any, index: number) => (
                                <Flex key={index} gap={8} align="flex-end">
                                    <TimeInputWithPicker
                                        label={index === 0 ? "Start" : undefined}
                                        value={brk.start}
                                        onChange={(e) => updateBreak(index, 'start', e.target.value)}
                                        style={{flex: 1}}
                                    />
                                    <TimeInputWithPicker
                                        label={index === 0 ? "End" : undefined}
                                        value={brk.end}
                                        onChange={(e) => updateBreak(index, 'end', e.target.value)}
                                        style={{flex: 1}}
                                    />
                                    <TextInput
                                        label={index === 0 ? "Initial" : undefined}
                                        value={brk.initial}
                                        onChange={(e) => updateBreak(index, 'initial', e.target.value)}
                                        style={{flex: 1}}
                                        maxLength={5}
                                    />
                                    <ActionIcon
                                        variant="light"
                                        color="red"
                                        onClick={() => removeBreak(index)}
                                    >
                                        <IconTrash size={16}/>
                                    </ActionIcon>
                                </Flex>
                            ))}
                            {(!breaks || breaks.length === 0) && (
                                <EzText size="sm" c="dimmed">No breaks added</EzText>
                            )}
                        </Stack>
                    </Card>

                    {/* Vehicles Section */}
                    <Stack gap={8}>
                        <Group justify="space-between">
                            <EzText fw="bold" size="lg">Vehicles</EzText>
                            <Button
                                leftSection={<IconPlus size={14} />}
                                onClick={addVehicle}
                            >
                                Add Vehicle
                            </Button>
                        </Group>

                        <SimpleGrid cols={vehicleData?.length > 1 ? 2 : 1} spacing="sm">
                            {vehicleData?.map((_: any, index: number) => (
                                <VehicleSection
                                    key={index}
                                    index={index}
                                    inspectionDate={inspectionDate}
                                    canRemove={vehicleData.length > 1}
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
