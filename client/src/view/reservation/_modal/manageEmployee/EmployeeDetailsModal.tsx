import {Avatar, Flex, Group, Stack, Text} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.tsx";
import moment from "moment";
import {useLayoutEffect} from "react";
import {ReservationModalController} from "@/view/reservation/_modal/ReservationModalController.ts";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import ExistingDocumentStack from "@/view/reservation/_modal/manageEmployee/ExistingDocumentStack.tsx";

function format(date: string) {
    if (!date) return "";
    return moment(date).format("MM-DD-YYYY");
}

export default function EmployeeDetailsModal({
    employeeId,
    handleRemoveDocument
}: {
    employeeId: number,
    handleRemoveDocument: (doc: any) => void
}) {
    const {
        employeeDetailGetData,
        employeeDetailData,
        employeeDetailLoading,
    } = ReservationModalController

    useLayoutEffect(() => {
        employeeDetailGetData(employeeId).then()

        return () => {
            ReservationModalController.employeeDetailLoading = true
            ReservationModalController.employeeDetailData = []
        }
    }, [employeeId])

    if (employeeDetailLoading) return <EzLoader h={400}/>

    const avatar = employeeDetailData?.employee_document.find((doc: any) => doc.document_type === 67) || {}

    const data = {
        'Full Name': `${employeeDetailData?.employee_first_name} ${employeeDetailData?.employee_middle_name} ${employeeDetailData?.employee_last_name}`,
        'Email': employeeDetailData?.employee_email,
        'Role': employeeDetailData?.employee_role,
    }
    const data2 = {
        'Certification': employeeDetailData?.employee_certification,
        'Driver License': employeeDetailData?.employee_driver_license,
        'Hire Date': format(employeeDetailData?.employee_hire_date),
        'Termination Date': format(employeeDetailData?.employee_termination_date),
    }

    const document = employeeDetailData?.employee_document || []

    return (
        <Stack gap="md">
            <Group align='flex-start'>
                <Flex flex={1} justify="center" align="center">
                    <Avatar
                        src={avatar?.document_url}
                        size={180}
                        radius={180}
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

            <Stack gap="xs">
                <Text fw={600}>Documents ({document.length})</Text>
                <ExistingDocumentStack
                    document={document}
                    handleRemoveDocument={handleRemoveDocument}
                />
                {document.length === 0 && (
                    <Text c="dimmed" ta="center">No documents available</Text>
                )}
            </Stack>
        </Stack>
    );
}