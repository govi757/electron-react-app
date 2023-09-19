export interface IData {
    name: string,
    fields: Field[]
}

export interface Field {
    name: string,
    type: any,
    required?: boolean,
}

