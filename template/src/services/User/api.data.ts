
        
export class USER_SIGNUP_INPUT {
    userName: string;emailId: string;password: string;firstName: string;lastName: string;mobile: string;
    constructor(userName: string,emailId: string,password: string,firstName: string,lastName: string,mobile: string,) {
                this.userName= userName;this.emailId= emailId;this.password= password;this.firstName= firstName;this.lastName= lastName;this.mobile= mobile;
    }

    static fromJSON(jsonObj: any) {
        return new USER_SIGNUP_INPUT(
            jsonObj?.userName,jsonObj?.emailId,jsonObj?.password,jsonObj?.firstName,jsonObj?.lastName,jsonObj?.mobile,
        )    
    }

    checkDefaultPreCondition() {
        const error: any = {};
        if(!this.userName) {
                error['userName']="userName is required"
             }if(!this.emailId) {
                error['emailId']="emailId is required"
             }
        return {
            isValid: Object.keys(error).length==0,
            errorBody: error
        }
    }
}
                
export class USER_LOGIN_INPUT {
    emailId: string;password: string;
    constructor(emailId: string,password: string,) {
                this.emailId= emailId;this.password= password;
    }

    static fromJSON(jsonObj: any) {
        return new USER_LOGIN_INPUT(
            jsonObj?.emailId,jsonObj?.password,
        )    
    }

    checkDefaultPreCondition() {
        const error: any = {};
        if(!this.emailId) {
                error['emailId']="emailId is required"
             }if(!this.password) {
                error['password']="password is required"
             }
        return {
            isValid: Object.keys(error).length==0,
            errorBody: error
        }
    }
}
                
export class USER_GETUSERDETAILS_INPUT {
    emailId: string;
    constructor(emailId: string,) {
                this.emailId= emailId;
    }

    static fromJSON(jsonObj: any) {
        return new USER_GETUSERDETAILS_INPUT(
            jsonObj?.emailId,
        )    
    }

    checkDefaultPreCondition() {
        const error: any = {};
        if(!this.emailId) {
                error['emailId']="emailId is required"
             }
        return {
            isValid: Object.keys(error).length==0,
            errorBody: error
        }
    }
}
                
        