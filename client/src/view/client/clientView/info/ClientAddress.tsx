import {Skeleton} from "@mantine/core";
import EzCard from "@/ezMantine/card/EzCard.tsx";
import {ClientInfoController} from "./ClientInfoController.tsx";
import {lazy, Suspense, useLayoutEffect} from "react";
import EzText from "@/ezMantine/text/EzText.tsx";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {ClientViewController} from "@/view/client/clientView/ClientViewController.ts";
import NothingToShow from "../../../../components/cardItem/NothingToShow.tsx";
import CardItem from "../../../../components/cardItem/CardItem.tsx";
import IsPrimary from "@/components/IsPrimary.tsx";

const EzAddressForm =
    lazy(() => import('@/components/form/EzAddressForm.tsx'));

export default function ClientAddress() {
    const {
        clientAddressData,
        clientAddressLoading,
        clientAddressGetData,
        resetState,
    } = ClientInfoController

    useLayoutEffect(() => {
        clientAddressGetData().then();
        return () => {
            ClientInfoController.clientAddressData = []
            ClientInfoController.clientAddressLoading = true
        }
    }, []);

    function handleAddM() {
        const modalId = 'create-address-modal';
        window.openModal({
            modalId,
            title: 'Create Address',
            children: (
                <Suspense fallback={<EzLoader h={360}/>}>
                    <EzAddressForm
                        modalId={modalId}
                        controller={ClientInfoController}
                        handler={ClientInfoController.handleAddressCreate}
                        root='address'
                        related_field_id={ClientViewController.clientId}
                    />
                </Suspense>
            ),
            onClose: resetState
        })
    }
    function handleEditM(address: any) {
        ClientInfoController.isPrimary = address.address_primary
        const modalId = 'edit-address-modal';
        window.openModal({
            modalId,
            title: 'Edit Address',
            children: (
                <Suspense fallback={<EzLoader h={360}/>}>
                    <EzAddressForm
                        id={address.address_id}
                        modalId={modalId}
                        handler={ClientInfoController.handleAddressEdit}
                        controller={ClientInfoController}
                        root='address'
                        related_field_id={ClientViewController.clientId}
                    />
                </Suspense>
            ),
            onClose: resetState
        })
    }

    if (clientAddressLoading) return <Skeleton mih={346} radius='sm'/>

    return (
        <EzCard title='Addresses' handleAdd={handleAddM} label='Add Address'>
            {clientAddressData.length > 0 ? clientAddressData.map((address: any, index: number) => (
                <CardItem
                    key={address.address_id}
                    onDoubleClick={() => handleEditM(address)}
                    index={index}
                >
                    {address?.address_primary && <IsPrimary/>}
                    <EzText bold='Address:'>{address?.address_concat ?? 'Not Set'}</EzText>
                    <EzText bold='Comment:'>{address?.address_comment ?? 'Not Set'}</EzText>
                </CardItem>
            )) : <NothingToShow/>}
        </EzCard>
    )
}
