import { normalDataTypes } from "../datas/constants";
import { ApiType, IApi, IApiSection } from "../interfaces/IApi";
import { IFrontEnd, ILayout, IScreen } from "../interfaces/IGeneral";
import GeneratorHelper from "./GeneratorHelper";


export default class FrontEndScreenOperation {
    frontEndPathList: string[] = [];
    constructor() {
        GeneratorHelper.getFrontEndPathList((projectPathList: string[]) => {
            this.frontEndPathList = projectPathList;
        });

    }

    static buildFrontEnd(frontEndList:IFrontEnd[]) {
        
        frontEndList.forEach(frontEnd => {
            this.buildScreens(frontEnd);
           this.buildLayouts(frontEnd);
           this.buildRouter(frontEnd);   
        })
        
    }
    
    static buildRouter(frontEnd:IFrontEnd) {
        const projectPath = GeneratorHelper.getProjectPath();
        const path = `${projectPath}/frontend/${frontEnd.name}/src/router`;
        let innerRouterCode = ``;
            this.generateRouterImportCode(frontEnd)
            
            frontEnd.layout.forEach(frontEndLayout => {
                innerRouterCode = innerRouterCode + `{
                    element: ${`<${frontEndLayout.name}Layout/>`},
                    path:"${frontEndLayout.route}",
                    ${frontEndLayout.children?`
                    children: ${this.generateRouterCode(frontEndLayout.children)}
                    `:``}
                },`    
            });

            const routerCode = `
            import { createBrowserRouter, } from "react-router-dom";
            ${this.generateRouterImportCode(frontEnd)}
            const router = createBrowserRouter([
                ${innerRouterCode}
            ],{
                basename:"/${frontEnd.name.toLowerCase()}"
            })

            export default router;
            export const RouterConstant = ${this.generateRouterConstant(frontEnd.layout)}

            `


        GeneratorHelper.writeFile(path, `genRouter.tsx`,`
${routerCode}
`)
    }

    static buildLayouts(frontEnd: IFrontEnd) {
        const projectPath = GeneratorHelper.getProjectPath();
        const path = `${projectPath}/frontend/${frontEnd.name}/src/layout`;
        frontEnd.layout.forEach(lo => {
            this.traverseChildrenAndCreateLayout(path,lo);
            GeneratorHelper.createFile(path, `${lo.name}Layout.tsx`,`
${this.generateLayoutCode(lo)}
`)
        })
    }

    

    static traverseChildrenAndCreateLayout(path: string,lo: ILayout) {
        lo.children.forEach(loChild => {
            if(loChild.children) {
                GeneratorHelper.createFile(path, `${loChild.name}Layout.tsx`,`
${this.generateLayoutCode(loChild)}
`)
                this.traverseChildrenAndCreateLayout(path,loChild)
            }
        })
    }



    static traverseChildrenAndGenerateRouter(path: string,lo: ILayout) {
        let routerCode = ``;
        lo.children.forEach(loChild => {
            if(loChild.children) {

routerCode = routerCode + `{
path: ${loChild.route},
element: <${loChild.element} />
}
`
                this.traverseChildrenAndGenerateRouter(path,loChild)
            }
        })
    }

    static buildScreens(frontEnd: IFrontEnd) {
        const projectPath = GeneratorHelper.getProjectPath();
        frontEnd.screenList.forEach(screen => {
            const path = `${projectPath}/frontend/${frontEnd.name}/src/view/${screen.path}`;
            GeneratorHelper.createFile(path, `${screen.name}.tsx`,`
import React from "react";
const ${screen.name} = () => {
return(
    <div>
    ${screen.name}
    </div>
)
}

export default ${screen.name};
`
)
        })
    }


    static generateLayoutCode(lo: ILayout) {
        return (
            `
import { Outlet } from "react-router-dom"
const ${lo.name}Layout = () => {
        return (
        <div>
            ${lo.name}Layout
            <Outlet />
        </div>
        )
}

export default ${lo.name}Layout;
`
        )
    }


    static generateRouterCode(children: ILayout[]) {
        const modifiedString = JSON.stringify(this.generateRouterObject(children)).replace(/"element":"(.*?)"/g, (match, p1) => `"element":${p1}`);
        console.log(this.generateRouterConstant(children),"Router constant..........................")
        return modifiedString;
    }

    static generateRouterImportCode(frontEnd: IFrontEnd) {
        let importCode = ``;
        let flatenedArray: ILayout[] = [];
        let uniqueElements: any[] = [];
        generateFlattenedArray(frontEnd.layout);
        
        function generateFlattenedArray(children: ILayout[]) {
            
            children.forEach(child => {
                flatenedArray.push(child);
                if(child.children) {
                    generateFlattenedArray(child.children);
                } else {
                    if(!uniqueElements.includes(child.element)) {
                        uniqueElements.push(child.element);
                    } else {
                        flatenedArray.pop();
                    }
                }
            })
        }

        return flatenedArray.reduce((acc,currVal) => {
            acc = acc + `
            ${currVal.children?`
            import ${currVal.name}Layout from 'src/layout/${currVal.name}Layout';\n
            `:`
            import ${currVal.element} from 'src/view/${this.findScreenPath(frontEnd.screenList,(currVal?.element||""))}/${currVal.element}';\n
            `}
            `
            return acc;
        },'')
    }

    static findScreenPath(screenList: IScreen[],screenName: string) {
        const index = screenList.findIndex(screen => screen.name === screenName);
        if(screenList[index]) {
        return screenList[index].path;
        } else {
            alert(`${screenName} not found`)
        }
    }

    static generateRouterObject(children: ILayout[]) {
        return children.map(child => {
            const route: any = {
                path: child.route,
                element: `${child.children?`<${child.name}Layout />`:`<${child.element} />`} `,
            };
            if(child.children) {
                route.children = this.generateRouterObject(child.children);
            }
            return route;
        })
    }

    static generateRouterConstant(children: ILayout[]) {
        let path = '';
        const routeObj = generateRouterConstantObj(children);
        function generateRouterConstantObj(children: ILayout[]): any {
            
        return children.reduce((acc: any,child: any,index: number) => {
            if(child.children) {
                // path = path+"/"+child.route;
                console.log(path,"PAth in layout")
                path = child.route&&child.route!=""&&child.route!="/"?path+"/"+child.route:path;
                acc[child.name] = generateRouterConstantObj(child.children);
                console.log(child.name,"path")
            } else {
                path = child.route&&child.route!=""&&child.route!="/"?path+"/"+child.route:path;
                acc[child.name] = path;
                console.log(path,"Path..............Path")
                const pathNumToBeRemoved = child.route.split("/").length;
                    path = path.split("/").slice(0,-pathNumToBeRemoved).join('/').toString();
                
                if(index==children.length-1) {
                    path = path.split("/").slice(0,-1).join('/').toString();
                    // const pathNumToBeRemoved = child.route.split("/").length;
                    // path = path.split("/").slice(0,-pathNumToBeRemoved).join('/').toString();
                }
                
            }
            
            return acc;
        },{})
    }

    return JSON.stringify(routeObj);
}
}