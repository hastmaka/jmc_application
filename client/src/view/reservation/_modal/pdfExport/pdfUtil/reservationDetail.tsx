import Space from "@/components/pdfUtilities/Space.tsx";
import FillTd from "@/components/pdfUtilities/FillTd.tsx";
import {Fragment} from "react";

export default function ReservationDetail(props: Record<string, any>) {
    const {
        pickupLocation,
        dropoffLocation,
        reservation_itinerary,
        flyInfo,
    } = props
    return (
        <>
            <tr>
                <td colSpan={10} style={{background: '#92d050'}}>Reservation Detail</td>
            </tr>
            <Space/>

            {/* ORIGINAL PICKUP */}
            <tr>
                <td colSpan={2}>Pickup Location</td>
                <td colSpan={3}>{pickupLocation}</td>
                {flyInfo && <td>{flyInfo}</td>}
                {FillTd(flyInfo ? 5 : 6)}
            </tr>

            {/* FINAL DROP OFF */}
            <tr>
                <td colSpan={2}>Dropoff Location</td>
                <td colSpan={3}>{dropoffLocation}</td>
                {FillTd(5)}
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
                                <td colSpan={2}>Pickup Location</td>
                                <td colSpan={3}>{pickup}</td>
                                {FillTd(4)}
                                <td></td>
                            </tr>
                            <tr>
                                <td colSpan={2}>Dropoff Location</td>
                                <td colSpan={3}>{dropoff}</td>
                                {FillTd(4)}
                                <td></td>
                            </tr>
                        </Fragment>
                    );
                });
            })()}
        </>
    );
}