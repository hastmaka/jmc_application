import PropTypes from "prop-types";
import classes from './Approval.module.scss'
import {ApprovalController} from "./ApprovalController.js";
import {IconEdit, IconTrash} from "@tabler/icons-react";
import {lazy, Suspense, useLayoutEffect} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";
import ApprovalModal from "./_modal/ApprovalModal.jsx";
import EzCard from "@/ezMantine/card/EzCard.jsx";
import EzTable from "@/ezMantine/table/EzTable.jsx";
import {mockTableData} from "@/static/dummyData.js";
import {Skeleton} from "@mantine/core";
//dynamic imports
const GenericModal = lazy(() => import('@/components/modal/GenericModal.jsx'));

const head = ['Start Date', 'End Date', 'Procedure', 'Number', 'Units', 'Available Units', 'Insurance', 'Actions']
const tdMap = ['approval_start_date', 'approval_end_date', 'approval_procedure', 'approval_number', 'approval_units', 'approval_available_units', 'approval_insurance']

const data = mockTableData(tdMap, 20)

export default function Approval() {
    const {
        approvalLoading,
        approvalGetData,
        approvalData,
        resetState,
        modal
    } = ApprovalController

    useLayoutEffect(() => {approvalGetData()}, []);

    const actions = [
        {
            tooltip: 'Edit',
            icon: <IconEdit style={{width: '1.5rem'}} stroke={1}/>,
            aria: 'edit',
            onClick: () => openModal({
                modalId: 'approval',
                title: 'Edit Maladaptive Behavior',
                children: (
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <ApprovalModal/>
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
                modalId: 'approval',
                title: 'Please confirm your action',
                children: (
                    <Suspense fallback={<EzLoader h={120}/>}>
                        <GenericModal
                            text={`Approval: ${row?.approval_start_date}`}
                            cancel={() => closeModal('approval')}
                            accept={async () => {}}
                        />
                    </Suspense>
                ),
                onClose: resetState
            })
        }
    ]

    if (approvalLoading) return <Skeleton flex={1} h={486}/>

    return (
        <EzCard
            container={{flex: 1}}
            title='Approvals'
            tooltip='Add Approval'
            handleAdd={() => openModal({
                size: '50%',
                modalId: 'approval',
                title: 'New Approval',
                children: (
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <ApprovalModal/>
                    </Suspense>
                ),
                onClose: resetState
            })}
        >
            <EzTable
                dataKey='approval_start_date'
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

Approval.propTypes = {}
