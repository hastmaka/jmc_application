import moment from "moment";

export function rangeDate(date: string) {
    const _date = moment(date, "YYYY-MM-DD");
    const start = _date.startOf("month").toDate();
    const end = _date.endOf("month").toDate();

    return [start, end];
}