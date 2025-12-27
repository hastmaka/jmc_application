import PropTypes from "prop-types";
import {useState} from "react";
import CustomHeaderWrapper from "@/components/CustomHeaderWrapper.jsx";
import EzText from "@/ezMantine/text/EzText.jsx";
import {Switch} from "@mantine/core";

export default function Header({title}) {
    const [checked, setChecked] = useState(true)
    return (
        <CustomHeaderWrapper>
            <EzText>{title}</EzText>
            <Switch
                checked={checked}
                onChange={() => setChecked((prev) => !prev)}
                color='dark'
                onLabel="ON" offLabel="OFF"
            />
        </CustomHeaderWrapper>
    )
}

Header.propTypes = {
    title: PropTypes.string.isRequired
}
