import Whole from "@/view/reservation/_modal/pdfExport/pdfUtil/Whole.tsx";
import FillTd from "@/view/reservation/_modal/pdfExport/pdfUtil/FillTd.tsx";
import './_terms.css'

export default function TermsAndConditions() {
    return (
        <>
            <Whole>Please review your reservation(s) to ensure all the information is correct. Changes can be made by calling or texting 702-969-2763</Whole>

            <Whole>* Children less than 6 years of age who weigh less than 60 pounds must ride in an approved child restraint system (Child Seat).</Whole>
            <Whole fw> It is the responsibility of the parent/ guardian to provide and install in the vehicle.</Whole>

            <Whole>* Airport Arrivals: Charges begin fifteen (15) minutes after the airplane arrives at the gate. (NOT LANDING TIME).</Whole>
            <Whole fw>All inbound flights are tracked, and we will adjust the pickup time accordingly.</Whole>

            <Whole>* Cancellation/Changes: JMC Transportation has 48 hours prior to time of service Cancellation policy.</Whole>
            <Whole fw>Service requested must be cancelled by the booking party with a minimum of 14 days notice in order to receive a full refund.</Whole>
            <Whole fw>Cancellation with less than 14 days notice is not refundable.</Whole>

            <Whole>* Champagne/Alcohol - All Passengers must be 21+ years of age to receive/consume alcohol within the vehicle.</Whole>
            <Whole fw>All alcoholic drinks, if provided, will be complementary. JMC Transportation does not sell any alcoholic drinks.</Whole>

            <Whole>* JMC Transportation it's a small company. We have 4 vehicles.</Whole>

            <tr className="car">
                <td colSpan={4}>1. Mercedes Benz Sprinter Limousine Style</td>
                <td>2024</td>
                <td>Color Black</td>
                {FillTd(4)}
            </tr>
            <tr className="car">
                <td colSpan={4}>2. Mercedes Benz Sprinter Limousine Style</td>
                <td>2024</td>
                <td>Color Black</td>
                {FillTd(4)}
            </tr>
            <tr className="car">
                <td colSpan={4}>3. Mercedes Benz Sprinter Limousine Style</td>
                <td>2022</td>
                <td>Color Black</td>
                {FillTd(4)}
            </tr>
            <tr className="car">
                <td colSpan={4}>4. Ford E-450 Party Bus Limousine Style</td>
                <td>2010</td>
                <td>Color Black</td>
                <td colSpan={4} align='right'>NO VEHICLE IS GUARANTEED</td>
            </tr>
        </>
    );
}