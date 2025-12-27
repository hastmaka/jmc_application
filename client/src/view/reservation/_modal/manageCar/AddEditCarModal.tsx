import FormGenerator from "@/components/form/FormGenerator.tsx";
import SaveCancelDeleteBtns from "@/components/SaveCancelDeleteBtns.tsx";
import {FileButton, Stack} from "@mantine/core";
import {ReservationModalController} from "../ReservationModalController.ts";
import {useLayoutEffect, useMemo, useRef} from "react";
import EzText from "@/ezMantine/text/EzText.tsx";
import {IconPhotoPlus} from "@tabler/icons-react";
import EzButton from "@/ezMantine/button/EzButton.tsx";
import ImageGrid from "@/components/ImageGrid.tsx";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";

export default function AddEditCarModal({
    modalId
} : {
    modalId: string;
}) {
    const resetRef = useRef<() => void>(null);
    const {
        formData,
        errors,
        handleInput,
        // checkRequired,
        modal,
        addCarDocument,
        removeCarDocument,
        modalData,
        carId,
        handleSaveCar,
        handleEditCar
    } = ReservationModalController
    const _car_image_url = formData?.car?.car_document_image || []
    const images = formData.carFiles
        ? [...formData.carFiles, ..._car_image_url]
        : _car_image_url

    const CARFIELDS =
        useMemo(() => [
            {
                name: 'car_make',
                label: 'Car make',
                required: true,
            },
            {
                name: 'car_model',
                label: 'Model',
                required: true,
            },
            {
                name: 'car_year',
                label: 'Year',
                type: 'year',
                required: true,
                maxDate: new Date()
            },
            {
                name: 'car_capacity',
                label: 'Capacity',
                type: 'number',
                required: true,
            },
            {
                name: 'car_plate',
                label: 'Plate',
                required: true,
            },
            {
                name: 'car_color',
                label: 'Color',
            },
            {
                name: 'car_vin',
                label: 'Vin',
            },
            {
                name: 'car_status',
                label: 'Status',
                type: 'select',
                fieldProps: {
                    url: 'v1/asset/car_status',
                }
            },
            {
                name: 'car_type',
                label: 'Type',
                type: 'select',
                fieldProps: {
                    url: 'v1/asset/car_type',
                }
            },
            {
                name: 'car_inspection_date',
                label: 'Inspection Date',
                type: 'date',
            },
            {
                name: 'car_registration_expiration',
                label: 'Registration Expiration Date',
                type: 'date',
            },
            {
                name: 'car_insurance_expiration',
                label: 'Insurance Expiration Date',
                type: 'date',
            },
            {
                name: 'car_note',
                label: 'Note',
                type: 'textarea',
                autosize: true,
                minRows: 4,
            }
        ], [])

    const SERVICEFIELDS =
        useMemo(() => [
            {
                name: 'car_odometer_current',
                label: 'Odometer Current',
                type: 'number',
            },
            {
                name: 'car_maintenance_interval_miles',
                label: 'Miles For Service',
                type: 'number',
            },
            {
                name: 'car_service_next_odometer',
                label: 'Next Service',
                type: 'number',
                disabled: true
            }
        ], []);

    const FIELDS = [...CARFIELDS, ...SERVICEFIELDS];

    useLayoutEffect(() => {
        if (carId) modalData('car', FIELDS, +carId).then()
    }, [carId])

    async function handleFileUpload(files: File[]) {
        const editing = modal.state === 'editing'
        if (!editing) {
            addCarDocument(files)
        } else {
            return await window.toast.U({
                modalId,
                id: {
                    title: `Adding image${files.length > 1 ? "s" : ""}.`,
                    message: 'Please wait...'
                },
                update: {
                    success: `Image${files.length > 1 ? 's' : ''} successfully added.`,
                    error: `Image${files.length > 1 ? 's' : ''} could not be added.`
                },
                cb: () => addCarDocument(files)
            })
        }
        resetRef.current?.(); // 👈 reset FileButton after use
    }

    async function handleRemoveFile(file: any) {
        const editing = modal.state === 'editing'
        if (!editing) return removeCarDocument(file)

        return await window.toast.U({
            modalId,
            id: {
                title: "Removing image.",
                message: 'Please wait...'
            },
            update: {
                success: 'Image successfully removed.',
                error: 'Image could not be removed.'
            },
            cb: () => removeCarDocument(file)
        })
    }

    async function handleSubmit() {
        // if (checkRequired('car', FIELDS)) {
            return await window.toast.U({
                modalId,
                id: {
                    title: `${carId ? 'Editing' : 'Creating'} Car.`,
                    message: 'Please wait...',
                },
                update: {
                    success: `Car ${carId ? 'updated' : 'created'} successfully.`,
                    error: `Failed to ${carId ? 'update' : 'create'} car.`
                },
                cb: async () => {
                    if (carId) return await handleEditCar()
                    await handleSaveCar()
                }
            })
        // }

        // window.toast.E('Please fill all required fields')
    }

    if (modal.loading) return <EzLoader h='calc(100vh -180px)'/>

    return (
        <Stack>
            <EzScroll h='calc(100vh -180px)' scrollbars='y'>
                <Stack>
                    <FormGenerator
                        field={CARFIELDS}
                        handleInput={(name: any, value: any, api: any) =>
                            handleInput('car', name, value, api)}
                        structure={[4, 4, 4, 1]}
                        formData={formData['car']}
                        errors={errors['car']}
                    />

                    <EzText>Service Information</EzText>

                    <FormGenerator
                        field={SERVICEFIELDS}
                        handleInput={(name: any, value: any, api: any) =>
                            handleInput('car', name, value, api)}
                        structure={[3]}
                        formData={formData['car']}
                        errors={errors['car']}
                    />

                    <Stack>
                        <EzText>Car Images</EzText>
                        <FileButton
                            onChange={handleFileUpload}
                            accept="image/*"
                            multiple
                            resetRef={resetRef}
                        >
                            {(props) =>
                                <EzButton
                                    w='fit-content'
                                    leftSection={<IconPhotoPlus/>}
                                    {...props}
                                >Upload</EzButton>}
                        </FileButton>
                        <ImageGrid
                            images={images}
                            removeFile={handleRemoveFile}
                        />
                    </Stack>
                </Stack>
            </EzScroll>
            <SaveCancelDeleteBtns
                withScroll
                accept={handleSubmit}
                label={{accept: 'Save'}}
            />
        </Stack>
    );
}