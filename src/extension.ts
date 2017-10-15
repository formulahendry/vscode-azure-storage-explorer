"use strict";
import * as vscode from "vscode";
import { AppInsightsClient } from "./common/appInsightsClient";
import { BlobContainerLabelNode } from "./model/blob/blobContainerLabelNode";
import { BlobContainerNode } from "./model/blob/blobContainerNode";
import { BlobNode } from "./model/blob/blobNode";
import { DirectoryNode } from "./model/file/directoryNode";
import { FileNode } from "./model/file/fileNode";
import { FileShareLabelNode } from "./model/file/fileShareLabelNode";
import { FileShareNode } from "./model/file/fileShareNode";
import { INode } from "./model/INode";
import { TableLabelNode } from "./model/table/tableLabelNode";
import { TableNode } from "./model/table/tableNode";
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

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.copyBlobUrl", (blobNode: BlobNode) => {
        AppInsightsClient.sendEvent("copyBlobUrl");
        blobNode.copyBlobUrl();
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

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.downloadFile", (fileNode: FileNode) => {
        AppInsightsClient.sendEvent("downloadFile");
        fileNode.downloadFile();
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.copyFileUrl", (fileNode: FileNode) => {
        AppInsightsClient.sendEvent("copyFileUrl");
        fileNode.copyFileUrl();
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.deleteFile", (fileNode: FileNode) => {
        AppInsightsClient.sendEvent("deleteFile");
        fileNode.deleteFile(storageTreeDataProvider);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.deleteDirectory", (directoryNode: DirectoryNode) => {
        AppInsightsClient.sendEvent("deleteDirectory");
        directoryNode.deleteDirectory(storageTreeDataProvider);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.deleteFileShare", (fileShareNode: FileShareNode) => {
        AppInsightsClient.sendEvent("deleteFileShare");
        fileShareNode.deleteFileShare(storageTreeDataProvider);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.uploadFile", (fileShareOrDirectoryNode: DirectoryNode | FileShareNode) => {
        AppInsightsClient.sendEvent("uploadFile");
        fileShareOrDirectoryNode.uploadFile(storageTreeDataProvider);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.createDirectory", (fileShareOrDirectoryNode: DirectoryNode | FileShareNode) => {
        AppInsightsClient.sendEvent("createDirectory");
        fileShareOrDirectoryNode.createDirectory(storageTreeDataProvider);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.createFileShare", (fileShareLabelNode: FileShareLabelNode) => {
        AppInsightsClient.sendEvent("createFileShare");
        fileShareLabelNode.createFileShare(storageTreeDataProvider);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.createTable", (tableLabelNode: TableLabelNode) => {
        AppInsightsClient.sendEvent("createTable");
        tableLabelNode.createTable(storageTreeDataProvider);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-storage-explorer.deleteTable", (tableNode: TableNode) => {
        AppInsightsClient.sendEvent("deleteTable");
        tableNode.deleteTable(storageTreeDataProvider);
    }));
}

export function deactivate() {
}
