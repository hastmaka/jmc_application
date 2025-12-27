import {lazy, Suspense, useLayoutEffect} from "react";
import {Card, Text, Stack, NavLink, Group, ActionIcon, TextInput} from "@mantine/core";
import {IconPlus, IconSearch} from "@tabler/icons-react";
import {AssetController} from "@/view/asset/AssetController.ts";
import {AssetModalController} from "@/view/asset/_modal/AssetModalController.ts";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import _ from "lodash";

const AddEditAssetModal = lazy(() => import('./_modal/AddEditAssetModal'))

function AssetList() {
    const {
        assetGetData,
        assetLoading,
        selectedAsset,
        handleSelectAsset,
        searchFilter,
        setSearchFilter,
        getFilteredKeys,
        getOptionCount
    } = AssetController
    const {resetState} = AssetModalController

    useLayoutEffect(() => { assetGetData().then()}, [assetGetData]);

    function handleAddCategory() {
        const modalId = 'add-asset-modal';
        window.openModal({
            modalId,
            title: 'Add Category',
            size: 'sm',
            children: (
                <Suspense>
                    <AddEditAssetModal modalId={modalId} />
                </Suspense>
            ),
            onClose: resetState
        })
    }

    return (
        <Card shadow="none" padding="md" radius="md" withBorder h="100%">
            <Stack gap="sm">
                <Group justify="space-between">
                    <Text fw={600} size="lg">Asset Categories</Text>
                    <ActionIcon color="blue" onClick={handleAddCategory}>
                        <IconPlus size={18} />
                    </ActionIcon>
                </Group>

                <TextInput
                    placeholder="Search categories..."
                    leftSection={<IconSearch size={16} />}
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.currentTarget.value)}
                />

                {assetLoading ? (
                    <EzLoader h={600}/>
                ) : (
                    <Stack gap={4}>
                        {getFilteredKeys().map((key: string) => (
                            <NavLink
                                key={key}
                                label={_.startCase(key)}
                                description={`${getOptionCount(key)} options`}
                                active={selectedAsset === key}
                                onClick={() => handleSelectAsset(key)}
                                variant="light"
                            />
                        ))}
                    </Stack>
                )}

            </Stack>
        </Card>
    );
}

export default AssetList;
