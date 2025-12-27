import FillTd from "@/view/reservation/_modal/pdfExport/pdfUtil/FillTd.tsx";

export default function CompanyInfo(props: Record<string, any>) {
    const {
        chapterOrder,
        costumerName,
        costumerPhone,
        serviceDate,
        pax,
        veh,
        pickupTime,
        pickupTimeAmPm,
        dropoffTime,
        dropoffTimeAmPm,
        isSpecial,
    } = props


    return (
        <>
            <tr>
                <td>CPCN 2306</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={2} rowSpan={2} align='center'>Reservation Confirmation</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td colSpan={4}>JMC Limousine DBA JMC Transportation</td>
                {FillTd(6)}
            </tr>
            <tr>
                <td colSpan={3}>Address 3169 Redwood St</td>
                {FillTd(7)}
            </tr>
            <tr>
                <td colSpan={4}>City, State, Zip Las Vegas, Nevada, 89146</td>
                {FillTd(6)}
            </tr>
            <tr>
                <td colSpan={2}>Phone:</td>
                <td colSpan={2}>702-969-2763</td>
                {FillTd(6)}
            </tr>
            <tr>
                <td colSpan={2}>Email:</td>
                <td colSpan={3}>reservations@jmclimousine.com</td>
                {FillTd(5)}
            </tr>
            <tr>
                <td colSpan={2}>Charter Order#:</td>
                <td>{chapterOrder}</td>
                {FillTd(2)}
                <td>Vehicle:</td>
                <td>{veh}</td>
                {FillTd(3)}
            </tr>
            <tr>
                <td colSpan={2}>Passenger Name:</td>
                <td>{costumerName}</td>
                {FillTd(2)}
                <td>Driver:</td>
                <td></td>
                {FillTd(3)}
            </tr>
            <tr>
                <td colSpan={2}>Passenger Mobile:</td>
                <td>{costumerPhone}</td>
                {FillTd(2)}
                <td>Party Pax#</td>
                <td>{pax}</td>
                {FillTd(3)}
            </tr>
            <tr style={{height: '20px'}}>
                {FillTd(10)}
            </tr>
            <tr>
                <td>Pick Up Date</td>
                <td></td>
                <td>{serviceDate}</td>
                {FillTd(7)}
            </tr>
            <tr>
                <td colSpan={2}>1st Pickup Time</td>
                <td>{pickupTime}</td>
                <td>{pickupTimeAmPm}</td>
                <td></td>
                <td colSpan={2}>{isSpecial ? 'End Pickup Time' : 'Dropoff Time'}</td>
                <td>{dropoffTime}</td>
                <td>{dropoffTimeAmPm}</td>
                {/*<td></td>*/}
                <td></td>
            </tr>
        </>
    );
}