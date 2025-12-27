import EzGrid from "@/ezMantine/gridLayout/EzGrid.jsx";
import {lazy, Suspense, useLayoutEffect} from "react";
import {SchedulingLimitController} from "./SchedulingLimitController.js";
import {Skeleton} from "@mantine/core";
//dynamic imports
const Daily = lazy(() => import('./daily/Daily.jsx'));
const Weekly = lazy(() => import('./weekly/Weekly.jsx'));

export default function SchedulingLimit() {
    const {reloadView} = SchedulingLimitController

    useLayoutEffect(() => {reloadView()}, []);

    return (
        <EzGrid
            gridTemplateColumns='repeat(auto-fill, minmax(600px, 1fr))'
        >
            <Suspense fallback={<Skeleton flex={1} h={360}/>}>
                <Daily/>
            </Suspense>
            <Suspense fallback={<Skeleton flex={1} h={360}/>}>
                <Weekly/>
            </Suspense>
        </EzGrid>
    )
}

SchedulingLimit.propTypes = {}
