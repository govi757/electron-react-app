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
  Drawer,
} from "@mui/material";
import Form, { FieldType, FormSchema } from "../component/form/Form";
import { Rules } from "../component/form/rules";
import { ICollection, IDataBase } from "../interfaces/ICollection";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { CollectionForm } from "./CollectionForm";
const electron: IPreLoad = ((window as any).electron as IPreLoad) || {};
export default function CollectionSetup() {
  const [dbConfigList, setDbConfigList] = useState<IDataBase[]>([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dbForm, setDbForm] = React.useState<IDataBase>({dbName:"", collectionList: []})
  const [formType, setFormType] = React.useState("");
  const [selectedDbIndex, setSelectedDbIndex] = useState(0);
  const [selectedCollectionForEdit, setSelectedCollectionForEdit] = useState<ICollection>();

  useEffect(() => {
    getDatabaseList();
  }, []);

  const getDatabaseList = async () => {
    const projectPath = (await GeneratorHelper.getProjectPath()) || "";
    electron.filesApi.readFile(projectPath, "dbConfig.json").then((res) => {
      setDbConfigList(JSON.parse(res));
    });
  };

  const deleteDataBase = (index: number) => {
    if(confirm("Are you sure want to delete?")) {
      dbConfigList.splice(index, 1);
      updateDatabaseFile([...dbConfigList])
    }
  };

  const updateDatabaseFile = async (dataBaseList: IDataBase[]) => {
    const projectPath = (await GeneratorHelper.getProjectPath()) || "";
    setTimeout(async () => {
      await GeneratorHelper.writeFile(
        projectPath,
        "dbConfig.json",
        JSON.stringify(dataBaseList)
      );
      setOpenDialog(false);
      setDbForm({dbName:"", collectionList:[]})
    }, 1000);
  };

  const handleAddCollectionClick = (index: number) => {
    setOpenDialog(true);
    setSelectedDbIndex(index);
    setFormType("add-collection");
  }

  const handleEditCollectionClick = async (dbIndex: number,col: ICollection) => {
    
    await setSelectedDbIndex(dbIndex);
    await setSelectedCollectionForEdit(col)
    await setFormType("edit-collection");
    await setOpenDialog(true);  
    
  }

  const handleAddCollectionData = async (collectionData: ICollection) => {
    const addedCollection = {...collectionData};
    addedCollection.fields = collectionData.fields;
    dbConfigList[selectedDbIndex].collectionList = [
      ...dbConfigList[selectedDbIndex].collectionList,
      addedCollection
    ];
    setDbConfigList(dbConfigList);
    updateDatabaseFile(dbConfigList)
  }

  const handleEditCollectionData = (collectionData: ICollection) => {
    const addedCollection = {...collectionData};
    const selectedCollectionIndexForEdit = dbConfigList[selectedDbIndex].collectionList.findIndex(item => item.name === selectedCollectionForEdit?.name);
    if(selectedCollectionIndexForEdit !== -1) {
    dbConfigList[selectedDbIndex].collectionList[selectedCollectionIndexForEdit] = addedCollection;
    setDbConfigList([...dbConfigList]);
    updateDatabaseFile(dbConfigList)
    }
  }

  const handleDeleteCollectionClick = (dbIndex: number, collectionIndex: number) => {
    if (confirm("Are you sure want to delete?!") == true) {
    dbConfigList[dbIndex].collectionList.splice(collectionIndex, 1);
    setDbConfigList([...dbConfigList]);
    updateDatabaseFile(dbConfigList);
    } 
  }

  const handleAddDb = () => {
    setOpenDialog(true)
    setFormType("add-db");
  }

  const addDataBase = () => {
    const nameIndex = dbConfigList.findIndex(item => item.dbName === dbForm.dbName);
    if(nameIndex == -1) {
    dbConfigList.push(dbForm);
    updateDatabaseFile([...dbConfigList])
    }
  }

  const handleEditDbNameClick = (index: number) => {
    setDbForm({...dbConfigList[index]});
    setFormType("edit-db");
    setOpenDialog(true)
    setSelectedDbIndex(index);
  }

  const editDataBase = () => {
    const nameIndex = dbConfigList.findIndex(item => item.dbName === dbForm.dbName);
    if(nameIndex == -1) {
    dbConfigList[selectedDbIndex] = dbForm;
    updateDatabaseFile([...dbConfigList])
    }

  }

  
  return (
    <div>
      <Drawer PaperProps={{style:{width:"60%"}}} open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Action</DialogTitle>
        <DialogContent>
          {
            formType=="add-collection"?
            <CollectionForm
            collectionAdded={(collectionData: any) => handleAddCollectionData(collectionData)}
            />: formType=="edit-collection" ?
            <CollectionForm
            collectionAdded={(collectionData: any) => handleEditCollectionData(collectionData)}
            collectionData={selectedCollectionForEdit}
            />:formType==="add-db"?<Form
            formSchema={dbFormSchema}
            value={dbForm}
            onInput={val => setDbForm(val)}
            onbuttonClick={() => addDataBase()}
            />:

            <Form
            formSchema={dbFormSchema}
            value={dbForm}
            onInput={val => setDbForm(val)}
            onbuttonClick={() => editDataBase()}
            />
          }
            
        </DialogContent>
        </Drawer>
        <Button size="small" onClick={() => handleAddDb()}>Add Database</Button>
      {dbConfigList.map((dbConfig, index) => {
        return (
          <div key={dbConfig.dbName}>
            <Accordion variant="outlined">
              <AccordionSummary>
                <div className="d-flex w-100">
                  <div className="flex-fill">{dbConfig.dbName}</div>
                  <Button size="small" onClick={() => handleEditDbNameClick(index)}>
                    <EditOutlined fontSize="small" />
                  </Button>
                  <Button size="small" onClick={() => deleteDataBase(index)}>
                    <DeleteOutline fontSize="small"/>
                  </Button>
                </div>
              </AccordionSummary>
              <AccordionDetails>
              <Button className="mb-1" onClick={() => handleAddCollectionClick(index)}>Add Collection</Button>
                <div className="row">
                {dbConfig.collectionList.map((collection, collectionIndex) => {
                  return (
                    <div className="col-4 d-flex my-2 px-2" key={collection.name+collectionIndex}>
                    <Card  variant="outlined"  className="mx-1 col">
                    <div className="flex-fill" key={collection.name}>
                      <div className="card-header px-2 py-2 d-flex">
                        <div className="flex-fill">
                      {collection.name}
                      </div>
                      
                      <EditOutlined color="primary" className="pointer" onClick={() => handleEditCollectionClick(index, collection)} fontSize="small"/>
                      <DeleteOutline className="pointer" onClick={() => handleDeleteCollectionClick(index, collectionIndex)} fontSize="small"/>
                      
                      </div>
                      {
                        collection.fields.map(field => {
                          return (<div key={field.name} className=" d-flex px-2">
                            <div className="flex-fill">{field.name}</div> {field.type}
                          </div>)
                        })
                      }
                    </div>
                    </Card>
                    </div>
                  );
                })}
                </div>
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

