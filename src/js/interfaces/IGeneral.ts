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
}