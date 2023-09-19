import { normalDataTypes } from "../datas/constants";
import { ApiType, IApi, IApiSection } from "../interfaces/IApi";
import GeneratorHelper from "./GeneratorHelper";


export default class FrontEndApiOperation {
    frontEndPathList: string[] = [];
    constructor() {
        GeneratorHelper.getFrontEndPathList((projectPathList: string[]) => {
            this.frontEndPathList = projectPathList;
        })
    }

    buildFrontEndCode(apiSectionList: IApiSection[]) {
        
        apiSectionList.map(apiSection => {
            this.createSliceFile(apiSection);
            this.writeApiDatacode(apiSection);
            this.writeApiActionCode(apiSection);
        })

        this.writeGeneratedReducerCode(apiSectionList);
    }
    createSliceFile(apiSection: IApiSection) {
        const sliceCode: string = this.generateSliceCode(apiSection)
        const fileName = `${apiSection.name}Slice.ts`
        this.frontEndPathList.forEach(frontEndPath => {
            console.log(frontEndPath,"frontEndPath")
            const slicePath = `${frontEndPath}/src/redux/store/${apiSection.name.toLowerCase()}`;
            GeneratorHelper.writeFile(slicePath, fileName, sliceCode);
        })
    }

    writeApiDatacode(apiSection: IApiSection) {
        const code = this.generateApiDatacode(apiSection);
        const fileName = `data.ts`;
        this.frontEndPathList.forEach(frontEndPath => {
            console.log(frontEndPath,"frontEndPath")
            const slicePath = `${frontEndPath}/src/redux/store/${apiSection.name.toLowerCase()}`;
            GeneratorHelper.writeFile(slicePath, fileName, code);
        })
    }

    writeApiActionCode(apiSection: IApiSection) {
        const code = this.generateApiActioncode(apiSection);
        const fileName = 'action.ts';
        this.frontEndPathList.forEach(frontEndPath => {
            console.log(frontEndPath,"frontEndPath")
            const slicePath = `${frontEndPath}/src/redux/store/${apiSection.name.toLowerCase()}`;
            GeneratorHelper.writeFile(slicePath, fileName, code);
        })
    }


    writeGeneratedReducerCode(apiSectionList: IApiSection[]) {
        const code = this.generateReducersCode(apiSectionList);
        const fileName = 'generatedReducers.ts';
        this.frontEndPathList.forEach(frontEndPath => {
            console.log(frontEndPath,"frontEndPath")
            const slicePath = `${frontEndPath}/src/redux/store`;
            GeneratorHelper.writeFile(slicePath, fileName, code);
        })
    }


    generateApiDatacode(apiSection: IApiSection) {
        const code = `
        ${apiSection.apiList.reduce((acc: string, api) => {
            const inputKeyList = Object.keys(api.input);
            const outputKeyList = api.output ? Object.keys(api.output) : [];
            const inputDataTypeName: string = (`${apiSection.name}_${api.name}_Input`).toUpperCase();
            const outputDataTypeName: string = (`${apiSection.name}_${api.name}_Output`).toUpperCase();
            acc = acc + `
${inputKeyList.length>0?`export class ${inputDataTypeName} {
    
    constructor(${inputKeyList.reduce((acc, inputKey) => {
                acc = acc + `public ${inputKey}: ${api.input[inputKey].type},`
                return acc
            }, "")}) {
                
    }

    static fromJSON(jsonObj: any) {
        return new ${inputDataTypeName}(
            ${inputKeyList.reduce((acc, inputKey) => {
                acc = acc + `jsonObj?.${inputKey},`
                return acc
            }, "")}
        )    
    }
    public toJson(): object {
        return {
          ${inputKeyList.reduce((acc, inputKey) => {
            acc = acc + `\n${inputKey}: this.${inputKey}!= null? this.${inputKey}:undefined,`
            return acc
        }, "")}
        }
    }
}`:''}

${outputKeyList.length>0?`export class ${outputDataTypeName} {
    constructor(${outputKeyList.reduce((acc, outputKey) => {
        acc = acc + `public ${outputKey}: ${api.output[outputKey].type},`
        return acc
    }, "")}) {
        
}

static fromJSON(jsonObj: any) {
return new ${outputDataTypeName}(
    ${outputKeyList.reduce((acc, outputKey) => {
        acc = acc + `jsonObj?.${outputKey},`
        return acc
    }, "")}
)    
}

public toJson(): object {
    return {
      ${outputKeyList.reduce((acc, outputKey) => {
        acc = acc + `\n${outputKey}: this.${outputKey}!= null? this.${outputKey}:undefined,`
        return acc
    }, "")}
    }
}

}`:''}

`
            return acc;
        }, "")
            }
        `
        return code
    }


    generateSliceCode(apiSection: IApiSection) {
        const code = `
        import { createSlice, PayloadAction } from "@reduxjs/toolkit";
        import {${
            apiSection.apiList.reduce((acc, curVal) => {
                acc = acc + `${curVal.name},`
                return acc
            },'')
        }} from './action';
        interface ${apiSection.name}State {
            ${apiSection.apiList.reduce((acc, curVal) => {
                acc = acc + `${curVal.name}Output: any,\n${curVal.name}Loading: boolean,\n${curVal.name}Error: string | null,\n`
                return acc
            },"")}
        }

        const initialState: ${apiSection.name}State = {
            ${apiSection.apiList.reduce((acc, curVal) => {
                acc = acc + `${curVal.name}Output: null,\n${curVal.name}Loading: false,\n${curVal.name}Error: null,\n`
                return acc
            },"")}
        }

        export const ${apiSection.name}Slice = createSlice({
            name: "${apiSection.name}",
            initialState,
            reducers: {}, 
            extraReducers: (builder) =>{
                builder.
                ${apiSection.apiList.reduce((acc, curVal,currentIndex) => {
                    console.log(currentIndex,"CcurrentIndex")
                    acc = acc + `addCase(${curVal.name}.pending, state => {
                        state.${curVal.name}Loading= true;
                        state.${curVal.name}Error= null;
                    }).addCase(${curVal.name}.fulfilled,(state, action) => {
                        state.${curVal.name}Loading = false;
                        state.${curVal.name}Output = action.payload;
                        state.${curVal.name}Error = null;
                    }).addCase(${curVal.name}.rejected, (state, action) => {
                        state.${curVal.name}Loading = false;
                        state.${curVal.name}Output = null;
                        state.${curVal.name}Error = action.payload as string;
                      })${currentIndex<apiSection.apiList.length-1?'.':''}`
                    return acc
                },"")}

            }
        });
        
        export default ${apiSection.name}Slice.reducer;
        `

        return code;
    }


    generateApiActioncode(apiSection: IApiSection) {
        const code = `
        import { createAsyncThunk } from "@reduxjs/toolkit";
        import axios from 'axios';
        import api from "../../api";
        import { ${apiSection.apiList.reduce((acc, curVal) => {
            const inputKeyList = Object.keys(curVal.input);
            const outputKeyList = Object.keys(curVal.output);
            const inputDataTypeName: string = (`${apiSection.name}_${curVal.name}_Input`).toUpperCase();
            const outputDataTypeName: string = (`${apiSection.name}_${curVal.name}_Output`).toUpperCase();
            acc = acc + `${inputKeyList.length>0?inputDataTypeName+',':''}`;
            acc = acc + `${outputKeyList.length>0?outputDataTypeName+',':''}`;
            return acc
        },'')} } from "./data";
        ${apiSection.apiList.reduce((acc, curVal) => {
            const inputKeyList = Object.keys(curVal.input);
            const outputKeyList = Object.keys(curVal.output);
            const inputDataTypeName: string = (`${apiSection.name}_${curVal.name}_Input`).toUpperCase();
            const outputDataTypeName: string = (`${apiSection.name}_${curVal.name}_Output`).toUpperCase();
            acc = acc + `
            export const ${curVal.name} = createAsyncThunk('${apiSection.name}/${curVal.name}', async (${inputKeyList.length>0?`input: ${inputDataTypeName}`:`_`}, { rejectWithValue }) => {
                try {
                  const { data } = await api.${curVal.type}('${this.getApiName(apiSection.name)}/${this.getApiName(curVal.name)}',${inputKeyList.length>0?'input':''});
                  return data;
                } catch (error: any) {
                  return rejectWithValue(error.message);
                }
              })
            `
            return acc
        },'')}
        
        `

        return code;
    }

    generateReducersCode(apiSectionList: IApiSection[]) {
        const code = `
        ${apiSectionList.reduce((acc, curVal) => {
            acc = acc + `
import ${curVal.name}Reducer from './${curVal.name.toLowerCase()}/${curVal.name}Slice';\n` 
    return acc;
},'')}

export const GeneratedReducers = {
    ${apiSectionList.reduce((acc, curVal) => {
        acc = acc + `${curVal.name.toLowerCase()}: ${curVal.name}Reducer,` 
        return acc;
    },'')}
}
`;
        return code;
    }

    getApiName(apiName: string) {
        return apiName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();;
    }
}