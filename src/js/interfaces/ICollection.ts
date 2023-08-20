export interface IDataBase {
    dbName: string;
    collectionList: ICollection[];
}

export interface ICollection {
    name: string,
    fields: Field[]
}



export interface Field {
    name: string,
    required?: boolean,
    type: any,
    index?: boolean,
    unique?: boolean
}

export enum FieldType {
    String="String",
    Number="Number",
    Date="Date",
    Object="Object",
    StringArray="[String]"
}


