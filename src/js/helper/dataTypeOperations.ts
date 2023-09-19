import { FieldType } from "../interfaces/ICollection";
import { Field, IData } from "../interfaces/IData";
import GeneratorHelper from "./GeneratorHelper";

export default class DataTypeOperations {
    path: string = '';
    constructor() {
        GeneratorHelper.getSelectedNodeProjectPath((projectPath: string) => {
            this.path = projectPath;
        })
    }

    get dataPath() {
        return `${this.path}/src/data`;
    }

    buildDataCode(dataTypeList: IData[]) {
        let dataCode = this.generateDataCode(dataTypeList);
        GeneratorHelper.writeFile(this.dataPath,'generatedData.ts',dataCode);
    }

    // writeRouteCode(apiSection: IApiSection) {
    //     const code = this.generateRoutesCode(apiSection);
    //     GeneratorHelper.writeFile(this.routesPath, `${apiSection.name}.routes.ts`, code);
    // }

    generateDataCode(dataTypeList: IData[]) {
        const code = `
        ${dataTypeList.reduce((acc: string, dataType) => {
            const dataTypeKeyList = Object.keys(dataType.fields);
            // const outputKeyList = api.output ? Object.keys(api.output) : [];
            acc = acc + `
export class ${dataType.name} {
    
    constructor(${dataType.fields.reduce((acc, field) => {
                acc = acc + `\npublic ${field.name}: ${field.type}${!field.required?'|undefined':''}=${this.getDefaultValue(field)},`
                return acc
            }, "")}) {
    }

    static fromJSON(jsonObj: any) {
        return new ${dataType.name}(
            ${dataType.fields.reduce((acc, field) => {
                acc = acc + `\njsonObj?.${field.name},`
                return acc
            }, "")}
        )    
    }

    public toJson(): object {
        return {
          ${dataType.fields.reduce((acc, field) => {
            acc = acc + `\n${field.name}: this.${field.name}!= null? this.${field.name}:undefined,`
            return acc
        }, "")}
        }
    }

}
                `
            return acc;
        }, "")
            }
        `
        return code
    }

    getDefaultValue(field: Field) {
        console.log(field,"Field")
        switch(field.type) {
            case "string":{
                return !field.required?'undefined':"''"
            };
            case "object":return !field.required?'undefined':"{}";
            case "boolean":return !field.required?'undefined':"false";
            default: "null"
        }
    }

}
