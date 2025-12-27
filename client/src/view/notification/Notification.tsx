import {ActionIcon, Divider, Menu, Stack} from "@mantine/core";
import {IconActivity, IconCircleFilled} from "@tabler/icons-react";
import EzText from "@/ezMantine/text/EzText.tsx";
import {Fragment, useLayoutEffect} from "react";
import {NotificationController} from "@/view/notification/NotificationController.ts";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import type {NotificationProps} from "@/types";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";

function Notification({target}: {target: any}) {
    const {
        notificationGetData,
        notificationData,
        notificationLoading
    } = NotificationController

    useLayoutEffect(() => {
        if (notificationLoading) {
            notificationGetData().then()
            // console.log('notification getData', notificationData)
        }
    }, []);

    function render() {
        if (notificationLoading) return <EzLoader h={300}/>

        // const leftIconMap = {
        //     important: "important",
        // }

        return notificationData.map((item: NotificationProps, index: any) => (
            <Fragment key={item.notification_id}>
                <Menu.Item
                    leftSection={<IconActivity size={14} />}
                >
                    <Stack pos='relative' gap={8}>
                        <EzText>{item.notification_title}</EzText>
                        <EzText>{item.notification_message}</EzText>
                        <IconCircleFilled
                            size={14}
                            color='var(--mantine-color-red-6)'
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                            }}
                        />
                    </Stack>
                </Menu.Item>
                {index < notificationData.length - 1 && <Divider />}
            </Fragment>
        ))
    }

    return (
        <Menu withArrow position='bottom-end' width={400} shadow='sm'>
            <Menu.Target>
                <ActionIcon variant='subtle' size={26} component='a'>{target}</ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <EzScroll mah={600}>
                    {render()}
                </EzScroll>
            </Menu.Dropdown>
        </Menu>
    );
}

export default Notification;