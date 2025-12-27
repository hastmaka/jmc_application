import SchedulingLimitCard from "../_shared/SchedulingLimitCard.jsx";
import {SchedulingLimitController} from "../SchedulingLimitController.js";
import {useLayoutEffect} from "react";
import {Skeleton} from "@mantine/core";

export default function Daily() {
    const {
        dailyData,
        dailyLoading,
        dailyGetData,
        resetState,
    } = SchedulingLimitController

    useLayoutEffect(() => {dailyGetData().then()}, [])

    if (dailyLoading) return <Skeleton flex={1} h={360}/>

    return (
        <SchedulingLimitCard
            data={dailyData}
            title='Daily'
            maxHours={8}
            modalId='daily'
        />
    )
}

Daily.propTypes = {}
