import EzCard from "@/ezMantine/card/EzCard.tsx";
import {ActionIcon, Card, Divider, Flex, Group, Menu, Stack} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.tsx";
import {type ReactNode, useState} from "react";
import {IconChevronUp, IconEye, IconSelector} from "@tabler/icons-react";
import {MonthPicker} from "@mantine/dates";
import { AreaChart } from '@mantine/charts';
import classes from './Fuel.module.scss'
import {ActionIconsToolTip} from "@/ezMantine/actionIconTooltip/ActionIconsToolTip.tsx";

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

const car = [
    {name: 'JMC01', miles: '1230'},
    {name: 'JMC02', miles: '980'},
    {name: 'JMC03', miles: '1540'},
    {name: 'JMC04', miles: '754'},
]

export default function Miles() {
    const [value, setValue] = useState<string | null>(null);

    function customHeader(): ReactNode {
        return (
            <Flex justify='space-between' flex={1}>
                <EzText>Miles</EzText>
                <Group>
                    <EzText>This Month</EzText>
                    <Menu closeOnItemClick={false}>
                        <Menu.Target>
                            <ActionIcon variant='subtle'>
                                <IconSelector/>
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown
                            style={{
                                boxShadow: 'var(--mantine-shadow-md)',
                                border: '1px solid var(--mantine-color-default-border)',
                                background: 'var(--mantine-color-body)',
                            }}
                        >
                            <Group align='flex-start'>
                                <Stack gap={0}>
                                    <Menu.Item>This Month</Menu.Item>
                                    <Menu.Item>Last Week</Menu.Item>
                                </Stack>
                                <Divider orientation='vertical'/>
                                <MonthPicker
                                    value={value}
                                    onChange={setValue}
                                />
                            </Group>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Flex>
        )
    }

    const ITEMS = [
        {
            icon: <IconEye/>,
            tooltip: 'See Details'
        }
    ]

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
                            h={140}
                            w='100%'
                            data={data}
                            dataKey="date"
                            series={[{ name: 'Apples', color: 'indigo.6' }]}
                            curveType="linear"
                            connectNulls
                        />
                    </Stack>
                </Card>
                <Card>
                    <Stack gap={8}>
                        {car.map((item, index) =>
                            <Group
                                key={index}
                                className={classes['car-button']}
                            >
                                <Group flex={1} justify='space-between'>
                                    <EzText>{item.name}</EzText>
                                    <EzText>{item.miles} mi</EzText>
                                </Group>
                                <ActionIconsToolTip ITEMS={ITEMS}/>
                            </Group>
                        )}
                    </Stack>
                </Card>
            </Stack>
        </EzCard>
    );
}