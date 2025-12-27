import {createElement, lazy, Suspense, useMemo, useState} from "react";
import EzGroupBtn from "@/ezMantine/buttonGroup/EzGroupBtn.jsx";
import {Stack, Text} from "@mantine/core";
import {
    IconUser,
    IconInfoHexagon,
    IconTrendingUp,
    IconHeart,
} from "@tabler/icons-react";
import SidebarDate from "@/view/calendar/sidebar/SidebarDate.tsx";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";

// dynamic imports
const TABS = {
    info: lazy(() => import("./SidebarInfo.tsx")),
    stats: lazy(() => import("./SidebarStats.tsx")),
    providers: lazy(() => import("./SidebarProviders.tsx")),
    clients: lazy(() => import("./SidebarClients.tsx")),
} as const;

type ViewKey = keyof typeof TABS;

export default function Sidebar() {
    const [view, setView] = useState<ViewKey>("info");

    const handleViewChange = (newView: ViewKey) => {
        setView(newView);
    };

    const BUTTONS = useMemo(() => [
        {
            icon: IconInfoHexagon,
            onClick: function () {
                handleViewChange("info")
            },
            variant: view === "info" ? "filled" : "default",
            ['data-active']: view === "info",
        },
        {
            icon: IconTrendingUp,
            onClick: function () {
                handleViewChange("stats")
            },
            variant: view === "stats" ? "filled" : "default",
            ['data-active']: view === "stats",
        },
        {
            icon: IconUser,
            onClick: function () {
                handleViewChange("providers")
            },
            variant: view === "providers" ? "filled" : "default",
            ['data-active']: view === "providers",
        },
        {
            icon: IconHeart,
            onClick: function () {
                handleViewChange("clients")
            },
            variant: view === "clients" ? "filled" : "default",
            ['data-active']: view === "clients",
        },
    ], [view] as const)

    return (
        <Stack pt={2}>
            <SidebarDate/>

            <EzScroll h="calc(100vh - 370px)">
                <Stack>
                    <EzGroupBtn ITEMS={BUTTONS}/>

                    <Suspense fallback={<Text>Loading...</Text>}>
                        {createElement(TABS[view])}
                    </Suspense>
                </Stack>
            </EzScroll>
        </Stack>
    );
}