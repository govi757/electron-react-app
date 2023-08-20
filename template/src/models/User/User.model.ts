
import Database from '../Database';
import { Schema, model, connect, ObjectId } from 'mongoose';

import {IUser_User} from '../../data/interfaces';
const UserSchema = new Schema<IUser_User>({
    userName: {type: String,},
	emailId: {type: String,},
	password: {type: String,},
	mobile: {type: String,},
	firstName: {type: String,},
	lastName: {type: String,},
	
});

const User = Database.UserDb.model<IUser_User>('User', UserSchema);

export default User;
