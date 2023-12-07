export const BooleanCell = ({value,dataSelectorKey}: {value: any;dataSelectorKey: string})=> {
    return (
        <div>
            {value[dataSelectorKey]===true?'Yes':'No'||"--"}
        </div>
    )
}