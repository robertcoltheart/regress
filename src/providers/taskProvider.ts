import type * as vscode from "vscode";

export class TaskProvider implements vscode.TaskProvider<vscode.Task> {
    provideTasks(token: vscode.CancellationToken): vscode.ProviderResult<vscode.Task[]> {
        throw new Error("Method not implemented.");
    }

    resolveTask(task: vscode.Task, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Task> {
        throw new Error("Method not implemented.");
    }
}
