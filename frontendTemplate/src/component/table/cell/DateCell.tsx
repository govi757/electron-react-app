import DataFilter from "src/common/dataFilter";
import { selectValue } from "src/common/dataSelector";

export const DateCell = ({value,dataSelectorKey}: {value: any;dataSelectorKey: string})=> {
    return (
        <div className="text-grey">
            { selectValue(value,dataSelectorKey)?DataFilter.toNormalDate(selectValue(value,dataSelectorKey)) :"--"}
        </div>
    )
}