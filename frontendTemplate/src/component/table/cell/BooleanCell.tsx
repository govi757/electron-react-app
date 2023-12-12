export const BooleanCell = ({value,dataSelectorKey}: {value: any;dataSelectorKey: string})=> {
    return (
        <div className={`${value[dataSelectorKey]===true?'text-success':'text-danger'}`}>
            {value[dataSelectorKey]===true?'Yes':'No'||"--"}
        </div>
    )
}