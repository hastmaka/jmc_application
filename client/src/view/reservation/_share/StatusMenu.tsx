import {Menu} from "@mantine/core";
import EzButton from "@/ezMantine/button/EzButton.tsx";
import {IconMenu} from "@tabler/icons-react";

export default function StatusMenu() {
    return (
        <Menu>
            <Menu.Target>
                <EzButton leftSection={<IconMenu/>}>Status: Pending</EzButton>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item>Pending</Menu.Item>
                <Menu.Item>Confirm</Menu.Item>
                <Menu.Item>Completed</Menu.Item>
                <Menu.Item>Cancelled</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}