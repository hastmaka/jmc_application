import type {SignalType} from "@/signals/SignalClass.ts";
import {SignalController} from "@/signals/signalController/SignalController.ts";
import {FetchApi} from "@/api/FetchApi.ts";
import _ from "lodash";
// import type {FormField} from "@/types";

export const MyAgencyController: SignalType<any, any> = new SignalController({
    data: {},
    activeTab: 'agency-appointment-setting',
},{
    setActiveTab: function (this: any, tab: string)  {
        this.activeTab = tab || 'agency-appointment-setting'
    },
    restrictionGetData: async function(this: any) {
        const response = await FetchApi('v1/restriction')
        let cleanData: Record<string, any> = {}

        const arr: string[] = ['option', 'id', 'created_at', 'deleted_at', 'updated_at']

        Object.entries(response.data[0]).forEach(([key, value]) => {
            if (!_.some(arr, (v: string) => _.includes(key, v))) {
                cleanData[key] = value;
            }
        });

        // appointment
        // const appointmentFields: FormField[] = [
        //     {
        //         name: 'restriction_active',
        //         label: 'Active',
        //         description: 'Could the event be scheduled'
        //     },
        //     {
        //         name: 'restriction_require_user',
        //         label: 'Require User',
        //         description: 'Is user required for this event'
        //     },
        //     {
        //         name: 'restriction_change_user',
        //         label: 'Allow change user',
        //         description: 'Could the user be change for this event'
        //     },
        //     {
        //         name: 'restriction_create_by_user',
        //         label: 'Allow create by user',
        //         description: 'Could this event be created by a user or only Administrator'
        //     },
        //     {
        //         name: 'restriction_edit_by_user',
        //         label: 'Allow edit by user',
        //         description: 'Could this event be edited by a user or only Administrator'
        //     },
        //     {
        //         name: 'restriction_credentials',
        //         label: 'Allowed credentials',
        //         description: 'Not set'
        //     },
        //     {
        //         name: 'restriction_create_by_others',
        //         label: 'Allow create by others',
        //         description: 'Could be created by other users'
        //     },
        //     {
        //         name: 'restriction_require_location',
        //         label: 'Required Location',
        //         description: 'Does this event require location'
        //     },
        //     {
        //         name: 'restriction_max_number_of_location',
        //         label: 'Max number of locations',
        //         description: 'Max number of locations available'
        //     },
        //     {
        //         name: 'restriction_new_location',
        //         label: 'Allow new location',
        //         description: 'Allow new location description'
        //     },
        //     {
        //         name: 'restriction_parent_location',
        //         label: 'Allow parent locations',
        //         description: 'If agency locations will be allowed to be selected'
        //     },
        //     {
        //         name: 'restriction_require_data_collection',
        //         label: 'Require data collection',
        //         description: 'Does this event require data collection'
        //     },
        //     {
        //         name: 'restriction_is_multiday',
        //         label: 'Is Multiday',
        //         description: 'Could this event span multiple days'
        //     },
        //     {
        //         name: 'restriction_billable',
        //         label: 'Billable',
        //         description: 'Could this event have billing codes and added to claim'
        //     },
        //     {
        //         name: 'restriction_billing_code',
        //         label: 'Allowed billing codes',
        //         description: 'Allowed billing codes for this event'
        //     },
        //     {
        //         name: 'restriction_require_billing_code',
        //         label: 'Required billing codes',
        //         description: 'If the event Could be created without billing codes'
        //     },
        //     {
        //         name: 'restriction_partial_billing',
        //         label: 'Allow partial billing',
        //         description: 'Could this event have unbilled time'
        //     },
        //     {
        //         name: 'restriction_require_prior_authorization',
        //         label: 'Required prior authorization',
        //         description: 'If at least 1 prior authorization is required'
        //     },
        //     {
        //         name: 'restriction_max_number_of_billing_code',
        //         label: 'Max number of billing codes',
        //         description: 'Max number of billing codes for this event'
        //     },
        //     {
        //         name: 'restriction_invoiceable',
        //         label: 'Invoiceable',
        //         description: 'Could this event be added to invoice'
        //     },
        //     {
        //         name: 'restriction_clockable',
        //         label: 'Clockable',
        //         description: 'Could this event be clock in and out'
        //     },
        //     {
        //         name: 'restriction_root',
        //         label: 'Root',
        //         description: 'Could this event be created individually',
        //     },
        //     {
        //         name: 'restriction_parent',
        //         label: 'Parent',
        //         description: 'Could this event have sub events'
        //     },
        //     {
        //         name: 'restriction_sub_event',
        //         label: 'Allowed sub-event',
        //         description: 'Who could create a sub event from'
        //     },
        //     {
        //         name: 'restriction_child',
        //         label: 'Child',
        //         description: 'Could this event be a sub event of other events'
        //     },
        //     {
        //         name: 'restriction_rounding_function',
        //         label: 'Rounding function',
        //         description: 'How to calculate units'
        //     },
        //     {
        //         name: 'restriction_buffer_time',
        //         label: 'Buffer time',
        //         description: 'Amount of time required between events'
        //     },
        //     {
        //         name: 'restriction_signature',
        //         label: 'Allow signature',
        //         description: 'Could the signature be collected on this event'
        //     },
        //     {
        //         name: 'restriction_require_signature',
        //         label: 'Require signature',
        //         description: 'Could this event required a signature'
        //     },
        //     {
        //         name: 'restriction_signature_lock',
        //         label: 'Signature lock',
        //         description: 'Lock signature with the event'
        //     },
        //     {
        //         name: 'restriction_show_signature_info',
        //         label: 'Show signature info',
        //         description: 'Will show signature info (capture time)'
        //     },
        //     {
        //         name: 'restriction_remote_signature_capture',
        //         label: 'Allow remote signature capture',
        //         description: 'Could the signature be capture remotely using encrypted link'
        //     },
        //     {
        //         name: 'restriction_require_signature_status',
        //         label: 'Require signature statuses',
        //         description: 'Event statuses that required a signature'
        //     },
        //     {
        //         name: 'restriction_show_event_info',
        //         label: 'Show event info',
        //         description: 'Show additional info about the event (creation, last update, etc)'
        //     },
        //     {
        //         name: 'restriction_overlapping_client',
        //         label: 'Allow overlapping (Client)',
        //         description: 'Could this event overlap with others'
        //     },
        //     {
        //         name: 'restriction_overlapping_provider',
        //         label: 'Allow overlapping (Provider)',
        //         description: 'Could this event overlap with others'
        //     },
        //     {
        //         name: 'restriction_days',
        //         label: 'Allowed days',
        //         description: 'Allowed days to create this type of event'
        //     },
        //     {
        //         name: 'restriction_start_time',
        //         label: 'Start time',
        //         description: 'Minimum start time for this event'
        //     },
        //     {
        //         name: 'restriction_end_time',
        //         label: 'End time',
        //         description: 'Maximum end time for this event'
        //     },
        //     {
        //         name: 'restriction_lead_time',
        //         label: 'Lead time',
        //         description: 'Amount of time allowed to create an advance'
        //     },
        //     {
        //         name: 'restriction_lag_time',
        //         label: 'Lag time',
        //         description: 'Amount of time allowed to create in the past'
        //     },
        //     {
        //         name: 'restriction_cut_off_date',
        //         label: 'Cut-off-dates',
        //         description: 'Last day to be created, will always be at the end of the day.'
        //     },
        //     {
        //         name: 'restriction_travel',
        //         label: 'Allow travel',
        //         description: 'Does this event allow to add travel info (distance and duration)'
        //     },
        //     { /** miss*/
        //         name: 'restriction_color',
        //         label: 'Event color',
        //         description: 'Color of this type of event'
        //     },
        //     {
        //         name: 'restriction_max_duration_event',
        //         label: 'Max duration (Event)',
        //         description: 'Max duration for this event' //10h
        //     },
        //     {
        //         name: 'restriction_min_duration_event',
        //         label: 'Min duration (Event)',
        //         description: 'Min duration for this event' //0.25h
        //     },
        //     {
        //         name: 'restriction_max_duration_per_day_client',
        //         label: 'Max duration per day (Client)',
        //         description: 'Max duration of all events on the same day' //10h
        //     },
        //     { /** miss*/
        //         name: 'restriction_max_duration_per_day_provider',
        //         label: 'Max duration per day (Client)',
        //         description: 'Max duration of all events on the same day' //10h
        //     },
        //     {
        //         name: 'restriction_max_duration_per_week_client',
        //         label: 'Max duration per week (Client)',
        //         description: 'Max duration per week for the same client' //40h
        //     },
        //     {/** miss*/
        //         name: 'restriction_max_duration_per_week_provider',
        //         label: 'Max duration per week (Client)',
        //         description: 'Max duration per week for the same provider' //60h
        //     },
        //     { /** miss*/
        //         name: 'restriction_max_consecutive_day_client',
        //         label: 'Max consecutive days (Client)',
        //         description: 'Max number of consecutive days for the same client' //30days
        //     },
        //     { /** miss*/
        //         name: 'restriction_max_consecutive_day_provider',
        //         label: 'Max consecutive days (Provider)',
        //         description: 'Max number of consecutive days for the same provider' //30days
        //     },
        //     {
        //         name: 'restriction_skip_global_restriction',
        //         label: 'Skip global restrictions',
        //         description: 'Could this event skips global restrictions'
        //     },
        //     {
        //         name: 'restriction_show_preview',
        //         label: 'Show Preview',
        //         description: 'Not Set'
        //     },
        //     {
        //         name: 'restriction_cross_calendar_check',
        //         label: 'Cross calendar check',
        //         description: 'In case of multiple agencies, verifies calendars across all agencies to prevent scheduling conflicts.'
        //     }
        // ]

        // Service
        // const serviceFields: FormField[] = [
        //     {
        //         name: 'restriction_active',
        //         label: 'Active',
        //         description: 'Could the event be scheduled'
        //     },
        //     {
        //         name: 'restriction_require_user',
        //         label: 'Require User',
        //         description: 'Is user required for this event'
        //     },
        //     {
        //         name: 'restriction_change_user',
        //         label: 'Allow change user',
        //         description: 'Could the user be change for this event'
        //     },
        //     { /** miss */
        //         name: 'restriction_create_by_user',
        //         label: 'Allow create by user',
        //         description: 'Could this event be created by a user or only Administrator'
        //     },
        //     {
        //         name: 'restriction_edit_by_user',
        //         label: 'Allow edit by user',
        //         description: 'Could this event be edited by a user or only Administrator'
        //     },
        //     {
        //         name: 'restriction_credentials',
        //         label: 'Allowed credentials',
        //         description: 'Not set'
        //     },
        //     {
        //         name: 'restriction_create_by_others',
        //         label: 'Allow create by others',
        //         description: 'Could be created by other users'
        //     },
        //     {
        //         name: 'restriction_require_location',
        //         label: 'Required Location',
        //         description: 'Does this event require location'
        //     },
        //     {
        //         name: 'restriction_require_data_collection',
        //         label: 'Require data collection',
        //         description: 'Does this event require data collection'
        //     },
        //     {
        //         name: 'restriction_is_multiday',
        //         label: 'Is Multiday',
        //         description: 'Could this event span multiple days'
        //     },
        //     {
        //         name: 'restriction_billable',
        //         label: 'Billable',
        //         description: 'Could this event have billing codes and added to claim'
        //     },
        //     {
        //         name: 'restriction_billing_code',
        //         label: 'Allowed billing codes',
        //         description: 'Allowed billing codes for this event'
        //     },
        //     {
        //         name: 'restriction_require_billing_code',
        //         label: 'Required billing codes',
        //         description: 'If the event Could be created without billing codes'
        //     },
        //     {
        //         name: 'restriction_partial_billing',
        //         label: 'Allow partial billing',
        //         description: 'Could this event have unbilled time'
        //     },
        //     {
        //         name: 'restriction_require_prior_authorization',
        //         label: 'Required prior authorization',
        //         description: 'If at least 1 prior authorization is required'
        //     },
        //     {
        //         name: 'restriction_max_number_of_billing_code',
        //         label: 'Max number of billing codes',
        //         description: 'Max number of billing codes for this event'
        //     },
        //     {
        //         name: 'restriction_invoiceable',
        //         label: 'Invoiceable',
        //         description: 'Could this event be added to invoice'
        //     },
        //     {
        //         name: 'restriction_clockable',
        //         label: 'Clockable',
        //         description: 'Could this event be clock in and out'
        //     },
        //     {
        //         name: 'restriction_root',
        //         label: 'Root',
        //         description: 'Could this event be created individually',
        //     },
        //     {
        //         name: 'restriction_parent',
        //         label: 'Parent',
        //         description: 'Could this event have sub events'
        //     },
        //     {
        //         name: 'restriction_child',
        //         label: 'Child',
        //         description: 'Could this event be a sub event of other events'
        //     },
        //     {
        //         name: 'restriction_rounding_function',
        //         label: 'Rounding function',
        //         description: 'How to calculate units'
        //     },
        //     {
        //         name: 'restriction_buffer_time',
        //         label: 'Buffer time',
        //         description: 'Amount of time required between events'
        //     },
        //     {
        //         name: 'restriction_signature',
        //         label: 'Allow signature',
        //         description: 'Could the signature be collected on this event'
        //     },
        //     {
        //         name: 'restriction_show_event_info',
        //         label: 'Show event info',
        //         description: 'Show additional info about the event (creation, last update, etc)'
        //     },
        //     {
        //         name: 'restriction_overlapping_client',
        //         label: 'Allow overlapping (Client)',
        //         description: 'Could this event overlap with others'
        //     },
        //     {
        //         name: 'restriction_overlapping_provider',
        //         label: 'Allow overlapping (Provider)',
        //         description: 'Could this event overlap with others'
        //     },
        //     {
        //         name: 'restriction_days',
        //         label: 'Allowed days',
        //         description: 'Allowed days to create this type of event'
        //     },
        //     {
        //         name: 'restriction_start_time',
        //         label: 'Start time',
        //         description: 'Minimum start time for this event'
        //     },
        //     {
        //         name: 'restriction_end_time',
        //         label: 'End time',
        //         description: 'Maximum end time for this event'
        //     },
        //     {
        //         name: 'restriction_lead_time',
        //         label: 'Lead time',
        //         description: 'Amount of time allowed to create an advance'
        //     },
        //     {
        //         name: 'restriction_lag_time',
        //         label: 'Lag time',
        //         description: 'Amount of time allowed to create in the past'
        //     },
        //     {
        //         name: 'restriction_cut_off_date',
        //         label: 'Cut-off-dates',
        //         description: 'Last day to be created, will always be at the end of the day.'
        //     },
        //     {
        //         name: 'restriction_travel',
        //         label: 'Allow travel',
        //         description: 'Does this event allow to add travel info (distance and duration)'
        //     },
        //     { /** miss*/
        //         name: 'restriction_color',
        //         label: 'Event color',
        //         description: 'Color of this type of event'
        //     },
        //     {
        //         name: 'restriction_max_duration_event',
        //         label: 'Max duration (Event)',
        //         description: 'Max duration for this event' //10h
        //     },
        //     {
        //         name: 'restriction_min_duration_event',
        //         label: 'Min duration (Event)',
        //         description: 'Min duration for this event' //0.25h
        //     },
        //     {
        //         name: 'restriction_max_duration_per_day_client',
        //         label: 'Max duration per day (Client)',
        //         description: 'Max duration of all events on the same day' //10h
        //     },
        //     { /** miss*/
        //         name: 'restriction_max_duration_per_day_provider',
        //         label: 'Max duration per day (Client)',
        //         description: 'Max duration of all events on the same day' //10h
        //     },
        //     {
        //         name: 'restriction_max_duration_per_week_client',
        //         label: 'Max duration per week (Client)',
        //         description: 'Max duration per week for the same client' //40h
        //     },
        //     {/** miss*/
        //         name: 'restriction_max_duration_per_week_provider',
        //         label: 'Max duration per week (Client)',
        //         description: 'Max duration per week for the same provider' //60h
        //     },
        //     { /** miss*/
        //         name: 'restriction_max_consecutive_day_client',
        //         label: 'Max consecutive days (Client)',
        //         description: 'Max number of consecutive days for the same client' //30days
        //     },
        //     { /** miss*/
        //         name: 'restriction_max_consecutive_day_provider',
        //         label: 'Max consecutive days (Provider)',
        //         description: 'Max number of consecutive days for the same provider' //30days
        //     },
        //     {
        //         name: 'restriction_skip_global_restriction',
        //         label: 'Skip global restrictions',
        //         description: 'Could this event skips global restrictions'
        //     },
        //     {
        //         name: 'restriction_show_preview',
        //         label: 'Show Preview',
        //         description: 'Not Set'
        //     },
        //     {
        //         name: 'restriction_cross_calendar_check',
        //         label: 'Cross calendar check',
        //         description: 'In case of multiple agencies, verifies calendars across all agencies to prevent scheduling conflicts.'
        //     }
        // ]

        this.restrictionData = cleanData
        this.restrictionLoading = false
    }
}).signal;





































