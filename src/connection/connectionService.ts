import { Client } from "pg";
import { ConnectionInfo } from "./connectionInfo";
import { type ConnectionType } from "./connectionType";
import { type ConnectionDetails } from "./connectionDetails";
import { CancellationTokenSource } from "vscode";
import AsyncLock from "async-lock";

export class ConnectionService {
    private readonly connections = new Map<string, ConnectionInfo>();

    private readonly connectionCancellation = new Map<[string, ConnectionType], CancellationTokenSource>();

    private readonly lock = new AsyncLock();

    public async connect(
        ownerUri: string,
        connectionType: ConnectionType,
        details: ConnectionDetails
    ): Promise<Client | undefined> {
        let info = this.connections.get(ownerUri);

        if (info === undefined || !info.details.equals(details)) {
            if (info !== undefined) {
                await this.closeConnections(info);
            }

            info = new ConnectionInfo(details);
            this.connections.set(ownerUri, info);
        }

        let client = info.getConnection(connectionType);

        if (client != null) {
            return client;
        }

        const cancellationKey: [string, ConnectionType] = [ownerUri, connectionType];
        const cancellationSource = new CancellationTokenSource();

        this.lock.acquire(
            "connect",
            () => {
                const token = this.connectionCancellation.get(cancellationKey);

                if (token != null) {
                    token.cancel();
                }

                this.connectionCancellation.set(cancellationKey, cancellationSource);
            },
            () => {}
        );

        try {
            client = new Client({
                host: details.host,
                database: details.database,
                port: details.port,
                user: details.username,
                password: details.password
            });

            await client.connect();
        } finally {
            this.lock.acquire(
                "connect",
                () => {
                    const token = this.connectionCancellation.get(cancellationKey);

                    if (token != null && token === cancellationSource) {
                        this.connectionCancellation.delete(cancellationKey);
                    }
                },
                () => {}
            );
        }

        if (cancellationSource.token.isCancellationRequested) {
            await client.end();

            return undefined;
        }

        info.addConnection(connectionType, client);

        return client;
    }

    public async cancelConnect(ownerUri: string, connectionType: ConnectionType): Promise<boolean> {
        const cancellationKey: [string, ConnectionType] = [ownerUri, connectionType];

        this.lock.acquire(
            "connect",
            () => {
                const token = this.connectionCancellation.get(cancellationKey);

                if (token != null) {
                    token.cancel();

                    return true;
                }
            },
            () => {}
        );

        return false;
    }

    public async disconnect(ownerUri: string, connectionType: ConnectionType): Promise<boolean> {
        const info = this.connections.get(ownerUri);

        if (info === undefined) {
            return false;
        }

        return await this.closeConnections(info, connectionType);
    }

    public getConnectionInfo(ownerUri: string): ConnectionInfo | undefined {
        return this.connections.get(ownerUri);
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
