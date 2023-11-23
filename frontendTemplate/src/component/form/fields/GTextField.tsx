import { TextField } from "@mui/material"

const GTextField = (props: {
    onInput: (value: any) =>void;
    fullWidth: boolean;
}) => {
    return (
        <TextField {...props} onInput={props.onInput}/>
    )
}



export default GTextField;