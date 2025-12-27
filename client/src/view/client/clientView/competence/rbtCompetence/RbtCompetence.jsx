import {IconEdit, IconGraph, IconTrash} from "@tabler/icons-react";
import {lazy, Suspense, useLayoutEffect} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";
import {CompetenceController} from "./../CompetenceController.js";
import EzCard from "@/ezMantine/card/EzCard.jsx";
import EzTable from "@/ezMantine/table/EzTable.jsx";
import CustomHeader from "./CustomHeader.jsx";
import {Skeleton} from "@mantine/core";
//dynamic imports
const RbtCompetenceModal = lazy(() => import('../_modal/RbtCompetenceModal.jsx'));
const GenericModal = lazy(() => import('@/components/modal/GenericModal.jsx'));

const head = ['Name', 'Baseline', 'Status', 'Effective Date', 'Actions'];
const tdMap = [
    'skill_behavior_name',
    'measure_baseline',
    'skill_behavior_status_name',
    'skill_behavior_start_date'
];

export default function RbtCompetence() {
    const {
        rbtCompetenceLoading,
        rbtCompetenceData,
        resetState,
    } = CompetenceController

    const actions = [
        {
            tooltip: 'Edit',
            icon: <IconEdit style={{width: '1.5rem'}} stroke={1}/>,
            aria: 'edit',
            onClick: (row) => openModal({
                size: '80%',
                modalId: 'rbt_competence',
                title: 'Edit RBT Competence',
                children: (
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <RbtCompetenceModal id={row['skill_behavior_id']}/>
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
                modalId: 'rbt_competence',
                title: 'Please confirm your action',
                children: (
                    <Suspense fallback={<EzLoader h={120}/>}>
                        <GenericModal
                            text={`Intervention: ${row?.maladaptive_behavior_name}`}
                            cancel={() => closeModal('rbt_competence')}
                            accept={() => {}}
                        />
                    </Suspense>
                ),
                onClose: resetState
            })
        }
    ]

    return (
        <EzCard customHeader={<CustomHeader/>}>
            {rbtCompetenceLoading
                ? <EzLoader h={400}/>
                : <EzTable
                    dataKey='skill_behavior_id'
                    head={head}
                    height={400}
                    data={rbtCompetenceData}
                    tdMap={tdMap}
                    actions={actions}
                />
            }
        </EzCard>
    )
}

RbtCompetence.propTypes = {}
