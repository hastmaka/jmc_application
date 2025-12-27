import {mockTableData} from "@/static/dummyData.js";
import {PreferenceController} from "./PreferenceController.js";
import {IconEdit, IconTrash} from "@tabler/icons-react";
import {lazy, Suspense, useLayoutEffect} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";
import EzCard from "@/ezMantine/card/EzCard.jsx";
import EzTable from "@/ezMantine/table/EzTable.jsx";
import {Skeleton} from "@mantine/core";
//dynamic imports
const PreferenceModal = lazy(() => import('./_modal/PreferenceModal.jsx'));
const GenericModal = lazy(() => import('@/components/modal/GenericModal.jsx'));

const head = ['Name', 'Category', 'Sub Category', 'Start Date', 'End Date', 'Actions'];
const tdMap = [{
    name: 'name',
    w: '30%'
}, 'category', 'sub_category', 'start_date', 'end_date'];
const data = mockTableData(tdMap, 10)

export default function Preference() {
    const {
        preferenceGetData,
        preferenceData,
        preferenceLoading,
        resetState,
        modal,
        handleDelete
    } = PreferenceController

    useLayoutEffect(() => {preferenceGetData().then()}, []);

    const actions = [
        {
            tooltip: 'Edit',
            icon: <IconEdit style={{width: '1.5rem'}} stroke={1}/>,
            aria: 'edit',
            onClick: () => openModal({
                modalId: 'preference',
                title: 'Edit Preference',
                size: 'xl',
                children: (
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <PreferenceModal/>
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
                modalId: 'preference',
                title: 'Please confirm your action',
                children: (
                    <Suspense fallback={<EzLoader h={120}/>}>
                        <GenericModal
                            text={`Delete: ${row?.name} preference`}
                            cancel={() => closeModal('preference')}
                            accept={async () => handleDelete(row?.name)}
                        />
                    </Suspense>
                ),
                onClose: resetState
            })
        }
    ]

    if (preferenceLoading) return <Skeleton flex={1} h={486}/>

    return (
        <EzCard
            container={{flex: 1}}
            title='Preferences'
            tooltip='Add Preference'
            handleAdd={() => openModal({
                size: 'xl',
                modalId: 'preference',
                title: 'Add Preference',
                children: (
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <PreferenceModal/>
                    </Suspense>
                ),
                onClose: () => {}
            })}
        >
            <EzTable
                dataKey='name'
                tableId='preference'
                head={head}
                height='calc(100vh - 220px)'
                data={data}
                tdMap={tdMap}
                actions={actions}
            />
        </EzCard>
    )
}

Preference.propTypes = {}
