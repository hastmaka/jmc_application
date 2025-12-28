import {DatePickerInput, type DatePickerPreset} from "@mantine/dates";
import {IconFilter} from "@tabler/icons-react";
import dayjs from "dayjs";
import {useState} from "react";

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getMonthPresets(year: number): DatePickerPreset<'range'>[] {
    return MONTHS.map((label, i) => ({
        value: [
            dayjs().year(year).month(i).startOf('month').format('YYYY-MM-DD'),
            dayjs().year(year).month(i).endOf('month').format('YYYY-MM-DD')
        ] as [string, string],
        label
    }));
}

export default function DatePickerInputWithMonth({
    formData,
    handleInput,
    ...rest
}: {
    formData: Record<string, any>;
    handleInput: (type: string, name: string, value: any,) => void;
    [key: string]: any;
}) {
    const [displayedYear, setDisplayedYear] = useState(dayjs().year());

    return (
        <DatePickerInput
            w={340}
            type='range'
            clearable
            rightSection={<IconFilter size={18} stroke={1.5} />}
            rightSectionPointerEvents="none"
            placeholder="Date Range Filter"
            allowSingleDateInRange
            value={formData?.['date_range']}
            onChange={(value) => handleInput('custom_header_fuel', 'date_range', value)}
            onDateChange={(date) => setDisplayedYear(dayjs(date).year())}
            presets={getMonthPresets(displayedYear)}
            {...rest}
        />
    );
}