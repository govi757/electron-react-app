import { NormalCell } from "./cell/NormalCell";

export default class GTableSchema {

    columnList: GColumnSchema[] = [];
    filterList: GFilterSchema[] = [];
    title?: string;
    constructor(props: {title?: string}) {
        this.title = props.title
    }

    addColumn(field: {
        component?: React.ElementType;
        name: string;
        dataSelectorKey: string;
        props?: any;
        boundaryClass?: string
    }) {
        let columnField: GColumnSchema = {
            component: field.component || NormalCell,
            name: field.name,
            dataSelectorKey: field.dataSelectorKey,
            boundaryClass: field.boundaryClass,
            props: field.props
        };
        this.columnList.push(columnField);
        return this;
    }

    addFilter(filter: GFilterSchema) {
        this.filterList.push(filter);
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

export interface GFilterSchema {
    label: string;
    dataSelectorKey: string;
    filterItemList: any[];
    filterName?: string;
    filterValue?: string;
    value?:any ;
    type?: FilterType
}

export enum FilterType {
    Boolean="Boolean",
    Array="Array"
}