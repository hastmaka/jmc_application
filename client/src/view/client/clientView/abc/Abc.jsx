import {mockTableData} from "@/static/dummyData.js";
import {AbcController} from "./AbcController.js";
import {IconEdit, IconTrash} from "@tabler/icons-react";
import {lazy, Suspense, useLayoutEffect} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";
import EzCard from "@/ezMantine/card/EzCard.jsx";
import EzTable from "@/ezMantine/table/EzTable.jsx";
import {Skeleton} from "@mantine/core";
//dynamic imports
const AbcModal = lazy(() => import('./_modal/AbcModal.jsx'));
const GenericModal = lazy(() => import('@/components/modal/GenericModal.jsx'));

const head = ['Antecedent', 'Behavior', 'Consequence', 'Date', 'Actions'];
const tdMap = ['antecedent', 'behavior', 'consequence', 'date'];
const data = mockTableData(tdMap, 10)

export default function Abc() {
    const {
        abcGetData,
        abcData,
        abcLoading,
        resetState,
        modal
    } = AbcController

    useLayoutEffect(() => {abcGetData()}, []);

    const actions = [
        {
            tooltip: 'Edit',
            icon: <IconEdit style={{width: '1.5rem'}} stroke={1}/>,
            aria: 'edit',
            onClick: () => openModal({
                modalId: 'abc',
                title: 'Edit Medication',
                size: 'lg',
                children: (
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <AbcModal/>
                    </Suspense>
                ),
                onClose: resetState
            })
        },
        {
            tooltip: 'Delete',
            icon: <IconTrash style={{width: '1.5rem'}} stroke={1}/>,
            aria: 'delete abc',
            onClick: (row) => openModal({
                size: 'sm',
                modalId: 'abc',
                title: 'Please confirm your action',
                children: (
                    <Suspense fallback={<EzLoader h={120}/>}>
                        <GenericModal
                            text={`ABC: ${row?.antecedent}`}
                            cancel={() => closeModal('abc')}
                            accept={() => {}}
                        />
                    </Suspense>
                ),
                onClose: resetState
            })
        }
    ]

    if (abcLoading) return <Skeleton flex={1} h={486}/>

    return (
        <EzCard
            container={{flex: 1}}
            title='ABC'
            tooltip='Add ABC'
            handleAdd={() => openModal({
                size: 'lg',
                modalId: 'abc',
                title: 'Add ABC',
                children: (
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <AbcModal/>
                    </Suspense>
                ),
                onClose: resetState
            })}
        >
            <EzTable
                dataKey='antecedent'
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

Abc.propTypes = {}
