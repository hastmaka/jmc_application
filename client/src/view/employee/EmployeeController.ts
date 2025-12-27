import {SignalTabClass} from "@/signals/signalTabClass/SignalTabClass.ts";
import {getModel} from "@/api/models";
import {getFromSessionStore, updateSessionStore} from "@/util";
import {effect} from "@preact/signals-react";
import {EmployeeViewController} from "@/view/employee/employeeView/EmployeeViewController.ts";
import {EmployeeInfoController} from "@/view/employee/employeeView/info/EmployeeInfoController.ts";

if (!getFromSessionStore('employeeTempTabs')) updateSessionStore('employeeTempTabs', [])
if (!getFromSessionStore('employeeActiveTabs')) updateSessionStore('employeeActiveTabs', 'grid')

export const EmployeeController = new SignalTabClass({
    keyId: 'employee_id',
    label: 'employee_full_name',
    model: getModel('employee'),
    //parent
    activeParentTab: getFromSessionStore('employeeActiveTabs'),
    parentTabsList: [{label: "Employee List",value: "grid"}],
    tempParentTabsList: getFromSessionStore('employeeTempTabs') || [],
    //list of controller to update recordId when dblclick on a client
    childController: [
        EmployeeInfoController
    ],
    //updating child tabs
    childTabController: EmployeeViewController,
    reference: {
        tempTab: 'employeeTempTabs', activeTab: 'employeeActiveTabs'
    }
}).signal

effect(() => {
    /**
     * Detect if the page was reloaded and update the tabs accordingly
     */
    const navigationEntries = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navigationEntries[0]?.type === 'reload') {
        EmployeeController.wasReloaded = true;
    }
})