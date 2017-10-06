import azureStorage = require("azure-storage");
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import * as azureStorageTypings from "../../../node_modules/azure-storage/typings/azure-storage/azure-storage";
import { AzureAccount } from "../../azure-account.api";
import { StorageTreeDataProvider } from "../../storageTreeDataProvider";
import { FileNode } from "./fileNode";
import { FileUtility } from "./fileUtility";
import { InfoNode } from "../infoNode";
import { INode } from "../INode";

export class FileShareNode implements INode {
    constructor(private readonly fileShare: azureStorageTypings.services.file.FileService.ShareResult,
                private readonly fileService: azureStorageTypings.services.file.FileService,
                private readonly fileShareLabelNode: INode) {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: this.fileShare.name,
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
            contextValue: "fileShare",
            iconPath: path.join(__filename, "..", "..", "..", "..", "..", "resources", "AzureFileShare_16x.png"),
        };
    }

    public getChildren(azureAccount: AzureAccount): Promise<INode[]> {
        return FileUtility.listFilesAndDirectories(this.fileShare, this.fileService, this, "");
        // return new Promise<INode[]>((resolve, reject) => {
        //     this.fileService.listFilesAndDirectoriesSegmented(this.fileShare.name, "", null , (error, result, response) => {
        //         if (error) {
        //             resolve([new InfoNode(`Failed to list file shares: ${error})`)]);
        //         }
        //         const fileNodes = result.entries.files.map((file) => {
        //             return new FileNode(file, this.fileShare, this.fileService, this);
        //         });
        //         resolve(fileNodes);
        //     });
        // });
    }

    public async uploadFile(storageTreeDataProvider: StorageTreeDataProvider) {
        FileUtility.uploadFile(storageTreeDataProvider, this.fileShare, this.fileService, this, "");
    }

    public async createDirectory(storageTreeDataProvider: StorageTreeDataProvider) {
        FileUtility.createDirectory(storageTreeDataProvider, this.fileShare, this.fileService, this, "");
    }

    public deleteFileShare(storageTreeDataProvider: StorageTreeDataProvider) {
        const yes = "Yes";
        const no = "No";
        vscode.window.showInformationMessage<vscode.MessageItem>(`Are you sure to delete ${this.fileShare.name}?`,
            { title: yes },
            { title: no, isCloseAffordance: true },
        ).then((selection) => {
            switch (selection && selection.title) {
                case yes:
                    vscode.window.withProgress({
                        title: `Deleting file share [${this.fileShare.name}] ...`,
                        location: vscode.ProgressLocation.Window,
                    }, async (progress) => {
                        await new Promise((resolve, reject) => {
                            this.fileService.deleteShareIfExists(this.fileShare.name, (error, response) => {
                                if (error) {
                                    vscode.window.showErrorMessage(error.message);
                                    reject(error.message);
                                } else {
                                    storageTreeDataProvider.refresh(this.fileShareLabelNode);
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
