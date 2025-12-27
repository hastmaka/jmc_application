import classes from "./ClientFull.module.scss";
import u from "@/util";
import Space from "./pdfUtil/Space.tsx";
import TermsAndConditions from "@/view/reservation/_modal/pdfExport/pdfUtil/_termsAndConditions.tsx";
import CompanyInfo from "@/view/reservation/_modal/pdfExport/pdfUtil/companyInfo.tsx";
import ReservationDetail from "@/view/reservation/_modal/pdfExport/pdfUtil/reservationDetail.tsx";

export default function ClientSimple(props: any) {
    const {
        tip,
        specialInstruction,
        realValue
    } = props
    return (
        <div style={{maxWidth: 900}}>
            <table className={classes.table} id="client">
                <tbody>
                    <tr>
                        <td style={{width: '12%'}}></td>{/* 1 */}
                        <td style={{width: '8%'}}></td> {/* 2 */}
                        <td style={{width: '12%'}}></td>{/* 3 */}
                        <td style={{width: '10%'}}></td>{/* 4 */}
                        <td style={{width: '8%'}}></td>{/* 5 */}
                        <td style={{width: '13%'}}></td>{/* 6 */}
                        <td style={{width: '19%'}}></td>{/* 7 */}
                        <td style={{width: '6.3%'}}></td>{/* 8 */}
                        <td style={{width: '6.3%'}}></td>{/* 9 */}
                        <td style={{width: '6.3%'}}></td>{/* 10 */}
                    </tr>
                    <CompanyInfo {...props}/>
                    <Space/>
                    <ReservationDetail {...props}/>
                    <Space/>
                    {/* Money Breakdown */}
                    <tr>
                        <td>Price</td>
                        <td></td>
                        <td align='right'>{u.formatMoney(realValue/100)}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {tip ? <td></td> : <td>Tips are not included</td>}
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <Space/>

                    <tr>
                        <td colSpan={10} style={{background: '#92d050'}}>Special Instructions</td>
                    </tr>
                    <tr>
                        <td colSpan={10}>{specialInstruction}</td>
                    </tr>
                    <Space/>
                    <tr>
                        <td colSpan={10} style={{background: '#92d050'}}>Terms & Conditions</td>
                    </tr>

                    <TermsAndConditions/>
                </tbody>
            </table>
        </div>
    );
}