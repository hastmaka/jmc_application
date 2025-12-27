import { Flex, Stack, Text } from "@mantine/core";

export default function SidebarStats() {
    return (
        <Stack>
            <Text fw="700" size="1rem">
                Status:
            </Text>
            <Flex>
                <Text fw="700" pl={15} size="sm">
                    In Progress:{" "}
                </Text>
                <Text pl={15} size="sm">
                    9
                </Text>
            </Flex>

            <Flex>
                <Text fw="700" pl={15} size="sm">
                    Reviewing:{" "}
                </Text>
                <Text pl={15} size="sm">
                    1
                </Text>
            </Flex>

            <Flex>
                <Text fw="700" pl={15} size="sm">
                    Completed:{" "}
                </Text>
                <Text pl={15} size="sm">
                    13
                </Text>
            </Flex>

            <Text fw="700" size="1rem">
                Visits:
            </Text>
            <Stack pl={15}>
                <Text fw="700" size="sm">
                    Behavior Treatment:{" "}
                </Text>
                <Text size="sm">13 (210 units / 52.5 hours)</Text>
            </Stack>
            <Stack pl={15}>
                <Text fw="700" size="sm">
                    Family Training:{" "}
                </Text>
                <Text size="sm">1 (8 units / 2 hours)</Text>
            </Stack>
            <Stack pl={15}>
                <Text fw="700" size="sm">
                    Supervision:{" "}
                </Text>
                <Text size="sm">3 (6 hours)</Text>
            </Stack>
            <Stack pl={15}>
                <Text fw="700" size="sm">
                    Assessment Observation:
                </Text>
                <Text size="sm">3 (48 units / 12 hours)</Text>
            </Stack>
        </Stack>
    );
}