import {Flex} from "@mantine/core";
import EzGroupBtn from "@/ezMantine/buttonGroup/EzGroupBtn.tsx";
import {lazy, Suspense, useMemo} from "react";
import {IconReportAnalytics, IconChartBar} from "@tabler/icons-react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {DashboardModalController} from "@/view/dashboard/_modal/DashboardModalController.ts";

const DriverReportModal = lazy(() => import('./_modal/DriverReportModal.tsx'));
const MonthlySummaryModal = lazy(() => import('./_modal/MonthlySummaryModal.tsx'));

export default function DashboardToolBar() {
    const {clearModalState} = DashboardModalController;

    function handleMonthlySummary() {
        const modalId = 'monthly-summary-modal';
        window.openModal({
            modalId,
            title: "Monthly Summary",
            fullScreen: true,
            children: (
                <Suspense fallback={<EzLoader h={400}/>}>
                    <MonthlySummaryModal />
                </Suspense>
            ),
            onClose: () => {}
        });
    }

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
            {
                icon: IconChartBar,
                label: 'Monthly Summary',
                onClick: handleMonthlySummary
            },
            {
                icon: IconReportAnalytics,
                label: 'Add Driver Report',
                onClick: handleDriverReport
            }
        ], [])

    return (
        <Flex justify='flex-end'>
            <EzGroupBtn ITEMS={ACTIONBTNS}/>
        </Flex>
    );
}