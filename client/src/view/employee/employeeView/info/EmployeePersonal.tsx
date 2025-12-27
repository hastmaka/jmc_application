import EzCard from "@/ezMantine/card/EzCard.tsx";
import {ActionIcon, Avatar, Skeleton, Stack} from "@mantine/core";
import {IconCalendarMonth, IconEdit, IconFolder} from "@tabler/icons-react";
import {EmployeeInfoController} from "@/view/employee/employeeView/info/EmployeeInfoController.ts";
import {lazy, Suspense, useLayoutEffect} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import EzGroupBtn from "@/ezMantine/buttonGroup/EzGroupBtn.tsx";
import EzText from "@/ezMantine/text/EzText.tsx";
// dynamic
const EzUploadFiles =
    lazy(() => import('@/components/form/EzUploadFiles.tsx'));

export default function EmployeePersonal() {
    const {
        employeePersonalData,
        employeePersonalLoading,
        employeePersonalGetData,
        // resetState
    } = EmployeeInfoController

    useLayoutEffect(() => {
        employeePersonalGetData().then();
        return () => {
            EmployeeInfoController.employeePersonalData = []
            EmployeeInfoController.employeePersonalLoading = true
        }
    }, [])

    if (employeePersonalLoading) return <Skeleton mih={346} radius='sm'/>

    function handleEdit() {

    }

    function handleUploadProfilePicture() {
        const modalId = 'employee-picture-modal'
        window.openModal({
            modalId,
            title: 'Profile Picture',
            children: (
                <Suspense fallback={<EzLoader h={600}/>}>
                    <EzUploadFiles
                        uploadedFiles={(_file: File[]) => {
                            debugger
                        }}
                        multiple={false}
                        cancel={() => window.closeModal(modalId)}
                    />
                </Suspense>
            ),
            onClose: () => {}
        })
    }

    const ITEMS= [
        {
            icon: IconEdit,
            label: 'Edit',
            onClick: handleEdit
        }, {
            icon: IconCalendarMonth,
            label: 'pancho', //'Calendar'
            onClick: function(){}
        }, {
            icon: IconFolder,
            label: 'pancho', //'Documents'
            onClick: function(){}
        }
    ]

    return (
        <EzCard
            title='Personal'
            innerContainer={{display: 'flex', flex: 1}}
        >
            <Stack
                align='center'
                justify='center'
                flex={1}
                p='1rem 0'
                gap={16}
            >
                <div style={{position: 'relative'}}>
                    <Avatar src={employeePersonalData.employee_url_link} size={180} radius={180} mx="auto"/>
                    <ActionIcon
                        variant='default'
                        size='xl'
                        c='var(--mantine-primary-color-9)'
                        style={{
                            position: 'absolute',
                            right: 20,
                            bottom: 0,
                            borderRadius: '50%',
                            padding: '0.25rem',
                        }}
                        onClick={handleUploadProfilePicture}
                    >
                        <IconEdit/>
                    </ActionIcon>
                </div>
                <Stack gap={0} align='center'>
                    <EzText fz="md" mx="auto">
                        {employeePersonalData?.employee_full_name}
                    </EzText>
                    {/*<EzText fz="sm" c='dimmed'>*/}
                    {/*    {*/}
                    {/*        `DOB: ${personalData.client_dob}*/}
                    {/*        | Sex: ${personalData.client_sex_name}`*/}
                    {/*    }*/}
                    {/*</EzText>*/}
                </Stack>
            <EzGroupBtn ITEMS={ITEMS}/>
            </Stack>
        </EzCard>
    );
}