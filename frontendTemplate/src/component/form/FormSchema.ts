import { Rules } from "./rules";

export class FormSchema {

    fieldList: GFieldSchema[] = [];
    actionList: GActionSchema[] = [];

    constructor() {
        
    }

    addField(field:GFieldSchema ) {
        this.fieldList.push(field);
        return this;
    }

    addAction(action: GActionSchema) {
        this.actionList.push(action);
        return this;
    }


    getFormJson() {
        return {
            fieldList: this.fieldList,
            actionList: this.actionList
        }
    }
}


export interface GFieldSchema {
    component: React.ElementType;
    name: string;
    dataSelectorKey: string;
    props?: any;
    rules?: Rules[];
    boundaryClass?: string
}

export interface GActionSchema {
    name: string;
    onClick: () => void;
    component: React.ElementType;
    validate?: boolean;
    boundaryClass?: string;
    props?:any;
}
