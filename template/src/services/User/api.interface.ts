
import express from 'express';
;
import {USER_SIGNUP_INPUT,USER_LOGIN_INPUT,USER_GETUSERDETAILS_INPUT,} from './api.data';
export interface IUserApi {
    Signup(input: USER_SIGNUP_INPUT, res: express.Response):void
	Login(input: USER_LOGIN_INPUT, res: express.Response):void
	getUserDetails(input: USER_GETUSERDETAILS_INPUT, res: express.Response):void
	
}
