import {Textarea} from "@mantine/core";
import {JewelryModalController} from "@/view/reservation/_fromPhone/JewelryModalController.ts";

export default function EditDescriptionModal() {
    const {setText, selectToEdit} = JewelryModalController;
    return (
        <Textarea
            value={selectToEdit}
            autosize
            maxRows={9}
            onChange={(e) => setText(e.target.value)}
        />
    );
}