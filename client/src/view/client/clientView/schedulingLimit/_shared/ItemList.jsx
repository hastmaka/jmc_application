import PropTypes from "prop-types";
import {Flex} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.jsx";
import ActionIconsToolTip from "@/components/ActionIconsToolTip.jsx";
import {IconEdit, IconTrash} from "@tabler/icons-react";
import {lazy, Suspense} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";
//dynamic imports
const ChangeHoursModal = lazy(() => import('../_modal/ChangeHoursModal.jsx'));

export default function ItemList({text, hours, modalId}) {

    const handleEditMaxHours = () => openModal({
        modalId,
        title: 'Edit Max Hours',
        size: 'xs',
        children: (
            <Suspense fallback={<EzLoader h={260}/>}>
                <ChangeHoursModal modalId={modalId}/>
            </Suspense>
        )
    })

    return (
        <li>
            <Flex p='.5rem 0' justify='space-between'>
                <EzText>{text} {hours}</EzText>
                <Flex gap={8}>
                    <ActionIconsToolTip
                        items={[{
                            icon: <IconEdit onClick={handleEditMaxHours} style={{width: '1.5rem'}} stroke={1}/>,
                            tooltip: 'Edit'
                        }, {
                            icon: <IconTrash style={{width: '1.5rem'}} stroke={1}/>,
                            tooltip: 'Delete'
                        }]}
                    />
                </Flex>
            </Flex>
        </li>
    )
}

ItemList.propTypes = {
    text: PropTypes.string.isRequired,
    hours: PropTypes.number.isRequired,
    modalId: PropTypes.string.isRequired
}
