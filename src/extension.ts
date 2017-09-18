"use strict";
import * as vscode from "vscode";
import { BlobNode } from "./model/blobNode";
import { StorageTreeDataProvider} from "./storageTreeDataProvider";

export function activate(context: vscode.ExtensionContext) {

    const storageTreeDataProvider = new StorageTreeDataProvider(context);

    context.subscriptions.push(vscode.window.registerTreeDataProvider("azureStorage", storageTreeDataProvider));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.getBlob", (blobNode: BlobNode) => {
        blobNode.getBlob();
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.downloadBlob", (blobNode: BlobNode) => {
        blobNode.downloadBlob();
    }));
}

export function deactivate() {
}
