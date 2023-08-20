
import mongoose from "mongoose";

export default class Database {
static UserDb = mongoose.connection.useDb('user'); 

}
        