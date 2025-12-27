import {Flex, Stack} from "@mantine/core";
import {EzTransferList} from "@/ezMantine/transferList/EzTransferList.tsx";
import RenderList from "@/ezMantine/transferList/RenderList.tsx";
import {deepSignal} from "deepsignal/react";
import type {RenderListOptionProps} from "@/types";
import _ from "lodash";
import SaveCancelDeleteBtns from "@/components/SaveCancelDeleteBtns.tsx";
import {UserModalController} from "./UserModalController.ts";

const dashboard = ['dash-1', 'dash-2', 'dash-3', 'dash-4', 'dash-5', 'dash-6', 'dash-7'];

const calendar = ['calen-1', 'calen-2', 'calen-3', 'calen-4', 'calen-5'];

const signal = deepSignal({
    selected: [] as string[],
    userHave: [],
    setOption: function(option: RenderListOptionProps | string) {
        const t: Record<'dashboard' | 'calendar', string[]> = { dashboard, calendar };

        if (typeof option === 'string') {
            this.selected = t[option as 'dashboard' | 'calendar'];
        } else {
            this.selected = t[option.value as 'dashboard' | 'calendar'];
        }
    }
})

function UserPermissionModal({userId}: {userId: number}) {
    const {
        // handleInput,
        // formData,
        // errors,
        // checkRequired,
        // resetState,
        // modalData,
        // modal,
        // dirtyFields,
    } = UserModalController

    function handleCancel() {}
    function handleSubmit() {}

    function handleTransfer(data: any) {debugger
        signal.userHave = data;
    }

    return (
        <Stack>
            <Flex gap={8} data-type={userId}>
                <RenderList
                    title='Modules'
                    singleSelect
                    options={[{
                        value: 'dashboard',
                        label: `Dashboard (${dashboard.length})`
                    }, {
                        value: 'calendar',
                        label: `Calendar (${calendar.length})`
                    }]}
                    onChange={(option: RenderListOptionProps | string) => {
                        signal.setOption(option)
                    }}
                    w={300}
                />
                <EzTransferList
                    onTransfer={(data: any) => handleTransfer(data)}
                    renderListProps={[{
                        options: signal.selected,
                        title: "Permission List",
                        type: "forward",
                    }, {
                        options: signal.userHave,
                        title: "Active Permission",
                        type: "backward",
                    }]}
                />
            </Flex>

            <SaveCancelDeleteBtns
                accept={handleSubmit}
                cancel={() => {
                    // resetState()
                    // window.closeModal(from)
                    handleCancel()
                    window.closeModal('user-permission-modal')
                }}
                label={{accept: 'Save', cancel: 'Cancel'}}
            />
        </Stack>
    );
}

export default UserPermissionModal;