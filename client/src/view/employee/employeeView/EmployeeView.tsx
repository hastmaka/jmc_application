import {lazy} from "react";
import {EmployeeViewController} from "./EmployeeViewController.ts";
import EzTabsView from "@/ezMantine/tabsView/EzTabsView.tsx";
// dynamic
const EmployeeInfo =
    lazy(() => import('./info/./EmployeeInfo'))
const EmployeeDocument =
    lazy(() => import('./document/EmployeeDocument.tsx'))

const TABS = [
    {
        text: 'Info',
        view: 'employee-info',
    },
    {
        text: 'Document',
        view: 'employee-document',
    }
]

const TABSPANEL = {
    'employee-info': EmployeeInfo,
    'employee-document': EmployeeDocument,
}

export default function EmployeeView() {
    const {employeeId, activeTab, setActiveTab} = EmployeeViewController
    return (
        <EzTabsView
            rootId={employeeId}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            TABS={TABS}
            TABSPANEL={TABSPANEL}
        />
    )
}
