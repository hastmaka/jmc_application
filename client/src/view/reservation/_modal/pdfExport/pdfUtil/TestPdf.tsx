import {useLayoutEffect, useState} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {FetchApi} from "@/api/FetchApi.ts";
import {Stack} from "@mantine/core";
import JMC from "@/view/reservation/_modal/pdfExport/JMC.tsx";
import ClientFull from "@/view/reservation/_modal/pdfExport/ClientFull.tsx";
import ClientSimple from "@/view/reservation/_modal/pdfExport/ClientSimple.tsx";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";
import {extractDataFromRow} from "@/view/reservation/_modal/pdfExport/pdfUtil/extractDataFromRow.ts";

export default function TestPdf({id}: {id: number}) {
    const [l, setL] = useState<boolean>(true);
    const [row, setRow] = useState<any>({});

    useLayoutEffect(() => {
        const getData = async () => {
            const response = await FetchApi('v1/reservation/' + id)
            setRow(response.data)
            setL(false)
        }

        getData().then()
    }, [id]);

    if (l) return <EzLoader h='100vh'/>

    // ---- 4) PREPARE PROPS FOR TEMPLATE ----
    const border = '2px solid black'
    const _props = extractDataFromRow(row)
    const props= {..._props, border}

    return (
        <Stack w='100%' align='center'>
            <EzScroll h='calc(100vh - 120px)'>
                <div>
                    <JMC {...props}/>
                    <ClientFull {...props}/>
                    <ClientSimple {...props} />
                </div>
            </EzScroll>
        </Stack>
    );
}