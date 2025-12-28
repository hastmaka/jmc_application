import {Card, Checkbox, Flex, Group, Stack} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.tsx";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import EzGroupBtn from "@/ezMantine/buttonGroup/EzGroupBtn.tsx";
import EzTable from "@/ezMantine/table/EzTable.tsx";
import {DashboardModalController} from "@/view/dashboard/_modal/DashboardModalController.ts";
import {IconCheck, IconX} from "@tabler/icons-react";
import u from "@/util";
import moment from "moment";

export default function ReservationsSection() {
    const {
        toggleVehicleReservation,
        selectAllReservations,
        deselectAllReservations,
        getCombinedReservations,
        getReservationTotals,
    } = DashboardModalController;

    const {combined, isLoading, hasCarAndDate} = getCombinedReservations();
    const {totalSelected, grandTotal, totalReservations} = getReservationTotals();

    const head = ['', 'Vehicle', 'Charter #', 'Time', 'Passenger', 'Pickup', 'Dropoff', 'Total'];
    const tdMap = [
        {
            w: 50,
            render: (row: any) => (
                <Flex justify='center'>
                    <Checkbox
                        checked={row._isSelected}
                        onChange={() => toggleVehicleReservation(row._vehicleIndex, row.reservation_id)}
                        onClick={(e) => e.stopPropagation()}
                    />
                </Flex>
            )
        },
        {
            w: 80,
            render: (row: any) => `#${row._vehicleNumber}`
        },
        'reservation_charter_order',
        {
            name: 'reservation_time',
            render: (row: any) => moment(row.reservation_time, "HH:mm:ss").format("h:mm A")
        },
        'reservation_passenger_name',
        'reservation_pickup_location',
        'reservation_dropoff_location',
        {
            name: 'reservation_total',
            w: 120,
            render: (row: any) => u.formatMoney(row.reservation_total)
        }
    ];

    return (
        <Card withBorder shadow="none">
            <Stack gap={8}>
                <Group justify="space-between" mih={40}>
                    <EzText fw="bold">
                        Trips ({hasCarAndDate ? totalSelected : 0}/{hasCarAndDate ? totalReservations : 0} selected)
                    </EzText>
                    {totalReservations > 0 && (
                        <EzGroupBtn
                            size="xs"
                            ITEMS={[
                                {icon: IconCheck, label: 'Select All', onClick: selectAllReservations},
                                {icon: IconX, label: 'Deselect All', onClick: deselectAllReservations},
                            ]}
                        />
                    )}
                </Group>

                {isLoading ? (
                    <EzLoader h={60} size={24}/>
                ) : !hasCarAndDate ? (
                    <EzText size="sm" c="dimmed">
                        Select a vehicle and date to load trips
                    </EzText>
                ) : totalReservations === 0 ? (
                    <EzText size="sm" c="dimmed">
                        No trips found for the selected vehicles on this date
                    </EzText>
                ) : (
                    <>
                        <EzTable
                            scrollbars={false}
                            dataKey="reservation_id"
                            data={combined}
                            head={head}
                            tdMap={tdMap}
                            rowClick={(row: any) => toggleVehicleReservation(row._vehicleIndex, row.reservation_id)}
                        />
                        <Group
                            justify="flex-end"
                            gap={8}
                            style={{borderTop: '1px solid var(--mantine-color-default-border)'}}
                            pt={16}
                        >
                            <EzText fw="bold" size='xl'>
                                Grand Total ({totalSelected} trips):
                            </EzText>
                            <EzText fw="bold" size='xl'>
                                {u.formatMoney(grandTotal)}
                            </EzText>
                        </Group>
                    </>
                )}
            </Stack>
        </Card>
    );
}
