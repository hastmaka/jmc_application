import {lazy} from "react";
import {ClientViewController} from "./ClientViewController.ts";
import EzTabsView from "@/ezMantine/tabsView/EzTabsView.tsx";
//dynamic
const Info =
    lazy(() => import("./info/./ClientInfo"));
const Document =
    lazy(() => import("./document/Document"));
const SkillsAndBehavior =
    lazy(() => import("./skillsAndBehavior/SkillsAndBehavior.jsx"));
// const Intervention = lazy(() => import("./intervention/Intervention.jsx"));
// const Competence = lazy(() => import("./competence/Competence.jsx"));
// const Approval = lazy(() => import("./approval/Approval.jsx"));
// const HealthcareProvider = lazy(() => import("./healthcareProvider/HealthcareProvider.jsx"));
// const Diagnosis = lazy(() => import("./diagnosis/Diagnosis.jsx"));
// const Medication = lazy(() => import("./medication/Medication.jsx"));
// const Preference = lazy(() => import("./preference/Preference.jsx"));
// const Abc = lazy(() => import("./abc/Abc.jsx"));
// const Restriction = lazy(() => import("./restriction/Restriction.jsx"));
// const SchedulingLimit = lazy(() => import("./schedulingLimit/SchedulingLimit.jsx"));
// const PersonalSetting = lazy(() => import("./personalSetting/PersonalSetting.jsx"));

const TABS = [
    {
        text: 'Info',
        view: 'client-info',
    }, {
        text: 'Documents',
        view: 'client-document'
    }, {
        text: 'Skills & Behaviors',
        view: 'client-skill'
    }, /*{
        text: 'Interventions',
        view: 'client-interventions'
    }, {
        text: 'Competences',
        view: 'client-competences',
    }, {
        text: 'Approvals',
        view: 'client-approval'
    }, {
        text: 'Healthcare Providers',
        view: 'client-healthcare-provider'
    }, {
        text: 'Diagnosis',
        view: 'client-diagnosis'
    }, {
        text: 'Medications',
        view: 'client-medication'
    }, {
        text: 'Preferences',
        view: 'client-preference'
    }, {
        text: 'ABC',
        view: 'client-abc'
    }, {
        text: 'Restrictions',
        view: 'client-restriction'
    }, {
        text: 'Scheduling Limits',
        view: 'client-scheduling-limit'
    }, {
        text: 'Personal Settings',
        view: 'client-personal-setting'
    }*/
]

const TABSPANEL = {
    'client-info': Info,
    'client-document': Document,
    'client-skill': SkillsAndBehavior,
    // 'client-interventions': Intervention,
    // 'client-competences': Competence,
    // 'client-approval': Approval,
    // 'client-healthcare-provider': HealthcareProvider,
    // 'client-diagnosis': Diagnosis,
    // 'client-medication': Medication,
    // 'client-preference': Preference,
    // 'client-abc': Abc,
    // 'client-restriction': Restriction,
    // 'client-scheduling-limit': SchedulingLimit,
    // 'client-personal-setting': PersonalSetting
}

export default function ClientView() {
    const {clientId, activeTab, setActiveTab} = ClientViewController

    return (
        <EzTabsView
            rootId={clientId}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            TABS={TABS}
            TABSPANEL={TABSPANEL}
        />
    )
}
