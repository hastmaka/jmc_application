import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ReactDOM from "react-dom/client";
import {type ComponentType} from "react";
import {FetchApi} from "@/api/FetchApi.ts";

/**
 * Generates a PDF from a React component template.
 * Can either open in a modal viewer or download directly.
 *
 * @param url - API endpoint to fetch data (e.g., 'v1/reservation/123')
 * @param template - React component to render as PDF template
 * @param extractor - Function to transform API response into template props
 * @param wantToDownloadIt - If true, downloads PDF directly; if false/undefined, opens in modal
 * @param fileName - Required when wantToDownloadIt is true. The name for the downloaded file
 * @param orientation
 * @example
 * // Preview in modal
 * await pdfGenerator('v1/reservation/123', MyTemplate, extractData);
 *
 * @example
 * // Direct download with filename
 * await pdfGenerator('v1/reservation/123', MyTemplate, extractData, true, 'Report.pdf');
 */
export const pdfGenerator = async (
    url: string,
    template: ComponentType<any>,
    extractor: (row: any) => Record<string, any>,
    wantToDownloadIt?: boolean,
    fileName?: string,
    orientation: 'portrait' | 'landscape' = 'portrait'
) => {
    if (wantToDownloadIt && !fileName) {
        throw Error(`Not download it: ${fileName}`);
    }

    const response = await FetchApi(url)
    const row = response.data

    // ---- 3) CREATE HIDDEN CONTAINER ----
    const containerWidth = orientation === 'portrait' ? 900 : 1140; // 816 - 900 <-> 1056 - 1140
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "0px";
    container.style.left = "-9999px";
    container.style.width = `${containerWidth}px`;
    container.style.minHeight = "auto";
    container.style.display = "block";
    container.style.zIndex = "-1";

    document.body.appendChild(container);

    // ---- 4) PREPARE PROPS FOR TEMPLATE ----
    const border = '1px solid black'
    const _props = extractor(row)
    const props = {..._props, border}

    // ---- 5) RENDER SELECTED TEMPLATE DYNAMICALLY ----
    const TemplateComponent = template;
    const root = ReactDOM.createRoot(container);
    root.render(<TemplateComponent {...props} />);

    await new Promise(res => setTimeout(res, 400));

    // ---- 6) RENDER TO PDF ----
    const canvas = await html2canvas(container, { scale: 2 });

    const pdf = new jsPDF({ unit: "px", format: "letter", orientation });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 20;
    const topMargin = margin - 6; // Move content up 4px
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = pageHeight - margin - topMargin;

    // Calculate scale factor
    const scale = contentWidth / canvas.width;
    // const scaledHeight = canvas.height * scale;

    // How much of the original canvas fits per page (in canvas pixels)
    const canvasHeightPerPage = contentHeight / scale;

    const totalPages = Math.ceil(canvas.height / canvasHeightPerPage);

    for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
            pdf.addPage();
        }

        // Calculate the portion of canvas to extract for this page
        const sourceY = page * canvasHeightPerPage;
        const sourceHeight = Math.min(canvasHeightPerPage, canvas.height - sourceY);

        // Create a temporary canvas for this page's content
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;

        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(
                canvas,
                0, sourceY,                    // Source x, y
                canvas.width, sourceHeight,    // Source width, height
                0, 0,                          // Dest x, y
                canvas.width, sourceHeight     // Dest width, height
            );
        }

        const pageImgData = pageCanvas.toDataURL("image/png");
        const destHeight = sourceHeight * scale;

        pdf.addImage(pageImgData, "PNG", margin, topMargin, contentWidth, destHeight);
    }

    if(wantToDownloadIt) {
        pdf.save(fileName);
    } else {
        // ---- 7) OPEN PDF VIEWER MODAL ----
        const pdfBlobUrl = pdf.output('bloburl').toString();

        const modalId = 'pdf-viewer-modal' + url;
        window.openModal({
            modalId,
            title: 'PDF Preview',
            fullScreen: true,
            children: (
                <iframe
                    src={pdfBlobUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 'none', minHeight: 'calc(100vh - 100px)' }}
                />
            ),
            onClose: () => {
                URL.revokeObjectURL(pdfBlobUrl);
            },
            styles: {
                body: {
                    padding: 0,
                }
            }
        });
    }

    // ---- 8) CLEANUP ----
    root.unmount();
    container.remove();
};