import {Card, Divider, Flex, Group, Stack, Button, Select} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.tsx";
import EzTable from "@/ezMantine/table/EzTable.tsx";
import EzCard from "@/ezMantine/card/EzCard.tsx";
import {IconDownload} from "@tabler/icons-react";
import {DownloadController} from "./DownloadController.ts";
import moment from "moment";

// Mock data for trips
const tripsData = [
    {id: 1, charterOrder: 'JMC-2025-001', paxName: 'John Smith', pickupTime: '08:00', pickupLocation: 'Hotel Marriott', dropoffTime: '09:30', dropoffLocation: 'MIA Airport', pax: 3, hours: 1.5, fare: 150.00},
    {id: 2, charterOrder: 'JMC-2025-002', paxName: 'Maria Garcia', pickupTime: '10:00', pickupLocation: 'MIA Airport', dropoffTime: '11:00', dropoffLocation: 'Downtown Miami', pax: 2, hours: 1.0, fare: 85.00},
    {id: 3, charterOrder: 'JMC-2025-003', paxName: 'Robert Johnson', pickupTime: '14:00', pickupLocation: 'Brickell Office', dropoffTime: '15:30', dropoffLocation: 'FLL Airport', pax: 4, hours: 1.5, fare: 175.00},
    {id: 4, charterOrder: 'JMC-2025-004', paxName: 'Lisa Williams', pickupTime: '17:00', pickupLocation: 'Coral Gables', dropoffTime: '18:00', dropoffLocation: 'South Beach', pax: 2, hours: 1.0, fare: 95.00},
];

// Mock data for break log
const breakLogData = [
    {id: 1, start: '12:00', end: '12:30', initial: 'JG'},
    {id: 2, start: '15:30', end: '16:00', initial: 'JG'},
];

// Mock data for mileage
const mileageData = [
    {id: 1, start: 45230, end: 45385, miles: 155},
];

// Mock data for gas log
const gasLogData = [
    {id: 1, gallons: 25.5, cost: 89.25},
];

const drivers = [
    {value: 'jorge', label: 'Jorge Martinez'},
    {value: 'carlos', label: 'Carlos Rodriguez'},
    {value: 'miguel', label: 'Miguel Santos'},
    {value: 'pedro', label: 'Pedro Gonzalez'},
];

export default function ResumenChoferes() {
    const {selectedDate, filterMode, selectedDriver, setSelectedDriver} = DownloadController;

    const grandTotal = tripsData.reduce((sum, t) => sum + t.fare, 0);
    const totalHours = tripsData.reduce((sum, t) => sum + t.hours, 0);
    const totalMiles = mileageData.reduce((sum, m) => sum + m.miles, 0);
    const totalTrips = tripsData.length;

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
        console.log('Download Resumen Choferes report');
    }

    return (
        <Stack gap="md">
            <EzCard
                customHeader={
                    <Flex justify="space-between" align="center" flex={1}>
                        <EzText fw="bold">Driver Daily Summary - {getDateLabel()}</EzText>
                        <Flex gap="md" align="center">
                            <Select
                                placeholder="Select Driver"
                                data={drivers}
                                value={selectedDriver}
                                onChange={setSelectedDriver}
                                clearable
                                w={200}
                            />
                            <Button
                                leftSection={<IconDownload size={16}/>}
                                variant="light"
                                onClick={handleDownload}
                            >
                                Download
                            </Button>
                        </Flex>
                    </Flex>
                }
            >
                <Stack gap="md">
                    {/* Summary Cards */}
                    <Group justify="space-between">
                        <Stack flex={1} align="center" gap={8}>
                            <EzText size="xl" fw="xxl">${grandTotal.toFixed(2)}</EzText>
                            <EzText size="xs">Grand Total</EzText>
                        </Stack>
                        <Divider orientation="vertical"/>
                        <Stack flex={1} align="center" gap={8}>
                            <EzText size="xl" fw="xxl" c="teal">${(grandTotal * 0.25).toFixed(2)}</EzText>
                            <EzText size="xs">Total to Company</EzText>
                        </Stack>
                        <Divider orientation="vertical"/>
                        <Stack flex={1} align="center" gap={8}>
                            <EzText size="xl" fw="xxl">{totalMiles} mi</EzText>
                            <EzText size="xs">Total Miles</EzText>
                        </Stack>
                        <Divider orientation="vertical"/>
                        <Stack flex={1} align="center" gap={8}>
                            <EzText size="xl" fw="xxl">{totalTrips} Trips</EzText>
                            <EzText size="xs">Total Trips</EzText>
                        </Stack>
                    </Group>

                    {/* Trips Table */}
                    <Card>
                        <EzText pb={16} fw="bold">Trips</EzText>
                        <EzTable
                            head={['Charter Order', 'Pax Name', 'P/U Time', 'P/U Location', 'D/O Time', 'D/O Location', 'Pax', 'Hours', 'Fare']}
                            tdMap={[
                                {name: 'charterOrder'},
                                {name: 'paxName'},
                                {name: 'pickupTime'},
                                {name: 'pickupLocation'},
                                {name: 'dropoffTime'},
                                {name: 'dropoffLocation'},
                                {name: 'pax'},
                                {name: 'hours'},
                                {name: 'fare', render: (row: any) => `$${row.fare.toFixed(2)}`},
                            ]}
                            data={tripsData}
                            dataKey="id"
                        />
                    </Card>

                    {/* Bottom Tables Row */}
                    <Flex gap={16}>
                        <Card style={{flex: 1}}>
                            <Stack>
                                <EzText pb={16} fw="bold">Break Log</EzText>
                                <EzTable
                                    head={['Start', 'End', 'Initial']}
                                    tdMap={[
                                        {name: 'start'},
                                        {name: 'end'},
                                        {name: 'initial'},
                                    ]}
                                    data={breakLogData}
                                    dataKey="id"
                                />
                            </Stack>
                        </Card>
                        <Card style={{flex: 1}}>
                            <Stack>
                                <EzText pb={16} fw="bold">Actual Mileage</EzText>
                                <EzTable
                                    head={['Start', 'End', 'Miles']}
                                    tdMap={[
                                        {name: 'start', render: (row: any) => row.start.toLocaleString()},
                                        {name: 'end', render: (row: any) => row.end.toLocaleString()},
                                        {name: 'miles'},
                                    ]}
                                    data={mileageData}
                                    dataKey="id"
                                />
                            </Stack>
                        </Card>
                        <Card style={{flex: 1}}>
                            <Stack>
                                <EzText pb={16} fw="bold">Gas Log</EzText>
                                <EzTable
                                    head={['Gallons', 'Cost']}
                                    tdMap={[
                                        {name: 'gallons'},
                                        {name: 'cost', render: (row: any) => `$${row.cost.toFixed(2)}`},
                                    ]}
                                    data={gasLogData}
                                    dataKey="id"
                                />
                            </Stack>
                        </Card>
                    </Flex>

                    {/* Grand Total Footer */}
                    <Card>
                        <Flex justify="flex-end">
                            <EzText bold="Grand Total: ">${grandTotal.toFixed(2)}</EzText>
                        </Flex>
                    </Card>
                </Stack>
            </EzCard>
        </Stack>
    );
}
