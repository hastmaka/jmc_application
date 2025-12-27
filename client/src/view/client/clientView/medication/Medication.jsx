import {mockTableData} from "@/static/dummyData.js";
import {MedicationController} from "./MedicationController.js";
import {IconEdit, IconTrash} from "@tabler/icons-react";
import {lazy, Suspense, useLayoutEffect} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";
import EzCard from "@/ezMantine/card/EzCard.jsx";
import EzTable from "@/ezMantine/table/EzTable.jsx";
import {Skeleton} from "@mantine/core";
//dynamic imports
const MedicationModal = lazy(() => import('./_modal/MedicationModal.jsx'));
const GenericModal = lazy(() => import('@/components/modal/GenericModal.jsx'));

const head = ['Name', 'Purpose', 'Start Date', 'End Date', 'Dosage', 'Schedule', 'Side Effects', 'Prescribed By', 'Actions'];
const tdMap = ['name', 'purpose', 'start_date', 'end_date', 'dosage', 'schedule', 'side_effects', 'prescribed_by'];
const data = mockTableData(tdMap, 5);

export default function Medication() {
    const {
        medicationGetData,
        medicationLoading,
        medicationData,
        resetState,
        modal,
        handleDelete
    } = MedicationController

    useLayoutEffect(() => {medicationGetData().then()}, []);

    const actions = [
        {
            tooltip: 'Edit',
            icon: <IconEdit style={{width: '1.5rem'}} stroke={1}/>,
            aria: 'edit',
            onClick: () => openModal({
                modalId: 'medication',
                title: 'Edit Medication',
                size: '50%',
                children: (
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <MedicationModal/>
                    </Suspense>
                ),
                onClose: resetState
            })
        },
        {
            tooltip: 'Delete',
            icon: <IconTrash style={{width: '1.5rem'}} stroke={1}/>,
            aria: 'delete',
            onClick: (row) => openModal({
                size: 'sm',
                modalId: 'medication',
                title: 'Please confirm your action',
                children: (
                    <Suspense fallback={<EzLoader h={120}/>}>
                        <GenericModal
                            text={`Delete: ${row?.name} medication`}
                            cancel={() => closeModal('medication')}
                            accept={async () => handleDelete(row?.name)}
                        />
                    </Suspense>
                ),
                onClose: resetState
            })
        }
    ]

    if (medicationLoading) return <Skeleton flex={1} h={486}/>

    return (
        <EzCard
            container={{flex: 1}}
            title='Medication'
            tooltip='Add Medication'
            handleAdd={() => openModal({
                size: '50%',
                modalId: 'medication',
                title: 'Add Medication',
                children: (
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <MedicationModal/>
                    </Suspense>
                ),
                onClose: () => {}
            })}
        >
            <EzTable
                dataKey='name'
                tableId='users'
                head={head}
                height='calc(100vh - 220px)'
                data={data}
                tdMap={tdMap}
                actions={actions}
            />
        </EzCard>
    )
}

Medication.propTypes = {}
