import EzCard from "@/ezMantine/card/EzCard.tsx";
import {ActionIcon, Card, Divider, Flex, Group, Stack, Tooltip} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.tsx";
import {type ReactNode} from "react";
import {DashboardController} from "@/view/dashboard/DashboardController.ts";
import FormGenerator from "@/components/form/FormGenerator.tsx";
import DriverTable from './DriverTable.tsx'
import DatePickerInputWithMonth from "@/components/DatePickerInputWithMonth.tsx";
import {IconFilterOff} from "@tabler/icons-react";

export default function Driver() {
    const {
        inspectionGetData,
        getAggregates,
        formData,
        handleInput,
        errors
    } = DashboardController;

    const aggregates = getAggregates();

    const FIELDS = [
        {
            name: 'employee_id',
            placeholder: 'Driver',
            type: 'select',
            fieldProps: {
                url: 'v1/employee/asset',
                iterator: {label: 'employee_full_name', value: 'employee_id'},
            },
            inputProps: {
                w: 300
            }
        },
        {
            name: 'date_range',
            type: 'component',
            component: (
                <DatePickerInputWithMonth
                    value={formData?.driver?.date_range}
                    handleInput={(type: string, name: string, value: any) => {
                        handleInput(type, name, value);
                        inspectionGetData();
                    }}
                    type="driver"
                />
            )
        }
    ]

    function clearFilter() {
        handleInput('driver', 'employee_id', null);
        handleInput('driver', 'date_range', [null, null]);
        inspectionGetData();
    }

    function customHeader(): ReactNode {
        return (
            <Flex justify='space-between' align='center' flex={1}>
                <EzText>Driver Resume</EzText>
                <Group gap="xs">
                    <FormGenerator
                        field={FIELDS}
                        structure={[2]}
                        handleInput={(name, value) => {
                            handleInput('driver', name, value);
                            inspectionGetData();
                        }}
                        formData={formData?.driver}
                        errors={errors?.driver}
                    />
                    <Tooltip label="Clear Filter">
                        <ActionIcon onClick={clearFilter}>
                            <IconFilterOff size={18}/>
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Flex>
        );
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
                    <DriverTable/>
                </Card>

                <Card>
                    <Flex justify='flex-end'>
                        <EzText bold='Grand Total: '>${aggregates.totalGrandTotal.toFixed(2)}</EzText>
                    </Flex>
                </Card>
            </Stack>
        </EzCard>
    );
}