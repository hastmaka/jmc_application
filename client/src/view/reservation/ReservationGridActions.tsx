import EzMenu from "@/ezMantine/menu/EzMenu.tsx";
import {type ComponentType, lazy, Suspense, useMemo} from 'react';
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {ReservationModalController} from "./_modal/ReservationModalController.ts";
import GenericModal from "@/components/modal/GenericModal.tsx";
import {IconDotsVertical, IconDownload, IconEye, IconPencil, IconTag, IconTrash} from "@tabler/icons-react";
import {pdfGenerator} from "@/components/pdfUtilities/PdfGenerator.tsx";
import {LoginController} from "@/view/login/LoginController.ts";
import TestPdf from "@/components/pdfUtilities/TestPdf.tsx";
import EzText from "@/ezMantine/text/EzText.tsx";
import toast from "@/ezMantine/toast/toast.tsx";
import {extractDataFromRow} from "./_modal/pdfExport/pdfUtil/extractDataFromRow.ts";
import JMC from "./_modal/pdfExport/JMC.tsx";
import ClientFull from "./_modal/pdfExport/ClientFull.tsx";
import ClientSimple from "./_modal/pdfExport/ClientSimple.tsx";

// dynamic imports
// const AddEditReservation =
//     lazy(() => import('./_modal/AddEditReservation.tsx'))
const ReservationDetails =
    lazy(() => import('./_modal/ReservationDetails.tsx'))
const AddEditReservationNew =
    lazy(() => import('./_modal/AddEditReservationNew.tsx'))

function ReservationGridActions({/*state,*/ row}: { state: any, row: any }) {
    const {resetState, handleDeleteReservation} = ReservationModalController
    const {user} = LoginController

    function handleEditClient() {
        const modalId = 'edit-reservation-modal';
        window.openModal({
            modalId,
            title: "Create Reservation",
            fullScreen: true,
            children: (
                <Suspense fallback={<EzLoader h='100vh'/>}>
                    <AddEditReservationNew modalId={modalId} id={row.reservation_id}/>
                </Suspense>
            ),
            onClose: resetState
        })
    }

    function handleSeeDetails() {
        const modalId = 'reservation-details-modal';
        const chapterOrder = row.reservation_charter_order
        window.openModal({
            modalId,
            title: `${row.reservation_passenger_name} | Reservation Details: ${row.select_service_type?.label} | Charter Order: ${chapterOrder}`,
            size: '60%',
            children: (
                <GenericModal
                    cancel={() => window.closeModal(modalId)}
                    label={{cancel: 'Close'}}
                >
                    <Suspense fallback={null}>
                        <ReservationDetails reservationId={row.reservation_id}/>
                    </Suspense>
                </GenericModal>
            ),
            onClose: () => {
            }
        })
    }

    function handleDeleteReservationM() {
        const modalId = 'delete-confirmation-modal'
        window.openModal({
            modalId,
            title: 'Delete Reservation',
            size: 'sm',
            children: (
                <GenericModal
                    cancel={() => window.closeModal(modalId)}
                    accept={async () => {
                        return await toast.U({
                            modalId,
                            id: {
                                title: 'Deleting reservation',
                                message: 'Please wait...',
                            },
                            update: {
                                success: 'Reservation was deleted successfully.',
                                error: 'Something went wrong while deleting the reservation.',
                            },
                            cb: () => handleDeleteReservation(row.reservation_id, modalId)
                        })
                    }}
                >
                    <EzText>Delete the reservation for <EzText component='span' fw='xl'>"{row.reservation_passenger_name}"</EzText>?.</EzText>
                </GenericModal>
            ),
            onClose: () => {}
        })
    }

    async function handlePdfGenerator(template: ComponentType, download?: boolean, filePrefix?: string) {
        const charterOrder = row.reservation_charter_order || row.reservation_id;
        const fileName = filePrefix ? `${filePrefix}_${charterOrder}.pdf` : undefined;

        return await window.toast.U({
            id: {
                title: download ? "Downloading PDF" : "Export PDF",
                message: "Please wait",
            },
            update: {
                success: download ? 'PDF downloaded.' : 'PDF exported successfully.',
                error: download ? 'PDF download failed.' : 'PDF export failed.',
            },
            cb: () => pdfGenerator(
                'v1/reservation/' + row.reservation_id,
                template,
                extractDataFromRow,
                download,
                fileName
            )
        });
    }

    const ITEMS = useMemo(() => [
        ...(user.user_email === 'cluis132@yahoo.com'
                ? [
                    {
                        icon: <IconTag />,
                        label: 'Test PDF',
                        onClick: () => {
                            window.openModal({
                                modalId: 'test-pdf',
                                title: 'Test PDF',
                                fullScreen: true,
                                children: (
                                    <TestPdf
                                        url={`v1/reservation/${row.reservation_id}`}
                                        extractor={extractDataFromRow}
                                        template={[JMC, ClientFull, ClientSimple]}
                                    />
                                ),
                                onClose: () => {}
                            })
                        }
                    }
                ]
                : []
        ),
        // Preview PDFs
        {
            icon: <IconEye size={18} />,
            label: 'Preview Charter Order',
            onClick: () => handlePdfGenerator(JMC)
        },
        {
            icon: <IconEye size={18} />,
            label: 'Preview Conf. Client',
            onClick: () => handlePdfGenerator(ClientFull)
        },
        {
            icon: <IconEye size={18} />,
            label: 'Preview Conf. JMC',
            onClick: () => handlePdfGenerator(ClientSimple)
        },
        // Download PDFs
        {
            icon: <IconDownload size={18} />,
            label: 'Download Charter Order',
            onClick: () => handlePdfGenerator(JMC, true, 'Charter_Order')
        },
        {
            icon: <IconDownload size={18} />,
            label: 'Download Conf. Client',
            onClick: () => handlePdfGenerator(ClientFull, true, 'Conf_Client')
        },
        {
            icon: <IconDownload size={18} />,
            label: 'Download Conf. JMC',
            onClick: () => handlePdfGenerator(ClientSimple, true, 'Conf_JMC')
        },
        {
            icon: <IconEye size={18} />,
            label: 'Details',
            onClick: handleSeeDetails
        },
        {
            icon: <IconPencil size={18} />,
            label: 'Edit Reservation',
            onClick: handleEditClient
        },
        {
            icon: <IconTrash size={18} />,
            label: 'Delete Reservation',
            onClick: handleDeleteReservationM
        }
    ], [row]);

    return (
        <EzMenu
            target={<IconDotsVertical/>}
            ITEMS={ITEMS}
            trigger='hover'
        />
    )
}

export default ReservationGridActions;