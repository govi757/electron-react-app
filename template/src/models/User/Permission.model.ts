
import Database from '../Database';
import { Schema, model, connect, ObjectId } from 'mongoose';

import {IPermission_User} from '../../data/interfaces';
const PermissionSchema = new Schema<IPermission_User>({
    name: {type: String,},
	description: {type: String,},
	
});

const Permission = Database.UserDb.model<IPermission_User>('Permission', PermissionSchema);

export default Permission;
