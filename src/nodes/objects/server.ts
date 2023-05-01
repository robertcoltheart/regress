import { NodeCollection } from "../nodeCollection";
import { NodeObject } from "../nodeObject";
import { Database } from "./database";

export class Server extends NodeObject {
    public readonly databases = new NodeCollection<Database>(this, Database.scripter);

    constructor(public id: string, public name: string) {
        super();

        this.registerChildCollection(this.databases);
    }
}
