"use strict";

import type * as vscode from "vscode";
import * as azdata from "azdata";
import { ConnectionProvider } from "./providers/connectionProvider";
import { ObjectExplorerProvider } from "./providers/objectExplorerProvider";
import { AdminServicesProvider } from "./providers/adminServicesProvider";
import { QueryProvider } from "./providers/queryProvider";
import { MetadataProvider } from "./providers/metadataProvider";
import { ScriptingProvider } from "./providers/scriptingProvider";
import { CapabilitiesProvider } from "./providers/capabilitiesProvider";
import { ConnectionService } from "./connection/connectionService";

export function activate(context: vscode.ExtensionContext): void {
    const connection = new ConnectionService();

    azdata.dataprotocol.registerAdminServicesProvider(new AdminServicesProvider(connection));
    azdata.dataprotocol.registerCapabilitiesServiceProvider(new CapabilitiesProvider());
    azdata.dataprotocol.registerConnectionProvider(new ConnectionProvider(connection));
    azdata.dataprotocol.registerMetadataProvider(new MetadataProvider());
    azdata.dataprotocol.registerObjectExplorerProvider(new ObjectExplorerProvider(connection));
    azdata.dataprotocol.registerQueryProvider(new QueryProvider());
    azdata.dataprotocol.registerScriptingProvider(new ScriptingProvider());
}

export function deactivate(): void {
    // ignored
}
