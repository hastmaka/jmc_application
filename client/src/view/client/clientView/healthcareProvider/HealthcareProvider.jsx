import {mockTableData} from "@/static/dummyData.js";
import {IconTrash} from "@tabler/icons-react";
import {lazy, Suspense, useLayoutEffect} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";
import {HealthcareProviderController} from "./HealthcareProviderController.js";
import EzCard from "@/ezMantine/card/EzCard.jsx";
import EzTable from "@/ezMantine/table/EzTable.jsx";
import {Skeleton} from "@mantine/core";
//dynamic imports
const GenericModal = lazy(() => import('@/components/modal/GenericModal.jsx'));
const HealthcareProviderModal = lazy(() => import('./_modal/HealthcareProviderModal.jsx'));

const head = ['Name', 'Provider', 'Phone','Speciality', 'Primary', 'Actions']
const tdMap = ['name', 'provider', 'phone', 'speciality', 'primary']
const data = mockTableData(tdMap, 1)

export default function HealthcareProvider() {
    const {
        healthcareProviderGetData,
        healthcareProviderLoading,
        healthcareProviderData,
        handleDeleteHealthcareProvider,
        resetState,
        modal,
    } = HealthcareProviderController

    useLayoutEffect(() => {healthcareProviderGetData().then()}, []);

    const actions = [
        {
            tooltip: 'Delete',
            icon: <IconTrash style={{width: '1.5rem'}} stroke={1}/>,
            aria: 'delete',
            onClick: (row) => openModal({
                size: 'sm',
                modalId: 'healthcare_provider',
                title: 'Please confirm your action',
                children: (
                    <Suspense fallback={<EzLoader h={120}/>}>
                        <GenericModal
                            text={`Delete: ${row?.name}`}
                            cancel={() => closeModal('healthcare_provider')}
                            accept={() => handleDeleteHealthcareProvider(row?.name)}
                        />
                    </Suspense>
                ),
                onClose: resetState
            })
        }
    ]

    if (healthcareProviderLoading) return <Skeleton flex={1} h={486}/>

    return (
        <EzCard
            container={{flex: 1}}
            title='Healthcare Providers'
            tooltip='Add Healthcare Provider'
            handleAdd={() => openModal({
                modalId: 'healthcare_provider',
                title: 'Choose Provider',
                children: (
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <HealthcareProviderModal/>
                    </Suspense>
                ),
                onClose: resetState
            })}
        >
            <EzTable
                dataKey='name'
                tableId='healthcare_provider'
                head={head}
                height='calc(100vh - 220px)'
                data={data}
                tdMap={tdMap}
                actions={actions}
            />
        </EzCard>
    )
}

HealthcareProvider.propTypes = {}
