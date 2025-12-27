import {Card, Divider, Flex, Group, Stack, Button} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.tsx";
import EzTable from "@/ezMantine/table/EzTable.tsx";
import EzCard from "@/ezMantine/card/EzCard.tsx";
import {IconDownload} from "@tabler/icons-react";
import {DownloadController} from "./DownloadController.ts";
import moment from "moment";

// Mock data for mileage records
const mileageRecords = [
    {id: 1, date: '2025-01-15', car: 'JMC01', driver: 'Jorge', startMiles: 45230, endMiles: 45385, tripMiles: 155},
    {id: 2, date: '2025-01-14', car: 'JMC02', driver: 'Carlos', startMiles: 32100, endMiles: 32280, tripMiles: 180},
    {id: 3, date: '2025-01-13', car: 'JMC01', driver: 'Jorge', startMiles: 45085, endMiles: 45230, tripMiles: 145},
    {id: 4, date: '2025-01-12', car: 'JMC03', driver: 'Miguel', startMiles: 28500, endMiles: 28620, tripMiles: 120},
    {id: 5, date: '2025-01-11', car: 'JMC04', driver: 'Pedro', startMiles: 51200, endMiles: 51410, tripMiles: 210},
    {id: 6, date: '2025-01-10', car: 'JMC02', driver: 'Carlos', startMiles: 31920, endMiles: 32100, tripMiles: 180},
    {id: 7, date: '2025-01-09', car: 'JMC01', driver: 'Jorge', startMiles: 44950, endMiles: 45085, tripMiles: 135},
    {id: 8, date: '2025-01-08', car: 'JMC03', driver: 'Miguel', startMiles: 28350, endMiles: 28500, tripMiles: 150},
];

// Summary by car
const carSummary = [
    {car: 'JMC01', totalMiles: 435, avgDaily: 145, currentOdometer: 45385},
    {car: 'JMC02', totalMiles: 360, avgDaily: 180, currentOdometer: 32280},
    {car: 'JMC03', totalMiles: 270, avgDaily: 135, currentOdometer: 28620},
    {car: 'JMC04', totalMiles: 210, avgDaily: 210, currentOdometer: 51410},
];

export default function Millas() {
    const {selectedDate, filterMode} = DownloadController;

    const totalMiles = mileageRecords.reduce((sum, r) => sum + r.tripMiles, 0);
    const avgDailyMiles = totalMiles / 8; // 8 days of records

    function getDateLabel() {
        switch (filterMode) {
            case 'day':
                return moment(selectedDate).format('MMMM D, YYYY');
            case 'month':
                return moment(selectedDate).format('MMMM YYYY');
            case 'year':
                return moment(selectedDate).format('YYYY');
        }
    }

    function handleDownload() {
        // TODO: Implement PDF/CSV export
        console.log('Download Millas report');
    }

    return (
        <Stack gap="md">
            <EzCard
                customHeader={
                    <Flex justify="space-between" align="center" flex={1}>
                        <EzText fw="bold">Mileage Report - {getDateLabel()}</EzText>
                        <Button
                            leftSection={<IconDownload size={16}/>}
                            variant="light"
                            onClick={handleDownload}
                        >
                            Download
                        </Button>
                    </Flex>
                }
            >
                <Stack gap="md">
                    {/* Summary Cards */}
                    <Group justify="space-between">
                        <Stack flex={1} align="center" gap={8}>
                            <EzText size="xl" fw="xxl">{totalMiles.toLocaleString()} mi</EzText>
                            <EzText size="xs">Total Miles</EzText>
                        </Stack>
                        <Divider orientation="vertical"/>
                        <Stack flex={1} align="center" gap={8}>
                            <EzText size="xl" fw="xxl">{avgDailyMiles.toFixed(0)} mi/day</EzText>
                            <EzText size="xs">Avg Daily Miles</EzText>
                        </Stack>
                        <Divider orientation="vertical"/>
                        <Stack flex={1} align="center" gap={8}>
                            <EzText size="xl" fw="xxl">{mileageRecords.length}</EzText>
                            <EzText size="xs">Total Trips</EzText>
                        </Stack>
                    </Group>

                    {/* Mileage Records Table */}
                    <Card>
                        <EzText pb={16} fw="bold">Mileage Records</EzText>
                        <EzTable
                            head={['Date', 'Car', 'Driver', 'Start Miles', 'End Miles', 'Trip Miles']}
                            tdMap={[
                                {name: 'date'},
                                {name: 'car'},
                                {name: 'driver'},
                                {name: 'startMiles', render: (row: any) => row.startMiles.toLocaleString()},
                                {name: 'endMiles', render: (row: any) => row.endMiles.toLocaleString()},
                                {name: 'tripMiles', render: (row: any) => `${row.tripMiles} mi`},
                            ]}
                            data={mileageRecords}
                            dataKey="id"
                        />
                    </Card>

                    {/* Summary by Car */}
                    <Card>
                        <EzText pb={16} fw="bold">Summary by Vehicle</EzText>
                        <EzTable
                            head={['Vehicle', 'Total Miles', 'Avg Daily', 'Current Odometer']}
                            tdMap={[
                                {name: 'car'},
                                {name: 'totalMiles', render: (row: any) => `${row.totalMiles} mi`},
                                {name: 'avgDaily', render: (row: any) => `${row.avgDaily} mi/day`},
                                {name: 'currentOdometer', render: (row: any) => row.currentOdometer.toLocaleString()},
                            ]}
                            data={carSummary}
                            dataKey="car"
                        />
                    </Card>
                </Stack>
            </EzCard>
        </Stack>
    );
}
