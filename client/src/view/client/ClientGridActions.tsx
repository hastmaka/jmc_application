import {useMemo} from 'react';
import GenericModal from "@/components/modal/GenericModal.tsx";
import {ClientViewController} from "@/view/client/clientView/ClientViewController.ts";
import {IconEye, IconPencil, IconTrash} from "@tabler/icons-react";
import ActionIconsToolTipWithAccess from "@/ezMantine/actionIconTooltip/ActionIconsToolTip.tsx";
import {ClientController} from "@/view/client/ClientController.ts";

function ClientGridActions({/*state*/ row}: {state: any, row: any}) {
    function handleEditClient(){
        ClientController.setParentTabsList(row).then()
    }
    function handleRemoveClient(){
        window.openModal({
            modalId: 'delete-client',
            title: 'Delete Client',
            size: 'sm',
            children: (
                <GenericModal
                    text='Your are about to delete this client. Are you sure?'
                    accept={async () => {
                        const name = row.client_first_name
                        await window.toast.U({
                            modalId: 'delete-client',
                            id: {
                                title: `Deleting Client`,
                                message: 'Please wait...',
                            },
                            update: {
                                success: `Client ${name} successfully`,
                                error: `Failed to delete client`
                            },
                            cb: () => ClientViewController.deleteClient(row.client_id)
                        })
                        window.closeModal('delete-client')

                    }}
                    cancel={() => window.closeModal('delete-client')}
                />
            ),
            onClose: () => {}
        });
    }

    const ITEMS = useMemo(() => [
        {
            icon: <IconPencil onClick={handleEditClient}/>,
            tooltip: 'Edit',
            permission: 4,
        },
        {
            icon: <IconEye/>,
            tooltip: 'Status',
            permission: 4,
        },
        {
            icon: <IconTrash onClick={handleRemoveClient}/>,
            tooltip: 'Delete',
            permission: 5,
        }
    ], [])
    return (
        <ActionIconsToolTipWithAccess ITEMS={ITEMS}/>
    )
}

export default ClientGridActions;