'use strict';

import * as vscode from 'vscode';
import * as azdata from 'azdata';
import { ConnectionProvider } from './providers/connectionProvider';
import { IconProvider } from './providers/iconProvider';
import { ObjectExplorerProvider } from './providers/objectExplorerProvider';
import { AppContext } from './appContext';

let appContext: AppContext;

export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "regress" is now active!');

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
    const objectExplorerProvider = new ObjectExplorerProvider();

    azdata.dataprotocol.registerConnectionProvider(connectionProvider);
    azdata.dataprotocol.registerIconProvider(iconProvider);
    azdata.dataprotocol.registerObjectExplorerProvider(objectExplorerProvider);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
