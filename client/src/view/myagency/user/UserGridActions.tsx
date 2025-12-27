import {lazy, Suspense, useMemo} from 'react';
import GenericModal from "@/components/modal/GenericModal.tsx";
import {IconKey, IconPencil, IconPower, IconTrash} from "@tabler/icons-react";
import ActionIconsToolTipWithAccess from "@/ezMantine/actionIconTooltip/ActionIconsToolTip.tsx";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
// dynamic import
const UserPermissionModal = lazy(() =>
    import('./_modal/UserPermissionModal.tsx'))
const AddEditUserModal = lazy(() => import('./_modal/AddEditUserModal.tsx'))

function UserGridActions({row}: {row: any}) {

    function handleEdit() {
        window.openModal({
            modalId: "edit-user-modal",
            title: "Edit User",
            size: 'md',
            children: (
                <Suspense>
                    <AddEditUserModal id={row.client_id} from='edit-user-modal'/>
                </Suspense>
            ),
            onClose: () => {}
        })
    }

    function handlePermission () {
        window.openModal({
            modalId: 'user-permission-modal',
            title: 'User Permissions',
            size: '80%',
            children: (
                <Suspense fallback={<EzLoader h={300}/>}>
                    <UserPermissionModal userId={row.client_id}/>
                </Suspense>
            ),
            onClose: () => {}
        })
    }

    function handleDelete () {
        window.openModal({
            modalId: 'delete-client-modal',
            title: 'Delete User',
            size: 'sm',
            children: (
                <GenericModal
                    text='Your are about to delete this user. Are you sure?'
                    accept={async () => {
                        const name = row.client_first_name
                        await window.toast.U({
                            modalId: 'delete-client-modal',
                            id: {
                                title: `Deleting User`,
                                message: 'Please wait...',
                            },
                            update: {
                                success: `User ${name} successfully deleted.`,
                                error: `Failed to delete user.`
                            },
                            cb: () => {
                                // ClientViewController.deleteClient(cell.row.original.client_id)
                            }
                        })
                        window.closeModal('delete-client-modal')

                    }}
                    cancel={() => window.closeModal('delete-client-modal')}
                />
            ),
            onClose: () => {}
        });
    }

    const ITEMS = useMemo(() => [
        {
            icon: <IconPencil onClick={handleEdit}/>,
            tooltip: 'Edit',
            permission_name: 'client_grid_edit',
        },
        {
            icon: <IconKey onClick={handlePermission}/>,
            tooltip: 'Permission',
            permission_name: 'client_grid_status',
        },
        {
            icon: <IconPower/>,
            tooltip: 'Disabled',
            permission_name: 'client_grid_status',
            // disabled: true,
            color: 'red'
        },
        {
            icon: <IconTrash onClick={handleDelete}/>,
            tooltip: 'Delete',
            permission_name: 'client_grid_delete',
        }
    ], [])
    return (
        <ActionIconsToolTipWithAccess ITEMS={ITEMS}/>
    )
}

export default UserGridActions;