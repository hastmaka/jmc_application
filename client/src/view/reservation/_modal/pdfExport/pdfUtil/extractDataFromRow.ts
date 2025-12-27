import moment from "moment/moment";

export function extractDataFromRow(row: any) {
    const serviceType = row.reservation_service_type
    const serviceName = row.reservation_service_type_option.asset_option_name
    const createAt = moment.utc(row.created_at).local().format('MM/DD/YYYY')
    const chapterOrder = row.reservation_charter_order
    const costumerName = row.reservation_passenger_name
    const costumerPhone = row?.reservation_phone || null
    const serviceDate = moment(row.reservation_date).format('MM/DD/YYYY')
    const source = row?.reservation_source_option?.asset_option_name || null
    const pax = row?.reservation_passengers || null
    const veh = row?.reservation_car?.car_model || null
    const reservation_itinerary = row?.reservation_itinerary ? JSON.parse(row.reservation_itinerary) : []
    const pickupTime = moment(row.reservation_time, "HH:mm:ss").format("h:mm")
    const pickupTimeAmPm = moment(row.reservation_time, "HH:mm:ss").format("A")

    // these two are specials because they depend on if the reservation has extra itinerary
    let dropoffTime, dropoffTimeAmPm;

    if (Array.isArray(reservation_itinerary) && reservation_itinerary.length > 0) {
        const lastDropoffTime: Record<string, string> = reservation_itinerary[reservation_itinerary.length - 1]
        const key: string | undefined = Object.keys(lastDropoffTime).find(k => k.startsWith("reservation_time_"))
        dropoffTime = moment(lastDropoffTime[key!], "HH:mm:ss").format("h:mm")
        dropoffTimeAmPm = moment(lastDropoffTime[key!], "HH:mm:ss").format("A")
    } else {
        // if no itinerary that's means we only add hour to the pickup time because it's a simple service
        dropoffTime = moment(row.reservation_time, "HH:mm:ss").add(row.reservation_hour, 'hours').format("h:mm")
        dropoffTimeAmPm = moment(row.reservation_time, "HH:mm:ss").add(row.reservation_hour, 'hours').format("A")
    }

    // const sMap = {
    //     "Airport Arrival",27
    //     "Airport Return",28
    //     "Before you get there 1 Hour/Multiple Hours Service",29
    //     "Luxury Wedding Transportation",30
    //     "Lights and Sights",32
    //     "Las Vegas Bar Hopping",33
    //     "Bar Hopping"39

    //     "Downtown Special",31
    //     "Dinner Special",34
    //     "Concert Special",35
    //     "Allegiant Stadium Events Special",36
    //     "Bachelorette Party Special",37
    //     "Bachelor Party"38
    //

    const special = [31, 34, 35, 36, 37, 38]
    const isSpecial = special.includes(serviceType)

    // route description
    const pickupLocation = row.reservation_pickup_location
    const dropoffLocation = row.reservation_dropoff_location
    const flyInfo = `${row?.reservation_airline || ""} ${row?.reservation_fly_info || ""}`.trim() || null;
    const specialInstruction = row?.reservation_special_instructions || null

    // charge description
    const base = row.reservation_base / 100
    const hour = Number(row.reservation_hour)
    const fuel = row.reservation_fuel / 100
    const mg = row.reservation_m_and_g / 100
    const airportFee = row.reservation_airport_fee / 100
    const subTotal = hour * base + fuel * hour + mg + (airportFee || 0)
    const tax = subTotal * 0.03
    const tip = row.reservation_tips
    const tipCalc = base * hour * tip / 100
    const total = subTotal + tax + tipCalc
    const realValue = row?.reservation_real_value

    return {
        serviceType,
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
        subTotal,
        tax,
        tip,
        tipCalc,
        total,
        reservation_itinerary,
        flyInfo,
        specialInstruction,
        realValue,
        isSpecial,
    }
}