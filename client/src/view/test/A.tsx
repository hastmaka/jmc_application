import withAccess from "@/access/Access.tsx";
import EzButton from "@/ezMantine/button/EzButton.tsx";
import {Group, Stack} from "@mantine/core";
import {ActionIconsToolTip} from "@/ezMantine/actionIconTooltip/ActionIconsToolTip.tsx";
import {IconZoomIn, IconZoomOut} from "@tabler/icons-react";
import {PieChart} from "@mantine/charts";

const data = [
    { name: 'USA', value: 400, color: 'indigo.6' },
    { name: 'India', value: 300, color: 'yellow.6' },
    { name: 'Japan', value: 300, color: 'teal.6' },
    { name: 'Other', value: 200, color: 'gray.6' },
];

function A({ITEMS}: { ITEMS: number[] }) {
    // const {handleInput, formData, errors, checkRequired} = TestController

    return (
        <Stack align='center'>
            <Group>
                <EzButton onClick={() => {}}>Pdf JMC</EzButton>
                <EzButton onClick={() => {}}>Pdf Client</EzButton>
                <ActionIconsToolTip
                    ITEMS={[
                        {
                            icon: <IconZoomIn/>
                        }, {
                            icon: <IconZoomOut/>
                        }
                    ]}
                />
            </Group>
            <Stack>
                <PieChart w={240} h={160} data={data} withTooltip/>
            </Stack>
        </Stack>
    );
}

A.displayName = 'AWithAccess';

const AWithAccess = withAccess(A);

export default AWithAccess;





































