import {lazy, Suspense, useMemo} from 'react';
import {IconCopy, IconKey, IconPencil} from "@tabler/icons-react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import _ from "lodash";
import {ActionIconsToolTip} from "@/ezMantine/actionIconTooltip/ActionIconsToolTip.tsx";
import {RoleModalController} from "./_modal/RoleModalController.ts";
// dynamic imports
const RolePermissionModal =
    lazy(() => import('./_modal/RolePermissionModal.tsx'))

function RoleGridActions({/*state,*/ row}: { state: any, row: any }) {

    function handleEditClient() {
        // ClientController.setParentTabsList(row).then()
    }

    async function handleRolePermission() {
        window.openModal({
            modalId: 'user-permission-modal',
            title: `Role Permissions ${_.startCase(row.role_name)}`,
            size: '80%',
            children: (
                <Suspense fallback={<EzLoader h={300}/>}>
                    <RolePermissionModal roleId={row.role_id}/>
                </Suspense>
            ),
            onClose: RoleModalController.resetState
        })
    }

    const ITEMS = useMemo(() => [
        {
            icon: <IconKey onClick={handleRolePermission}/>,
            tooltip: 'Edit Permission',
            permission_name: 'client_grid_permission',
        },
        {
            icon: <IconCopy onClick={handleRolePermission}/>,
            tooltip: 'Clone Role',
            permission_name: 'client_grid_clone',
        },
        {
            icon: <IconPencil onClick={handleEditClient}/>,
            tooltip: 'Edit',
            permission_name: 'client_grid_edit',
        }
    ], [])
    return (
        <ActionIconsToolTip ITEMS={ITEMS}/>
    )
}

export default RoleGridActions;