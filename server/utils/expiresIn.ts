import moment, { DurationInputArg1, DurationInputArg2 } from "moment";

export const expiresIn = (amount: DurationInputArg1, unit: DurationInputArg2) => {
    return moment().add(amount, unit);
}

export const isExpired = (dateString: string) => {
    return moment(dateString).isBefore(moment());
}