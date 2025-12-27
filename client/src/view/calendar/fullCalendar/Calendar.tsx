import {lazy, Suspense} from "react";
import type {
    // EventApi,
    DateSelectArg,
    EventClickArg,
    EventContentArg,
    // EventRemoveArg,
    DatesSetArg
    // EventSourceFuncArg,
    /*formatDate,*/
} from '@fullcalendar/core'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from '@fullcalendar/list'
import interactionPlugin from "@fullcalendar/interaction";
import { Overlay, Skeleton } from "@mantine/core";
import "./Calendar.scss";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {CalendarController} from "../CalendarController.ts";
import CalendarCard from "@/view/calendar/fullCalendar/CalendarCard.tsx";
import {EventCreationModalController} from "@/view/calendar/_modal/eventCreation/EventCreationModalController.ts";
import moment from "moment";
import _ from "lodash";

// dynamic imports
const EventCreationModal =
    lazy(() => import("../_modal/eventCreation/EventCreationModal.jsx"));
// const AddEditEvent = lazy(() => import("../_modal/AddEditEvent.jsx"));

// const EditEventModal = lazy(() => import("../_modal/editEvent/EventEditModal.jsx"));
// const PreviewEventModal = lazy(() => import("../_modal/PreviewEventModal.jsx"));

export default function Calendar() {
    const {
        calendarGetData,
        // lastRange,
        calendarLoading,
        initialView,
        initialDate
    } = CalendarController;

    async function handleAddEditEvent (
        props: DateSelectArg | EventClickArg
    ):Promise<void> {
        // update start and end dates and times
        let start: Date | null | undefined;
        let end: Date | null | undefined;

        if (_.has(props, "start")) {
            ({ start, end } = props as DateSelectArg);
        } else if (_.has(props, "event")) {
            ({ start, end } = (props as EventClickArg).event);
        }

        let dates: Record<string, any> = {};
        if (start && end) {
            dates = {
                calendar_event_start_date: start,
                calendar_event_end_date: end,
                calendar_event_start_time: moment(start).format("HH:mm:ss"),
                calendar_event_end_time: moment(end).format("HH:mm:ss"),
            };
        }

        EventCreationModalController.updateDate(dates)

        // is resizing
        if (_.has(props, "event")) {
            if ("oldEvent" in props) {
                dates.calendar_event_id = (props as any).oldEvent.id;
            }
            dates.calendar_event_start_date = moment(start).format('YYYY-MM-DD')
            dates.calendar_event_end_date = moment(end).format('YYYY-MM-DD')

            await window.toast.U({
                id: {
                    title: 'Editing Event',
                    message: 'Please wait...'
                },
                update: {
                    success: `Event edited successfully.`,
                    error: `Event editing failed`,
                },
                cb: () => EventCreationModalController.handleResizeAppointment(dates)
            })
        } else {
            window.openModal({
                modalId: "event-creation-modal",
                title: EventCreationModalController.title,
                size: "80%",
                children: (
                    <Suspense fallback={<Skeleton h={500} />}>
                        <EventCreationModal/>
                    </Suspense>
                ),
                onClose: () => {
                    EventCreationModalController.resetState();
                    EventCreationModalController.resetLocalClient()
                },
            });
        }
    }

    // return calendarLoading
    //     ? (
    //         <Overlay color="#000" backgroundOpacity={0.2}>
    //             <EzLoader h="100vh" />
    //         </Overlay>
    //     ) : (
    //
    //     )

    return (
        <>
            {calendarLoading && (
                <Overlay color="#000" backgroundOpacity={0.2}>
                    <EzLoader h="100vh" />
                </Overlay>
            )}
            <FullCalendar
                ref={(ref) => {
                    if (ref) {
                        CalendarController.calendarApi = ref.getApi()
                        CalendarController.updateCalendarVariables()
                    }
                }}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "timeGridWeek,timeGridDay,dayGridMonth,listWeek",
                }}

                initialView={initialView}
                // this is being call every time view type change
                datesSet={function (this: any, props: DatesSetArg){
                    CalendarController.initialView = props.view.type;
                }}
                eventContent={(eventInfo: EventContentArg) => <CalendarCard eventInfo={eventInfo}/>}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                dayHeaders={true}
                eventResize={handleAddEditEvent}
                eventDrop={handleAddEditEvent}
                // events={(_info: EventSourceFuncArg, successCallback, failureCallback) => {
                //     calendarGetData()
                //         .then((data: EventApi[]) => {
                //             successCallback(data as any);
                //         })
                //         .catch((err: unknown) => {
                //             failureCallback(err as any);
                //         });
                // }}
                events={function (info: any, successCallback){
                    // const start = moment(info.start).format("YYYY-MM-DD");
                    // const end = moment(info.end).format("YYYY-MM-DD");
                    // const lastRange = CalendarController.lastRange
                    // if (
                    //     lastRange &&
                    //     moment(start).isSame(lastRange.start) &&
                    //     moment(end).isSame(lastRange.end)
                    // ) {
                    //     return;
                    // }
                    //
                    // CalendarController.lastRange = {start, end}
                    calendarGetData(info, successCallback);
                }}
                select={handleAddEditEvent}
                // eventClick={handleAddEditEvent}
                // eventRemove={({ event, revert }: EventRemoveArg) => {
                //     const allowDelete = false;
                //     if (allowDelete) {
                //         console.log("Event Removed", event.id);
                //     } else {
                //         revert();
                //     }
                // }}
                initialDate={initialDate}
                dayCellClassNames={(arg) => {
                    if (arg.isToday) {
                        return "today-cell";
                    }
                    return "all-cell";
                }}
            />
        </>
    )
}