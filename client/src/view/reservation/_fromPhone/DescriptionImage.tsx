import EzText from "@/ezMantine/text/EzText.tsx";
import {Group, Stack} from "@mantine/core";
import CameraButton from "./CameraButton.tsx";
import ImageViewer from "./ImageViewer.tsx";
import {JewelryModalController} from "@/view/reservation/_fromPhone/JewelryModalController.ts";

export default function DescriptionImage({id}: {id: number | undefined}) {
    const {
        formData,
        handleInput,
    } = JewelryModalController
    return (
        <Stack gap={16} flex={1}>
            <Group gap={8}>
                <Stack gap={0}>
                    <EzText>Description Only</EzText>
                    <EzText size='10px'>This image is only for measurement purposes.</EzText>
                </Stack>
                <CameraButton
                    onCapture={(file: File) => {
                        handleInput('product', 'file_description', file)
                    }}
                    text='Open'
                    disabled={id}
                />
            </Group>
            <ImageViewer file={formData.product?.file_description}/>
        </Stack>
    );
}