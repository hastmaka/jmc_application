import EzCard from "@/ezMantine/card/EzCard.tsx";
import {ActionIcon, Card, Divider, Flex, Group, Select, Stack, Tooltip} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.tsx";
import {lazy, type ReactNode, Suspense} from "react";
import {IconCalendar, IconEdit} from "@tabler/icons-react";
import {DatePickerInput} from "@mantine/dates";
import EzTable from "@/ezMantine/table/EzTable.tsx";
import {DashboardController} from "@/view/dashboard/DashboardController.ts";
import {DashboardModalController} from "@/view/dashboard/_modal/DashboardModalController.ts";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";

const DriverReportModal = lazy(() => import('./_modal/DriverReportModal.tsx'));

export default function Driver() {
    const {
        handleDateRangeChange,
        handleEmployeeChange,
        employeeLoading,
        inspectionLoading,
        getAggregates,
        getEmployeeOptions,
        getBreakLogData,
        getMileageData,
        getGasLogData,
        getInspectionTableData
    } = DashboardController;

    const {setCurrentInspectionId, clearModalState} = DashboardModalController;

    function handleOpenInspectionModal(inspectionId?: number) {
        setCurrentInspectionId(inspectionId);
        const modalId = 'driver-report-modal';
        window.openModal({
            modalId,
            title: inspectionId ? "Edit Driver Report" : "Create Driver Report",
            fullScreen: true,
            children: (
                <Suspense fallback={<EzLoader h={400}/>}>
                    <DriverReportModal modalId={modalId} inspectionId={inspectionId}/>
                </Suspense>
            ),
            onClose: clearModalState
        });
    }

    const aggregates = getAggregates();

    function customHeader(): ReactNode {
        return (
            <Flex justify='space-between' align='center' flex={1}>
                <EzText>Driver Resume</EzText>
                <Flex gap={16}>
                    <Select
                        placeholder='Driver'
                        data={getEmployeeOptions()}
                        onChange={handleEmployeeChange}
                        clearable
                        searchable
                        disabled={employeeLoading}
                    />
                    <DatePickerInput
                        w={340}
                        type='range'
                        clearable
                        rightSection={<IconCalendar size={18} stroke={1.5}/>}
                        rightSectionPointerEvents="none"
                        placeholder="Date Range Filter"
                        allowSingleDateInRange
                        value={DashboardController?.rangeDateValue as any || [null, null]}
                        onChange={handleDateRangeChange}
                    />
                </Flex>
            </Flex>
        );
    }

    if (inspectionLoading && DashboardController.rangeDateValue[0]) {
        return <EzLoader h={400} />;
    }

    return (
        <EzCard customHeader={customHeader()}>
            <Stack>
                <Group justify='space-between'>
                    <Stack flex={1} align='center' gap={8}>
                        <EzText size='xl' fw='xxl'>${aggregates.totalGrandTotal.toFixed(2)}</EzText>
                        <EzText size='xs'>Grand Total</EzText>
                    </Stack>
                    <Divider orientation='vertical'/>
                    <Stack flex={1} align='center' gap={8}>
                        <EzText size='xl' fw='xxl' c='teal'>${aggregates.totalToCompany.toFixed(2)}</EzText>
                        <EzText size='xs'>Total to Company</EzText>
                    </Stack>
                    <Divider orientation='vertical'/>
                    <Stack flex={1} align='center' gap={8}>
                        <EzText size='xl' fw='xxl'>{aggregates.totalMiles} mi</EzText>
                        <EzText size='xs'>Total Miles</EzText>
                    </Stack>
                    <Divider orientation='vertical'/>
                    <Stack flex={1} align='center' gap={8}>
                        <EzText size='xl' fw='xxl'>{aggregates.tripCount} Trips</EzText>
                        <EzText size='xs'>Total Trips</EzText>
                    </Stack>
                </Group>

                <Card>
                    <EzText pb={16}>Inspections</EzText>
                    <EzTable
                        head={['Date', 'Driver', 'Car', 'Start', 'End', 'Miles', 'Gas Cost', 'Total', '']}
                        tdMap={[
                            {name: 'inspection_date'},
                            {name: 'employee_name'},
                            {name: 'car_name'},
                            {name: 'inspection_start_time'},
                            {name: 'inspection_end_time'},
                            {name: 'inspection_total_miles'},
                            {name: 'inspection_gas_cost', render: (v: any) => `$${(parseFloat(v) || 0).toFixed(2)}`},
                            {name: 'inspection_grand_total', render: (v: any) => `$${(parseFloat(v) || 0).toFixed(2)}`},
                            {name: 'actions', render: (_: any, row: any) => (
                                <Tooltip label="Edit">
                                    <ActionIcon
                                        variant="subtle"
                                        size="sm"
                                        onClick={() => handleOpenInspectionModal(row.id)}
                                    >
                                        <IconEdit size={14}/>
                                    </ActionIcon>
                                </Tooltip>
                            )},
                        ]}
                        data={getInspectionTableData()}
                        dataKey='id'
                    />
                </Card>

                <Flex gap={16}>
                    <Card flex={1}>
                        <Stack>
                            <EzText pb={16}>Break Log</EzText>
                            <EzTable
                                head={['Start', 'End', 'Initial']}
                                tdMap={[
                                    {name: 'start'},
                                    {name: 'end'},
                                    {name: 'initial'},
                                ]}
                                data={getBreakLogData()}
                                dataKey='id'
                            />
                        </Stack>
                    </Card>
                    <Card flex={1}>
                        <Stack>
                            <EzText pb={16}>Actual Mileage</EzText>
                            <EzTable
                                head={['Start', 'End', 'Total']}
                                tdMap={[
                                    {name: 'start'},
                                    {name: 'end'},
                                    {name: 'total'},
                                ]}
                                data={getMileageData()}
                                dataKey='id'
                            />
                        </Stack>
                    </Card>
                    <Card flex={1}>
                        <Stack>
                            <EzText pb={16}>Gas Log</EzText>
                            <EzTable
                                head={['Gals', 'Cost']}
                                tdMap={[
                                    {name: 'gallons'},
                                    {name: 'cost'},
                                ]}
                                data={getGasLogData()}
                                dataKey='id'
                            />
                        </Stack>
                    </Card>
                </Flex>

                <Card>
                    <Flex justify='flex-end'>
                        <EzText bold='Grand Total: '>${aggregates.totalGrandTotal.toFixed(2)}</EzText>
                    </Flex>
                </Card>
            </Stack>
        </EzCard>
    );
}