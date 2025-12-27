import { Flex, Stack } from "@mantine/core";
import RenderList from "@/ezMantine/transferList/RenderList.tsx";
import type { RenderListOptionProps } from "@/types";
import { RoleModalController } from "./RoleModalController.ts";
import {useLayoutEffect} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";

function RolePermissionModal({ roleId }: { roleId: number }) {
    const {
        rolePermissions,
        currentGroup,
        setOption,
        groupPermissions,
        optionsLoading,
        updatePermission,
        permissionGroupGetData,
        permissionGroupData,
        permissionGroupLoading
    } = RoleModalController

    useLayoutEffect(() => {
        permissionGroupGetData().then()
        return () => {
            RoleModalController.groupPermissions = []
            RoleModalController.rolePermissions = []
            RoleModalController.currentGroup = ''
        }
    }, []);

    if (permissionGroupLoading) return <EzLoader h={600}/>

    return (
        <Stack>
            <Flex gap={8} data-type={roleId}>
                <RenderList
                    title='Groups'
                    singleSelect
                    options={permissionGroupData}
                    active={[currentGroup]}
                    onChange={(option: RenderListOptionProps) => {
                        if (option.label === currentGroup) return
                        setOption( roleId, option.value, option.label);
                    }}
                    w={500}
                />
                <RenderList
                    title='Permissions'
                    options={groupPermissions || []}
                    active={rolePermissions}
                    onChange={(option: RenderListOptionProps | string) => {
                        updatePermission((option as any).value);
                    }}
                    flex={1}
                    loading={optionsLoading}
                />
            </Flex>
        </Stack>
    );
}

export default RolePermissionModal;