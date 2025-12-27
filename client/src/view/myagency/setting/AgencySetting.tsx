import {useLayoutEffect, useMemo} from "react";
import {MyAgencyController} from "@/view/myagency/MyAgencyController.ts";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import type {FormField} from "@/types";
import FormGenerator from "@/components/form/FormGenerator.tsx";

function AgencySetting() {
    const {
        restrictionGetData,
        restrictionLoading,
        handleInput,
        errors,
        formData
    } = MyAgencyController

    useLayoutEffect(() => {
        restrictionGetData().then()
        return () => {
            MyAgencyController.restrictionData = []
            MyAgencyController.restrictionLoading = true

        }
    }, []);

    const FIELDS: FormField[] =
        useMemo(() => [
            {
                name: 'restriction_active',
                label: 'Active',
                type: 'select',
                fieldProps: {
                    url: 'v1/asset/yes_no',
                    info: 'Could the event be scheduled',
                    searchable: false,
                },
            },
            {
                name: 'restriction_require_user',
                label: 'Require User',
                type: 'select',
                fieldProps: {
                    url: 'v1/asset/yes_no',
                    info: 'Is user required for this event',
                    searchable: false,
                }
            },
            {
                name: 'restriction_change_user',
                label: 'Allow change user',
                type: 'select',
                fieldProps: {
                    url: 'v1/asset/yes_no',
                    info: 'Could the user be change for this event',
                    searchable: false,
                }
            },
            {
                name: 'restriction_create_by_user',
                label: 'Allow create by user',
                type: 'select',
                fieldProps: {
                    url: 'v1/asset/yes_no',
                    info: 'Could this event be created by a user or only Administrator',
                    searchable: false,
                }
            },
            {
                name: 'restriction_edit_by_user',
                label: 'Allow edit by user',
                type: 'select',
                fieldProps: {
                    url: 'v1/asset/yes_no',
                    info: 'Could this event be edited by a user or only Administrator',
                    searchable: false,
                }
            },
            {
                name: 'restriction_credentials',
                label: 'Allowed credentials',
                type: 'select',
                fieldProps: {
                    url: 'v1/asset/employee_role',
                    multiselect: true,
                    info: 'Not set',
                    autoClose: false,
                }
            },
            {
                name: 'restriction_create_by_others',
                label: 'Allow create by others',
                type: 'select',
                fieldProps: {
                    url: 'v1/asset/yes_no',
                    info: 'Could be created by other users',
                    searchable: false,
                }
            },
            {
                name: 'restriction_require_location',
                label: 'Required Location',
                type: 'select',
                fieldProps: {
                    url: 'v1/asset/yes_no',
                    info: 'Does this event require location',
                    searchable: false,
                }
            },
            {
                name: 'restriction_max_number_of_location',
                label: 'Max number of locations',
                type: 'number',
                info: 'Max number of locations available',
                fieldProps: {
                    min: 1,
                }
            },
            {
                name: 'restriction_new_location',
                label: 'Allow new location',
                type: 'select',
                fieldProps: {
                    url: 'v1/asset/yes_no',
                    info: 'Allow new location tooltip',
                    searchable: false,
                }
            },
            {
                name: 'restriction_parent_location',
                label: 'Allow parent locations',
                type: 'select',
                fieldProps: {
                    url: 'v1/asset/yes_no',
                    info: 'If agency locations will be allowed to be selected',
                    searchable: false,
                }
            },
            {
                name: 'restriction_require_data_collection',
                label: 'Require data collection',
                type: 'select',
                fieldProps: {
                    url: 'v1/asset/yes_no',
                    info: 'Does this event require data collection',
                    searchable: false,
                }
            },
            {
                name: 'restriction_is_multiday',
                label: 'Is Multiday',
                type: 'select',
                fieldProps: {
                    url: 'v1/asset/yes_no',
                    info: 'Could this event span multiple days',
                    searchable: false,
                }
            },
            {
                name: 'restriction_billable',
                label: 'Billable',
                type: 'select',
                fieldProps: {
                    url: 'v1/asset/yes_no',
                    info: 'Could this event have billing codes and added to claim',
                    searchable: false,
                }
            },
            {
                name: 'restriction_billing_code',
                label: 'Allowed billing codes',
                type: 'select',
                fieldProps: {
                    url: 'v1/asset/approval_procedures',
                    info: 'Allowed billing codes for this event',
                    multiselect: true,
                    autoClose: false,
                    style: {
                        gridColumn: '3/span 2'
                    }
                },
            },
            {
                name: 'restriction_require_billing_code',
                label: 'Required billing codes',
                tooltip: 'If the event Could be created without billing codes'
            },
            {
                name: 'restriction_partial_billing',
                label: 'Allow partial billing',
                tooltip: 'Could this event have unbilled time'
            },
            {
                name: 'restriction_require_prior_authorization',
                label: 'Required prior authorization',
                tooltip: 'If at least 1 prior authorization is required'
            },
            {
                name: 'restriction_max_number_of_billing_code',
                label: 'Max number of billing codes',
                tooltip: 'Max number of billing codes for this event'
            },
            {
                name: 'restriction_invoiceable',
                label: 'Invoiceable',
                tooltip: 'Could this event be added to invoice'
            },
            {
                name: 'restriction_clockable',
                label: 'Clockable',
                tooltip: 'Could this event be clock in and out'
            },
            {
                name: 'restriction_root',
                label: 'Root',
                tooltip: 'Could this event be created individually',
            },
            {
                name: 'restriction_parent',
                label: 'Parent',
                tooltip: 'Could this event have sub events'
            },
            {
                name: 'restriction_sub_event',
                label: 'Allowed sub-event',
                tooltip: 'Who could create a sub event from'
            },
            {
                name: 'restriction_child',
                label: 'Child',
                tooltip: 'Could this event be a sub event of other events'
            },
            {
                name: 'restriction_rounding_function',
                label: 'Rounding function',
                tooltip: 'How to calculate units'
            },
            {
                name: 'restriction_buffer_time',
                label: 'Buffer time',
                tooltip: 'Amount of time required between events'
            },
            {
                name: 'restriction_signature',
                label: 'Allow signature',
                tooltip: 'Could the signature be collected on this event'
            },
            {
                name: 'restriction_require_signature',
                label: 'Require signature',
                tooltip: 'Could this event required a signature'
            },
            {
                name: 'restriction_signature_lock',
                label: 'Signature lock',
                tooltip: 'Lock signature with the event'
            },
            {
                name: 'restriction_show_signature_info',
                label: 'Show signature info',
                tooltip: 'Will show signature info (capture time)'
            },
            {
                name: 'restriction_remote_signature_capture',
                label: 'Allow remote signature capture',
                tooltip: 'Could the signature be capture remotely using encrypted link'
            },
            {
                name: 'restriction_require_signature_status',
                label: 'Require signature statuses',
                tooltip: 'Event statuses that required a signature'
            },
            {
                name: 'restriction_show_event_info',
                label: 'Show event info',
                tooltip: 'Show additional info about the event (creation, last update, etc)'
            },
            {
                name: 'restriction_overlapping_client',
                label: 'Allow overlapping (Client)',
                tooltip: 'Could this event overlap with others'
            },
            {
                name: 'restriction_overlapping_provider',
                label: 'Allow overlapping (Provider)',
                tooltip: 'Could this event overlap with others'
            },
            {
                name: 'restriction_days',
                label: 'Allowed days',
                tooltip: 'Allowed days to create this type of event'
            },
            {
                name: 'restriction_start_time',
                label: 'Start time',
                tooltip: 'Minimum start time for this event'
            },
            {
                name: 'restriction_end_time',
                label: 'End time',
                tooltip: 'Maximum end time for this event'
            },
            {
                name: 'restriction_lead_time',
                label: 'Lead time',
                tooltip: 'Amount of time allowed to create an advance'
            },
            {
                name: 'restriction_lag_time',
                label: 'Lag time',
                tooltip: 'Amount of time allowed to create in the past'
            },
            {
                name: 'restriction_cut_off_date',
                label: 'Cut-off-dates',
                tooltip: 'Last day to be created, will always be at the end of the day.'
            },
            {
                name: 'restriction_travel',
                label: 'Allow travel',
                tooltip: 'Does this event allow to add travel info (distance and duration)'
            },
            { /** miss*/
                name: 'restriction_color',
                label: 'Event color',
                tooltip: 'Color of this type of event'
            },
            {
                name: 'restriction_max_duration_event',
                label: 'Max duration (Event)',
                tooltip: 'Max duration for this event' //10h
            },
            {
                name: 'restriction_min_duration_event',
                label: 'Min duration (Event)',
                tooltip: 'Min duration for this event' //0.25h
            },
            {
                name: 'restriction_max_duration_per_day_client',
                label: 'Max duration per day (Client)',
                tooltip: 'Max duration of all events on the same day' //10h
            },
            { /** miss*/
                name: 'restriction_max_duration_per_day_provider',
                label: 'Max duration per day (Client)',
                tooltip: 'Max duration of all events on the same day' //10h
            },
            {
                name: 'restriction_max_duration_per_week_client',
                label: 'Max duration per week (Client)',
                tooltip: 'Max duration per week for the same client' //40h
            },
            {/** miss*/
                name: 'restriction_max_duration_per_week_provider',
                label: 'Max duration per week (Client)',
                tooltip: 'Max duration per week for the same provider' //60h
            },
            { /** miss*/
                name: 'restriction_max_consecutive_day_client',
                label: 'Max consecutive days (Client)',
                tooltip: 'Max number of consecutive days for the same client' //30days
            },
            { /** miss*/
                name: 'restriction_max_consecutive_day_provider',
                label: 'Max consecutive days (Provider)',
                tooltip: 'Max number of consecutive days for the same provider' //30days
            },
            {
                name: 'restriction_skip_global_restriction',
                label: 'Skip global restrictions',
                tooltip: 'Could this event skips global restrictions'
            },
            {
                name: 'restriction_show_preview',
                label: 'Show Preview',
                tooltip: 'Not Set'
            },
            {
                name: 'restriction_cross_calendar_check',
                label: 'Cross calendar check',
                tooltip: 'In case of multiple agencies, verifies calendars across all agencies to prevent scheduling conflicts.'
            }
        ], [])

    if (restrictionLoading) return <EzLoader h='calc(100vh - 140px)'/>

    return (
        <FormGenerator
            field={FIELDS}
            structure={[4,4,4,3,4,4,4,4,4,4,4,4,4,4]}
            formData={formData!["calendar_event"]}
            handleInput={(name: any, value: any, api: any) =>
                handleInput("calendar_event", name, value, api)
            }
            errors={errors!["calendar_event"]}
            inputWrapper={{
                style: {
                    display: 'grid',
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: ".5rem",
                }
            }}
        />
    );
}

export default AgencySetting;