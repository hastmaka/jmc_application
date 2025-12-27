import {Checkbox, Stack} from "@mantine/core";
import GenericModal from "@/components/modal/GenericModal.tsx";
import {ReservationController} from "@/view/reservation/ReservationController.ts";
import {JewelryModalController} from "@/view/reservation/_fromPhone/JewelryModalController.ts";
import {useEffect, useState} from "react";

export default function ExportToCsv({modalId}: {modalId: string}) {
    const {selectedRow} = ReservationController
    const {handleExport,handleCheckbox, checkbox, resetState} = JewelryModalController
    const [error, setError] = useState<boolean>(false)

    useEffect(() => {
        if (error) setTimeout(() => setError(false), 5000)
    }, [error])

    return (
        <GenericModal
            cancel={() => {
                resetState()
                window.closeModal(modalId)
            }}
            accept={async () => {
                if (!selectedRow || Object.keys(selectedRow).length === 0) {
                    return window.toast.E('Some product have to be selected in order to export.')
                }
                if (checkbox.length === 0) {
                    return setError(true)
                }
                await window.toast.U({
                    modalId,
                    id: {

                    },
                    update: {

                    },
                    cb: () => handleExport(selectedRow)
                })
            }}
        >
            <Checkbox.Group
                label="Select platforms."
                description={error
                    ? 'Need to select at least one platform.'
                    : "Because every platform is different in the way of handle data."
                }
                withAsterisk
                value={checkbox}
                onChange={handleCheckbox}
                {...(error && {
                    styles: {
                        description: {color: 'red'}
                    }
                })}
            >
                <Stack mt="md">
                    <Checkbox value="whatnot" label="WhatNot"/>
                    <Checkbox value="etsy" label="Etsy"/>
                    <Checkbox value="shopify" label="Shopify"/>
                    <Checkbox value="faire" label="Faire"/>
                </Stack>
            </Checkbox.Group>
        </GenericModal>
    );
}