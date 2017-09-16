"use strict";
import * as vscode from "vscode";
import { StorageTreeDataProvider} from "./storageTreeDataProvider";

export function activate(context: vscode.ExtensionContext) {

    const storageTreeDataProvider = new StorageTreeDataProvider(context);

    context.subscriptions.push(vscode.window.registerTreeDataProvider("azureStorage", storageTreeDataProvider));

    // const disposable = vscode.commands.registerCommand("extension.sayHello", () => {
    //     vscode.window.showInformationMessage("Hello World!");
    // });

    // context.subscriptions.push(disposable);
}

export function deactivate() {
}
