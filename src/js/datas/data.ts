export class ProjectData {
    name: string;
    constructor(name: string,) {
        this.name = name;
    }

    fromJSON(obj: any) {
        return new ProjectData(obj.name)
    }


    toJSON() {
        return {
            name: this.name
        }
    }
}