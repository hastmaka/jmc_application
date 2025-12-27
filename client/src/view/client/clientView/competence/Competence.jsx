import {lazy, Suspense, useLayoutEffect} from "react";
import EzGrid from "@/ezMantine/gridLayout/EzGrid.jsx";
import {CompetenceController} from "./CompetenceController.js";
import {Skeleton} from "@mantine/core";
//dynamic imports
const CaregiverCompetence = lazy(() => import("./caregiverCompetence/CaregiverCompetence.jsx"));
const RbtCompetence = lazy(() => import("./rbtCompetence/RbtCompetence.jsx"));

export default function Competence() {
    const {reloadView} = CompetenceController

    useLayoutEffect(() => {reloadView()}, []);

    return (
        <EzGrid
            gridTemplateColumns='repeat(auto-fill, minmax(1000px, 1fr))'
        >
            <Suspense fallback={<Skeleton height={346} radius='sm'/>}>
                <CaregiverCompetence/>
            </Suspense>
            <Suspense fallback={<Skeleton height={346} radius='sm'/>}>
                <RbtCompetence/>
            </Suspense>

        </EzGrid>
    )
}

Competence.propTypes = {}
