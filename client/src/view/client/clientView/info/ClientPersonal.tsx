import {Avatar, Stack, ActionIcon, Skeleton} from "@mantine/core";
import EzGroupBtn from "@/ezMantine/buttonGroup/EzGroupBtn.tsx";
import {IconCalendarMonth, IconEdit, IconFolder} from "@tabler/icons-react";
import EzCard from "@/ezMantine/card/EzCard.tsx";
import EzText from "@/ezMantine/text/EzText.tsx";
import {lazy, Suspense, useLayoutEffect} from "react";
import {ClientInfoController} from "./ClientInfoController.tsx";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
// import {imageToBase64} from "@/util";
//dynamic import
const EzPersonalForm =
    lazy(() => import('@/components/form/EzPersonalForm.tsx'));
const EzUploadFiles =
    lazy(() => import('@/components/form/EzUploadFiles.tsx'));

export default function ClientPersonal() {
    const {
        clientPersonalData,
        clientPersonalLoading,
        clientPersonalGetData,
        resetState
    } = ClientInfoController

    useLayoutEffect(() => {
        clientPersonalGetData().then();
        return () => {
            ClientInfoController.clientPersonalData = []
            ClientInfoController.clientPersonalLoading = true
        }
    }, [])

    if (clientPersonalLoading) return <Skeleton mih={346} radius='sm'/>

    function handleEditM() {
        const modalId = 'edit-personal-modal';
        window.openModal({
            modalId,
            title: 'Edit Personal Information',
            children: (
                <Suspense fallback={<EzLoader h={435}/>}>
                    <EzPersonalForm
                        id={clientPersonalData.client_id}
                        handler={ClientInfoController.handlePersonalEdit}
                        modalId={modalId}
                        controller={ClientInfoController}
                        root='personal'
                    />
                </Suspense>
            ),
            onClose: resetState
        })
    }

    // const handleCropAndSave =
    //     async (file: File, name: string) => {
    //         const base64 = await imageToBase64(file as File);
    //         debugger
    //         // handleInput(name, { file, base64 }, 'v-card');
    //     };

    function handleUploadProfilePicture() {
        const modalId = 'profile-picture-modal'
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
            onClick: handleEditM
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
                    <Avatar src={clientPersonalData.client_pfp_url} size={180} radius={180} mx="auto"/>
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
                        {clientPersonalData?.client_full_name}
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
    )
}

ClientPersonal.propTypes = {}
