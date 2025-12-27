import {useMemo} from 'react';
import GenericModal from "@/components/modal/GenericModal.tsx";
// import {ClientViewController} from "@/view/client/clientView/ClientViewController.ts";
import {IconEye, IconPencil, IconTrash} from "@tabler/icons-react";
import ActionIconsToolTipWithAccess from "@/ezMantine/actionIconTooltip/ActionIconsToolTip.tsx";

function EmployeeGridActions({cell}: {cell: any}) {
    const ITEMS = useMemo(() => [
        {
            icon: <IconPencil/>,
            tooltip: 'Edit',
            permission_name: 'employee_grid_edit',
        },
        {
            icon: <IconEye/>,
            tooltip: 'Status',
            permission_name: 'employee_grid_status',
        },
        {
            icon: <IconTrash
                onClick={() => {
                    // state.handleConfirm(cell.row.original[state.rowId])
                    window.openModal({
                        modalId: 'delete-employee',
                        title: 'Delete Employee',
                        size: 'sm',
                        children: (
                            <GenericModal
                                text='Your are about to delete this client. Are you sure?'
                                accept={async () => {
                                    const name = cell.row.original.client_first_name
                                    await window.toast.U({
                                        modalId: 'delete-employee',
                                        id: {
                                            title: `Deleting Employee`,
                                            message: 'Please wait...',
                                        },
                                        update: {
                                            success: `Employee ${name} was deleted successfully`,
                                            error: `Failed to delete client`
                                        },
                                        cb: () => {
                                            // ClientViewController.deleteClient(cell.row.original.client_id)
                                        }
                                    })
                                    window.closeModal('delete-employee')

                                }}
                                cancel={() => window.closeModal('delete-employee')}
                            />
                        ),
                        onClose: () => {}
                    });
                }}
            />,
            tooltip: 'Delete',
            permission_name: 'employee_grid_delete',
        }
    ], [])
    return (
        <ActionIconsToolTipWithAccess ITEMS={ITEMS}/>
    )
}

export default EmployeeGridActions;