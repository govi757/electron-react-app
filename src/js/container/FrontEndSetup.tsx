import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Form, { FieldType, FormSchema } from "../component/form/Form";
import { Rules } from "../component/form/rules";
import GeneratorHelper from "../helper/GeneratorHelper";
import IPreLoad from "../interfaces/IPreLoad";
import { IElement, IFrontEnd, ILayout } from "../interfaces/IGeneral";
import { Add, Delete, Edit } from "@mui/icons-material";
const electron: IPreLoad = ((window as any).electron as IPreLoad) || {};
export default function FrontEndSetup() {

  const [addScreenRouteFormSchema, setAddScreenRouteFormSchema] = useState<FormSchema>({
    fieldList: [
      {
        dataSelectorKey: "name",
        label: "Name",
        rules: [Rules.Required],
        type: FieldType.TextField,
      },
      {
        dataSelectorKey: "route",
        label: "Route",
        rules: [Rules.Required],
        type: FieldType.TextField,
      },
      {
        dataSelectorKey: "element",
        label: "Element",
        rules: [Rules.Required],
        type: FieldType.Autocomplete,
        options:[],
        optionText:"name",
        optionValue:"name"
      },
      
    ],
    actionList: [
      {
        actionKey: "Submit",
        label: "Submit",
      },
    ],
  });


  const [addFrontEndForm, setAddFrontEndForm] = useState<IFrontEnd>({
    name: "",
    layout: [{
      "name": "Root",
      "route": "/",
      "children": []
  }],
    screenList: [],
    type: "web",
  });

  const [addLayoutForm, setAddLayoutForm] = useState<ILayout>({
    name: "",
    children: [],
    route: "",
  });

  const [addScreenRouteForm, setAddScreenRouteForm] = useState<IElement>({
    name: "",
    element: "",
    route: "",
  });
  const [frontEndProjectList, setFrontendProjectList] = useState<IFrontEnd[]>(
    []
  );

  const [selectedFrontEnd, setSelectedFrontEnd] = useState<IFrontEnd>();
  const [addFrontEndDialog, setAddFrontEndDialog] = useState(false);
  const [addLayoutDialog, setAddLayoutDialog] = useState(false);
  const [addScreenRouteDialog, setAddScreenRouteDialog] = useState(false);
  
  const [selectedLayout, setSelectedLayout] = useState("");
  const [screenList, setScreenList] = useState<IScreen[]>([]);

  const [layoutMenuVisible, setLayoutMenuVisible] = useState(false);
  const [screenMenuVisible, setScreenMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    getFrontEndList();
  }, []);

  const addFrontEnd = () => {
    if (
      frontEndProjectList.findIndex(
        (item) => item.name === addFrontEndForm.name
      ) === -1
    ) {
      const frontEndList = [...frontEndProjectList, addFrontEndForm];
      setAddFrontEndDialog(false);
      setFrontendProjectList(frontEndList);
      console.log(frontEndProjectList, addFrontEndForm);
      updateFrontendFile(frontEndList);
    }
  };

  const getFrontEndList = async () => {
    try {
      const projectPath = (await GeneratorHelper.getProjectPath()) || "";
      electron.filesApi
        .readFile(projectPath, "frontEndConfig.json")
        .then((res) => {
          console.log(res, "res");
          setFrontendProjectList(JSON.parse(res));
        });
    } catch (e) {}
  };

  const selectFrontEndProject = (frontEndProject: IFrontEnd) => {
    // setScreenList(front)

    const frontEndScreenList: IScreen[] = frontEndProject?.screenList.reduce(
      (acc: IScreen[], currVal) => {
        const screenIndex = acc.findIndex((item) => item.path === currVal.path);
        console.log(screenIndex, currVal)
        if (screenIndex === -1) {
          acc.push({ screenList: currVal.name, path: currVal.path });
        } else {
          console.log(acc[screenIndex],currVal.name,"acc[screenIndex]")
          acc[screenIndex].screenList = `${acc[screenIndex]?.screenList},${currVal.name}`;
        }
        return acc;
      },
      []
    );
      console.log(frontEndScreenList,"frontEndScreenList")
    setScreenList(frontEndScreenList);
    setSelectedFrontEnd(frontEndProject);
  };

  const showContextMenu = (e: any) => {
    e.preventDefault();
    setMenuPosition({ top: e.clientY, left: e.clientX });
    setLayoutMenuVisible(true);
  };

  const showContextMenuFromScreenRoute = (e: any) => {
    e.preventDefault();
    setMenuPosition({ top: e.clientY, left: e.clientX });
    setScreenMenuVisible(true);
  };

  const addScreen = () => {
    const newScreenList: IScreen[] = [
      ...screenList,
      { screenList: "", path: "" },
    ];
    setScreenList(newScreenList);
  };

  const deleteScreen = (index: number) => {
    if (confirm("Are you sure want to delete this screen")) {
      const newScreenList = [...screenList];
      newScreenList.splice(index, 1);
      setScreenList(newScreenList);
    }
  };

  const updateScreenValue = (index: number, value: any, itemKey: string) => {
    const newScreenList = screenList;
    (newScreenList[index] as any)[itemKey] = value;
    setScreenList([...newScreenList]);
  };

  const handleAddLayoutclick = (layoutName: string) => {
    console.log(layoutName, "layoutName");
    setSelectedLayout(layoutName);
    setAddLayoutDialog(true);
  };

  const addLayout = () => {
    if (selectedFrontEnd) traverseLayout(selectedFrontEnd?.layout);
    function traverseLayout(children: ILayout[]) {
      children.map((child) => {
        if (child.children) {
          if (child.name === selectedLayout) {
            child.children.push(addLayoutForm);
          } else {
            traverseLayout(child.children);
          }
        }
      });
    }

    updateSelectedFrontEnd();
    
  };
  



  const deleteLayout = (layoutName: string) => {

    if(confirm("Are you sure ant to delete?")) {

    
    const traverseLayout = (children: ILayout[]) => {
      children.map((child,index) => {
        if (child.children) {
          if (child.name === layoutName) {
            children.splice(index,1);
          } else {
            traverseLayout(child.children);
          }
        }
      });
    }
    if (selectedFrontEnd) {traverseLayout(selectedFrontEnd?.layout)};
    updateSelectedFrontEnd();
  }
    
  };

  const deleteScreenRoute =  (screenName: string) => {

    if(confirm("Are you sure ant to delete?")) {

    
    const traverseLayout = (children: ILayout[]) => {
      children.map((child,index) => {
        if (child.children) {
          if (child.name === screenName) {
            
          } else {
            traverseLayout(child.children);
          }
        } else {
          children.splice(index,1);
        }
      });
    }
    if (selectedFrontEnd) {traverseLayout(selectedFrontEnd?.layout)};
    updateSelectedFrontEnd();
  }
    
  };

  const handleAddScreeRouteClick = (layoutName: string) => {
    console.log(layoutName, "layoutName");
    setSelectedLayout(layoutName);
    setAddScreenRouteDialog(true);
    const index = addScreenRouteFormSchema.fieldList.findIndex(item => item.dataSelectorKey==='element')
    if(index!==-1) {
    addScreenRouteFormSchema.fieldList[index].options = selectedFrontEnd?.screenList.map(item => item.name)
    setAddScreenRouteFormSchema(addScreenRouteFormSchema);
    }
  }

  const addScreenRoute = () => {
    
    const traverseLayout = (children: ILayout[]) => {
      children.map((child,index) => {
        if (child.children) {
          if (child.name === selectedLayout) {
            child.children.push((addScreenRouteForm as any))
          } else {
            traverseLayout(child.children);
          }
        }
      });
    }
    if (selectedFrontEnd) {traverseLayout(selectedFrontEnd?.layout)};
    updateSelectedFrontEnd();
    
  };

  const saveScreen = () => {
    const frontEndList = [...frontEndProjectList];
    if (selectedFrontEnd) {
      selectedFrontEnd.screenList = [];
      screenList.forEach((screen) => {
        if (screen.screenList.trim() !== "") {
          screen.screenList.split(",").forEach((indScreen) => {
            selectedFrontEnd?.screenList.push({
              name: indScreen,
              path: screen.path,
            });
          });
        }
      });

      setSelectedFrontEnd(selectedFrontEnd);
      const selectedFrontEndIndex = frontEndProjectList.findIndex(
        (item) => item.name === selectedFrontEnd.name
      );
      frontEndList[selectedFrontEndIndex] = selectedFrontEnd;
      setFrontendProjectList(frontEndList);

      updateFrontendFile(frontEndList);
    }
  };


  const updateSelectedFrontEnd = () => {
    if (selectedFrontEnd) {
      const frontEndList = frontEndProjectList;
      setSelectedFrontEnd(selectedFrontEnd);
      const selectedFrontEndIndex = frontEndProjectList.findIndex(
        (item) => item.name === selectedFrontEnd.name
      );
      frontEndList[selectedFrontEndIndex] = selectedFrontEnd;
      setFrontendProjectList(frontEndList);

      updateFrontendFile(frontEndList);

      setAddLayoutDialog(false)
      setAddScreenRouteDialog(false)
      setAddLayoutForm({
        name: "",
        children: [],
        route: "",
      })

      setAddScreenRouteForm({
        element:"",
        name:"",
        route:""
      })
      console.log(selectedFrontEnd, "selectedFrontEnd");
    }
  }

  const updateFrontendFile = async (frontEndList: IFrontEnd[]) => {
    const projectPath = (await GeneratorHelper.getProjectPath()) || "";
    setTimeout(async () => {
      await GeneratorHelper.writeFile(
        projectPath,
        "frontEndConfig.json",
        JSON.stringify(frontEndList)
      );
      setAddFrontEndDialog(false);
      setAddFrontEndForm({
        name: "",
        layout: [],
        screenList: [],
        type: "web",
      });
    }, 1000);
  };

  const renderLayout = (children: ILayout[]) => {
    return children.map((child) => {
      if (child.children) {
        return (
          <Accordion key={`${child.name}Layout`}>
            <AccordionSummary
              onContextMenu={showContextMenu}
              onClick={() => setLayoutMenuVisible(false)}
              className="row "
            >
              <span className="col-6">{child.name}Layout</span>"{child.route}"
              {layoutMenuVisible && (
                <div
                  className="context-menu"
                  style={{ top: menuPosition.top, left: menuPosition.left }}
                >
                  <div
                    className="col"
                    onClick={() => handleAddLayoutclick(child.name)}
                  >
                    Add Layout
                  </div>
                  <div className="col" onClick={() => handleAddScreeRouteClick(child.name)}>Add Screen</div>
                  <div className="col"
                  onClick={() => deleteLayout(child.name)}
                  >Delete</div>
                </div>
              )}
            </AccordionSummary>
            <AccordionDetails>{renderLayout(child.children)}</AccordionDetails>
          </Accordion>
        );
      } else {
        return (
          <AccordionSummary
            className=" row px-3 py-3"
            key={`${child.name}screen`}
            onContextMenu={showContextMenuFromScreenRoute}
            onClick={() => setScreenMenuVisible(false)}
          >
            <span className="col-6">{child.name}</span>"{child.route}"

            {screenMenuVisible && (
                <div
                  className="context-menu"
                  style={{ top: menuPosition.top, left: menuPosition.left }}
                >
                  
                  <div className="col"
                  onClick={() => deleteScreenRoute(child.name)}
                  >Delete</div>
                </div>
              )}
          </AccordionSummary>
        );
      }
    });
  };

  return (
    <div className="ma-2">
      <Dialog
        fullWidth
        open={addFrontEndDialog}
        onClose={() => {
          setAddFrontEndDialog(false);
        }}
      >
        <DialogTitle>Add FrontEnd PRoject</DialogTitle>
        <DialogContent>
          <Form
            formSchema={addFrontEndProjectForSchema}
            value={addFrontEndForm}
            onInput={(val) => setAddFrontEndForm(val)}
            onbuttonClick={() => addFrontEnd()}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        fullWidth
        open={addLayoutDialog}
        onClose={() => {
          setAddLayoutDialog(false);
        }}
      >
        <DialogTitle>Add Layout</DialogTitle>
        <DialogContent>
          <Form
            formSchema={addLayoutFormSchema}
            value={addLayoutForm}
            onInput={(val) => setAddLayoutForm(val)}
            onbuttonClick={() => addLayout()}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        fullWidth
        open={addScreenRouteDialog}
        onClose={() => {
          setAddScreenRouteDialog(false);
        }}
      >
        <DialogTitle>Add Screen route</DialogTitle>
        <DialogContent>
          <Form
            formSchema={addScreenRouteFormSchema}
            value={addScreenRouteForm}
            onInput={(val) => setAddScreenRouteForm(val)}
            onbuttonClick={() => addScreenRoute()}
          />
        </DialogContent>
      </Dialog>
      

      <Button onClick={() => setAddFrontEndDialog(true)}>
        Add Front End Project
      </Button>
      <div className="row">
        <div className="col-3">
          {frontEndProjectList.map((frontEndProject) => {
            return (
              <div
                className="pointer"
                onClick={() => selectFrontEndProject(frontEndProject)}
                key={frontEndProject.name}
              >
                {frontEndProject.name}
              </div>
            );
          })}
        </div>
        {selectedFrontEnd && (
          <div className="col-8">
            <Accordion variant="outlined">
              <AccordionSummary>
                <div className="d-flex w-100">
                  <div className="flex-fill">
                    Screen <Button onClick={() => saveScreen()}>Save</Button>
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails>
              {screenList.length ===0 && (
                        <Add onClick={() => addScreen()} />
                      )}
                {screenList.map((screen, index) => {
                  return (
                    <div
                      style={{ width: "100%" }}
                      className="d-flex align-items-center"
                      key={`screen+${index}`}
                    >
                      <TextField
                        onInput={(event: any) =>
                          updateScreenValue(
                            index,
                            event.target.value,
                            "screenList"
                          )
                        }
                        variant="outlined"
                        size="small"
                        className="mx-3"
                        value={screen.screenList}
                      />
                      under
                      <TextField
                        onChange={(event: any) =>
                          updateScreenValue(index, event.target.value, "path")
                        }
                        variant="outlined"
                        size="small"
                        className="mx-3"
                        value={screen.path}
                      />
                      <Delete onClick={() => deleteScreen(index)} />
                      {index == screenList.length - 1 && (
                        <Add onClick={() => addScreen()} />
                      )}
                    </div>
                  );
                })}
              </AccordionDetails>
            </Accordion>

            Layouts

            {
              renderLayout(selectedFrontEnd.layout)
            }
          </div>
        )}
      </div>
    </div>
  );
}

const addFrontEndProjectForSchema: FormSchema = {
  fieldList: [
    {
      dataSelectorKey: "name",
      label: "Name",
      rules: [Rules.Required],
      type: FieldType.TextField,
    },
  ],
  actionList: [
    {
      actionKey: "Submit",
      label: "Submit",
    },
  ],
};

const addLayoutFormSchema: FormSchema = {
  fieldList: [
    {
      dataSelectorKey: "name",
      label: "Name",
      rules: [Rules.Required],
      type: FieldType.TextField,
    },
    {
      dataSelectorKey: "route",
      label: "Route",
      rules: [Rules.Required],
      type: FieldType.TextField,
    },
  ],
  actionList: [
    {
      actionKey: "Submit",
      label: "Submit",
    },
  ],
};




interface IScreen {
  screenList: string;
  path: string;
}