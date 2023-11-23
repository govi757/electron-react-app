export const NormalCell = ({value,dataSelectorKey}: {value: any;dataSelectorKey: string})=> {
    return (
        <div>
            {value[dataSelectorKey]||"--"}
        </div>
    )
}