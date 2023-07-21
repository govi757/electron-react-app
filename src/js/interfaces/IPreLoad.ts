export default interface IPreLoad {
    filesApi: {
        writeFile: (src: string,fileName: string,content: any) => void;
        createFile: (src: string,fileName: string,content: any) => void;
        readFile: (src: string,fileName: string,res: (response: string[]) => void) => void;
        openFolder: (res: (response: IOpenFolderResponse) => void) => void;
        readDir: (src: string,res: (response: string[]) => void) => void;
    };
    notificationApi: {
        sendNotification: (message: string) => void
    }
}

export interface IOpenFolderResponse {
    filePaths: string[];
}



