import {Group, Skeleton} from "@mantine/core";
import EzCard from "@/ezMantine/card/EzCard.tsx";
import {ClientInfoController} from "./ClientInfoController.tsx";
import {lazy, Suspense, useLayoutEffect} from "react";
import EzText from "@/ezMantine/text/EzText.tsx";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import _ from "lodash";
import u from "@/util";
import NothingToShow from "../../../../components/cardItem/NothingToShow.tsx";
import CardItem from "@/components/cardItem/CardItem.tsx";
import IsPrimary from "@/components/IsPrimary.tsx";
//dynamic import
const EzCaregiverForm =
    lazy(() => import('@/components/form/EzCaregiverForm.tsx'));

export default function ClientCaregiver() {
    const {
        clientCaregiverData,
        clientCaregiverLoading,
        clientCaregiverGetData,
        resetState,
    } = ClientInfoController

    useLayoutEffect(() => {
        clientCaregiverGetData().then();
        return () => {
            ClientInfoController.clientCaregiverData = []
            ClientInfoController.clientCaregiverLoading = true
        }
    }, []);

    function handleAddM () {
        const modalId = 'create-caregiver-modal';
        window.openModal({
            modalId,
            title: 'Create Caregiver or Guardian',
            children: (
                <Suspense fallback={<EzLoader h={435}/>}>
                    <EzCaregiverForm
                        modalId={modalId}
                        handler={ClientInfoController.handleCaregiverCreate}
                        controller={ClientInfoController}
                        root='caregiver'
                    />
                </Suspense>
            ),
            onClose: resetState
        })
    }
    function handleEditM(caregiver: any) {
        const modalId = 'edit-caregiver-modal';
        window.openModal({
            modalId,
            title: 'Edit Caregiver or Guardian',
            children: (
                <Suspense fallback={<EzLoader h={280}/>}>
                    <EzCaregiverForm
                        id={caregiver?.caregiver_id}
                        modalId={modalId}
                        handler={ClientInfoController.handleCaregiverEdit}
                        controller={ClientInfoController}
                        root='caregiver'
                    />
                </Suspense>
            ),
            onClose: resetState
        })
    }

    if (clientCaregiverLoading) return <Skeleton mih={346} radius='sm'/>

    return (
        <EzCard
            title='Caregivers/Guardians'
            label='Add Caregiver or Guardian'
            handleAdd={handleAddM}
        >
            {clientCaregiverData.length > 0
                ? clientCaregiverData.map((caregiver: any, index: number) => {
                    const {caregiver_concat, caregiver_sex, caregiver_relation} = caregiver
                    return (
                        <CardItem
                            key={caregiver?.caregiver_id}
                            onDoubleClick={() => handleEditM(caregiver)}
                            index={index}
                        >
                            {caregiver?.caregiver_primary && <IsPrimary/>}
                            <EzText bold='Name:'>{u.capitalizeWords(caregiver_concat, 'first') || 'Not Set'}</EzText>
                            <Group>
                                <EzText bold='Relation:'>{_.startCase(caregiver_relation) || 'Not Set'}</EzText>
                                <EzText bold='Sex:'>{caregiver_sex || 'Not Set'}</EzText>
                            </Group>
                            <EzText bold='Email:'>{caregiver?.caregiver_email || 'Not Set'}</EzText>
                        </CardItem>
                    )
                })
                : <NothingToShow />
            }
        </EzCard>
    )
}
