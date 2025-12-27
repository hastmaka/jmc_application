import EzCard from "@/ezMantine/card/EzCard.tsx";
import {Skeleton} from "@mantine/core";
import {ClientInfoController} from "./ClientInfoController.tsx";
import {lazy, Suspense, useLayoutEffect} from "react";
import EzText from "@/ezMantine/text/EzText.tsx";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {ClientViewController} from "@/view/client/clientView/ClientViewController.ts";
import NothingToShow from "../../../../components/cardItem/NothingToShow.tsx";
import {formatPhoneNumber} from "@/util";
import CardItem from "@/components/cardItem/CardItem.tsx";
// dynamic imports
const EzTherapistForm =
    lazy(() => import("@/components/form/EzTherapistForm.tsx"));

export default function ClientTherapist() {
    const {
        clientTherapistData,
        clientTherapistLoading,
        clientTherapistGetData,
        resetState
    } = ClientInfoController;

    useLayoutEffect(() => {
        clientTherapistGetData().then();
        return () => {
            ClientInfoController.clientTherapistData = []
            ClientInfoController.clientTherapistLoading = true
        }
    }, []);

    function handleAddM() {
        const modalId = 'create-address-modal';
        window.openModal({
            modalId,
            title: 'Create Address',
            children: (
                <Suspense fallback={<EzLoader h={360}/>}>
                    <EzTherapistForm
                        modalId={modalId}
                        controller={ClientInfoController}
                        handler={ClientInfoController.handleTherapistCreate}
                        root='therapist'
                    />
                </Suspense>
            ),
            onClose: () => {}
        })
    }
    function handleEditM(employee: any){
        const modalId = 'edit-therapist-modal';
        window.openModal({
            modalId,
            title: 'Edit Caregiver or Guardian',
            children: (
                <Suspense fallback={<EzLoader h={280}/>}>
                    <EzTherapistForm
                        id={employee?.employee_id}
                        modalId={modalId}
                        handler={ClientInfoController.handleCaregiverEdit}
                        controller={ClientInfoController}
                        root='caregiver'
                        related_field_id={ClientViewController.clientId}
                    />
                </Suspense>
            ),
            onClose: resetState
        })
    }

    if (clientTherapistLoading) return <Skeleton mih={346} radius='sm'/>;

    return (
        <EzCard title='Behavior Therapists' handleAdd={handleAddM} label='Add Therapist'>
            {clientTherapistData.length > 0 ? clientTherapistData.map((employee: any, index: number) => {
                const phone = employee?.employee_primary_phone
                    ? formatPhoneNumber(employee?.employee_primary_phone)
                    : 'Not Set'
                return (
                    <CardItem
                        key={employee?.employee_id}
                        onDoubleClick={() => handleEditM(employee)}
                        index={index}
                    >
                        <EzText bold='Name:'>{employee?.employee_full_name || 'Not Set'}</EzText>
                        <EzText bold='Email:'>{employee?.employee_email || 'Not Set'}</EzText>
                        <EzText bold='Phone:'>{phone}</EzText>
                        <EzText bold='Certification:'>{employee?.employee_certification || 'Not set'}</EzText>
                    </CardItem>
                )
            }) : <NothingToShow/>}
        </EzCard>
    );
}
