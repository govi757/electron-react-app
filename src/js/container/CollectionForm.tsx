import React, { useEffect, useRef, useState } from "react";
import Form, { BtnType, FieldType, FormSchema } from "../component/form/Form";
import { Add, AddOutlined, DeleteOutline } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Rules } from "../component/form/rules";
import { Field, ICollection } from "../interfaces/ICollection";

export const CollectionForm = ({
  collectionAdded,
  collectionData,
}: {
  collectionAdded: any;
  collectionData?: ICollection;
}) => {
  const [collectionForm, setCollectionForm] = useState<ICollection>({
    fields: [],
    name: "",
  });
  const [fieldList, setFieldList] = useState<Field[]>([
    { name: "", type: "", required: false, index: false },
  ]);
  const collectionFormRefList = useRef<any[]>([]);

  const handleAddField = () => {
    setFieldList([
      ...fieldList,
      { name: "", type: "", required: false, index: false },
    ]);
  };
  useEffect(() => {
    if(collectionData) {
      setCollectionForm(collectionData);
      setFieldList([...collectionData.fields])
    }
  },[])

  const handleCollectionFormSubmit = () => {
    let isValidCollection = true;

    collectionFormRefList.current.forEach((item) => {
      if (item) isValidCollection = item.validateAndSetError();
    });

    if (isValidCollection) {
      collectionForm.fields = [...fieldList];
    }
    collectionAdded(collectionForm);
  };

  const changeField = (value: any, index: number) => {
    fieldList[index] = { ...value };
    setFieldList([...fieldList]);
  };

  return (
    <div>
      <Form
        formSchema={collectionFormSchema}
        value={collectionForm}
        onInput={(value) => setCollectionForm(value)}
      ></Form>

      <div className="row">
        <div className="col-4">
          <Button onClick={() => handleAddField()} size="small">
            Add Field
          </Button>
        </div>
        <div className="col-4"></div>
        <div className="col-1">Reqired</div>
        <div className="col-1">Index</div>
        {/* <div className="col-1">Action</div> */}
      </div>
      {fieldList.map((field, index) => {
        return (
          <Form
            index={index}
            ref={(el: any) => (collectionFormRefList.current[index] = el)}
            key={"form" + index}
            formSchema={collectionFieldFormSchema}
            value={field}
            onInput={(value) => changeField(value, index)}
          />
        );
      })}

      <div className="col-12 my-4">
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleCollectionFormSubmit()}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};
const collectionFormSchema: FormSchema = {
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
const collectionFieldFormSchema: FormSchema = {
  fieldList: [
    {
      dataSelectorKey: "name",
      label: "CollectionName",
      rules: [Rules.Required],
      type: FieldType.TextField,
      boundaryClass: "col-3 mx-1",
    },
    {
      dataSelectorKey: "type",
      label: "Type",
      rules: [Rules.Required],
      type: FieldType.Select,
      options: ["String", "Number", "Object", "Date","[String]"],
      boundaryClass: "col-4 mx-1",
    },
    {
      dataSelectorKey: "required",
      label: "Required",
      rules: [],
      type: FieldType.CheckBox,
      boundaryClass: "col-1 mx-1",
    },
    {
      dataSelectorKey: "index",
      label: "Index",
      rules: [],
      type: FieldType.CheckBox,
      boundaryClass: "col-1",
    },
    {
      dataSelectorKey: "unique",
      label: "Unique",
      rules: [],
      type: FieldType.CheckBox,
      boundaryClass: "col-1 mx-1",
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
