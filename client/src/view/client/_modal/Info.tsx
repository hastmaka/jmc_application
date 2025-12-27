import { Select, Stack, Textarea, Title } from "@mantine/core";
import {ClientModalController} from "./ClientModalController.ts";
import type {FormField} from "@/types";
import FormGenerator from "@/components/form/FormGenerator.tsx";

const INFO: FormField[] = [
    { name: "client_first_name", label: "First Name", required: true },
    { name: "client_middle_name", label: "Middle Name" },
    { name: "client_last_name", label: "Last Name", required: true },
    { name: "client_dob", label: "DOB (Date of Birth)", type: "date", required: true },
    {
        name: "client_sex",
        label: "Sex",
        type: "select",
        fieldProps: {
            url: "v1/asset/sex",
        },
    },
    { name: "client_eqhealth_id", label: "EQ Health ID" },
    { name: "client_start_date", label: "Start Date", type: "date" },
];

const INSURANCE: FormField[] = [
    {
        name: "insurance_insurance_id",
        label: "Insurance Name",
        type: "select",
        fieldProps: {
            url: "v1/insurance",
        },
    },
    { name: "client_insurance_number", label: "Insurance Number" },
    {
        name: "client_insurance_card_expiration_date",
        label: "Insurance Card Expiration Date",
        type: "date",
    },
];

const CONTACT: FormField[] = [
    { name: "client_phone_number", label: "Phone Number", type: "phone" },
];

export default function Info() {
    const { handleInput, formData, errors } = ClientModalController;

    const handleInfo = (name: string, value: unknown, api?: any) =>
        handleInput(name, value, "infoFormData", api);

    return (
        <Stack>
            <Title order={5}>Personal Info</Title>

            <FormGenerator
                field={INFO}
                handleInput={(name, value, api) =>
                    handleInput('info', name, value, api)}
                structure={[3,2,2]}
                formData={{...formData!['info']}}
                errors={errors!['info']}
            />

            <Title order={5}>Insurance Information</Title>

            <FormGenerator
                field={INSURANCE}
                handleInput={(name, value, api) =>
                    handleInput('info', name, value, api)}
                structure={[3]}
                formData={{...formData!['info']}}
                errors={errors!['info']}
            />

            <Title order={5}>Contact Information</Title>

            <FormGenerator
                field={CONTACT}
                handleInput={(name, value, api) =>
                    handleInput('info', name, value, api)}
                structure={[1]}
                formData={{...formData!['info']}}
                errors={errors!['info']}
            />

            <Select
                size="sm"
                variant="filled"
                flex={1}
                label="Select Service"
                value={"Applied Behavior Analysis"}
                data={["Applied Behavior Analysis"]}
            />

            <Textarea
                variant="filled"
                placeholder="Enter notes here"
                label="Notes"
                flex={1}
                onChange={(e) => handleInfo("client_note_comment", e.currentTarget.value)}
            />
        </Stack>
    );
}