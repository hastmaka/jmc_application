import CustomHeaderWrapper from "@/components/CustomHeaderWrapper.jsx";
import {TextInput} from "@mantine/core";
import {IconSearch} from "@tabler/icons-react";

export default function CustomHeader() {
    return (
        <CustomHeaderWrapper>
            <TextInput
                leftSectionPointerEvents="none"
                leftSection={<IconSearch/>}
                placeholder="Search Provider"
            />
        </CustomHeaderWrapper>
    )
}
