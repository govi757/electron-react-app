

export class User {

    constructor(
        public userName: string = '',) {
    }

    static fromJSON(jsonObj: any) {
        return new User(

            jsonObj?.userName,
        )
    }

    public toJson(): object {
        return {

            name: this.userName != null ? this.userName : undefined,
        }
    }

}

