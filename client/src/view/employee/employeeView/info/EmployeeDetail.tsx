import {EmployeeInfoController} from "./EmployeeInfoController.ts";
import {useLayoutEffect} from "react";
import {Skeleton} from "@mantine/core";
import EzCard from "@/ezMantine/card/EzCard.tsx";
import EzGrid from "@/ezMantine/gridLayout/EzGrid.tsx";
import {IconNotes} from "@tabler/icons-react";
import IconText from "@/components/IconText.tsx";

export default function EmployeeDetail() {
    const {
        employeeDetailGetData,
        // employeeDetailData,
        employeeDetailLoading
    } = EmployeeInfoController

    useLayoutEffect(() => {
        employeeDetailGetData().then();
        return () => {
            EmployeeInfoController.employeeDetailData = []
            EmployeeInfoController.employeeDetailLoading = true
        }
    }, []);

    if (employeeDetailLoading) return <Skeleton height={346} radius='sm'/>

    return (
        <EzCard title='Details'>
            <EzGrid gridTemplateColumns='repeat(2, minmax(180px, 1fr))'>
                <IconText
                    icon={IconNotes}
                    text={['Diagnosis', 'pancho']}
                />
            </EzGrid>
        </EzCard>
    );
}