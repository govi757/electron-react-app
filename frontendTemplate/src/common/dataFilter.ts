import moment from "moment";

export default class DataFilter{
    static toNormalDate(value: any) {
        return moment(value).format("MMM Do YYYY, h:mm a")
    }
}