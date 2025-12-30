import {Card, Divider, Flex, Group, Pill, Stack, Table, Text} from "@mantine/core";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";
import {useLayoutEffect} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import EzText from "@/ezMantine/text/EzText.tsx";
import moment from "moment";
import u from "@/util";
import {DashboardModalController} from "@/view/dashboard/_modal/DashboardModalController.ts";

interface InspectionDetailsModalProps {
    inspectionId: number;
}

export default function InspectionDetailsModal({inspectionId}: InspectionDetailsModalProps) {
    const {inspectionDetailData, inspectionDetailLoading, inspectionDetailGetData} = DashboardModalController;

    useLayoutEffect(() => { inspectionDetailGetData(inspectionId) }, [inspectionId]);

    if (inspectionDetailLoading || !inspectionDetailData) return <EzLoader h='calc(100dvh - 120px)'/>;

    const vehicles = inspectionDetailData.inspection_vehicles || [];

    // Calculate totals
    let totalMiles = 0;
    let totalGasCost = 0;
    let totalGasGallons = 0;
    let grandTotal = 0;
    let totalReservations = 0;

    for (const v of vehicles) {
        const start = parseInt(v.inspection_vehicle_odometer_start) || 0;
        const end = parseInt(v.inspection_vehicle_odometer_end) || 0;
        totalMiles += Math.max(0, end - start);
        totalGasCost += (parseInt(v.inspection_vehicle_gas_cost) || 0) / 100;
        totalGasGallons += parseInt(v.inspection_vehicle_gas_gallons) || 0;

        const reservations = v.vehicle_reservations || [];
        totalReservations += reservations.length;
        for (const r of reservations) {
            grandTotal += (parseInt(r.reservation_total) || 0) / 100;
        }
    }

    const totalToCompany = grandTotal - totalGasCost;

    return (
        <Flex gap="md" p='0 0 1rem 1rem' flex={1}>
            {/* Left Column - Info & Summary */}
            <Stack gap="sm" style={{minWidth: 260}}>
                {/* Header Info */}
                <Card withBorder p="sm" shadow='none'>
                    <EzText fw="xl" size="md" pb="xs">Inspection Info</EzText>
                    <Stack gap={8}>
                        <Group justify="space-between">
                            <EzText c="dimmed" >Date:</EzText>
                            <EzText fw="xl" >{moment(inspectionDetailData.inspection_date).format('MM/DD/YYYY')}</EzText>
                        </Group>
                        <Group justify="space-between">
                            <EzText c="dimmed" >Driver:</EzText>
                            <EzText fw="xl" >{inspectionDetailData.inspection_employee?.employee_full_name || '-'}</EzText>
                        </Group>
                        <Group justify="space-between">
                            <EzText c="dimmed" >Start:</EzText>
                            <EzText fw="xl" >
                                {inspectionDetailData.inspection_start_time
                                    ? moment(inspectionDetailData.inspection_start_time, 'HH:mm:ss').format('h:mm A')
                                    : '-'}
                            </EzText>
                        </Group>
                        <Group justify="space-between">
                            <EzText c="dimmed" >End:</EzText>
                            <EzText fw="xl" >
                                {inspectionDetailData.inspection_end_time
                                    ? moment(inspectionDetailData.inspection_end_time, 'HH:mm:ss').format('h:mm A')
                                    : '-'}
                            </EzText>
                        </Group>
                        <Group justify="space-between">
                            <EzText c="dimmed" >Vehicles:</EzText>
                            <EzText fw="xl" >{vehicles.length}</EzText>
                        </Group>
                        <Group justify="space-between">
                            <EzText c="dimmed" >Reservations:</EzText>
                            <EzText fw="xl" >{totalReservations}</EzText>
                        </Group>
                    </Stack>
                </Card>

                {/* Summary Totals */}
                <Card withBorder p="sm" shadow='none'>
                    <EzText fw="xl" size="md" pb="xs">Summary</EzText>
                    <Stack gap={8}>
                        <Group justify="space-between">
                            <EzText c="dimmed" >Grand Total:</EzText>
                            <EzText fw="xl" size="1.2rem">{u.formatMoney(grandTotal)}</EzText>
                        </Group>
                        <Group justify="space-between">
                            <EzText c="dimmed" >Gas Cost:</EzText>
                            <EzText fw="xl"  c="red"size="1.2rem">-{u.formatMoney(totalGasCost)}</EzText>
                        </Group>
                        <Divider my={4}/>
                        <Group justify="space-between">
                            <EzText c="dimmed" >To Company:</EzText>
                            <EzText
                                size='xl'
                                fw='xxl'
                                c={totalToCompany >= 0 ? 'teal' : 'red'}
                            >{u.formatMoney(totalToCompany)}</EzText>
                        </Group>
                        <Divider my={4}/>
                        <Group justify="space-between">
                            <EzText c="dimmed" >Miles:</EzText>
                            <EzText fw="xl" size="1.2rem">{u.formatMoney(totalMiles, false)} mi</EzText>
                        </Group>
                        <Group justify="space-between">
                            <EzText c="dimmed" >Gas:</EzText>
                            <EzText fw="xl" size="1.2rem">{totalGasGallons} gal</EzText>
                        </Group>
                    </Stack>
                </Card>

                {/* Breaks */}
                {inspectionDetailData.inspection_breaks?.length > 0 && (
                    <Card withBorder p="sm" shadow='none'>
                        <EzText fw="xl" size="md" pb="xs">Break Log</EzText>
                        <Table striped highlightOnHover withTableBorder>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Start</Table.Th>
                                    <Table.Th>End</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {inspectionDetailData.inspection_breaks.map((b: any, i: number) => (
                                    <Table.Tr key={i}>
                                        <Table.Td>{b.start ? moment(b.start, 'HH:mm').format('h:mm A') : '-'}</Table.Td>
                                        <Table.Td>{b.end ? moment(b.end, 'HH:mm').format('h:mm A') : '-'}</Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Card>
                )}

                {/* Notes */}
                {inspectionDetailData.inspection_notes && (
                    <Card withBorder p="sm" shadow='none'>
                        <EzText fw="xl" size="md" pb="xs">Notes</EzText>
                        <Text >{inspectionDetailData.inspection_notes}</Text>
                    </Card>
                )}
            </Stack>

            {/* Right Column - Vehicles & Reservations */}
            <EzScroll h="calc(100vh - 120px)" flex={1}>
                <Stack gap="md" flex={1}>
                {vehicles.map((vehicle: any, vIndex: number) => {
                    const car = vehicle.vehicle_car;
                    const reservations = vehicle.vehicle_reservations || [];
                    const vStart = parseInt(vehicle.inspection_vehicle_odometer_start) || 0;
                    const vEnd = parseInt(vehicle.inspection_vehicle_odometer_end) || 0;
                    const vMiles = Math.max(0, vEnd - vStart);
                    const vGasCost = (parseInt(vehicle.inspection_vehicle_gas_cost) || 0) / 100;
                    const vGasGallons = parseInt(vehicle.inspection_vehicle_gas_gallons) || 0;
                    const vTotal = reservations.reduce((sum: number, r: any) =>
                        sum + ((parseInt(r.reservation_total) || 0) / 100), 0);

                    return (
                        <Card key={vIndex} withBorder shadow='none'>
                            <Stack gap="md">
                                {/* Vehicle Header */}
                                <Group justify="space-between">
                                    <Group gap="md">
                                        <Pill size="lg" bg={car?.car_color || 'gray'} c="black">
                                            {car?.car_plate || 'Unknown'}
                                        </Pill>
                                        <EzText size="lg" fw="xl">{car?.car_name || ''}</EzText>
                                    </Group>
                                    <Group gap="xl">
                                        <Stack align="center" gap={0}>
                                            <EzText  c="dimmed">Odometer</EzText>
                                            <EzText fw="xl">{u.formatMoney(vStart, false)} → {u.formatMoney(vEnd, false)}</EzText>
                                        </Stack>
                                        <Stack align="center" gap={0}>
                                            <EzText  c="dimmed">Miles</EzText>
                                            <EzText fw="xl">{vMiles} mi</EzText>
                                        </Stack>
                                        <Stack align="center" gap={0}>
                                            <EzText  c="dimmed">Gas</EzText>
                                            <EzText fw="xl">{vGasGallons} gal</EzText>
                                        </Stack>
                                        <Stack align="center" gap={0}>
                                            <EzText  c="dimmed">Gas Cost</EzText>
                                            <EzText fw="xl">{u.formatMoney(vGasCost)}</EzText>
                                        </Stack>
                                        <Stack align="center" gap={0}>
                                            <EzText  c="dimmed">Total</EzText>
                                            <EzText fw="xl" c="teal">{u.formatMoney(vTotal)}</EzText>
                                        </Stack>
                                    </Group>
                                </Group>

                                {/* Reservations Table */}
                                {reservations.length > 0 && (
                                    <>
                                        <Divider label={`Reservations (${reservations.length})`} labelPosition="left"/>
                                        <Table striped highlightOnHover withTableBorder>
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th w={80}>Order #</Table.Th>
                                                    <Table.Th w={80}>Time</Table.Th>
                                                    <Table.Th w={200}>Passenger</Table.Th>
                                                    <Table.Th w={200}>Phone</Table.Th>
                                                    <Table.Th w={200}>Email</Table.Th>
                                                    <Table.Th w={60}>Pax</Table.Th>
                                                    <Table.Th>Pickup</Table.Th>
                                                    <Table.Th>Dropoff</Table.Th>
                                                    <Table.Th w={100}>Airline</Table.Th>
                                                    <Table.Th w={100}>Flight #</Table.Th>
                                                    <Table.Th w={80} ta="right">Total</Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>
                                                {reservations.map((r: any) => (
                                                    <Table.Tr key={r.reservation_id}>
                                                        <Table.Td>{r.reservation_charter_order || '-'}</Table.Td>
                                                        <Table.Td>
                                                            {r.reservation_time
                                                                ? moment(r.reservation_time, 'HH:mm:ss').format('h:mm A')
                                                                : '-'}
                                                        </Table.Td>
                                                        <Table.Td>{r.reservation_passenger_name || '-'}</Table.Td>
                                                        <Table.Td>{r.reservation_phone || '-'}</Table.Td>
                                                        <Table.Td>{r.reservation_email || '-'}</Table.Td>
                                                        <Table.Td>{r.reservation_passengers || '-'}</Table.Td>
                                                        <Table.Td>{r.reservation_pickup_location || '-'}</Table.Td>
                                                        <Table.Td>{r.reservation_dropoff_location || '-'}</Table.Td>
                                                        <Table.Td>{r.reservation_airline || '-'}</Table.Td>
                                                        <Table.Td>{r.reservation_fly_info || '-'}</Table.Td>
                                                        <Table.Td ta="right" fw="xl">
                                                            {u.formatMoney((parseInt(r.reservation_total) || 0) / 100)}
                                                        </Table.Td>
                                                    </Table.Tr>
                                                ))}
                                            </Table.Tbody>
                                        </Table>
                                    </>
                                )}

                                {reservations.length === 0 && (
                                    <EzText c="dimmed" ta="center">No reservations for this vehicle</EzText>
                                )}
                            </Stack>
                        </Card>
                    );
                })}

                {vehicles.length === 0 && (
                    <Card withBorder shadow='none'>
                        <EzText c="dimmed" ta="center" py="xl">No vehicles recorded for this inspection</EzText>
                    </Card>
                )}
            </Stack>
            </EzScroll>
        </Flex>
    );
}
