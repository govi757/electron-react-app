import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const GSelectField = (props: {
  value: any;
  onInput: (value: any) => void;
  fullWidth: boolean;
  options: any[];
  optionValue?: string;
  optionText?: string;
  name?: string;
  className?: string
}) => {
  const handleChange = (event: any) => {
    props.onInput(event.target.value);
  };
  
  return (
    <FormControl size="small" className={props.className} fullWidth={props.fullWidth||true} >
      <InputLabel id="demo-simple-select-label">{props.name}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={props.value}
        label="Age"
        onChange={handleChange}
      >
        {props.options?.map((option) => (
          <MenuItem
            key={props.optionValue ? option[props.optionValue] : option}
            value={props.optionValue ? option[props.optionValue] : option}
          >
            {props.optionText ? option[props.optionText] : option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GSelectField;
