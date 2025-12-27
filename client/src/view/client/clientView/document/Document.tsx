import classes from './Document.module.scss';
import { Center, Flex, Group, Stack, Tree } from '@mantine/core';
import { IconChevronDown, IconFolderSearch } from "@tabler/icons-react";
import { lazy, Suspense } from "react";
import { DocumentController } from "./DocumentController";
import EzLoader from "@/ezMantine/loader/EzLoader.js";
import EzText from "@/ezMantine/text/EzText.js";
import EzCard from "@/ezMantine/card/EzCard.tsx";
// dynamic import
const AddDocumentModal = lazy(() => import('./_modal/AddDocumentModal'));

type TreeNode = {
    label: string;
    value: string;
    children?: TreeNode[];
};

const data: TreeNode[] = [
    {
        label: 'Documents',
        value: 'document',
        children: [
            { label: 'Accordion.tsx', value: 'src/components/Accordion.tsx' },
            { label: 'Tree.tsx', value: 'src/components/Tree.tsx' },
            { label: 'Button.tsx', value: 'src/components/Button.tsx' },
        ],
    }
];

export default function Document() {
    const { resetState } = DocumentController;

    const handleAddM = () =>
        window.openModal({
            modalId: 'document-modal',
            centered: true,
            size: '50%',
            title: 'Add Documents',
            children: (
                <Suspense fallback={<EzLoader h={400} />}>
                    <AddDocumentModal />
                </Suspense>
            ),
            onClose: resetState,
        });

    return (
        <EzCard
            title='Documents'
            tooltip='Add Document'
            handleAdd={handleAddM}
            innerContainer={{ display: 'flex', flex: 1 }}
            container={{ flex: 1 }}
        >
            <Flex flex={1} gap={8}>
                <Tree
                    data={data}
                    flex={1}
                    levelOffset={36}
                    classNames={classes}
                    renderNode={({ node, expanded, hasChildren, elementProps }) => (
                        <Group gap={5} {...elementProps}>
                            {hasChildren && (
                                <IconChevronDown
                                    size={24}
                                    style={{
                                        transition: 'transform 300ms',
                                        transform: expanded ? 'rotate(360deg)' : 'rotate(270deg)',
                                    }}
                                />
                            )}
                            <span>{node.label}</span>
                        </Group>
                    )}
                />

                <Center h='100%' bg='#00000005' flex={1}>
                    <Stack align='center'>
                        <IconFolderSearch style={{ height: '2em', width: '2rem' }} />
                        <EzText>Folder: Documents</EzText>
                        <EzText>Contains: 0</EzText>
                    </Stack>
                </Center>
            </Flex>
        </EzCard>
    );
}