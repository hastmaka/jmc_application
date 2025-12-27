import {useCounter} from "@mantine/hooks";
import EzCard from "@/ezMantine/card/EzCard.tsx";
import EzCardHeader from "@/ezMantine/card/EzCardHeader.tsx";
import {ActionIcon, Flex} from "@mantine/core";
import {IconChevronDown, IconChevronUp} from "@tabler/icons-react";

const size = '4rem'

function DataCollectionCard({
    initialValue,
    name
}: {
    initialValue: number,
    name: string
}) {
    const [value, { increment, decrement }] = useCounter(initialValue, { min: 0 });
    return (
        <EzCard
            // title='Test'
            customHeader={(
                <EzCardHeader title='title'>
                    <span>{name}</span>
                </EzCardHeader>
            )}
        >
            <Flex justify='center'>
                <ActionIcon.Group>
                    <ActionIcon variant="default" size={size} radius="md" onClick={decrement}>
                        <IconChevronDown size={size} color="var(--mantine-color-red-text)" />
                    </ActionIcon>
                    <ActionIcon.GroupSection
                        variant='default'
                        size={size}
                        bg="var(--mantine-color-body)"
                        miw={60}
                        style={{userSelect: 'none'}}
                    >
                        {value ?? 'N/A'}
                    </ActionIcon.GroupSection>
                    <ActionIcon variant="default" size={size} radius="md" onClick={increment}>
                        <IconChevronUp size={size} color="var(--mantine-color-teal-text)" />
                    </ActionIcon>
                </ActionIcon.Group>
            </Flex>
        </EzCard>
    );
}

export default DataCollectionCard;