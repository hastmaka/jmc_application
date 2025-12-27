import { DatePicker } from "@mantine/dates";
import { CalendarController } from "@/view/calendar/CalendarController.js";

export default function SidebarDate() {
    return (
        <div className="calendar-sidebar">
            <DatePicker
                size="sm"
                value={CalendarController.selectedDate}
                onChange={CalendarController.handleDateChange}
                getDayProps={CalendarController.setSelectedDateColorInDatePicker}
            />
        </div>
    );
}