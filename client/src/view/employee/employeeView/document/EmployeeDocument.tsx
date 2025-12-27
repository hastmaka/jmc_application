import EzCard from "@/ezMantine/card/EzCard.tsx";
import {Center, Flex, Stack} from "@mantine/core";
import {IconFolderSearch} from "@tabler/icons-react";
import EzText from "@/ezMantine/text/EzText.tsx";
import EzTree from "@/components/tree/EzTree.tsx";

type TreeNode = {
    label: string;
    value: string;
    type?: string;
    children?: TreeNode[];
};

const data: TreeNode[] = [
    {
        label: 'Document',
        value: 'document',
        type: 'pdf',
        children: [
            { label: 'Accordion.tsx', value: 'src/components/Accordion.tsx' },
            { label: 'Tree.tsx', value: 'src/components/Tree.tsx' },
            {
                label: 'Button.tsx',
                value: 'src/components/Button.tsx',
                children: [
                    { label: 'Accordion.tsx', value: 'src/componentsa/Accordion.tsx' },
                    { label: 'Tree.tsx', value: 'src/componentsa/Tree.tsx' },
                    { label: 'Button.tsx', value: 'src/componentsa/Button.tsx' },
                ]
            },
        ]
    },
    { label: 'Accordion.tsx', value: 'src/componentss/Accordion.tsx' },
    { label: 'Tree.tsx', value: 'src/componentss/Tree.tsx' },
    { label: 'Button.tsx', value: 'src/componentss/Button.tsx' },
];
export default function EmployeeDocument() {
    return (
        <EzCard
            title='Documents'
            tooltip='Add Document'
            handleAdd={() => {}}
            innerContainer={{ display: 'flex', flex: 1 }}
            container={{ flex: 1 }}
        >
            <Flex flex={1} gap={8}>
                <EzTree
                    data={data}
                    flex={1}
                    onItemClick={(_node: Record<string, any>) => {
                        debugger
                    }}
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