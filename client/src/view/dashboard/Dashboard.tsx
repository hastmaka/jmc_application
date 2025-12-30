import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import EzLoader from '@/ezMantine/loader/EzLoader.tsx'
import {Flex, Stack} from "@mantine/core";
import {lazy, Suspense} from "react";
import DashboardToolBar from "@/view/dashboard/DashboardToolBar.tsx";

const Fuel = lazy(() => import('./fuel/Fuel.tsx'))
const Miles = lazy(() => import('./miles/Miles.tsx'))
const Driver = lazy(() => import('./driver/Driver.tsx'))

function Dashboard() {
    return (
        <Stack style={{width: "100%", height: "100%", maxWidth: "1600px", margin: "0 auto"}}>
            <DashboardToolBar/>
            <Stack>
                <Flex gap={16}>
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <Fuel/>
                    </Suspense>
                    <Suspense fallback={<EzLoader h={400}/>}>
                        <Miles/>
                    </Suspense>
                </Flex>
                <Suspense fallback={<EzLoader h={400}/>}>
                    <Driver/>
                </Suspense>
            </Stack>
        </Stack>
    );
}

export default Dashboard;