import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./FirebaseConfig";
import { getNameFromUrl } from "@/util/getNameFromUrl";
import {createId} from "@/util";

export interface UploadResult {
    name: string;
    url: string;
}

export const uploadToFirebaseStorage = async (
    items: File | File[],
    path: string,
    onProgress?: (fileName: string, progress: number) => void
): Promise<UploadResult[]> => {
    const _items = Array.isArray(items) ? items : [items]

    const promises = _items.map((file: File) => {
        const storageRef = ref(storage, `${path}/${createId()}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise<UploadResult>((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    onProgress?.(file.name, progress);
                    if (import.meta.env.DEV) {
                        console.log(`Upload "${file.name}" is ${progress.toFixed(2)}% done`);
                    }
                },
                (error) => {
                    console.error(`❌ Upload failed for ${file.name}:`, error);
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        const name = getNameFromUrl(downloadURL);
                        resolve({ name, url: downloadURL });
                    } catch (err) {
                        reject(err);
                    }
                }
            );
        });
    });

    return Promise.all(promises);
};

/**
 * Delete one or multiple files from Firebase Storage.
 * Accepts both Firebase URLs and direct storage paths.
 */
export const deleteFromFirebaseStorage = async (
    data: string | string[]
): Promise<boolean> => {
    // Ensure we always work with an array
    const items = Array.isArray(data) ? data : [data];

    // Helper: extract the storage path from a Firebase URL
    const getPathFromFirebaseUrl = (url: string): string => {
        const match = url.match(/\/o\/(.*?)\?/);
        return match ? decodeURIComponent(match[1]) : url;
    };

    try {
        const promises = items.map((item) => {
            const path = getPathFromFirebaseUrl(item);
            return deleteObject(ref(storage, path));
        });

        await Promise.all(promises);
        return true;
    } catch {
        return false;
    }
};