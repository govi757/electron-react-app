import express from 'express';
import * as http from 'http';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import debug from 'debug';

import bodyParser, {json, urlencoded} from 'body-parser';
import mongoose from 'mongoose';
import { CommonRoutesConfig } from './routes/common/common.routes.config';
import dotenv from "dotenv";

const app: express.Application = express();

const port = 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');
app.use((err: any, req:express.Request, res:express.Response, next:any) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  });
app.use(express.json());

app.use(cors());
app.use(urlencoded());
app.use(json());
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
mongoose.set('strictQuery', false);

const runningMessage = `Server running ats http://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
    
    res.send("Hello World")
});


const server: http.Server = http.createServer(app);


server.listen(port, () => {
    if(process.env.MONGO_DB_URL) {
    mongoose.connect(process.env.MONGO_DB_URL).then(mongoConnection => {
        console.log("Succesfully connected to the data base",routes)
    })
    }
    console.log(runningMessage);
    routes.forEach((route: CommonRoutesConfig) => {
        
    });
    // our only exception to avoiding console.log(), because we
    // always want to know when the server is done starting up
    
});