import EzSearchAdvancedInput from "@/ezMantine/searchInput/EzSearchAdvancedInput.tsx";
import {ClientGridController} from "@/view/client/ClientGridController.tsx";
import GenericModal from "@/components/modal/GenericModal.tsx";

function Test() {
    return (
        <div>
            <GenericModal text='test' accept={() => {}} cancel={() => {}}/>
            <EzSearchAdvancedInput state={ClientGridController}/>
        </div>
    );
}

export default Test;