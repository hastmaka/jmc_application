import {IconEdit, IconEye, IconFileTypePdf} from "@tabler/icons-react";
import {Group, Pill} from "@mantine/core";
import EzTable from "@/ezMantine/table/EzTable.tsx";
import {DashboardController} from "@/view/dashboard/DashboardController.ts";
import {DashboardModalController} from "@/view/dashboard/_modal/DashboardModalController.ts";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {lazy, Suspense} from "react";
import moment from "moment";
import u from '@/util'
import {ActionIconsToolTip} from "@/ezMantine/actionIconTooltip/ActionIconsToolTip.tsx";
import {pdfGenerator} from "@/components/pdfUtilities/PdfGenerator.tsx";
import {extractDriverReportData} from "@/view/dashboard/_pdf/extractDriverReportData.ts";

const DriverReportModal = 
    lazy(() => import('../_modal/DriverReportModal.tsx'));
const InspectionDetailsModal =
    lazy(() => import('../_modal/InspectionDetailsModal.tsx'));

export default function DriverTable() {
    const {inspectionData, inspectionLoading} = DashboardController;
    const {setCurrentInspectionId, clearModalState, resetState} = DashboardModalController;

    function handleOpenInspectionModal(inspectionId?: number) {
        setCurrentInspectionId(inspectionId);
        const modalId = 'driver-report-modal';
        window.openModal({
            modalId,
            title: "Edit Driver Report",
            fullScreen: true,
            children: (
                <Suspense fallback={<EzLoader h={400}/>}>
                    <DriverReportModal modalId={modalId} inspectionId={inspectionId}/>
                </Suspense>
            ),
            onClose: clearModalState
        });
    }

    function handleOpenDetailsModal(inspectionId: number) {
        const modalId = 'inspection-details-modal';
        window.openModal({
            modalId,
            title: "Inspection Details",
            fullScreen: true,
            children: (
                <Suspense fallback={<EzLoader h='calc(100dvh - 120px)'/>}>
                    <InspectionDetailsModal inspectionId={inspectionId}/>
                </Suspense>
            ),
            onClose: resetState
        });
    }
    const head = ['Driver', 'Car', 'Reservations', 'Start', 'End', 'Date', 'Miles', 'Gas Cost', 'Total', 'Actions'];

    const tdMap = [
        'employee_name',
        {
            name: 'car_name',
            render: (row: any) => {
                const vehicles = row.inspection_vehicles || [];
                const cars = vehicles.filter((v: any) => v.vehicle_car?.car_plate);
                if (!cars.length) return '-';
                return (
                    <Group gap={4} justify="center" align='center'>
                        {cars.map((v: any, i: number) => (
                            <Pill key={i} bg={v.vehicle_car?.car_color || 'gray'} c="black">
                                {v.vehicle_car?.car_plate}
                            </Pill>
                        ))}
                    </Group>
                );
            }
        },
        {
            name: 'reservation',
            render: (row: any) => {
                const vehicles = row.inspection_vehicles || [];
                const tripCount = vehicles.reduce((sum: number, v: any) =>
                    sum + (v.vehicle_reservations?.length || 0), 0);
                return tripCount || '-';
            }
        },
        {
            name: 'inspection_start_time',
            render: (row: any) =>
                row.inspection_start_time
                    ? moment(row.inspection_start_time, 'HH:mm:ss').format('h:mm A')
                    : '-'
        },
        {
            name: 'inspection_end_time',
            render: (row: any) =>
                row.inspection_end_time
                    ? moment(row.inspection_end_time, 'HH:mm:ss').format('h:mm A')
                    : '-'
        },
        {
            name: 'inspection_date',
            render: (row: any) => row.inspection_date ? moment(row.inspection_date).format('MM/DD/YYYY') : '-'
        },
        {
            name: 'inspection_total_miles',
            render: (row: any) => {
                const vehicles = row.inspection_vehicles || [];
                const totalMiles = vehicles.reduce((sum: number, v: any) => {
                    const start = parseInt(v.inspection_vehicle_odometer_start) || 0;
                    const end = parseInt(v.inspection_vehicle_odometer_end) || 0;
                    return sum + Math.max(0, end - start);
                }, 0);
                return totalMiles ? `${u.formatMoney(totalMiles, false)} mi` : '-';
            }
        },
        {
            name: 'inspection_gas_cost',
            render: (row: any) => {
                const vehicles = row.inspection_vehicles || [];
                const totalGas = vehicles.reduce((sum: number, v: any) =>
                    sum + (parseInt(v.inspection_vehicle_gas_cost) || 0), 0);
                return totalGas ? u.formatMoney(totalGas / 100) : '-';
            }
        },
        {
            name: 'inspection_grand_total',
            render: (row: any) => {
                const vehicles = row.inspection_vehicles || [];
                let grandTotal = 0;
                for (const v of vehicles) {
                    const reservations = v.vehicle_reservations || [];
                    for (const r of reservations) {
                        grandTotal += parseInt(r.reservation_total) || 0;
                    }
                }
                return grandTotal ? u.formatMoney(grandTotal / 100) : '-';
            }
        },
        {
            name: 'actions',
            render: (row: any) => (
                <ActionIconsToolTip
                    ITEMS={[
                        {
                            icon: (
                                <IconEye
                                    onClick={() => handleOpenDetailsModal(row.inspection_id)}
                                />
                            ),
                            tooltip: 'Details'
                        },
                        {
                            icon: (
                                <IconEdit
                                    onClick={() => {
                                        handleOpenInspectionModal(row.inspection_id)
                                    }}
                                />
                            ),
                            tooltip: 'Edit Car'
                        }, {
                            icon: (
                                <IconFileTypePdf
                                    onClick={() => pdfGenerator(
                                        'v1/inspection/' + row.inspection_id,
                                        EzLoader,
                                        extractDriverReportData
                                    )}
                                />
                            ),
                            tooltip: 'Driver Report'
                        }
                    ]}
                    justify='center'
                />
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