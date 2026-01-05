import dayjs from "dayjs";

export function extractDriverReportData(inspection: any) {
    const vehicles = inspection.inspection_vehicles || [];
    const breaks = inspection.inspection_breaks || [];

    // Get first vehicle for header info (or combine for multi-vehicle)
    // const firstVehicle = vehicles[0];
    const vehicleNumber = vehicles
        .map((v: any) => v.vehicle_car?.car_plate || '')
        .filter(Boolean)
        .join(', ');

    // Collect all reservations from all vehicles
    const reservations: any[] = [];
    let totalOdometerStart = 0;
    let totalOdometerEnd = 0;
    let totalGasGallons = 0;
    let totalGasCost = 0;

    for (const vehicle of vehicles) {
        const odomStart = parseInt(vehicle.inspection_vehicle_odometer_start) || 0;
        const odomEnd = parseInt(vehicle.inspection_vehicle_odometer_end) || 0;
        totalOdometerStart += odomStart;
        totalOdometerEnd += odomEnd;
        totalGasGallons += parseInt(vehicle.inspection_vehicle_gas_gallons) || 0;
        totalGasCost += parseInt(vehicle.inspection_vehicle_gas_cost) || 0;

        const vehicleReservations = vehicle.vehicle_reservations || [];
        for (const r of vehicleReservations) {
            // Calculate dropoff time from pickup + hours
            const pickupTime = r.reservation_time || '';
            const hours = parseFloat(r.reservation_hour) || 0;
            let dropoffTime = '';
            if (pickupTime && hours) {
                const pickup = dayjs(`2000-01-01 ${pickupTime}`);
                dropoffTime = pickup.add(hours, 'hour').format('HH:mm:ss');
            }

            reservations.push({
                reservation_charter_order: r.reservation_charter_order || r.reservation_id,
                reservation_passenger_name: r.reservation_passenger_name || '',
                reservation_time: r.reservation_time || '',
                reservation_pickup_location: r.reservation_pickup_location || '',
                dropoff_time: dropoffTime,
                reservation_dropoff_location: r.reservation_dropoff_location || '',
                reservation_passengers: r.reservation_passengers || '',
                reservation_hour: r.reservation_hour || '',
                reservation_base: r.reservation_base || 0,
                reservation_fuel: r.reservation_fuel || 0,
                reservation_airport_fee: r.reservation_airport_fee || 0,
                reservation_m_and_g: r.reservation_m_and_g || 0,
                reservation_tips: r.reservation_tips || 0,
                reservation_tax: r.reservation_tax || 0,
                reservation_total: r.reservation_total || 0,
            });
        }
    }

    const totalMiles = totalOdometerEnd - totalOdometerStart;
    const grandTotal = reservations.reduce((sum, r) => sum + (r.reservation_total || 0), 0);
    const subTotal = grandTotal - totalGasCost;

    // Parse times
    const startTime = inspection.inspection_start_time || '';
    const endTime = inspection.inspection_end_time || '';

    const parseTime = (time: string) => {
        if (!time) return { time: '', ampm: '' };
        const parsed = dayjs(`2000-01-01 ${time}`);
        return {
            time: parsed.format('h:mm'),
            ampm: parsed.format('A')
        };
    };

    const startParsed = parseTime(startTime);
    const endParsed = parseTime(endTime);

    return {
        companyName: 'JMC Limousine LLC DBA JMC Transportation',
        cpcn: 'CPCN 2306',
        driverName: inspection.inspection_employee?.employee_full_name || '',
        vehicleNumber,
        date: inspection.inspection_date ? dayjs(inspection.inspection_date).format('M/D/YY') : '',
        empNumber: inspection.inspection_employee?.employee_id?.toString().padStart(2, '0') || '',
        startTime: startParsed.time,
        startTimeAmPm: startParsed.ampm,
        endTime: endParsed.time,
        endTimeAmPm: endParsed.ampm,
        reservations,
        breaks: breaks.map((b: any) => ({
            start: b.start || '',
            end: b.end || '',
            initial: b.initial || ''
        })),
        odometerStart: totalOdometerStart,
        odometerEnd: totalOdometerEnd,
        totalMiles: Math.max(0, totalMiles),
        gasGallons: totalGasGallons,
        gasCost: totalGasCost,
        subTotal,
        driverAtm: 0,
        totalToCo: subTotal,
    };
}