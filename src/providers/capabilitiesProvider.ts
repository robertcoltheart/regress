import * as azdata from "azdata";
import * as vscode from "vscode";

export class CapabilitiesProvider implements azdata.CapabilitiesProvider {
    handle?: number | undefined;
    providerId = "regress";

    getServerCapabilities(client: azdata.DataProtocolClientCapabilities): Promise<azdata.DataProtocolServerCapabilities> {
        return Promise.resolve({
            protocolVersion: "1.0",
            providerName: "regress",
            providerDisplayName: "PostgreSQL (Regress)",
            connectionProvider: {
                options: [
                    {
                        name: "host",
                        displayName: "Server name",
                        description: "Name of the PostgreSQL instance",
                        valueType: azdata.ServiceOptionType.string,
                        specialValueType: azdata.ConnectionOptionSpecialType.serverName,
                        isIdentity: true,
                        isRequired: true,
                        groupName: "Source",
                        defaultValue: "",
                        categoryValues: []
                    }
                ]
            },
            adminServicesProvider: {
                databaseFileInfoOptions: [],
                databaseInfoOptions: [],
                fileGroupInfoOptions: []
            },
            features: []
        });
    }
}
