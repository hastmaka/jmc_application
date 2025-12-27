import {mockTableData} from "@/static/dummyData.js";
import {IconTrash} from "@tabler/icons-react";
import {lazy, Suspense, useLayoutEffect} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";
import {DiagnosisController} from "./DiagnosisController.js";
import EzCard from "@/ezMantine/card/EzCard.jsx";
import EzTable from "@/ezMantine/table/EzTable.jsx";
import {Skeleton} from "@mantine/core";
//dynamic imports
const GenericModal = lazy(() => import('@/components/modal/GenericModal.jsx'));
const HealthcareProviderModal = lazy(() => import('./_modal/DiagnosisModal.jsx'));

const head = ['Code', 'Name', 'Description', 'Primary', 'Actions'];
const tdMap = ['code', 'name', 'description', 'primary'];
const data = mockTableData(tdMap, 2);

export default function Diagnosis() {
    const {
        diagnosisGetData,
        diagnosisLoading,
        diagnosisData,
        resetState,
        modal,
        handleDeleteDiagnosis
    } = DiagnosisController

    useLayoutEffect(() => {diagnosisGetData().then()}, []);

    const actions = [
        {
            tooltip: 'Delete',
            icon: <IconTrash style={{width: '1.5rem'}} stroke={1}/>,
            aria: 'delete',
            onClick: (row) => openModal({
                size: 'sm',
                modalId: 'diagnosis',
                title: 'Please confirm your action',
                children: (
                    <Suspense fallback={<EzLoader h={120}/>}>
                        <GenericModal
                            text={`Delete: ${row?.name}`}
                            cancel={() => closeModal('diagnosis')}
                            accept={() => handleDeleteDiagnosis(row?.name)}
                        />
                    </Suspense>
                ),
                onClose: resetState
            })
        }
    ]

    if (diagnosisLoading) return <Skeleton flex={1} h={486}/>

    return (
        <EzCard
            container={{flex: 1}}
            title='Diagnosis'
            tooltip='Add Diagnosis'
            handleAdd={() => openModal({
                size: 'lg',
                modalId: 'diagnosis',
                title: 'Choose Diagnosis',
                children: (
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <HealthcareProviderModal/>
                    </Suspense>
                ),
                onClose: resetState
            })}
        >
            <EzTable
                dataKey='code'
                tableId='diagnosis'
                head={head}
                height='calc(100vh - 220px)'
                data={data}
                tdMap={tdMap}
                actions={actions}
            />
        </EzCard>
    )
}

Diagnosis.propTypes = {}
