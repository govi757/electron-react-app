import { GFieldSchema } from "../FormSchema";
import { Rules } from "../rules";
import GRichTextField from "./GRichTextField";

export default class GRichTextFieldSchema implements GFieldSchema {
    component = GRichTextField;
    dataSelectorKey: string;
    name: string;
    boundaryClass?: string;
    rules?: Rules[];
    constructor(props: {
        dataSelectorKey: string;
        name: string;
        boundaryClass?: string;
        rules?: Rules[];
    }) {
        this.dataSelectorKey = props.dataSelectorKey;
        this.name = props.name;
        this.boundaryClass = props.boundaryClass;
        this.rules = props.rules;
    }
}