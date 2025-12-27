import {IconEdit, IconTrash} from "@tabler/icons-react";
import {lazy, Suspense, useLayoutEffect} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";
import EzTable from "@/ezMantine/table/EzTable.jsx";
import EzCard from "@/ezMantine/card/EzCard.jsx";
import {InterventionController} from "./InterventionController.js";
import {Skeleton} from "@mantine/core";
import {valueToLabel} from "@/util/convertData.js";
//dynamic imports
const InterventionModal = lazy(() => import("./_modal/InterventionModal.jsx"));
const GenericModal = lazy(() => import('@/components/modal/GenericModal.jsx'));

const head = ['Interventions', 'Related Functions', 'Start Date', 'End Date', 'Description', 'Actions']
const tdMap = [
    {
        name: 'skill_behavior_name',
        w: '20%'
    },
    {
        name: 'skill_behavior_functions',
        render: (data) => {
            return data.map((item, index) => {
                const isLastItem = index === data.length - 1;
                return `${valueToLabel('maladaptive_function', item)}${isLastItem ? '' : ','}`;
            }).join(' ');
        },
        w: '20%'
    },
    {
        name: 'skill_behavior_start_date',
        w: '10%'
    },
    {
        name: 'skill_behavior_end_date',
        w: '10%'
    },
    {
        name: 'skill_behavior_definition',
        w: '40%'
    }
]

export default function Intervention() {
    const {
        interventionGetData,
        interventionData,
        interventionLoading,
        resetState,
        handleDeleteIntervention
    } = InterventionController

    useLayoutEffect(() => {interventionGetData().then()}, []);

    const actions = [
        {
            tooltip: 'Edit',
            icon: <IconEdit style={{width: '1.5rem'}} stroke={1}/>,
            aria: 'edit',
            onClick: (row) => openModal({
                modalId: 'intervention',
                title: 'Edit Intervention',
                children: (
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <InterventionModal id={row['skill_behavior_id']}/>
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
                modalId: 'intervention',
                title: 'Please confirm your action',
                children: (
                    <Suspense fallback={<EzLoader h={120}/>}>
                        <GenericModal
                            text={`Delete: ${row?.skill_behavior_name}`}
                            cancel={() => closeModal('intervention')}
                            accept={async () => {
                                await toast.U({
                                    modalId: 'intervention',
                                    id: {
                                        title: 'Deleting',
                                        message: `Deleting intervention...`,
                                    },
                                    update: {
                                        success: `Intervention deleted successfully`,
                                        error: `Intervention couldn't be deleted`
                                    },
                                    cb: () => handleDeleteIntervention(row?.skill_behavior_id)
                                })
                                closeModal('intervention')
                            }}
                        />
                    </Suspense>
                ),
                onClose: resetState
            })
        }
    ]

    if (interventionLoading) return <Skeleton h={486}/>

    return (
        <EzCard
            container={{flex: 1}}
            title='Interventions'
            tooltip='Add Intervention'
            handleAdd={() => openModal({
                modalId: 'intervention',
                title: 'Add Intervention',
                children: (
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <InterventionModal/>
                    </Suspense>
                ),
                onClose: () => {}
            })}
        >
            <EzTable
                dataKey='skill_behavior_id'
                tableId='intervention'
                head={head}
                height='calc(100vh - 220px)'
                data={interventionData}
                tdMap={tdMap}
                actions={actions}
            />
        </EzCard>
    )
}

Intervention.propTypes = {}