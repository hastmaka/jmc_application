import {Flex} from "@mantine/core";
import {IconBook2} from "@tabler/icons-react";
import EzText from "@/ezMantine/text/EzText.tsx";
import type {EventContentArg} from "@fullcalendar/core";

function MonthView({eventInfo}: {eventInfo: EventContentArg}) {
    return (
        <Flex
            gap={4}
            flex={1}
            className='month-card-view'
            bg={eventInfo.event.backgroundColor}
        >
            <IconBook2
                className='card-icon'
                color='white'
            />
            <EzText c='white' fw='md'>{eventInfo.event.title}</EzText>
        </Flex>
    )
}

export default MonthView;