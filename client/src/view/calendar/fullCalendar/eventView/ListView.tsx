import type {EventContentArg} from "@fullcalendar/core";

function ListView({eventInfo}: {eventInfo: EventContentArg}) {
    return <span>{eventInfo.event.title}</span>
}

export default ListView;