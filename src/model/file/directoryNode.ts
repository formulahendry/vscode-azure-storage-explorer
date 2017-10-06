import azureStorage = require("azure-storage");
import * as copypaste from "copy-paste";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";
import * as azureStorageTypings from "../../../node_modules/azure-storage/typings/azure-storage/azure-storage";
import { AzureAccount } from "../../azure-account.api";
import { Utility } from "../../common/utility";
import { StorageTreeDataProvider } from "../../storageTreeDataProvider";
import { InfoNode } from "../infoNode";
import { INode } from "../INode";
import { FileUtility } from "./fileUtility";

export class DirectoryNode implements INode {
    constructor(private readonly directory: azureStorageTypings.services.file.FileService.DirectoryResult,
                private readonly directoryPath: string,
                private readonly fileShare: azureStorageTypings.services.file.FileService.ShareResult,
                private readonly fileService: azureStorageTypings.services.file.FileService,
                private readonly fileShareNode: INode) {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: this.directory.name,
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
            contextValue: "directory",
            iconPath: path.join(__filename, "..", "..", "..", "..", "..", "resources", "Document_16x.png"),
        };
    }

    public getChildren(azureAccount: AzureAccount): Promise<INode[]> {
        return FileUtility.listFilesAndDirectories(this.fileShare, this.fileService, this, path.join(this.directoryPath, this.directory.name));
    }

    // public getBlob() {
    //     Utility.appendLine(JSON.stringify(this.blob, null, 2));
    // }

    // public async downloadBlob() {
    //     const options: vscode.OpenDialogOptions = {
    //         defaultUri: vscode.Uri.file(this.blob.name),
    //     };
    //     const filePathUri = await vscode.window.showSaveDialog(options);
    //     if (!filePathUri) {
    //         return;
    //     }

    //     const filePath = filePathUri.fsPath;
    //     vscode.window.withProgress({
    //         title: `Downloading blob to ${filePath} ...`,
    //         location: vscode.ProgressLocation.Window,
    //     }, async (progress) => {
    //         await new Promise((resolve, reject) => {
    //             this.blobService.getBlobToLocalFile(this.container.name, this.blob.name, filePath, (error, result, response) => {
    //                 if (error) {
    //                     reject(error.message);
    //                 } else {
    //                     // vscode.window.showInformationMessage(`Blob [${this.blob.name}] is downloaded.`);
    //                     resolve();
    //                 }
    //             });
    //         });
    //     });
    // }

    // public copyBlobUrl() {
    //     const url = this.blobService.getUrl(this.container.name, this.blob.name);
    //     copypaste.copy(url, () => {
    //         vscode.window.showInformationMessage(`'${url}' is copied to clipboard.`);
    //     });
    // }

    // public deleteBlob(storageTreeDataProvider: StorageTreeDataProvider) {
    //     const yes = "Yes";
    //     const no = "No";
    //     vscode.window.showInformationMessage<vscode.MessageItem>(`Are you sure to delete ${this.blob.name}?`,
    //         { title: yes },
    //         { title: no, isCloseAffordance: true },
    //     ).then((selection) => {
    //         switch (selection && selection.title) {
    //             case yes:
    //                 vscode.window.withProgress({
    //                     title: `Deleting blob [${this.blob.name}] ...`,
    //                     location: vscode.ProgressLocation.Window,
    //                 }, async (progress) => {
    //                     await new Promise((resolve, reject) => {
    //                         this.blobService.deleteBlob(this.container.name, this.blob.name, (error, response) => {
    //                             if (error) {
    //                                 reject(error.message);
    //                             } else {
    //                                 // vscode.window.showInformationMessage(`Blob [${this.blob.name}] is deleted.`);
    //                                 storageTreeDataProvider.refresh(this.blobContainerNode);
    //                                 resolve();
    //                             }
    //                         });
    //                     });
    //                 });
    //                 break;
    //             default:
    //         }
    //     });
    // }
}
