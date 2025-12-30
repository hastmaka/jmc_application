import classes from './JMC.module.scss';
import Under from "../../../../components/pdfUtilities/Under.tsx";
import FillTd from "../../../../components/pdfUtilities/FillTd.tsx";
import u from "@/util";
import {Fragment} from "react";
import Space from "@/components/pdfUtilities/Space.tsx";

export default function JMC(props: any) {
    const {
        serviceName,
        createAt,
        chapterOrder,
        costumerName,
        costumerPhone,
        serviceDate,
        source,
        pax,
        veh,
        pickupTime,
        pickupTimeAmPm,
        dropoffTime,
        dropoffTimeAmPm,
        pickupLocation,
        dropoffLocation,
        base,
        hour,
        fuel,
        mg,
        airportFee,
        // subTotal,
        flyInfo,
        tax,
        tip,
        tipCalc,
        total,
        border,
        reservation_itinerary,
        specialInstruction,
        isSpecial
    } = props

    return (
        <div style={{maxWidth: 900}}>
            <table className={classes.table} id="jmc">
                <tbody>
                    <tr>
                        <td style={{width: '26%'}}><Under>Charter Order</Under></td>
                        <td style={{width: '18%'}}></td>
                        <td style={{width: '22%'}}>{serviceName}</td>
                        <td style={{width: '16%'}}></td>
                        <td style={{width: '14%'}}></td>
                        <td style={{width: '6%'}}></td>
                        <td style={{width: '10%'}}></td>
                        {/*<td style={{width: '1%'}}></td>*/}
                    </tr>
                    <tr>
                        <td><Under style={{fontStyle: 'italic'}}>CPCN 2306</Under></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colSpan={3}><Under>Name </Under>JMC Limousine DBA JMC Transportation</td>
                        <td><Under>Request Date:</Under></td>
                        <td colSpan={3} align='center' style={{border}}>{createAt}</td>
                    </tr>
                    <tr>
                        <td colSpan={3}><Under>Address </Under>3169 Redwood St </td>
                        {FillTd(4)}
                    </tr>
                    <tr>
                        <td colSpan={2}><Under>City, State, Zip </Under>Las Vegas, Nevada, 89146 </td>
                        {FillTd(5)}
                    </tr>
                    <tr>
                        <td><Under>Phone </Under>702-969-2763 </td>
                        {FillTd(6)}
                    </tr>
                    <tr>
                        <td>Charter Order#:</td>
                        {FillTd(1)}
                        <td>{chapterOrder}</td>
                        {FillTd(4)}
                    </tr>

                    <Space/>

                    {/** Costumer */}
                    <tr>
                        <td style={{borderLeft: border, borderTop: border, borderBottom: border}}>Customer:</td>
                        <td colSpan={2} style={{borderTop: border, borderLeft: border, borderBottom: border}}>{costumerName}</td>
                        <td rowSpan={2} style={{border}}>Service Date:</td>
                        <td colSpan={3} rowSpan={2} style={{borderTop: border, borderBottom: border, borderRight: border}} align='center'>{serviceDate}</td>
                        <td style={{borderRight: border, borderTop: border}}></td>
                    </tr>
                    <tr>
                        <td style={{borderLeft: border, borderBottom: border}}>Phone Number:</td>
                        <td colSpan={2} style={{borderLeft: border, borderBottom: border}}>{costumerPhone}</td>
                        <td style={{ borderRight: border}}></td>
                    </tr>
                    <tr>
                        <td rowSpan={5} style={{borderLeft: border}}>Passenger Information:</td>
                        <td rowSpan={5} colSpan={2} align='center'  style={{borderLeft: border}}>{source}</td>
                    </tr>
                    <tr>
                        <td style={{borderInline: border, borderBottom: border}}>Number of Passengers</td>
                        <td colSpan={3} style={{borderRight: border, borderBottom: border}} align='center'>{pax}</td>
                        <td style={{borderBottom: border, borderRight: border}}></td>
                    </tr>
                    <tr>
                        <td style={{borderLeft: border, borderBottom: border, borderRight: border}}>Type of Vehicle:</td>
                        <td style={{borderBottom: border}} align='center'>{veh}</td>
                        <td style={{borderBottom: border}}></td>
                        <td style={{borderBottom: border, borderRight: border}}></td>
                        <td style={{borderRight: border}}></td>
                    </tr>
                    <tr>
                        <td style={{borderLeft: border, borderBottom: border, borderRight: border}}>1st Pickup Time:</td>
                        <td style={{borderBottom: border}} align='center'>{pickupTime}</td>
                        <td style={{borderBottom: border}}></td>
                        <td style={{borderBottom: border, borderRight: border}} align='center'>{pickupTimeAmPm}</td>
                        <td style={{borderRight: border}}></td>
                    </tr>
                    <tr>
                        <td style={{borderLeft: border, borderRight: border}}>{isSpecial ? 'End Pickup Time' : 'Dropoff time:'}</td>
                        <td align='center'>{dropoffTime}</td>
                        <td></td>
                        <td style={{borderRight: border}} align='center'>{dropoffTimeAmPm}</td>
                        <td style={{borderRight: border}}></td>
                    </tr>

                    <tr style={{height:'26px'}}>
                        <td colSpan={8} style={{border}}></td>
                    </tr>
                    <tr style={{height:'80px'}}>
                        <td colSpan={8} style={{borderInline: border}} align='center'>As Directed</td>
                    </tr>

                    {/** Route Description*/}
                    <tr style={{height:'26px'}}>
                        <td colSpan={8} style={{border}}>Route Description:</td>
                    </tr>
                    <tr style={{height:'20px'}}>
                        <td style={{borderLeft: border}}></td>
                        {FillTd(5)}
                        <td style={{borderRight: border}}></td>
                    </tr>

                    {/* ORIGINAL PICKUP */}
                    <tr>
                        <td style={{borderLeft: border}}>Pickup Location</td>
                        <td colSpan={2}>{pickupLocation} {flyInfo || ''}</td>
                        {FillTd(3)}
                        <td style={{borderRight: border}}></td>
                    </tr>

                    {/* FINAL DROP OFF */}
                    <tr>
                        <td style={{borderLeft: border}}>Dropoff Location</td>
                        <td colSpan={2}>{dropoffLocation}</td>
                        {FillTd(3)}
                        <td style={{borderRight: border}}></td>
                    </tr>

                    {/* ALL ITINERARY STOPS */}
                    {(() => {
                        return reservation_itinerary.map((item: any, index: number) => {
                            const pKey = Object.keys(item).find(k => k.startsWith("reservation_pickup_location_"));
                            const dKey = Object.keys(item).find(k => k.startsWith("reservation_dropoff_location_"));
                            const pickup = pKey ? item[pKey] : "";
                            const dropoff = dKey ? item[dKey] : "";

                            return (
                                <Fragment key={index}>
                                    <tr>
                                        <td style={{borderLeft: border}}>Pickup Location</td>
                                        <td colSpan={2}>{pickup}</td>
                                        {FillTd(3)}
                                        <td style={{borderRight: border}}></td>
                                    </tr>
                                    <tr>
                                        <td style={{borderLeft: border}}>Dropoff Location</td>
                                        <td colSpan={2}>{dropoff}</td>
                                        {FillTd(3)}
                                        <td style={{borderRight: border}}></td>
                                    </tr>
                                </Fragment>
                            );
                        });
                    })()}
                    <tr style={{height:'20px'}}>
                        <td style={{borderLeft: border}}></td>
                        {FillTd(5)}
                        <td style={{borderRight: border}}></td>
                    </tr>

                    {/** Route Description*/}
                    <tr style={{height:'26px'}}>
                        <td colSpan={3} style={{borderLeft: border, borderBlock: border}} align='center'>Notes</td>
                        <td colSpan={4} style={{border}} align='center'>Description Charges</td>
                        <td style={{borderRight: border}}></td>
                    </tr>

                    {/** Charge Description*/}
                    <tr>
                        <td colSpan={3} rowSpan={7} style={{borderLeft: border, verticalAlign: 'top', padding: '.5rem'}}>{specialInstruction}</td>
                        <td style={{borderLeft: border, borderBottom: border}}>Concept</td>
                        <td style={{borderLeft: border, borderBottom: border}} align='center'>Rate</td>
                        <td style={{borderLeft: border, borderBottom: border}} align='center'>Qty</td>
                        <td style={{borderLeft: border, borderBottom: border, borderRight: border}} align='center'>Amount</td>
                        <td style={{borderRight: border}}></td>
                    </tr>
                    <tr>
                        <td style={{borderLeft: border, borderBottom: border}}>Base Fare</td>
                        <td style={{borderLeft: border, borderBottom: border}} align='center'>{u.formatMoney(base)}</td>
                        <td style={{borderLeft: border, borderBottom: border}} align='right'>{hour}</td>
                        <td style={{borderLeft: border, borderBottom: border, borderRight: border}} align='right'>{u.formatMoney(base*hour)}</td>
                        <td style={{borderRight: border}}></td>
                    </tr>
                    <tr>
                        <td style={{borderLeft: border, borderBottom: border}}>Gas</td>
                        <td style={{borderLeft: border, borderBottom: border}} align='center'>{u.formatMoney(fuel)}</td>
                        <td style={{borderLeft: border, borderBottom: border}} align='right'>{hour}</td>
                        <td style={{borderLeft: border, borderBottom: border, borderRight: border}} align='right'>{u.formatMoney(fuel*hour)}</td>
                        <td style={{borderRight: border}}></td>
                    </tr>
                    <tr>
                        <td style={{borderLeft: border, borderBottom: border}}>Airport Fee</td>
                        <td style={{borderLeft: border, borderBottom: border}} align='center'>{u.formatMoney(airportFee)}</td>
                        <td style={{borderLeft: border, borderBottom: border}} align='right'></td>
                        <td style={{borderLeft: border, borderBottom: border, borderRight: border}} align='right'>{u.formatMoney(airportFee)}</td>
                        <td style={{borderRight: border}}></td>
                    </tr>
                    <tr>
                        <td style={{borderLeft: border, borderBottom: border}}>M&G</td>
                        <td style={{borderLeft: border, borderBottom: border}} align='center'>{u.formatMoney(mg)}</td>
                        <td style={{borderLeft: border, borderBottom: border}} align='right'></td>
                        <td style={{borderLeft: border, borderBottom: border, borderRight: border}} align='right'>{u.formatMoney(mg)}</td>
                        <td style={{borderRight: border, borderTop: border}}></td>
                    </tr>
                    <tr>
                        <td style={{borderLeft: border, borderBottom: border}}>Tax</td>
                        <td style={{borderLeft: border, borderBottom: border}} align='center'>3%</td>
                        <td style={{borderLeft: border, borderBottom: border}} align='right'></td>
                        <td style={{borderLeft: border, borderBottom: border, borderRight: border}} align='right'>{u.formatMoney(tax)}</td>
                        <td style={{borderRight: border}}></td>
                    </tr>
                    <tr>
                        <td style={{borderLeft: border}}>Tip</td>
                        <td style={{borderLeft: border}} align='center'>{tip}%</td>
                        <td style={{borderLeft: border}} align='right'></td>
                        <td style={{borderLeft: border, borderRight: border}} align='right'>{u.formatMoney(tipCalc)}</td>
                        <td style={{borderRight: border, borderTop: border}}></td>
                    </tr>
                    <tr>
                        <td style={{borderLeft: border, borderTop: border, borderBottom: border}}></td>
                        <td style={{borderBottom: border, borderTop: border}}></td>
                        <td style={{borderBottom: border, borderTop: border}}></td>
                        <td style={{borderLeft: border, borderTop: border, borderBottom: border}} align='center'>Total</td>
                        <td style={{borderLeft: border, borderBottom: border, borderTop: border}}></td>
                        <td style={{borderBlock: border, borderLeft: border}} align='right'></td>
                        <td style={{border}} align='right'>{u.formatMoney(total)}</td>
                        <td style={{borderBottom: border, borderRight: border}}></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}