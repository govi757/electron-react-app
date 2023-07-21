export interface IApi {
    name: string;
    type: ApiType;
    input: any;
    output?: any;
}

export interface IApiSection {
    name: string;
    apiList: IApi[]
}

export enum ApiType {
    Get="get",
    Post="post",
    Put="put"
}

export enum DataTypes {
    String="string",
    Number="number",
    Object="object",
    Date="date",
    Any="any",

}