import React, { useEffect, useState } from "react"
import IPreLoad, { IOpenFolderResponse } from "../interfaces/IPreLoad";
const electron: IPreLoad = ((window as any).electron as IPreLoad)||{}
import { BrowserRouter, Routes, Route,useNavigate } from "react-router-dom";

export default function OpeningPage() {
    const navigate = useNavigate();

    
    const [projectList, setProjectList] = useState([]);


    useEffect(() => {
        getProjectList()
    },[])

    const getProjectList = () => {
        const importedProList: any = localStorage.getItem('importedProjectPathList') || '[]';
        setProjectList(JSON.parse(importedProList));
    }


    const openFolder = () => {
        electron.filesApi.openFolder((res: IOpenFolderResponse) => {
            // localStorage.setItem('importedProjects',res.filePaths[0])
            setFilePathToLocalStorage(res.filePaths[0])
            navigate("/workspace");
            
        });
    }

    const setFilePathToLocalStorage = (filePath: string)=> {
        const importedProjectPathListString = localStorage.getItem('importedProjectPathList')
        const importedProjects: any = importedProjectPathListString?JSON.parse(importedProjectPathListString):[];
        if(!importedProjects.includes(filePath)) {
            importedProjects.push(filePath)
        }
        localStorage.setItem('importedProjectPathList', JSON.stringify(importedProjects));
        localStorage.setItem('selectedProjectPath', filePath);
        
    }

    const openProject = (projectPath: any) => {
        localStorage.setItem('selectedProjectPath', projectPath);   
        navigate("/workspace");
    }

    return (
        <>
        <div style={{height:'100vh'}} className="container d-flex flex-column justify-content-center align-items-center">
        <h1>Data Creator</h1>
        <a className="pointer" onClick={() =>{openFolder()}}>Open Folder</a>
        <h5>Recent Projects</h5>
        {projectList.map(project => {
            return (
                <a className="pointer" onClick={() =>{openProject(project)}}>
                    
                    {project}
                </a>
            )
        })}
        </div>
        </>
    )
}