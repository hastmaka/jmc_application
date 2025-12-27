import GenericModal from "@/components/modal/GenericModal.tsx";
import {Group} from "@mantine/core";
import EzGroupBtn from "@/ezMantine/buttonGroup/EzGroupBtn.tsx";
import {Suspense, useLayoutEffect, useMemo} from "react";
import {IconArrowLeft, IconEye, IconEdit, IconPlus, IconTrash} from "@tabler/icons-react";
import {ReservationModalController} from "../ReservationModalController.ts";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import EzTable from "@/ezMantine/table/EzTable.tsx";
import {ActionIconsToolTip} from "@/ezMantine/actionIconTooltip/ActionIconsToolTip.tsx";
import EzText from "@/ezMantine/text/EzText.tsx";
import AddEditEmployeeModal from "./AddEditEmployeeModal.tsx";
import EmployeeDetailsModal from "./EmployeeDetailsModal.tsx";
import moment from "moment";
import u from "@/util";

export default function ManageEmployee() {
    const {
        employeeGetData,
        employeeData,
        employeeLoading,
        isAddingOrEditing,
        handleIsAddingOrEditing,
        handleBackManageEmployee,
        handleDeleteEmployee,
        modal,
        removeEmployeeDocument,
        removeEmployeeDocumentFromDetailModal
    } = ReservationModalController

    useLayoutEffect(() => { employeeGetData().then()}, [])

    function handleDelete(row: any) {
        const employeeName = row.employee_full_name
        const modalId = 'confirm-delete-employee'
        window.openModal({
            modalId,
            title: 'Confirm action.',
            size: 'sm',
            children: (
                <GenericModal
                    accept={async () => {
                        return await window.toast.U({
                            modalId,
                            id: {
                                title: 'Deleting employee',
                                message: 'Please wait...'
                            },
                            update: {
                                success: 'Employee was deleted successfully',
                                error: 'Failed to delete employee.'
                            },
                            cb: () => {
                                handleDeleteEmployee(row.employee_id)
                                window.closeModal(modalId)
                            }
                        })
                    }}
                    cancel={() => window.closeModal(modalId)}
                >
                    <EzText>
                        Are you sure you want to delete {employeeName}?
                    </EzText>
                </GenericModal>
            ),
            onClose: () => {}
        })
    }

    async function handleRemoveDocument(doc: any, modalId: string, fromDetail?: boolean) {
        const editing = modal.state === 'editing'

        // For detail modal or editing mode, use toast
        if (fromDetail || editing) {
            return await window.toast.U({
                modalId,
                id: {
                    title: "Removing document.",
                    message: 'Please wait...'
                },
                update: {
                    success: 'Document successfully removed.',
                    error: 'Document could not be removed.'
                },
                cb: () => fromDetail ? removeEmployeeDocumentFromDetailModal(doc) : removeEmployeeDocument(doc)
            })
        }

        // For adding mode (pending files)
        return removeEmployeeDocument(doc)
    }

    function handleSeeDetails(row: any) {
        const modalId = 'employee-details-modal';
        window.openModal({
            modalId,
            title: `${row.employee_full_name} Details`,
            size: '60%',
            children: (
                <GenericModal
                    cancel={() => window.closeModal(modalId)}
                    label={{cancel: 'Close'}}
                >
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <EmployeeDetailsModal
                            employeeId={row.employee_id}
                            handleRemoveDocument={(doc: any) => handleRemoveDocument(doc, modalId, true)}
                        />
                    </Suspense>
                </GenericModal>
            ),
            onClose: () => {}
        })
    }

    const head = [
        'Full Name',
        'Phone Number',
        'Email',
        'Address',
        'Hired Date',
        'Actions',
    ]
    const tdMap = [
        'employee_full_name',
        {
            name: 'employee_phone',
            render: (row: any) => {
                return u.formatPhoneNumber(row.employee_phone)
            }
        },
        'employee_email',
        'employee_address',
        {
            name: 'employee_hire_date',
            render: (row: any) => {
                return moment(row.employee_hire_date).format('MM/DD/YYYY');
            }
        },
        {
            name: 'actions',
            render: (row: any) => {
                return (
                    <ActionIconsToolTip
                        ITEMS={[
                            {
                                icon: (
                                    <IconEye
                                        onClick={() => handleSeeDetails(row)}
                                    />
                                ),
                                tooltip: 'Details'
                            },
                            {
                                icon: (
                                    <IconEdit
                                        onClick={() => {
                                            handleIsAddingOrEditing('employeeId', row.employee_id)
                                        }}
                                    />
                                ),
                                tooltip: 'Edit Car'
                            }, {
                                icon: (
                                    <IconTrash
                                        onClick={() => handleDelete(row)}
                                    />
                                ),
                                tooltip: 'Delete Car'
                            }
                        ]}
                        justify='center'
                    />
                )
            }
        }
    ]

    const LEFTBTNS =
        useMemo(() => [
            {
                icon: IconArrowLeft,
                label: 'Back',
                onClick: handleBackManageEmployee
            }
        ], [])
    const RIGHTBTNS =
        useMemo(() => [
            {
                icon: IconPlus,
                label: 'Add Employee',
                onClick: () => handleIsAddingOrEditing('employeeId')
            }
        ], [])

    if (employeeLoading) return <EzLoader h='calc(100vh -180px)'/>

    return (
        <GenericModal wrapperProps={{p: `0 .5rem ${isAddingOrEditing ? 4.25 : 2}rem 1rem`, flex: 1}}>
            <Group
                justify={isAddingOrEditing ? 'space-between' : 'flex-end'}
                gap={8}
                pr={8}
            >
                {isAddingOrEditing && <EzGroupBtn ITEMS={LEFTBTNS}/>}
                {!isAddingOrEditing && <EzGroupBtn ITEMS={RIGHTBTNS}/>}
            </Group>

            {isAddingOrEditing
                ? (
                    <AddEditEmployeeModal
                        modalId='manage-employee-modal'
                        handleRemoveDocument={(file) =>
                            handleRemoveDocument(file, 'manage-employee-modal')}
                    />
                )
                : (
                    <EzTable
                        height='calc(100vh - 160px)'
                        head={head}
                        data={employeeData}
                        tdMap={tdMap}
                        dataKey='employee_id'
                    />
                )
            }
        </GenericModal>
    );
}