import EzText from "@/ezMantine/text/EzText.tsx";
import {Button, FileButton, Group, Stack} from "@mantine/core";
import NoImage from "@/components/NoImage.tsx";
import {IconCamera, IconPhotoPlus} from "@tabler/icons-react";
import CameraButton from "@/view/reservation/_fromPhone/CameraButton.tsx";
import MobileCarousel from "@/view/reservation/_fromPhone/MobileCarousel.tsx";
import ImageGrid from "@/view/reservation/_fromPhone/ImageGrid.tsx";
import {JewelryModalController} from "@/view/reservation/_fromPhone/JewelryModalController.ts";
import {useRef} from "react";

export default function ProductImage({
    fromMobile = true,
    modalId
}: {
    fromMobile?: boolean;
    modalId?: string;
}) {
    const {formData, addFile, modal} = JewelryModalController
    const resetRef = useRef<() => void>(null);
    const prodImage = formData?.product?.product_image_url
        ? formData.product.product_image_url.filter((i: any) => !i.document_primary)
        : []
    const images = formData.files ? [...formData.files, ...prodImage] : [...prodImage]

    async function handleFileUpload(files: File[]){
        const editing = modal.state === 'editing'
        if (!editing) {
            addFile(files)
        } else {
            await window.toast.U({
                modalId,
                id: {
                    title: `Adding image${files.length > 1 ? "s" : ""}.`,
                    message: 'Please wait...'
                },
                update: {
                    success: `Image${files.length > 1 ? 's' : ''} successfully added.`,
                    error: `Image${files.length > 1 ? 's' : ''} could not be added.`
                },
                cb: () => addFile(files)
            })
        }
        resetRef.current?.(); // 👈 reset FileButton after use
    }

    return (
        <Stack gap={16} flex={1}>
            <Group gap={8}>
                <EzText>Product Images</EzText>
                <FileButton
                    onChange={handleFileUpload}
                    accept="image/*"
                    multiple
                    resetRef={resetRef}
                >
                    {(props) =>
                        <Button
                            size='sm'
                            flex={1}
                            leftSection={<IconPhotoPlus/>}
                            {...props}
                        >Upload</Button>}
                </FileButton>
                <CameraButton
                    onCapture={(file) => addFile([file])}
                    flex={1}
                    leftSection={<IconCamera/>}
                    text='Open'
                />
            </Group>

            {!images.length
                ? <NoImage/>
                : fromMobile ? (
                    <MobileCarousel images={images}/>
                ) : (
                    <ImageGrid images={images} modalId={modalId}/>
                )
            }
        </Stack>
    );
}