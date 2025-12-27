import {SkillsAndBehaviorController} from "../SkillsAndBehaviorController.js";
import {lazy, Suspense, useLayoutEffect} from "react";
import EzCard from "@/ezMantine/card/EzCard.jsx";
import {IconEdit, IconGraph, IconTrash} from "@tabler/icons-react";
import EzTable from "@/ezMantine/table/EzTable.jsx";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";
import {Skeleton} from "@mantine/core";
//dynamic imports
const SkillAcquisitionModal = lazy(() => import('../_modal/SkillAcquisitionModal.jsx'));
const GenericModal = lazy(() => import('@/components/modal/GenericModal.jsx'));

const head = ['Name', 'Baseline', 'Status', 'Effective Date', 'Measure', 'Actions'];
const tdMap = ['skill_behavior_name', 'measure_baseline', 'skill_behavior_status_name',
    'skill_behavior_start_date', 'skill_behavior_measure_name'];

export default function SkillAcquisition() {
    const {
        skillAcquisitionData,
        skillAcquisitionLoading,
        skillAcquisitionGetData,
        resetState,
        modal,
        handleDeleteSkillBehavior
    } = SkillsAndBehaviorController

    useLayoutEffect(() => {skillAcquisitionGetData().then()}, []);

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
            onClick: (row) => {
                modal.state = 'edit'
                openModal({
                    size: '80%',
                    modalId: 'skill_acquisition',
                    title: 'Edit Skill Acquisition',
                    children: (
                        <Suspense fallback={<EzLoader h={400}/>}>
                            <SkillAcquisitionModal id={row['skill_behavior_id']}/>
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
                modalId: 'delete_skill_acquisition',
                title: 'Confirm Delete',
                children: (
                    <Suspense fallback={<EzLoader h={120}/>}>
                        <GenericModal
                            text={`Maladaptive: ${row.get('skill_behavior_name')}`}
                            cancel={() => closeModal('delete_skill_acquisition')}
                            accept={async () => {
                                await toast.U({
                                    modalId: 'delete_skill_acquisition',
                                    id: {
                                        title: 'Deleting',
                                        message: `Deleting skill acquisition...`,
                                    },
                                    update: {
                                        success: `Skill Acquisition deleted successfully`,
                                        error: `Skill Acquisition couldn't be deleted`
                                    },
                                    cb: () => handleDeleteSkillBehavior(row?.skill_behavior_id, 1)
                                })
                                closeModal('delete_skill_acquisition')
                            }}
                        />
                    </Suspense>
                ),
                onClose: resetState
            })
        }
    ]

    if (skillAcquisitionLoading) return <Skeleton flex={1} h={486}/>

    return (
        <EzCard
            title='Skill Acquisition'
            tooltip='Add Skill Acquisition'
            handleAdd={() => openModal({
                size: '80%',
                modalId: 'skill_acquisition',
                title: 'Add Skills Acquisition',
                children: (
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <SkillAcquisitionModal/>
                    </Suspense>
                ),
                onClose: resetState
            })}
        >
            <EzTable
                dataKey='skill_behavior_id'
                head={head}
                height={400}
                data={skillAcquisitionData}
                tdMap={tdMap}
                actions={actions}
            />
        </EzCard>
    )
}
