import {Card, Divider, Flex, Group, Stack, Button} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.tsx";
import EzTable from "@/ezMantine/table/EzTable.tsx";
import EzCard from "@/ezMantine/card/EzCard.tsx";
import {IconDownload} from "@tabler/icons-react";
import {DownloadController} from "./DownloadController.ts";
import moment from "moment";

// Mock data for fuel records
const fuelRecords = [
    {id: 1, date: '2025-01-15', car: 'JMC01', driver: 'Jorge', gallons: 25.5, cost: 89.25, location: 'Shell Station'},
    {id: 2, date: '2025-01-14', car: 'JMC02', driver: 'Carlos', gallons: 30.2, cost: 105.70, location: 'Texaco'},
    {id: 3, date: '2025-01-13', car: 'JMC01', driver: 'Jorge', gallons: 28.0, cost: 98.00, location: 'Shell Station'},
    {id: 4, date: '2025-01-12', car: 'JMC03', driver: 'Miguel', gallons: 22.8, cost: 79.80, location: 'Chevron'},
    {id: 5, date: '2025-01-11', car: 'JMC04', driver: 'Pedro', gallons: 35.0, cost: 122.50, location: 'BP'},
    {id: 6, date: '2025-01-10', car: 'JMC02', driver: 'Carlos', gallons: 27.5, cost: 96.25, location: 'Texaco'},
    {id: 7, date: '2025-01-09', car: 'JMC01', driver: 'Jorge', gallons: 24.0, cost: 84.00, location: 'Shell Station'},
    {id: 8, date: '2025-01-08', car: 'JMC03', driver: 'Miguel', gallons: 31.2, cost: 109.20, location: 'Chevron'},
];

// Summary by car
const carSummary = [
    {car: 'JMC01', totalGallons: 77.5, totalCost: 271.25},
    {car: 'JMC02', totalGallons: 57.7, totalCost: 201.95},
    {car: 'JMC03', totalGallons: 54.0, totalCost: 189.00},
    {car: 'JMC04', totalGallons: 35.0, totalCost: 122.50},
];

export default function Combustible() {
    const {selectedDate, filterMode} = DownloadController;

    const totalCost = fuelRecords.reduce((sum, r) => sum + r.cost, 0);
    const totalGallons = fuelRecords.reduce((sum, r) => sum + r.gallons, 0);
    const avgCostPerGallon = totalCost / totalGallons;

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
        console.log('Download Combustible report');
    }

    return (
        <Stack gap="md">
            <EzCard
                customHeader={
                    <Flex justify="space-between" align="center" flex={1}>
                        <EzText fw="bold">Combustible Report - {getDateLabel()}</EzText>
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
                            <EzText size="xl" fw="xxl">${totalCost.toFixed(2)}</EzText>
                            <EzText size="xs">Total Cost</EzText>
                        </Stack>
                        <Divider orientation="vertical"/>
                        <Stack flex={1} align="center" gap={8}>
                            <EzText size="xl" fw="xxl">{totalGallons.toFixed(1)} gal</EzText>
                            <EzText size="xs">Total Gallons</EzText>
                        </Stack>
                        <Divider orientation="vertical"/>
                        <Stack flex={1} align="center" gap={8}>
                            <EzText size="xl" fw="xxl">${avgCostPerGallon.toFixed(2)}/gal</EzText>
                            <EzText size="xs">Avg Cost per Gallon</EzText>
                        </Stack>
                    </Group>

                    {/* Fuel Records Table */}
                    <Card>
                        <EzText pb={16} fw="bold">Fuel Records</EzText>
                        <EzTable
                            head={['Date', 'Car', 'Driver', 'Gallons', 'Cost', 'Location']}
                            tdMap={[
                                {name: 'date'},
                                {name: 'car'},
                                {name: 'driver'},
                                {name: 'gallons'},
                                {name: 'cost', render: (row: any) => `$${row.cost.toFixed(2)}`},
                                {name: 'location'},
                            ]}
                            data={fuelRecords}
                            dataKey="id"
                        />
                    </Card>

                    {/* Summary by Car */}
                    <Card>
                        <EzText pb={16} fw="bold">Summary by Vehicle</EzText>
                        <EzTable
                            head={['Vehicle', 'Total Gallons', 'Total Cost']}
                            tdMap={[
                                {name: 'car'},
                                {name: 'totalGallons', render: (row: any) => `${row.totalGallons.toFixed(1)} gal`},
                                {name: 'totalCost', render: (row: any) => `$${row.totalCost.toFixed(2)}`},
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
