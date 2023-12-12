import { TextField } from "@mui/material"

const GTextField = (props: {
    onInput: (value: any) =>void;
    fullWidth: boolean;
}) => {
    const handleOnInput = (event: any) => {
        props.onInput(event.target.value);
    }
    return (
        <TextField {...props} onInput={handleOnInput}/>
    )
}



export default GTextField;