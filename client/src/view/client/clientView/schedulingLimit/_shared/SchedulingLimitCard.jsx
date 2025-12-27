import PropTypes from "prop-types";
import {Flex, Stack} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.jsx";
import EzButton from "@/ezMantine/button/EzButton.jsx";
import EzCard from "@/ezMantine/card/EzCard.jsx";
import Header from "./Header.jsx";
import ItemList from "./ItemList.jsx";
import {createElement, lazy, Suspense} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";
import {IconEdit} from "@tabler/icons-react";
import ActionIconsToolTip from "@/components/ActionIconsToolTip.jsx";
import {capitalizeFirstLetter} from "@/util/index.js";
//dynamic imports
const DailyModal = lazy(() => import('../_modal/DailyModal.jsx'));
const WeeklyModal = lazy(() => import('../_modal/WeeklyModal.jsx'));
const ChangeHoursModal = lazy(() => import('../_modal/ChangeHoursModal.jsx'));

const modalMap = {
    daily: DailyModal,
    weekly: WeeklyModal
}

export default function SchedulingLimitCard({data, title, maxHours, modalId}) {

    const handleChangeMaxHours = () => openModal({
        modalId,
        title: `Change ${capitalizeFirstLetter(modalId)} Max Hours`,
        size: 'xs',
        children: (
            <Suspense fallback={<EzLoader h={260}/>}>
                <ChangeHoursModal modalId={modalId}/>
            </Suspense>
        ),
        onClose: () => {}
    })

    return (
        <EzCard
            customHeader={<Header title={title}/>}
            container={{mih: 360}}
            innerContainer={{display: 'flex', flex: 1}}
        >
            <Stack flex={1} justify='space-between'>
                <Stack gap={4}>
                    <Flex gap={16}>
                        <EzText>Total Max Hours: {maxHours}</EzText>
                        <ActionIconsToolTip
                            items={[{
                                icon: <IconEdit onClick={handleChangeMaxHours} style={{width: '1.5rem'}} stroke={1}/>,
                                tooltip: 'Edit Daily Hours'
                            }]}
                        />
                    </Flex>

                    <ul>
                        {data.map((item, index) =>
                            <ItemList key={index} {...item} modalId={modalId}/>
                        )}
                    </ul>

                </Stack>

                <Flex justify='flex-end'>
                    <EzButton
                        onClick={() => openModal({
                            modalId,
                            size: 'lg',
                            title: 'Add Limit',
                            children: (
                                <Suspense fallback={<EzLoader h={260}/>}>
                                    {createElement(modalMap[modalId])}
                                </Suspense>
                            ),
                            onClose: () => {}
                        })}
                    >Add Limit</EzButton>
                </Flex>
            </Stack>
        </EzCard>
    )
}

SchedulingLimitCard.propTypes = {
    data: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    maxHours: PropTypes.number.isRequired,
    modalId: PropTypes.string.isRequired,
}
