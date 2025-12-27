import { Center, Flex, SegmentedControl, Stack, Text } from "@mantine/core";
import { IconCalendarWeek, IconUser, IconHome, IconChecks } from "@tabler/icons-react";
import React, {createElement, type JSX, lazy, Suspense, useState} from "react";
import EzButton from "@/ezMantine/button/EzButton";
import EzLoader from "@/ezMantine/loader/EzLoader";
import classes from "./AddEditClientModal.module.scss";
import {ClientModalController} from "./ClientModalController.ts";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";
// dynamic imports
const Info = lazy(() => import("./Info"));
const Caregiver = lazy(() => import("./Caregiver"));
const Address = lazy(() => import("./Address"));
const Summary = lazy(() => import("./Summary"));

type StepKey = "info" | "caregiver" | "address" | "summary";

const SEGMENTED_CONTROL_DATA: { value: StepKey; label: string; icon: React.FC<any> }[] = [
    { value: "info", label: "INFO", icon: IconCalendarWeek },
    { value: "caregiver", label: "CAREGIVER", icon: IconUser },
    { value: "address", label: "ADDRESS", icon: IconHome },
    { value: "summary", label: "SUMMARY", icon: IconChecks },
];

const STEPPER_DATA: Record<StepKey, React.LazyExoticComponent<() => JSX.Element>> = {
    info: Info,
    caregiver: Caregiver,
    address: Address,
    summary: Summary,
};

export default function AddClientModal() {
    const { handleSubmit } = ClientModalController;
    const [value, setValue] = useState<StepKey>("info");

    return (
        <Stack pos="relative">
            <SegmentedControl
                value={value}
                onChange={(val: string) => setValue(val as StepKey)}
                fullWidth
                data={SEGMENTED_CONTROL_DATA.map(({ value, label, icon: Icon }) => ({
                    value,
                    label: (
                        <Center style={{ gap: 10 }}>
                            {Icon && <Icon style={{ width: "1rem", height: "1rem" }} />}
                            <Text>{label}</Text>
                        </Center>
                    ),
                }))}
            />

            <EzScroll h="calc(100vh - 320px)" pb={70}>
                <Suspense fallback={<EzLoader h={400}/>}>{createElement(STEPPER_DATA[value])}</Suspense>
            </EzScroll>

            <Flex
                justify="space-between"
                align="center"
                pos='fixed'
                gap={16}
                className={classes["bottom-container"]}
                px='1rem'
                style={{
                    borderTop: `1px solid var(--mantine-color-default-border)`,
                    bottom: 0, left: 0, right: 0,
                    minHeight: '70px',
                }}
            >
                <EzButton
                    onClick={() => {
                        const index = SEGMENTED_CONTROL_DATA.findIndex((item) => item.value === value);
                        setValue(SEGMENTED_CONTROL_DATA[index - 1].value);
                    }}
                    disabled={value === "info"}
                >
                    Preview
                </EzButton>
                <EzButton
                    onClick={handleSubmit}
                >
                    Save Client
                </EzButton>
                <EzButton
                    onClick={() => {
                        const index = SEGMENTED_CONTROL_DATA.findIndex((item) => item.value === value);
                        setValue(SEGMENTED_CONTROL_DATA[index + 1].value);
                    }}
                    disabled={value === "summary"}
                >
                    Next
                </EzButton>
            </Flex>
        </Stack>
    );
}