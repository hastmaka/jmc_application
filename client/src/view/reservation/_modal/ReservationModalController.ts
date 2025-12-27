import _ from "lodash";
import {getModel} from "@/api/models";
import {FetchApi} from "@/api/FetchApi.ts";
import type {SignalType} from "@/signals/SignalClass.ts";
import {SignalController} from "@/signals/signalController/SignalController.ts";
import {ReservationController} from "@/view/reservation/ReservationController.ts";
import {deleteFromFirebaseStorage, uploadToFirebaseStorage} from "@/api/firebase/FirebaseStore.ts";
import {LoginController} from "@/view/login/LoginController.ts";
import u from "@/util";

const moneyKeys = [
    'reservation_base',
    'reservation_m_and_g',
    'reservation_fuel',
    'reservation_airport_fee',
    // 'reservation_total',
    'reservation_real_value'
];

function extractItineraryFields(obj: Record<string, any>) {
    const newObj = {...obj};
    // 1. reduce → build an array of row objects
    const temp = Object.keys(newObj).reduce((acc: any[], key) => {
        const match = key.match(/_(\d+)$/);
        if (!match) return acc;

        const index = Number(match[1]);

        // find row object in array or create it
        if (!acc[index - 1]) acc[index - 1] = {};

        acc[index - 1][key] = obj[key];

        delete newObj[key]; // remove extracted fields

        return acc;
    }, [])

    Object.keys(newObj).forEach(key => {
        if (moneyKeys.includes(key) && newObj[key] != null && newObj[key] !== '') {
            const num = Number(newObj[key]);
            newObj[key] = Math.round(num * 100);   // 5.25 → 525
        }
    });

    return {
        originalObj: newObj,
        itineraryFields: temp.filter(i => i !== null)
    }
}

export const ReservationModalController: SignalType<any, any> =
    new SignalController({
        isAddingOrEditing: false,
        carId: null,
        employeeId: null,
        isRealValue: false,
        // loading state of the status btn
        statusBtnLoading: false,

        itineraryData: [],
        // editModalCanRender: false,

        //dynamic structure for ITINERARYINFO
        iStructure: [6],
        added: 1,

        // check availability
        selectedDay: undefined,

        editMap: {
            car: async function(fields, id){
                const response = await FetchApi(`v1/car/${id}`)
                const car = new (getModel('car'))(response.data)
                fields.push('car_document_image')
                // we store the fields to be able to use them when working with firebase store
                ReservationModalController.fields = fields
                ReservationModalController.populateForm('car', fields, car)
            },
            reservation: async function(fields, id){
                const response = await FetchApi(`v1/reservation/${id}`)
                const reservation = new (getModel('reservation'))(response.data)
                fields.push('reservation_real_value', 'reservation_status')
                ReservationModalController.fields = fields
                ReservationModalController.populateForm('reservation', fields, reservation)

                if (response.data.reservation_itinerary)
                    ReservationModalController.itineraryData = response.data.reservation_itinerary
            },
            employee: async function(fields, id){
                const response = await FetchApi(`v1/employee/${id}`)
                const employee = new (getModel('employee'))(response.data)
                fields.push('employee_document')
                ReservationModalController.fields = fields
                ReservationModalController.populateForm('employee', fields, employee)
            }
        }
    }, {
        updateIStructure: function(this: any, plus: boolean){
            if (plus) {
                this.iStructure = [...this.iStructure, 4]
                this.added = this.added + 1
            } else {
                this.iStructure = this.iStructure.slice(0, -1)
                // this.added = this.added - 1
            }
        },

        // Car
        handleSaveCar: async function (this: any) {
            const car = {...this.formData.car}
            if(!car.car_status) car.car_status = 9

            const document: any[] = []
            if (this.formData.carFiles?.length) {
                const response = await uploadToFirebaseStorage(this.formData.carFiles, 'jmc_application/car')
                response.map(({url}) => document.push({
                    document_primary: 44,
                    document_type: 47,
                    document_url: url
                }))
            }

            const response = await FetchApi(
                'v1/car',
                'POST',
                {...car, document}
            )

            if (response.success) {
                await this.handleBackMangeCar()
            } else {
                // delete files from firebase in case of something goes wrong
                for (const doc of document) {
                    await deleteFromFirebaseStorage(doc.document_url)
                }
            }
        },
        handleEditCar: async function (this: any) {
            const response = await FetchApi(
                'v1/car',
                'PUT',
                this.dirtyFields
            )

            if (response.success) {
                await this.handleBack()
            }
        },
        handleChangeStatus: async function(this: any, car_status: number, car_id: number){
            const response = await FetchApi(
                'v1/car',
                'PUT',
                {car_status, car_id}
            )

            if (response.success) {
                this.carLoading = true
                await this.carGetData()
            }
        },
        handleDeleteCar: async function(this: any, car_id: number){
            const response = await FetchApi(`v1/car/${car_id}`, 'DELETE')
            if (response.success) {
                this.carLoading = true
                await this.carGetData()
            }
        },

        // manage car modal
        removeCarDocument: async function (this: any, file: File | any): Promise<void> {
            const editing = this.modal.state === 'editing'
            if (editing) {
                const car_id = this.formData.car.car_id
                const document_id = file.document_id
                const response = await FetchApi(`v1/document/${document_id}`,'DELETE')

                if (response.success) {
                    await deleteFromFirebaseStorage(file.document_url)
                    return this.editMap.car(this.fields, car_id)
                }
            }
            this.formData.carFiles = this.formData.carFiles.filter((f: File) => f !== file);
        },
        addCarDocument: async function (this: any, file: File[]) {
            const editing = this.modal.state === 'editing'
            if (editing) {
                const car = {...this.formData.car}
                if (!car.document) car.document = []
                const response = await uploadToFirebaseStorage(file, 'jmc_application/car')
                response.map(({url}) => car.document.push({
                    document_primary: 44,
                    document_type: 47,
                    document_url: url
                }))
                const {car_id, document} = car
                await FetchApi(
                    'v1/car',
                    'PUT',
                    {car_id, document}
                )
                return this.editMap.car(this.fields, car.car_id)
            }
            if (!this.formData.carFiles) this.formData.carFiles = []
            this.formData.carFiles = [...this.formData.carFiles, ...file]
        },
        handleBackMangeCar: async function (this: any) {
            this.isAddingOrEditing = false
            this.resetState(0)
            this.carLoading = true
            await this.carGetData()
        },
        carGetData: async function(this: any) {
            const response = await FetchApi("v1/car");
            this.carData = response.data.map((car: any) => new (getModel('car'))(car));
            this.carLoading = false
        },

        carDetailGetData: async function(this: any, carId: number) {
            const response = await FetchApi(`v1/car/${carId}`)
            this.carDetailData = new (getModel('car'))(response.data)
            this.carDetailLoading = false
        },

        //Employee
        handleSaveEmployee: async function(this: any){
            const employee = this.formData.employee

            const _document: any[] = []
            if (this.formData.employeeFiles?.length) {
                const files = this.formData.employeeFiles
                const response = await uploadToFirebaseStorage(files, 'jmc_application/employee')
                response.forEach(({url}: {url: string}, index: number) => {
                    const file = files[index]
                    _document.push({
                        document_primary: 44,
                        document_type: +file.document_type,
                        document_url: url,
                        document_name: file.name
                    })
                })
            }

            const response = await FetchApi(
                'v1/employee',
                'POST',
                {...employee, document: _document}
            )

            if (response.success) {
                await this.handleBackManageEmployee()
            } else {
                // delete files from firebase in case of something goes wrong
                for (const doc of _document) {
                    await deleteFromFirebaseStorage(doc.document_url)
                }
            }
        },
        handleEditEmployee: async function(this: any){
            const pendingFiles = this.formData.employeeFiles?.filter((f: any) => f.uploaded && f.document_url) || []

            // Build document array from pending uploads
            const document = pendingFiles.map((file: any) => ({
                document_primary: 44,
                document_type: +file.document_type,
                document_url: file.document_url,
                document_name: file.name
            }))

            const payload = {...this.dirtyFields}
            if (document.length) payload.document = document

            if (payload.employee_phone) {
                payload.employee_phone = u.sanitizer.phoneDigitsOnly(payload.employee_phone)

                if (payload.employee_phone.length < 10) {
                    return this.setErrors('employee', 'employee_phone', 'Phone have to be 10 digit')
                }
            }

            const response = await FetchApi(
                'v1/employee',
                'PUT',
                payload
            )

            if (response.success) {
                this.formData.employeeFiles = []
                await this.handleBackManageEmployee()
            }
        },
        handleDeleteEmployee: async function(this: any, employee_id: number){
            const response = await FetchApi(`v1/employee/${employee_id}`, 'DELETE')
            if (response.success) {
                this.employeeLoading = true
                await this.employeeGetData()
            }
        },
        addEmployeeDocument: function(this: any, files: File[]) {
            if (!this.formData.employeeFiles) this.formData.employeeFiles = []
            this.formData.employeeFiles = [...this.formData.employeeFiles, ...files]
        },
        uploadEmployeeDocument: async function(this: any, file: any) {
            file.uploading = true
            this.formData.employeeFiles = [...this.formData.employeeFiles]

            const response = await uploadToFirebaseStorage([file], 'jmc_application/employee')

            file.uploading = false
            file.uploaded = true
            file.document_url = response[0].url
            this.formData.employeeFiles = [...this.formData.employeeFiles]
        },
        removeEmployeeDocument: async function(this: any, doc: any): Promise<void> {
            const editing = this.modal.state === 'editing'
            if (editing && doc.document_id) {
                const employee_id = this.formData.employee.employee_id
                const document_id = doc.document_id
                const response = await FetchApi(`v1/document/${document_id}`, 'DELETE')

                if (response.success) {
                    await deleteFromFirebaseStorage(doc.document_url)
                    return this.editMap.employee(this.fields, employee_id)
                }
            }
            // For pending files, also delete from Firebase if already uploaded
            if (doc.document_url) {
                await deleteFromFirebaseStorage(doc.document_url)
            }
            this.formData.employeeFiles = this.formData.employeeFiles.filter((f: File) => f !== doc)
        },
        removeEmployeeDocumentFromDetailModal: async function(this: any, doc: any): Promise<void>{
            const document_id = doc.document_id
            const response = await FetchApi(`v1/document/${document_id}`, 'DELETE')

            if (response.success) {
                await deleteFromFirebaseStorage(doc.document_url)
                // Reload employee detail data
                this.employeeDetailLoading = true
                await this.employeeDetailGetData(this.employeeId)
            }
        },
        cleanupPendingEmployeeUploads: async function(this: any) {
            const files = this.formData.employeeFiles || []
            for (const file of files) {
                if (file.document_url) {
                    await deleteFromFirebaseStorage(file.document_url)
                }
            }
            this.formData.employeeFiles = []
        },
        employeeDetailGetData: async function(this: any, employeeId: number) {
            this.employeeId = employeeId
            const response = await FetchApi(`v1/employee/${employeeId}`)
            this.employeeDetailData = new (getModel('employee'))(response.data)
            this.employeeDetailLoading = false
        },

        // manage employee modal
        handleBackManageEmployee: async function (this: any) {
            await this.cleanupPendingEmployeeUploads()
            this.isAddingOrEditing = false
            this.resetState(0)
            this.employeeLoading = true
            await this.employeeGetData()
        },
        employeeGetData: async function(this: any){
            const response = await FetchApi("v1/employee");
            this.employeeData = response.data.map((employee: any) => new (getModel('employee'))(employee));
            this.employeeLoading = false
        },

        // Reservation
        handleSaveReservation: async function(this: any, modalId: string, total: any){
            const statusMap: Record<string, number> = {
                'Pending': 5,
                'Confirmed': 6,
                'Completed': 7,
                'Cancelled': 8

            }
            const data = {
                ...this.formData.reservation,
                reservation_total: Number(total.toFixed(2)*100),
                reservation_status: statusMap[this.formData.reservation.reservation_status]
            }

            // const obj: Record<string, any> = {
            //     "reservation_tax": "13.41",
            //     "reservation_fuel_value": 18,
            //     reservation_status: statusMap[this.formData.reservation.reservation_status],
            //     reservation_total: Number(total.toFixed(2)*100),
            //     "reservation_service_type": "Airport Pickup",
            //     "reservation_passenger_name": "Jorge",
            //     "reservation_email": "cluis132@yahoo.com",
            //     "reservation_phone": "7253037777",
            //     "reservation_passengers": "15",
            //     "car_car_id": "1",
            //     "reservation_source": "2",
            //     "reservation_date": "2025-12-11",
            //     "reservation_time": "12:00",
            //     "reservation_pickup_location": "airport",
            //     "reservation_airline": "(AUTOSTRAD) Autostradale",
            //     "reservation_fly_info": "d23",
            //     "reservation_dropoff_location": "Mandaley",
            //     "reservation_time_1": "03:00",
            //     "reservation_pickup_location_1": "Mandaley",
            //     "reservation_dropoff_location_1": "Strip",
            //     "reservation_time_2": "03:00",
            //     "reservation_pickup_location_2": "Mandaley",
            //     "reservation_dropoff_location_2": "Strip",
            //     "reservation_time_4": "03:00",
            //     "reservation_pickup_location_4": "Mandaley",
            //     "reservation_dropoff_location_4": "Strip",
            //     "reservation_time_7": "03:00",
            //     "reservation_pickup_location_7": "Mandaley",
            //     "reservation_dropoff_location_7": "Strip",
            //     "reservation_hour": "3",
            //     "reservation_base": "125",
            //     "reservation_m_and_g": "30",
            //     "reservation_fuel": "6",
            //     "reservation_airport_fee": "24",
            //     "reservation_tips": "25",
            //     "reservation_sign": "Los Pepillos",
            //     "reservation_special_instructions": "Special",
            //     "reservation_real_value": 700
            // }

            const {originalObj, itineraryFields} = extractItineraryFields(data)

            if (itineraryFields.length) {
                originalObj.reservation_itinerary = JSON.stringify(itineraryFields)
            }

            const response = await FetchApi(
                'v1/reservation',
                'POST',
                originalObj
            )

            if (response.success) {
                await ReservationController.fetchData()
                this.resetState()
                window.closeModal(modalId)
            } else {
                throw response
            }

        },
        handleEditReservation: async function (this: any, modalId: string, total: any) {
            const { originalObj, itineraryFields } = extractItineraryFields(this.dirtyFields);

            // Convert itinerary array → JSON
            if (itineraryFields.length) {
                originalObj.reservation_itinerary = JSON.stringify(itineraryFields);
            }

            // reservation_total comes from function param
            originalObj.reservation_total = Math.round(Number(total) * 100);
            if (originalObj.reservation_phone) {
                originalObj.reservation_phone = u.sanitizer.phone(originalObj.reservation_phone)
            }
            // Send update
            const response = await FetchApi(
                `v1/reservation`,
                'PUT',
                originalObj
            );

            if (response.success) {
                await ReservationController.fetchData();
                this.resetState();
                window.closeModal(modalId);
            } else {
                throw response;
            }
        },
        handleChangeReservationStatus: async function(this: any, value: number, id?: number){
            const data = {
                reservation_id: this.dirtyFields.reservation_id,
                reservation_status: value
            }
            if (id) this.statusBtnLoading = true
            const response = await FetchApi(
                `v1/reservation`,
                'PUT',
                data
            )

            if (response.success) {
                if (id) {
                    await this.editMap.reservation(this.fields, id)
                    this.statusBtnLoading = false
                }
                if (!id) ReservationController.loading = true
                await ReservationController.fetchData()
            } else {
                throw response
            }
        },
        handeChangeReservationCar: async function(this: any, car_car_id: number, reservation_id: number){
            const response = await FetchApi(
                `v1/reservation`,
                'PUT',
                {car_car_id, reservation_id}
            )

            if (response.success) {
                await ReservationController.fetchData()
            } else {
                throw response
            }
        },
        handleDeleteReservation: async function(this: any, reservation_id: number, modalId){
            const response = await FetchApi(`v1/reservation/${reservation_id}`, 'DELETE')

            if(response.success) {
                await ReservationController.fetchData()
                window.closeModal(modalId)
            } else {
                throw response
            }
        },
        reservationDetailGetData: async function(this: any, carId: number) {
            const response = await FetchApi(`v1/reservation/${carId}`)
            this.reservationDetailData = new (getModel('reservation'))(response.data)
            this.reservationDetailLoading = false
        },

        // _share
        handleIsAddingOrEditing: function (this: any, key: string, id?: number,) {
            this.isAddingOrEditing = true
            if (id && _.isNumber(id)) this[key] = id
        },

        // update month and year
        updateMonthAndYear: async function(this: any, rangeDateValue: string[] ){
            const response = await LoginController.syncUserPreference({rangeDateValue})

            if (response.success) {
                if (rangeDateValue[0] === null && rangeDateValue[1] === null) {
                    ReservationController.manageFilters({fieldName: 'reservation_date'}, 'remove')
                } else {
                    ReservationController.manageFilters({
                        fieldName: 'reservation_date',
                        value: rangeDateValue,
                        operator: 'between'
                    })
                }
            } else {
                throw response
            }
        }
    }).signal