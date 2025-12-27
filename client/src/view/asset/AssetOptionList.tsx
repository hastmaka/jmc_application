import {Card, Text, Stack, Group, ActionIcon, Table, Badge, Switch} from "@mantine/core";
import {IconPlus, IconPencil, IconTrash} from "@tabler/icons-react";
import {AssetController} from "@/view/asset/AssetController.ts";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import _ from "lodash";
import {lazy, Suspense} from "react";
import {AssetModalController} from "@/view/asset/_modal/AssetModalController.ts";
import GenericModal from "@/components/modal/GenericModal.tsx";
import toast from "@/ezMantine/toast/toast.tsx";
import EzText from "@/ezMantine/text/EzText.tsx";
//dynamic
const AddEditAssetOption =
    lazy(() => import('./_modal/./AddEditAssetOptionModal'))


function AssetOptionList() {
    const {
        selectedAsset,
        optionsData,
        optionsLoading,
        handleToggleAssetOptionActive,
        handleDeleteAssetOption,
    } = AssetController;
    const {resetState} = AssetModalController

    function handleAdd(){
        const modalId = 'add-asset-option-modal';
        window.openModal({
            modalId,
            title: 'Add Asset Option',
            size: 'sm',
            children: (
                <Suspense>
                    <AddEditAssetOption
                        modalId={modalId}
                    />
                </Suspense>
            ),
            onClose: resetState
        })
    }
    function handleEdit(assetId: number){
        const modalId = 'edit-asset-option-modal';
        window.openModal({
            modalId,
            title: 'Add Asset Option',
            size: 'sm',
            children: (
                <Suspense>
                    <AddEditAssetOption
                        modalId={modalId}
                        assetId={assetId}
                    />
                </Suspense>
            ),
            onClose: resetState
        })
    }
    function handleDelete(assetId: number){
        const modalId = 'delete-confirmation-modal'
        window.openModal({
            modalId,
            title: 'Delete Asset Option',
            size: 'sm',
            children: (
                <GenericModal
                    cancel={() => window.closeModal(modalId)}
                    accept={async () => {
                        return await toast.U({
                            modalId,
                            id: {
                                title: 'Deleting Asset Option',
                                message: 'Please wait...',
                            },
                            update: {
                                success: 'Asset Option was deleted successfully.',
                                error: 'Something went wrong while deleting the Asset Option.',
                            },
                            cb: () => handleDeleteAssetOption(assetId, modalId)
                        })
                    }}
                >
                    <EzText>Confirm Action</EzText>
                </GenericModal>
            ),
            onClose: () => {}
        })
    }

    const rows = optionsData.map((option: any) => (
        <Table.Tr key={option.asset_option_id}>
            <Table.Td>{option.asset_option_name}</Table.Td>
            <Table.Td>
                <Badge color={option.asset_option_active ? "teal.8" : "gray"}>
                    {option.asset_option_active ? "Active" : "Inactive"}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Switch
                    checked={option.asset_option_active}
                    size="sm"
                    onChange={() => handleToggleAssetOptionActive(option.asset_option_id, option.asset_option_active)}
                />
            </Table.Td>
            <Table.Td>
                <Group gap="xs">
                    <ActionIcon
                        variant="subtle"
                        color="blue"
                        size="sm"
                        onClick={() => handleEdit(option.asset_option_id)}
                    >
                        <IconPencil size={16} />
                    </ActionIcon>
                    <ActionIcon
                        variant="subtle"
                        color="red"
                        size="sm"
                        onClick={() => handleDelete(option.asset_option_id)}
                    >
                        <IconTrash size={16} />
                    </ActionIcon>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Card shadow="none" padding="md" radius="md" withBorder h="100%">
            <Stack gap="sm">
                <Group justify="space-between">
                    <Text fw={600} size="lg">
                        {selectedAsset ? `Options: ${_.startCase(selectedAsset)}` : 'Select a category'}
                    </Text>
                    {selectedAsset && (
                        <ActionIcon
                            color="blue"
                            onClick={handleAdd}
                        >
                            <IconPlus size={18} />
                        </ActionIcon>
                    )}
                </Group>

                {!selectedAsset ? (
                    <Text c="dimmed" ta="center" py="xl">
                        Select an asset category to view its options
                    </Text>
                ) : optionsLoading ? (
                    <EzLoader h={600} />
                ) : (
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Option Name</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Toggle</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                )}
            </Stack>
        </Card>
    );
}

export default AssetOptionList;
