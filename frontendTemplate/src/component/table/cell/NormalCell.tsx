import { selectValue } from "src/common/dataSelector";

export const NormalCell = ({value,dataSelectorKey}: {value: any;dataSelectorKey: string})=> {
    return (
        <div>
            { selectValue(value,dataSelectorKey)||"--"}
        </div>
    )
}