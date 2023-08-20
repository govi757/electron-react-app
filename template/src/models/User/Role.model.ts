
import Database from '../Database';
import { Schema, model, connect, ObjectId } from 'mongoose';

import {IRole_User} from '../../data/interfaces';
const RoleSchema = new Schema<IRole_User>({
    name: {type: String,},
	description: {type: String,},
	
});

const Role = Database.UserDb.model<IRole_User>('Role', RoleSchema);

export default Role;
