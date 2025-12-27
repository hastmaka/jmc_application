export function getRealMoney(data: Record<string, any>) {
    if (!data || typeof data !== "object") {
        return {
            hour: 0,
            basePlusHour: 0,
            mg: 0,
            airportFee: 0,
            fuelPlusHour: 0,
            taxes: 0,
            subTotal: 0,
            tips: 0,
            total: 0,
        };
    }

    const toNum = (v: any) => Number(v) || 0;

    const hour = toNum(data.reservation_hour);
    const base = toNum(data.reservation_base);
    const mg = toNum(data.reservation_m_and_g);
    const fuel = toNum(data.reservation_fuel);
    const airportFee = toNum(data.reservation_airport_fee);
    const tipsPercent = toNum(data.reservation_tips);

    const basePlusHour = base * hour;
    const fuelPlusHour = fuel * hour;

    const subTotal = basePlusHour + mg + fuelPlusHour + airportFee;
    // base + mg + a.fee / 0.03
    const taxes = (basePlusHour + mg + airportFee + fuelPlusHour) * 0.03;

    // tips % base on base Price
    const tips = tipsPercent ? (basePlusHour * tipsPercent) / 100 : 0;

    const total = subTotal + taxes + tips;

    return {
        hour,
        basePlusHour,
        mg,
        airportFee,
        fuelPlusHour,
        taxes,
        subTotal,
        tips,
        total,
    };
}

