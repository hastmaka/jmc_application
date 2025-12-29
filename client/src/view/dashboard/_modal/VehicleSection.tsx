import {useEffect} from "react";
import {ActionIcon, Card, Fieldset, Group, Stack} from "@mantine/core";
import {IconTrash} from "@tabler/icons-react";
import FormGenerator from "@/components/form/FormGenerator.tsx";
import {DashboardModalController} from "@/view/dashboard/_modal/DashboardModalController.ts";
import {getVehicleField, getMileageFields, getGasFields} from "@/view/dashboard/_modal/vehicleFields.tsx";

interface VehicleSectionProps {
    index: number;
    inspectionDate: string | undefined;
    canRemove: boolean;
}

export default function VehicleSection({index, inspectionDate, canRemove}: VehicleSectionProps) {
    const {
        formData,
        errors,
        handleInput,
        removeVehicle,
        vehicleReservationGetData,
        getVehicleTotals,
    } = DashboardModalController;

    const vehicleKey = `vehicle${index}`;
    const vehicle = formData[vehicleKey];
    const vehicleErrors = errors[vehicleKey] || {};
    const carId = vehicle?.car_car_id;
    const totals = getVehicleTotals(index);

    // Fetch reservations only if not already loaded (edit mode has data pre-loaded)
    useEffect(() => {
        if (carId && inspectionDate && !vehicle?.reservationData?.length) {
            vehicleReservationGetData(index, carId, inspectionDate);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [carId, inspectionDate]);

    const VEHICLE_FIELD = getVehicleField(index);
    const MILEAGE_FIELDS = getMileageFields(totals);
    const GAS_FIELDS = getGasFields(totals);

    const handleVehicleInput = (name: string, value: any) => {
        handleInput(vehicleKey, name, value);
    };

    return (
        <Card withBorder shadow="none" p="sm">
            <Stack gap={8}>
                <Group justify="space-between" gap={16}>
                    <FormGenerator
                        field={VEHICLE_FIELD}
                        structure={[1]}
                        handleInput={handleVehicleInput}
                        formData={vehicle}
                        errors={vehicleErrors}
                    />
                    {canRemove && (
                        <ActionIcon
                            color="red"
                            onClick={() => removeVehicle(index)}
                            mt={24}
                            size={34}
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
                        errors={vehicleErrors}
                    />
                </Fieldset>

                <Fieldset legend="Gas" p="xs">
                    <FormGenerator
                        field={GAS_FIELDS}
                        structure={[3]}
                        handleInput={handleVehicleInput}
                        formData={vehicle}
                        errors={vehicleErrors}
                    />
                </Fieldset>
            </Stack>
        </Card>
    );
}
