import {lazy, Suspense} from "react";
import {Flex, SegmentedControl, Stack} from "@mantine/core";
import {DatePickerInput, MonthPickerInput, YearPickerInput} from "@mantine/dates";
import {IconCalendar} from "@tabler/icons-react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {DownloadController} from "./DownloadController.ts";

const Combustible = lazy(() => import('./Combustible.tsx'));
const Millas = lazy(() => import('./Millas.tsx'));
const ResumenChoferes = lazy(() => import('./ResumenChoferes.tsx'));

export default function Download() {
    const {activeTab, filterMode, selectedDate, setActiveTab, setFilterMode, setSelectedDate} = DownloadController;

    const tabs = [
        {label: 'Combustible 2025', value: 'combustible'},
        {label: 'Millas', value: 'millas'},
        {label: 'Resumen Diario', value: 'resumen'},
    ];

    function renderDatePicker() {
        const commonProps = {
            value: selectedDate,
            onChange: (date: Date | null) => date && setSelectedDate(date),
            rightSection: <IconCalendar size={18} stroke={1.5}/>,
            rightSectionPointerEvents: "none" as const,
        };

        switch (filterMode) {
            case 'day':
                return <DatePickerInput {...commonProps} placeholder="Select day" w={200}/>;
            case 'month':
                return <MonthPickerInput {...commonProps} placeholder="Select month" w={200}/>;
            case 'year':
                return <YearPickerInput {...commonProps} placeholder="Select year" w={200}/>;
        }
    }

    function renderContent() {
        switch (activeTab) {
            case 'combustible':
                return <Combustible/>;
            case 'millas':
                return <Millas/>;
            case 'resumen':
                return <ResumenChoferes/>;
            default:
                return null;
        }
    }

    return (
        <Stack p="md" style={{width: "100%", height: "100%", maxWidth: "1600px", margin: "0 auto"}}>
            <Flex justify="space-between" align="center" wrap="wrap" gap="md">
                <SegmentedControl
                    value={activeTab}
                    onChange={setActiveTab}
                    data={tabs}
                />
                <Flex gap="md" align="center">
                    <SegmentedControl
                        value={filterMode}
                        onChange={(v) => setFilterMode(v as 'day' | 'month' | 'year')}
                        data={[
                            {label: 'Day', value: 'day'},
                            {label: 'Month', value: 'month'},
                            {label: 'Year', value: 'year'},
                        ]}
                        size="xs"
                    />
                    {renderDatePicker()}
                </Flex>
            </Flex>

            <Suspense fallback={<EzLoader h={400}/>}>
                {renderContent()}
            </Suspense>
        </Stack>
    );
}
