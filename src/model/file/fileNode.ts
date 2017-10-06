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

export class FileNode implements INode {
    constructor(private readonly file: azureStorageTypings.services.file.FileService.FileResult,
                private readonly directoryPath: string,
                private readonly fileShare: azureStorageTypings.services.file.FileService.ShareResult,
                private readonly fileService: azureStorageTypings.services.file.FileService,
                private readonly fileShareOrDirectoryNode: INode) {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: this.file.name,
            contextValue: "file",
            iconPath: path.join(__filename, "..", "..", "..", "..", "..", "resources", "Document_16x.png"),
        };
    }

    public getChildren(azureAccount: AzureAccount): INode[] {
        return [];
    }

    public async downloadFile() {
        const options: vscode.OpenDialogOptions = {
            defaultUri: vscode.Uri.file(this.file.name),
        };
        const filePathUri = await vscode.window.showSaveDialog(options);
        if (!filePathUri) {
            return;
        }

        const filePath = filePathUri.fsPath;
        vscode.window.withProgress({
            title: `Downloading file to ${filePath} ...`,
            location: vscode.ProgressLocation.Window,
        }, async (progress) => {
            await new Promise((resolve, reject) => {
                this.fileService.getFileToLocalFile(this.fileShare.name, this.directoryPath, this.file.name, filePath, (error, result, response) => {
                    if (error) {
                        vscode.window.showErrorMessage(error.message);
                        reject(error.message);
                    } else {
                        // vscode.window.showInformationMessage(`Blob [${this.blob.name}] is downloaded.`);
                        resolve();
                    }
                });
            });
        });
    }

    public copyFileUrl() {
        const url = this.fileService.getUrl(this.fileShare.name, this.directoryPath, this.file.name);
        copypaste.copy(url, () => {
            vscode.window.showInformationMessage(`'${url}' is copied to clipboard.`);
        });
    }

    public deleteFile(storageTreeDataProvider: StorageTreeDataProvider) {
        const yes = "Yes";
        const no = "No";
        vscode.window.showInformationMessage<vscode.MessageItem>(`Are you sure to delete ${this.file.name}?`,
            { title: yes },
            { title: no, isCloseAffordance: true },
        ).then((selection) => {
            switch (selection && selection.title) {
                case yes:
                    vscode.window.withProgress({
                        title: `Deleting file [${this.file.name}] ...`,
                        location: vscode.ProgressLocation.Window,
                    }, async (progress) => {
                        await new Promise((resolve, reject) => {
                            this.fileService.deleteFileIfExists(this.fileShare.name, this.directoryPath, this.file.name, (error, response) => {
                                if (error) {
                                    vscode.window.showErrorMessage(error.message);
                                    reject(error.message);
                                } else {
                                    storageTreeDataProvider.refresh(this.fileShareOrDirectoryNode);
                                    resolve();
                                }
                            });
                        });
                    });
                    break;
                default:
            }
        });
    }
}
