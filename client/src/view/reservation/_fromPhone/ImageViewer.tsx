import NoImage from "@/components/NoImage.tsx";
import {Image} from "@mantine/core";

export default function ImageViewer({file}: {file: File | string | null}) {
    if (!file) {
        return <NoImage h='100%'/>
    }

    return (
        <Image
            src={typeof file === 'string' ? file : URL.createObjectURL(file)}
            w='100%'
            h='100%'
            // mah='calc(100dvh - 420px)'
            radius='md'
        />
    );
}