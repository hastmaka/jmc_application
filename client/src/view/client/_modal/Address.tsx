import { Stack, Title, Radio, Group } from "@mantine/core";
import {ClientModalController} from "./ClientModalController.ts";
import type {FormField} from "@/types";
import FormGenerator from "@/components/form/FormGenerator.tsx";

const ADDRESS: FormField[] = [
    {
        name: "address_type",
        label: "Select Location",
        type: "select",
        fieldProps: {
            url: "v1/asset/address_type",
        },
    },
    { name: "address_street", label: "Street" },
    { name: "address_apt", label: "Apartment" },
    { name: "address_city", label: "City" },
    { name: "address_state", label: "State" },
    { name: "address_zip", label: "Zip Code" },
];

export default function Address() {
    const { handleInput, errors, formData } = ClientModalController;

    const handleAddress = (
        name: string,
        value: unknown,
        api?: Record<string, unknown>
    ) => handleInput(name, value, "addressFormData", api);

    return (
        <Stack>
            <Title order={5}>Address Details</Title>

            <FormGenerator
                field={ADDRESS}
                handleInput={(name, value, api) =>
                    handleInput('address', name, value, api)}
                structure={[2,2,2]}
                formData={{...formData!['address']}}
                errors={errors!['address']}
            />

            <Title order={5}>Additional Information</Title>

            <Radio.Group
                name="is_primary_residence"
                label="Primary Residence"
                size="sm"
                onChange={(val) => handleAddress("is_primary_residence", val)}
            >
                <Group mt="xs">
                    <Radio
                        value="yes"
                        label="Yes"
                        iconColor="dark.8"
                        color="white.4"
                    />
                    <Radio
                        value="no"
                        label="No"
                        iconColor="dark.8"
                        color="white.4"
                    />
                </Group>
            </Radio.Group>

            <Radio.Group
                name="related_to"
                label="Related To"
                size="sm"
                onChange={(val) => handleAddress("related_to", val)}
            >
                <Group mt="xs">
                    <Radio
                        value="caregiver"
                        label="Caregiver"
                        iconColor="dark.8"
                        color="white.4"
                    />
                    <Radio
                        value="client"
                        label="Client"
                        iconColor="dark.8"
                        color="white.4"
                    />
                </Group>
            </Radio.Group>
        </Stack>
    );
}