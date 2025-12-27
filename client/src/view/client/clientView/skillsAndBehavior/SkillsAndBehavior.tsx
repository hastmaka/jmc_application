import EzGrid from "@/ezMantine/gridLayout/EzGrid.jsx";
import {lazy, Suspense, useLayoutEffect} from "react";
import {SkillsAndBehaviorController} from "./SkillsAndBehaviorController.js";
import {Skeleton} from "@mantine/core";
//dynamic imports
const MaladaptiveBehavior = lazy(() => import("./maladaptiveBehavior/MaladaptiveBehavior"));
// const ReplacementBehavior = lazy(() => import("./replacementBehavior/ReplacementBehavior.jsx"));
// const SkillAcquisition = lazy(() => import("./skillAcquisition/SkillAcquisition.jsx"));



export default function SkillsAndBehavior() {
    // const {clientId, reloadView} = SkillsAndBehaviorController
    //
    // useLayoutEffect(() => {
    //     reloadView()
    // }, [clientId, reloadView]);

    return (
        <EzGrid
            gridTemplateColumns='repeat(auto-fill, minmax(1000px, 1fr))'
        >
            <Suspense fallback={<Skeleton height={346} radius='sm'/>}>
                <MaladaptiveBehavior/>
                {/*<ReplacementBehavior/>*/}
                {/*<SkillAcquisition/>*/}
            </Suspense>
        </EzGrid>
    )
}

SkillsAndBehavior.propTypes = {}
