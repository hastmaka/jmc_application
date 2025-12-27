import SchedulingLimitCard from "../_shared/SchedulingLimitCard.jsx";
import {SchedulingLimitController} from "../SchedulingLimitController.js";
import {useLayoutEffect} from "react";
import {Skeleton} from "@mantine/core";

export default function Weekly() {
    const {
        weeklyData,
        weeklyLoading,
        weeklyGetData,
        resetState,
    } = SchedulingLimitController

    useLayoutEffect(() => {
        weeklyGetData().then()
    }, [weeklyGetData, weeklyLoading])

    if (weeklyLoading) return <Skeleton flex={1} h={360}/>

    return (
        <SchedulingLimitCard
            data={weeklyData}
            title='Weekly'
            maxHours={40}
            modalId='weekly'
        />
    )
}

Weekly.propTypes = {}
