import { FieldType, ICollection, IDataBase } from "../interfaces/ICollection";
import GeneratorHelper from "./GeneratorHelper";
import Helper from './index';

export default class CollectionOperation {
    path: string = '';
    constructor() {
        GeneratorHelper.getSelectedNodeProjectPath((projectPath: string) => {
            console.log(projectPath)
            this.path = projectPath;
        })
    }

    get collectionPath() {
        return `${this.path}/src/models`;
    }

    get interfacePath() {
        return `${this.path}/src/data`;
    }


    buildCollectionCode(databaseList: IDataBase[]) {
        let interfaceCode = 'import {Schema} from "mongoose";\n';
        databaseList.forEach(database => {
            database.collectionList.forEach(collection => {
                interfaceCode = interfaceCode + this.generateCollectionInterfaceCode(collection,database.dbName);
                this.writeCollection(collection, database.dbName);

            });
        })

        this.writeInterfaceCode(interfaceCode);
        this.writeDatabaseFile(databaseList);
    }

    // createAndWriteCollectionCode(collection: ICollection) {
    //     this.writeCollection(collection);
    //     // this.writeInterfaceCode(collection);
    // }

    writeDatabaseFile(dbList: IDataBase[]) {
        const code = this.generateDatabaseCodeFile(dbList);
        GeneratorHelper.writeFile(this.collectionPath,'Database.ts',code);
    }

    writeCollection(collection: ICollection,dbName: string) {
        const collectionCode = this.generateCollectionCode(collection,dbName);
        const modelPath = `${this.collectionPath}/${dbName}`;
        const fileName = `${collection.name}.model.ts`
        GeneratorHelper.writeFile(modelPath, fileName, collectionCode);
    }

    writeInterfaceCode(code: string = '') {
        const interfacePath = `${this.interfacePath}`;
        GeneratorHelper.writeFile(interfacePath, "interfaces.ts", code);
    }




    generateCollectionCode(collection: ICollection,dbName: string) {
        const interfaceName: string = `I${collection.name}_${dbName}`;
        const code = `
import Database from '../Database';
import { Schema, model, connect, ObjectId } from 'mongoose';\n
import {${interfaceName}} from '../../data/interfaces';
const ${collection.name}Schema = new Schema<${interfaceName}>({
    ${collection.fields.reduce((acc: any, currVal) => {
            acc = acc + `${currVal.name}: {type: ${currVal.type} ${currVal.required?',required:true':''} ${currVal.index?",index:true":""}${currVal.unique?',unique:true':''}${currVal.ref?`,ref:"${currVal.ref}"`:''}},\n\t`;
            return acc;
        }, "")
            }
});

const ${collection.name} = Database.${dbName}Db.model<${interfaceName}>('${collection.name}', ${collection.name}Schema);

export default ${collection.name};
`
        return code;
    }


    generateCollectionInterfaceCode(collection: ICollection,dbName: string) {
        const code = `
        export interface I${collection.name}_${dbName} {
            ${collection.fields.reduce((acc: any, currVal) => {
            acc = acc + `${currVal.name}: ${currVal.type},\n\t\t\t`;
            return acc;
        }, "")
            }
        }
        `
        return code;
    }


    generateDatabaseCodeFile(dbList: IDataBase[]) {
        const code = `
import mongoose from "mongoose";

export default class Database {
${dbList.reduce((acc,db) => {
    acc = acc + `static ${db.dbName}Db = mongoose.connection.useDb('${ Helper.hyphenSepratedString(db.dbName)}'); \n`
    return acc;
},'')}
}
        `

        return code;
    }
}
