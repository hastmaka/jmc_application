import {Stack, Tabs} from '@mantine/core';
import React, {createElement, lazy, Suspense, useLayoutEffect, useMemo} from "react";
import {EventCreationModalController} from './EventCreationModalController.ts'
import classes from "@/ezMantine/tabsView/EzTabsView.module.scss";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";
import SaveCancelDeleteBtns from "@/components/SaveCancelDeleteBtns.tsx";
import type {FormField} from "@/types";
import type {EventContentArg} from "@fullcalendar/core";
import EzAddressForm from "@/components/form/EzAddressForm.tsx";
import EzGroupBtn from "@/ezMantine/buttonGroup/EzGroupBtn.tsx";
import {IconCirclePlus, IconUserPlus} from "@tabler/icons-react";
import FormGenerator from "@/components/form/FormGenerator.tsx";
// dynamic imports
const AssignRbtModal =
    lazy(() => import('../AssignRbtModal.tsx'))

const TABS = [{
    text: 'Appointment',
    view: 'appointment',
}, {
    text: 'Data Collection',
    view: 'data_collection',
}] as const;

type TabView = typeof TABS[number]['view'];

const TABSPANEL: Record<TabView, React.LazyExoticComponent<React.ComponentType<any>>> = {
    appointment: lazy(() => import('./Appointment.tsx')),
    data_collection: lazy(() => import('./DataCollection.tsx')),
}

export default function EventCreationModal({eventInfo}: {eventInfo?: EventContentArg}) {
    const {
        formData,
        handleCheckBoxes,
        errors,
        activeTab,
        setActiveTab,
        handleCreateAppointment,
        handleEditAppointment,
        resetState,
        resetLocalClient,
        client_id,
        resetLocalRbt,
        activeSelect,
        checkRequired,
        modalData,
        modal,
        user,
    } = EventCreationModalController

    const isClientSelected = Boolean(formData?.appointment?.client_client_id)

    function handleAssignRbt(){
        window.openModal({
            modalId: 'assign-rbt-modal',
            title: 'Assigning RBt Modal',
            children: (
                <Suspense fallback={<EzLoader h={300}/>}>
                    <AssignRbtModal/>
                </Suspense>
            ),
            onClose: () => {}
        })
    }

    function handleAddAddress(){
        const modalId = 'add-address-from-event-modal';
        window.openModal({
            modalId,
            title: 'Add Address',
            children: (
                <EzAddressForm
                    modalId={modalId}
                    controller={EventCreationModalController}
                    handler={EventCreationModalController.handleAddressSubmit}
                    root='address'
                />
            ),
            onClose: () => {
                window.closeModal(modalId)
                EventCreationModalController.formData['address'] = {}
            }
        })
    }

    const client_name: FormField[] = [
        {
            name: "client_client_id",
            label: "Client Name",
            type: "select",
            fieldProps: {
                url: `v1/client/calendar/create`,
                queryParams: {filters: [{}]},
                iterator: {label: "client_full_name", value: "client_id"},
                closeBtnCallBack: resetLocalClient,
                filterField: "client_full_name",
            },
            required: true,
        },
    ];

    const rbt_name: FormField[] = [
        {
            name: "rbt_name",
            label: "RBT Name",
            type: "select",
            fieldProps: {
                url: `v1/client/calendar/create/employee/${client_id}`,
                iterator: {label: "employee_full_name", value: "employee_id"},
                closeBtnCallBack: resetLocalRbt,
                disabled: !isClientSelected,
                info: 'Therapist assign to the client, in case of not having one, use the Button "Assign Therapist" to do it.',
            },
            required: true,
            searchable: true,
        }
    ];

    const dateFields: FormField[] = [
        {
            name: "calendar_event_start_date",
            label: "Start Date",
            type: "date",
            fieldProps: {
                disabled: !isClientSelected,
            },
            required: true
        },
        {
            name: "calendar_event_end_date",
            label: "End Date",
            type: "date",
            fieldProps: {
                disabled: !isClientSelected,
            },
            // required: true
        },
        {
            name: "calendar_event_start_time",
            label: "Start Time",
            type: "time",
            fieldProps: {
                disabled: !isClientSelected,
            },
            required: true
        },
        {
            name: "calendar_event_end_time",
            label: "End Time",
            type: "time",
            fieldProps: {
                disabled: !isClientSelected,
            },
            required: true
        },
    ];

    const address: FormField[] = [
        {
            name: "address_address_id",
            label: "Service Location",
            type: "select",
            fieldProps: {
                url: `v1/client/calendar/create/address/${client_id}`,
                iterator: {label: "address_concat", value: "address_id"},
                disabled: !isClientSelected,
                searchable: false,
            },
            // required: true,
        },
    ];

    const repeat: FormField[] = [
        {
            name: "repeat_every_day_for_a_week",
            label: "Repeat Every Day for a Week",
            type: "checkbox",
            fieldProps: {mt: 8},
            disabled: !isClientSelected
        },
        {
            name: "repeat_every_day_for_a_month",
            label: "Repeat Every Day for a Month",
            type: "checkbox",
            fieldProps: {mt: 8},
            disabled: !isClientSelected
        },
        {
            name: "repeat_this_day_for_a_month",
            label: "Repeat This Day for a Month",
            type: "checkbox",
            fieldProps: {mt: 8},
            disabled: !isClientSelected
        },
    ];

    const behavior_treatment =
        useMemo(() => [
            ...client_name,
            ...rbt_name,
            ...dateFields,
            ...address,
        ],[isClientSelected]);

    const family_training =
        useMemo(() => [
            ...client_name,
            {
                name: "analyst_name",
                label: "Analyst Name",
                type: "select",
                fieldProps: {
                    url: "v1/asset/maladaptive_status",
                    disabled: !isClientSelected,
                },
                required: true,
            },
            ...dateFields,
            ...address,
            {
                name: "procedure",
                label: "Procedure",
                type: "select",
                fieldProps: {
                    url: "v1/asset/maladaptive_status",
                    disabled: !isClientSelected,
                },
                required: true,
            },
        ], [isClientSelected]);

    const rbt_supervision_individual =
        useMemo(() => [
            ...client_name,
            {
                name: "supervisor_name",
                label: "Supervisor Name",
                type: "select",
                fieldProps: {
                    url: "v1/asset/maladaptive_status",
                    disabled: !isClientSelected,
                },

                required: true,
            },
            ...rbt_name,
            ...dateFields,
            {
                name: "type_of_meeting",
                label: "Type of Meeting",
                type: "select",
                fieldProps: {
                    url: "v1/asset/maladaptive_status",
                    disabled: !isClientSelected,
                },
                required: true,
            },
        ], [isClientSelected]);

    const rbt_supervision_group =
        useMemo(() => [
            {
                name: "supervisor_name",
                label: "Supervisor Name",
                type: "select",
                fieldProps: {
                    url: "v1/asset/maladaptive_status",
                    disabled: !isClientSelected,
                },
                required: true,
            },
            ...dateFields,
            ...address,
            {
                name: "observed_with_client",
                label: "Observed with Client",
                type: "select",
                fieldProps: {
                    url: "v1/asset/maladaptive_status",
                    disabled: !isClientSelected,
                },
                required: true,
            },
            {
                name: "type_of_meeting",
                label: "Type of Meeting",
                type: "select",
                fieldProps: {
                    url: "v1/asset/maladaptive_status",
                    disabled: !isClientSelected,
                },
                required: true,
            },
        ], [isClientSelected]);

    const bcaba_supervision_individual =
        useMemo(() => [
            ...client_name,
            {
                name: "supervisor_name",
                label: "Supervisor Name",
                type: "select",
                fieldProps: {
                    url: "v1/asset/maladaptive_status",
                    disabled: !isClientSelected,
                },
                required: true,
            },
            {
                name: "bcaba_name",
                label: "BCABA Name",
                type: "select",
                fieldProps: {
                    url: "v1/asset/maladaptive_status",
                    disabled: !isClientSelected,
                },
                required: true,
            },
            ...dateFields,
            {
                name: "type_of_meeting",
                label: "Type of Meeting",
                type: "select",
                fieldProps: {
                    url: "v1/asset/maladaptive_status",
                    disabled: !isClientSelected,
                },
                required: true,
            },
        ], [isClientSelected]);

    const bcaba_supervision_group =
        useMemo(() => [
            {
                name: "supervisor_name",
                label: "Supervisor Name",
                type: "select",
                fieldProps: {
                    url: "v1/asset/maladaptive_status",
                    disabled: !isClientSelected,
                },
                required: true,
            },
            ...dateFields,
            ...address,
            {
                name: "observed_with_client",
                label: "Observed with Client",
                type: "select",
                fieldProps: {
                    url: "v1/asset/maladaptive_status",
                    disabled: !isClientSelected,
                },
                required: true,
            },
            {
                name: "type_of_meeting",
                label: "Type of Meeting",
                type: "select",
                fieldProps: {
                    url: "v1/asset/maladaptive_status",
                    disabled: !isClientSelected,
                },
                required: true,
            },
        ], [isClientSelected]);

    const rbt_competency =
        useMemo(() => [
            ...client_name,
            {
                name: "analyst_name",
                label: "Analyst Name",
                type: "select",
                fieldProps: {
                    url: "v1/asset/maladaptive_status",
                    disabled: !isClientSelected,
                },
                required: true,
            },
            ...rbt_name,
            ...dateFields,
        ],[isClientSelected]);

    const medical_visit =
        useMemo(() => [
            ...client_name,
            {
                name: "healthcare_provider",
                label: "Healthcare Provider",
                type: "select",
                fieldProps: {
                    url: "v1/asset/maladaptive_status",
                    disabled: !isClientSelected,
                },
                required: true,
            },
            ...dateFields,
        ],[isClientSelected]);

    const assessment =
        useMemo(() => [...client_name], [isClientSelected]);

    const reassessment =
        useMemo(() => [...client_name], [isClientSelected]);

    const fields = {
        behavior_treatment,
        family_training,
        rbt_supervision_individual,
        rbt_supervision_group,
        bcaba_supervision_individual,
        bcaba_supervision_group,
        rbt_competency,
        medical_visit,
        assessment,
        reassessment,
    };

    async function handleSubmit(){
        if(checkRequired('appointment', (fields as any)[activeSelect])) {
            const isEditing = modal.state === "editing";

            await window.toast.U({
                modalId: 'event-creation-modal',
                id: {
                    title: `${isEditing ? 'Editing' : 'Creating'} Event`,
                    message: 'Please wait...'
                },
                update: {
                    success: `Event ${isEditing ? 'edited' : 'created'} successfully.`,
                    error: `Event ${isEditing ? 'edition' : 'creation'} failed`,
                },
                cb: isEditing ? handleEditAppointment : handleCreateAppointment
            })
            window.closeModal('event-creation-modal')
            resetState()
            resetLocalClient()
        }
    }

    const handleCancel = () => {
        window.closeModal('event-creation-modal')
        resetState()
        resetLocalClient()
    }

    useLayoutEffect(() => {
        // we extract the necessary ids here and pass them to the modal loader
        const id = eventInfo?.event.id
        const client_id = eventInfo?.event.extendedProps.clientId
        const employee_id = eventInfo?.event.extendedProps.employeeId
        const address_id = eventInfo?.event.extendedProps.addressId

        if (id) {
            modalData('calendar_event',
                (fields as any)[activeSelect],
                id,
                null,
                {client_id, employee_id, address_id}
            ).then()
        }
    }, [eventInfo?.event.id]);

    const TOOLBTNS = [
        {
            icon: IconCirclePlus,
            label: 'Add Address',
            onClick: handleAddAddress
        },
        ...(user.role_role_id === 1 ? [{
            icon: IconUserPlus,
            label: 'Assign Providers',
            onClick: handleAssignRbt
        }] : [])
    ]

    if (modal.loading) return <EzLoader h={700}/>

    return (
        <Stack gap={16} m={0}>
            <Tabs
                defaultValue={activeTab}
                variant="pills"
                classNames={{
                    root: classes['tab-root'],
                    tab: classes['tab'],
                }}
                onChange={setActiveTab}
            >
                <Tabs.List mb={16} pos='relative'>
                    {TABS.map((tab, index) => (
                        <Tabs.Tab key={index} value={tab.view}>{tab.text}</Tabs.Tab>
                    ))}

                    <div style={{position: 'absolute', right: 0}}>
                        <EzGroupBtn
                            ITEMS={TOOLBTNS}
                        />
                    </div>
                </Tabs.List>




                <EzScroll mah="calc(100vh - 300px)" needPaddingBottom>
                    <Tabs.Panel value={activeTab} style={{display: 'flex'}}>
                        <div className={classes['container']}>
                            <Suspense fallback={<EzLoader h="100%" centerProps={{flex: 1, mih: 400}}/>}>
                                {createElement(TABSPANEL[activeTab as TabView], { fields })}
                            </Suspense>
                            {activeTab === 'appointment' && <FormGenerator
                                field={repeat}
                                structure={[3]}
                                handleInput={(name, value) =>
                                    handleCheckBoxes(name, value)}
                                formData={formData!["appointment"]}
                                errors={errors!["appointment"]}
                            />}
                        </div>
                    </Tabs.Panel>
                </EzScroll>
            </Tabs>

            <SaveCancelDeleteBtns
                withScroll
                accept={handleSubmit}
                cancel={handleCancel}
            />
        </Stack>
    )
}