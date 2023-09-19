import React, { useEffect, useState } from "react";

import GeneratorHelper from "../helper/GeneratorHelper";
import IPreLoad from "../interfaces/IPreLoad";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Form, { FieldType, FormSchema } from "../component/form/Form";
import { Rules } from "../component/form/rules";
import { ICollection, IDataBase } from "../interfaces/ICollection";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { CollectionForm } from "./CollectionForm";
import { IData } from "../interfaces/IData";
import { DataTypeForm } from "./DataTypeForm";
const electron: IPreLoad = ((window as any).electron as IPreLoad) || {};
export default function DataSetup() {
  const [dataTypeList, setDataTypeList] = useState<IData[]>([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dataForm, setDataTypeForm] = React.useState<IData>({name:"", fields: []});
  const [formType, setFormType] = React.useState("");
  const [selectedDataIndex, setSelectedDataIndex] = useState(0);

  useEffect(() => {
    getDataTypeList();
  }, []);

  const getDataTypeList = async () => {
    const projectPath = (await GeneratorHelper.getProjectPath()) || "";
    electron.filesApi.readFile(projectPath, "dataConfig.json").then((res) => {
      setDataTypeList(JSON.parse(res));
    });
  };

  const deleteDataBase = (index: number) => {
    if(confirm("Are you sure want to delete?")) {
      dataTypeList.splice(index, 1);
      updateDataTypeFile([...dataTypeList])
    }
  };

  const updateDataTypeFile = async (dataTypeList: IData[]) => {
    const projectPath = (await GeneratorHelper.getProjectPath()) || "";
    setTimeout(async () => {
      await GeneratorHelper.writeFile(
        projectPath,
        "dataConfig.json",
        JSON.stringify(dataTypeList)
      );
      setOpenDialog(false);
      setDataTypeForm({name:"", fields:[]})
    }, 1000);
  };

  const handleAddDataType = () => {
    setOpenDialog(true)
    setFormType("add-datatype");
  }

  const addDataType = () => {
    const nameIndex = dataTypeList.findIndex(item => item.name === dataForm.name);
    if(nameIndex == -1) {
    dataTypeList.push(dataForm);
    updateDataTypeFile([...dataTypeList])
    }
  }

  const handleEditDataTypeClick = (index: number) => {
    setDataTypeForm({...dataTypeList[index]});
    setFormType("edit-datatype");
    setOpenDialog(true)
    setSelectedDataIndex(index);
  }


  const handleAddDataTypeData = async (dataType: IData) => {
    const addedDataType = {...dataType};
    addedDataType.fields = dataType.fields;
    const newDataTypeList = [...dataTypeList, addedDataType];
    await setDataTypeList(newDataTypeList);
    updateDataTypeFile(newDataTypeList)
  }

  const handleEditCollectionData = (dataType: IData) => {
    const addedDataType = {...dataType};
    
    if(selectedDataIndex !== -1) {
    dataTypeList[selectedDataIndex] = dataType;
    setDataTypeList([...dataTypeList]);
    updateDataTypeFile(dataTypeList)
    }
  }
  
  return (
    <div>
      <Dialog fullWidth maxWidth={"md"} open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Action</DialogTitle>
        <DialogContent>
          {
            formType=="add-datatype"?
            <DataTypeForm
            dataTypeAdded={(dataType: any) => handleAddDataTypeData(dataType)}
            />: <DataTypeForm
            dataTypeAdded={(collectionData: any) => handleEditCollectionData(collectionData)}
            dataTypeData={dataTypeList[selectedDataIndex]}
            />
          }
            
        </DialogContent>
        </Dialog>
        <Button size="small" onClick={() => handleAddDataType()}>Add DataType</Button>
      {dataTypeList.map((dataType, index) => {
        return (
          <div key={"DataType"+dataType.name}>
            <Accordion variant="outlined">
              <AccordionSummary>
                <div className="d-flex w-100">
                  <div className="flex-fill">{dataType.name}</div>
                  <Button size="small" onClick={() => handleEditDataTypeClick(index)}>
                    <EditOutlined fontSize="small"/>
                  </Button>
                  <Button size="small" onClick={() => deleteDataBase(index)}>
                    <DeleteOutline fontSize="small"/>
                  </Button>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <Card>
                    {dataType.fields.map(field => {
                        return (
                            <div key={`dataTypeField${field.name}`}>
                            {field.name}: {field.type}
                            </div>
                        )
                    })}
                </Card>
              </AccordionDetails>
            </Accordion>
          </div>
        );
      })}
    </div>
  );
}

const dbFormSchema: FormSchema = {
  fieldList: [
    {
      dataSelectorKey: "dbName",
      label: "Database Name",
      type: FieldType.TextField,
      boundaryClass: "col-12",
      rules: [Rules.Required],
    },
  ],
  actionList: [
    {
      actionKey: "submit",
      label: "Submit",
      validate: true,
    },
  ],
};

