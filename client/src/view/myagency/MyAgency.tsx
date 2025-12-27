import EzTabsView from "@/ezMantine/tabsView/EzTabsView.tsx";
import {MyAgencyController} from "./MyAgencyController.ts";
import {lazy} from "react";

const TABS = [
    {
        text: 'Appointment Settings',
        view: 'agency-appointment-setting',
    },
    {
        text: 'Employees',
        view: 'agency-employee',
    }
]

const TABSPANEL = {
    'agency-appointment-setting':
        lazy(() => import('./setting/AgencySetting.tsx')),
    'agency-employee':
        lazy(() => import('./employee/AgencyEmployee.tsx'))
}

function MyAgency() {
    const {activeTab, setActiveTab} = MyAgencyController
    return (
        <EzTabsView
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            TABS={TABS}
            TABSPANEL={TABSPANEL}
        />
    )
}

export default MyAgency;