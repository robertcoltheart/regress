import { type Client } from "pg";
import { type ConnectionType } from "./connectionType";

export class ConnectionInfo {
    private readonly connections = new Map<ConnectionType, Client>();

    public getConnection(connectionType: ConnectionType): Client | undefined {
        return this.connections.get(connectionType);
    }

    public getAllConnections(): IterableIterator<Client> {
        return this.connections.values();
    }

    public addConnection(connectionType: ConnectionType, client: Client): void {
        this.connections.set(connectionType, client);
    }

    public removeConnection(connectionType: ConnectionType): void {
        this.connections.delete(connectionType);
    }

    public removeAllConnections(): void {
        this.connections.clear();
    }

    public hasConnection(connectionType: ConnectionType): boolean {
        return this.connections.has(connectionType);
    }
}
