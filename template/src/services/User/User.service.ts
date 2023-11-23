
import express from 'express';

import { IUserApi } from './api.interface';

import { USER_SIGNUP_INPUT, USER_LOGIN_INPUT, } from './api.data';
import User from '../../models/User/User.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export default class UserService implements IUserApi {
    public async Signup(input: USER_SIGNUP_INPUT, res: express.Response) {
        try {
            const user = await this.findUserByEmail(input.emailId);
            if (user) {
                res.status(400).send("User allready registered")
            } else {
                const encryptedPassword = await bcrypt.hash(input.password.toString(), 10);
                const newUser = new User({
                    userName: input.userName,
                    emailId: input.emailId,
                    firstName: input.firstName,
                    lastName: input.lastName,
                    mobile: input.mobile,
                    password: encryptedPassword
                });
                await newUser.save();
                res.send({userName: newUser.userName})
                
            }
        } catch (e) {
            res.status(500).send("Error" + e);
        }
    }
    public async Login(input: USER_LOGIN_INPUT, res: express.Response) {
        const secretKey = process.env.JWT_SECRET_KEY || "vadhyan-admin"; 
        try {
            const user = await User.findOne({emailId: input.emailId});
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            const isPasswordValid = await bcrypt.compare(input.password.toString(),user.password.toString());

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            
            if(secretKey) {
            const token = await jwt.sign({id: user._id},secretKey);
            res.header('auth-token', token).json({ token });
            }
    
        } catch (e) {
            res.status(500).send("Error" + e);
        }
    }

    

    async findUserByEmail(email: string) {
        return User.findOne({
            emailId: email
        }).exec();
    }

}