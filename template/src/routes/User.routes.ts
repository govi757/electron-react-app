
    import { CommonRoutesConfig } from './common/common.routes.config';
    import UserService from '../services/User/User.service';
    import express from 'express';

    import {USER_SIGNUP_INPUT,USER_LOGIN_INPUT,} from '../services/User/api.data';
import verifyToken from '../middlewares/auth';

    export default class UserRoutes extends CommonRoutesConfig {
        constructor(app: express.Application) {
            super(app, 'UserRoutes');
        }
        UserService = new UserService();

        configureRoutes(): express.Application {

            
                    this.app.route('/user/signup').post(async (req: express.Request, res: express.Response) => {
                        const input: USER_SIGNUP_INPUT = USER_SIGNUP_INPUT.fromJSON(req.body);
                        const defaultPreCondition = input.checkDefaultPreCondition();
                        if(defaultPreCondition.isValid) {
                        this.UserService.Signup(input, res);
                        } else {
                            res.status(412).send(defaultPreCondition.errorBody)
                        }
                    });
                    this.app.route('/user/login').post(async (req: express.Request, res: express.Response) => {
                        const input: USER_LOGIN_INPUT = USER_LOGIN_INPUT.fromJSON(req.body);
                        const defaultPreCondition = input.checkDefaultPreCondition();
                        if(defaultPreCondition.isValid) {
                        this.UserService.Login(input, res);
                        } else {
                            res.status(412).send(defaultPreCondition.errorBody)
                        }
                    });
                    

            return this.app;
        }
    }
    