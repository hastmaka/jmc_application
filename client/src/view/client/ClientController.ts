import {SignalTabClass} from "@/signals/signalTabClass/SignalTabClass.ts";
import {getModel} from "@/api/models";
import {getFromSessionStore, updateSessionStore} from "@/util";
import {ClientViewController} from "./clientView/ClientViewController.ts";
import {effect} from "@preact/signals-react";
import {ClientInfoController} from "@/view/client/clientView/info/ClientInfoController.tsx";

if (!getFromSessionStore('clientTempTabs')) updateSessionStore('clientTempTabs', [])
if (!getFromSessionStore('clientActiveTabs')) updateSessionStore('clientActiveTabs', 'grid')

/****
 * ClientController manages the client-related tabs within the application.
 * It is responsible for handling the state and behavior of client tabs,
 * including their creation, activation, and persistence across page reloads.
 *
 * Configuration keys:
 * - keyId: The unique identifier key for each client record.
 * - label: The display label for client tabs.
 * - model: The data model associated with clients.
 * - activeParentTab: The currently active parent tab, synchronized with session storage.
 * - parentTabsList: The list of static parent tabs available.
 * - tempParentTabsList: The list of temporary tabs stored in session storage.
 * - childController: An array of child controllers that react to client tab changes.
 * - childTabController: Controller responsible for managing child tabs within the client view.
 * - reference: Keys used for session storage synchronization of temporary and active tabs.
 *
 * This controller ensures synchronization of tab state with session storage,
 * manages child controllers for client-related views, and detects page reloads
 * to maintain consistent UI state.
 ****/


export const ClientController = new SignalTabClass({
    keyId: 'client_id',
    label: 'client_full_name',
    model: getModel('client'),
    //parent
    activeParentTab: getFromSessionStore('clientActiveTabs'),
    parentTabsList: [{label: "Client List",value: "grid"}],
    tempParentTabsList: getFromSessionStore('clientTempTabs') || [],
    //list of children controller to update recordId when dblclick on client
    childController: [
        ClientInfoController
    ],
    //updating child tabs
    childTabController: ClientViewController,
    reference: {
        tempTab: 'clientTempTabs', activeTab: 'clientActiveTabs'
    }
}).signal

effect(() => {
    /**
     * Detect if the page was reloaded and update the tabs accordingly
     */
    const navigationEntries = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navigationEntries[0]?.type === 'reload') {
        ClientController.wasReloaded = true;
    }
})