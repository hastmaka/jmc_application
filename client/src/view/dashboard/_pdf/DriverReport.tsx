import classes from './driverReport.module.scss';
import u from "@/util";

interface Reservation {
    reservation_charter_order: string;
    reservation_passenger_name: string;
    reservation_time: string;
    reservation_pickup_location: string;
    dropoff_time: string;
    reservation_dropoff_location: string;
    reservation_passengers: number;
    reservation_hour: number;
    reservation_base: number;
    reservation_fuel: number;
    reservation_airport_fee: number;
    reservation_m_and_g: number;
    reservation_tips: number;
    reservation_tax: number;
    reservation_total: number;
}

interface BreakLog {
    start: string;
    end: string;
    initial: string;
}

interface DriverReportProps {
    companyName: string;
    cpcn: string;
    driverName: string;
    vehicleNumber: string;
    date: string;
    empNumber: string;
    startTime: string;
    startTimeAmPm: string;
    endTime: string;
    endTimeAmPm: string;
    reservations: Reservation[];
    breaks: BreakLog[];
    odometerStart: number;
    odometerEnd: number;
    totalMiles: number;
    gasGallons: number;
    gasCost: number;
    subTotal: number;
    driverAtm: number;
    totalToCo: number;
}

const RESERVATION_ROWS = 16;

// Format time to H:MM
const formatTime = (time: string) => {
    if (!time) return '';
    const match = time.match(/(\d{1,2}):(\d{2})/);
    if (!match) return time;
    let hour = parseInt(match[1], 10);
    hour = hour % 12 || 12;
    return `${hour}:${match[2]}`;
};

export default function DriverReport(props: DriverReportProps) {
    const {
        companyName,
        cpcn,
        driverName,
        vehicleNumber,
        date,
        empNumber,
        startTime,
        startTimeAmPm,
        endTime,
        endTimeAmPm,
        reservations,
        breaks,
        odometerStart,
        odometerEnd,
        totalMiles,
        gasGallons,
        gasCost,
        subTotal,
        totalToCo,
    } = props;

    // Pad reservations to fill empty rows
    const paddedReservations = [...reservations];
    while (paddedReservations.length < RESERVATION_ROWS) {
        paddedReservations.push({} as Reservation);
    }
    
    const border = '1px solid black';


    // Calculate grand total for all reservations
    const grandTotal = reservations.reduce((sum, r) => sum + (r.reservation_total || 0), 0);

    return (
        <table className={classes.table}>
            <colgroup>
                <col style={{width: 55}}/>   {/* RESERVATION # part 1 */}
                <col style={{width: 55}}/>   {/* RESERVATION # part 2 */}
                <col style={{width: 60}}/>   {/* PAX NAME part 1 */}
                <col style={{width: 70}}/>   {/* PAX NAME part 2 */}
                <col style={{width: 70}}/>   {/* P/U TIME */}
                <col style={{width: 70}}/>   {/* P/U LOC */}
                <col style={{width: 70}}/>   {/* D/O TIME */}
                <col style={{width: 55}}/>   {/* D/O LOC part 1 */}
                <col style={{width: 45}}/>   {/* D/O LOC part 2 */}
                <col style={{width: 40}}/>   {/* PAX */}
                <col style={{width: 65}}/>   {/* HOURS */}
                <col/>   {/* FARE S/HR */}
                <col/>   {/* FUEL */}
                <col style={{width: 45}}/>   {/* AIRPORT FEE */}
                <col/>   {/* M&G */}
                <col/>   {/* TIP */}
                <col/>   {/* 3% TAX */}
                <col/>   {/* GRAND TOTAL */}
            </colgroup>
            <tbody>
                {/* Header Row 1 - Company Name */}
                <tr>
                    <td colSpan={10} className={`${classes.noBorder} ${classes.companyName}`}>
                        {companyName}
                    </td>
                    <td colSpan={8} className={`${classes.noBorder} ${classes.cpcn}`}>
                        {cpcn}
                    </td>
                </tr>

                <tr>
                    <td colSpan={18} className={classes.noBorder} style={{height: 30}}></td>
                </tr>

                {/* Header Row 2 - Driver Info */}
                <tr>
                    <td colSpan={2} className={`${classes.noBorder} ${classes.left} ${classes.bold}`}>Driver's Name</td>
                    <td colSpan={3} className={classes.borderBottom}>{driverName}</td>
                    <td className={`${classes.noBorder} ${classes.left} ${classes.bold}`}>Vehicle #</td>
                    <td colSpan={2} className={classes.borderBottom}>{vehicleNumber}</td>
                    <td colSpan={2} className={classes.noBorder}></td>
                    <td colSpan={2} className={`${classes.noBorder} ${classes.left} ${classes.bold}`}>Start Time</td>
                    <td className={classes.borderBottom}>{startTime}</td>
                    <td className={classes.borderBottom}>{startTimeAmPm}</td>
                    <td colSpan={5} className={classes.noBorder}></td>
                </tr>

                <tr>
                    <td colSpan={18} className={classes.noBorder} style={{height: 30}}></td>
                </tr>

                {/* Header Row 3 - Date Info */}
                <tr>
                    <td colSpan={2} className={`${classes.noBorder} ${classes.left} ${classes.bold}`}>Date</td>
                    <td colSpan={3} className={classes.borderBottom}>{date}</td>
                    <td className={`${classes.noBorder} ${classes.left} ${classes.bold}`}>Emp #</td>
                    <td colSpan={2} className={classes.borderBottom}>{empNumber}</td>
                    <td colSpan={2} className={classes.noBorder}></td>
                    <td colSpan={2} className={`${classes.noBorder} ${classes.left} ${classes.bold}`}>End Time</td>
                    <td className={classes.borderBottom}>{endTime}</td>
                    <td className={classes.borderBottom}>{endTimeAmPm}</td>
                    <td colSpan={5} className={classes.noBorder}></td>
                </tr>

                <tr>
                    <td colSpan={18} className={classes.noBorder} style={{height: 30}}></td>
                </tr>

                {/* Column Headers */}
                <tr>
                    <th colSpan={2} style={{borderLeft: border, borderTop: border, borderBottom: border}}>RESERVATION #</th>
                    <th colSpan={2} style={{borderLeft: border, borderTop: border, borderBottom: border}}>PAX NAME</th>
                    <th style={{borderLeft: border, borderTop: border, borderBottom: border}}>P/U TIME</th>
                    <th style={{borderLeft: border, borderTop: border, borderBottom: border}}>P/U LOC</th>
                    <th style={{borderLeft: border, borderTop: border, borderBottom: border}}>D/O TIME</th>
                    <th colSpan={2} style={{borderLeft: border, borderTop: border, borderBottom: border}}>D/O LOC</th>
                    <th style={{borderLeft: border, borderTop: border, borderBottom: border}}>PAX</th>
                    <th style={{borderLeft: border, borderTop: border, borderBottom: border}}>HOURS</th>
                    <th style={{borderLeft: border, borderTop: border, borderBottom: border}}>FARE S/HR</th>
                    <th style={{borderLeft: border, borderTop: border, borderBottom: border}}>FUEL</th>
                    <th style={{borderLeft: border, borderTop: border, borderBottom: border}}>AIRPORT FEE</th>
                    <th style={{borderLeft: border, borderTop: border, borderBottom: border}}>TIP</th>
                    <th style={{borderLeft: border, borderTop: border, borderBottom: border}}>M&G</th>
                    <th style={{borderLeft: border, borderTop: border, borderBottom: border}}>3% TAX</th>
                    <th style={{borderLeft: border, borderTop: border, borderBottom: border, borderRight: border}}>GRAND TOTAL</th>
                </tr>

                {/* Reservation Rows */}
                {paddedReservations.map((r, i) => (
                    <tr key={i}>
                        <td colSpan={2} style={{borderLeft: border, borderBottom: border}}>{r.reservation_charter_order || ''}</td>
                        <td colSpan={2} className={classes.left} style={{borderLeft: border, borderBottom: border}}>{r.reservation_passenger_name || ''}</td>
                        <td style={{borderLeft: border, borderBottom: border}}>{formatTime(r.reservation_time)}</td>
                        <td className={classes.left} style={{borderLeft: border, borderBottom: border}}>{r.reservation_pickup_location || ''}</td>
                        <td style={{borderLeft: border, borderBottom: border}}>{formatTime(r.dropoff_time)}</td>
                        <td colSpan={2} className={classes.left} style={{borderLeft: border, borderBottom: border}}>{r.reservation_dropoff_location || ''}</td>
                        <td style={{borderLeft: border, borderBottom: border}}>{r.reservation_passengers || ''}</td>
                        <td style={{borderLeft: border, borderBottom: border}}>{r.reservation_hour ? +r.reservation_hour : ''}</td>
                        <td className={classes.right} style={{borderLeft: border, borderBottom: border}}>{r.reservation_base ? u.formatMoney(r.reservation_base / 100, false) : ''}</td>
                        <td className={classes.right} style={{borderLeft: border, borderBottom: border}}>{r.reservation_fuel ? u.formatMoney(r.reservation_fuel / 100, false) : ''}</td>
                        <td className={classes.right} style={{borderLeft: border, borderBottom: border}}>{r.reservation_airport_fee ? u.formatMoney(r.reservation_airport_fee / 100, false) : ''}</td>
                        <td className={classes.right} style={{borderLeft: border, borderBottom: border}}>{r.reservation_tips ? u.formatMoney(r.reservation_tips / 100, false) : ''}</td>
                        <td className={classes.right} style={{borderLeft: border, borderBottom: border}}>{r.reservation_m_and_g ? u.formatMoney(r.reservation_m_and_g / 100, false) : ''}</td>
                        <td className={classes.right} style={{borderLeft: border, borderBottom: border}}>{r.reservation_tax ? u.formatMoney(r.reservation_tax, false) : ''}</td>
                        <td className={classes.right} style={{borderLeft: border, borderBottom: border, borderRight: border}}>{r.reservation_total ? u.formatMoney(r.reservation_total / 100, false) : '0.00'}</td>
                    </tr>
                ))}

                {/* Totals Row */}
                <tr>
                    <td colSpan={17} className={classes.noBorder}></td>
                    <td className={classes.right} style={{borderLeft: border, borderRight: border}}>{u.formatMoney(grandTotal / 100, false)}</td>
                </tr>

                {/* Footer Section */}
                <tr>
                    <td colSpan={3} className={classes.bold} style={{border}}>BREAK LOG</td>
                    <td className={classes.noBorder}></td>
                    <td colSpan={2} className={classes.bold} style={{border}}>ACTUAL MILEAGE</td>
                    <td className={classes.noBorder}></td>
                    <td colSpan={2} className={classes.bold} style={{border}}>GAS LOG</td>
                    <td colSpan={6} className={classes.noBorder}></td>
                    <td colSpan={2} style={{borderLeft: border, borderTop: border}}>(-) GAS</td>
                    <td className={classes.right} style={{borderLeft: border, borderTop: border, borderRight: border}}>{u.formatMoney(gasCost / 100, false)}</td>
                </tr>

                <tr>
                    <td className={classes.bold} style={{borderLeft: border, borderBottom: border}}>START</td>
                    <td className={classes.bold} style={{borderLeft: border, borderBottom: border}}>END</td>
                    <td className={classes.bold} style={{borderLeft: border, borderBottom: border, borderRight: border}}>INITIAL</td>
                    <td className={classes.noBorder}></td>
                    <td className={classes.bold} style={{borderLeft: border, borderBottom: border}}>START</td>
                    <td className={classes.right} style={{borderLeft: border, borderBottom: border, borderRight: border}}>{u.formatMoney(odometerStart, false, false)}</td>
                    <td className={classes.noBorder}></td>
                    <td className={classes.bold} style={{borderLeft: border, borderBottom: border}}>GALS</td>
                    <td className={classes.bold} style={{borderLeft: border, borderBottom: border, borderRight: border}}>COST</td>
                    <td colSpan={6} className={classes.noBorder}></td>
                    <td colSpan={2} style={{borderLeft: border, borderTop: border}}>SUB-TOTAL</td>
                    <td className={classes.right} style={{borderLeft: border, borderTop: border, borderRight: border}}>{u.formatMoney(subTotal / 100, false)}</td>
                </tr>

                <tr>
                    <td style={{borderLeft: border, borderBottom: border}}>{formatTime(breaks[0]?.start || '')}</td>
                    <td style={{borderLeft: border, borderBottom: border}}>{formatTime(breaks[0]?.end || '')}</td>
                    <td style={{borderLeft: border, borderBottom: border, borderRight: border}}>{breaks[0]?.initial || ''}</td>
                    <td className={classes.noBorder}></td>
                    <td className={classes.bold} style={{borderLeft: border, borderBottom: border}}>END</td>
                    <td className={classes.right} style={{borderLeft: border, borderBottom: border, borderRight: border}}>{u.formatMoney(odometerEnd, false, false)}</td>
                    <td className={classes.noBorder}></td>
                    <td style={{borderLeft: border, borderBottom: border}}>{gasGallons || ''}</td>
                    <td className={classes.right} style={{borderLeft: border, borderBottom: border, borderRight: border}}>{u.formatMoney(gasCost / 100, false)}</td>
                    <td colSpan={6} className={classes.noBorder}></td>
                    <td colSpan={2} style={{borderLeft: border, borderTop: border}}>DRIVER ATM</td>
                    <td className={classes.right} style={{borderLeft: border, borderTop: border, borderRight: border}}></td>
                </tr>

                <tr>
                    <td style={{borderLeft: border, borderBottom: border}}>{formatTime(breaks[1]?.start || '')}</td>
                    <td style={{borderLeft: border, borderBottom: border}}>{formatTime(breaks[1]?.end || '')}</td>
                    <td style={{borderLeft: border, borderBottom: border, borderRight: border}}>{breaks[1]?.initial || ''}</td>
                    <td className={classes.noBorder}></td>
                    <td className={classes.bold} style={{borderLeft: border, borderBottom: border}}>TOTAL</td>
                    <td className={classes.right} style={{borderLeft: border, borderBottom: border, borderRight: border}}>{totalMiles}</td>
                    <td colSpan={9} className={classes.noBorder}></td>
                    <td colSpan={2} style={{borderLeft: border, borderTop: border, borderBottom: border}}>TOTAL TO CO.</td>
                    <td className={classes.right} style={{border}}>{u.formatMoney(totalToCo / 100, false)}</td>
                </tr>

                {/* Additional breaks beyond 2 */}
                {breaks.slice(2).map((b, i) => (
                    <tr key={i}>
                        <td style={{borderLeft: border, borderBottom: border}}>{formatTime(b.start || '')}</td>
                        <td style={{borderLeft: border, borderBottom: border}}>{formatTime(b.end || '')}</td>
                        <td style={{borderLeft: border, borderBottom: border, borderRight: border}}>{b.initial || ''}</td>
                        <td colSpan={15} className={classes.noBorder}></td>
                    </tr>
                ))}

                {/* Signature Row */}
                <tr>
                    <td colSpan={3} className={classes.noBorder}></td>
                    <td colSpan={5} className={`${classes.noBorder} ${classes.left} ${classes.bold}`} style={{paddingTop: 20}}>
                        THIS TRIP LOG IS A COMPLETE & ACCURATE REPORT
                    </td>
                    <td colSpan={4} className={`${classes.noBorder} ${classes.right} ${classes.bold}`} style={{paddingTop: 20}}>
                        SIGNATURE:
                    </td>
                    <td colSpan={5}
                        style={{
                            borderLeft: 'none', borderTop: 'none', borderRight: 'none',
                            borderBottom: border,
                            paddingTop: 20}}
                    ></td>
                </tr>
            </tbody>
        </table>
    );
}