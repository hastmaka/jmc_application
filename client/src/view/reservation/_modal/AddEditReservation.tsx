// import FormGenerator from "@/components/form/FormGenerator.tsx";
// import SaveCancelDeleteBtns from "@/components/SaveCancelDeleteBtns.tsx";
// import {Group, NumberInput, Stack} from "@mantine/core";
// import {ReservationModalController} from "./ReservationModalController.ts";
// import EzGroupBtn from "@/ezMantine/buttonGroup/EzGroupBtn.tsx";
// import {useEffect, useLayoutEffect, useMemo} from "react";
// import {IconChartFunnel, IconSend} from "@tabler/icons-react";
// import EzMenu from "@/ezMantine/menu/EzMenu.tsx";
// import EzButton from "@/ezMantine/button/EzButton.tsx";
// import EzText from "@/ezMantine/text/EzText.tsx";
// import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";
// import _ from "lodash";
// // import {airlines, mostKnownPlacesInVegas} from "@/static";
// import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
// import DetailPrice from "@/view/reservation/_modal/DetailPrice.tsx";
// import {getRealMoney} from "@/view/reservation/_modal/getRealMoney.ts";
//
// export default function AddEditReservation({
//     id, modalId
// } : {
//     id?: number,
//     modalId: string,
// }) {
//     const {
//         handleInput,
//         formData,
//         errors,
//         resetState,
//         handleSaveReservation,
//         handleEditReservation,
//         handleChangeReservationStatus,
//         statusBtnLoading,
//         modalData,
//         modal,
//         checkRequired,
//     } = ReservationModalController
//     // reservation_base + m&g + fuel + airport fee * 0.03
//     const {
//         hour, fuelPlusHour, taxes, total
//     } = getRealMoney(formData['reservation'])
//
//     // update taxes
//     useEffect(() => {
//         handleInput('reservation', 'reservation_tax', taxes.toFixed(2))
//     }, [taxes]);
//
//     useEffect(() => {
//         handleInput('reservation', 'reservation_fuel_value', fuelPlusHour)
//     }, [fuelPlusHour, handleInput, hour]);
//
//     useEffect(() => {
//         if (!id) handleInput('reservation', 'reservation_status', 'Pending')
//     }, []);
//
//     const FIELDS =
//         useMemo(() => [
//             {
//                 name: "reservation_passenger_name",
//                 label: "Name",
//                 // required: true,
//             },
//             {
//                 name: 'reservation_email',
//                 type: 'string',
//                 label: 'Email',
//                 fieldProps: {
//                     type: 'email'
//                 }
//             },
//             {
//                 name: 'reservation_phone',
//                 label: 'Phone',
//             },
//             {
//                 name: "reservation_passengers",
//                 label: "Passengers",
//                 type: "select-local",
//                 searchable: true,
//                 options: _.range(1, 17).map((i: any) => i.toString())
//             },
//             {
//                 name: "car_car_id",
//                 label: "Select Car",
//                 type: "select",
//                 fieldProps: {
//                     url: 'v1/car/asset',
//                     iterator: {label: 'car_name', value: 'car_id'},
//                 }
//             },
//
//             {
//                 name: "reservation_date",
//                 label: "Date",
//                 type: "datePickerInput",
//                 required: true,
//                 highlightToday: true
//             },
//             {
//                 name: "reservation_time",
//                 label: "Time",
//                 type: "time",
//                 required: true,
//             },
//             {
//                 name: "reservation_pickup_location",
//                 label: "Pickup Location",
//                 // type: "select",
//                 // fieldProps: {
//                 //     fromDb: false,
//                 //     data: [...airlines, ...mostKnownPlacesInVegas],
//                 //     iterator: {label: 'label', value: 'value'},
//                 //     freeMode: true
//                 // },
//                 required: true
//             },
//             {
//                 name: 'reservation_fly_info',
//                 label: 'Fly information',
//             },
//             {
//                 name: "reservation_dropoff_location",
//                 label: "Dropoff Location",
//                 // type: "select",
//                 // fieldProps: {
//                 //     fromDb: false,
//                 //     data: mostKnownPlacesInVegas,
//                 //     iterator: {label: 'label', value: 'value'},
//                 //     freeMode: true
//                 // },
//                 required: true
//             },
//
//             {
//                 name: "reservation_source",
//                 label: "Source",
//                 type: "select",
//                 fieldProps: {
//                     url: 'v1/asset/reservation_source',
//                 }
//             },
//             {
//                 name: "reservation_hour",
//                 label: "Hours",
//                 type: "select-local",
//                 searchable: true,
//                 options: _.range(1, 24 + 0.1, 0.5).map((n: any) => n.toString()),
//                 required: true,
//             },
//             {
//                 name: "reservation_base",
//                 label: "Base Price",
//                 type: "select-local",
//                 leftSection: '$',
//                 options: ['100', '125', '150', '200'],
//                 required: true,
//                 // disabled: isRealValue
//             },
//             {
//                 name: "reservation_m_and_g",
//                 label: "M&G",
//                 type: "select-local",
//                 leftSection: '$',
//                 options: Array.from({length: 24}, (_, i) => {
//                     return ((i + 1) * 10).toString();
//                 }),
//                 // disabled: isRealValue
//             },
//
//             {
//                 name: "reservation_fuel",
//                 label: "Fuel Value",
//                 type: "select-local",
//                 leftSection: '$',
//                 options: ['3', '4', '5', '6', '7'],
//                 required: true,
//             },
//             {
//                 name: "reservation_fuel_value",
//                 label: "Fuel Total",
//                 type: "number",
//                 leftSection: '$',
//                 decimalScale: 2,
//                 thousandSeparator: ",",
//                 fixedDecimalScale: true,
//                 disabled: true,// hours * 6
//             },
//             {
//                 name: "reservation_airport_fee",
//                 label: "Airport Fee",
//                 type: "select-local",
//                 leftSection: '$',
//                 options: ['12', '24'],
//                 // disabled: isRealValue
//             },
//             {
//                 name: "reservation_tips",
//                 label: "Tips",
//                 type: "select-local",
//                 leftSection: '%',
//                 options: ['20', '25'],
//                 // disabled: isRealValue
//             },
//             {
//                 name: "reservation_tax",
//                 label: "Tax",
//                 disabled: true
//             },
//
//             {
//                 name: 'reservation_sign',
//                 label: "Sign",
//                 type: "textarea",
//                 minRows: 4,
//                 autosize: true
//             },
//             {
//                 name: 'reservation_stop',
//                 label: "Stops",
//                 type: "textarea",
//                 minRows: 4,
//                 autosize: true
//             },
//             {
//                 name: 'reservation_special_instructions',
//                 label: "Special Instructions",
//                 type: "textarea",
//                 minRows: 4,
//                 autosize: true
//             },
//         ], [])
//
//     // const PERSIA
//
//     const ACTIONBTNS =
//         useMemo(() => [
//             {
//                 icon: IconSend,
//                 label: 'Send Email',
//                 disabled: true,
//                 onClick: () => {
//                 }
//             }
//         ], [])
//
//     useLayoutEffect(() => {
//         if (id) modalData('reservation', FIELDS, +id).then()
//     }, [])
//
//
//     async function handleSubmit() {
//         if (checkRequired('reservation', FIELDS)) {
//             return await window.toast.U({
//                 modalId,
//                 id: {
//                     title: `${id ? 'Editing' : 'Creating'} reservation.`,
//                     message: 'Please wait...',
//                 },
//                 update: {
//                     success: `Reservation ${id ? 'updated' : 'created'} successfully.`,
//                     error: `Failed to ${id ? 'update' : 'create'} reservation.`
//                 },
//                 cb: async () => {
//                     if (id) return await handleEditReservation(modalId, total)
//                     await handleSaveReservation(modalId, total)
//                 }
//             })
//         }
//     }
//
//     if (modal.loading) return <EzLoader h='calc(100vh -180px)'/>
//
//     return (
//         <Stack flex={1}>
//             <EzScroll h='calc(100vh - 90px)' p='0 .5rem 0 1rem' needPaddingBottom>
//                 <Group justify='space-between' gap={8}>
//                     <DetailPrice
//                         row={{
//                             ...formData['reservation'],
//                             reservation_fuel: fuelPlusHour,
//                             reservation_total: total,
//                         }}
//                         target={(
//                             <EzText bold='Total: $'>
//                                 {total > 0 ? total.toFixed(2) : 'Select all required fields first.'}
//                             </EzText>
//                         )}
//                     />
//                     <Group gap={8}>
//                         <EzMenu
//                             trigger='click'
//                             onItemClick={async (item: any) => {
//                                 if (id) {
//                                     return await window.toast.U({
//                                         modalId,
//                                         id: {
//                                             title: 'Updating Status',
//                                             message: 'Please wait...',
//                                         },
//                                         update: {
//                                             success: `Reservation status updated successfully.`,
//                                             error: `Failed to update reservation status.`,
//                                         },
//                                         cb: () => handleChangeReservationStatus(item.value, id)
//                                     })
//                                 }
//                                 handleInput('reservation', 'reservation_status', item.label)
//                             }}
//                             target={(
//                                 <EzButton
//                                     leftSection={<IconChartFunnel/>}
//                                     loading={statusBtnLoading}
//                                 >
//                                     <EzText bold='Status'>{formData?.['reservation']?.reservation_status || 'Pending'}</EzText>
//                                 </EzButton>
//                             )}
//                             custom
//                             url='v1/asset/reservation_status'
//                         />
//                         <EzGroupBtn ITEMS={ACTIONBTNS}/>
//                     </Group>
//                 </Group>
//                 <FormGenerator
//                     field={FIELDS}
//                     structure={[5, 5, 4, 5, 3]}
//                     handleInput={(name, value, api) => {
//                         handleInput('reservation', name, value, api)
//                     }}
//                     inputContainer={{gap: 8}}
//                     formData={{...formData?.['reservation']}}
//                     errors={errors?.['reservation']}
//                 />
//
//                 <Group gap={8} mt={8} align='flex-end' w='300'>
//                     <NumberInput
//                         flex={1}
//                         label="Real Value"
//                         placeholder="RealValue"
//                         thousandSeparator=","
//                         leftSection='$'
//                         decimalScale={2}
//                         hideControls
//                         fixedDecimalScale
//                         onChange={(value) => {
//                             handleInput('reservation', 'reservation_real_value', value)
//                         }}
//                         value={formData?.['reservation']?.reservation_real_value || ''}
//                     />
//                 </Group>
//
//             </EzScroll>
//
//             <SaveCancelDeleteBtns
//                 withScroll
//                 accept={handleSubmit}
//                 cancel={() => {
//                     resetState()
//                     window.closeModal(modalId)
//                 }}
//                 label={{accept: 'Save', cancel: 'Cancel'}}
//
//             />
//         </Stack>
//     );
// }