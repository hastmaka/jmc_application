import { Stack, Title } from "@mantine/core";
import {ClientModalController} from "./ClientModalController.ts";
import type {FormField} from "@/types";
import FormGenerator from "@/components/form/FormGenerator.tsx";
import EzButton from "@/ezMantine/button/EzButton.tsx";

const CAREGIVER: FormField[] = [
    {
        name: "caregiver_first_name",
        label: "First Name",
        placeholder: "Set Caregiver First Name",
        required: true,
    },
    {
        name: "caregiver_last_name",
        label: "Last Name",
        placeholder: "Set Caregiver Last Name",
    },
    {
        name: "caregiver_relation",
        label: "Relation with Client",
        placeholder: "Set Relation with Client",
        required: true,
    },
    {
        name: "caregiver_sex",
        label: "Sex",
        type: "select",
        fieldProps: {
            url: "v1/asset/sex",
        },
    },
    {
        name: "caregiver_phone_number",
        placeholder: "Phone Number",
        label: "Set a Phone Number",
        type: "phone",
    },
    {
        name: "caregiver_email",
        placeholder: "Set Email",
        label: "Email",
    },
];

export default function Caregiver() {
    const { handleInput, errors, formData } = ClientModalController;

    return (
        <Stack>
            <Title order={5}>Caregiver Information</Title>

            <FormGenerator
                field={CAREGIVER}
                handleInput={(name, value, api) =>
                    handleInput('caregiver', name, value, api)}
                structure={[2,2,2]}
                formData={{...formData!['caregiver']}}
                errors={errors!['caregiver']}
            />

            <EzButton>Add Caregiver</EzButton>
        </Stack>
    );
}