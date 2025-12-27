import {SignalController} from "@/signals/signalController/SignalController.ts";
import type {SignalType} from "@/signals/SignalClass.ts";
import {FetchApi} from "@/api/FetchApi.ts";
import _ from "lodash";

function formatData(data: any) {
    return _.map(data, (item: Record<string, any>) => {
        return {
            description: item?.permission_group_description || item.permission_description,
            value: item?.permission_group_id || item.permission_id,
            label: item?.permission_group_name || item.permission_name,
            ...(item.permission_group_count && {
                count: item.permission_group_count,
            }),
            // raw: item
        };
    });
}

export const RoleModalController: SignalType<any, any> = new SignalController({
    groupPermissions: [],
    rolePermissions: [],
    currentGroup: '',
    optionsLoading: false,
},{
    /**
     * We make a request to get the active role permissions and the rest of the
     * selected group permissions
     * @param groupName
     * @param permissionGroupId - id of the permission_group
     * @param roleId - id of the selected role
     */
    setOption: async function (
        this: any,
        roleId: number,
        permissionGroupId: number,
        groupName?: string,
    ) {
        this.optionsLoading = true
        const response = await FetchApi(
            `v1/role/permission_group/${roleId}/${permissionGroupId}`
        )

        // we use this only for UI
        if (groupName) this.currentGroup = groupName

        // we need to reset the variable to avoid duplication and all is fresh data
        this.groupPermissions= []

        Object.entries(response.data).map(([key, value]) => {
            if (key === 'active_permissions') {
                return this.rolePermissions = _.map(value, (item: any) => item.permission_id)
            }

            this.groupPermissions = formatData(value)
        })

        this.roleId = roleId
        this.permissionGroupId = permissionGroupId
        this.optionsLoading = false
    },

    permissionGroupGetData: async function(this: any){
        const response = await FetchApi('v1/permission_group')
        this.permissionGroupData = formatData(response.data)
        this.permissionGroupLoading = false
    },

    async updatePermission(
        this: any,
        value: number
    ) {
        // we do this here to trick the Ui and get immediate feedback
        this.optionsLoading = true
        const isCreating = !this.rolePermissions.includes(value)

        const endpoint = 'v1/role_permission';
        const method = isCreating ? 'POST' : 'DELETE';

        // Most APIs expect DELETE params in the URL, not body:
        const url = isCreating
            ? endpoint
            : `${endpoint}/${this.roleId}/${value}`;

        const body = isCreating
            ? {
                role_role_id: this.roleId,
                permission_permission_id: value,
            }
            : undefined;

        const response = await FetchApi(url, method, body);

        if (!response.success) {
            return window.toast.E('Something goes wrong, contact Admin')
        }
        window.toast.S(`Permission ${isCreating ? 'added' : 'deleted'} successfully.`)
        this.setOption(this.roleId, this.permissionGroupId)
    },
}).signal