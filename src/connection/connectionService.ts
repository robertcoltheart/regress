import { Client } from "pg";
import { ConnectionInfo } from "./connectionInfo";
import { type ConnectionType } from "./connectionType";
import { type ConnectionDetails } from "./connectionDetails";

export class ConnectionService {
    private readonly connections = new Map<string, ConnectionInfo>();

    public async connect(
        ownerUri: string,
        connectionType: ConnectionType,
        details: ConnectionDetails
    ): Promise<Client> {
        let info = this.connections.get(ownerUri);

        if (info === undefined) {
            info = new ConnectionInfo();

            this.connections.set(ownerUri, info);
        } else {
            await this.closeConnections(info);
        }

        const client = new Client({
            host: details.host,
            database: details.database,
            port: details.port,
            user: details.username,
            password: details.password
        });

        await client.connect();

        info.addConnection(connectionType, client);

        return client;
    }

    public async disconnect(ownerUri: string, connectionType: ConnectionType): Promise<boolean> {
        const info = this.connections.get(ownerUri);

        if (info === undefined) {
            return false;
        }

        return await this.closeConnections(info, connectionType);
    }

    public getConnection(ownerUri: string, connectionType: ConnectionType): Client | undefined {
        const info = this.connections.get(ownerUri);

        if (info === undefined) {
            throw new Error("No connection associated with given owner URI");
        }

        return info.getConnection(connectionType);
    }

    private async closeConnections(connectionInfo: ConnectionInfo, connectionType?: ConnectionType): Promise<boolean> {
        if (connectionType === undefined) {
            let closed = false;

            for (const client of connectionInfo.getAllConnections()) {
                await client.end();

                closed = true;
            }

            if (!closed) {
                return false;
            }

            connectionInfo.removeAllConnections();
        } else {
            const client = connectionInfo.getConnection(connectionType);

            if (client === undefined) {
                return false;
            }

            await client.end();

            connectionInfo.removeConnection(connectionType);
        }

        return true;
    }
}
