import {EmployeeInfoController} from "@/view/employee/employeeView/info/EmployeeInfoController.ts";
import EzCard from "@/ezMantine/card/EzCard.tsx";
import CardItem from "@/components/cardItem/CardItem.tsx";
import IsPrimary from "@/components/IsPrimary.tsx";
import EzText from "@/ezMantine/text/EzText.tsx";
import u from "@/util";
import NothingToShow from "@/components/cardItem/NothingToShow.tsx";
import {useLayoutEffect} from "react";
import {Skeleton} from "@mantine/core";

export default function EmployeePhone() {
    const {
        employeePhoneGetData,
        employeePhoneData,
        employeePhoneLoading
    } = EmployeeInfoController

    useLayoutEffect(() => {
        employeePhoneGetData().then();
        return () => {
            EmployeeInfoController.employeePhoneData = []
            EmployeeInfoController.employeePhoneLoading = true
        }
    }, []);

    async function handleAdd(){}
    async function handleEdit(_phone: any){}

    if (employeePhoneLoading) return <Skeleton mih={346} radius='sm'/>

    return (
        <EzCard title='Phones' handleAdd={handleAdd} label='Add Phone'>
            {employeePhoneData.length > 0 ? employeePhoneData.map((phone: any, index: number) => (
                <CardItem
                    key={phone?.phone_id}
                    onDoubleClick={() => handleEdit(phone)}
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