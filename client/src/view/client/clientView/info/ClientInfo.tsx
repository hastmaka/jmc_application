import EzGrid from "@/ezMantine/gridLayout/EzGrid.tsx";
import {lazy, Suspense, /*useLayoutEffect*/} from "react";
// import {InfoClientController} from "./InfoClientController.js";
import {Skeleton} from "@mantine/core";

export default function ClientInfo() {
    // const {refreshView} = InfoClientController
    // useLayoutEffect(() => {refreshView()}, []);

    return (
        <EzGrid
            gridTemplateColumns='repeat(auto-fill, minmax(480px, 1fr))'
        >
            {[
                lazy(() => import("./ClientPersonal.tsx")),
                lazy(() => import("./ClientDetail.tsx")),
                lazy(() => import("./ClientInsurance.tsx")),
                lazy(() => import("./ClientCaregiver.tsx")),
                lazy(() => import("./ClientAddress.tsx")),
                lazy(() => import("./ClientPhone.tsx")),
                lazy(() => import("./ClientTherapist.tsx"))
            ].map((Comp, index) => (
                <Suspense fallback={<Skeleton mih={346} radius='sm'/>} key={index}>
                    <Comp/>
                </Suspense>
            ))}
        </EzGrid>
    )
}

ClientInfo.propTypes = {}