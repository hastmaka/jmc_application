import classes from './monthlySummary.module.scss';
import u from "@/util";

interface VehicleStat {
    car_id: number;
    car_name: string;
    car_color: string;
    count: number;
    total: number;
}

interface Breakdown {
    base: number;
    fuel: number;
    mAndG: number;
    airportFee: number;
    tax: number;
    tips: number;
    total: number;
}

interface DailyRevenue {
    date: string;
    base: number;
    fuel: number;
    mAndG: number;
    airportFee: number;
    tax: number;
    tips: number;
    total: number;
}

interface MonthlySummaryPdfProps {
    month: string;
    monthFormatted: string;
    totalReservations: number;
    byStatus: {
        pending: { count: number; total: number };
        confirmed: { count: number; total: number };
        completed: { count: number; total: number };
        cancelled: { count: number; total: number };
    };
    earnings: {
        completed: number;
        potential: number;
        avgPerReservation: number;
    };
    breakdown: Breakdown;
    dailyRevenueBreakdown: DailyRevenue[];
    vehicles: VehicleStat[];
    vehicleTotals: { count: number; total: number };
}

export default function MonthlySummaryPdf(props: MonthlySummaryPdfProps) {
    const {
        monthFormatted,
        totalReservations,
        byStatus,
        breakdown,
        dailyRevenueBreakdown,
        vehicles,
        vehicleTotals,
    } = props;

    const getPercentage = (count: number) =>
        totalReservations > 0 ? ((count / totalReservations) * 100).toFixed(1) : '0.0';

    return (
        <div className={classes.container}>
            {/* Header */}
            <div className={classes.header}>
                <div className={classes.title}>Monthly Summary Report</div>
                <div className={classes.subtitle}>{monthFormatted}</div>
            </div>

            {/* Status Summary Cards */}
            <div className={classes.section}>
                <div className={classes.sectionTitle}>Reservations Overview</div>
                <div className={classes.statsGrid}>
                    <div className={classes.statCard}>
                        <div className={classes.statLabel}>Total</div>
                        <div className={classes.statValue}>{totalReservations}</div>
                        <div className={classes.statSubValue}>reservations</div>
                    </div>
                    <div className={classes.statCard}>
                        <div className={classes.statLabel}>Completed</div>
                        <div className={`${classes.statValue} ${classes.completed}`}>
                            {u.formatMoney(byStatus.completed.total)}
                        </div>
                        <div className={classes.statSubValue}>
                            {byStatus.completed.count} trips | {getPercentage(byStatus.completed.count)}%
                        </div>
                    </div>
                    <div className={classes.statCard}>
                        <div className={classes.statLabel}>Confirmed</div>
                        <div className={`${classes.statValue} ${classes.confirmed}`}>
                            {u.formatMoney(byStatus.confirmed.total)}
                        </div>
                        <div className={classes.statSubValue}>
                            {byStatus.confirmed.count} trips | {getPercentage(byStatus.confirmed.count)}%
                        </div>
                    </div>
                    <div className={classes.statCard}>
                        <div className={classes.statLabel}>Pending</div>
                        <div className={`${classes.statValue} ${classes.pending}`}>
                            {u.formatMoney(byStatus.pending.total)}
                        </div>
                        <div className={classes.statSubValue}>
                            {byStatus.pending.count} trips | {getPercentage(byStatus.pending.count)}%
                        </div>
                    </div>
                    <div className={classes.statCard}>
                        <div className={classes.statLabel}>Cancelled</div>
                        <div className={`${classes.statValue} ${classes.cancelled}`}>
                            {byStatus.cancelled.count}
                        </div>
                        <div className={classes.statSubValue}>
                            {getPercentage(byStatus.cancelled.count)}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Earnings Summary */}
            {/*<div className={classes.section}>*/}
            {/*    <div className={classes.sectionTitle}>Earnings Summary</div>*/}
            {/*    <div className={classes.earningsGrid}>*/}
            {/*        <div className={classes.earningItem}>*/}
            {/*            <div className={classes.earningLabel}>Completed Earnings</div>*/}
            {/*            <div className={`${classes.earningValue} ${classes.completed}`}>*/}
            {/*                {u.formatMoney(earnings.completed)}*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className={classes.earningItem}>*/}
            {/*            <div className={classes.earningLabel}>Potential Total</div>*/}
            {/*            <div className={`${classes.earningValue} ${classes.confirmed}`}*/}
            {/*                style={{*/}
            {/*                    color: 'var(--mantine-color-teal-9)',*/}
            {/*                }}*/}
            {/*            >*/}
            {/*                {u.formatMoney(earnings.potential)}*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className={classes.earningItem}>*/}
            {/*            <div className={classes.earningLabel}>Avg / Reservation</div>*/}
            {/*            <div className={classes.earningValue}>*/}
            {/*                {u.formatMoney(earnings.avgPerReservation)}*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Revenue Breakdown Table - Day by Day */}
            <div className={classes.section}>
                <div className={classes.sectionTitle}>Revenue Breakdown (Day by Day)</div>
                <table className={classes.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '12%' }}>Date</th>
                            <th>Base Fare</th>
                            <th>Fuel</th>
                            <th>M&G</th>
                            <th>Airport Fee</th>
                            <th>Tax (3%)</th>
                            <th>Tips</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dailyRevenueBreakdown.map((day) => (
                            <tr key={day.date}>
                                <td>{day.date}</td>
                                <td className={classes.right}>{u.formatMoney(day.base)}</td>
                                <td className={classes.right}>{u.formatMoney(day.fuel)}</td>
                                <td className={classes.right}>{u.formatMoney(day.mAndG)}</td>
                                <td className={classes.right}>{u.formatMoney(day.airportFee)}</td>
                                <td className={classes.right}>{u.formatMoney(day.tax)}</td>
                                <td className={classes.right}>{u.formatMoney(day.tips)}</td>
                                <td className={classes.right}>{u.formatMoney(day.total)}</td>
                            </tr>
                        ))}
                        <tr className={classes.totalRow}>
                            <td><strong>TOTAL</strong></td>
                            <td className={classes.right}>{u.formatMoney(breakdown.base)}</td>
                            <td className={classes.right}>{u.formatMoney(breakdown.fuel)}</td>
                            <td className={classes.right}>{u.formatMoney(breakdown.mAndG)}</td>
                            <td className={classes.right}>{u.formatMoney(breakdown.airportFee)}</td>
                            <td className={classes.right}>{u.formatMoney(breakdown.tax)}</td>
                            <td className={classes.right}>{u.formatMoney(breakdown.tips)}</td>
                            <td className={classes.right}><strong>{u.formatMoney(breakdown.total)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Vehicles Table */}
            <div className={classes.section}>
                <div className={classes.sectionTitle}>Vehicles Breakdown</div>
                <table className={classes.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '5%' }}>#</th>
                            <th style={{ width: '30%' }} className={classes.left}>Vehicle</th>
                            <th style={{ width: '15%' }}>Trips</th>
                            <th style={{ width: '15%' }}>% of Total</th>
                            <th style={{ width: '17.5%' }} className={classes.right}>Revenue</th>
                            <th style={{ width: '17.5%' }} className={classes.right}>Avg / Trip</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((car, index) => {
                            const tripPercentage = vehicleTotals.count > 0
                                ? ((car.count / vehicleTotals.count) * 100).toFixed(1)
                                : '0.0';
                            const avgPerTrip = car.count > 0 ? car.total / car.count : 0;

                            return (
                                <tr key={car.car_id}>
                                    <td>{index + 1}</td>
                                    <td className={classes.left}>{car.car_name}</td>
                                    <td>{car.count}</td>
                                    <td>{tripPercentage}%</td>
                                    <td className={classes.right}>{u.formatMoney(car.total)}</td>
                                    <td className={classes.right}>{u.formatMoney(avgPerTrip)}</td>
                                </tr>
                            );
                        })}
                        <tr className={classes.totalRow}>
                            <td colSpan={2} className={classes.left}>TOTAL</td>
                            <td>{vehicleTotals.count}</td>
                            <td>100%</td>
                            <td className={classes.right}>{u.formatMoney(vehicleTotals.total)}</td>
                            <td className={classes.right}>
                                {u.formatMoney(vehicleTotals.count > 0 ? vehicleTotals.total / vehicleTotals.count : 0)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className={classes.footer}>
                Generated by JMC Limousine Management System
            </div>
        </div>
    );
}
