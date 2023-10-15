export interface BaseFile {
    fileName:string;
    label: string;
    type: string
}

export const baseFileList:BaseFile[] =  [
     {fileName: "baseConfig.json",label: "Basic Config",type: "basic"},
     {fileName: "apiConfig.json",label: "Apis",type: "api"},
     {fileName: "dbConfig.json",label: "Collections",type: "collection"},
]

export interface IBaseConfig {
    name: string
    frontendList:IFrontEnd[] 
}

export interface IFrontEnd {
    name: string;
    type: string;
    screenList: IScreen[]
    layout: ILayout[]
}

export interface IScreen {
    name:string,
    path:string
}

export interface ILayout {
    name:string,
    route:string,
    children: ILayout[],
    element?: string;
}

export interface IElement {
    element: string;
    route: string;
    name: string;
}