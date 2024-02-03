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
            const slicePath = `${frontEndPath}/src/redux/store/${apiSection.name.toLowerCase()}`;
            GeneratorHelper.writeFile(slicePath, fileName, sliceCode);
        })
    }

    writeApiDatacode(apiSection: IApiSection) {
        const code = this.generateApiDatacode(apiSection);
        const fileName = `data.ts`;
        this.frontEndPathList.forEach(frontEndPath => {
            const slicePath = `${frontEndPath}/src/redux/store/${apiSection.name.toLowerCase()}`;
            GeneratorHelper.writeFile(slicePath, fileName, code);
        })
    }

    writeApiActionCode(apiSection: IApiSection) {
        const code = this.generateApiActioncode(apiSection);
        const fileName = 'action.ts';
        this.frontEndPathList.forEach(frontEndPath => {
            const slicePath = `${frontEndPath}/src/redux/store/${apiSection.name.toLowerCase()}`;
            GeneratorHelper.writeFile(slicePath, fileName, code);
        })
    }


    writeGeneratedReducerCode(apiSectionList: IApiSection[]) {
        const code = this.generateReducersCode(apiSectionList);
        const fileName = 'generatedReducers.ts';
        this.frontEndPathList.forEach(frontEndPath => {
            const slicePath = `${frontEndPath}/src/redux/store`;
            GeneratorHelper.writeFile(slicePath, fileName, code);
        })
    }

    getDefaultValue(type: string, required: boolean) {
        console.log(type, required,"Required, Type............................")
        if(required==false) {
            return "undefined"
        } else {
        if(type=="string") {
            return "''"
        } else if(type=="number") {
            return "0"
        } else if(type=="object") {
            return "{}"
        } else {
            return null
        }
    }
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
        acc = acc + `public ${inputKey}: ${api.input[inputKey].type} ${api.input[inputKey].required==false?"|undefined":""}=${this.getDefaultValue(api.input[inputKey].type,api.input[inputKey]?.required)},`
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
    acc = acc + `public ${outputKey}: ${api.output[outputKey].type}${api.output[outputKey]?.required==false?"|undefined":""}=${this.getDefaultValue(api.output[outputKey].type,api.output[outputKey]?.required)},`
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

public toJson(): I_${outputDataTypeName} {
    return {
      ${outputKeyList.reduce((acc, outputKey) => {
        acc = acc + `\n${outputKey}: this.${outputKey}!= null? this.${outputKey}:undefined,`
        return acc
    }, "")}
    }
}

}`:''}


${outputKeyList.length>0?`export interface I_${outputDataTypeName} {
    ${outputKeyList.reduce((acc, outputKey) => {
        acc = acc + ` ${outputKey}: ${api.output[outputKey].type}${api.output[outputKey]?.required==false?"|undefined":""};`
        return acc
    }, "")}
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
        acc = acc + `${curVal.name}AsyncThunk,`
        return acc
    },'')
}} from './action';

import {${
    apiSection.apiList.reduce((acc, curVal) => {
        acc = acc + `${Object.keys(curVal.output).length>0?`I_${apiSection.name.toUpperCase()}_${curVal.name.toUpperCase()}_OUTPUT,${apiSection.name.toUpperCase()}_${curVal.name.toUpperCase()}_OUTPUT,`:""}`
        return acc
    },'')
}} from './data';
import { ApiStatus } from "src/data/common";
interface ${apiSection.name}State {
    ${apiSection.apiList.reduce((acc, curVal) => {
        acc = acc + `${curVal.name}Output: ${Object.keys(curVal.output).length>0?`I_${apiSection.name.toUpperCase()}_${curVal.name.toUpperCase()}_OUTPUT${curVal.isOutputArray?'[]':''}`:"any"},\n${curVal.name}Status: ApiStatus,\n${curVal.name}Error: string | null,\n`
        return acc
    },"")}
}

const initialState: ${apiSection.name}State = {
    ${apiSection.apiList.reduce((acc, curVal) => {
        acc = acc + `${curVal.name}Output: ${curVal.isOutputArray?'[]': Object.keys(curVal.output).length>0?`new ${apiSection.name.toUpperCase()}_${curVal.name.toUpperCase()}_OUTPUT().toJson()`:"null"},\n${curVal.name}Status: ApiStatus.Idle,\n${curVal.name}Error: null,\n`
        return acc
    },"")}
}

export const ${apiSection.name}Slice = createSlice({
    name: "${apiSection.name}",
    initialState,
    reducers: {
        reset${apiSection.name}Reducer: () => initialState
    }, 
    extraReducers: (builder) =>{
        builder.
        ${apiSection.apiList.reduce((acc, curVal,currentIndex) => {
                acc = acc + `addCase(${curVal.name}AsyncThunk.pending, state => {
                state.${curVal.name}Status= ApiStatus.Loading;
                state.${curVal.name}Error= null;
            })\n\t\t.addCase(${curVal.name}AsyncThunk.fulfilled,(state, action) => {
                state.${curVal.name}Status = ApiStatus.Success;
                state.${curVal.name}Output = action.payload;
                state.${curVal.name}Error = null;
            })\n\t\t.addCase(${curVal.name}AsyncThunk.rejected, (state, action) => {
                state.${curVal.name}Status = ApiStatus.Failed;
                state.${curVal.name}Output = ${curVal.isOutputArray?'[]': Object.keys(curVal.output).length>0?`new ${apiSection.name.toUpperCase()}_${curVal.name.toUpperCase()}_OUTPUT().toJson()`:"null"};
                state.${curVal.name}Error = action.payload as string;
                })\n\t\t${currentIndex<apiSection.apiList.length-1?'.':''}`
            return acc
        },"")}
    }
});
        
export const {reset${apiSection.name}Reducer} = ${apiSection.name}Slice.actions;
export default ${apiSection.name}Slice.reducer;
        `
        return code;
    }


    generateApiActioncode(apiSection: IApiSection) {
        const code = `
        import { createAsyncThunk } from "@reduxjs/toolkit";
        import axios, { AxiosError } from 'axios';
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

const showError = (err: AxiosError) => {
    const errorResponse: any = err.response?.data || {};
    if (err.response?.data) {
      if (typeof (err.response?.data) == "string") {
        return err.response?.data
      } else {
        return Object.keys(err.response?.data).reduce((acc, currVal) => {
          acc = acc + errorResponse[currVal];
          return acc;
        }, "")
      }
    }
    else {
      return err.message
    }
  }
        ${apiSection.apiList.reduce((acc, curVal) => {
            const inputKeyList = Object.keys(curVal.input);
            const outputKeyList = Object.keys(curVal.output);
            const inputDataTypeName: string = (`${apiSection.name}_${curVal.name}_Input`).toUpperCase();
            const outputDataTypeName: string = (`${apiSection.name}_${curVal.name}_Output`).toUpperCase();
            acc = acc + `
            export const ${curVal.name}AsyncThunk = createAsyncThunk('${apiSection.name}/${curVal.name}', async (${inputKeyList.length>0?`input: ${inputDataTypeName}`:`_`}, { rejectWithValue }) => {
                return ${curVal.name}Api(${inputKeyList.length>0?`input,`:''} output => {
                    return output
                  },error=> {
                    return rejectWithValue(error)
                  })
              })

              export const ${curVal.name}Api = async (${inputKeyList.length>0?`input: ${inputDataTypeName},`:``} output: (output: ${outputKeyList.length>0?curVal.isOutputArray?`${outputDataTypeName}[]`:outputDataTypeName:'any'}) => any,error: (errMsg: any) => void) => {
                try {
                  const { data } = await api.${curVal.type}('${this.getApiName(apiSection.name)}/${this.getApiName(curVal.name)}',${inputKeyList.length>0?`${curVal.type=='post'?'input':'{params: input.toJson()}'}`:''});
                  return output(data);
                } catch (err: any) {
                    return error(showError(err));
                }
              }
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