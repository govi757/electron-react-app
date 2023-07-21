import React, { useState } from "react"
import IPreLoad, { IOpenFolderResponse } from "./interfaces/IPreLoad";
// import { electron } from "webpack"
// var electron: any;
const electron: IPreLoad = ((window as any).electron as IPreLoad)||{}
export default function App() {

    const [filesList, setFilesList] = useState([]);


    const openFolder = () => {
        electron.filesApi.openFolder((res: IOpenFolderResponse) => {
            // electron.filesApi.createFile(res.filePaths[0],"baseConfig.json",JSON.stringify({Test:"Hello"}))
            electron.filesApi.readFile(res.filePaths[0],'baseConfig.json',res => {
                console.log(res,"JSON")
            })
        });
    }

    return (
        <>
        <h1>I am app component</h1>
        {filesList}
        <button onClick={() =>{openFolder()}}>Open Folder</button>
        </>
    )
}