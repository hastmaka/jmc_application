import classes from '@/modals/document/AddDocumentModal.module.scss'
import {Text, Group, Flex, Stack} from '@mantine/core';
import {Dropzone, type FileWithPath, MIME_TYPES} from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import EzButton from "@/ezMantine/button/EzButton.jsx";
import {deepSignal} from "deepsignal/react";
import ActionIconsToolTip from "@/ezMantine/actionIconTooltip/ActionIconsToolTip.tsx";
import {uploadSingleFirebaseStorage, /*uploadToFirebaseStorage*/} from "@/api/firebase/FirebaseStore.ts";
import {ClientViewController} from "@/view/client/clientView/ClientViewController.ts";
import {FetchApi} from "@/api/FetchApi.ts";

const signal = deepSignal({
    file: [] as FileWithPath[],
    async handleDrop (files: FileWithPath[]) {
        if (files.length === 1) {
            let url = await uploadSingleFirebaseStorage(files[0], `client/${ClientViewController.clientId}/pfp/`, `client_picture.${files[0].name.split('.').pop()}`);
            const client = {
                client_id: ClientViewController.clientId,
                client_pfp_url: url
            }
            await FetchApi('v1/client', 'PUT', client)
        }
    }
})

export default function AddClientPictureModal() {
    return (
        <Stack>
            <Dropzone
                onDrop={async (files: FileWithPath[]) => {
                    await signal.handleDrop(files);
                }}
                className={classes.dropzone}
                accept={[MIME_TYPES.jpeg, MIME_TYPES.png, MIME_TYPES.gif]}
            >
                <div style={{ pointerEvents: 'none' }}>
                    <Group justify="center">
                        <Dropzone.Accept>
                            <IconDownload
                                style={{ width: '3rem', height: '3rem' }}
                                color='blue.6'
                                stroke={1.5}
                            />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <IconX
                                style={{ width: '3rem', height: '3rem' }}
                                color='red.6'
                                stroke={1.5}
                            />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            <IconCloudUpload style={{ width: '3rem', height: '3rem' }} stroke={1.5} />
                        </Dropzone.Idle>
                    </Group>
                    <Text ta="center" fz="sm" mt="xs" c="dimmed">
                        Drag&apos;n&apos;drop files here to upload. We can accept only <b><i>image formats</i></b> files that
                        are less than 10mb in size.
                    </Text>
                </div>
            </Dropzone>

            {signal.file.length > 0 &&
                signal.file.map((file, index) => {
                    return (
                        <Flex
                            key={index}
                            justify='space-between'
                            p='.5rem'
                            style={{
                                border: '1px solid var(--mantine-color-gray-3)',
                                borderRadius: 'var(--mantine-radius-sm)',
                            }}
                        >
                            <Text>{file.name}</Text>
                            <ActionIconsToolTip
                                ITEMS={[{
                                    tooltip: 'Remove file',
                                    icon: <IconX onClick={() => signal.file.splice(index, 1)}/>
                                }]}
                            />
                        </Flex>
                    )
                })
            }

            <Flex justify='flex-end'>
                <EzButton onClick={(_items: any) => {debugger}}>
                    Upload
                </EzButton>
            </Flex>

        </Stack>
    );
}

AddClientPictureModal.propTypes = {}
