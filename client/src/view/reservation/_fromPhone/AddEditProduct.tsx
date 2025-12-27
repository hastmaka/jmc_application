import {Button, Group, Stack} from "@mantine/core";
import FormGenerator from "@/components/form/FormGenerator.tsx";
import {useLayoutEffect, useMemo} from "react";
import DescriptionImage from "@/view/reservation/_fromPhone/DescriptionImage.tsx";
import ProductImage from "@/view/reservation/_fromPhone/ProductImage.tsx";
import SelectDescription from "@/view/reservation/_fromPhone/SelectDescription.tsx";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";
import {JewelryModalController} from "@/view/reservation/_fromPhone/JewelryModalController.ts";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {getProductFields, getProductSelect} from "@/view/reservation/_fromPhone/FIELDS.ts";

export default function AddEditProduct({
    id, modalId
}: {
    id?: number,
    modalId: string,
}) {

    const {
        formData,
        errors,
        handleInput,
        checkRequired,
        handleSave,
        handleEdit,
        handleCancel,
        isFetching,
        aiGetData,
        aiLoading,
        modalData,
        modal,
        activeDescriptionIndex,
        isFormDirty
    } = JewelryModalController

    const tagLength = formData['product']?.product_tag?.length

    const FIELDS = useMemo(() => getProductFields(tagLength), [tagLength]);
    const SELECT = useMemo(() =>
        getProductSelect(id ? aiLoading : false), [id, aiLoading]);

    useLayoutEffect(() => {
        if (id) modalData('product', [...FIELDS, ...SELECT], +id).then()
    }, [FIELDS, SELECT, id, modalData])

    async function handleSubmit() {
        if (aiLoading) {
            const goodToGo = checkRequired('product', SELECT)
            if(!goodToGo){
                return window.toast.E('Some fields are required.')
            }
            return aiGetData([...FIELDS, ...SELECT].map(f=> f.name))
        }
        const readyToDb = checkRequired('product', [...FIELDS, ...SELECT])
        if(!readyToDb){
            return window.toast.E('Some fields are required.')
        }
        if (activeDescriptionIndex === null && !id) {
            JewelryModalController.descriptionError = true
            return window.toast.E('Please select one description')
        }

        //we are adding more images
        if (modal.state === 'editing') {
            if(!formData.files?.length && !isFormDirty) {
                return window.toast.W('Nothing to save.')
            }
        }

        await window.toast.U({
            modalId,
            id: {
                title: `${id ? 'Editing' : 'Creating'} Product.`,
                message: 'Please wait...',
            },
            update: {
                success: `Product ${id ? 'updated' : 'created'} successfully.`,
                error: `Failed to ${id ? 'update' : 'create'} product.`
            },
            cb: async () => {
                if (id) return await handleEdit(modalId)
                await handleSave(modalId)
            }
        })
    }

    function renderBtnText(){
        if (!aiLoading && modal.state === 'create') return 'To Db'
        if (modal.state === 'create') return 'Description'
        if (modal.state === 'editing') return 'Save'
        return null
    }

    if (modal!.loading || (id && aiLoading)) return <EzLoader h={600}/>

    return (
        <Stack pos='relative'>
            <EzScroll
                h='calc(100dvh - 260px)'
                needPaddingBottom
                scrollbars="y"
            >
                <Stack>
                    <FormGenerator
                        field={SELECT}
                        handleInput={(name: any, value: any, api: any) =>
                            handleInput('product', name, value, api)}
                        structure={[2, 1]}
                        formData={formData['product']}
                        errors={errors['product']}
                    />
                    <Group align='flex-start' gap={8}>
                        <DescriptionImage id={id}/>
                        <ProductImage fromMobile={false} modalId={modalId}/>
                    </Group>
                    <SelectDescription fields={FIELDS} id={id}/>
                </Stack>
            </EzScroll>
            <Group
                gap={8}
                pos='absolute'
                style={{bottom: 0, left: 0, right: 0}}
            >
                {formData.product?.file_description && (
                    <>
                        <Button
                            flex={1}
                            color='red.7'
                            onClick={() => {
                                if (id) window.closeModal(modalId)
                                handleCancel()
                            }}
                        >Cancel</Button>
                        {<Button
                            flex={1}
                            color={!aiLoading ? 'teal.7' : 'blue.7'}
                            onClick={handleSubmit}
                            loading={isFetching}
                        >{renderBtnText()}</Button>}
                    </>
                )}
            </Group>
        </Stack>
    );
}