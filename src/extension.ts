'use strict';

import * as vscode from 'vscode';
import * as azdata from 'azdata';
import { ConnectionProvider } from './providers/connectionProvider';
import { IconProvider } from './providers/iconProvider';
import { ObjectExplorerProvider } from './providers/objectExplorerProvider';
import { AppContext } from './appContext';
import { AdminServicesProvider } from './providers/adminServicesProvider';
import { QueryProvider } from './providers/queryProvider';

let appContext: AppContext;

export function activate(context: vscode.ExtensionContext) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    context.subscriptions.push(vscode.commands.registerCommand('regress.helloWorld', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    }));

    context.subscriptions.push(vscode.commands.registerCommand('regress.showCurrentConnection', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        azdata.connection.getCurrentConnection().then(connection => {
            let connectionId = connection ? connection.connectionId : 'No connection found!';
            vscode.window.showInformationMessage(connectionId);
        }, error => {
             console.info(error);
        });
    }));

    appContext = new AppContext();

    const connectionProvider = new ConnectionProvider(appContext);
    const iconProvider = new IconProvider();
    const objectExplorerProvider = new ObjectExplorerProvider(appContext);
    const adminServicesProvider = new AdminServicesProvider();
    const queryProvider = new QueryProvider();

    azdata.dataprotocol.registerConnectionProvider(connectionProvider);
    azdata.dataprotocol.registerIconProvider(iconProvider);
    azdata.dataprotocol.registerObjectExplorerProvider(objectExplorerProvider);
    azdata.dataprotocol.registerAdminServicesProvider(adminServicesProvider);
    azdata.dataprotocol.registerQueryProvider(queryProvider);
}

export function deactivate() {
}
