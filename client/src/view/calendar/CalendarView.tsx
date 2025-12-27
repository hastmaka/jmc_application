import {Flex} from "@mantine/core";
import classes from './CalendarView.module.scss'
import Calendar from "./fullCalendar/Calendar.tsx";
import Sidebar from "./sidebar/Sidebar.tsx";

export default function CalendarView() {
    return (
        <Flex
            flex={1}
            mih='100%'
            gap={8}
            // style={{border: '1px solid gray', height: 'calc(100vh - 92px)'}}
        >
            <Sidebar/>
            <div className={classes['calendar-container']}>
                <Calendar/>
            </div>
        </Flex>
    )
}
