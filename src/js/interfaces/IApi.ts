export interface IApi {
    name: string;
    type: ApiType;
    input: any;
    output?: any;
    testData?: any;
    testResponse?: ApiResponse;
    authenticated?: boolean;
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
    StringArray="string[]",
    ObjectArray="string[]",
    AnyArray="any[]",

}

export interface ApiResponse {
    status: any;
    body: any;
}