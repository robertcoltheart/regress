'use strict';

import * as vscode from 'vscode';
import * as azdata from 'azdata';
import { ConnectionProvider } from './providers/connectionProvider';
import { ObjectExplorerProvider } from './providers/objectExplorerProvider';
import { AppContext } from './appContext';
import { AdminServicesProvider } from './providers/adminServicesProvider';
import { QueryProvider } from './providers/queryProvider';
import { MetadataProvider } from './providers/metadataProvider';
import { ScriptingProvider } from './providers/scriptingProvider';
import { CapabilitiesProvider } from './providers/capabilitiesProvider';

let appContext: AppContext;

export function activate(context: vscode.ExtensionContext) {
    appContext = new AppContext();

    azdata.dataprotocol.registerAdminServicesProvider(new AdminServicesProvider(appContext));
    azdata.dataprotocol.registerCapabilitiesServiceProvider(new CapabilitiesProvider());
    azdata.dataprotocol.registerConnectionProvider(new ConnectionProvider(appContext));
    azdata.dataprotocol.registerMetadataProvider(new MetadataProvider(appContext));
    azdata.dataprotocol.registerObjectExplorerProvider(new ObjectExplorerProvider(appContext));
    azdata.dataprotocol.registerQueryProvider(new QueryProvider());
    azdata.dataprotocol.registerScriptingProvider(new ScriptingProvider());
}

export function deactivate() {
    // ignored
}
