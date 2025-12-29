import {Group} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.tsx";
import u from "@/util";

export const getVehicleField = (index: number) => [{
    name: 'car_car_id',
    label: `Vehicle #${index + 1}`,
    type: 'select',
    required: true,
    fieldProps: {
        url: 'v1/car/asset',
        iterator: {label: 'car_name', value: 'car_id'},
    },
}];

export const getMileageFields = (totals: {totalMiles: number, pricePerGallon: string}) => [
    {
        name: 'inspection_vehicle_odometer_start',
        label: 'Odometer Start',
        type: 'number',
        thousandSeparator: ',',
        required: true,
    },
    {
        name: 'inspection_vehicle_odometer_end',
        label: 'Odometer End',
        type: 'number',
        thousandSeparator: ',',
        required: true,
    },
    {
        name: 'total_miles',
        type: 'component',
        component: (
            <Group miw={120} pt={24} wrap="nowrap" gap={4} flex={1}>
                <EzText size="xl">Total:</EzText>
                <EzText size="xl" fw="bold">
                    {totals.totalMiles > 0 ? `${u.formatMoney(totals.totalMiles, false)} mi` : '-'}
                </EzText>
            </Group>
        ),
    },
];

export const getGasFields = (totals: {totalMiles: number, pricePerGallon: string}) => [
    {
        name: 'inspection_vehicle_gas_gallons',
        label: 'Gallons',
        type: 'number',
        decimalScale: 3,
    },
    {
        name: 'inspection_vehicle_gas_cost',
        label: 'Cost ($)',
        type: 'number',
        leftSection: '$',
        decimalScale: 2,
    },
    {
        name: 'price_per_gallon',
        type: 'component',
        component: (
            <Group miw={120} pt={24} wrap="nowrap" gap={4} flex={1}>
                <EzText size="xl">$/gal:</EzText>
                <EzText size="xl" fw="bold">
                    {parseFloat(totals.pricePerGallon) > 0 ? u.formatMoney(totals.pricePerGallon) : '-'}
                </EzText>
            </Group>
        ),
    },
];

// Combined fields for checkRequired validation
export const getVehicleRequiredFields = (index: number) => [
    ...getVehicleField(index),
    ...getMileageFields({totalMiles: 0, pricePerGallon: '0'}),
];
