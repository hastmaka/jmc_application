import {Flex} from "@mantine/core";
import {IconBook2} from "@tabler/icons-react";
import type {EventContentArg} from "@fullcalendar/core";
import EzText from "@/ezMantine/text/EzText.tsx";

function WeekView({eventInfo}: {eventInfo: EventContentArg}) {
    return (
        <Flex gap={4} className='month-card-view'>
            <IconBook2 className='card-icon' color='white'/>
            <EzText c='white' fw='md'>{eventInfo.event.title}</EzText>
        </Flex>
    )
}

export default WeekView;