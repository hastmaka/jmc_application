import EzCard from "@/ezMantine/card/EzCard.tsx";
import {Card, Divider, Flex, Group, Stack} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.tsx";
import {type ReactNode, useMemo} from "react";
import {DashboardController} from "@/view/dashboard/DashboardController.ts";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import FormGenerator from "@/components/form/FormGenerator.tsx";
import DriverTable from './DriverTable.tsx'
import DatePickerInputWithMonth from "@/components/DatePickerInputWithMonth.tsx";

export default function Driver() {
    const {
        handleEmployeeChange,
        inspectionLoading,
        getAggregates,
        formData,
        handleInput,
        errors
    } = DashboardController;

    const aggregates = getAggregates();

    const FIELDS =
        useMemo(() => [
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
                    <DatePickerInputWithMonth formData={formData} handleInput={handleInput}/>
                )
            }
        ], [])

    function customHeader(): ReactNode {
        return (
            <Flex justify='space-between' align='center' flex={1}>
                <EzText>Driver Resume</EzText>
                <div style={{width: 'fit-content'}}>
                    <FormGenerator
                        field={FIELDS}
                        structure={[2]}
                        handleInput={(name, value) => {
                            if (name === 'employee_id') handleEmployeeChange(value);
                            handleInput('custom_header_driver', name, value)
                        }}
                        formData={formData?.['custom_header_driver']}
                        errors={errors?.['custom_header_driver']}
                    />
                </div>
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