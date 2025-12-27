import {type ReactNode} from "react";

export default function Whole({children, fw}: {children: ReactNode, fw?: boolean}) {
    return (
        <tr>
            <td colSpan={10} style={{padding: 0}}>
                <span style={{fontSize: '12px', fontWeight: fw ? 400 : 900}}>{children}</span>
            </td>
        </tr>
    )
}