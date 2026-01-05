import React, {useLayoutEffect, useState} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {FetchApi} from "@/api/FetchApi.ts";
import {Stack} from "@mantine/core";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";

/**
 * Preview component for testing PDF templates with page-like dimensions.
 * Fetches data from API and renders each template in a container that simulates PDF page size.
 *
 * @param url - API endpoint to fetch data (e.g., 'v1/reservation/123')
 * @param extractor - Function to transform API response into template props
 * @param template - Array of React components to render as PDF templates
 * @param orientation - Page orientation: 'portrait' (816px) or 'landscape' (1056px). Default: 'portrait'
 *
 * @example
 * <TestPdf
 *   url={`v1/reservation/${reservationId}`}
 *   extractor={extractDataFromRow}
 *   template={[JMC, ClientFull, ClientSimple]}
 *   orientation="landscape"
 * />
 */
export default function TestPdf({
    url, extractor, template, orientation = 'portrait'
}: {
    url: string,
    extractor: (row: any) => Record<string, any>,
    template?: React.ComponentType<any>[],
    orientation?: 'portrait' | 'landscape'
}) {
    const pageWidth = orientation === 'portrait' ? 900 : 1140; // 816 - 900 <-> 1056 - 1140
    const [l, setL] = useState<boolean>(true);
    const [row, setRow] = useState<any>({});

    useLayoutEffect(() => {
        const getData = async () => {
            const response = await FetchApi(url)
            setRow(response.data)
            setL(false)
        }

        getData().then()
    }, [url]);

    if (l) return <EzLoader h='100vh'/>

    // ---- 4) PREPARE PROPS FOR TEMPLATE ----
    const border = '2px solid black'
    const _props = extractor(row)
    const props= {..._props, border}

    return (
        <Stack w='100%' align='center'>
            <EzScroll h='calc(100vh - 120px)'>
                <Stack gap="xl">
                    {template?.map((T, index) => (
                        <div
                            key={index}
                            style={{
                                width: pageWidth,
                                padding: 30,
                                backgroundColor: 'white',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                overflow: 'hidden'
                            }}
                        >
                            <T {...props} />
                        </div>
                    ))}
                </Stack>
            </EzScroll>
        </Stack>
    );
}