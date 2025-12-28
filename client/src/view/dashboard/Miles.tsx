import EzCard from "@/ezMantine/card/EzCard.tsx";
import {Card, Divider, Flex, Group, Stack} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.tsx";
import {type ReactNode, useMemo,} from "react";
import {IconChevronUp} from "@tabler/icons-react";
import { AreaChart } from '@mantine/charts';
import {DashboardController} from "@/view/dashboard/DashboardController.ts";
import FormGenerator from "@/components/form/FormGenerator.tsx";
import DatePickerInputWithMonth from "@/components/DatePickerInputWithMonth.tsx";

const data = [
    {
        date: 'Mar 22',
        Apples: 110,
    },
    {
        date: 'Mar 23',
        Apples: 60,
    },
    {
        date: 'Mar 24',
        Apples: 80,
    },
    {
        date: 'Mar 25',
        Apples: null,
    },
    {
        date: 'Mar 26',
        Apples: null,
    },
    {
        date: 'Mar 27',
        Apples: 40,
    },
    {
        date: 'Mar 28',
        Apples: 120,
    },
    {
        date: 'Mar 29',
        Apples: 80,
    },
];

export default function Miles() {
    const {
        handleEmployeeChange,
        formData,
        handleInput,
        errors
    } = DashboardController;

    const FIELDS =
        useMemo(() => [
            {
                name: 'employee_id',
                placeholder: 'Car',
                type: 'select',
                fieldProps: {
                    url: 'v1/car/asset',
                    iterator: {label: 'car_name', value: 'car_id'},
                },
                inputProps: {
                    w: 260
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
            <Flex justify='space-between' flex={1} align='center'>
                <EzText>Miles</EzText>
                <div style={{width: 'fit-content'}}>
                    <FormGenerator
                        field={FIELDS}
                        structure={[2]}
                        handleInput={(name, value) => {
                            if (name === 'employee_id') handleEmployeeChange(value);
                            handleInput('custom_header_miles', name, value)
                        }}
                        formData={formData?.['custom_header_miles']}
                        errors={errors?.['custom_header_miles']}
                    />
                </div>
            </Flex>
        )
    }

    return (
        <EzCard customHeader={customHeader()} container={{flex: 1}}>
            <Stack>
                <Group justify='space-between'>
                    <Stack flex={1} align='center' gap={8}>
                        <EzText size='xl' fw='xxl'>3.305 mi</EzText>
                        <EzText size='xs'>Total Miles</EzText>
                    </Stack>
                    <Divider orientation='vertical'/>
                    <Stack flex={1} align='center' gap={8}>
                        <EzText size='xl' fw='xxl'>114 mi/day</EzText>
                        <EzText size='xs'>Avg Daily Miles</EzText>
                    </Stack>
                    <Divider orientation='vertical'/>
                    <Stack flex={1} align='center' gap={8}>
                        <EzText size='xl' fw='xxl' c='teal'>+6.2%</EzText>
                        <EzText size='xs'>Vs Last Period</EzText>
                    </Stack>
                </Group>

                <Card>
                    <Stack>
                        <Group justify='space-between'>
                            <EzText>Daily Miles</EzText>
                            <Group gap={0}>
                                <IconChevronUp color='teal' size={14}/>
                                <EzText c='teal'>+6%</EzText>
                            </Group>
                        </Group>
                        <AreaChart
                            h={240}
                            w='100%'
                            data={data}
                            dataKey="date"
                            series={[{ name: 'Apples', color: 'indigo.6' }]}
                            curveType="linear"
                            connectNulls
                        />
                    </Stack>
                </Card>
            </Stack>
        </EzCard>
    );
}