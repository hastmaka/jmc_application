import EzCard from "@/ezMantine/card/EzCard.tsx";
import {Group, Skeleton} from "@mantine/core";
import {ClientInfoController} from "./ClientInfoController.tsx";
import {lazy, Suspense, useLayoutEffect} from "react";
import EzText from "@/ezMantine/text/EzText.tsx";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import NothingToShow from "../../../../components/cardItem/NothingToShow.tsx";
import moment from "moment";
import {capitalizeWords} from "@/util";
import CardItem from "@/components/cardItem/CardItem.tsx";

//dynamic import
const EzInsuranceForm =
    lazy(() => import('@/components/form/EzInsuranceForm.tsx'));

export default function ClientInsurance ()  {
    const {
        clientInsuranceData,
        clientInsuranceLoading,
        clientInsuranceGetData,
        resetState,
    } = ClientInfoController

    useLayoutEffect(() => {
        clientInsuranceGetData().then();
        return () => {
            ClientInfoController.clientInsuranceData = []
            ClientInfoController.clientInsuranceLoading = true
        }
    }, []);

    function handleAddM(){
        const modalId = 'create-client-insurance';
        window.openModal({
            modalId,
            title: 'Create Insurance',
            children: (
                <Suspense fallback={<EzLoader h={435}/>}>
                    <EzInsuranceForm
                        modalId={modalId}
                        handler={ClientInfoController.handleInsuranceCreate}
                        controller={ClientInfoController}
                        root='insurance'
                    />
                </Suspense>
            ),
            onClose: resetState
        })
    }
    function handleEditM(insurance: any) {
        const modalId = 'edit-insurance-modal';
        window.openModal({
            modalId,
            title: 'Edit Insurance',
            children: (
                <Suspense fallback={<EzLoader h={280}/>}>
                    <EzInsuranceForm
                        id={insurance?.client_insurance_id}
                        modalId={modalId}
                        handler={ClientInfoController.handleInsuranceEdit}
                        controller={ClientInfoController}
                        root='insurance'
                    />
                </Suspense>
            ),
            onClose: resetState
        })
    }

    if (clientInsuranceLoading) return <Skeleton mih={346} radius='sm'/>

    return (
        <EzCard
            title='Insurances'
            label='Add Insurance'
            handleAdd={handleAddM}
        >
            {clientInsuranceData.length > 0 ? (clientInsuranceData.map((insurance: any, index: number) => {
                const effective = insurance?.client_insurance_effective_start_date
                    ? moment(insurance?.client_insurance_effective_start_date).format('MMM DD YYYY')
                    : 'Not Set'
                const expiration = insurance?.client_insurance_effective_end_date
                    ? moment(insurance?.client_insurance_effective_end_date).format('MMM DD YYYY')
                    : 'Not Set'
                return (
                    <CardItem
                        key={insurance?.insurance_id}
                        onDoubleClick={() => handleEditM(insurance)}
                        index={index}
                    >
                        <EzText bold='Name:'>{capitalizeWords(insurance?.insurance_id)|| 'Not Set'}</EzText>
                        <EzText bold='Relation:'>{capitalizeWords(insurance?.client_insurance_relation)|| 'Not Set'}</EzText>
                        <Group>
                            <EzText bold='Insurance #:'>{insurance?.client_insurance_number || 'Not Set'}</EzText>
                            <EzText bold='Payer Id #:'>{insurance?.client_insurance_payer_id || 'Not Set'}</EzText>
                        </Group>
                        <EzText bold='Effective Date:'> {effective}</EzText>
                        <EzText bold='Expiration Date:'> {expiration}</EzText>
                    </CardItem>
                )
            })) : (
                <NothingToShow/>
            )}
        </EzCard>
    )
}
