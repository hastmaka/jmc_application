import {SignalController} from "@/signals/signalController/SignalController.js";
import type {SignalType} from "@/signals/SignalClass.ts";
import {FetchApi} from "@/api/FetchApi.ts";
import moment from "moment";

// const events = [
//     {
//         "calendar_id": 1,
//         "calendar_date": "2025-09-08",
//         "calendar_title": "test",
//         "calendar_description": "test description ",
//         "agency_agency_id": 1,
//         "client_client_id": 1,
//         "employee_employee_id": 1,
//         "user_user_id": 1,
//         "created_at": "2025-09-06T17:49:09.000Z",
//         "updated_at": "2025-09-06T17:49:09.000Z",
//         "deleted_at": null,
//         "calendar_events": [
//             {
//                 "calendar_event_id": 1,
//                 "calendar_event_start_date": "2025-09-08",
//                 "calendar_event_end_date": "2025-09-08",
//                 "calendar_event_start_time": "08:00:00",
//                 "calendar_event_end_time": "14:00:00",
//                 "calendar_event_title": "test event ",
//                 "calendar_event_description": "test event description ",
//                 "agency_agency_id": 1,
//                 "calendar_calendar_id": 1,
//                 "client_client_id": 1,
//                 "employee_employee_id": 1,
//                 "user_user_id": 1,
//                 "created_at": "2025-09-06T17:53:05.000Z",
//                 "updated_at": "2025-09-06T17:53:05.000Z",
//                 "deleted_at": null
//             },
//             {
//                 "calendar_event_id": 2,
//                 "calendar_event_start_date": "2025-09-08",
//                 "calendar_event_end_date": "2025-09-08",
//                 "calendar_event_start_time": "09:00:00",
//                 "calendar_event_end_time": "15:00:00",
//                 "calendar_event_title": "test event 2",
//                 "calendar_event_description": "test event description 2 ",
//                 "agency_agency_id": 1,
//                 "calendar_calendar_id": 1,
//                 "client_client_id": 2,
//                 "employee_employee_id": 2,
//                 "user_user_id": 2,
//                 "created_at": "2025-09-06T17:53:05.000Z",
//                 "updated_at": "2025-09-06T17:53:05.000Z",
//                 "deleted_at": null
//             }
//         ]
//     },
//     {
//         "calendar_id": 2,
//         "calendar_date": "2025-09-09",
//         "calendar_title": "test2",
//         "calendar_description": "test description 2",
//         "agency_agency_id": 1,
//         "client_client_id": 1,
//         "employee_employee_id": 1,
//         "user_user_id": 1,
//         "created_at": "2025-09-06T17:49:09.000Z",
//         "updated_at": "2025-09-06T17:49:09.000Z",
//         "deleted_at": null,
//         "calendar_events": [
//             {
//                 "calendar_event_id": 3,
//                 "calendar_event_start_date": "2025-09-09",
//                 "calendar_event_end_date": "2025-09-09",
//                 "calendar_event_start_time": "08:00:00",
//                 "calendar_event_end_time": "14:00:00",
//                 "calendar_event_title": "test event 3",
//                 "calendar_event_description": "test event description 3",
//                 "agency_agency_id": 1,
//                 "calendar_calendar_id": 2,
//                 "client_client_id": 1,
//                 "employee_employee_id": 1,
//                 "user_user_id": 1,
//                 "created_at": "2025-09-06T17:53:05.000Z",
//                 "updated_at": "2025-09-06T17:53:05.000Z",
//                 "deleted_at": null
//             }
//         ]
//     },
//     {
//         "calendar_id": 3,
//         "calendar_date": "2025-09-10",
//         "calendar_title": "test3",
//         "calendar_description": "test description 3",
//         "agency_agency_id": 1,
//         "client_client_id": 1,
//         "employee_employee_id": 1,
//         "user_user_id": 1,
//         "created_at": "2025-09-06T17:49:09.000Z",
//         "updated_at": "2025-09-06T17:49:09.000Z",
//         "deleted_at": null,
//         "calendar_events": [
//             {
//                 "calendar_event_id": 4,
//                 "calendar_event_start_date": "2025-09-10",
//                 "calendar_event_end_date": "2025-09-10",
//                 "calendar_event_start_time": "08:00:00",
//                 "calendar_event_end_time": "14:00:00",
//                 "calendar_event_title": "test event 4",
//                 "calendar_event_description": "test event description 4",
//                 "agency_agency_id": 1,
//                 "calendar_calendar_id": 3,
//                 "client_client_id": 1,
//                 "employee_employee_id": 1,
//                 "user_user_id": 1,
//                 "created_at": "2025-09-06T17:53:05.000Z",
//                 "updated_at": "2025-09-06T17:53:05.000Z",
//                 "deleted_at": null
//             }
//         ]
//     },
//     {
//         "calendar_id": 4,
//         "calendar_date": "2025-09-11",
//         "calendar_title": "test4",
//         "calendar_description": "test description 4",
//         "agency_agency_id": 1,
//         "client_client_id": 1,
//         "employee_employee_id": 1,
//         "user_user_id": 1,
//         "created_at": "2025-09-06T17:49:09.000Z",
//         "updated_at": "2025-09-06T17:49:09.000Z",
//         "deleted_at": null,
//         "calendar_events": []
//     },
//     {
//         "calendar_id": 5,
//         "calendar_date": "2025-09-12",
//         "calendar_title": "test5",
//         "calendar_description": "test description 5",
//         "agency_agency_id": 1,
//         "client_client_id": 1,
//         "employee_employee_id": 1,
//         "user_user_id": 1,
//         "created_at": "2025-09-06T17:49:09.000Z",
//         "updated_at": "2025-09-06T17:49:09.000Z",
//         "deleted_at": null,
//         "calendar_events": []
//     }
// ]

export function transformEvents(events: any[]) {
    return events.flatMap((calendar) =>
        calendar.calendar_events.map((event: any, index: number) => ({
            id: event.calendar_event_id,
            title: event.calendar_event_title,
            start: `${event.calendar_event_start_date}T${event.calendar_event_start_time}`,
            end: `${event.calendar_event_end_date}T${event.calendar_event_end_time}`,
            description: event.calendar_event_description,
            extendedProps: {
                agencyId: event.agency_agency_id,
                clientId: event.client_client_id,
                clientName: event.client_full_name,
                employeeId: event.employee_employee_id,
                employeeName: event.employee_full_name,
                addressId: event.address_address_id,
                addressConcat: event.address_concat,
            },
            backgroundColor: `var(--mantine-color-aba-${index})`
            // allDay: true
        }))
    )
}

export const CalendarController: SignalType<any,any> = new SignalController({
    //calendar reference
    calendarApi: null,
    initialView: 'timeGridWeek',
    // we need this to lock the view in the server request lets say, I want from 7 to 14 so any
    // time I send a request I send that range to get back and be in the same page
    initialDate: new Date(),
    lastRange: { start: null, end: null }
}, {
    calendarGetData: async function(this: any, info: any, successCallback: any){
        const start = moment(info.start).format('YYYY-MM-DD') || this.active_start
        const end = moment(info.end).format('YYYY-MM-DD') || this.active_end

        const response = await FetchApi(
            'v1/calendar',
            'GET',
            null,
            {
                filter: [{
                    fieldName: 'calendar_date',
                    operator: 'between',
                    value: [start, end]
                }]
            }
        )
        CalendarController.calendarLoading = false
        return successCallback(transformEvents(response.data))
    },
    updateCalendarVariables: function (this: any) {
        const calendarApi = this.calendarApi

        const active_start_week = new Date(calendarApi.view.activeStart)
        const active_end_week = new Date(calendarApi.view.activeEnd)
        const active_current_day = new Date(calendarApi.view.calendar.getDate())

        let active_start = moment(active_start_week).format("YYYY-MM-DD"),
            active_end = moment(active_end_week).format("YYYY-MM-DD"),
            active_current = moment(active_current_day).format("YYYY-MM-DD");

        const variables = {active_start,active_end,active_current}

        Object.entries(variables).map(([key, value]) => {
            this[key] = value
        })
    },
}).signal