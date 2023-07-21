export interface ICollection {
    name: string,
    fields: Field[]
}

export interface Field {
    name: string,
    required?: boolean,
    type: any
}

export enum FieldType {
    String="String",
    Number="Number",
    Date="Date",
    Object="Object"
}


