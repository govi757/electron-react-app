import { ReactElement } from "react"

export class FormSchema {
    component: ReactElement;

    constructor(props: {component: ReactElement}) {
        this.component = props.component;
    }

    getFormJson() {
        return {
            component: this.component
        }
    }
}