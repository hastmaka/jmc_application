import {Flex} from "@mantine/core";
import {IconPlus} from "@tabler/icons-react";
import ActionIconsToolTip from "@/components/ActionIconsToolTip.jsx";
import EzText from "@/ezMantine/text/EzText.jsx";
import {lazy, Suspense, useLayoutEffect} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";
import {CompetenceController} from "../CompetenceController.js";
import CustomHeaderWrapper from "@/components/CustomHeaderWrapper.jsx";
import {EzSelect} from "@/ezMantine/select/EzSelect.jsx";
//dynamic imports
const RbtCompetenceModal = lazy(() => import('../_modal/RbtCompetenceModal.jsx'))

export default function CustomHeader() {
    const {
        resetState,
        recordId,
        activeRbt,
        setActiveRbt,
        clientRbtsGetData,
        clientRbtsData,
        clientRbtsLoading,
    } = CompetenceController

    useLayoutEffect(() => {clientRbtsGetData()}, [])

    const handleAddM = () => openModal({
        size: '80%',
        modalId: 'rbt_competence',
        title: 'Add RBT Competence',
        children: (
            <Suspense fallback={<EzLoader h={400}/>}>
                <RbtCompetenceModal/>
            </Suspense>
        ),
        onClose: resetState
    })

    return (
        <CustomHeaderWrapper>
            <EzText>RBT Competences</EzText>
            <Flex align='center' gap={16}>
                <EzSelect
                    w={250}
                    placeholder='Therapist'
                    clearable
                    loading={clientRbtsLoading}
                    data={clientRbtsData}
                    size='sm'
                    value={activeRbt}
                    onOptionSubmit={(v) => setActiveRbt(v)}
                />
                <ActionIconsToolTip
                    items={[{
                        tooltip: `Add RBT Competence`,
                        variant: 'outline',
                        icon: <IconPlus onClick={handleAddM}/>
                    }]}
                />
            </Flex>
        </CustomHeaderWrapper>
    )
}

CustomHeader.propTypes = {}
