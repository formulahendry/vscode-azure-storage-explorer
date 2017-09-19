"use strict";
import * as vscode from "vscode";
import { BlobContainerLabelNode } from "./model/BlobContainerLabelNode";
import { BlobContainerNode } from "./model/BlobContainerNode";
import { BlobNode } from "./model/blobNode";
import { INode } from "./model/INode";
import { StorageTreeDataProvider} from "./storageTreeDataProvider";

export function activate(context: vscode.ExtensionContext) {

    const storageTreeDataProvider = new StorageTreeDataProvider(context);

    context.subscriptions.push(vscode.window.registerTreeDataProvider("azureStorage", storageTreeDataProvider));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.refresh", (node: INode) => {
        storageTreeDataProvider.refresh(node);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.createContainer", (blobContainerLabel: BlobContainerLabelNode) => {
        blobContainerLabel.createContainer(storageTreeDataProvider);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.getBlob", (blobNode: BlobNode) => {
        blobNode.getBlob();
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.downloadBlob", (blobNode: BlobNode) => {
        blobNode.downloadBlob();
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.deleteBlob", (blobNode: BlobNode) => {
        blobNode.deleteBlob(storageTreeDataProvider);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.uploadBlob", (blobContainer: BlobContainerNode) => {
        blobContainer.uploadBlob(storageTreeDataProvider);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.deleteContainer", (blobContainer: BlobContainerNode) => {
        blobContainer.deleteContainer(storageTreeDataProvider);
    }));
}

export function deactivate() {
}
