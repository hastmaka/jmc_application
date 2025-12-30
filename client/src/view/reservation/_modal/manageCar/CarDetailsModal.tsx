import {Flex, Group, Stack} from "@mantine/core";
import FullCarousel from "@/components/FullCarousel.tsx";
import EzText from "@/ezMantine/text/EzText.tsx";
import moment from "moment";
import {useLayoutEffect} from "react";
import {ReservationModalController} from "@/view/reservation/_modal/ReservationModalController.ts";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";

function format(date: string) {
    if (!date) return "";
    return moment(date).format("MM-DD-YYYY");
}

export default function CarDetailsModal({carId}: {carId: number}) {
    const {
        carDetailGetData,
        carDetailData,
        carDetailLoading,
    } = ReservationModalController

    useLayoutEffect(() => {
        carDetailGetData(carId).then()

        return () => {
            ReservationModalController.carDetailLoading = true
            ReservationModalController.carDetailData = []
        }
    }, [carId])

    if (carDetailLoading) return <EzLoader h={400}/>

    const data = {
        Name: carDetailData?.car_name,
        Vin: carDetailData?.car_vin,
        Color: carDetailData?.car_color,
        Year: carDetailData?.car_year.substring(0,4),
        Type: carDetailData?.select_type?.label,
    }
    const data2 = {
        Plate: carDetailData?.car_plate,
        Capacity: carDetailData?.car_capacity,
        ['Inspection Date']: format(carDetailData?.car_inspection_date),
        ['Insurance Expiration']: format(carDetailData?.car_insurance_expiration),
        ['Registration Expiration']: format(carDetailData?.car_registration_expiration),
    }

    return (
        <Group align='flex-start'>
            <Flex flex={1}>
                <FullCarousel
                    images={carDetailData?.car_document_image}
                />
            </Flex>
            <Flex flex={2}>
                <Stack flex={1}>
                    {Object.entries(data).map(([key, value]) =>
                        <EzText key={key} bold={`${key}:`}>{value || 'Not Provided'}</EzText>
                    )}
                </Stack>
                <Stack flex={1}>
                    {Object.entries(data2).map(([key, value]) =>
                        <EzText key={key} bold={`${key}:`}>{value || 'Not Provided'}</EzText>
                    )}
                </Stack>
            </Flex>
        </Group>
    );
}