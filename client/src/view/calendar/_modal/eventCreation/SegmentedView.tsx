import {Center, SegmentedControl, Stack, Text} from "@mantine/core";
import FormGenerator from "@/components/form/FormGenerator.tsx";
import {useLayoutEffect, useState} from "react";
import {IconCalendarWeek, IconUser} from "@tabler/icons-react";
import {EventCreationModalController} from "./EventCreationModalController.ts";

const SEGMENTED_CONTROL_DATA = [
    {
        value: 'individual',
        label: 'Individual Supervision',
        icon: IconCalendarWeek
    }, {
        value: 'group',
        label: 'Group Supervision',
        icon: IconUser
    }
]

function SegmentedView({
    fields,
    structure,
}: {
    fields: any;
    structure: any
}) {
    const {
        formData,
        handleInput,
        errors,
        activeSelect,
    } = EventCreationModalController
    const [control, setControl] = useState<'individual' | 'group'>('individual');
    const updatedFields = control === 'individual'
        ? fields[`${activeSelect}_${control}`]
        : fields[`${activeSelect}_${control}`].map((field: any) => {
            return {
                ...field,
                fieldProps: {
                    ...field.fieldProps,
                    disabled: false,
                }
            }
        })

    // reset segment
    useLayoutEffect(() => {setControl('individual')}, [activeSelect]);

    return (
        <Stack>
            <SegmentedControl
                value={control}
                onChange={(v: string) => {
                    setControl(v as any)
                    // resetState()
                }}
                fullWidth
                color='var(--mantine-primary-color-9)'
                data={SEGMENTED_CONTROL_DATA.map(({value, label, icon}) => {
                    const Icon = icon
                    return {
                        value,
                        label: (
                            <Center style={{gap: 10}}>
                                {icon! && <Icon style={{width: '1rem', height: '1rem'}}/>}
                                <Text>{label}</Text>
                            </Center>
                        )
                    }
                })}
            />


            <FormGenerator
                field={updatedFields}
                structure={structure[`${activeSelect}_${control}`]}
                handleInput={(name, value, api) =>
                    handleInput('appointment', name, value, api)}
                formData={formData!['appointment']}
                errors={errors!['appointment']}
            />
        </Stack>
    )
}

export default SegmentedView;