import {useEffect, useState} from "react";
import {Card, Group, SimpleGrid, Stack, Text, Badge, Progress, Table} from "@mantine/core";
import EzButton from "@/ezMantine/button/EzButton.tsx";
import EzTable from "@/ezMantine/table/EzTable.tsx";
import {MonthPickerInput} from "@mantine/dates";
import {AreaChart} from "@mantine/charts";
import {IconCalendar, IconFileTypePdf} from "@tabler/icons-react";
import {DashboardController} from "@/view/dashboard/DashboardController.ts";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import EzText from "@/ezMantine/text/EzText.tsx";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";
import {pdfGenerator} from "@/components/pdfUtilities/PdfGenerator.tsx";
import MonthlySummaryPdf from "@/view/dashboard/_pdf/MonthlySummaryPdf.tsx";
import {extractMonthlySummaryData} from "@/view/dashboard/_pdf/extractMonthlySummaryData.ts";
import u from "@/util";
import dayjs from "dayjs";

interface StatusCardProps {
    title: string;
    count: number;
    total?: number;
    color: string;
    percentage?: number;
}

function StatusCard({title, count, total, color, percentage}: StatusCardProps) {
    return (
        <Card withBorder shadow="none" p="lg">
            <Stack gap={4}>
                <Group justify="space-between">
                    <Text size="sm" c="dimmed" tt="uppercase" fw={500}>{title}</Text>
                    <Badge color={color} variant="light" size="sm">
                        {percentage !== undefined ? `${percentage.toFixed(1)}%` : ''}
                    </Badge>
                </Group>
                <Text size="2rem" fw={700}>{count}</Text>
                {total !== undefined && total > 0 && (
                    <Text size="md" c={color} fw={600}>{u.formatMoney(total)}</Text>
                )}
                {percentage !== undefined && (
                    <Progress value={percentage} color={color} size="sm" mt={4}/>
                )}
            </Stack>
        </Card>
    );
}

export default function MonthlySummaryModal() {
    const {
        summaryGetData,
        summaryData,
        summaryLoading,
    } = DashboardController;

    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
    const [pdfLoading, setPdfLoading] = useState(false);

    useEffect(() => {
        const month = dayjs(selectedMonth).format('YYYY-MM');
        summaryGetData(month);
    }, []);

    function handleMonthChange(value: Date | null) {
        if (value) {
            setSelectedMonth(value);
            const month = dayjs(value).format('YYYY-MM');
            summaryGetData(month);
        }
    }

    async function handlePdfExport() {
        setPdfLoading(true);
        const month = dayjs(selectedMonth).format('YYYY-MM');
        try {
            await window.toast.U({
                id: {
                    title: "Generating PDF",
                    message: "Please wait...",
                },
                update: {
                    success: 'PDF generated successfully.',
                    error: 'PDF generation failed.',
                },
                cb: () => pdfGenerator(
                    `v1/reservation/summary?month=${month}&excludeToday=true`,
                    MonthlySummaryPdf,
                    extractMonthlySummaryData
                )
            });
        } finally {
            setPdfLoading(false);
        }
    }

    const data = summaryData;
    const byStatus = data?.byStatus || {
        pending: {count: 0, total: 0},
        confirmed: {count: 0, total: 0},
        completed: {count: 0, total: 0},
        cancelled: {count: 0, total: 0}
    };

    const allCars = data?.topCars || [];
    const dailyBreakdown = data?.dailyBreakdown || [];
    const dailyRevenueBreakdownRaw = data?.dailyRevenueBreakdown || [];
    const totalReservations = data?.totalReservations || 0;
    const ownerTotal = data?.ownerTotal || 0;

    // Filter Revenue Breakdown to only show up to yesterday (for Modal display)
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    const dailyRevenueBreakdown = dailyRevenueBreakdownRaw.filter((day: any) => day.date <= yesterday);

    // Recalculate breakdown totals based on filtered data
    const breakdown = dailyRevenueBreakdown.reduce((acc: any, day: any) => ({
        base: acc.base + day.base,
        fuel: acc.fuel + day.fuel,
        mAndG: acc.mAndG + day.mAndG,
        airportFee: acc.airportFee + day.airportFee,
        tax: acc.tax + day.tax,
        tips: acc.tips + day.tips,
        total: acc.total + day.total
    }), {base: 0, fuel: 0, mAndG: 0, airportFee: 0, tax: 0, tips: 0, total: 0});

    const getPercentage = (count: number) => totalReservations > 0 ? (count / totalReservations) * 100 : 0;

    const chartData = dailyBreakdown.map((d: any) => ({
        date: dayjs(d.date).format('MMM D'),
        reservations: d.count,
        earnings: d.total
    }));

    // Calculate vehicle totals
    const vehicleTotals = allCars.reduce((acc: any, car: any) => ({
        count: acc.count + car.count,
        total: acc.total + car.total
    }), {count: 0, total: 0});

    return (
        <EzScroll h="calc(100vh - 80px)" flex={1}>
            <Stack gap="lg" p="md">
                {/* Header with Month Picker */}
                <Group justify="space-between" align="center">
                    <EzText size="xl" fw={700}>
                        {dayjs(selectedMonth).format('MMMM YYYY')}
                    </EzText>
                    <Group gap="sm">
                        <EzButton
                            size='md'
                            loading={pdfLoading}
                            leftSection={<IconFileTypePdf size={18}/>}
                            onClick={handlePdfExport}
                            disabled={summaryLoading || !summaryData || pdfLoading}
                        >
                            Export PDF
                        </EzButton>
                        <MonthPickerInput
                            disabled={summaryLoading}
                            value={selectedMonth}
                            onChange={handleMonthChange as any}
                            placeholder="Select month"
                            w={200}
                            rightSection={<IconCalendar size={18}/>}
                            rightSectionPointerEvents="none"
                            size="md"
                        />
                    </Group>
                </Group>

                {summaryLoading ? (
                    <EzLoader h='calc(100vh - 280px)'/>
                ) : (
                    <>
                        {/* Status Cards Row */}
                        <SimpleGrid cols={{base: 2, sm: 3, md: 5}} spacing="md">
                            <Card withBorder shadow="none" p="lg">
                                <Stack gap={4} align="center">
                                    <Text size="sm" c="dimmed" tt="uppercase" fw={500}>Total</Text>
                                    <Text size="2.5rem" fw={700}>{totalReservations}</Text>
                                    <Text size="sm" c="dimmed">reservations</Text>
                                </Stack>
                            </Card>
                            <StatusCard
                                title="Completed"
                                count={byStatus.completed.count}
                                total={byStatus.completed.total}
                                color="teal"
                                percentage={getPercentage(byStatus.completed.count)}
                            />
                            <StatusCard
                                title="Confirmed"
                                count={byStatus.confirmed.count}
                                total={byStatus.confirmed.total}
                                color="blue"
                                percentage={getPercentage(byStatus.confirmed.count)}
                            />
                            <StatusCard
                                title="Pending"
                                count={byStatus.pending.count}
                                total={byStatus.pending.total}
                                color="yellow"
                                percentage={getPercentage(byStatus.pending.count)}
                            />
                            <StatusCard
                                title="Cancelled"
                                count={byStatus.cancelled.count}
                                total={0}
                                color="red"
                                percentage={getPercentage(byStatus.cancelled.count)}
                            />
                        </SimpleGrid>

                        {/* Car Breakdown */}
                        {allCars.length > 0 && (
                            <Card withBorder shadow="none" p="lg">
                                <EzText fw={600} size="lg" mb="md">Car Breakdown</EzText>
                                <Table withColumnBorders horizontalSpacing="md" verticalSpacing="sm" withTableBorder>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th></Table.Th>
                                            {allCars.map((car: any) => (
                                                <Table.Th key={car.car_id} ta="center">
                                                    {car.car_name?.match(/\(([^)]+)\)/)?.[1] || car.car_name}
                                                </Table.Th>
                                            ))}
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        <Table.Tr>
                                            <Table.Td fw={500}>Car Total (Confirmed)</Table.Td>
                                            {allCars.map((car: any) => (
                                                <Table.Td key={car.car_id} ta="center">
                                                    {u.formatMoney(car.total)}
                                                </Table.Td>
                                            ))}
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td fw={700}>Grand Total (Confirmed)</Table.Td>
                                            <Table.Td ta="center" fw={700} fz="lg">
                                                {u.formatMoney(vehicleTotals.total)}
                                            </Table.Td>
                                            {allCars.slice(1).map((car: any) => (
                                                <Table.Td key={car.car_id}></Table.Td>
                                            ))}
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td fw={500}>Owner Share</Table.Td>
                                            {allCars.map((car: any) => (
                                                <Table.Td key={car.car_id} ta="center" c="teal">
                                                    {u.formatMoney(car.ownerShare)}
                                                </Table.Td>
                                            ))}
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td fw={700}>Owner Total</Table.Td>
                                            <Table.Td ta="center" fw={700} fz="xl" c="teal">
                                                {u.formatMoney(ownerTotal)}
                                            </Table.Td>
                                            {allCars.slice(1).map((car: any) => (
                                                <Table.Td key={car.car_id}></Table.Td>
                                            ))}
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td fw={700}></Table.Td>
                                            <Table.Td ta="center" fw={700} fz="xl" c="teal">
                                                {u.formatMoney(((ownerTotal / 30000) * 100).toFixed(2), false, false)}
                                            </Table.Td>
                                        </Table.Tr>
                                    </Table.Tbody>
                                </Table>
                            </Card>
                        )}

                        {/* Revenue Breakdown */}
                        {dailyRevenueBreakdown.length > 0 && (
                            <Card withBorder shadow="none" p="lg">
                                <EzText fw={600} size="lg" mb="md">Revenue Breakdown</EzText>
                                <EzTable
                                    height={dailyRevenueBreakdown.length *30}
                                    scrollbars={dailyRevenueBreakdown.length > 10 ? 'y' : false}
                                    dataKey="date"
                                    data={[
                                        ...dailyRevenueBreakdown.map((day: any) => ({
                                            ...day,
                                            _isTotal: false
                                        })),
                                        {
                                            date: 'TOTAL',
                                            base: breakdown.base,
                                            fuel: breakdown.fuel,
                                            mAndG: breakdown.mAndG,
                                            airportFee: breakdown.airportFee,
                                            tax: breakdown.tax,
                                            tips: breakdown.tips,
                                            total: breakdown.total,
                                            _isTotal: true
                                        }
                                    ]}
                                    head={['Date', 'Base Fare', 'Fuel', 'M&G', 'Airport', 'Tax', 'Tips', 'Total']}
                                    tdMap={[
                                        {
                                            name: 'date',
                                            render: (row: any) => (
                                                <Text fw={row._isTotal ? 700 : 400}>
                                                    {row._isTotal ? row.date : dayjs(row.date).format('MMM D')}
                                                </Text>
                                            )
                                        },
                                        {
                                            name: 'base',
                                            render: (row: any) => (
                                                <Text  fw={row._isTotal ? 600 : 400}>{u.formatMoney(row.base)}</Text>
                                            )
                                        },
                                        {
                                            name: 'fuel',
                                            render: (row: any) => (
                                                <Text  fw={row._isTotal ? 600 : 400}>{u.formatMoney(row.fuel)}</Text>
                                            )
                                        },
                                        {
                                            name: 'mAndG',
                                            render: (row: any) => (
                                                <Text  fw={row._isTotal ? 600 : 400}>{u.formatMoney(row.mAndG)}</Text>
                                            )
                                        },
                                        {
                                            name: 'airportFee',
                                            render: (row: any) => (
                                                <Text  fw={row._isTotal ? 600 : 400}>{u.formatMoney(row.airportFee)}</Text>
                                            )
                                        },
                                        {
                                            name: 'tax',
                                            render: (row: any) => (
                                                <Text  fw={row._isTotal ? 600 : 400}>{u.formatMoney(row.tax)}</Text>
                                            )
                                        },
                                        {
                                            name: 'tips',
                                            render: (row: any) => (
                                                <Text  fw={row._isTotal ? 600 : 400}>{u.formatMoney(row.tips)}</Text>
                                            )
                                        },
                                        {
                                            name: 'total',
                                            render: (row: any) => (
                                                <Text fw={700} c={row._isTotal ? 'teal' : undefined}>
                                                    {u.formatMoney(row.total)}
                                                </Text>
                                            )
                                        }
                                    ]}
                                />
                            </Card>
                        )}

                        {/* All Vehicles Table */}
                        {/*<Card withBorder shadow="none" p="lg">*/}
                        {/*    <Group justify="space-between" mb="md">*/}
                        {/*        <EzText fw={600} size="lg">All Vehicles</EzText>*/}
                        {/*        <Badge size="lg" variant="light" color="gray">*/}
                        {/*            {allCars.length} vehicles*/}
                        {/*        </Badge>*/}
                        {/*    </Group>*/}

                        {/*    <EzTable*/}
                        {/*        height={allCars.length > 8 ? 400 : 'auto'}*/}
                        {/*        scrollbars={allCars.length > 8 ? 'y' : false}*/}
                        {/*        dataKey="car_id"*/}
                        {/*        data={[*/}
                        {/*            ...allCars.map((car: any, index: number) => ({*/}
                        {/*                ...car,*/}
                        {/*                _index: index + 1,*/}
                        {/*                _isTotal: false*/}
                        {/*            })),*/}
                        {/*            {*/}
                        {/*                car_id: 'total',*/}
                        {/*                car_name: 'TOTAL',*/}
                        {/*                count: vehicleTotals.count,*/}
                        {/*                total: vehicleTotals.total,*/}
                        {/*                _isTotal: true*/}
                        {/*            }*/}
                        {/*        ]}*/}
                        {/*        head={['#', 'Vehicle', 'Trips', '% of Total', 'Revenue', 'Avg / Trip']}*/}
                        {/*        tdMap={[*/}
                        {/*            {*/}
                        {/*                name: '_index',*/}
                        {/*                render: (row: any) => row._isTotal ? null : (*/}
                        {/*                    <Flex justify='center'>*/}
                        {/*                        <Badge circle size="lg"*/}
                        {/*                               style={{backgroundColor: row.car_color, color: '#fff'}}>*/}
                        {/*                            {row._index}*/}
                        {/*                        </Badge>*/}
                        {/*                    </Flex>*/}
                        {/*                )*/}
                        {/*            },*/}
                        {/*            {*/}
                        {/*                name: 'car_name',*/}
                        {/*                render: (row: any) => (*/}
                        {/*                    <Text fw={row._isTotal ? 700 : 500}>{row.car_name}</Text>*/}
                        {/*                )*/}
                        {/*            },*/}
                        {/*            {*/}
                        {/*                name: 'count',*/}
                        {/*                render: (row: any) => (*/}
                        {/*                    <Badge variant={row._isTotal ? 'filled' : 'light'} color="blue" size="lg">*/}
                        {/*                        {row.count}*/}
                        {/*                    </Badge>*/}
                        {/*                )*/}
                        {/*            },*/}
                        {/*            {*/}
                        {/*                name: 'percentage',*/}
                        {/*                render: (row: any) => {*/}
                        {/*                    if (row._isTotal) return <Text fw={600}>100%</Text>;*/}
                        {/*                    const pct = vehicleTotals.count > 0 ? (row.count / vehicleTotals.count) * 100 : 0;*/}
                        {/*                    return (*/}
                        {/*                        <Group gap={4} justify="center">*/}
                        {/*                            <Progress value={pct} size="sm" w={60} color="blue"/>*/}
                        {/*                            <Text size="xs" c="dimmed" w={40}>{pct.toFixed(1)}%</Text>*/}
                        {/*                        </Group>*/}
                        {/*                    );*/}
                        {/*                }*/}
                        {/*            },*/}
                        {/*            {*/}
                        {/*                name: 'total',*/}
                        {/*                render: (row: any) => (*/}
                        {/*                    <Text fw={row._isTotal ? 700 : 600} c="teal"*/}
                        {/*                          size={row._isTotal ? 'lg' : 'sm'}>*/}
                        {/*                        {u.formatMoney(row.total)}*/}
                        {/*                    </Text>*/}
                        {/*                )*/}
                        {/*            },*/}
                        {/*            {*/}
                        {/*                name: 'avg',*/}
                        {/*                render: (row: any) => (*/}
                        {/*                    <Text size="sm" c="dimmed">*/}
                        {/*                        {u.formatMoney(row.count > 0 ? row.total / row.count : 0)}*/}
                        {/*                    </Text>*/}
                        {/*                )*/}
                        {/*            }*/}
                        {/*        ]}*/}
                        {/*    />*/}
                        {/*</Card>*/}

                        {/* Daily Chart - Full Width */}
                        <Card withBorder shadow="none" p="lg">
                            <EzText fw={600} size="lg" mb="md">Daily Reservation Breakdown</EzText>
                            {chartData.length > 0 ? (
                                <AreaChart
                                    h={280}
                                    data={chartData}
                                    dataKey="date"
                                    series={[
                                        {name: 'reservations', color: 'blue.6', label: 'Reservations'},
                                    ]}
                                    curveType="monotone"
                                    withLegend
                                    withTooltip
                                    legendProps={{verticalAlign: 'bottom'}}
                                    gridAxis="xy"
                                />
                            ) : (
                                <Text size="sm" c="dimmed" ta="center" py="xl">No daily data available</Text>
                            )}
                        </Card>
                    </>
                )}
            </Stack>
        </EzScroll>
    );
}
