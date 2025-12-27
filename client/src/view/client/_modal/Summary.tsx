import { Card, Group, Stack, Text, Title } from "@mantine/core";
import EzGrid from "@/ezMantine/gridLayout/EzGrid";
import { IconCalendarWeek, IconHome, IconUser } from "@tabler/icons-react";
import EzText from "@/ezMantine/text/EzText";
import moment from "moment";
import {ClientModalController} from "./ClientModalController.ts";

// --- define form data shapes ---
type InfoFormData = {
    client_first_name?: string;
    client_middle_name?: string;
    client_last_name?: string;
    client_dob?: string | Date;
    client_sex?: string;
    client_eqhealth_id?: string;
    client_start_date?: string | Date;
    insurance_insurance_id?: string;
    client_insurance_number?: string;
    client_insurance_card_expiration_date?: string | Date;
    client_phone_number?: string;
};

type CaregiverFormData = {
    caregiver_first_name?: string;
    caregiver_last_name?: string;
    caregiver_relation?: string;
    caregiver_phone_number?: string;
    caregiver_email?: string;
};

type AddressFormData = {
    address_type?: string;
    address_street?: string;
    address_apt?: string;
    address_city?: string;
    address_state?: string;
    address_zip?: string;
};

// --- component ---
export default function Summary() {
    const {formData} = ClientModalController;
    const infoFormData: InfoFormData = formData?.info
    const caregiverFormData: CaregiverFormData = formData?.caregiver
    const addressFormData: AddressFormData = formData?.address

    return (
        <Stack>
            <Title order={5}>Review Your Information</Title>

            <EzGrid gridTemplateColumns="1fr">
                {/* Client */}
                <Card padding="lg" radius="sm" withBorder>
                    <Group>
                        <IconCalendarWeek />
                        <EzText size="md" fw="md">
                            Client Information
                        </EzText>
                    </Group>
                    <EzGrid gridTemplateColumns="1fr 1fr" marginTop="1rem" gap=".5rem">
                        <EzText fw="md" size="sm">
                            First Name:{" "}
                            <Text component="span">
                                {infoFormData?.client_first_name || "Not Provided"}
                            </Text>
                        </EzText>
                        <EzText fw="md" size="sm">
                            Middle Name:{" "}
                            <Text component="span">
                                {infoFormData?.client_middle_name || "Not Provided"}
                            </Text>
                        </EzText>
                        <EzText fw="md" size="sm">
                            Last Name:{" "}
                            <Text component="span">
                                {infoFormData?.client_last_name || "Not Provided"}
                            </Text>
                        </EzText>
                        <EzText fw="md" size="sm">
                            Date of Birth:{" "}
                            <Text component="span">
                                {infoFormData?.client_dob
                                    ? moment(infoFormData.client_dob).format("MM/DD/YYYY")
                                    : "Not Provided"}
                            </Text>
                        </EzText>
                        <EzText fw="md" size="sm">
                            Sex:{" "}
                            <Text component="span">
                                {infoFormData?.client_sex || "Not Provided"}
                            </Text>
                        </EzText>
                        <EzText fw="md" size="sm">
                            EQ Health ID:{" "}
                            <Text component="span">
                                {infoFormData?.client_eqhealth_id || "Not Provided"}
                            </Text>
                        </EzText>
                        <EzText fw="md" size="sm">
                            Start Date:{" "}
                            <Text component="span">
                                {infoFormData?.client_start_date
                                    ? moment(infoFormData.client_start_date).format("MM/DD/YYYY")
                                    : "Not Provided"}
                            </Text>
                        </EzText>
                        <EzText fw="md" size="sm">
                            Insurance Name:{" "}
                            <Text component="span">
                                {infoFormData?.insurance_insurance_id || "Not Provided"}
                            </Text>
                        </EzText>
                        <EzText fw="md" size="sm">
                            Insurance Number:{" "}
                            <Text component="span">
                                {infoFormData?.client_insurance_number || "Not Provided"}
                            </Text>
                        </EzText>
                        <EzText fw="md" size="sm">
                            Expiration Card Date:{" "}
                            <Text component="span">
                                {infoFormData?.client_insurance_card_expiration_date
                                    ? moment(
                                        infoFormData.client_insurance_card_expiration_date
                                    ).format("MM/DD/YYYY")
                                    : "Not Provided"}
                            </Text>
                        </EzText>
                        <EzText fw="md" size="sm">
                            Phone Number:{" "}
                            <Text component="span">
                                {infoFormData?.client_phone_number || "Not Provided"}
                            </Text>
                        </EzText>
                    </EzGrid>
                </Card>

                {/* Caregiver */}
                <Card padding="lg" radius="sm" withBorder>
                    <Group>
                        <IconUser />
                        <EzText size="md" fw="md">
                            Caregiver Information
                        </EzText>
                    </Group>
                    <EzGrid gridTemplateColumns="1fr 1fr" marginTop="1rem" gap=".5rem">
                        <EzText fw="md" size="sm">
                            First Name:{" "}
                            <Text component="span">
                                {caregiverFormData?.caregiver_first_name || "Not Provided"}
                            </Text>
                        </EzText>
                        <EzText fw="md" size="sm">
                            Last Name:{" "}
                            <Text component="span">
                                {caregiverFormData?.caregiver_last_name || "Not Provided"}
                            </Text>
                        </EzText>
                        <EzText fw="md" size="sm">
                            Relation:{" "}
                            <Text component="span">
                                {caregiverFormData?.caregiver_relation || "Not Provided"}
                            </Text>
                        </EzText>
                        <EzText fw="md" size="sm">
                            Phone Number:{" "}
                            <Text component="span">
                                {caregiverFormData?.caregiver_phone_number || "Not Provided"}
                            </Text>
                        </EzText>
                        <EzText fw="md" size="sm">
                            Email:{" "}
                            <Text component="span">
                                {caregiverFormData?.caregiver_email || "Not Provided"}
                            </Text>
                        </EzText>
                    </EzGrid>
                </Card>

                {/* Address */}
                <Card padding="lg" radius="sm" withBorder>
                    <Group>
                        <IconHome />
                        <EzText size="md" fw="md">
                            Address Information
                        </EzText>
                    </Group>
                    <EzGrid gridTemplateColumns="1fr 1fr" marginTop="1rem" gap=".5rem">
                        <EzText fw="md" size="sm">
                            Location:{" "}
                            <Text component="span">
                                {addressFormData?.address_type || "Not Provided"}
                            </Text>
                        </EzText>
                        <EzText fw="md" size="sm">
                            Street:{" "}
                            <Text component="span">
                                {addressFormData?.address_street || "Not Provided"}
                            </Text>
                        </EzText>
                        <EzText fw="md" size="sm">
                            Apartment:{" "}
                            <Text component="span">
                                {addressFormData?.address_apt || "Not Provided"}
                            </Text>
                        </EzText>
                        <EzText fw="md" size="sm">
                            City:{" "}
                            <Text component="span">
                                {addressFormData?.address_city || "Not Provided"}
                            </Text>
                        </EzText>
                        <EzText fw="md" size="sm">
                            State:{" "}
                            <Text component="span">
                                {addressFormData?.address_state || "Not Provided"}
                            </Text>
                        </EzText>
                        <EzText fw="md" size="sm">
                            Zip Code:{" "}
                            <Text component="span">
                                {addressFormData?.address_zip || "Not Provided"}
                            </Text>
                        </EzText>
                    </EzGrid>
                </Card>
            </EzGrid>
        </Stack>
    );
}