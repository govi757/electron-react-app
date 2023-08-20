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
import { baseFileList } from "../interfaces/IGeneral";
import Tab, { ITab } from "../component/generic/tab";
import BasicProjectSetup from "./BasicProjectSetup";
import ApiSetup from "./ApiSetup";
import CollectionSetup from "./CollectionSetup";
import { Button } from "@mui/material";

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
  useEffect(() => {
    getFileList();
  }, []);

  const getFileList = () => {
    const selectedProjectPath = GeneratorHelper.getProjectPath() || "";
    const tempTabList = [  {
      name: "Basic Setup",
      component: <BasicProjectSetup />,
      key: "basicSetup",
    },];
    SetTabList([...tempTabList])

    electron.filesApi.readDir(selectedProjectPath, (res: any) => {
      const fileList = res
        .filter((file: any) => file.includes(".json"))
        .map((item: any) => {
          const index = baseFileList.findIndex(
            (fileType) => fileType.fileName === item
          );
          console.log(item, "item");
          if (item === "apiConfig.json") {
            tabList.push({
              name: "Apis",
              component: <ApiSetup />,
              key: "apiSetup",
            });
          }

          if (item === "dbConfig.json") {
            tabList.push({
              name: "DataBase",
              component: <CollectionSetup />,
              key: "collectionSetup",
            });
          }

          SetTabList([...tabList]);
        });

      setFileList(fileList);
      console.log(fileList, "fileList");
    });
  };

  const openFile = (file: any) => {
    const selectedProjectPath = GeneratorHelper.getProjectPath() || "";
    electron.filesApi
      .readFile(selectedProjectPath, file)
      .then((dataString: any) => {
        console.log(JSON.parse(dataString), "Data");
      });
  };

  const buildProject = async () => {
    if (confirm("Are you sure want to build the project")) {
      GeneratorHelper.copyBaseFolderStructure();
      buildApiServiceCode();
      buildCollectionCode();
      await initializeProject();
      setTimeout(() => {
        getFileList();
      }, 1000);
    }
  };

  const initializeProject = () => {
    const path = GeneratorHelper.getProjectPath() || "";
    const dbConfigJson = [
      {
        dbName: "User",
        collectionList: [
          {
            fields: [
              { name: "userName", type: "String", required: true, index: true },
              { name: "emailId", type: "String", required: true, index: false },
              {
                name: "password",
                type: "String",
                required: true,
                index: false,
              },
              { name: "mobile", type: "String", required: false, index: false },
              {
                name: "firstName",
                type: "String",
                required: true,
                index: false,
              },
              {
                name: "lastName",
                type: "String",
                required: false,
                index: false,
              },
            ],
            name: "User",
          },
          {
            fields: [
              { name: "name", type: "String", required: true, index: false },
              {
                name: "description",
                type: "String",
                required: false,
                index: false,
              },
            ],
            name: "Role",
          },
          {
            fields: [
              { name: "name", type: "String", required: true, index: false },
              {
                name: "description",
                type: "String",
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
      });
  };

  return (
    <div className=" d-flex  ">
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
