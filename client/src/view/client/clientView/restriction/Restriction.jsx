import {mockTableData} from "@/static/dummyData.js";
import {RestrictionController} from "./RestrictionController.js";
import {IconTrash} from "@tabler/icons-react";
import {lazy, Suspense, useLayoutEffect} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";
import EzCard from "@/ezMantine/card/EzCard.jsx";
import EzTable from "@/ezMantine/table/EzTable.jsx";
import {Skeleton} from "@mantine/core";
//dynamic imports
const RestrictionModal = lazy(() => import('./_modal/RestrictionModal.jsx'));
const GenericModal = lazy(() => import('@/components/modal/GenericModal.jsx'));

const head = ['Start Date', 'End Date', 'Description', 'Actions'];
const tdMap = ['start_date', 'end_date', 'description'];
const data = mockTableData(tdMap, 10)

export default function Restriction() {
    const {
        restrictionLoading,
        restrictionGetData,
        restrictionData,
        resetState,
        modal
    } = RestrictionController

    useLayoutEffect(() => {restrictionGetData()}, []);

    const actions = [
        // {
        //     tooltip: 'Edit User',
        //     icon: <IconEdit style={{width: '1.5rem'}} stroke={1}/>,
        //     aria: 'edit',
        //     onClick: () => openModal({
        //         modalId: 'abc',
        //         title: 'Edit Medication',
        //         size: 'lg',
        //         children: (
        //             <Suspense fallback={<EzLoader h={400}/>}>
        //                 <AbcModal/>
        //             </Suspense>
        //         ),
        //         onClose: resetState
        //     })
        // },
        {
            tooltip: 'Delete',
            icon: <IconTrash style={{width: '1.5rem'}} stroke={1}/>,
            aria: 'delete restriction',
            onClick: (row) => openModal({
                size: 'sm',
                modalId: 'restriction',
                title: 'Please confirm your action',
                children: (
                    <Suspense fallback={<EzLoader h={120}/>}>
                        <GenericModal
                            text={`ABC: ${row?.start_date}`}
                            cancel={() => closeModal('restriction')}
                            accept={async () => {}}
                        />
                    </Suspense>
                ),
                onClose: resetState
            })
        }
    ]

    if (restrictionLoading) return <Skeleton flex={1} h={486}/>

    return (
        <EzCard
            container={{flex: 1}}
            title='Restrictions'
            tooltip='Add Restriction'
            handleAdd={() => openModal({
                size: 'lg',
                modalId: 'restriction',
                title: 'Add Restriction',
                children: (
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <RestrictionModal/>
                    </Suspense>
                ),
                onClose: resetState
            })}
        >
            <EzTable
                dataKey='start_date'
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

Restriction.propTypes = {}
