import {lazy} from "react";
import type {ModuleDefinition} from "@/types";
import {
    IconDashboard,
    IconBook, IconTestPipe, IconDatabaseSearch, IconDownload /*, IconTestPipe,IconCompass, IconUsers*/
} from "@tabler/icons-react";

export const moduleDefinitions: ModuleDefinition[] = [
    // {
    //     path: 'admin',
    //     label: 'Administration',
    //     icon: IconTool,
    //     // component: CompanySettings,
    //     permission: 13,
    // },
    {
        path: 'dashboard',
        label: 'Dashboard',
        icon: IconDashboard,
        component: lazy(() => import("@/view/dashboard/Dashboard.tsx")),
        permission: 1,
    },
    {
        path: 'reservation',
        label: 'Reservation',
        icon: IconBook,
        component: lazy(() => import('@/view/reservation/Reservation.tsx')),
        permission: 2,
    },
    {
        path: 'download',
        label: 'Download',
        icon: IconDownload,
        component: lazy(() => import('@/view/download/Download.tsx')),
        permission: 1,
    },
    // {
    //     path: 'admin',
    //     label: 'Admin',
    //     icon: IconTool,
    //     // component: lazy(() => import("@/view/myagency/MyAgency.tsx")),
    //     permission: 17,
    //     children: [{
    //         path: 'settings',
    //         label: 'Settings',
    //         icon: IconSettings,
    //         component: lazy(() => import("@/view/myagency/MyAgency.tsx")),
    //         permission: 14,
    //     }, {
    //         path: 'users',
    //         label: 'Users',
    //         icon: IconSettings,
    //         component: lazy(() =>
    //             import("@/view/myagency/user/User.tsx")),
    //         permission: 14,
    //     },{
    //         path: 'roles',
    //         label: 'Roles',
    //         icon: IconSettings,
    //         component: lazy(() =>
    //             import("@/view/myagency/role/Role.tsx")),
    //         permission: 16,
    //     }]
    // },

    // {
    //     path: 'calendar',
    //     label: 'Calendar',
    //     icon: IconGauge,
    //     component: lazy(() => import("@/view/calendar/CalendarView.tsx")),
    //     permission: 9
    // },
    // {
    //     path: 'clients',
    //     label: 'Clients',
    //     icon: IconUsers,
    //     component: lazy(() => import("@/view/client/Client.tsx")),
    //     permission: 2,
    // },
    // {
    //     path: 'employees',
    //     label: 'Employees',
    //     icon: IconUsers,
    //     component: lazy(() => import("@/view/employee/Employee.tsx")),
    //     permission: 19,
    // },
    {
        path: 'test',
        label: 'Test',
        icon: IconTestPipe,
        permission: 20,
        children: [{
            path: 'test1',
            label: 'Test1',
            icon: IconTestPipe,
            component: lazy(() => import("@/view/test/A.tsx")),
            permission: 20,
        },{
            path: 'test2',
            label: 'Test2',
            icon: IconTestPipe,
            component: lazy(() => import("@/view/test/Test.tsx")),
            permission: 20,
        }]
    },
    {
        path: 'assets',
        label: 'Assets',
        icon: IconDatabaseSearch,
        component: lazy(() => import('@/view/asset/Asset.tsx')),
        permission: 20,
    },
    // {
    //     path: 'company',
    //     label: 'Company',
    //     icon: IconCompass,
    //     // component: CompanySettings,
    //     permission: 'module_company',
    //     children: [{
    //         path: 'settings',
    //         label: 'Settings',
    //         icon: IconSettings,
    //         component: lazy(() => import("@/view/company/CompanySettings.tsx")),
    //         permission: 'company_settings',
    //     }]
    // }
];