import ToolBar from "@/ezMantine/mantineDataGrid/toolbar/ToolBar.tsx";
import {Group} from "@mantine/core";
import EzSearchInput from "@/ezMantine/searchInput/EzSearchInput.tsx";
import {/*lazy,*/ Suspense, useMemo} from "react";
import {IconCirclePlus} from "@tabler/icons-react";
import EzGroupBtn from "@/ezMantine/buttonGroup/EzGroupBtn.tsx";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
// dynamic import
// const AddEditClientModal = lazy(() => import('./_modal/AddEditClientModal'))

export default function RoleGridToolbar({
    state
}: {
    state: any;
}) {
    function handleAddRole(){
        window.openModal({
            modalId: "add-role-modal",
            title: "Add Client",
            children: (
                <Suspense fallback={<EzLoader h={400}/>}>
                    {/*<AddEditClientModal/>*/}
                </Suspense>
            ),
            onClose: () => {}
        })
    }

    const ACTIONBTNS = useMemo(() => [
        {
            icon: IconCirclePlus,
            label: 'Add Role',
            onClick: handleAddRole
        }
    ], [])

    return (
        <ToolBar>
            <Group justify='space-between' flex={1}>
                <EzSearchInput state={state} name='search'/>
                <EzGroupBtn ITEMS={ACTIONBTNS}/>
            </Group>
        </ToolBar>
    )
}