import React, {forwardRef} from "react"
import {ScrollArea, type ScrollAreaProps} from "@mantine/core"

type EzScrollProps = ScrollAreaProps & {
    children: React.ReactNode,
    h?: string | number,
    needPaddingBottom?: boolean,
    [key: string]: any
}

interface EzScrollComponent extends React.ForwardRefExoticComponent<EzScrollProps & React.RefAttributes<HTMLDivElement>> {
    NeedContainer: React.FC<Omit<EzScrollProps, "h">>
}

const EzScroll = forwardRef<HTMLDivElement, EzScrollProps>(
    function EzScroll({children, h, needPaddingBottom=false, ...rest}, ref) {

        return (
            <ScrollArea.Autosize
                ref={ref}
                h={h}
                // w='100%'
                scrollbarSize={10}
                type='always'
                offsetScrollbars
                scrollbars='y'
                pb={needPaddingBottom ? 54 : 0}
                {...rest}
                styles={{
                    root: {
                        flexGrow: 1,
                    },
                    content: {
                        height: '100%',
                    },
                    scrollbar: {
                        right: '-4px',
                    },
                    // viewport: {
                    //     padding: needPaddingBottom ? '0 0 1rem 0' : 0
                    // }
                }}
            >
                {children}
            </ScrollArea.Autosize>
        )
    }
) as unknown as EzScrollComponent

EzScroll.NeedContainer = ({
    children,
    ...props
}: Omit<EzScrollProps, "h">) => {
    return (
        <div
            style={{
                display: "flex",
                flex: 1,
                // border: '1px solid gray'
            }}
        >
            <EzScroll h="100%" {...props}>
                {children}
            </EzScroll>
        </div>
    );
};

export default EzScroll