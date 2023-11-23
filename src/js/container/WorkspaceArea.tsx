import React, { useEffect, useState } from "react";
import IPreLoad, { IOpenFolderResponse } from "../interfaces/IPreLoad";
// import { electron } from "webpack"
// var electron: any;
const electron: IPreLoad = ((window as any).electron as IPreLoad) || {};
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GeneratorHelper from "../helper/GeneratorHelper";
import ApiOperation from "../helper/apiOperations";
import { IApiSection } from "../interfaces/IApi";
import CollectionOperation from "../helper/collectionOperations";
import { ICollection, IDataBase } from "../interfaces/ICollection";
import { IFrontEnd, baseFileList } from "../interfaces/IGeneral";
import Tab, { ITab } from "../component/generic/tab";
import BasicProjectSetup from "./BasicProjectSetup";
import ApiSetup from "./ApiSetup";
import CollectionSetup from "./CollectionSetup";
import { Button } from "@mui/material";
import DataSetup from "./DataSetup";
import { IData } from "../interfaces/IData";
import DataTypeOperations from "../helper/dataTypeOperations";
import FrontEndApiOperation from "../helper/frontEndApiOperations";
import FrontEndScreenOperation from "../helper/frontEndScreenOperations";
import FrontEndSetup from "./FrontEndSetup";

// const tabList: ITab[] = [
//     {
//         name: "Basic Setup",
//         component: <BasicProjectSetup />,
//         key: "basicSetup"
//     },

// ]

export default function WorkspaceArea() {
  const [fileList, setFileList] = useState([]);
  const [tabList, SetTabList] = useState<ITab[]>([
    {
      name: "Basic Setup",
      component: <BasicProjectSetup />,
      key: "basicSetup",
    },
  ]);
  const [selectedTab, setSelectedTab] = useState("basicSetup");

  const [collectionOperation] = useState(() => new CollectionOperation());
  const [apiOperation] = useState(() => new ApiOperation());
  const [dataTypeOperation] = useState(() => new DataTypeOperations());
  const [frontEndApiOperation] = useState(() => new FrontEndApiOperation());

  useEffect(() => {
    getFileList();
  }, []);

  const getFileList = () => {
    const selectedProjectPath = GeneratorHelper.getProjectPath() || "";
    const tempTabList = [
      {
        name: "Basic Setup",
        component: <BasicProjectSetup />,
        key: "basicSetup",
      },
    ];
    SetTabList([...tempTabList]);

    electron.filesApi.readDir(selectedProjectPath, (res: any) => {
      const fileList = res
        .filter((file: any) => file.includes(".json"))
        .map((item: any) => {
          const index = baseFileList.findIndex(
            (fileType) => fileType.fileName === item
          );
          if (item === "apiConfig.json") {
            tempTabList.push({
              name: "Apis",
              component: <ApiSetup />,
              key: "apiSetup",
            });
          }

          if (item === "dbConfig.json") {
            tempTabList.push({
              name: "DataBase",
              component: <CollectionSetup />,
              key: "collectionSetup",
            });
          }

          if (item === "dataConfig.json") {
            tempTabList.push({
              name: "DataTypes",
              component: <DataSetup />,
              key: "dataSetup",
            });
          }

          if (item === "frontEndConfig.json") {
            tempTabList.push({
              name: "FrontEnd",
              component: <FrontEndSetup />,
              key: "frontEnd",
            });
          }

          SetTabList([...tempTabList]);
        });

      setFileList(fileList);
    });
  };

  const openFile = (file: any) => {
    const selectedProjectPath = GeneratorHelper.getProjectPath() || "";
    electron.filesApi
      .readFile(selectedProjectPath, file)
      .then((dataString: any) => {});
  };

  const buildProject = async () => {
    if (confirm("Are you sure want to build the project")) {
      GeneratorHelper.copyBaseFolderStructure();
      GeneratorHelper.createFrontEndFile();

      await initializeProject();

      setTimeout(() => {
        getFileList();
        buildApiServiceCode();
        buildCollectionCode();
        buildDataCode();
        buildFrontEndScreens();
      }, 1000);
    }
  };
  const buildFrontEndScreens = () => {
    const path = GeneratorHelper.getProjectPath() || "";
    electron.filesApi
      .readFile(path, "frontEndConfig.json")
      .then((dataString: string) => {
        const frontEndList: IFrontEnd[] = JSON.parse(dataString);

        FrontEndScreenOperation.buildFrontEnd(frontEndList);
      });
  };

  const buildDataCode = () => {
    const path = GeneratorHelper.getProjectPath() || "";
    console.log(path, "path");
    electron.filesApi
      .readFile(path, "dataConfig.json")
      .then((dataString: string) => {
        const apiSectionList: IData[] = JSON.parse(dataString);
        dataTypeOperation.buildDataCode(apiSectionList);
      });
  };

  const initializeProject = () => {
    const path = GeneratorHelper.getProjectPath() || "";
    const dbConfigJson = [
      {
        dbName: "User",
        collectionList: [
          {
            fields: [
              { name: "userName", type: "string", required: true, index: true },
              { name: "emailId", type: "string", required: true, index: false },
              {
                name: "password",
                type: "string",
                required: true,
                index: false,
              },
              { name: "mobile", type: "string", required: false, index: false },
              {
                name: "firstName",
                type: "string",
                required: true,
                index: false,
              },
              {
                name: "lastName",
                type: "string",
                required: false,
                index: false,
              },
            ],
            name: "User",
          },
          {
            fields: [
              { name: "name", type: "string", required: true, index: false },
              {
                name: "description",
                type: "string",
                required: false,
                index: false,
              },
            ],
            name: "Role",
          },
          {
            fields: [
              { name: "name", type: "string", required: true, index: false },
              {
                name: "description",
                type: "string",
                required: false,
                index: false,
              },
            ],
            name: "Permission",
          },
        ],
      },
    ];
    const apiConfigJSON = [
      {
        name: "User",
        apiList: [
          {
            name: "Signup",
            type: "post",
            input: {
              userName: { type: "string", required: true },
              emailId: { type: "string", required: true },
              password: { type: "string", required: false },
              firstName: { type: "string", required: false },
              lastName: { type: "string", required: false },
              mobile: { type: "string", required: false },
            },
            output: {},
          },
          {
            name: "Login",
            type: "post",
            input: {
              emailId: { type: "string", required: true },
              password: { type: "string", required: true },
            },
            output: {},
          },
        ],
      },
    ];
    GeneratorHelper.createFile(
      path,
      "apiConfig.json",
      JSON.stringify(apiConfigJSON)
    );
    GeneratorHelper.createFile(
      path,
      "dbConfig.json",
      JSON.stringify(dbConfigJson)
    );

    GeneratorHelper.createFile(path, "dataConfig.json", "[]");

    GeneratorHelper.createFile(path, "frontEndConfig.json", "[]");
  };

  const buildCollectionCode = () => {
    const path = GeneratorHelper.getProjectPath() || "";
    electron.filesApi
      .readFile(path, "dbConfig.json")
      .then((dataString: string) => {
        const databaseList: IDataBase[] = JSON.parse(dataString);
        collectionOperation.buildCollectionCode(databaseList);
      });
  };

  const buildApiServiceCode = () => {
    const path = GeneratorHelper.getProjectPath() || "";
    electron.filesApi
      .readFile(path, "apiConfig.json")
      .then((dataString: string) => {
        const apiSectionList: IApiSection[] = JSON.parse(dataString);
        apiOperation.buildApiServiceCode(apiSectionList);
        frontEndApiOperation.buildFrontEndCode(apiSectionList);
      });
  };

  return (
    <div className=" d-flex  mainScreen">
      {/* <div className="px-4 col-3 py-3 card">
        {fileList.map((file: any) => {
          return (
            <a
              key={file.fileName}
              className="pointer"
              onClick={() => openFile(file)}
            >
              {file.label}
            </a>
          );
        })}
      </div> */}

      <div className=" flex-fill ">
        <Button
          size="small"
          color="primary"
          variant="contained"
          style={{ position: "fixed", right: 10, top: 10, zIndex: 99 }}
          className="pointer"
          onClick={() => buildProject()}
        >
          Run
        </Button>
        <Tab
          tabList={tabList}
          tabSelected={(key) => setSelectedTab(key)}
          selectedTab={selectedTab}
        />
      </div>
    </div>
  );
}
