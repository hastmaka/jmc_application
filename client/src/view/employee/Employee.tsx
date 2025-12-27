import {EmployeeController} from "./EmployeeController.ts";
import {lazy, useMemo} from "react";
import {IconCirclePlus, IconNotes, IconRefresh} from "@tabler/icons-react";
import EzTabs from "@/ezMantine/tabs/EzTabs.tsx";

function Employee() {
    const {activeParentTab, openDrawer, handleReload} = EmployeeController;

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
                label: 'Reload',
                icon: IconRefresh,
                onClick: handleReload
            },
        ], [activeParentTab])

    return (
        <EzTabs
            signal={EmployeeController}
            Grid={lazy(() => import('./EmployeeGrid.tsx'))}
            View={lazy(() => import('./employeeView/EmployeeView.tsx'))}
            actionBtns={ACTIONBTNS}
        />
    );
}

export default Employee;