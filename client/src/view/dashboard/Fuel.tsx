import EzCard from "@/ezMantine/card/EzCard.tsx";
import {ActionIcon, Card, Divider, Flex, Group, Stack, Tooltip} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.tsx";
import {type ReactNode} from "react";
import {IconChevronUp, IconFilterOff} from "@tabler/icons-react";
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

export default function Fuel() {
    const {
        formData,
        handleInput,
        errors
    } = DashboardController;

    const FIELDS = [
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
                <DatePickerInputWithMonth
                    value={formData?.fuel?.date_range}
                    handleInput={handleInput}
                    type="fuel"
                />
            )
        }
    ]

    function clearFilter() {
        handleInput('fuel', 'employee_id', null);
        handleInput('fuel', 'date_range', [null, null]);
    }

    function customHeader(): ReactNode {
        return (
            <Flex justify='space-between' flex={1} align='center'>
                <EzText>Fuel</EzText>
                <Group gap="xs">
                    <FormGenerator
                        field={FIELDS}
                        structure={[2]}
                        handleInput={(name, value) => {
                            handleInput('fuel', name, value)
                        }}
                        formData={formData?.fuel}
                        errors={errors?.fuel}
                    />
                    <Tooltip label="Clear Filter">
                        <ActionIcon onClick={clearFilter}>
                            <IconFilterOff size={18}/>
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Flex>
        )
    }

    return (
        <EzCard customHeader={customHeader()} container={{flex: 1}}>
            <Stack>
                <Group justify='space-between'>
                    <Stack flex={1} align='center' gap={8}>
                        <EzText size='xl' fw='xxl'>$2.305</EzText>
                        <EzText size='xs'>Total Cost</EzText>
                    </Stack>
                    <Divider orientation='vertical'/>
                    <Stack flex={1} align='center' gap={8}>
                        <EzText size='xl' fw='xxl'>845 gal</EzText>
                        <EzText size='xs'>Total Gallons</EzText>
                    </Stack>
                    <Divider orientation='vertical'/>
                    <Stack flex={1} align='center' gap={8}>
                        <EzText size='xl' fw='xxl'>$0.58 /mi</EzText>
                        <EzText size='xs'>Cost Per Mile</EzText>
                    </Stack>
                </Group>

                <Card>
                    <Stack>
                        <Group justify='space-between'>
                            <EzText>Daily Cost</EzText>
                            <Group gap={0}>
                                <IconChevronUp color='teal' size={14}/>
                                <EzText c='teal'>+8%</EzText>
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
                {/*<Card>*/}
                {/*    <Stack gap={8}>*/}
                {/*        {car.map((item, index) =>*/}
                {/*            <Group*/}
                {/*                key={index}*/}
                {/*                className={classes['car-button']}*/}
                {/*            >*/}
                {/*                <Group flex={1} justify='space-between'>*/}
                {/*                    <EzText>{item.name}</EzText>*/}
                {/*                    <EzText>${item.totalSpend}</EzText>*/}
                {/*                </Group>*/}
                {/*                <ActionIconsToolTip ITEMS={ITEMS}/>*/}
                {/*            </Group>*/}
                {/*        )}*/}
                {/*    </Stack>*/}
                {/*</Card>*/}
            </Stack>
        </EzCard>
    );
}