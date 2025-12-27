import {SignalController} from "@/signals/signalController/SignalController.ts";
import type {SignalType} from "@/signals/SignalClass.ts";
import {FetchApi} from "@/api/FetchApi.ts";
import {getModel} from "@/api/models";
import {APPOINTMENTITEMS} from "@/view/calendar/_modal/eventCreation/Appointment.tsx";
import moment from "moment/moment";
import {CalendarController} from "@/view/calendar/CalendarController.ts";
import {updateFormData} from "@/util";
import _ from "lodash";

export const EventCreationModalController: SignalType<any, any> =
    new SignalController({
        mode: 'create',
        activeTab: 'appointment',
        title: 'Create Event',

        client_id: null,

        activeSelect: 'behavior_treatment',
        editMap: {
            calendar_event: async function(
                    field,
                    id: number | string,
                    _who,
                    rest
                ){
                    const {client_id, employee_id} = rest
                    EventCreationModalController.client_id = client_id
                    const filter = {
                        active_start: CalendarController.active_start,
                        active_end: CalendarController.active_end,
                        active_current: CalendarController.active_current
                    }

                    await EventCreationModalController.updateModalHeaderFromClient(+client_id, true)
                    await EventCreationModalController.updateModalHeaderFromRbt(+employee_id, true)

                    const response = await FetchApi(
                        `v1/calendar_event/edit/${+id}`,
                        'GET',
                        null,
                        {filter}
                    )

                    // I get this fields when get the data to update the modal header
                    response.data.rbt_name = EventCreationModalController._employee.employee_full_name
                    response.data.client_client_id = EventCreationModalController._client.client_full_name

                    EventCreationModalController._calendar_event_id = response.data.calendar_event_id

                    EventCreationModalController.formData!.appointment = updateFormData(field, response.data)
            }
        },
        selectedRbt: null
    }, {
        getCalendarDataReadyToDb: function (this: any){
            const form = this.formData.appointment
            return {
                calendar_event_title: APPOINTMENTITEMS.find(app =>
                    app.value === this.activeSelect)?.label,
                calendar_event_start_date: moment(form.calendar_event_start_date).format('YYYY-MM-DD'),
                calendar_event_end_date: moment(form.calendar_event_end_date).format('YYYY-MM-DD'),
                calendar_event_start_time: form.calendar_event_start_time,
                calendar_event_end_time: form.calendar_event_end_time,
                address_address_id: form.address_address_id,
                client_client_id: form.client_client_id,
                employee_employee_id: form.rbt_name
            }
        },
        handleCheckBoxes: function(this:any, name: string, value: string){
            const checkArr = [
                'repeat_every_day_for_a_week',
                'repeat_every_day_for_a_month',
                'repeat_this_day_for_a_month'
            ]

            _.each(checkArr, (item: string) => {
                if (this.formData.appointment[item]) {
                    this.formData.appointment[item] = false
                }
            })
            this.formData.appointment[name] = value
        },
        setActiveTab: function (this: any, tab: any) {
            if (this.activeTab !== tab) {
                this.formData![this['activeTab']] = {}
                this.activeTab = tab
                this['updateDate']()
            }
        },
        updateDate: function (this: any, dates: Record<string, any>) {
            if (!this.dates) this.dates = dates
            if (this.activeTab === 'appointment') {
                this.formData![this.activeTab] = {}
                Object.entries(this.dates).map(([key, value]) => {
                    this.formData![this.activeTab][key] = value
                })
            }
        },
        /** this is trigger when user clicked on close button so we need to reset
         * all fields in the formData less {...dates, client_client_id: ''}*/
        resetLocalClient: function (this: any) {
            this.formData.appointment = {
                ...this.dates,
                client_client_id: ''
            }
            this.title = 'Create Event'
            this.client_id = null
            window.updateModal("event-creation-modal", {title: this.title})
            /** this is for reset the modal when close o cancel*/
            setTimeout(() => {
                this.activeTab = 'appointment'
                this.activeSelect = 'behavior_treatment'
            }, 200)

        },
        resetLocalRbt: function (this: any) {
            this.title = this.oldTitle
            window.updateModal("event-creation-modal", {title: this.title})
            // setTimeout(() => {
            //     this.activeTab = 'appointment'
            //     this.activeSelect = 'behavior_treatment'
            // }, 200)
        },
        setActiveSelect: function (this: any, value: string) {
            this.activeSelect = value
        },
        maladaptiveBehaviorGetData: async function (this: any) {
            const response = await FetchApi(`v1/asset/${25}`)
            this.maladaptiveBehaviorData = response.data.asset_options.map((asset: any) =>
                new (getModel('assetOption'))(asset))
            this.maladaptiveBehaviorLoading = false
        },
        updateModalHeaderFromClient: async function (
            this: any,
            client_id: any,
            fromCalendarEvent?: boolean
        ) {
            this.client_id = client_id
            const response = await FetchApi(
                `v1/client/calendar/create/hour/${client_id}`,
                'GET',
                null,
                {
                    filter: {
                        active_start: CalendarController.active_start,
                        active_end: CalendarController.active_end,
                        active_current: CalendarController.active_current
                    }
                }
            )


            // we save what we need here to use in editMap->calendar_event
            if (fromCalendarEvent) {
                this._client = {
                    client_client_id: response.data.client_id,
                    client_full_name: response.data.client_full_name
                }
            }

            // max hours per rbt (agency setting could (1 - 8hr))
            // max hours per day (depends on the calc ex: total hours of the client / days of work)
            // rbt limit weekly (60) - agency
            // rbt limit daily (12) - agency

            const {
                total_hour, // sum of all hours in the calendar on this week
                total_current_day_hour, // amount of hours scheduled on this event day
                total_day_max_hour, // total of hours of the client day
                total_week_max_hour, // total hours of the client week
                // total_day_max_hour_per_rbt, // total of hours of the rbt day
                // total_week_max_hour_per_rbt // total of hours of the rbt week
            } = response.data

            // `Create Event : Hor`
            this.title = 'Create Event: ' +
                `Client - [ ` +
                `Week Hrs: ${total_hour} / ${total_week_max_hour} ` +
                `Day Hrs: ${total_current_day_hour} / ${total_day_max_hour} ] `
            window.updateModal("event-creation-modal", {title: this.title})
        },
        updateModalHeaderFromRbt: async function (
            this: any,
            employee_id: any,
            fromCalendarEvent?: boolean
        ) {
            this.oldTitle = this.title

            const response = await FetchApi(
                `v1/employee/calendar/create/hour/${this.client_id}/${employee_id}`,
                'GET',
                null,
                {
                    filter: {
                        active_start: CalendarController.active_start,
                        active_end: CalendarController.active_end,
                        active_current: CalendarController.active_current
                    }
                }
            )

            if (fromCalendarEvent) {
                this._employee = {
                    employee_employee_id: response.data.employee_id,
                    employee_full_name: response.data.employee_full_name
                }
            }

            const {
                total_hour, // sum of all hours that has scheduled this week
                total_current_day_hour, // amount of hours remains on this event day
                total_day_max_hour, // total of hours of the client day
                total_week_max_hour, // total hours of the client week
                // total_day_max_hour_per_rbt, // total of hours of the rbt day
                // total_week_max_hour_per_rbt // total of hours of the rbt week
            } = response.data

            this.title = this.oldTitle +
                `- Employee - [ ` +
                `Week Hrs: ${total_hour} / ${total_week_max_hour} ` +
                `Day Hrs: ${total_current_day_hour} / ${total_day_max_hour} ]`
            window.updateModal("event-creation-modal", {title: this.title})
        },
        handleCreateAppointment: async function(this: any){
            // calendar_event_start_date
            // calendar_event_end_date
            // calendar_event_start_time
            // calendar_event_end_time
            // calendar_event_title (in case of holy-days and staff)
            // calendar_event_description
            // employee_employee_id
            // client_client_id
            // address_address_id

            const response = await FetchApi(
                'v1/calendar_event',
                "POST",
                this.getCalendarDataReadyToDb()
            )

            if (!response.success) {
                CalendarController.calendarApi.refetchEvents()
                throw Error('Something goes wrong, contact Admin')
            }

            CalendarController.calendarApi.refetchEvents()
        },
        handleEditAppointment: async function(this: any){
            const data = this.getCalendarDataReadyToDb()
            data.employee_employee_id = this._employee.employee_employee_id
            data.client_client_id = this._client.client_client_id
            data.calendar_event_id = this._calendar_event_id
            const response = await FetchApi(
                'v1/calendar_event',
                "PUT",
                data
            )

            if (!response.success) {
                CalendarController.calendarApi.refetchEvents()
                throw Error('Something goes wrong, contact Admin')
            }

            CalendarController.calendarApi.refetchEvents()
        },
        handleResizeAppointment: async function(this: any, data: any){
            const response = await FetchApi(
                'v1/calendar_event',
                "PUT",
                data
            )

            if (!response.success) {
                CalendarController.calendarApi.refetchEvents()
                throw Error('Something goes wrong, contact Admin')
            }

            CalendarController.calendarApi.refetchEvents()

        },
        handleDeleteAppointment: async function(){

        },
        handleAddressSubmit: async function(this: any){
            debugger
        },
        assignRbtGetData: async function(this: any){
            const response = await FetchApi(`v1/employee/calendar/create/link_with_client/${this.client_id}`)
            console.log(response.data)
            this.assignRbtData = response.data
            this.assignRbtLoading = false
        },
        handleAssignRbt: async function(this: any){
            const response = await FetchApi(
                'v1/client_employee',
                'POST',
                {
                    client_client_id: this.client_id,
                    employee_employee_id: this.selectedRbt
                }
            )

            if (!response.success) {
                throw Error('Something goes wrong, contact Admin')
            }
        }
    }).signal
























