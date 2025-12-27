import {Flex} from "@mantine/core";
import EzGroupBtn from "@/ezMantine/buttonGroup/EzGroupBtn.tsx";
import {lazy, Suspense, useMemo} from "react";
import {IconReportAnalytics} from "@tabler/icons-react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {DashboardModalController} from "@/view/dashboard/_modal/DashboardModalController.ts";

const DriverReportModal = lazy(() => import('./_modal/DriverReportModal.tsx'));

export default function DashboardToolBar() {
    const {clearModalState} = DashboardModalController;

    function handleDriverReport() {
        const modalId = 'driver-report-modal';
        window.openModal({
            modalId,
            title: "Create Driver Report",
            fullScreen: true,
            children: (
                <Suspense fallback={<EzLoader h={400}/>}>
                    <DriverReportModal modalId={modalId}/>
                </Suspense>
            ),
            onClose: clearModalState
        });
    }

    const ACTIONBTNS =
        useMemo(() => [
            // {
            //     icon: IconInfoCircle,
            //     label: 'pancho', //'Info Client',
            //     onClick: () => {}
            // },
            // {
            //     icon: IconCirclePlus,
            //     label: 'pancho', //'Add Client',
            //     onClick: () => {}
            // },
            {
                icon: IconReportAnalytics,
                label: 'Make Driver Report',
                onClick: handleDriverReport
            }
        ], [])

    return (
        <Flex justify='flex-end'>
            <EzGroupBtn ITEMS={ACTIONBTNS}/>
        </Flex>
    );
}