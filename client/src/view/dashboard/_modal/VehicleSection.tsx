import {useEffect} from "react";
import {ActionIcon, Card, Fieldset, Group, Stack} from "@mantine/core";
import {IconTrash} from "@tabler/icons-react";
import EzText from "@/ezMantine/text/EzText.tsx";
import FormGenerator from "@/components/form/FormGenerator.tsx";
import {DashboardModalController} from "@/view/dashboard/_modal/DashboardModalController.ts";
import u from "@/util";

interface VehicleSectionProps {
    index: number;
    inspectionDate: string | undefined;
    canRemove: boolean;
}

export default function VehicleSection({index, inspectionDate, canRemove}: VehicleSectionProps) {
    const {
        vehicleData,
        updateVehicle,
        removeVehicle,
        vehicleReservationGetData,
        getVehicleTotals,
    } = DashboardModalController;

    const vehicle = vehicleData[index];
    const carId = vehicle?.car_car_id;
    const totals = getVehicleTotals(index);

    // Fetch reservations when car changes
    useEffect(() => {
        if (carId && inspectionDate) {
            vehicleReservationGetData(index, carId, inspectionDate);
        }
    }, [carId, inspectionDate]);

    const VEHICLE_FIELD = [{
        name: 'car_car_id',
        label: `Vehicle #${index + 1}`,
        type: 'select',
        fieldProps: {
            url: 'v1/car/asset',
            iterator: {label: 'car_name', value: 'car_id'},
        },
    }];

    const MILEAGE_FIELDS = [
        {
            name: 'odometer_start',
            label: 'Odometer Start',
            type: 'number',
            thousandSeparator: ',',
        },
        {
            name: 'odometer_end',
            label: 'Odometer End',
            type: 'number',
            thousandSeparator: ',',
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

    const GAS_FIELDS = [
        {
            name: 'gas_gallons',
            label: 'Gallons',
            type: 'number',
            decimalScale: 3,
        },
        {
            name: 'gas_cost',
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

    const handleVehicleInput = (name: string, value: any) => {
        updateVehicle(index, name, value);
    };

    return (
        <Card withBorder shadow="none" p="sm">
            <Stack gap={8}>
                <Group justify="space-between" gap={4}>
                    <FormGenerator
                        field={VEHICLE_FIELD}
                        structure={[1]}
                        handleInput={handleVehicleInput}
                        formData={vehicle}
                        errors={{}}
                    />
                    {canRemove && (
                        <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => removeVehicle(index)}
                            mt={24}
                        >
                            <IconTrash size={16} />
                        </ActionIcon>
                    )}
                </Group>

                <Fieldset legend="Mileage" p="xs">
                    <FormGenerator
                        field={MILEAGE_FIELDS}
                        structure={[3]}
                        handleInput={handleVehicleInput}
                        formData={vehicle}
                        errors={{}}
                    />
                </Fieldset>

                <Fieldset legend="Gas" p="xs">
                    <FormGenerator
                        field={GAS_FIELDS}
                        structure={[3]}
                        handleInput={handleVehicleInput}
                        formData={vehicle}
                        errors={{}}
                    />
                </Fieldset>
            </Stack>
        </Card>
    );
}
