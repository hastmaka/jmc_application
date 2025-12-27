import _ from "lodash";
import {SignalController} from "@/signals/signalController/SignalController.ts";
import type {SignalType} from "@/signals/SignalClass.ts";
import {getModel} from "@/api/models/index.js";
import {FetchApi} from "@/api/FetchApi.js";
import {capitalizeWords} from "@/util";
import {lazy, Suspense} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import moment from "moment/moment";
import {Checkbox} from "@mantine/core";
const GenericModal =
    lazy(() => import('@/components/modal/GenericModal.tsx'))
const EzTable =
    lazy(() => import('@/ezMantine/table/EzTable.tsx'))


export const ClientInfoController: SignalType<any, any> =
    new SignalController({
        isPrimary: null,
        eventIds: [],
        selectAll: true,
        editMap: {
            personal: async function (field, id): Promise<void> {
                const response = await FetchApi(`v1/client/client_view/update/personal/${id}`);
                const client = new (getModel('client'))(response.data);
                window.updateModal('edit-personal-modal', {
                    title: `Edit Personal Information: ${_.startCase(client.client_full_name)}`
                })
                ClientInfoController.populateForm('personal', field, client)
            },
            insurance: async function (field, id): Promise<void> {
                const response = await FetchApi(`v1/client/client_view/update/insurance/${id}`)
                const insurance = new (getModel('client_insurance'))(response.data);
                window.updateModal('edit-insurance-modal', {
                    title: `Edit Insurance: ${_.startCase(insurance.insurance_id)}`
                })
                ClientInfoController.populateForm('insurance', field, insurance)
            },
            caregiver: async function (field, id): Promise<void> {
                const response = await FetchApi(`v1/client/client_view/update/caregiver/${id}`)
                const caregiver = new (getModel('caregiver'))(response.data);
                window.updateModal('edit-caregiver-modal', {
                    title: `Edit Caregiver or Guardian: ${capitalizeWords(caregiver.caregiver_concat)}`
                })
                ClientInfoController.populateForm('caregiver', field, caregiver)
                // InfoClientController.formData!.caregiver = updateFormData(field, caregiver)
            },
            address: async function (field, id): Promise<void> {
                const response = await FetchApi(`v1/client/client_view/update/address/${id}`)
                const address = new (getModel('address'))(response.data);
                ClientInfoController.populateForm('address', field, address)
            },
            phone: async function (field, id): Promise<void> {
                const response = await FetchApi(`v1/client/client_view/update/phone/${id}`)
                const phone = new (getModel('phone'))(response.data);
                ClientInfoController.populateForm('phone', field, phone)
            },
            therapist: async function (_field, _id): Promise<void> {

            }

            // document: async () => {},
        }
    }, {
        // read
        clientPersonalGetData: async function (this: any): Promise<void> {
            const response = await FetchApi(`v1/client/client_view/personal/${this?.recordId}`)
            this.clientPersonalData = new (getModel('client'))(response.data)
            this.clientPersonalLoading = false
        },
        clientDetailGetData: async function (this: any): Promise<void> {
            const response = await FetchApi(`v1/client/client_view/detail/${this?.recordId}`)
            this.clientDetailData = new (getModel('client'))(response.data)
            this.clientDetailLoading = false
        },
        clientInsuranceGetData: async function (this: any): Promise<void> {
            const response = await FetchApi(`v1/client/client_view/insurance/${this?.recordId}`)
            this.clientInsuranceData = response.data.length
                ? response.data.map((insurance: any) =>
                new (getModel('client_insurance'))(insurance))
                : []
            this.clientInsuranceLoading = false
        },
        clientCaregiverGetData: async function (this: any): Promise<void> {
            const response = await FetchApi(`v1/client/client_view/caregiver/${this?.recordId}`)
            this.clientCaregiverData = response.data.length
                ?   response.data.map((caregiver: any) =>
                new (getModel('caregiver'))(caregiver)).sort((a: any) => (a.caregiver_primary? -1 : 1))
                : []
            this.clientCaregiverLoading = false
        },
        clientAddressGetData: async function (this: any): Promise<void> {
            const response = await FetchApi(`v1/client/client_view/address/${this?.recordId}`)
            this.clientAddressData = response.data.length
                ? response.data.map((address: any) =>
                new (getModel('address'))(address)).sort((a: any) => (a.address_primary ? -1 : 1))
                : []
            this.clientAddressLoading = false
        },
        clientPhoneGetData: async function (this: any): Promise<void> {
            const response = await FetchApi(`v1/client/client_view/phone/${this?.recordId}`)
            this.clientPhoneData = response.data.length
                ? response.data.map((phone: any) =>
                new (getModel('phone'))(phone)).sort((a: any) => (a.phone_primary? -1 : 1))
                : []
            this.clientPhoneLoading = false
        },
        clientTherapistGetData: async function (this: any): Promise<void> {
            const response = await FetchApi(`v1/client/client_view/employee/${this?.recordId}`)
            this.clientTherapistData = response.data.length
                ? response.data.map((employee: any) =>
                new (getModel('employee'))(employee))
                : []
            this.clientTherapistLoading = false
        },

        // edit
        handlePersonalEdit: async function (this: any): Promise<void> {
            if (this.isFormDirty) {
                const response = await FetchApi(
                    'v1/client/client_view/update/personal',
                    'PUT',
                    {...this.dirtyFields}
                )

                if (!response.success) {
                    throw Error('Something went wrong, contact Admin')
                }
                this.personalLoading = true
                this.clientDetailLoading = true
                await Promise.all([
                    this.personalGetData(),
                    this.clientDetailGetData()
                ])
            }

        },
        handleInsuranceEdit: async function (this: any): Promise<void> {
            if (this.isFormDirty) {
                const response = await FetchApi(
                    'v1/client/client_view/update/insurance',
                    'PUT',
                    {...this.dirtyFields}
                )

                if (!response.success) {
                    this.setErrors('insurance', response.field, response.message)
                }

                this.clientInsuranceLoading = true
                await this.clientInsuranceGetData()
                return response
            }
        },
        handleCaregiverEdit: async function (this: any): Promise<void> {
            if (this.isFormDirty) {
                const response = await FetchApi(
                    'v1/client/client_view/update/caregiver',
                    'PUT',
                    {...this.dirtyFields}
                )

                if (!response.success) {
                    this.setErrors('phone', response.field, response.message)
                }

                this.clientCaregiverLoading = true
                await this.clientCaregiverGetData()

                if (this.dirtyFields.caregiver_primary) {
                    this.clientDetailLoading = true
                    await this.clientDetailGetData()
                }
            }
        },
        handleAddressIsPrimaryEdit: async function (this: any): Promise<boolean> {
            window.toast.Progress({
                id: 'list-events',
                title: 'Fetching...',
                message: 'Getting affected events',
            })

            window.modalIsLoading('edit-address-modal')
            // we get all calendar events that will be affected by change the primary address
            const response = await FetchApi(
                'v1/client/client_view/update/address/affected_calendar/' + this.recordId
            )

            window.toast.close('list-events')
            window.modalIsDone('edit-address-modal')
            if (!response.data.length) {
                // no conflicts, proceed directly
                return true;
            }

            // if we got data, we show to the user all event that will be affected for confirmation
            return new Promise<boolean>((resolve) => {
                ClientInfoController.eventIds = response.data.map((r: any) => r.calendar_event_id)
                const modalId = 'list-event-affected';
                const head = [
                    {
                        name: 'All',
                        render: function() {
                            return (
                                <Checkbox
                                    display='flex'
                                    mr={4}
                                    checked={ClientInfoController.selectAll}
                                    onChange={() => {
                                        ClientInfoController.selectAll = !ClientInfoController.selectAll
                                        ClientInfoController.eventIds = ClientInfoController.selectAll
                                            ? response.data.map((r: any) => r.calendar_event_id)
                                            : []
                                    }}
                                    style={{justifyContent: 'center'}}
                                />
                            )
                        }
                    },
                    'Event Name',
                    'Therapist',
                    'Date',
                    'Start Time',
                    'End Time'
                ];
                const tdMap = [
                    {
                        name: 'selected',
                        w: 40,
                        render: function(row: any){
                            return (
                                <Checkbox
                                    checked={ClientInfoController.eventIds.includes(row.calendar_event_id)}
                                    onChange={() => {}}
                                />
                            )
                        }
                    },
                    'calendar_event_title',
                    'employee_full_name',
                    {
                        name: 'calendar_event_start_date',
                        render: ({calendar_event_start_date}: {calendar_event_start_date: string}) => {
                            return moment(calendar_event_start_date, "YYYY-MM-DD").format("MM/DD/YYYY");
                        }
                    },
                    {
                        name: 'calendar_event_start_time',
                        render: ({calendar_event_start_time}: {calendar_event_start_time: string}) => {
                            return moment(calendar_event_start_time, "HH:mm:ss").format("hh:mm A");
                        }
                    },
                    {
                        name: 'calendar_event_end_time',
                        render: ({calendar_event_end_time}: {calendar_event_end_time: string}) => {
                            return moment(calendar_event_end_time, "HH:mm:ss").format("hh:mm A");
                        }
                    },
                ];

                function resetLocal() {
                    ClientInfoController.eventIds = []
                    ClientInfoController.selectAll = true
                }

                window.openModal({
                    modalId,
                    title: 'Review Action',
                    children: (
                        <Suspense fallback={<EzLoader h={400}/>}>
                            <GenericModal
                                cancel={() => {
                                    window.closeModal(modalId);
                                    resetLocal()
                                    resolve(false); // user canceled
                                }}
                                accept={() => {
                                    window.closeModal(modalId);
                                    resolve(true); // user accepted
                                }}
                            >
                                <EzTable
                                    dataKey='calendar_event_id'
                                    data={response.data}
                                    head={head}
                                    tdMap={tdMap}
                                    height={400}
                                    rowClick={(row) => {
                                        const is = ClientInfoController.eventIds.findIndex((id: number) => id === row.calendar_event_id)
                                        if (is === -1) {
                                            ClientInfoController.eventIds = [...ClientInfoController.eventIds, row.calendar_event_id]
                                        } else {
                                            ClientInfoController.eventIds = ClientInfoController.eventIds.filter((id: number) => id !== row.calendar_event_id)
                                        }

                                        if (ClientInfoController.eventIds.length === 0) {
                                            ClientInfoController.selectAll = false
                                        } else if (ClientInfoController.eventIds.length === response.data.length) {
                                            ClientInfoController.selectAll = true
                                        }
                                    }}
                                />
                            </GenericModal>
                        </Suspense>
                    ),
                    onClose: () => {
                        resolve(false)
                        resetLocal()
                    },
                });
            });
        },
        handleAddressEdit: async function (this: any): Promise<void> {
            let dbData: Record<string, any> = {}
            if (this.dirtyFields.address_primary) {
                dbData.calendar_event_id = this.eventIds
            }
            if (this.isFormDirty) {
                const response = await FetchApi(
                    'v1/client/client_view/update/address',
                    'PUT',
                    {...this.dirtyFields, client_client_id: this.recordId, ...dbData}
                )

                if (!response.success) {
                    throw Error('Something went wrong, contact Admin')
                }
                this.clientAddressLoading = true
                await this.clientAddressGetData()

                if (this.dirtyFields.address_primary) {
                    this.clientDetailLoading = true
                    await this.clientDetailGetData()
                }
            }
        },
        handlePhoneEdit: async function (this: any): Promise<void> {
            if (this.isFormDirty) {
                const response = await FetchApi(
                    'v1/client/client_view/update/phone',
                    'PUT',
                    {...this.dirtyFields}
                )

                if (!response.success) {
                    this.setErrors('phone', response.field, response.message)
                }
                this.clientPhoneLoading = true
                await this.clientPhoneGetData()

                if (this.dirtyFields.phone_primary) {
                    this.clientDetailLoading = true
                    await this.clientDetailGetData()
                }
            }
        },
        handleTherapistEdit: async function (this: any): Promise<void> {},

        // create
        handleInsuranceCreate: async function(this: any): Promise<void> {
            debugger
        },
        handleCaregiverCreate: async function(this: any): Promise<void> {
            debugger
        },
        handleAddressCreate: async function(this: any): Promise<void> {
            const response = await FetchApi(
                'v1/client/client_view/create/address',
                'POST',
                {
                    ...this.formData.address,
                    client_client_id: this.recordId
                }
            )

            if (!response.success) {
                this.setErrors('phone', response.field, response.message)
                // const error = new Error(response.message) as any;
                // error.field = response.field;
                // error.success = response.success
                // throw error;
            }
            this.clientAddressLoading = true
            await this.clientAddressGetData()
        },
        handlePhoneCreate: async function(this: any): Promise<void> {
            const response = await FetchApi(
                'v1/client/client_view/create/phone',
                'POST',
                {
                    ...this.formData.phone,
                    client_client_id: this.recordId
                }
            )

            if (!response.success) {
                this.setErrors('phone', response.field, response.message)
                // const error = new Error(response.message) as any;
                // error.field = response.field;
                // error.success = response.success
                // throw error;
            }

            this.clientPhoneLoading = true
            await this.clientPhoneGetData()
        },
        handleTherapistCreate: async function(this: any): Promise<void> {},

        // delete
        handleInsuranceDelete: async function(this: any, _insurance_id: number): Promise<void> {},
        handleCaregiverDelete: async function(this: any, _caregiver_id: number): Promise<void> {},
        handleAddressDelete: async function(this: any, address_id: number): Promise<void> {
            await FetchApi(
                `v1/client/client_view/delete/address/${address_id}`,
                'DELETE'
            )
            this.clientAddressLoading = true
            await this.clientAddressGetData()
        },
        handlePhoneDelete: async function(this: any, phone_id: number): Promise<void> {
            await FetchApi(
                `v1/client/client_view/delete/phone/${phone_id}`,
                'DELETE'
            )
            this.clientPhoneLoading = true
            await this.clientPhoneGetData()
        },
        handleTherapistDelete: async function(this: any, _employee_id: number): Promise<void> {}
    }).signal


















