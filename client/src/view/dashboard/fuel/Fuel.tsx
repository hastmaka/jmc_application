import EzCard from "@/ezMantine/card/EzCard.tsx";
import {ActionIcon, Card, Divider, Flex, Group, Stack, Tooltip} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.tsx";
import {type ReactNode, useEffect} from "react";
import {IconFilterOff} from "@tabler/icons-react";
import { AreaChart } from '@mantine/charts';
import {DashboardController} from "@/view/dashboard/DashboardController.ts";
import FormGenerator from "@/components/form/FormGenerator.tsx";
import DatePickerInputWithMonth from "@/components/DatePickerInputWithMonth.tsx";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";

export default function Fuel() {
    const {
        formData,
        handleInput,
        errors,
        fuelGetData,
        getFuelAggregates,
        fuelLoading,
    } = DashboardController;

    const FIELDS = [
        {
            name: 'select_car',
            placeholder: 'Car',
            type: 'select',
            fieldProps: {
                url: 'v1/car/asset',
                iterator: {label: 'car_name', value: 'car_id'},
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
                    value={formData?.fuel?.date_range}
                    handleInput={handleInput}
                    type="fuel"
                />
            )
        }
    ]

    const carId = formData?.fuel?.select_car?.value;
    const dateRange = formData?.fuel?.date_range;

    useEffect(() => {
        fuelGetData().then()
    }, [carId, dateRange?.[0]?.toString(), dateRange?.[1]?.toString()]);

    const aggregates = getFuelAggregates();

    function clearFilter() {
        handleInput('fuel', 'select_car', null);
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

    const hasFilters = carId && dateRange?.[0] && dateRange?.[1];

    return (
        <EzCard customHeader={customHeader()} container={{flex: 1}}>
            {fuelLoading ? (
                <EzLoader h={390} />
            ) : !hasFilters ? (
                <Stack align="center" justify="center" h={390}>
                    <EzText c="dimmed">Select a car and date range to view fuel data</EzText>
                </Stack>
            ) : (
                <Stack>
                    <Group justify='space-between'>
                        <Stack flex={1} align='center' gap={8}>
                            <EzText size='xl' fw='xxl'>${aggregates.totalGasCost.toFixed(2)}</EzText>
                            <EzText size='xs'>Total Cost</EzText>
                        </Stack>
                        <Divider orientation='vertical'/>
                        <Stack flex={1} align='center' gap={8}>
                            <EzText size='xl' fw='xxl'>{aggregates.totalGallons} gal</EzText>
                            <EzText size='xs'>Total Gallons</EzText>
                        </Stack>
                        <Divider orientation='vertical'/>
                        <Stack flex={1} align='center' gap={8}>
                            <EzText size='xl' fw='xxl'>${aggregates.costPerMile.toFixed(2)} /mi</EzText>
                            <EzText size='xs'>Cost Per Mile</EzText>
                        </Stack>
                    </Group>

                    {aggregates.chartData.length > 0 && (
                        <Card>
                            <Stack>
                                <EzText>Daily Cost</EzText>
                                <AreaChart
                                    h={240}
                                    w='100%'
                                    data={aggregates.chartData}
                                    dataKey="date"
                                    series={[{ name: 'cost', color: 'indigo.6' }]}
                                    curveType="linear"
                                    connectNulls
                                />
                            </Stack>
                        </Card>
                    )}
                </Stack>
            )}
        </EzCard>
    );
}