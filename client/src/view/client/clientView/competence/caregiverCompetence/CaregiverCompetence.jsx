import {lazy, Suspense, useLayoutEffect} from "react";
import EzCard from "@/ezMantine/card/EzCard.jsx";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";
import EzTable from "@/ezMantine/table/EzTable.jsx";
import {IconEdit, IconGraph, IconTrash} from "@tabler/icons-react";
import {CompetenceController} from "../CompetenceController.js";
import {Skeleton} from "@mantine/core";
//dynamic imports
const CaregiverCompetenceModal = lazy(() => import("../_modal/CaregiverCompetenceModal.jsx"));
const GenericModal = lazy(() => import('@/components/modal/GenericModal.jsx'));

const head = ['Name', 'Baseline', 'Status', 'Effective Date', 'Actions'];

const tdMap = [
    'skill_behavior_name',
    'measure_baseline',
    'skill_behavior_status_name',
    'skill_behavior_start_date'
];

export default function CaregiverCompetence() {
    const {
        caregiverCompetenceLoading,
        caregiverCompetenceGetData,
        caregiverCompetenceData,
        resetState,
        modal,
        handleDeleteSkillBehavior
    } = CompetenceController

    useLayoutEffect(() => {caregiverCompetenceGetData().then()}, []);

    const actions = [
        {
            tooltip: 'Edit',
            icon: <IconEdit style={{width: '1.5rem'}} stroke={1}/>,
            aria: 'edit',
            onClick: (row) => {
                modal.state = 'edit'
                openModal({
                    modalId: 'add_caregiver_competence',
                    title: 'Edit Caregiver Competence',
                    size: '80%',
                    children: (
                        <Suspense fallback={<EzLoader h={400}/>}>
                            <CaregiverCompetenceModal id={row['skill_behavior_id']}/>
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
                modalId: 'delete_caregiver_competence',
                title: 'Want to delete this record?',
                children: (
                    <Suspense fallback={<EzLoader h={120}/>}>
                        <GenericModal
                            text={`Intervention: ${row?.skill_behavior_name}`}
                            cancel={() => closeModal('caregiver_competence')}
                            accept={async () => {
                                await toast.U({
                                    modalId: 'delete_caregiver_competence',
                                    id: {
                                        title: 'Deleting',
                                        message: `Deleting ${row.get('skill_behavior_name')}...`,
                                    },
                                    update: {
                                        success: `Caregiver Competence deleted successfully`,
                                        error: `Caregiver Competence couldn't be deleted`
                                    },
                                    cb: () => handleDeleteSkillBehavior(row?.skill_behavior_id, 4)
                                })
                                closeModal('delete_caregiver_competence')
                            }}
                        />
                    </Suspense>
                ),
                onClose: resetState
            })
        }
    ]

    if (caregiverCompetenceLoading) return <Skeleton flex={1} h={486}/>

    return (
        <EzCard
            title='Caregiver Competences'
            tooltip='Add Caregiver Competence'
            handleAdd={() => openModal({
                size: '80%',
                modalId: 'add_caregiver_competence',
                title: 'Add Caregiver Competence',
                children: (
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <CaregiverCompetenceModal/>
                    </Suspense>
                ),
                onClose: resetState
            })}
        >
            <EzTable
                dataKey='skill_behavior_id'
                head={head}
                height={400}
                data={caregiverCompetenceData}
                tdMap={tdMap}
                actions={actions}
            />
        </EzCard>
    )
}

CaregiverCompetence.propTypes = {}
