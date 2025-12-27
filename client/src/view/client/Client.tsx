import EzTabs from "@/ezMantine/tabs/EzTabs.tsx";
import {ClientController} from "./ClientController.ts";
import {lazy, useMemo} from "react";
import {IconCirclePlus, IconNotes, IconRefresh} from "@tabler/icons-react";

function Client() {
    const {activeParentTab, openDrawer, handleReload} = ClientController;

    const ACTIONBTNS =
        useMemo(() => [
            ...(activeParentTab !== 'grid' ? [
                {
                    icon: IconCirclePlus,
                    label: 'Add Test',
                    onClick: () => {},
                },
                {
                    label: 'See Notes',
                    icon: IconNotes,
                    onClick: openDrawer,
                }
            ] : []),
            {
                label: 'pancho', //'Reload',
                icon: IconRefresh,
                onClick: handleReload
            },
        ], [activeParentTab])


    return (
        <EzTabs
            signal={ClientController}
            Grid={lazy(() =>
                import('./ClientsGrid.tsx'))}
            View={lazy(() =>
                import('@/view/client/clientView/ClientView.tsx'))}
            actionBtns={ACTIONBTNS}
        />
    );
}

export default Client;