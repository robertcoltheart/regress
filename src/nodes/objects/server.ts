import { type Client } from "pg";
import { NodeCollection } from "../nodeCollection";
import { NodeObject } from "../nodeObject";
import { Database } from "./database";
import { Role } from "./role";
import { Tablespace } from "./tablespace";

export class Server extends NodeObject {
    public readonly databases = new NodeCollection<Database>(this, Database.scripter);

    public readonly roles = new NodeCollection<Role>(this, Role.scripter);

    public readonly tablespaces = new NodeCollection<Tablespace>(this, Tablespace.scripter);

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
