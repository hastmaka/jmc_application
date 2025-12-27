import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ReactDOM from "react-dom/client";
import {lazy} from "react";
import {FetchApi} from "@/api/FetchApi.ts";
import {extractDataFromRow} from "@/view/reservation/_modal/pdfExport/pdfUtil/extractDataFromRow.ts";

export const pdfGenerator = async (reservationId: any, who: string) => {
    const response = await FetchApi('v1/reservation/' + reservationId)
    const row = response.data
    // ---- 1) COMPONENT MAP (ADD ANY PDF TEMPLATES HERE) ----
    const templates: Record<string, any> = {
        ['c_order']: lazy(() => import('./JMC.tsx')),
        ['conf_brake']: lazy(() => import('./ClientFull.tsx')),
        ['conf']: lazy(() => import('./ClientSimple.tsx')),
    };

    // ---- 2) VALIDATION ----
    if (!templates[who]) {
        console.error(`PDF Template "${who}" not found`);
        return;
    }

    // ---- 3) CREATE HIDDEN CONTAINER ----
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "0px";
    container.style.left = "-9999px";
    container.style.width = "900px";
    container.style.minHeight = "auto";
    container.style.display = "block";
    container.style.zIndex = "-1";

    document.body.appendChild(container);

    // ---- 4) PREPARE PROPS FOR TEMPLATE ----
    const border = '1px solid black'
    const _props = extractDataFromRow(row)
    const props = {..._props, border}

    // ---- 5) RENDER SELECTED TEMPLATE DYNAMICALLY ----
    const TemplateComponent = templates[who];
    const root = ReactDOM.createRoot(container);
    root.render(<TemplateComponent {...props} />);

    await new Promise(res => setTimeout(res, 400));

    // ---- 6) RENDER TO PDF ----
    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({ unit: "px", format: "letter" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    // const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 20;
    const topMargin = margin / 2; // Reduced top margin
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = topMargin;

    pdf.addImage(imgData, "PNG", margin, topMargin, imgWidth, imgHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeight + margin;
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save(`${who}_${_props.costumerName}_${_props.chapterOrder}.pdf`);

    // ---- 7) CLEANUP ----
    root.unmount();
    container.remove();
};