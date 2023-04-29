import type * as azdata from "azdata";

export class ConnectionDetails {
    constructor(
        public host: string,
        public database: string,
        public port: number,
        public username: string,
        public password: string
    ) {}

    public static clone(value: ConnectionDetails, database: string): ConnectionDetails {
        return new ConnectionDetails(value.host, database, value.port, value.username, value.password);
    }

    public static create(value: azdata.ConnectionInfo): ConnectionDetails {
        return new ConnectionDetails(
            value.options.host,
            value.options.database ?? "postgres",
            value.options.port ?? 5432,
            value.options.user,
            value.options.password
        );
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
