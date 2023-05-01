import { type Client } from "pg";
import { NodeCollection } from "../nodeCollection";
import { NodeObject } from "../nodeObject";
import { Database } from "./database";

export class Server extends NodeObject {
    public readonly databases = new NodeCollection<Database>(this, Database.scripter);

    maintenanceDbName?: string;

    constructor(
        public id: string,
        public name: string,
        public connectionFactory: (database: string) => Promise<Client>,
        public client: Client
    ) {
        super();

        this.maintenanceDbName = client.database;

        this.registerCollection(this.databases);
    }

    public async getConnection(): Promise<Client> {
        return this.client;
    }
}
