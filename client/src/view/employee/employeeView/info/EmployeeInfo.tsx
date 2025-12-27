import {lazy, Suspense} from 'react';
import EzGrid from "@/ezMantine/gridLayout/EzGrid.tsx";
import {Skeleton} from "@mantine/core";

export default function EmployeeInfo() {
    return (
        <EzGrid
            gridTemplateColumns='repeat(auto-fill, minmax(480px, 1fr))'
        >
            {[
                lazy(() => import('./EmployeePersonal.tsx')),
                lazy(() => import('./EmployeeDetail.tsx')),
                lazy(() => import('./EmployeeDocumentStatus.tsx')),
                lazy(() => import('./EmployeePhone.tsx')),
                lazy(() => import('./EmployeeAddress.tsx')),
                lazy(() => import('./EmployeeClient.tsx')),
            ].map((Comp, index) => (
                <Suspense fallback={<Skeleton mih={346} radius='sm'/>} key={index}>
                    <Comp/>
                </Suspense>
            ))}
        </EzGrid>
    );
}