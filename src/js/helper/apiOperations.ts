
import { ApiType, IApi, IApiSection } from "../interfaces/IApi";
import GeneratorHelper from "./GeneratorHelper";


export default class ApiOperation {
    path: string = '';
    constructor() {
        GeneratorHelper.getSelectedNodeProjectPath((projectPath: string) => {
            console.log(projectPath)
            this.path = projectPath;
        })
    }
    get apiPath() {
        console.log(this.path, "this.path")
        return `${this.path}/src/services`;
    }

    get interfacePath() {
        return `${this.path}/src/data`;
    }


    get dataPath() {
        return `${this.path}/src/data`;
    }


    get routesPath() {
        return `${this.path}/src/routes`;
    }


    buildApiServiceCode(apiSectionList: IApiSection[]) {
        apiSectionList.map(apiSection => {

            this.writeApi(apiSection);
            this.writeInterfaceCode(apiSection);
            this.writeApiDatacode(apiSection);
            this.writeRouteCode(apiSection);
        })
    }


    writeApi(apiSection: IApiSection) {
        const apiCode = this.generateApiCode(apiSection);
        const modelPath = `${this.apiPath}/${apiSection.name}`;
        const fileName = `${apiSection.name}.service.ts`
        GeneratorHelper.createFile(modelPath, fileName, apiCode);
    }


    writeInterfaceCode(apiSection: IApiSection) {
        const interfacePath = `${this.apiPath}/${apiSection.name}`;
        const code = this.generateApiInterfaceCode(apiSection);
        GeneratorHelper.writeFile(interfacePath, "api.interface.ts", code);
    }

    writeApiDatacode(apiSection: IApiSection) {
        const interfacePath = `${this.apiPath}/${apiSection.name}`;
        const code = this.generateSampleApiDataCode(apiSection);
        GeneratorHelper.writeFile(interfacePath, "api.data.ts", code);
    }

    writeRouteCode(apiSection: IApiSection) {
        const code = this.generateRoutesCode(apiSection);
        GeneratorHelper.writeFile(this.routesPath, `${apiSection.name}.routes.ts`, code);
    }



    generateApiInterfaceCode(apiSection: IApiSection) {
        const interfaceName: string = `I${apiSection.name}Api`;
        const sectionName: string = `${apiSection.name}Service`;
        const apiCode = this.generateApiFunctionCodes(apiSection);
        const code = `
import express from 'express';\n;
import {${apiSection.apiList.reduce((acc: string, currVal) => {
            const inputName: string = (`${apiSection.name}_${currVal.name}_Input`).toUpperCase();
            acc = acc + inputName + ',';
            return acc
        }, '')}} from './api.data';
export interface ${interfaceName} {
    ${apiSection.apiList.reduce((acc: string, currVal) => {
            const inputName: string = (`${apiSection.name}_${currVal.name}_Input`).toUpperCase();
            acc = acc + `${currVal.name}(input: ${inputName}, res: express.Response):void\n\t`
            return acc;
        }, '')
            }
}

/*
API CODE
.............

${apiCode}
*/
`;
        return code;
    }

    generateSampleApiDataCode(apiSection: IApiSection) {
        const code = `
        ${apiSection.apiList.reduce((acc: string, api) => {
            const inputKeyList = Object.keys(api.input);
            const outputKeyList = api.output ? Object.keys(api.output) : [];
            const inputDataTypeName: string = (`${apiSection.name}_${api.name}_Input`).toUpperCase();
            acc = acc + `
export class ${inputDataTypeName} {
    ${inputKeyList.reduce((acc, inputKey) => {
                acc = acc + `${inputKey}: ${api.input[inputKey].type};`
                return acc
            }, "")}
    constructor(${inputKeyList.reduce((acc, inputKey) => {
                acc = acc + `${inputKey}: ${api.input[inputKey].type},`
                return acc
            }, "")}) {
                ${inputKeyList.reduce((acc, inputKey) => {
                acc = acc + `this.${inputKey}= ${inputKey};`
                return acc
            }, "")}
    }

    static fromJSON(jsonObj: any) {
        return new ${inputDataTypeName}(
            ${inputKeyList.reduce((acc, inputKey) => {
                acc = acc + `jsonObj?.${inputKey},`
                return acc
            }, "")}
        )    
    }

    checkDefaultPreCondition() {
        const error: any = {};
        ${inputKeyList.reduce((acc, inputKey) => {
            acc = acc + `${api.input[inputKey].required == true?
            `if(!this.${inputKey}) {
                error['${inputKey}']="${inputKey} is required"
             }`
                :``}`
            return acc
        }, "")}
        return {
            isValid: Object.keys(error).length==0,
            errorBody: error
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
    generateApiCode(apiSection: IApiSection) {
        const serviceName = `${apiSection.name}Service`;
        const interfaceName = `I${apiSection.name}Api`;
        const code = `
    import express from 'express';\n
    import { ${interfaceName} } from './api.interface';\n
${apiSection.apiList.length > 0 ? `import {${apiSection.apiList.reduce((acc: string, currVal) => {
            const inputName: string = (`${apiSection.name}_${currVal.name}_Input`).toUpperCase();
            acc = acc + inputName + ',';
            return acc
        }, '')}} from './api.data';` : ''}

export default class ${serviceName} implements ${interfaceName} {
    ${
        this.generateApiFunctionCodes(apiSection)
    }
}`

        return code;
    }

    generateApiFunctionCodes(apiSection: IApiSection) {
        return apiSection.apiList.reduce((acc, api) => {
            const inputName: string = (`${apiSection.name}_${api.name}_Input`).toUpperCase();
            acc = acc + `public async ${api.name}(input: ${inputName}, res: express.Response) {
                try {
                    ${api.output && Object.keys(api.output).length>0?
                        `const projectionString = '${Object.keys(api.output).reduce((acc, cur) => {
                            acc = acc + cur + ' ';
                            return acc;
                        },'')}'`:''}

                }catch (e) {
                    res.status(500).send("Error" + e);
                }
            }\n`;
            return acc;
        }, "")
    }

    generateRoutesCode(apiSection: IApiSection) {
        const className = `${apiSection.name}Routes`;
        const serviceName = `${apiSection.name}Service`;

        const code = `
    import { CommonRoutesConfig } from './common/common.routes.config';
    import ${serviceName} from '../services/${apiSection.name}/${apiSection.name}.service';
    import express from 'express';
    import verifyToken from '../middlewares/auth';
    ${apiSection.apiList.length > 0 ? `import {${apiSection.apiList.reduce((acc: string, currVal) => {
            const inputName: string = (`${apiSection.name}_${currVal.name}_Input`).toUpperCase();
            acc = acc + inputName + ',';
            return acc
        }, '')}} from '../services/${apiSection.name}/api.data';` : ''}

    export default class ${className} extends CommonRoutesConfig {
        constructor(app: express.Application) {
            super(app, '${className}');
        }
        ${apiSection.name}Service = new ${apiSection.name}Service();

        configureRoutes(): express.Application {

            ${apiSection.apiList.reduce((acc, currVal) => {
            const inputName: string = (`${apiSection.name}_${currVal.name}_Input`).toUpperCase();
            acc = acc + `
                    this.app.route('/${this.getApiName(apiSection.name)}/${this.getApiName(currVal.name)}').${currVal.type}(${currVal.authenticated === true?'verifyToken,':''}async (req: express.Request, res: express.Response) => {
                        const input: ${inputName} = ${inputName}.fromJSON(${currVal.type==ApiType.Get?'req.query':'req.body'});
                        const defaultPreCondition = input.checkDefaultPreCondition();
                        if(defaultPreCondition.isValid) {
                        this.${serviceName}.${currVal.name}(input, res);
                        } else {
                            res.status(412).send(defaultPreCondition.errorBody)
                        }
                    });`
            return acc;
        }, '')
            }

            return this.app;
        }
    }
    `

        return code;
    }


    getApiName(apiName: string) {
        return apiName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();;
    }



}