import {Flex, Group, Menu, Skeleton, Stack} from "@mantine/core";
import type {EventContentArg} from "@fullcalendar/core";
import {CalendarController} from "../CalendarController.ts";
import WeekView from "./eventView/WeekView.tsx";
import MonthView from "./eventView/MonthView.tsx";
import ListView from "./eventView/ListView.tsx";
import {ActionIconsToolTip} from "@/ezMantine/actionIconTooltip/ActionIconsToolTip.tsx";
import {
    IconMapPin,
    IconPencil,
    IconTrash,
    IconCalendarWeek,
    IconClockHour10,
    IconUser, IconUsers, IconDeviceLaptop
} from "@tabler/icons-react";
import {EventCreationModalController} from "@/view/calendar/_modal/eventCreation/EventCreationModalController.ts";
import {lazy, Suspense} from "react";
import EzText from "@/ezMantine/text/EzText.tsx";
import moment from "moment";
// dynamic imports
const EventCreationModal =
    lazy(() => import("../_modal/eventCreation/EventCreationModal.jsx"));

function CalendarCard({eventInfo}: {eventInfo: EventContentArg}) {
    console.log(eventInfo)
    const {calendarApi} = CalendarController;
    const view = calendarApi.view.type
    const {start} = eventInfo.event
    const _start = moment(start).format("MM/DD/YYYY");
    const {addressConcat, clientName, employeeName} = eventInfo.event.extendedProps

    function render() {
        const viewMap = {
            timeGridWeek: <WeekView eventInfo={eventInfo}/>,
            timeGridDay: <WeekView eventInfo={eventInfo}/>,
            dayGridMonth: <MonthView eventInfo={eventInfo}/>,
            listWeek: <ListView eventInfo={eventInfo}/>,
        }

        return (viewMap as any)[view as string]
    }

    async function handleEdit() {
        window.openModal({
            modalId: "event-creation-modal",
            title: EventCreationModalController.title,
            size: "80%",
            children: (
                <Suspense fallback={<Skeleton h={500} />}>
                    {/*<AddEditEvent props={props} />*/}
                    <EventCreationModal eventInfo={eventInfo}/>
                </Suspense>
            ),
            onClose: () => {
                EventCreationModalController.resetState();
                EventCreationModalController.resetLocalClient()
            },
        });
    }

    const ITEMS = [
        {
            icon: <IconTrash/>,
            tooltip: 'Delete Event',
            onClick: handleEdit
        },
        {
            icon: <IconPencil/>,
            tooltip: 'Edit Event',
            onClick: handleEdit
        }
    ]

    function renderInfo(){

        const INFO = [
            {
                icon: <IconCalendarWeek/>,
                text: _start
            },
            {
                icon: <IconDeviceLaptop/>,
                text: '12 Units | 3 Hours | CPT-97153 (12)'
            },
            {
                icon: <IconClockHour10/>,
                text: eventInfo.timeText
            },
            {
                icon: <IconUser/>,
                text: clientName
            },
            {
                icon: <IconUsers/>,
                text: employeeName
            },
            {
                icon: <IconMapPin/>,
                text: addressConcat
            }
        ]

        return INFO.map(({icon, text}, index) => {
            return (
                <Group wrap='nowrap' key={index}>
                    {icon}
                    <EzText>{text}</EzText>
                </Group>
            )
        })
    }

    return (
        <Menu width={400} shadow="sm" withArrow zIndex={120}>
            <Menu.Target>
                <div>
                    {render()}
                </div>
            </Menu.Target>

            <Menu.Dropdown p={0} className='drop-down-bg'>
                <Stack gap={0}>
                    <Flex p={16} className='card-header' justify='space-between'>
                        <span>{eventInfo.event.title}</span>
                        <ActionIconsToolTip
                            ITEMS={ITEMS}
                        />
                    </Flex>

                    <Stack p={8} gap={8}>
                        {renderInfo()}
                    </Stack>
                </Stack>
            </Menu.Dropdown>
        </Menu>
    );
}

export default CalendarCard;