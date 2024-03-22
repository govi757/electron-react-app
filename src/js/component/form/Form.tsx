import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { RuleValidation, Rules } from "./rules";
export default React.forwardRef(function Form({
  formSchema,
  value = {},
  onInput,
  onbuttonClick,
  onFocus,
  index,
}: {
  formSchema: FormSchema;
  value?: any;
  onInput?: (text: any) => void;
  onbuttonClick?: (text: any) => void;
  onFocus?: (field: any, index:number) => void
  index?: number
},ref: any) {
  const [error, setError] = useState<any>({});

  const handleInputChange = (event: any, dataSelectorKey: string) => {
    value[dataSelectorKey] = event.target.value;
    console.log(event,"event")
    if (onInput) onInput({ ...value });
  };

  const handleAutoCompleteChange = (event: any, dataSelectorKey: string) => {
    console.log(event);
    value[dataSelectorKey] = event;
    if (onInput) onInput({ ...value });
  };


  const handleCheckboxChange = (event: any, dataSelectorKey: string) => {
    value[dataSelectorKey] = event.target.checked;
    if (onInput) onInput({ ...value });
  };


  const handleObjectInputChange = (event: any, dataSelectorKey: string) => {
    value[dataSelectorKey] = event.target.value;
    if (onInput) onInput({ ...value });
  };

  const handleButtonClick = (action: ActionSchema) => {
    if (onbuttonClick) {
      if (action.validate === true) {
        formSchema.fieldList.forEach((field) => {
          const ruleValidation = new RuleValidation();
          const errorMsg = ruleValidation.validateValueWithRule(
            value,
            field.dataSelectorKey,
            field.rules
          );
          error[field.dataSelectorKey] = errorMsg;
          setError({ ...error });
        });

        const isValid = Object.keys(error).every((item) => error[item] == "");
        if (isValid) {
          onbuttonClick(action.actionKey);
        }
      } else {
        onbuttonClick(action.actionKey);
      }
    }
  };

  const validateAndSetError= () => {
    formSchema.fieldList.forEach((field) => {
      const ruleValidation = new RuleValidation();
      const errorMsg = ruleValidation.validateValueWithRule(
        value,
        field.dataSelectorKey,
        field.rules
      );
      error[field.dataSelectorKey] = errorMsg;
      setError({ ...error });
    });
    const isValid = Object.keys(error).every((item) => error[item] == "");
    return isValid;
  }

  React.useImperativeHandle(ref, () => ({
    validateAndSetError,
  }));

  return (
    <>
      <form ref={ref} className=" d-flex flex-wrap">
        
        {formSchema.fieldList.map((field, index) => {
          switch (field.type) {
            case FieldType.TextField:
              return (
                
                <TextField
                  InputProps={{
                    readOnly: field.readOnly,
                  }}
                  onFocus={() => onFocus?onFocus(field,index):null}
                  key={field.dataSelectorKey}
                  value={value[field.dataSelectorKey]}
                  onInput={(event) =>
                    handleInputChange(event, field.dataSelectorKey)
                  }
                  label={field.label}
                  size="small"
                  className={`my-2 ${field.boundaryClass || "col-4"}`}
                  error={
                    error[field.dataSelectorKey] &&
                    error[field.dataSelectorKey] !== ""
                      ? true
                      : false
                  }
                  helperText={error[field.dataSelectorKey]}
                />
                
              );

            case FieldType.TextArea:
              return (
                
                <TextField
                fullWidth
                  multiline={true}
                  minRows={3}
                  InputProps={{
                    readOnly: field.readOnly,
                  }}
                  key={field.dataSelectorKey}
                  value={value[field.dataSelectorKey]}
                  onInput={(event) =>
                    handleInputChange(event, field.dataSelectorKey)
                  }
                  label={field.label}
                  size="small"
                  className={`my-2 ${field.boundaryClass || "col-4"}`}
                  error={
                    error[field.dataSelectorKey] &&
                    error[field.dataSelectorKey] !== ""
                      ? true
                      : false
                  }
                  helperText={error[field.dataSelectorKey]}
                />
                
              );

              case FieldType.ObjectTextArea:
              return (
                
                <TextField
                fullWidth
                  multiline={true}
                  minRows={3}
                  InputProps={{
                    readOnly: field.readOnly,
                  }}
                  key={field.dataSelectorKey}
                  value={JSON.stringify(value[field.dataSelectorKey])}
                  onInput={(event) =>
                    handleObjectInputChange(event, field.dataSelectorKey)
                  }
                  label={field.label}
                  size="small"
                  className={`my-2 ${field.boundaryClass || "col-4"}`}
                  error={
                    error[field.dataSelectorKey] &&
                    error[field.dataSelectorKey] !== ""
                      ? true
                      : false
                  }
                  helperText={error[field.dataSelectorKey]}
                />
                

              );

            case FieldType.Select:
              return (
                
                <FormControl className={`my-2 ${field.boundaryClass || "col-4"}`} key={field.dataSelectorKey}>
                  <InputLabel size="small" id="demo-simple-select-label">{field.label}</InputLabel>
                  <Select
                    size="small"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value[field.dataSelectorKey]}
                    label={field.label}
                    onChange={(event) =>
                      handleInputChange(event, field.dataSelectorKey)
                    }
                  >
                    {
                      (field.options || []).map(option => {
                        return <MenuItem key={field.optionValue?option[field.optionValue]:option} value={field.optionValue?option[field.optionValue]:option}>
                          {field.optionText? option[field.optionText]: option}
                          </MenuItem>
                      })
                      
                    }
                  </Select>
                </FormControl>
                
              );

              case FieldType.CheckBox:
                return(
                  <div key={field.dataSelectorKey} className={`my-2 ${field.boundaryClass || "col-4"}`}>
                  <Checkbox
                  className={"mx-1"}
                  checked={value[field.dataSelectorKey]}
                  onChange={(event) =>
                    handleCheckboxChange(event, field.dataSelectorKey)
                  }
                  key={field.dataSelectorKey}
                  />
                  {field.label}
                  </div>
                )

              case FieldType.Autocomplete: 
              return(
                <div className={`my-2 ${field.boundaryClass || "col-4"}`} key={field.dataSelectorKey}>
                <Autocomplete
                  size="small"
                  autoComplete
                  includeInputInList
                  id="auto-complete"
                  fullWidth
                  options={field.options || []}
                  value={value[field.dataSelectorKey]}
                  onChange={(event, val)  =>
                    handleAutoCompleteChange(val, field.dataSelectorKey)
                  }
                  renderInput={(params) => <TextField
                    {...params} label={field.label} />}
                  />
                  </div>
              )  
            default:
              return (
                <TextField
                  InputProps={{
                    readOnly: field.readOnly,
                  }}
                  key={field.dataSelectorKey}
                  value={value[field.dataSelectorKey]}
                  onInput={(event) =>
                    handleInputChange(event, field.dataSelectorKey)
                  }
                  label={field.label}
                  size="small"
                  className={`my-2 ${field.boundaryClass || "col-4"}`}
                  error={
                    error[field.dataSelectorKey] &&
                    error[field.dataSelectorKey] !== ""
                      ? true
                      : false
                  }
                  helperText={error[field.dataSelectorKey]}
                />
              );
          }
        })}
        {/* <div className="col-12"> */}
          {formSchema.actionList?.map((action) => {
            return (
              <Button
                key={action.actionKey}
                onClick={() => handleButtonClick(action)}
                variant={action.btnType || "outlined"}
                size="small"
                className={`my-3 mx-1 ${action.boundaryClass}`}
              >
                {
                  action.component?
                  <action.component />
                  :action.label
                }
              </Button>
            );
          })}
        {/* </div> */}
      </form>
    </>
  );
}
)

export interface FormSchema {
  fieldList: FieldSchema[];
  actionList?: ActionSchema[];
}

export interface ActionSchema {
  label: string;
  btnType?: BtnType;
  color?: BtnColor;
  actionKey: string;
  validate?: boolean;
  boundaryClass?: string;
  component?: any
}

export interface FieldSchema {
  label: string;
  dataSelectorKey: string;
  type: FieldType;
  readOnly?: boolean;
  boundaryClass?: string;
  rules: Rules[];
  options?: any[];
  optionText?: string;
  optionValue?: string;
}

export enum FieldType {
  TextField = "TextField",
  TextArea = "TextArea",
  Select = "Select",
  ObjectTextArea="ObjectTextArea",
  CheckBox="CheckBox",
  Autocomplete="Autocomplete"
}

export enum BtnType {
  TEXT = "text",
  OUTLINED = "outlined",
  FILLED = "contained",
}

export enum BtnColor {
  PRIMARY = "primary",
  SECONADRY = "secondary",
}
