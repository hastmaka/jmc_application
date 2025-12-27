import EzCard from "@/ezMantine/card/EzCard.tsx";
import CardItem from "@/components/cardItem/CardItem.tsx";
import IsPrimary from "@/components/IsPrimary.tsx";
import EzText from "@/ezMantine/text/EzText.tsx";
import NothingToShow from "@/components/cardItem/NothingToShow.tsx";
import {EmployeeInfoController} from "./EmployeeInfoController.ts";
import {Skeleton} from "@mantine/core";
import {useLayoutEffect} from "react";

export default function EmployeeAddress() {
    const {
        employeeAddressGetData,
        employeeAddressData,
        employeeAddressLoading
    } = EmployeeInfoController

    useLayoutEffect(() => {
        employeeAddressGetData().then();
        return () => {
            EmployeeInfoController.employeeAddressData = []
            EmployeeInfoController.employeeAddressLoading = true
        }
    }, []);

    async function handleAdd(){

    }
    async function handleEdit(_address: any){

    }

    if (employeeAddressLoading) return <Skeleton mih={346} radius='sm'/>

    return (
        <EzCard title='Addresses' handleAdd={handleAdd} label='Add Address'>
            {employeeAddressData.length > 0 ? employeeAddressData.map((address: any, index: number) => (
                <CardItem
                    key={address.address_id}
                    onDoubleClick={() => handleEdit(address)}
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