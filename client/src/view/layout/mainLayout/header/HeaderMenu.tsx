import {useMemo} from 'react';
import {IconBell, IconCirclePlus, IconHelp, IconMessages, IconSettings}
    from "@tabler/icons-react";
import ThemeButton from "@/theme/ThemeButton.tsx";
import {ThemeController}
    from "@/theme/ThemeController.ts";
import SettingsMenuWithAccess
    from "@/view/layout/mainLayout/header/_menu/SettingsMenu.tsx";
import {companySettings} from "@/static";
import ActionIconsToolTipWithAccess, {type ActionIconItem}
    from "@/ezMantine/actionIconTooltip/ActionIconsToolTip.tsx";
import Notification from "@/view/notification/Notification.tsx";
import {NotificationController} from "@/view/notification/NotificationController.ts";
import {Group} from "@mantine/core";
// import {FetchApi} from "@/api/FetchApi.ts";

function HeaderMenu() {
    const {notiTotal} = NotificationController

    const ITEMS: ActionIconItem[] =
        useMemo(() => [
            {
                permission: 20,
                icon: <IconCirclePlus/>,
            }, {
                icon: <IconHelp/>,
            }, {
                icon: <IconMessages/>,
                tooltip: 'Messages',
                indicator: {
                    label: '2'
                }
            }, {
                // permission: 21,
                icon: <Notification target={<IconBell/>}/>,
                ...(notiTotal > 0 && {
                    indicator: {
                        label: notiTotal
                    }
                })
            }, {
                // permission: null,
                icon: <SettingsMenuWithAccess
                    target={<IconSettings/>}
                    ITEMS={companySettings}
                    onItemClick={(item: any) => {
                        window.navigate(`app/${item.path}`)
                    }}
                />,
                withMenu: true,
            }, {
                permission: 999,
                icon: <ThemeButton withActionIcon={false}/>,
                onClick: () => ThemeController.toggleTheme(false),
            }
        ], [notiTotal])

    return (
        <Group>
            <ActionIconsToolTipWithAccess
                ITEMS={ITEMS}
                gap={16}
                size={28}
            />
        </Group>
    );
}

export default HeaderMenu;