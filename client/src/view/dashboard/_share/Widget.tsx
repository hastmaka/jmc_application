import React, {forwardRef} from "react";

type WidgetProps = {
    children: React.ReactNode;
    [key: string]: any
}

const Widget = forwardRef<HTMLDivElement, WidgetProps>((props, ref) => {
    return (
        <div
            style={{display: 'flex'}}
            ref={ref}
            {...props}
        >
            {props.children}
        </div>
    )
})

Widget.displayName = "EzCard";

export default Widget;