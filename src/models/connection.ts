import * as azdata from "azdata";

export class Connection {
    host: string;
    database: string;
    port: number;
    username: string;
    password: string;

    constructor(connectionInfo: azdata.ConnectionInfo) {
        this.database = connectionInfo.options["dbname"] || "postgres";
        this.username = connectionInfo.options["user"];
        this.password = connectionInfo.options["password"];
        this.port = connectionInfo.options["port"] || 5432;
        this.host = connectionInfo.options["host"];
    }

    public getSessionId(): string {
        return `objectexplorer://${this.username}@${this.host}:${this.port}:${this.database}/`;
    }

    public getMaintenenceDb(): string {
        return this.database;
    }

    public getUrnBase(): string {
        return `//${this.username}@${this.host}:${this.port}/`;
    }
}
