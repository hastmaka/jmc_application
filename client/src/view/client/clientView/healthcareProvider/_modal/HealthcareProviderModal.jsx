import {mockTableData} from "@/static/dummyData.js";
import {IconPlus} from "@tabler/icons-react";
import {lazy, Suspense} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";
import {HealthcareProviderController} from ".././HealthcareProviderController.js";
import EzCard from "@/ezMantine/card/EzCard.jsx";
import EzTable from "@/ezMantine/table/EzTable.jsx";
import CustomHeader from "./CustomHeader.jsx";
//dynamic imports
const GenericModal = lazy(() => import('@/components/modal/GenericModal.jsx'));


const head = ['First Name', 'LastName', 'Speciality', 'Actions'];
const tdMap = ['first_name', 'last_name', 'speciality'];
const data = mockTableData(tdMap, 2);

export default function HealthcareProviderModal() {
    const {resetState, modal, handleAddHealthcareProvider} = HealthcareProviderController

    const actions = [
        {
            tooltip: 'Add Provider',
            icon: <IconPlus style={{width: '1.5rem'}} stroke={1}/>,
            aria: 'add provider',
            onClick: (row) => openModal({
                modalId: 'add-provider',
                title: 'Add Provider',
                size: 'sm',
                children: (
                    <Suspense fallback={<EzLoader h={120}/>}>
                        <GenericModal
                            text={`Add: ${name} provider`}
                            cancel={() => {
                                resetState()
                                closeModal('add-provider');
                            }}
                            accept={() => handleAddHealthcareProvider(name)}
                        />
                    </Suspense>
                ),
                onClose: resetState
            })
        }
    ]

    return (
        <EzCard customHeader={<CustomHeader/>}>
            <EzTable
                dataKey='first_name'
                tableId='healthcare_provider_list'
                head={head}
                height='40vh'
                data={data}
                tdMap={tdMap}
                actions={actions}
            />
        </EzCard>
    )
}
