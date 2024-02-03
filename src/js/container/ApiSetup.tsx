import React, { useEffect, useState } from "react";
import { ApiType, IApi, IApiSection } from "../interfaces/IApi";
import GeneratorHelper from "../helper/GeneratorHelper";
import IPreLoad from "../interfaces/IPreLoad";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Drawer,
  TextField,
  Toolbar,
} from "@mui/material";
import Form, { FieldType, FormSchema } from "../component/form/Form";
import { Rules } from "../component/form/rules";
import ApiForm from "./ApiForm";
import axios from "axios";
import { AddCircleOutline, DeleteOutline, EditOutlined } from "@mui/icons-material";
const electron: IPreLoad = ((window as any).electron as IPreLoad) || {};
export default function ApiSetup() {
  const [apiSectionList, setApiSectionList] = useState<IApiSection[]>([]);

  const [sectionForm, setSectionForm] = React.useState<IApiSection>({
    name: "",
    apiList: [],
  });

  const [selectedApiSection, setSelectedApiSection] = React.useState<any>();
  const [selectedApiSectionIndex, setSelectedApiSectionIndex] =
    React.useState<any>(0);
  const [selectedApiForEdit, setSelectedApiForEdit] = React.useState<any>();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [formType, setFormType] = React.useState("");
  const [authHeaderForm, setAuthHeaderform] = React.useState({authHeader: ""});

  useEffect(() => {
    try {
    getApiList();
    } catch(e) {
      
    }
    setAuthHeaderFromLocal();
    axios.interceptors.request.use(function (config: any) {
      const token = authHeaderForm.authHeader;
      config.headers['Authorization'] =  token;
       
      return config;
  });
  }, []);

  const setAuthHeaderFromLocal = async () => {
    authHeaderForm.authHeader = await localStorage.getItem("authHeader") || ""; 
    setAuthHeaderform(authHeaderForm);
  }

  const getApiList = async () => {
    try {
    const projectPath = (await GeneratorHelper.getProjectPath()) || "";
    electron.filesApi.readFile(projectPath, "apiConfig.json").then((res) => {
      setApiSectionList(JSON.parse(res));
    });
  } catch(e) {

  }
  };

  const handleOpenAddSection = () => {
    setOpenDialog(true);
    setFormType("section");
  };

  const handleOpenAddAuthHeader = () => {
    setOpenDialog(true);
    setFormType("auth-header");
  }
  const handleOpenAddApi = (apiSection: IApiSection) => {
    setOpenDialog(true);
    setSelectedApiSection(apiSection);
    setFormType("api");
  };

  const handleOpenEditApi = (apiSection: IApiSection, api: IApi) => {
    setOpenDialog(true);
    setSelectedApiSection(apiSection);
    setSelectedApiForEdit(api);
    setFormType("edit-api");
  };

  const handleDeleteApi = (apiSection: IApiSection, api: IApi) => {
    if (confirm("Are you sure want to delete?!") == true) {
      const index = apiSectionList.findIndex(
        (item) => item.name === apiSection.name
      );
      if (index !== -1) {
        const apiIndex = apiSectionList[index].apiList.findIndex(
          (apiItem) => apiItem.name === api.name
        );
        if (apiIndex !== -1) {
          apiSectionList[index].apiList.splice(apiIndex, 1);
        }
      }
      setApiSectionList([...apiSectionList]);
      updateApiSectionFile(apiSectionList);
    } else {
    }
  };

  const handleSectionButtonClick = async (type: any) => {
    const index = apiSectionList.findIndex(
      (apiSection) => apiSection.name === sectionForm.name
    );
    if (index == -1) {
      const newSectionList = [...apiSectionList, sectionForm];
      setApiSectionList(newSectionList);
      updateApiSectionFile(newSectionList);
    } else {
    }
  };

  const handleEditSectionButtonClick = async (type: any) => {
    const newSectionList = [...apiSectionList];
    newSectionList[selectedApiSectionIndex].name = sectionForm.name;
    setApiSectionList(newSectionList);
    updateApiSectionFile(newSectionList);
  };

  const handleApiButtonClick = async (addedApiForm: any) => {
    const index = apiSectionList.findIndex(
      (item) => item.name === selectedApiSection?.name
    );
    if (index !== -1) {
      const parsedApiForm = { ...addedApiForm };
      apiSectionList[index].apiList = [
        ...apiSectionList[index].apiList,
        parsedApiForm,
      ];
      setApiSectionList([...apiSectionList]);
      updateApiSectionFile(apiSectionList);
    }
  };

  const handleEditApi = async (addedApiForm: any) => {
    const index = apiSectionList.findIndex(
      (item) => item.name === selectedApiSection?.name
    );
    if (index !== -1) {
      const apiIndex = apiSectionList[index].apiList.findIndex(
        (item) => item.name === selectedApiForEdit.name
      );
      if (apiIndex !== -1) {
        const parsedApiForm = { ...addedApiForm };
        apiSectionList[index].apiList[apiIndex] = parsedApiForm;
      }
      setApiSectionList([...apiSectionList]);
      updateApiSectionFile(apiSectionList);
    }
  };

  const updateApiSectionFile = async (sectionList: IApiSection[]) => {
    const projectPath = (await GeneratorHelper.getProjectPath()) || "";
    setTimeout(async () => {
      const apiSectionList = [...sectionList].map((section) => {
        section.apiList.map((api) => {
          api.testData = undefined;
          api.testResponse = undefined;
          return api;
        });
        return section;
      });
      await GeneratorHelper.writeFile(
        projectPath,
        "apiConfig.json",
        JSON.stringify(apiSectionList)
      );
      setOpenDialog(false);
      setSectionForm({ name: "", apiList: [] });
    }, 1000);
  };

  const deleteApisSection = (index: number) => {
    if (confirm("Are you sure want to delete?!") == true) {
    const sectionList = [...apiSectionList];
    sectionList.splice(index, 1);
    setApiSectionList(sectionList);
    updateApiSectionFile(sectionList);
    } else {

    }
  };

  const editApisSection = (index: number) => {
    setSelectedApiSectionIndex(index);
    setFormType("edit-section");
    setSectionForm({name: apiSectionList[index].name,apiList: apiSectionList[index].apiList});
    setOpenDialog(true);
  };

  const handleAddInputTestData = (
    event: any,
    apiSection: IApiSection,
    key: string
  ) => {
    const selectedSection = apiSectionList.find((section) => {
      return section.name === apiSection.name;
    });
    selectedSection?.apiList.map((item) => {
      const data = item.testData || {};
      data[key] = event.target.value;
      item.testData = data;
      return item;
    });
    setApiSectionList([...apiSectionList]);
  };

  const handleTestApi = async (api: IApi, apiSection: IApiSection) => {
    const url = `http://localhost:8000/api/${getApiName(
      apiSection.name
    )}/${getApiName(api.name)}`;
    const selectedSection = [...apiSectionList].find((section) => {
      return section.name === apiSection.name;
    });
    let testRes = api.testResponse || { status: 100, body: {} };
    if (api.type === ApiType.Post) {
      await axios
        .post(url, api.testData)
        .then((res) => {
          testRes.status = res.status;
          testRes.body = res.data;
        })
        .catch((err) => {
          testRes.status = err.response.status || 500;
          testRes.body = err.response.data || {};
        });
    } else {
      const getUrl = `${url}${!!api.testData?Object.keys(api.testData).reduce((acc, cur) => {
        acc = acc +   `?${cur}=${api.testData[cur]}`
        return acc
      },''):''}`
      await axios
        .get(getUrl)
        .then((res) => {
          testRes.status = res.status;
          testRes.body = res.data;
        })
        .catch((err) => {
          testRes.status = err.response.status || 500;
          testRes.body = err.response.data || {};
        });
    }
    selectedSection?.apiList.map((item) => {
      if (item.name === api.name) {
        item.testResponse = testRes;
      }
      return item;
    });

    setApiSectionList([...apiSectionList]);
  };

  const getApiName = (apiName: string) => {
    return apiName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  };

  const setAuthHeader = () => {
    localStorage.setItem("authHeader",authHeaderForm.authHeader)
  }

  return (
    <div>
      <Drawer  open={openDialog} PaperProps={{style:{width:"50%"}}} onClose={() => {setOpenDialog(false)}}>
        <DialogTitle>Action</DialogTitle>
        <DialogContent>
          {formType == "section" ? (
            <Form
              formSchema={sectionFormSchema}
              value={sectionForm}
              onInput={(text) => setSectionForm(text)}
              onbuttonClick={(type) => handleSectionButtonClick(type)}
            />
          ) : formType == "edit-section" ? (
            <Form
              formSchema={sectionFormSchema}
              value={sectionForm}
              onInput={(text) => setSectionForm(text)}
              onbuttonClick={(type) => handleEditSectionButtonClick(type)}
            />
          ) : formType == "api" ? (
            <ApiForm
              apiAdded={(apiForm: IApi) => {
                handleApiButtonClick(apiForm);
              }}
            />
          ) : formType == "edit-api" ? (
            <ApiForm
              apiAdded={(apiForm: IApi) => {
                handleEditApi(apiForm);
              }}
              api={selectedApiForEdit}
            />
          ) :formType == "auth-header" ?
          <Form
          formSchema={authHeaderFormSchema}
          value={authHeaderForm}
          onInput={val => setAuthHeaderform(val)}
          onbuttonClick={()=>setAuthHeader()}

          />
          : null}
        </DialogContent>
      </Drawer>
      <div className="d-flex align-items-center mx-2 pl-2 my-1 text-primary">
        <span className="flex-fill">
        Sections: 
        </span>
        <Button
        className="mx-3"
          size="small"
          variant="text"
          
          onClick={() => handleOpenAddSection()}
        >
          
          <AddCircleOutline htmlColor="primary" />
        </Button>

        <Button
        className="mx-3"
          size="small"
          variant="text"
          onClick={() => handleOpenAddAuthHeader()}
        >
          Add Auth Header
        </Button>
      </div>
      {apiSectionList.map((apiSection, index) => {
        return (
          <div key={apiSection.name}>
            <Accordion variant="outlined">
              <AccordionSummary>
                <div className="d-flex w-100">
                  <div className="flex-fill">{apiSection.name}</div>
                  <Button size="small" onClick={() => editApisSection(index)}>
                    <EditOutlined fontSize="small"/>
                  </Button>
                  <Button size="small"  onClick={() => deleteApisSection(index)}>
                    <DeleteOutline fontSize="small"/>
                  </Button>
                </div>
              </AccordionSummary>
              <AccordionDetails className="mx-2">
                <div className="d-flex">
                <span className="flex-fill">
                Apis
                </span>
                
                <Button
                  className="mx-1 my-1"
                  variant="text"
                  size="small"
                  onClick={() => handleOpenAddApi(apiSection)}
                >
                  <AddCircleOutline htmlColor="primary" />
                </Button>
                </div>
                {apiSection.apiList.map((api) => {
                  return (
                    <Accordion key={api.name + apiSection.name}>
                      <AccordionSummary>
                        <div className="d-flex w-100">
                          <div className="flex-fill">
                            {api.name}
                            {/* {JSON.stringify(api.input)} */}
                          </div>
                          <Chip variant="outlined"  size="small" style={{fontSize:"12px", borderRadius:"5px"}}  label={api.type} />
                          <Button
                            size="small"
                            onClick={() => handleOpenEditApi(apiSection, api)}
                          >
                            <EditOutlined fontSize="small" />
                          </Button>
                          <Button
                            size="small"
                            onClick={() => handleDeleteApi(apiSection, api)}
                          >
                            <DeleteOutline />
                          </Button>
                        </div>
                      </AccordionSummary>
                      <AccordionDetails>
                        <table style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <th>Parameter</th>
                              <th>Value</th>
                              <th align="center" className="col-3 text-center">
                                Type
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(api.input).map((key) => {
                              return (
                                <tr key={key}>
                                  <td>{key}</td>
                                  <td>
                                    <TextField
                                      size="small"
                                      fullWidth
                                      className="my-2"
                                      label={`${key}`}
                                      onChange={(event) =>
                                        handleAddInputTestData(
                                          event,
                                          apiSection,
                                          key
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="col-3" align="center">
                                    {api.input[key].type}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <Button
                          onClick={() => handleTestApi(api, apiSection)}
                          size="small"
                          variant="outlined"
                        >
                          Test api
                        </Button>
                        {api.testResponse && (
                          <Toolbar>
                            status: {api.testResponse?.status}
                            body: {JSON.stringify(api.testResponse?.body)}
                          </Toolbar>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          </div>
        );
      })}
    </div>
  );
}

const sectionFormSchema: FormSchema = {
  fieldList: [
    {
      dataSelectorKey: "name",
      label: "Section Name",
      type: FieldType.TextField,
      boundaryClass: "col-12",
      rules: [Rules.Required],
    },
  ],
  actionList: [
    {
      actionKey: "submit",
      label: "Add Section",
      validate: true,
    },
  ],
};

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
      dataSelectorKey: "input",
      label: "Input",
      type: FieldType.ObjectTextArea,
      boundaryClass: "col-12",
      rules: [Rules.Required],
    },
    {
      dataSelectorKey: "output",
      label: "Output",
      type: FieldType.ObjectTextArea,
      boundaryClass: "col-12",
      rules: [Rules.Required],
    },
  ],
  actionList: [
    {
      actionKey: "submit",
      label: "Add Api",
      validate: true,
    },
  ],
};

const authHeaderFormSchema: FormSchema = {
  fieldList: [
    {
      dataSelectorKey: "authHeader",
      label: "Auth header",
      type: FieldType.TextField,
      boundaryClass: "col-12",
      rules: [Rules.Required],
    },
    
  ],
  actionList: [
    {
      actionKey: "submit",
      label: "Add Authheader",
      validate: true,
    },
  ],
};
