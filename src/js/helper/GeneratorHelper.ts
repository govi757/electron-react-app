import IPreLoad from "../interfaces/IPreLoad"

const electron: IPreLoad = ((window as any).electron as IPreLoad) || {}
// const 
export default class GeneratorHelper {
    public static copyBaseFolderStructure() {
        this.getSelectedNodeProjectPath(projectPath => {
            electron.filesApi.copyFolder(projectPath);
        })
    }

    public static getSelectedNodeProjectPath(cb: (projectPath: string) => void) {
        const selectedProjectPath: string = localStorage.getItem('selectedProjectPath') || '';
        electron.filesApi.readFile(selectedProjectPath, 'baseConfig.json',).then(jsonString => {
            const basicJson = JSON.parse(jsonString);
            console.log(basicJson, typeof (basicJson), "JSON");
            const projectPath = `${selectedProjectPath}/${basicJson.name}`;
            cb(projectPath);
        })
        // electron.filesApi.readFile(selectedProjectPath, 'baseConfig.json', (jsonString: string) => {
        //     const basicJson = JSON.parse(jsonString);

        //     console.log(basicJson, typeof (basicJson), "JSON");
        //     const projectPath = `${selectedProjectPath}/${basicJson.name}`;
        //     cb(projectPath);
        // })
    }

    public static getProjectPath() {
        return localStorage.getItem('selectedProjectPath');
    }


    public static createFile(src: string, fileName: string, content: string) {
        electron.filesApi.createFile(src, fileName, content);
    }


    public static writeFile(src: string, fileName: string, content: string) {
        electron.filesApi.writeFile(src, fileName, content);
    }

}