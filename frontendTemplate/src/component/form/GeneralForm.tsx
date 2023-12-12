import { FormGroup } from "@mui/material";
import React, { useState } from "react";
import { FormSchema, GActionSchema } from "./FormSchema";
import { RuleValidation } from "./rules";

const GeneralForm = (
  {
    formSchema,
    value = {},
    onInput,
  }: {
    formSchema: FormSchema;
    value: any;
    onInput: (val: any) => void;
  },
  ref: any
) => {
  const handleInputChange = (event: any, dataSelectorKey: string) => {
    value[dataSelectorKey] = event;
    if (onInput) onInput({ ...value });
  };

  const [error, setError] = useState<any>({});

  const validateAndSetError = () => {
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
    const isValid = Object.keys(error).every((item) => error[item] === "");
    return isValid;
  };

  React.useImperativeHandle(ref, () => ({
    validateAndSetError,
  }));


  const handleOnclick = (action: GActionSchema) => {
    if(!action.validate) {
    action.onClick()
    } else {
        const isValid = validateAndSetError();
        if(isValid) {
            action.onClick();
        }
    }
  }

  return (
    <div>
      <FormGroup className="col-12">
        <div className="d-flex flex-wrap">
        {formSchema.fieldList.map((field, index) => {
          return (
            <field.component
            className={`${field.boundaryClass?field.boundaryClass: "col-12"} my-2`}
              key={field.name + index}
              label={field.name}
              {...field.props}
              value={value[field.dataSelectorKey]}
              onInput={(event: any) =>
                handleInputChange(event, field.dataSelectorKey)
              }
              error={
                error[field.dataSelectorKey] &&
                error[field.dataSelectorKey] !== ""
                  ? true
                  : false
              }
              helperText={error[field.dataSelectorKey]}
            />
          );
        })}
        <div className="d-flex">
          {formSchema.actionList.map((action, index) => {
            return (
              <action.component
              {...action.props}
                className={`${action.boundaryClass?action.boundaryClass: "col-12"} my-2`}
                key={action.name + index}
                onClick={() => handleOnclick(action)}
                
              >
                {action.name}
              </action.component>
            );
          })}
        </div>
        </div>
      </FormGroup>
    </div>
  );
};
export default React.forwardRef(GeneralForm);
