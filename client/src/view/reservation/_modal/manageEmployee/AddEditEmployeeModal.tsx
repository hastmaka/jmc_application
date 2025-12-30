import FormGenerator from "@/components/form/FormGenerator.tsx";
import SaveCancelDeleteBtns from "@/components/SaveCancelDeleteBtns.tsx";
import {ActionIcon, FileButton, Group, Stack, Text, Box} from "@mantine/core";
import {ReservationModalController} from "../ReservationModalController.ts";
import {useLayoutEffect, useMemo, useRef} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";
import EzText from "@/ezMantine/text/EzText.tsx";
import EzButton from "@/ezMantine/button/EzButton.tsx";
import {IconCheck, IconFile, IconLoader2, IconPlus, IconTrash} from "@tabler/icons-react";
import ExistingDocumentStack from "@/view/reservation/_modal/manageEmployee/ExistingDocumentStack.tsx";

export default function AddEditEmployeeModal({
    modalId,
    handleRemoveDocument
} : {
    modalId: string;
    handleRemoveDocument: (file: File) => void;
}) {
    const resetRef = useRef<() => void>(null);
    const {
        formData,
        errors,
        handleInput,
        modal,
        modalData,
        employeeId,
        handleSaveEmployee,
        handleEditEmployee,
        addEmployeeDocument,
        uploadEmployeeDocument,
        checkRequired
    } = ReservationModalController

    const existingDocuments = formData?.employee?.employee_document || []
    const newDocuments = formData.employeeFiles || []

    const EMPLOYEEFIELDS =
        useMemo(() => [
            {
                name: 'employee_first_name',
                label: 'First Name',
                required: true,
            },
            {
                name: 'employee_middle_name',
                label: 'Middle Name'
            },
            {
                name: 'employee_last_name',
                label: 'Last Name',
                required: true,
            },
            {
                name: 'employee_email',
                label: 'Email',
                required: true,
            },
            {
                name: 'employee_driver_license',
                label: 'Driver License',
            },
            {
                name: 'employee_phone',
                label: 'Phone Number',
                type: 'phone',
            },
            {
                name: 'employee_address',
                label: 'Address',
            },
            // {
            //     name: 'employee_certification',
            //     label: 'Certification',
            // },
            {
                name: 'select_role',
                label: 'Role',
                type: 'select',
                required: true,
                fieldProps: {
                    url: 'v1/asset/employee_role',
                }
            },
            {
                name: 'employee_hire_date',
                label: 'Hire Date',
                type: 'date',
                required: true,
            },
            {
                name: 'employee_termination_date',
                label: 'Termination Date',
                type: 'date',
            },
            {
                name: 'employee_note',
                label: 'Note',
                type: 'textarea',
                autosize: true,
                minRows: 4,
            }
        ], [])

    const DOCUMENTFIELDS =
        useMemo(() => [
            {
                type: 'select',
                name: 'document',
                placeholder: 'Document Type',
                fieldProps: {
                    url: "v1/asset/document_type"
                },
                required: true,
            }
        ], [])

    const FIELDS = newDocuments.length > 0
        ? [...EMPLOYEEFIELDS, ...DOCUMENTFIELDS]
        : EMPLOYEEFIELDS;

    useLayoutEffect(() => {
        if (employeeId) modalData('employee', FIELDS, +employeeId).then()
    }, [employeeId])

    function handleFileUpload(files: File[]) {
        addEmployeeDocument(files)
        resetRef.current?.();
    }

    async function handleSubmit() {
        if (checkRequired('employee', FIELDS)) {
            return await window.toast.U({
                modalId,
                id: {
                    title: `${employeeId ? 'Editing' : 'Creating'} Employee.`,
                    message: 'Please wait...',
                },
                update: {
                    success: `Employee ${employeeId ? 'updated' : 'created'} successfully.`,
                    error: `Failed to ${employeeId ? 'update' : 'create'} employee.`
                },
                cb: async () => {
                    if (employeeId) return await handleEditEmployee()
                    await handleSaveEmployee()
                }
            })
        }
    }

    if (modal.loading) return <EzLoader h='calc(100vh -180px)'/>

    return (
        <Stack>
            <EzScroll h='calc(100vh -180px)' scrollbars='y'>
                <Stack>
                    <FormGenerator
                        field={EMPLOYEEFIELDS}
                        handleInput={(name: any, value: any, api: any) =>
                            handleInput('employee', name, value, api)}
                        structure={[3, 4, 3, 1]}
                        formData={formData['employee']}
                        errors={errors['employee']}
                    />

                    {/* Existing Documents Section */}
                    {existingDocuments.length > 0 && (
                        <Stack gap="xs">
                            <EzText>Existing Documents</EzText>
                            <ExistingDocumentStack
                                document={existingDocuments}
                                handleRemoveDocument={handleRemoveDocument}
                            />
                        </Stack>
                    )}

                    {/* Add New Documents Section */}
                    <Stack gap="xs">
                        <EzText>Add Documents</EzText>
                        <FileButton
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.csv,.jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.avif,.ico"
                            multiple
                            resetRef={resetRef}
                        >
                            {(props) =>
                                <EzButton
                                    w='fit-content'
                                    leftSection={<IconPlus size={16}/>}
                                    variant="light"
                                    {...props}
                                >Add Document</EzButton>}
                        </FileButton>

                        {newDocuments.length > 0 && (
                            <Stack gap="xs" mt="xs">
                                {newDocuments.map((doc: any, index: number) => (
                                    <Group
                                        key={`new_${index}`}
                                        justify="space-between"
                                        p="xs"
                                        style={{
                                            border: '1px solid var(--mantine-color-default-border)',
                                            borderRadius: 'var(--mantine-radius-sm)'
                                        }}
                                    >
                                        <Group gap="xs" style={{flex: 1}}>
                                            <IconFile size={20} color="var(--mantine-color-blue-6)"/>
                                            <Text size="sm" lineClamp={1} style={{maxWidth: 200}}>
                                                {doc.name || 'No Name'}
                                            </Text>
                                            {doc.uploading && (
                                                <IconLoader2 size={16} className="animate-spin" color="var(--mantine-color-blue-6)"/>
                                            )}
                                            {doc.uploaded && (
                                                <Group gap={4}>
                                                    <IconCheck size={16} color="var(--mantine-color-green-6)"/>
                                                    <Text size="xs" c="green">Uploaded</Text>
                                                </Group>
                                            )}
                                        </Group>
                                        <Group gap="xs">
                                            <Box w={180}>
                                                <FormGenerator
                                                    field={DOCUMENTFIELDS}
                                                    handleInput={async (name: any, value: any) => {
                                                        doc.document_type = value
                                                        handleInput('employee', name, value)
                                                        // If editing, upload immediately when document_type is selected
                                                        if (modal.state === 'editing' && !doc.uploaded) {
                                                            await uploadEmployeeDocument(doc, value)
                                                        }
                                                    }}
                                                    structure={[1]}
                                                    formData={{document: doc.document_type}}
                                                    errors={errors['employee']}
                                                />
                                            </Box>
                                            <ActionIcon
                                                color="red"
                                                variant="subtle"
                                                onClick={() => handleRemoveDocument(doc)}
                                                disabled={doc.uploading}
                                            >
                                                <IconTrash size={16}/>
                                            </ActionIcon>
                                        </Group>
                                    </Group>
                                ))}
                            </Stack>
                        )}
                    </Stack>
                </Stack>
            </EzScroll>
            <SaveCancelDeleteBtns
                withScroll
                accept={handleSubmit}
                label={{accept: 'Save'}}
            />
        </Stack>
    );
}