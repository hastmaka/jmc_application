import FormGenerator from "@/components/form/FormGenerator.tsx";
import SaveCancelDeleteBtns from "@/components/SaveCancelDeleteBtns.tsx";
import { Fieldset, Group, NumberInput, Stack} from "@mantine/core";
import {ReservationModalController} from "./ReservationModalController.ts";
// import EzGroupBtn from "@/ezMantine/buttonGroup/EzGroupBtn.tsx";
import {getRealMoney} from "@/view/reservation/_modal/getRealMoney.ts";
import {useEffect, useLayoutEffect, useMemo, useState} from "react";
import {IconChartFunnel} from "@tabler/icons-react";
import EzMenu from "@/ezMantine/menu/EzMenu.tsx";
import EzButton from "@/ezMantine/button/EzButton.tsx";
import EzText from "@/ezMantine/text/EzText.tsx";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {airlines} from "@/static";
import u from "@/util";
import _ from "lodash";

export default function AddEditReservation({
   id, modalId
} : {
    id?: number,
    modalId: string,
}) {
    const {
        handleInput,
        formData,
        errors,
        resetState,
        handleSaveReservation,
        handleEditReservation,
        handleChangeReservationStatus,
        statusBtnLoading,
        modalData,
        modal,
        checkRequired,
        iStructure,
        added,
        updateIStructure,
        itineraryData,
        // editModalCanRender
    } = ReservationModalController
    // reservation_base + m&g + fuel + airport fee * 0.03
    const {
        hour, fuelPlusHour, taxes, total
    } = getRealMoney(formData['reservation'])

    // update taxes
    useEffect(() => {
        handleInput('reservation', 'reservation_tax', taxes.toFixed(2))
    }, [taxes]);

    useEffect(() => {
        handleInput('reservation', 'reservation_fuel_value', fuelPlusHour)
    }, [fuelPlusHour, handleInput, hour]);

    useEffect(() => {
        if (!id) handleInput('reservation', 'reservation_status', 'Pending')
    }, []);

    const SELECTSERVICE =
        useMemo(() => [{
            name: 'select_service_type',
            type: 'select',
            label: 'Service Type',
            fieldProps: {
                url: 'v1/asset/service_type'
            },
            required: true,
            inputProps: {w: 500}
        }], [])

    const PERSONALINFO =
        useMemo(() => [
            {
                name: "reservation_passenger_name",
                label: "Name",
                required: true,
            },
            {
                name: 'reservation_email',
                type: 'string',
                label: 'Email',
                fieldProps: {
                    type: 'email'
                }
            },
            {
                name: 'reservation_phone',
                label: 'Phone',
                w: 200
            },
            {
                name: "reservation_passengers",
                label: "Passengers",
                type: "select-local",
                searchable: true,
                options: _.range(1, 17).map((i: any) => i.toString()),
                w: 200
            },
            {
                name: "select_car",
                label: "Select Car",
                type: "select",
                fieldProps: {
                    url: 'v1/car/asset',
                    iterator: {label: 'car_plate', value: 'car_id'},
                },
                inputProps: {w: 200}
            },
            {
                name: "select_source",
                label: "Source",
                type: "select",
                fieldProps: {
                    url: 'v1/asset/reservation_source',
                },
                inputProps: {w: 200}
            },
        ], [])

    const [ITINERARYINFO, setITINERARYINFO] =
        useState<any>([
            {
                name: "reservation_date",
                label: "Date",
                type: "datePickerInput",
                required: true,
                highlightToday: true,
                w: 200
            },
            {
                name: "reservation_time",
                label: "Time",
                type: "time",
                // required: true,
                w: 200
            },
            {
                name: "reservation_pickup_location",
                label: "Pickup Location",
                // type: "select",
                // fieldProps: {
                //     fromDb: false,
                //     data: [...airlines, ...mostKnownPlacesInVegas],
                //     iterator: {label: 'label', value: 'value'},
                //     freeMode: true
                // },
                required: true
            },
            {
                name: 'select_airline',
                label: 'Airlines',
                type: "select",
                fieldProps: {
                    fromDb: false,
                    data: airlines,
                    iterator: {label: 'label', value: 'value'},
                },
                inputProps: {w: 300}
            },
            {
                name: 'reservation_fly_info',
                label: 'Fly Number',
                w: 100
            },
            {
                name: "reservation_dropoff_location",
                label: "Dropoff Location",
                // type: "select",
                // fieldProps: {
                //     fromDb: false,
                //     data: [...airlines, ...mostKnownPlacesInVegas],
                //     iterator: {label: 'label', value: 'value'},
                //     freeMode: true
                // },
                required: true
            },
        ])

    /** Edit formatting data */
    useLayoutEffect(() => {
        if (itineraryData.length > 0) {
            const newStructure = [...iStructure];
            const newFields = [...ITINERARYINFO];
            const newFormData = {...formData.reservation}

            itineraryData.forEach((row: any, index: number) => {
                const rowid = crypto.randomUUID();
                const _index = index + 1

                // create fields locally
                newFields.push(
                    {
                        name: `delete_${_index}`,
                        rowid,
                        component: (
                            <div style={{display: 'flex', width: 200, paddingTop: '1.5rem'}} >
                                <EzButton
                                    data-attr={rowid}
                                    color='red'
                                    flex={1}
                                    onClick={(e: any) => handleDeleteRow(e)}
                                >
                                    Delete
                                </EzButton>
                            </div>
                        ),
                        type: 'component'
                    },
                    {
                        name: `reservation_time_${_index}`,
                        rowid,
                        label: "Time",
                        type: "time",
                        required: true,
                        w: 200
                    },
                    {
                        name: `reservation_pickup_location_${_index}`,
                        rowid,
                        label: "Pickup Location",
                        required: true
                    },
                    {
                        name: `reservation_dropoff_location_${_index}`,
                        rowid,
                        label: "Dropoff Location",
                        required: true
                    }
                );

                // remap and preload values locally
                Object.keys(row).forEach((oldKey) => {
                    const newKey = oldKey.replace(/_\d+$/, `_${_index}`);
                    newFormData[newKey] = row[oldKey];
                });

                newStructure.push(4);
            });

            setITINERARYINFO(newFields);
            ReservationModalController.formData.reservation = newFormData;
            ReservationModalController.iStructure = newStructure;
            // ReservationModalController.editModalCanRender = true;
            ReservationModalController.added = ReservationModalController.added + (newFields.length - 6) / 4
        }
    }, [itineraryData]);

    const SERVICEINFO =
        useMemo(() => [
            {
                name: "reservation_hour",
                label: "Hours",
                type: "select-local",
                searchable: true,
                options: _.range(1, 24 + 0.1, 0.5).map((n: any) => n.toString()),
                required: true,
            },
            {
                name: "reservation_base",
                label: "Base Price",
                type: "select-local",
                leftSection: '$',
                options: ['100', '125', '150', '200'],
                required: true,
                // disabled: isRealValue
            },
            {
                name: "reservation_m_and_g",
                label: "M&G",
                type: "select-local",
                leftSection: '$',
                options: Array.from({length: 24}, (_, i) => {
                    return ((i + 1) * 10).toString();
                }),
                // disabled: isRealValue
            },
            {
                name: "reservation_fuel",
                label: "Fuel Value",
                type: "select-local",
                leftSection: '$',
                options: ['3', '4', '5', '6', '7', '8'],
                required: true,
            },
            {
                name: "reservation_fuel_value",
                label: "Fuel Total",
                type: "number",
                leftSection: '$',
                decimalScale: 2,
                thousandSeparator: ",",
                fixedDecimalScale: true,
                disabled: true,// hours * 6
            },
            {
                name: "reservation_airport_fee",
                label: "Airport Fee",
                type: "select-local",
                leftSection: '$',
                options: ['12', '24'],
                // disabled: isRealValue
            },
            {
                name: "reservation_tips",
                label: "Tips",
                type: "select-local",
                leftSection: '%',
                options: ['20', '25'],
                // disabled: isRealValue
            },
            {
                name: "reservation_tax",
                label: "Tax",
                disabled: true
            },
            {
                name: 'total',
                type: "component",
                component: (
                    <Group miw={160} pt={24} pos='relative' wrap='nowrap' gap={4}>
                        <EzText size='xl'>Total :</EzText>
                        <EzText size='xl'>{total > 0 ? u.formatMoney(total) : null}</EzText>
                    </Group>
                ),
            }
        ], [total])

    const EXTRAINFO =
        useMemo(() => [
            {
                name: 'reservation_sign',
                label: "Sign",
                type: "textarea",
                minRows: 4,
                autosize: true
            },
            {
                name: 'reservation_stop',
                label: "Stops",
                type: "textarea",
                minRows: 4,
                autosize: true
            },
            {
                name: 'reservation_special_instructions',
                label: "Special Instructions",
                type: "textarea",
                minRows: 4,
                autosize: true
            },
        ], [])

    const FIELDS = [...SELECTSERVICE, ...ITINERARYINFO, ...PERSONALINFO, ...SERVICEINFO, ...EXTRAINFO]

    // const ACTIONBTNS =
    //     useMemo(() => [
    //         {
    //             icon: IconSend,
    //             label: 'Send Email',
    //             disabled: true,
    //             onClick: () => {
    //             }
    //         }
    //     ], [])

    useLayoutEffect(() => {
        if (id) modalData('reservation', FIELDS, +id).then()

        return () => {
            // ReservationModalController.editModalCanRender = false;
            ReservationModalController.itineraryData = [];
        }
    }, [])

    async function handleSubmit() {
        if (checkRequired('reservation', FIELDS)) {
            return await window.toast.U({
                modalId,
                id: {
                    title: `${id ? 'Editing' : 'Creating'} reservation.`,
                    message: 'Please wait...',
                },
                update: {
                    success: `Reservation ${id ? 'updated' : 'created'} successfully.`,
                    error: `Failed to ${id ? 'update' : 'create'} reservation.`
                },
                cb: async () => {
                    if (id) return await handleEditReservation(modalId, total)
                    await handleSaveReservation(modalId, total)
                }
            })
        }
    }

    function handleAddDestination() {
        const rowid = crypto.randomUUID();
        setITINERARYINFO((current: any) => [
            ...current,
            {
                name: `delete_${added}`,
                rowid,
                component: (
                    <div style={{display: 'flex', width: 200, paddingTop: '1.5rem'}} >
                        <EzButton
                            data-attr={rowid}
                            color='red'
                            flex={1}
                            onClick={(e: any) => handleDeleteRow(e)}
                        >
                            Delete
                        </EzButton>
                    </div>
                ),
                type: 'component'
            },
            {
                name: `reservation_time_${added}`,
                rowid,
                label: "Time",
                type: "time",
                // required: true,
                w: 200
            },
            {
                name: `reservation_pickup_location_${added}`,
                rowid,
                label: "Pickup Location",
                required: true
            },
            {
                name: `reservation_dropoff_location_${added}`,
                rowid,
                label: "Dropoff Location",
                required: true
            },
        ]);
        updateIStructure(true);
    }

    function handleDeleteRow(e: any) {
        const rowid = e.currentTarget.dataset.attr;
        setITINERARYINFO((cur: any) => {
            // remove all rowId items in the CURRENT state
            const filtered = cur.filter((item: any) => item.rowid !== rowid);

            // DELETE KEYS FROM FORMDATA BASED ON the SAME cur
            cur.forEach((item: any) => {
                if (item.rowid === rowid) {
                    delete formData.reservation[item.name];
                    delete ReservationModalController.dirtyFields[item.name];
                }
            });

            return filtered; // <— RETURN NEW STATE
        });
        updateIStructure(false);
    }

    if (modal.loading) return <EzLoader h='calc(100vh -180px)'/>

    return (
        <Stack flex={1}>
            <EzScroll h='calc(100vh - 90px)' p='0 .5rem 0 1rem' needPaddingBottom>
                <Stack gap={8}>
                    <Group justify='space-between' gap={8}>
                        <FormGenerator
                            field={SELECTSERVICE}
                            structure={[1]}
                            handleInput={(name, value) => {
                                handleInput('reservation', name, value)
                            }}
                            inputContainer={{gap: 8}}
                            formData={{...formData?.['reservation']}}
                            errors={errors?.['reservation']}
                        />
                        <Group gap={8}>
                            <EzMenu
                                trigger='hover'
                                onItemClick={async (item: any) => {
                                    if (id) {
                                        return await window.toast.U({
                                            modalId,
                                            id: {
                                                title: 'Updating Status',
                                                message: 'Please wait...',
                                            },
                                            update: {
                                                success: `Reservation status updated successfully.`,
                                                error: `Failed to update reservation status.`,
                                            },
                                            cb: () => handleChangeReservationStatus(item.value, id)
                                        })
                                    }
                                    handleInput('reservation', 'reservation_status', item.label)
                                }}
                                target={(
                                    <EzButton
                                        leftSection={<IconChartFunnel/>}
                                        loading={statusBtnLoading}
                                    >
                                        <EzText bold='Status'>{formData?.['reservation']?.reservation_status || 'Pending'}</EzText>
                                    </EzButton>
                                )}
                                custom
                                url='v1/asset/reservation_status'
                            />
                            {/*<EzGroupBtn ITEMS={ACTIONBTNS}/>*/}
                        </Group>
                    </Group>

                    <Fieldset legend="Personal information">
                        <FormGenerator
                            field={PERSONALINFO}
                            structure={[6]}
                            handleInput={(name, value, api) => {
                                handleInput('reservation', name, value, api)
                            }}
                            inputContainer={{gap: 8}}
                            formData={{...formData?.['reservation']}}
                            errors={errors?.['reservation']}
                        />
                    </Fieldset>

                    <Fieldset legend="Itinerary information">
                        <Stack>
                            <FormGenerator
                                field={ITINERARYINFO}
                                structure={iStructure}
                                handleInput={(name, value, api) => {
                                    handleInput('reservation', name, value, api)
                                }}
                                inputContainer={{gap: 8}}
                                formData={{...formData?.['reservation']}}
                                errors={errors?.['reservation']}
                            />

                            <Group>
                                <EzButton onClick={handleAddDestination}>Add Destination</EzButton>
                            </Group>
                        </Stack>
                    </Fieldset>

                    <Fieldset legend="Service information">
                        <FormGenerator
                            field={SERVICEINFO}
                            structure={[9]}
                            handleInput={(name, value, api) => {
                                handleInput('reservation', name, value, api)
                            }}
                            inputContainer={{gap: 8}}
                            formData={{...formData?.['reservation']}}
                            errors={errors?.['reservation']}
                        />
                    </Fieldset>

                    <Fieldset legend="Extra information">
                        <FormGenerator
                            field={EXTRAINFO}
                            structure={[3]}
                            handleInput={(name, value, api) => {
                                handleInput('reservation', name, value, api)
                            }}
                            inputContainer={{gap: 8}}
                            formData={{...formData?.['reservation']}}
                            errors={errors?.['reservation']}
                        />
                    </Fieldset>

                    <Group gap={8} mt={8} align='flex-end' w='300'>
                        <NumberInput
                            flex={1}
                            label="Real Value"
                            placeholder="RealValue"
                            thousandSeparator=","
                            leftSection='$'
                            decimalScale={2}
                            hideControls
                            fixedDecimalScale
                            onChange={(value) => {
                                handleInput('reservation', 'reservation_real_value', value)
                            }}
                            value={formData?.['reservation']?.reservation_real_value || ''}
                        />
                    </Group>
                </Stack>

            </EzScroll>

            <SaveCancelDeleteBtns
                withScroll
                accept={handleSubmit}
                cancel={() => {
                    resetState()
                    window.closeModal(modalId)
                }}
                label={{accept: 'Save', cancel: 'Cancel'}}

            />
        </Stack>
    );
}