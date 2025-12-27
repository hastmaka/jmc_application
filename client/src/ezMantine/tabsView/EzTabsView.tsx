import classes from './EzTabsView.module.scss'
import {Flex, rem, Tabs} from "@mantine/core";
import {IconSettings} from "@tabler/icons-react";
import {createElement, Suspense} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";
import type {Tab} from "@/types";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";

const iconStyle = {width: rem(12), height: rem(12)};

/**
 *
 * @param rootId
 * @param activeTab
 * @param setActiveTab
 * @param TABS
 * @param TABSPANEL
 * @returns {JSX.Element} - view to use in the tabs, ClientView, StaffView, etc...
 * @constructor
 */

type TabsViewProps = {
    rootId?: number,
    activeTab: string | Record<string, any>,
    setActiveTab: {
        (rootId: number, tab?: any): void;
        (value: any): void;
    },
    TABS: Tab[],
    TABSPANEL: Record<string, any>,
    orientation?: "horizontal",
}

export default function EzTabsView({
    rootId,
    activeTab,
    setActiveTab,
    TABS,
    TABSPANEL,
    orientation
}: TabsViewProps) {
    const value = rootId && typeof activeTab !== "string" ? activeTab[rootId] : activeTab
    return (
        <Flex flex={1} gap={16}>
            <Tabs
                flex={1}
                orientation={orientation ?? "vertical"}
                value={value}
                variant="pills"
                color="var(--mantine-primary-color-9)"
                onChange={(value) => {
                    if (rootId) {
                        setActiveTab(rootId, value)
                    } else {
                        setActiveTab(value);
                    }
                }}
                classNames={{
                    root: classes['tab-root'],
                    tab: classes['tab'],
                }}
            >
                <Tabs.List miw={190}>
                    {TABS.map((tab, index) => {
                        return (
                            <Tabs.Tab
                                value={tab.view}
                                key={index}
                                leftSection={<IconSettings style={iconStyle}/>}
                                styles={{
                                    tabLabel: {textAlign: 'left'}
                                }}
                            >
                                {tab.text}
                            </Tabs.Tab>
                        )
                    })}
                </Tabs.List>

                <Tabs.Panel
                    value={value}
                    style={{display: 'flex'}}
                >
                    <Flex flex={1}>
                        <Suspense fallback={<EzLoader h='calc(100vh - 200px)'/>}>
                            <EzScroll.NeedContainer>
                                {createElement(TABSPANEL[value])}
                            </EzScroll.NeedContainer>
                        </Suspense>
                    </Flex>
                </Tabs.Panel>
            </Tabs>
        </Flex>

    )
}
