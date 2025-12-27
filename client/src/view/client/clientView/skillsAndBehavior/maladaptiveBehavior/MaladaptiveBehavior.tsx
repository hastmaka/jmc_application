import {SkillsAndBehaviorController} from "../SkillsAndBehaviorController.js";
import {lazy, Suspense, useLayoutEffect} from "react";
import EzCard from "@/ezMantine/card/EzCard.tsx";
import EzTable from "@/ezMantine/table/EzTable.tsx";
import {IconEdit, IconGraph, IconTrash} from "@tabler/icons-react";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";
import {Skeleton} from "@mantine/core";
//dynamic imports
const MaladaptiveBehaviorModal = lazy(() => import("../_modal/MaladaptiveBehaviorModal.jsx"));
const GenericModal = lazy(() => import('@/components/modal/GenericModal.jsx'));

const head = ['Name', 'Baseline', 'Status', 'Effective Date', 'Measure', 'Actions'];

const tdMap = [
    {
        name: 'skill_behavior_name',
        w: '40%'
    },
    'measure_baseline',
    'skill_behavior_status_name',
    'skill_behavior_start_date',
    'skill_behavior_measure_name'
];

export default function MaladaptiveBehavior() {
    const {
        maladaptiveBehaviorData,
        maladaptiveBehaviorLoading,
        maladaptiveBehaviorGetData,
        resetState,
        modal,
        handleDeleteSkillBehavior
    } = SkillsAndBehaviorController

    useLayoutEffect(() => { maladaptiveBehaviorGetData().then()}, []);

    const actions = [
        {
            tooltip: 'View Graph',
            icon: <IconGraph style={{width: '1.5rem'}} stroke={1}/>,
            aria: 'view',
            onClick: () => {}
        },
        {
            tooltip: 'Edit',
            icon: <IconEdit style={{width: '1.5rem'}} stroke={1}/>,
            aria: 'edit',
            onClick: (row: any) => {
                modal!.state = 'edit'
                window.openModal({
                    size: '80%',
                    modalId: 'maladaptive_behavior',
                    title: 'Edit Maladaptive Behavior',
                    children: (
                        <Suspense fallback={<EzLoader h={400}/>}>
                            <MaladaptiveBehaviorModal id={row['skill_behavior_id']}/>
                        </Suspense>
                    ),
                    onClose: resetState
                })
            }
        },
        {
            tooltip: 'Delete',
            icon: <IconTrash style={{width: '1.5rem'}} stroke={1}/>,
            aria: 'delete',
            onClick: (row: any) => window.openModal({
                size: 'sm',
                modalId: 'delete_maladaptive_behavior',
                title: 'Confirm Delete',
                children: (
                    <Suspense fallback={<EzLoader h={120}/>}>
                        <GenericModal
                            text={`Maladaptive: ${row.get('skill_behavior_name')}`}
                            cancel={() => window.closeModal('delete_maladaptive_behavior')}
                            accept={async () => {
                                await window.toast.U({
                                    modalId: 'delete_maladaptive_behavior',
                                    id: {
                                        title: 'Deleting',
                                        message: `Deleting maladaptive behavior...`,
                                    },
                                    update: {
                                        success: `Maladaptive Behavior deleted successfully`,
                                        error: `Maladaptive Behavior couldn't be deleted`
                                    },
                                    cb: () => handleDeleteSkillBehavior(row?.skill_behavior_id, 1)
                                })
                                window.closeModal('delete_maladaptive_behavior')
                            }}
                        />
                    </Suspense>
                ),
                onClose: resetState
            })
        }
    ]

    if (maladaptiveBehaviorLoading) return <Skeleton flex={1} h={486}/>

    return (
        <EzCard
            title='Maladaptive Behavior'
            tooltip='Add Maladaptive Behavior'
            handleAdd={() => window.openModal({
                size: '80%',
                modalId: 'maladaptive_behavior',
                title: 'Add Maladaptive Behavior',
                children: (
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <MaladaptiveBehaviorModal/>
                    </Suspense>
                ),
                onClose: resetState
            })}
        >
            <EzTable
                dataKey='skill_behavior_id'
                head={head}
                height={400}
                data={maladaptiveBehaviorData}
                tdMap={tdMap}
                actions={actions}
            />
        </EzCard>
    )
}