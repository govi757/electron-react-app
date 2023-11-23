import { NormalCell } from "./cell/NormalCell";

export default class GTableSchema {

    columnList: GColumnSchema[] = [];
    

    constructor() {
        
    }

    addColumn(field:{
        component?: React.ElementType;
        name: string;
        dataSelectorKey: string;
        props?: any;
        boundaryClass?: string
    } ) {
        let columnField: GColumnSchema = {
            component : field.component || NormalCell,
            name :field.name,
            dataSelectorKey: field.dataSelectorKey,
            boundaryClass: field.boundaryClass,
            props: field.props
        };
        this.columnList.push(columnField);
        return this;
    }

}

export interface GColumnSchema {
    component: React.ElementType;
    name: string;
    dataSelectorKey: string;
    props?: any;
    boundaryClass?: string
}