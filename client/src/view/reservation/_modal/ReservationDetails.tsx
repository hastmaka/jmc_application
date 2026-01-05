import {ReservationModalController} from "@/view/reservation/_modal/ReservationModalController.ts";
import {useLayoutEffect} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {Divider, Group, Stack} from "@mantine/core";
import moment from "moment/moment";
import EzText from "@/ezMantine/text/EzText.tsx";
import u from "@/util";
import {getRealMoney} from "@/view/reservation/_modal/getRealMoney.ts";

export default function ReservationDetails({reservationId}: { reservationId: number }) {
    const {
        reservationDetailGetData,
        reservationDetailData,
        reservationDetailLoading,
    } = ReservationModalController

    useLayoutEffect(() => {
        reservationDetailGetData(reservationId).then()

        return () => {
            ReservationModalController.reservationDetailLoading = true
            ReservationModalController.reservationDetailData = []
        }
    }, [reservationId])

    if (reservationDetailLoading) return <EzLoader h={600}/>

    const {
        hour, fuelPlusHour, taxes, total
    } = getRealMoney(reservationDetailData)

    // BUILD ITINERARY FIELDS
    const itineraryEntries: Record<string, any> = {};
    if (reservationDetailData.reservation_itinerary && reservationDetailData.reservation_itinerary.length > 0) {
        reservationDetailData.reservation_itinerary.forEach((item: any, index: number) => {
            const rawTime = item[`reservation_time_${index + 1}`];
            const t = rawTime ? moment(rawTime, "HH:mm").format("h:mm A") : "";
            const p = item[`reservation_pickup_location_${index + 1}`];
            const d = item[`reservation_dropoff_location_${index + 1}`];

            itineraryEntries[`Stop ${index + 1}`] = `${t} — ${p} → ${d}`;
        });
    }

    const data = {
        Day: moment(reservationDetailData.reservation_date, 'YYYY-MM-DD').format('dddd'),
        Date: moment(reservationDetailData.reservation_date, 'YYYY-MM-DD').format('MM/DD/YYYY'),
        Time: moment(reservationDetailData.reservation_time, "HH:mm:ss").format("h:mm A"),
        ['Passenger Name']: reservationDetailData.reservation_passenger_name,
        ['Phone Number']: reservationDetailData.reservation_phone,
        ['Pickup Location']: reservationDetailData.reservation_pickup_location +
            ` ${reservationDetailData?.reservation_pickup_location_name}`,
        ['Dropoff Location']: reservationDetailData.reservation_dropoff_location,
        ...itineraryEntries,
        Pax: reservationDetailData.reservation_passengers,
        Hours: hour === 1 ? `${hour} hr` : `${hour} hrs`,
        Price: u.formatMoney(reservationDetailData.reservation_real_value),
    }

    const data1 = {
        ['Created at']: moment.utc(reservationDetailData.created_at).local().format('MM/DD/YYYY'),
        Email: reservationDetailData.reservation_email,
        Source: reservationDetailData.select_source?.label,
        VEH: reservationDetailData.reservation_car,
        Status: reservationDetailData.reservation_status,
        Hours: hour === 1 ? `${hour} hr` : `${hour} hrs`,
        Base: u.formatMoney(reservationDetailData.reservation_base),
        ['M&G']: u.formatMoney(reservationDetailData.reservation_m_and_g),
        ['Fuel Total']: u.formatMoney(fuelPlusHour),
        ['Airport Fee']: u.formatMoney(reservationDetailData.reservation_airport_fee),
        Tax: u.formatMoney(taxes.toFixed(2)),
        Tips: u.formatMoney(reservationDetailData.reservation_tips),
    }

    return (
        <Group align='flex-start'>
            <Stack flex={1}>
                {Object.entries(data).map(([key, value]) =>
                    <EzText key={key} bold={`${key}:`}>{value || 'Not Provided'}</EzText>
                )}

                <Stack>
                    <EzText bold='Sign: '>{reservationDetailData.reservation_sign}</EzText>
                    <EzText bold='Stops: '>{reservationDetailData.reservation_stop}</EzText>
                    <EzText bold='Special Instructions: '>{reservationDetailData.reservation_special_instructions}</EzText>
                </Stack>
            </Stack>
            <Stack flex={1}>
                {Object.entries(data1).map(([key, value]) =>
                    <EzText key={key} bold={`${key}:`}>{value || 'Not Provided'}</EzText>
                )}
                <Divider w={120}/>
                <EzText bold='Total: ' size='xl'>{u.formatMoney(total)}</EzText>
                <Divider w={120}/>
                <EzText bold='Real Value: '
                        size='xl'>{u.formatMoney(reservationDetailData.reservation_real_value)}</EzText>
            </Stack>
        </Group>
    );
}