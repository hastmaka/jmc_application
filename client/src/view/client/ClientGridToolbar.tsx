import ToolBar from "@/ezMantine/mantineDataGrid/toolbar/ToolBar.tsx";
import {Group} from "@mantine/core";
import EzSearchInput from "@/ezMantine/searchInput/EzSearchInput.tsx";
import {lazy, Suspense, useMemo} from "react";
import {IconCirclePlus, IconInfoCircle} from "@tabler/icons-react";
import EzGroupBtn from "@/ezMantine/buttonGroup/EzGroupBtn.tsx";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
// dynamic import
const AddEditClientModal = lazy(() => import('./_modal/AddEditClientModal'))

export default function ClientGridToolBar({
    state
}: {
    state: any;
}) {
    function handleAddClient(){
        window.openModal({
            modalId: "add-client-modal",
            title: "Add Client",
            children: (
                <Suspense fallback={<EzLoader h={400}/>}>
                    <AddEditClientModal/>
                </Suspense>
            ),
            onClose: () => {}
        })
    }

    const ACTIONBTNS = useMemo(() => [
        {
            icon: IconCirclePlus,
            label: 'Add Client',
            onClick: handleAddClient
        },
        {
            icon: IconInfoCircle,
            label: 'pancho', //'Info Client',
            onClick: () => {}
        },
        {
            icon: IconCirclePlus,
            label: 'pancho', //'Add Client',
            onClick: () => {}
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