import {useLayoutEffect, useMemo} from "react";
import MantineGrid from "@/ezMantine/mantineDataGrid/MantineGrid.tsx";
import {ReservationController} from "./ReservationController.ts";
import ReservationGridToolbar from "./ReservationGridToolbar.tsx";
import ReservationGridActions from "./ReservationGridActions.tsx";
import {Flex, Pill, Stack} from "@mantine/core";
import u from "@/util";
import {IconChevronDown} from "@tabler/icons-react";
import EzMenu from "@/ezMantine/menu/EzMenu.tsx";
// import DetailPrice from "@/view/reservation/_modal/DetailPrice.tsx";
import {ReservationModalController} from "@/view/reservation/_modal/ReservationModalController.ts";
import moment from "moment";
import {LoginController} from "@/view/login/LoginController.ts";
import {useClipboard} from "@mantine/hooks";


export default function Reservation() {
    const {copy} = useClipboard({ timeout: 500 });
    const {fetchData} = ReservationController
    const {user} = LoginController

    useLayoutEffect(() => {
        if (
            user?.user_preference?.rangeDateValue &&
            user?.user_preference?.rangeDateValue[0] !== null
        ) {
            ReservationController.manageFilters({
                fieldName: 'reservation_date',
                value: ReservationController?.rangeDateValue || user.user_preference.rangeDateValue,
                operator: 'between'
            })
        } else {
            fetchData()
        }

        return () => {
            ReservationController.data = {list: [], total: 0}
        }
    }, [user, fetchData])

    const columns =
        useMemo(() => [
            {
                accessorKey: 'reservation_passenger_name',
                header: "Passenger Name",
                size: 140,
            },
            {
                accessorKey: 'reservation_car',
                header: 'VEH',
                size: 100,
                cell: ({cell}: {cell: any}) => {
                    const reservation_id = cell.row.original.reservation_id;
                    const value = cell.row.original.reservation_car;
                    const color = cell.row.original.car_color;
                    // return value ? <Pill bg={color} c='black'>{value}</Pill> : null
                    if (!value) return null;
                    return (
                        <EzMenu
                            trigger='hover'
                            custom
                            target={(
                                <Pill c='black' bg={color}>
                                    <Flex align='center'>
                                        <IconChevronDown size={14}/>
                                        {value}
                                    </Flex>
                                </Pill>
                            )}
                            onItemClick={async (item:any) => {
                                return await window.toast.U({
                                    id: {
                                        title: 'Updating Reservation Car',
                                        message: 'Please wait...',
                                    },
                                    update: {
                                        success: `Reservation Car updated successfully.`,
                                        error: `Failed to update reservation car.`,
                                    },
                                    cb: () => {
                                        ReservationModalController.handeChangeReservationCar(item.value, reservation_id)
                                        // ReservationModalController.handleChangeReservationStatus(item.value)
                                    }
                                })

                            }}
                            url='v1/car/asset'
                            iterator={{label: 'car_plate', value: 'car_id'}}
                        />
                    )
                }
            },
            {
                accessorKey: 'select_source',
                header: 'Sour',
                size: 50,
                cell: ({cell}: {cell: any}) => {
                    const source = cell.row.original.select_source?.label;
                    return source ? <span>{source.substring(0, 3)}</span> : null
                }
            },
            {
                accessorKey: 'created_at',
                header: 'Created at',
                size: 90,
                cell: ({cell}: {cell: any}) => {
                    const row = cell.row.original;
                    return moment.utc(row.created_at).local().format('MM/DD/YYYY')
                }
            },
            {
                accessorKey: 'reservation_email',
                header: 'Email',
                size: 170,
                cell: ({ cell }: { cell: any }) => {
                    const email = cell.row.original.reservation_email;
                    if (!email) return null;

                    return (
                        <a
                            href={`mailto:${email}`}
                            style={{ color: '#1a73e8', textDecoration: 'underline' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                copy(email);
                                window.toast.S('Email was copied');
                            }}
                        >
                            {email}
                        </a>
                    );
                }
            },
            {
                accessorKey: 'reservation_phone',
                header: 'Phone Number',
                size: 135,
                cell: ({cell}: {cell: any}) => {
                    const phone = cell.row.original.reservation_phone;
                    if (!phone) return null;
                    return <span>{phone}</span>
                }
            },
            {
                accessorKey: 'reservation_status',
                header: 'Status',
                size: 75,
                // filterFn: stringFilterFn,
                cell: ({cell}: {cell: any}) => {
                    const value = cell.row.original.reservation_status;
                    const reservation_id = cell.row.original.reservation_id;
                    const colorMap: Record<string, string> = {
                        pending: 'yellow.2',
                        confirmed: 'green.2',
                        completed: 'gray.2',
                        cancelled: 'red.2'
                    }

                    return (
                        <EzMenu
                            trigger='hover'
                            custom
                            target={(
                                <Pill c='black' bg={colorMap[value.toLowerCase()]}>
                                    <Flex align='center'>
                                        <IconChevronDown size={14}/>
                                        {u.capitalizeWords(value.substring(0, 4))}
                                    </Flex>
                                </Pill>
                            )}
                            onItemClick={async (item:any) => {
                                return await window.toast.U({
                                    id: {
                                        title: 'Updating Status',
                                        message: 'Please wait...',
                                    },
                                    update: {
                                        success: `Reservation status updated successfully.`,
                                        error: `Failed to update reservation status.`,
                                    },
                                    cb: () => {
                                        ReservationModalController.dirtyFields.reservation_id = reservation_id;
                                        ReservationModalController.handleChangeReservationStatus(item.value)
                                    }
                                })

                            }}
                            url='v1/asset/reservation_status'
                        />
                    )
                }
            },
            {
                accessorKey: 'reservation_day_name',
                header: 'Day',
                size: 45,
                cell: ({cell}: {cell: any}) => {
                    const row = cell.row.original;
                    return moment(row.reservation_date, 'YYYY-MM-DD').format('dddd').substring(0, 3)
                }
            },
            {
                accessorKey: 'reservation_date',
                header: 'Date',
                size: 90,
                cell: ({cell}: {cell: any}) => {
                    const row = cell.row.original;
                    return moment(row.reservation_date, 'YYYY-MM-DD').format('MM/DD/YYYY');
                }
            },
            {
                accessorKey: 'reservation_time',
                header: 'Time',
                size: 80,
                cell: ({cell}: {cell: any}) => {
                    const row = cell.row.original;
                    if (!row.reservation_time) return null;
                    if (row.reservation_itinerary && row.reservation_itinerary.length > 0) {
                        const times = row.reservation_itinerary.map((item: any) => {
                            const timeKey = Object.keys(item).find((key: string) => key.startsWith('reservation_time_'));
                            return timeKey ? moment(item[timeKey], "HH:mm:ss").format("h:mm A") : null;
                        }).filter(Boolean);

                        if (times.length > 0) {
                            return (
                                <Stack>
                                    <span>{moment(row.reservation_time, "HH:mm:ss").format("h:mm A")}</span>
                                    {times.map((time: string, idx: number) => (
                                        <span key={idx}>{time}</span>
                                    ))}
                                </Stack>
                            );
                        }
                    }
                    return moment(row.reservation_time, "HH:mm:ss").format("h:mm A")
                },
            },
            {
                accessorKey: 'reservation_pickup_location_name',
                header: 'Pickup Location',
                size: 160,
                cell: ({cell}: {cell: any}) => {
                    const row = cell.row.original;
                    if (!row.reservation_pickup_location_name) return null;
                    if (row.reservation_itinerary && row.reservation_itinerary.length > 0) {
                        const pickup = row.reservation_itinerary.map((item: any) => {
                            const timeKey = Object.keys(item).find((key: string) => key.startsWith('reservation_pickup_'));
                            return item[timeKey as string]
                        }).filter(Boolean);

                        if (pickup.length > 0) {
                            return (
                                <Stack>
                                    <span>{row.reservation_pickup_location_name}</span>
                                    {pickup.map((time: string, idx: number) => (
                                        <span key={idx}>{time}</span>
                                    ))}
                                </Stack>
                            );
                        }
                    }
                    return <span>{row.reservation_pickup_location_name}</span>
                }
            },
            {
                accessorKey: 'reservation_dropoff_location',
                header: 'Dropoff Location',
                size: 120,
                cell: ({cell}: {cell: any}) => {
                    const row = cell.row.original;
                    if (!row.reservation_dropoff_location) return null;
                    if (row.reservation_itinerary && row.reservation_itinerary.length > 0) {
                        const pickup = row.reservation_itinerary.map((item: any) => {
                            const timeKey = Object.keys(item).find((key: string) => key.startsWith('reservation_dropoff_'));
                            return item[timeKey as string]
                        }).filter(Boolean);

                        if (pickup.length > 0) {
                            return (
                                <Stack>
                                    <span>{row.reservation_dropoff_location}</span>
                                    {pickup.map((time: string, idx: number) => (
                                        <span key={idx}>{time}</span>
                                    ))}
                                </Stack>
                            );
                        }
                    }
                    return <span>{row.reservation_dropoff_location}</span>
                }
            },
            {
                accessorKey: 'reservation_hour',
                header: 'H',
                size: 40,
                cell: ({cell}: {cell: any}) => {
                    const hour = cell.row.original.reservation_hour;
                    if (!hour) return null;
                    return parseFloat(hour)
                }
            },
            {
                accessorKey: 'reservation_passengers',
                header: 'Pax',
                size: 50,
                cell: ({cell}: {cell: any}) => {
                    const pax = cell.row.original.reservation_passengers;
                    if (!pax) return null;
                    return <span>{pax}</span>
                }
            },
            {
                accessorKey: 'reservation_real_value',
                header: 'R. Val',
                size: 80,
                cell: function ({cell}: {cell: any}) {
                    const real_value = cell.row.original.reservation_real_value;
                    if (!real_value) return null;
                    return u.formatMoney(real_value)
                }
            },
            {
                accessorKey: 'reservation_total',
                header: 'Total',
                size: 80,
                cell: function ({cell}: {cell: any}) {
                    const total = cell.row.original.reservation_total;
                    if (!total) return null;
                    return u.formatMoney(total)
                    // return (
                    //     <DetailPrice
                    //         row={{...row,
                    //             reservation_real_value: u.formatMoney(row.reservation_real_value)
                    //         }}
                    //         position
                    //     />
                    // )
                }
            },
        ], [])

    return (
        <MantineGrid
            state={{...ReservationController, columns}}
            rowId='reservation_id'
            toolbar={<ReservationGridToolbar state={{...ReservationController}}/>}
            actions={{comp: ReservationGridActions, itemCount: 1}}
            verticalSpacing='xs'
            // withSorting
        />
    );
}





































