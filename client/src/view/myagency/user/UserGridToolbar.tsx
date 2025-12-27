import ToolBar from "@/ezMantine/mantineDataGrid/toolbar/ToolBar.tsx";
import {Group} from "@mantine/core";
import EzSearchInput from "@/ezMantine/searchInput/EzSearchInput.tsx";
import EzGroupBtn from "@/ezMantine/buttonGroup/EzGroupBtn.tsx";
import {lazy, Suspense, useMemo} from "react";
import {IconCirclePlus} from "@tabler/icons-react";
// dynamic imports
const AddEditUserModal = lazy(() => import('./_modal/AddEditUserModal.tsx'))

export default function UserGridToolbar({
    state
}: {
    state: any;
}) {
    function handleAddUser(){
        window.openModal({
            modalId: "add-user-modal",
            title: "Add User",
            size: 'md',
            children: (
                <Suspense>
                    <AddEditUserModal from="add-user-modal"/>
                </Suspense>
            ),
            onClose: () => {}
        })
    }

    const ACTIONBTNS = useMemo(() => [
        {
            icon: IconCirclePlus,
            label: 'Add User',
            onClick: handleAddUser
        }
    ], [])

    return (
        <ToolBar>
            <Group justify="space-between" w='100%'>
                <EzSearchInput state={state} name='search'/>
                <EzGroupBtn ITEMS={ACTIONBTNS}/>
            </Group>
        </ToolBar>
    )
}