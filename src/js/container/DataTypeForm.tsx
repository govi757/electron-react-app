import React, { useEffect, useRef, useState } from "react";
import Form, { BtnType, FieldType, FormSchema } from "../component/form/Form";
import { Add, AddOutlined, DeleteOutline } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Rules } from "../component/form/rules";
import { Field,IData } from "../interfaces/IData";

export const DataTypeForm = ({
  dataTypeAdded,
  dataTypeData,
}: {
  dataTypeAdded: any;
  dataTypeData?: IData;
}) => {
  const [dataTypeForm, setDataTypeForm] = useState<IData>({
    fields: [],
    name: "",
  });
  const [fieldList, setFieldList] = useState<Field[]>([
    { name: "", type: "", required: false },
  ]);
  const dataTypeFormRefList = useRef<any[]>([]);

  const handleAddField = () => {
    setFieldList([
      ...fieldList,
      { name: "", type: "", required: false, },
    ]);
  };
  useEffect(() => {
    if(dataTypeData) {
      setDataTypeForm(dataTypeData);
      setFieldList([...dataTypeData.fields])
    }
  },[])

  const handleDataTypeFormSubmit = () => {
    let isValidDataType = true;

    dataTypeFormRefList.current.forEach((item) => {
      if (item) isValidDataType = item.validateAndSetError();
    });

    if (isValidDataType) {
      dataTypeForm.fields = [...fieldList];
    }
    dataTypeAdded(dataTypeForm);
  };

  const changeField = (value: any, index: number) => {
    fieldList[index] = { ...value };
    setFieldList([...fieldList]);
  };

  return (
    <div>
      <Form
        formSchema={dataTypeFormSchema}
        value={dataTypeForm}
        onInput={(value) => setDataTypeForm(value)}
      ></Form>

      <div className="row">
        <div className="col-4">
          <Button onClick={() => handleAddField()} size="small">
            Add Field
          </Button>
        </div>
        {/* <div className="col-4"></div>
        <div className="col-1">Reqired</div>
        <div className="col-1">Index</div> */}
        {/* <div className="col-1">Action</div> */}
      </div>
      {fieldList.map((field, index) => {
        return (
          <Form
            index={index}
            ref={(el: any) => (dataTypeFormRefList.current[index] = el)}
            key={"form" + index}
            formSchema={dataTypeFieldFormSchema}
            value={field}
            onInput={(value) => changeField(value, index)}
          />
        );
      })}

      <div className="col-12 my-4">
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleDataTypeFormSubmit()}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};
const dataTypeFormSchema: FormSchema = {
  fieldList: [
    {
      dataSelectorKey: "name",
      label: "Name",
      rules: [Rules.Required],
      type: FieldType.TextField,
      boundaryClass: "col-12",
    },
  ],
};
const dataTypeFieldFormSchema: FormSchema = {
  fieldList: [
    {
      dataSelectorKey: "name",
      label: "fieldName",
      rules: [Rules.Required],
      type: FieldType.TextField,
      boundaryClass: "col-3 mx-1",
    },
    {
      dataSelectorKey: "type",
      label: "Type",
      rules: [Rules.Required],
      type: FieldType.Select,
      options: ["string", "number", "object",'boolean', "date","any","string[]","object[]","any[]",],
      boundaryClass: "col-4 mx-1",
    },
    {
      dataSelectorKey: "required",
      label: "Required",
      rules: [],
      type: FieldType.CheckBox,
      boundaryClass: "col-3 mx-1",
    },
  ],
  actionList: [
    {
      actionKey: "add",
      label: "add",
      component: DeleteOutline,
    },
  ],
};
