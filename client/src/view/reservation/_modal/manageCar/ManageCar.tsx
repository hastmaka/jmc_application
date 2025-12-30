import GenericModal from "@/components/modal/GenericModal.tsx";
import {Group} from "@mantine/core";
import EzGroupBtn from "@/ezMantine/buttonGroup/EzGroupBtn.tsx";
import {lazy, Suspense, useLayoutEffect, useMemo} from "react";
import {IconArrowLeft, IconChartFunnel, IconEye, IconEdit, IconPlus, IconTrash} from "@tabler/icons-react";
import {ReservationModalController} from "../ReservationModalController.ts";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import EzTable from "@/ezMantine/table/EzTable.tsx";
import {ActionIconsToolTip} from "@/ezMantine/actionIconTooltip/ActionIconsToolTip.tsx";
import EzMenu from "@/ezMantine/menu/EzMenu.tsx";
import AddEditCarModal from "@/view/reservation/_modal/manageCar/AddEditCarModal.tsx";
import EzText from "@/ezMantine/text/EzText.tsx";
import ImageOnHover from "@/components/ImageOnHover.tsx";
import u from "@/util";
// dynamic imports
const CarDetailsModal =
    lazy(() => import("./CarDetailsModal.tsx"));

export default function ManageCar() {
    const {
        carGetData,
        carData,
        carLoading,
        isAddingOrEditing,
        handleIsAddingOrEditing,
        handleBackMangeCar,
        handleDeleteCar,
        handleChangeStatus
    } = ReservationModalController

    useLayoutEffect(() => {carGetData().then()}, [])

    function handleDelete(row: any) {
        const make = u.capitalizeWords(row.car_make),
            model = u.capitalizeWords(row.car_model),
            year = row.car_year.substring(0,4);
        const carName = `${make} ${model} ${year}`;
        const modalId = 'confirm-delete-car'
        window.openModal({
            modalId,
            title: 'Confirm action.',
            size: 'sm',
            children: (
                <GenericModal
                    accept={async () => {
                        return await window.toast.U({
                            modalId,
                            id: {
                                title: 'Deleting car',
                                message: 'Please wait...'
                            },
                            update: {
                                success: 'Car was deleted successfully',
                                error: `Failed to delete car.`
                            },
                            cb: () => {
                                handleDeleteCar(row.car_id)
                                window.closeModal(modalId)
                            }
                        })
                    }}
                    cancel={() => window.closeModal(modalId)}
                >
                    <EzText>
                        Are you sure want to delete {carName}?
                    </EzText>
                </GenericModal>
            ),
            onClose: () => {}
        })
    }

    function handleSeeDetails(row: any) {
        const modalId = 'car-details-modal';
        window.openModal({
            modalId,
            title: `${row.car_name} Details`,
            size: '60%',
            children: (
                <GenericModal
                    cancel={() => window.closeModal(modalId)}
                    label={{cancel: 'Close'}}
                >
                    <Suspense fallback={null}>
                        <CarDetailsModal carId={row.car_id}/>
                    </Suspense>
                </GenericModal>
            ),
            onClose: () => {}
        })
    }

    const head = ['Image', 'Make', 'Model', 'Year', 'Capacity', 'Licence Plate', 'Status', 'Actions']
    const tdMap = [
        {
            name: 'car_image_url',
            render: (row: any) => {
                const imageUrl = row?.car_document_image?.[0]?.document_url
                if (!imageUrl) return null
                return (
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <ImageOnHover
                            imageUrl={imageUrl}
                        />
                    </div>
                )
            }
        },
        {
            name: 'car_make',
            render: (row: any) => {
                return u.capitalizeWords(row.car_make)
            }
        },
        {
            name: 'car_model',
            render: (row: any) => {
                return u.capitalizeWords(row.car_model)
            }
        },
        {
            name: 'car_year',
            render: (row: any) => {
                return row.car_year.substring(0,4)
            }
        },
        'car_capacity',
        'car_plate',
        {
            name: 'select_status',
            render: (row: any) => {
                return (
                    <Group justify="center">
                        <EzMenu
                            trigger='hover'
                            onItemClick={async (item:any) => {
                                if (item.label !== row.select_status?.label) {
                                    const car_id = row.car_id
                                    return await window.toast.U({
                                        modalId: 'manage-car-modal',
                                        id: {
                                            title: 'Updating status',
                                            message: 'Please wait...'
                                        },
                                        update: {
                                            success: 'Car Status was updated successfully',
                                            error: `Failed to update car status..`
                                        },
                                        cb: () => handleChangeStatus(item.value, car_id)
                                    })
                                }
                            }}
                            target={<IconChartFunnel/>}
                            url='v1/asset/car_status'
                        />
                        <span>{row.select_status?.label}</span>
                    </Group>
                )
            }
        },
        {
            name: 'actions',
            render: (row: any) => {
                return (
                    <ActionIconsToolTip
                        ITEMS={[
                            {
                                icon: (
                                    <IconEye
                                        onClick={() => handleSeeDetails(row)}
                                    />
                                ),
                                tooltip: 'Details'
                            },
                            {
                                icon: (
                                    <IconEdit
                                        onClick={() => {
                                            handleIsAddingOrEditing('carId', row.car_id)
                                        }}
                                    />
                                ),
                                tooltip: 'Edit Car'
                            }, {
                                icon: (
                                    <IconTrash
                                        onClick={() => handleDelete(row)}
                                    />
                                ),
                                tooltip: 'Delete Car'
                            }
                        ]}
                        justify='center'
                    />
                )
            }
        }
    ]

    const LEFTBTNS =
        useMemo(() => [
            {
                icon: IconArrowLeft,
                label: 'Back',
                onClick: handleBackMangeCar
            }
        ], [])
    const RIGHTBTNS =
        useMemo(() => [
            {
                icon: IconPlus,
                label: 'Add Car',
                onClick: () => handleIsAddingOrEditing('carId', null)
            }
        ], [])

    if (carLoading) return <EzLoader h='calc(100vh -180px)'/>

    return (
        <GenericModal wrapperProps={{p:`0 .5rem ${isAddingOrEditing ? 4.25 : 2}rem 1rem`, flex: 1}}>
            <Group
                justify={isAddingOrEditing ? 'space-between' : 'flex-end'}
                gap={8}
                pr={8}
            >
                {isAddingOrEditing && <EzGroupBtn ITEMS={LEFTBTNS}/>}
                {!isAddingOrEditing && <EzGroupBtn ITEMS={RIGHTBTNS}/>}
            </Group>

            {isAddingOrEditing
                ? <AddEditCarModal modalId='manage-car-modal'/>
                : (
                    <EzTable
                        height='calc(100vh - 160px)'
                        head={head}
                        data={carData}
                        tdMap={tdMap}
                        dataKey='car_id'
                    />
                )
            }
        </GenericModal>
    );
}