import {mockTableData} from "@/static/dummyData.js";
import {IconPlus} from "@tabler/icons-react";
import {lazy, Suspense, useState} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";
import {DiagnosisController} from "../DiagnosisController.js";
import EzCard from "@/ezMantine/card/EzCard.jsx";
import EzTable from "@/ezMantine/table/EzTable.jsx";
import CustomHeader from "./CustomHeader.jsx";
import {Modal} from "@mantine/core";
//dynamic imports
const GenericModal = lazy(() => import('@/components/modal/GenericModal.jsx'));


const head = ['Code', 'Name', 'Actions'];
const tdMap = ['code', 'name'];
const data = mockTableData(tdMap, 5);

export default function DiagnosisModal() {
    const {resetState, modal, handleAddDiagnosis} = DiagnosisController
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')

    const actions = [
        {
            tooltip: 'Add Diagnosis',
            icon: <IconPlus style={{width: '1.5rem'}} stroke={1}/>,
            aria: 'add diagnosis',
            onClick: (row) => {
                setName(row.name)
                setOpen(true)
            }
        }
    ]

    return (
        <>
            <EzCard customHeader={<CustomHeader/>}>
                <EzTable
                    dataKey='code'
                    tableId='users'
                    head={head}
                    height='40vh'
                    data={data}
                    tdMap={tdMap}
                    actions={actions}
                />
            </EzCard>

            <Modal
                opened={open}
                centered
                onClose={() => setOpen(false)}
                title='Please confirm your action'
                size='sm'
                zIndex={1000}
            >
                <Suspense fallback={<EzLoader h={120}/>}>
                    <GenericModal
                        text={`Add: ${name} diagnosis`}
                        cancel={() => {
                            setOpen(false)
                            resetState()
                        }}
                        accept={() => handleAddDiagnosis(name)}
                    />
                </Suspense>
            </Modal>
        </>
    )
}
