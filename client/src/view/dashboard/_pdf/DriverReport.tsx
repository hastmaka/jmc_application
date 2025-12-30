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

const RESERVATION_ROWS = 18;

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

    // Pad breaks to 3 rows
    const paddedBreaks = [...breaks];
    while (paddedBreaks.length < 3) {
        paddedBreaks.push({ start: '', end: '', initial: '' });
    }

    // Calculate grand total for all reservations
    const grandTotal = reservations.reduce((sum, r) => sum + (r.reservation_total || 0), 0);

    return (
        <div style={{ width: 900, padding: 10, backgroundColor: 'white' }}>
            <table className={classes.table}>
                <tbody>
                    {/* Header Row 1 - Company Name */}
                    <tr>
                        <td colSpan={8} className={`${classes.noBorder} ${classes.companyName}`}>
                            {companyName}
                        </td>
                        <td colSpan={7} className={`${classes.noBorder} ${classes.cpcn}`}>
                            {cpcn}
                        </td>
                    </tr>

                    {/* Header Row 2 - Driver Info */}
                    <tr>
                        <td colSpan={2} className={`${classes.noBorder} ${classes.left}`}>Driver's Name</td>
                        <td colSpan={2} className={classes.noBorder}>{driverName}</td>
                        <td className={`${classes.noBorder} ${classes.left}`}>Vehicle #</td>
                        <td className={classes.noBorder}>{vehicleNumber}</td>
                        <td colSpan={2} className={classes.noBorder}></td>
                        <td className={`${classes.noBorder} ${classes.left}`}>Star Time</td>
                        <td className={classes.noBorder}>{startTime}</td>
                        <td className={classes.noBorder}>{startTimeAmPm}</td>
                        <td colSpan={4} className={classes.noBorder}></td>
                    </tr>

                    {/* Header Row 3 - Date Info */}
                    <tr>
                        <td colSpan={2} className={`${classes.noBorder} ${classes.left}`}>Date</td>
                        <td colSpan={2} className={classes.noBorder}>{date}</td>
                        <td className={`${classes.noBorder} ${classes.left}`}>Emp #</td>
                        <td className={classes.noBorder}>{empNumber}</td>
                        <td colSpan={2} className={classes.noBorder}></td>
                        <td className={`${classes.noBorder} ${classes.left}`}>End Time</td>
                        <td className={classes.noBorder}>{endTime}</td>
                        <td className={classes.noBorder}>{endTimeAmPm}</td>
                        <td colSpan={4} className={classes.noBorder}></td>
                    </tr>

                    {/* Column Headers */}
                    <tr>
                        <th>RESERVATION #</th>
                        <th>PAX NAME</th>
                        <th>P/U TIME</th>
                        <th>P/U LOC</th>
                        <th>D/O TIME</th>
                        <th>D/O LOC</th>
                        <th>PAX</th>
                        <th>HOURS</th>
                        <th>FARE S/HR</th>
                        <th>FUEL</th>
                        <th>AIRPORT FEE</th>
                        <th>M&G</th>
                        <th>TIP</th>
                        <th>3% TAX</th>
                        <th>GRAND TOTAL</th>
                    </tr>

                    {/* Reservation Rows */}
                    {paddedReservations.map((r, i) => (
                        <tr key={i}>
                            <td>{r.reservation_charter_order || ''}</td>
                            <td className={classes.left}>{r.reservation_passenger_name || ''}</td>
                            <td>{r.reservation_time || ''}</td>
                            <td className={classes.left}>{r.reservation_pickup_location || ''}</td>
                            <td>{r.dropoff_time || ''}</td>
                            <td className={classes.left}>{r.reservation_dropoff_location || ''}</td>
                            <td>{r.reservation_passengers || ''}</td>
                            <td>{r.reservation_hour || ''}</td>
                            <td className={classes.right}>{r.reservation_base ? u.formatMoney(r.reservation_base / 100) : '0.00'}</td>
                            <td className={classes.right}>{r.reservation_fuel ? u.formatMoney(r.reservation_fuel / 100) : '0.00'}</td>
                            <td className={classes.right}>{r.reservation_airport_fee ? u.formatMoney(r.reservation_airport_fee / 100) : '0.00'}</td>
                            <td className={classes.right}>{r.reservation_m_and_g ? u.formatMoney(r.reservation_m_and_g / 100) : ''}</td>
                            <td className={classes.right}>{r.reservation_tips ? u.formatMoney(r.reservation_tips / 100) : ''}</td>
                            <td className={classes.right}>{r.reservation_tax ? u.formatMoney(r.reservation_tax / 100) : '0.00'}</td>
                            <td className={classes.right}>{r.reservation_total ? u.formatMoney(r.reservation_total / 100) : '0.00'}</td>
                        </tr>
                    ))}

                    {/* Totals Row */}
                    <tr>
                        <td colSpan={14} className={classes.right}></td>
                        <td className={classes.right}>{u.formatMoney(grandTotal / 100)}</td>
                    </tr>

                    {/* Footer Section */}
                    <tr>
                        <td colSpan={2} style={{ backgroundColor: '#e0e0e0' }}>BREAK LOG</td>
                        <td className={classes.noBorder}></td>
                        <td colSpan={2} style={{ backgroundColor: '#e0e0e0' }}>ACTUAL MILEAGE</td>
                        <td className={classes.noBorder}></td>
                        <td colSpan={2} style={{ backgroundColor: '#e0e0e0' }}>GAS LOG</td>
                        <td colSpan={4} className={classes.noBorder}></td>
                        <td colSpan={2} className={classes.right}>(-) GAS</td>
                        <td className={classes.right}>{u.formatMoney(gasCost / 100)}</td>
                    </tr>

                    <tr>
                        <td>STAR</td>
                        <td>END</td>
                        <td className={classes.noBorder}></td>
                        <td>START</td>
                        <td className={classes.right}>{u.formatMoney(odometerStart, false)}</td>
                        <td className={classes.noBorder}></td>
                        <td>GALS</td>
                        <td>COST</td>
                        <td colSpan={4} className={classes.noBorder}></td>
                        <td colSpan={2} className={classes.right}>SUB-TOTAL</td>
                        <td className={classes.right}>{u.formatMoney(subTotal / 100)}</td>
                    </tr>

                    <tr>
                        <td>{paddedBreaks[0]?.start || ''}</td>
                        <td>{paddedBreaks[0]?.end || ''}</td>
                        <td className={classes.noBorder}></td>
                        <td>END</td>
                        <td className={classes.right}>{u.formatMoney(odometerEnd, false)}</td>
                        <td className={classes.noBorder}></td>
                        <td>{gasGallons || ''}</td>
                        <td className={classes.right}>{u.formatMoney(gasCost / 100)}</td>
                        <td colSpan={4} className={classes.noBorder}></td>
                        <td colSpan={2} className={classes.right}>DRIVER ATM</td>
                        <td className={classes.right}></td>
                    </tr>

                    <tr>
                        <td>{paddedBreaks[1]?.start || ''}</td>
                        <td>{paddedBreaks[1]?.end || ''}</td>
                        <td className={classes.noBorder}></td>
                        <td>TOTAL</td>
                        <td className={classes.right}>{totalMiles}</td>
                        <td colSpan={7} className={classes.noBorder}></td>
                        <td colSpan={2} className={classes.right}>TOTAL TO CO.</td>
                        <td className={classes.right}>{u.formatMoney(totalToCo / 100)}</td>
                    </tr>

                    <tr>
                        <td>{paddedBreaks[2]?.start || ''}</td>
                        <td>{paddedBreaks[2]?.end || ''}</td>
                        <td colSpan={13} className={classes.noBorder}></td>
                    </tr>

                    {/* Signature Row */}
                    <tr>
                        <td colSpan={6} className={`${classes.noBorder} ${classes.left}`} style={{ paddingTop: 20 }}>
                            THIS TRIP LOG IS A COMPLETE & ACCURATE REPORT
                        </td>
                        <td colSpan={3} className={`${classes.noBorder} ${classes.right}`} style={{ paddingTop: 20 }}>
                            SIGNATURE:
                        </td>
                        <td colSpan={6} className={classes.noBorder} style={{ borderBottom: '1px solid black', paddingTop: 20 }}></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}