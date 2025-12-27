import EzUploadFiles from "@/components/form/EzUploadFiles.tsx";

export default function AddDocumentModal() {
    // const { modal } = DocumentController;

    async function handleUpload(_files: File[]){
        debugger
    }

    return <EzUploadFiles uploadedFiles={handleUpload} maxSize={30}/>
}