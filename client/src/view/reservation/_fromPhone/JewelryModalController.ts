import {SignalController} from "@/signals/signalController/SignalController.ts";
import type {SignalType} from "@/signals/SignalClass.ts";
import {FetchApi} from "@/api/FetchApi.ts";
import {deleteFromFirebaseStorage, uploadToFirebaseStorage} from "@/api/firebase/FirebaseStore.ts";
import {getModel} from "@/api/models";
import {ReservationController} from "@/view/reservation/ReservationController.ts";
import {AppController} from "@/AppController.ts";

export const JewelryModalController: SignalType<any,any> =
    new SignalController({
        editMap: {
            product: async function(fields, id){
                const response = await FetchApi(`v1/product/${id}`)
                const product = new (getModel("product"))(response.data);

                const descriptionImage = product.product_image_url.find((i: any) => i.document_primary)
                // debugger

                fields.push('product_description', 'file_description', 'product_image_url')
                JewelryModalController.fields = fields
                JewelryModalController.populateForm('product', fields, {
                    ...product,
                    file_description: descriptionImage.document_url
                })
                // the logic is already made to use this variable so
                JewelryModalController.aiLoading = false

                JewelryModalController.fileUrl = descriptionImage.document_url
            }
        },
        checkbox: [],
        activeDescriptionIndex: null,
        descriptionError: false,
        files: [] as File[],
    },{
        removeFile: async function(this: any, file: File | any): Promise<void> {
            // then update product_image_url on db
            // then reload the modal
            const editing = this.modal.state === 'editing'
            if (editing) {
                // if we are in edit mode we need to delete the image from firestore
                const success = await deleteFromFirebaseStorage(file.document_url)
                if (success) {
                    const product_id = this.formData.product.product_id
                    const updatedImage = this.formData.product.product_image_url.filter((i: any) =>
                        i.document_url !== file.document_url)
                    await FetchApi(
                        'v1/product',
                        'PUT',
                        {product_id, product_image_url: updatedImage}
                    )
                    return this.editMap.product(this.fields, product_id)
                } else {
                    return window.toast.E('')
                }
            }
            this.formData.files = this.formData.files.filter((f: File) => f !== file);
        },
        addFile: async function(this: any, file: File[]) {
            const editing = this.modal.state === 'editing'
            if (editing) {
                const {product_image_url, product_id} = this.formData.product
                const response = await uploadToFirebaseStorage(file, 'product')
                response.map(({url}) => product_image_url.push({
                    document_primary: false,
                    document_type: 'image',
                    document_url: url
                }))
                await FetchApi(
                    'v1/product',
                    'PUT',
                    {product_id, product_image_url}
                )
                return this.editMap.product(this.fields, product_id)
            }
            const isFiles = this.formData.files?.length
            const existingNames = isFiles
                ? new Set(this.formData.files.map((f: File) => f.name))
                : new Set([]);
            const newFiles = file.filter((f: File) => !existingNames.has(f.name));
            this.formData.files = isFiles
                ? [...this.formData.files, ...newFiles]
                : [...newFiles]
        },
        codeGetData: async function (this: any){
            const response = await FetchApi('v1/user/generate/2fa')
            this.codeData = response.data;
            this.codeLoading = false
        },
        handleCheckbox: function(this: any, value: any) {
            this.checkbox = value;
        },
        // handleExport: async function(this: any, selectedRow: Record<number, boolean>) {
        //     const selectedIds = Object.keys(selectedRow).map(key => key)
        //     debugger
        // },
        setText: function(this: any, text: string, index: number){
            this.aiData.product_description[index] = text
            if (index || index === 0) this.activeIndex = index
        },
        handleAccept: function(this: any){
            this.aiData.descriptions[this.activeIndex] = this.selectToEdit
        },
        handleCancel: function(this:any){
            this.files = []
            this.errors = {}
            this.formData = {}
            this.formDataCopy = {}
            this.aiData = []
            this.activeDescriptionIndex = null
            this.fileUrl = null
            this.aiLoading = true

            // debugger
        },
        aiGetData: async function (this: any, fields: string[]) {
            this.isFetching = true
            const {file_description, ...rest} = this.formData.product;
            try {
                const firestoreResponse = await uploadToFirebaseStorage(file_description, "product");
                this.fileUrl = firestoreResponse[0].url

                const response = await FetchApi(
                    'v1/ai/product_description',
                    'GET',
                    null,
                    {
                        ...rest,
                        image_url: this.fileUrl
                    }
                )

                this.isFetching = false

                if (response.success) {
                    const {valueToLabel} = AppController
                    const product_material = valueToLabel('product_material', rest['product_material']);
                    const product_type = valueToLabel('product_type', rest['product_type']);
                    const product_gem_type = valueToLabel('product_gem_type', rest['product_gem_type']);

                    fields.push('product_description', 'file_description')
                    this.populateForm(
                        'product',
                        fields,
                        {...response.data, file_description, product_material, product_type, product_gem_type})
                    this.aiLoading = false
                }

            } catch (error) {
                this.loading = false
                this.isFetching = false
                console.log(error);
            }
        },
        handleSave: async function(this: any, modalId: string){
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {file_description, product_description, ...rest} = this.formData.product;
            rest.product_image_url = []
            rest.product_image_url.push({
                document_primary: true,
                document_type: 'image',
                document_url: this.fileUrl
            })
            if (this.formData.files?.length) {
                const response = await uploadToFirebaseStorage(this.formData.files, 'product')
                response.map(({url}) => rest.product_image_url.push({
                    document_primary: false,
                    document_type: 'image',
                    document_url: url
                }))
            }
            rest.product_description = product_description[this.activeDescriptionIndex]
            const {labelToValue} = AppController
            const product_material = labelToValue('product_material', rest['product_material']);
            const product_type = labelToValue('product_type', rest['product_type']);
            const product_gem_type = labelToValue('product_gem_type', rest['product_gem_type']);

            const response = await FetchApi(
                'v1/product',
                'POST',
                {...rest, product_material, product_type, product_gem_type}
            )

            if (response.success) {
                window.closeModal(modalId)
                this.handleCancel()
                await ReservationController.fetchData()
            }
        },
        handleEdit: async function(this: any, modalId: string): Promise<void>{
            const {product_image_url, product_id} = this.formData.product
            const toDb: Record<string, any> = {...this.dirtyFields}
            toDb.product_image_url = product_image_url
            toDb.product_id = product_id
            // get files and upload them to firestore
            // create the new objs with the data return
            if (this.formData.files?.length) {
                const response = await uploadToFirebaseStorage(this.formData.files, 'product')
                response.map(({url}) => toDb.product_image_url.push({
                    document_primary: false,
                    document_type: 'image',
                    document_url: url
                }))
            }

            const response = await FetchApi(
                'v1/product',
                'PUT',
                {...toDb}
            )

            if (response.success) {
                window.closeModal(modalId)
                this.handleCancel()
                await ReservationController.fetchData()
            }

        }
    }).signal