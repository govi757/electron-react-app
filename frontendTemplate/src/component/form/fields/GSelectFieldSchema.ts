import { GFieldSchema } from "../FormSchema";
import { Rules } from "../rules";
import GRichTextField from "./GRichTextField";
import GSelectField from "./GSelectField";

export default class GSelectFieldSchema implements GFieldSchema {
    component = GSelectField;
    dataSelectorKey: string;
    name: string;
    boundaryClass?: string;
    rules?: Rules[];
    props: any;
    // options: any[];
    // optionText?: string;
    // optionValue?: string;
    constructor(props: {
        dataSelectorKey: string;
        name: string;
        boundaryClass?: string;
        rules?: Rules[];
        options: any[];
        optionText?: string;
        optionValue?: string;
    }) {
        this.dataSelectorKey = props.dataSelectorKey;
        this.name = props.name;
        this.boundaryClass = props.boundaryClass;
        this.rules = props.rules;
        this.props = {
            name: props.name,
            optionValue: props.optionValue,
            options: props.options,
            optionText: props.optionText,
            
        }
        // this.options = props.options;
        // this.optionText = props.optionText;
        // this.optionValue = props.optionValue;
    }

  
}