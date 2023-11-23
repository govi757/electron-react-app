import React, { useEffect, useRef, useState } from "react";
import Form, { FieldType, FormSchema } from "../component/form/Form";
import { Rules } from "../component/form/rules";
import { ApiType, DataTypes, IApi, IApiSection } from "../interfaces/IApi";
import { Button, Switch } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { normalDataTypes } from "../datas/constants";
export default function ApiForm({
  apiAdded,
  api,
}: {
  apiAdded?: any;
  api?: IApi;
}) {
  const [apiForm, setApiForm] = useState<IApi>({
    name: "",
    type: ApiType.Get,
    input: {},
    output: {},
    authenticated: false,
    isOutputArray: false
  });

  const [apiInputList, setApiInputList] = useState([
    { name: "", type: "", required: false },
  ]);
  const [apiOutputList, setApiOutputList] = useState([
    { name: "", type: "", required: false },
  ]);

  useEffect(() => {
    if (api) {
      setApiForm(api);
      const inputList = Object.keys(api.input).reduce((acc: any[], curr) => {
        acc.push({ name: curr, type: api.input[curr].type,required: api.input[curr].required || false });
        return acc;
      }, []);
      setApiInputList(inputList);

      const outputList = api.output
        ? Object.keys(api.output).reduce((acc: any[], curr) => {
            acc.push({ name: curr, type: api.output[curr].type,required: api.output[curr].required || false  });
            return acc;
          }, [])
        : [];
      setApiOutputList(outputList);

      getAllDataTypes()
    }
  }, []);

  const getAllDataTypes = () => {

  }

  const inputFormRefList = useRef<any[]>([]);

  const outputFormRefList = useRef<any[]>([]);

  const handleAddOutputForm = () => {
    setApiOutputList([
      ...apiOutputList,
      { name: "", type: "", required: false },
    ]);
  };

  const handleAddInputForm = () => {
    setApiInputList([
      ...apiInputList,
      { name: "", type: "", required: false },
    ]);
  };
  const handleApiFormSubmit = () => {
    let isValidInput = true;
    let isValidOutput = true;
    inputFormRefList.current.forEach((item) => {
      if (item) isValidInput = item.validateAndSetError();
    });

    outputFormRefList.current.forEach((item) => {
      if (item) isValidOutput = item.validateAndSetError();
    });


    if (isValidInput && isValidOutput) {
      apiForm.input = apiInputList.reduce((acc: any, currVal) => {
        acc[currVal.name] = {type: currVal.type, required: currVal.required};
        return acc;
      }, {});

      apiForm.output = apiOutputList.reduce((acc: any, currVal) => {
        acc[currVal.name] = {type: currVal.type, required: currVal.required};
        return acc;
      }, {});
      apiAdded(apiForm);
    }
    // inputFormRefList.current.forEach((item) => {
    //   const isValid = item.validateAndSetError();
    //   if (isValid) {
    //     apiForm.input = apiInputList.reduce((acc: any, currVal) => {
    //       acc[currVal.name] = currVal.type;
    //       return acc;
    //     }, {});
    //     apiAdded(apiForm);
    //   }
    // });
  };

  const changeApiInput = (value: any, index: number) => {
    apiInputList[index] = value;
    setApiInputList([...apiInputList]);
  };

  const changeApiOutput = (value: any, index: number) => {
    apiOutputList[index] = value;
    setApiOutputList([...apiOutputList]);
  };
  const handleInputDeleteClick = (index: number) => {
    apiInputList.splice(index, 1);
    setApiInputList([...apiInputList]);
  };

  const handleOutputDeleteClick = (index: number) => {
    apiOutputList.splice(index, 1);
    setApiOutputList([...apiOutputList]);
  };

  const handleIsOutputArraySwitch = (value: any) => {
    console.log(value.target.checked,"Value");
    apiForm.isOutputArray = value;
    setApiForm(apiForm);
  }

  return (
    <div>
      <Form
        formSchema={apiFormSchema}
        value={apiForm}
        onInput={(value) => setApiForm(value)}
      />
      Inputs
      <Button size="small" onClick={() => handleAddInputForm()}>
        Add
      </Button>
      {apiInputList.map((apiInput, index) => {
        return (
          <Form
            index={index}
            ref={(el: any) => (inputFormRefList.current[index] = el)}
            key={"form" + index}
            formSchema={apiInputFormScehma}
            value={apiInput}
            onInput={(value) => changeApiInput(value, index)}
            onbuttonClick={() => handleInputDeleteClick(index)}
          />
        );
      })}
      Outputs
      <Button size="small" onClick={() => handleAddOutputForm()}>
        Add
      </Button>
      <Switch value={apiForm.isOutputArray} onChange={value=> handleIsOutputArraySwitch(value)} ></Switch> Array
      {apiOutputList.map((apiOutput, index) => {
        return (
          <Form
            index={index}
            ref={(el: any) => (outputFormRefList.current[index] = el)}
            key={"form" + index}
            formSchema={apiInputFormScehma}
            value={apiOutput}
            onInput={(value) => changeApiOutput(value, index)}
            onbuttonClick={() => handleOutputDeleteClick(index)}
          />
        );
      })}
      <div className="col-12 my-4">
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleApiFormSubmit()}
        >
          Submit
        </Button>
        
      </div>
    </div>
  );
}

const apiFormSchema: FormSchema = {
  fieldList: [
    {
      dataSelectorKey: "name",
      label: "Api Name",
      type: FieldType.TextField,
      boundaryClass: "col-12",
      rules: [Rules.Required],
    },
    {
      dataSelectorKey: "type",
      label: "Api Type",
      type: FieldType.Select,
      boundaryClass: "col-12",
      rules: [Rules.Required],
      options: ["get", "post"],
    },

    {
      dataSelectorKey: "authenticated",
      label: "Authenticated",
      type: FieldType.CheckBox,
      boundaryClass: "col-12",
      rules: [],
    },
    
    //   {
    //     dataSelectorKey: "input",
    //     label: "Input",
    //     type: FieldType.ObjectTextArea,
    //     boundaryClass: "col-12",
    //     rules: [Rules.Required],
    //   },
    //   {
    //     dataSelectorKey: "output",
    //     label: "Output",
    //     type: FieldType.ObjectTextArea,
    //     boundaryClass: "col-12",
    //     rules: [Rules.Required],
    //   },
  ],
};

const apiInputFormScehma: FormSchema = {
  fieldList: [
    {
      dataSelectorKey: "name",
      label: "Name",
      rules: [Rules.Required],
      type: FieldType.TextField,
      boundaryClass: "col-3 me-1",
    },
    {
      dataSelectorKey: "type",
      label: "Type",
      rules: [Rules.Required],
      type: FieldType.Autocomplete,
      boundaryClass: "col-4 me-1",
      options: normalDataTypes,
    },
    {
      dataSelectorKey: "required",
      label: "",
      rules: [],
      type: FieldType.CheckBox,
      boundaryClass: "col-1 me-1",
    },
  ],
  actionList: [
    {
      actionKey: "delete",
      label: "del",
      component: DeleteIcon
    },
  ],
};
