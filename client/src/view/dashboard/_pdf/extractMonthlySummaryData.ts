import dayjs from "dayjs";

export function extractMonthlySummaryData(data: any) {
    const month = data.month || '';
    const monthFormatted = month ? dayjs(month, 'YYYY-MM').format('MMMM YYYY') : '';

    const byStatus = data.byStatus || {
        pending: { count: 0, total: 0 },
        confirmed: { count: 0, total: 0 },
        completed: { count: 0, total: 0 },
        cancelled: { count: 0, total: 0 }
    };

    const earnings = data.earnings || {
        completed: 0,
        potential: 0,
        avgPerReservation: 0
    };

    const breakdown = data.breakdown || {
        base: 0,
        fuel: 0,
        mAndG: 0,
        airportFee: 0,
        tax: 0,
        tips: 0,
        total: 0
    };

    const dailyRevenueBreakdown = data.dailyRevenueBreakdown || [];

    const vehicles = data.topCars || [];

    // Calculate vehicle totals
    const vehicleTotals = vehicles.reduce((acc: any, car: any) => ({
        count: acc.count + car.count,
        total: acc.total + car.total
    }), { count: 0, total: 0 });

    return {
        month,
        monthFormatted,
        totalReservations: data.totalReservations || 0,
        byStatus,
        earnings,
        breakdown,
        dailyRevenueBreakdown,
        vehicles,
        vehicleTotals
    };
}
