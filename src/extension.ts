"use strict";

import * as vscode from "vscode";
import * as azdata from "azdata";
import { ConnectionProvider } from "./providers/connectionProvider";
import { ObjectExplorerProvider } from "./providers/objectExplorerProvider";
import { AdminServicesProvider } from "./providers/adminServicesProvider";
import { QueryProvider } from "./providers/queryProvider";
import { MetadataProvider } from "./providers/metadataProvider";
import { ScriptingProvider } from "./providers/scriptingProvider";
import { CapabilitiesProvider } from "./providers/capabilitiesProvider";
import { ConnectionService } from "./connection/connectionService";
// import { CompletionItemProvider } from "./providers/languageProvider";
import { BackupProvider } from "./providers/backupProvider";
import { RestoreProvider } from "./providers/restoreProvider";
// import { DocumentFormattingEditProvider } from "./providers/documentFormattingEditProvider";
// import { DocumentRangeFormattingEditProvider } from "./providers/documentRangeFormattingEditProvider";
// import { DefinitionProvider } from "./providers/definitionProvider";
import { LanguageService } from "./language/languageService";

export function activate(context: vscode.ExtensionContext): void {
    const connection = new ConnectionService();
    const language = new LanguageService();

    // const filter: vscode.DocumentFilter[] = [{ scheme: "untitled", language: "*" }];

    azdata.dataprotocol.registerAdminServicesProvider(new AdminServicesProvider(connection));
    azdata.dataprotocol.registerCapabilitiesServiceProvider(new CapabilitiesProvider());
    azdata.dataprotocol.registerConnectionProvider(new ConnectionProvider(connection));
    azdata.dataprotocol.registerBackupProvider(new BackupProvider());
    azdata.dataprotocol.registerRestoreProvider(new RestoreProvider());
    // vscode.languages.registerCompletionItemProvider(filter, new CompletionItemProvider());
    // vscode.languages.registerDocumentFormattingEditProvider(filter, new DocumentFormattingEditProvider());
    // vscode.languages.registerDocumentRangeFormattingEditProvider(filter, new DocumentRangeFormattingEditProvider());
    // vscode.languages.registerDefinitionProvider(filter, new DefinitionProvider());
    azdata.dataprotocol.registerMetadataProvider(new MetadataProvider(connection));
    azdata.dataprotocol.registerObjectExplorerProvider(new ObjectExplorerProvider(connection));
    azdata.dataprotocol.registerQueryProvider(new QueryProvider());
    azdata.dataprotocol.registerScriptingProvider(new ScriptingProvider(connection));

    azdata.dataprotocol.onDidChangeLanguageFlavor((x) => {
        language.addLanguageFlavor(x);
    });
    vscode.workspace.onDidOpenTextDocument((x) => {});
    vscode.workspace.onDidCloseTextDocument((x) => {});
    vscode.workspace.onDidChangeTextDocument((x) => {});
    // vscode.tasks.registerTaskProvider("");
}

export function deactivate(): void {}
