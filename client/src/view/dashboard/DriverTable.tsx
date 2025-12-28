import {ActionIcon, Tooltip} from "@mantine/core";
import {IconEdit} from "@tabler/icons-react";
import EzTable from "@/ezMantine/table/EzTable.tsx";
import {DashboardController} from "@/view/dashboard/DashboardController.ts";
import {DashboardModalController} from "@/view/dashboard/_modal/DashboardModalController.ts";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {lazy, Suspense, useLayoutEffect} from "react";

const DriverReportModal = lazy(() => import('./_modal/DriverReportModal.tsx'));

export default function DriverTable() {
    const {inspectionData, inspectionGetData, inspectionLoading} = DashboardController;
    const {setCurrentInspectionId, clearModalState} = DashboardModalController;

    useLayoutEffect(() => {
        inspectionGetData().then()
    }, []);

    function handleOpenInspectionModal(inspectionId?: number) {
        setCurrentInspectionId(inspectionId);
        const modalId = 'driver-report-modal';
        window.openModal({
            modalId,
            title: inspectionId ? "Edit Driver Report" : "Create Driver Report",
            fullScreen: true,
            children: (
                <Suspense fallback={<EzLoader h={400}/>}>
                    <DriverReportModal modalId={modalId} inspectionId={inspectionId}/>
                </Suspense>
            ),
            onClose: clearModalState
        });
    }

    const head = ['Date', 'Driver', 'Car', 'Start', 'End', 'Miles', 'Gas Cost', 'Total', ''];

    const tdMap = [
        'inspection_date',
        'employee_name',
        'car_name',
        'inspection_start_time',
        'inspection_end_time',
        'inspection_total_miles',
        {
            name: 'inspection_gas_cost',
            render: (row: any) => `$${(parseFloat(row.inspection_gas_cost) || 0).toFixed(2)}`
        },
        {
            name: 'inspection_grand_total',
            render: (row: any) => `$${(parseFloat(row.inspection_grand_total) || 0).toFixed(2)}`
        },
        {
            name: 'actions',
            render: (row: any) => (
                <Tooltip label="Edit">
                    <ActionIcon
                        variant="subtle"
                        size="sm"
                        onClick={() => handleOpenInspectionModal(row.inspection_id)}
                    >
                        <IconEdit size={14}/>
                    </ActionIcon>
                </Tooltip>
            )
        }
    ];

    if (inspectionLoading) return <EzLoader h={300}/>

    return (
        <EzTable
            head={head}
            tdMap={tdMap}
            data={inspectionData || []}
            dataKey='inspection_id'
        />
    );
}