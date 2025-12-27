import {ActionIcon, Group, Stack} from "@mantine/core";
import {IconExternalLink, IconFile, IconTrash} from "@tabler/icons-react";
import EzText from "@/ezMantine/text/EzText.tsx";
import u from "@/util";

export default function ExistingDocumentStack({
    document,
    handleRemoveDocument
}: {
    document: Record<string, any>[],
    handleRemoveDocument: (doc: any) => void
}) {

    return (
        <Stack gap="xs">
            {document.map((doc: any, index: number) => (
                <Group
                    key={`existing_${index}`}
                    justify="space-between"
                    p="xs"
                    style={{
                        border: '1px solid var(--mantine-color-default-border)',
                        borderRadius: 'var(--mantine-radius-sm)'
                    }}
                >
                    <Group gap="xs" style={{flex: 1}}>
                        <IconFile size={20} color="var(--mantine-color-blue-6)"/>
                        <EzText>{doc?.document_name || 'No Name'}</EzText> -
                        <EzText>{doc?.document_type_option?.asset_option_name || ''}</EzText>
                    </Group>
                    <Group gap="xs">
                        <ActionIcon
                            color="blue"
                            variant="subtle"
                            onClick={() => u.openDocumentOnBrowser(doc.document_url, doc.document_name)}
                        >
                            <IconExternalLink size={16}/>
                        </ActionIcon>
                        <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => handleRemoveDocument(doc)}
                        >
                            <IconTrash size={16}/>
                        </ActionIcon>
                    </Group>
                </Group>
            ))}
        </Stack>
    );
}