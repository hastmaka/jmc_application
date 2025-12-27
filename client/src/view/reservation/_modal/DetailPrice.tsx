import {Group, Menu} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.tsx";
import u from "@/util";
import React, {forwardRef} from "react";

const Target =
    forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>((props, ref) => (
        <div ref={ref}>
            {props.children}
        </div>
    ));

export default function DetailPrice({
    row, position, target
}: {
    row: Record<string, any>,
    position?: boolean,
    target?: any
}) {
    const total = row?.reservation_total || '';
    const data = {
        'Base': row?.reservation_base || '',
        'Hour': row?.reservation_hour || '',
        'M&G': row?.reservation_m_and_g || '',
        'Fuel': row?.reservation_fuel || '',
        'A.Fee': row?.reservation_airport_fee || '',
        'Tax': row?.reservation_tax || '',
    }

    function _position(){
        if (position) {
            return (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Target>${Number(total).toFixed(2)}</Target>
                </div>
            )
        }

        if (target) return target;

        return <Target>${Number(total).toFixed(2)}</Target>
    }

    return (
        <Menu
            withArrow
            trigger='click-hover'
            closeOnItemClick={false}
        >
            <Menu.Target>
                {_position()}
            </Menu.Target>

            <Menu.Dropdown>
                {Object.entries(data).map(([key, value]) => (
                    <Menu.Item key={key}>
                        <Group justify='space-between'>
                            <EzText>{key}:</EzText>
                            <EzText>{key === 'Hour' ? value : u.formatMoney(value)}</EzText>
                        </Group>
                    </Menu.Item>
                ))}
                <Menu.Item>
                    <Group justify='space-between'>
                        <EzText>Tips:</EzText>
                        <EzText>{row?.reservation_tips || ''} %</EzText>
                    </Group>
                </Menu.Item>
                <Menu.Item>
                    <Group justify='space-between'>
                        <EzText>Real Total:</EzText>
                        <EzText>{row?.reservation_real_value || ''}</EzText>
                    </Group>
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}