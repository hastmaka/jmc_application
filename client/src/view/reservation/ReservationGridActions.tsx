import EzMenu from "@/ezMantine/menu/EzMenu.tsx";
import {lazy, Suspense, useMemo} from 'react';
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {ReservationModalController} from "./_modal/ReservationModalController.ts";
import GenericModal from "@/components/modal/GenericModal.tsx";
import {IconDotsVertical, IconEye, IconFileTypePdf, IconPencil, IconTag, IconTrash} from "@tabler/icons-react";
import {pdfGenerator} from "@/view/reservation/_modal/pdfExport/PdfGenerator.tsx";
import {LoginController} from "@/view/login/LoginController.ts";
import TestPdf from "@/view/reservation/_modal/pdfExport/pdfUtil/TestPdf.tsx";
import EzText from "@/ezMantine/text/EzText.tsx";
import toast from "@/ezMantine/toast/toast.tsx";

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
            title: `${row.reservation_passenger_name} | Reservation Details: ${row.reservation_service_type} | Charter Order: ${chapterOrder}`,
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
                                children: <TestPdf id={row.reservation_id}/>,
                                onClose: () => {}
                            })
                        }
                    }
                ]
                : []
        ),
        {
            icon: <IconFileTypePdf size={18} />,
            label: 'Exp. Charter Order',
            onClick: async () => {
                return await window.toast.U({
                    id: {
                        title: "Export PDF",
                        message: "Please wait",
                    },
                    update: {
                        success: 'Pdf exported successfully.',
                        error: 'Pdf exported failed',
                    },
                    cb: async () => {
                        await pdfGenerator(row.reservation_id, 'c_order')
                    }
                })
            }
        },
        {
            icon: <IconFileTypePdf size={18} />,
            label: 'Exp. Conf. Client',
            onClick: async () => {
                return await window.toast.U({
                    id: {
                        title: "Export PDF",
                        message: "Please wait",
                    },
                    update: {
                        success: 'Pdf exported successfully.',
                        error: 'Pdf exported failed',
                    },
                    cb: async () => {
                        await pdfGenerator(row.reservation_id, 'conf_brake')
                    }
                })
            }
        },
        {
            icon: <IconFileTypePdf size={18} />,
            label: 'Exp. Conf. JMC',
            onClick: async () => {
                return await window.toast.U({
                    id: {
                        title: "Export PDF",
                        message: "Please wait",
                    },
                    update: {
                        success: 'Pdf exported successfully.',
                        error: 'Pdf exported failed',
                    },
                    cb: async () => {
                        await pdfGenerator(row.reservation_id, 'conf')
                    }
                })
            }
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