import {Skeleton} from "@mantine/core";
import EzCard from "@/ezMantine/card/EzCard.tsx";
import {ClientInfoController} from "./ClientInfoController.tsx";
import {lazy, Suspense, useLayoutEffect} from "react";
import EzText from "@/ezMantine/text/EzText.tsx";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {ClientViewController} from "@/view/client/clientView/ClientViewController.ts";
import NothingToShow from "../../../../components/cardItem/NothingToShow.tsx";
import u from "@/util";
import CardItem from "@/components/cardItem/CardItem.tsx";
import IsPrimary from "@/components/IsPrimary.tsx";

const EzPhoneForm =
    lazy(() => import('@/components/form/EzPhoneForm.tsx'));

export default function ClientPhone() {
    const {
        clientPhoneGetData,
        clientPhoneLoading,
        clientPhoneData,
        resetState,
    } = ClientInfoController

    useLayoutEffect(() => {
        clientPhoneGetData().then();
        return () => {
            ClientInfoController.clientPhoneData = []
            ClientInfoController.clientPhoneLoading = true
        }
    }, []);

    function handleAddM() {
        const modalId = 'create-phone-modal';
        window.openModal({
            modalId,
            title: 'Create Phone',
            children: (
                <Suspense fallback={<EzLoader h={360}/>}>
                    <EzPhoneForm
                        modalId={modalId}
                        controller={ClientInfoController}
                        handler={ClientInfoController.handlePhoneCreate}
                        root='phone'
                        related_field_id={ClientViewController.clientId}
                    />
                </Suspense>
            ),
            onClose: resetState
        })
    }
    function handleEditM(phone: any) {
        ClientInfoController.isPrimary = phone.phone_primary
        const modalId = 'edit-phone-modal';
        window.openModal({
            modalId,
            title: 'Edit Phone',
            children: (
                <Suspense fallback={<EzLoader h={360}/>}>
                    <EzPhoneForm
                        id={phone.phone_id}
                        modalId={modalId}
                        handler={ClientInfoController.handlePhoneEdit}
                        controller={ClientInfoController}
                        root='phone'
                        related_field_id={ClientViewController.clientId}
                    />
                </Suspense>
            ),
            onClose: resetState
        })
    }

    if (clientPhoneLoading) return <Skeleton mih={346} radius='sm'/>

    return (
        <EzCard title='Phones' handleAdd={handleAddM} label='Add Phone'>
            {clientPhoneData.length > 0 ? clientPhoneData.map((phone: any, index: number) => (
                <CardItem
                    key={phone?.phone_id}
                    onDoubleClick={() => handleEditM(phone)}
                    index={index}
                >
                    {phone?.phone_primary && <IsPrimary/>}
                    <EzText bold="Number:">
                        {phone?.phone_number
                            ? `${u.formatPhoneNumber(phone.phone_number)}${phone.caregiver_relation ? ` (${phone.caregiver_relation})` : ''}`
                            : 'Not Set'}
                    </EzText>
                    <EzText bold='Commend:'>{phone?.phone_comment ?? 'Not Set'}</EzText>
                </CardItem>
            )) : <NothingToShow/>}
        </EzCard>
    )
}
























