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
                private readonly fileShareOrDirectoryNode: INode) {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: this.directory.name,
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
            contextValue: "directory",
            iconPath: path.join(__filename, "..", "..", "..", "..", "..", "resources", "Folder_16x.png"),
        };
    }

    public getChildren(azureAccount: AzureAccount): Promise<INode[]> {
        return FileUtility.listFilesAndDirectories(this.fileShare, this.fileService, this, path.join(this.directoryPath, this.directory.name));
    }

    public async uploadFile(storageTreeDataProvider: StorageTreeDataProvider) {
        FileUtility.uploadFile(storageTreeDataProvider, this.fileShare, this.fileService, this, path.join(this.directoryPath, this.directory.name));
    }

    public async createDirectory(storageTreeDataProvider: StorageTreeDataProvider) {
        FileUtility.createDirectory(storageTreeDataProvider, this.fileShare, this.fileService, this, path.join(this.directoryPath, this.directory.name));
    }

    public deleteDirectory(storageTreeDataProvider: StorageTreeDataProvider) {
        const yes = "Yes";
        const no = "No";
        vscode.window.showInformationMessage<vscode.MessageItem>(`Are you sure to delete ${this.directory.name}?`,
            { title: yes },
            { title: no, isCloseAffordance: true },
        ).then((selection) => {
            switch (selection && selection.title) {
                case yes:
                    vscode.window.withProgress({
                        title: `Deleting directory [${this.directory.name}] ...`,
                        location: vscode.ProgressLocation.Window,
                    }, async (progress) => {
                        await new Promise((resolve, reject) => {
                            this.fileService.deleteDirectoryIfExists(this.fileShare.name, path.join(this.directoryPath, this.directory.name), (error, response) => {
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
