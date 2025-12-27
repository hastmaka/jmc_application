import classes from "./ClientFull.module.scss";
import u from "@/util";
import FillTd from "@/view/reservation/_modal/pdfExport/pdfUtil/FillTd.tsx";
import Space from "./pdfUtil/Space.tsx";
import TermsAndConditions from "@/view/reservation/_modal/pdfExport/pdfUtil/_termsAndConditions.tsx";
import CompanyInfo from "@/view/reservation/_modal/pdfExport/pdfUtil/companyInfo.tsx";
import ReservationDetail from "@/view/reservation/_modal/pdfExport/pdfUtil/reservationDetail.tsx";

export default function ClientFull(props: any) {
    const {
        base,
        fuel,
        mg,
        tax,
        tip,
        tipCalc,
        total,
        specialInstruction,
        hour
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
                        <td>Base Fare</td>
                        <td align='right'>{u.formatMoney(base*hour)}</td>
                        <td></td>
                        <td></td>
                        {tip ? <td></td> : <td>Tips are not included</td>}
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Breakdown</td>
                        <td></td>
                        <td>Gas</td>
                        <td align='right'>{u.formatMoney(fuel*hour)}</td>
                        {FillTd(6)}
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td>Meet & Greet</td>
                        <td align='right'>{u.formatMoney(mg)}</td>
                        {FillTd(6)}
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td>3% Tax</td>
                        <td align='right'>{u.formatMoney(tax)}</td>
                        {FillTd(6)}
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td>Tip</td>
                        <td align='right'>{u.formatMoney(tipCalc)}</td>
                        {FillTd(6)}
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td>Total</td>
                        <td align='right'>{u.formatMoney(total)}</td>
                        {FillTd(6)}
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

                    <TermsAndConditions />
                </tbody>
            </table>
        </div>
    );
}