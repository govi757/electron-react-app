import { MutableRefObject, Ref, RefObject } from "react";
import { NormalCell } from "./cell/NormalCell";

export default class GTableSchema {

    columnList: GColumnSchema[] = [];
    actionList: GActionSchema[] = [];
    filterList: GFilterSchema[] = [];
    title?: string;
    itemKey?: string;
    ref?: MutableRefObject<any>;
    constructor(props: {title?: string;itemKey?: string;ref?: MutableRefObject<any>;}) {
        this.title = props.title
        this.itemKey = props.itemKey;
        this.ref = props.ref;
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

    addAction(action: GActionSchema) {
        this.actionList.push(action);
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

export interface GActionSchema {
    label: string;
    type:ActionType;
    onClick: (item: any) => void;
    singleSelect?: boolean;
}

export enum FilterType {
    Boolean="Boolean",
    Array="Array"
}

export enum ActionType {
    Add="Add",
    Others="Others",
    Edit="Edit"
}