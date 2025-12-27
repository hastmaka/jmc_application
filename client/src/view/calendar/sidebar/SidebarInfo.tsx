import { Stack, Text } from "@mantine/core";

export default function SidebarInfo() {
    return (
        <Stack>
            <Text fw="700" size="1rem">
                Clients:
            </Text>
            <Text c="dimmed" pl={15} size="sm">
                All Clients
            </Text>

            <Text fw="700" size="1rem">
                Providers:
            </Text>
            <Text c="dimmed" pl={15} size="sm">
                All Providers
            </Text>

            <Text fw="700" size="1rem">
                Status:
            </Text>
            <Text c="dimmed" pl={15} size="sm">
                All Statuses
            </Text>

            <Text fw="700" size="1rem">
                Services:
            </Text>
            <Text c="dimmed" pl={15} size="sm">
                All Services
            </Text>
        </Stack>
    );
}