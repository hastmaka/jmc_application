import {SkillsAndBehaviorController} from "../SkillsAndBehaviorController.js";
import {lazy, Suspense, useLayoutEffect} from "react";
import EzCard from "@/ezMantine/card/EzCard.jsx";
import EzTable from "@/ezMantine/table/EzTable.jsx";
import {IconEdit, IconGraph, IconTrash} from "@tabler/icons-react";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";
import {Skeleton} from "@mantine/core";
//dynamic imports
const ReplacementBehaviorModal = lazy(() => import("../_modal/ReplacementBehaviorModal.jsx"));
const GenericModal = lazy(() => import('@/components/modal/GenericModal.jsx'));

const head = ['Name', 'Baseline', 'Status', 'Effective Date', 'Measure', 'Actions'];
const tdMap = ['skill_behavior_name', 'measure_baseline', 'skill_behavior_status_name',
    'skill_behavior_start_date', 'skill_behavior_measure_name'];

export default function ReplacementBehavior() {
    const {
        replacementBehaviorData,
        replacementBehaviorLoading,
        replacementBehaviorGetData,
        resetState,
        modal,
        handleDeleteSkillBehavior
    } = SkillsAndBehaviorController

    useLayoutEffect(() => {replacementBehaviorGetData().then()}, []);

    const actions = [
        {
            tooltip: 'View Graph',
            icon: <IconGraph style={{width: '1.5rem'}} stroke={1}/>,
            aria: 'view',
            onClick: (row) => {
                debugger
            }
        },
        {
            tooltip: 'Edit',
            icon: <IconEdit style={{width: '1.5rem'}} stroke={1}/>,
            aria: 'edit',
            onClick: (row) => {
                modal.state = 'edit'
                openModal({
                    size: '80%',
                    modalId: 'replacement_behavior',
                    title: 'Edit Replacement Behavior',
                    children: (
                        <Suspense fallback={<EzLoader h={400}/>}>
                            <ReplacementBehaviorModal id={row['skill_behavior_id']}/>
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
            onClick: (row) => openModal({
                size: 'sm',
                modalId: 'delete_replacement_behavior',
                title: 'Confirm Delete',
                children: (
                    <Suspense fallback={<EzLoader h={120}/>}>
                        <GenericModal
                            text={`Replacement: ${row.get('skill_behavior_name')}`}
                            cancel={() => closeModal('delete_replacement_behavior')}
                            accept={async () => {
                                await toast.U({
                                    modalId: 'delete_replacement_behavior',
                                    id: {
                                        title: 'Deleting',
                                        message: `Deleting ${row.get('skill_behavior_name')}...`,
                                    },
                                    update: {
                                        success: `${row.get('skill_behavior_name')} deleted successfully`,
                                        error: `${row.get('skill_behavior_name')} couldn't be deleted`
                                    },
                                    cb: () => handleDeleteSkillBehavior(row?.skill_behavior_id, 2)
                                })
                                closeModal('delete_replacement_behavior')
                            }}
                        />
                    </Suspense>
                ),
                onClose: resetState
            })
        }
    ]

    if (replacementBehaviorLoading) return <Skeleton flex={1} h={486}/>


    return (
        <EzCard
            title='Replacement Behavior'
            tooltip='Add Replacement Behavior'
            handleAdd={() => openModal({
                size: '80%',
                modalId: 'replacement_behavior',
                title: 'Add Replacement Behavior',
                children: (
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <ReplacementBehaviorModal/>
                    </Suspense>
                ),
                onClose: resetState
            })}
        >
            <EzTable
                dataKey='skill_behavior_id'
                head={head}
                height={400}
                data={replacementBehaviorData}
                tdMap={tdMap}
                actions={actions}
            />
        </EzCard>
    )
}
