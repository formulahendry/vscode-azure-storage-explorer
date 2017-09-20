"use strict";
import * as vscode from "vscode";
import { AppInsightsClient } from "./common/appInsightsClient";
import { BlobContainerLabelNode } from "./model/BlobContainerLabelNode";
import { BlobContainerNode } from "./model/BlobContainerNode";
import { BlobNode } from "./model/blobNode";
import { INode } from "./model/INode";
import { StorageTreeDataProvider} from "./storageTreeDataProvider";

export function activate(context: vscode.ExtensionContext) {
    AppInsightsClient.sendEvent("loadExtension");

    const storageTreeDataProvider = new StorageTreeDataProvider(context);

    context.subscriptions.push(vscode.window.registerTreeDataProvider("azureStorage", storageTreeDataProvider));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.selectSubscriptions", () => {
        AppInsightsClient.sendEvent("selectSubscriptions");
        vscode.commands.executeCommand("azure-account.selectSubscriptions");
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.refresh", (node: INode) => {
        AppInsightsClient.sendEvent("refresh");
        storageTreeDataProvider.refresh(node);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.createContainer", (blobContainerLabel: BlobContainerLabelNode) => {
        AppInsightsClient.sendEvent("createContainer");
        blobContainerLabel.createContainer(storageTreeDataProvider);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.getBlob", (blobNode: BlobNode) => {
        AppInsightsClient.sendEvent("getBlob");
        blobNode.getBlob();
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.downloadBlob", (blobNode: BlobNode) => {
        AppInsightsClient.sendEvent("downloadBlob");
        blobNode.downloadBlob();
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.deleteBlob", (blobNode: BlobNode) => {
        AppInsightsClient.sendEvent("deleteBlob");
        blobNode.deleteBlob(storageTreeDataProvider);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.uploadBlob", (blobContainer: BlobContainerNode) => {
        AppInsightsClient.sendEvent("uploadBlob");
        blobContainer.uploadBlob(storageTreeDataProvider);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.deleteContainer", (blobContainer: BlobContainerNode) => {
        AppInsightsClient.sendEvent("deleteContainer");
        blobContainer.deleteContainer(storageTreeDataProvider);
    }));
}

export function deactivate() {
}
