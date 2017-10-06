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
            iconPath: path.join(__filename, "..", "..", "..", "..", "..", "resources", "AzureBlob_16x.png"),
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

    // public async uploadBlob(storageTreeDataProvider: StorageTreeDataProvider) {
    //     const options: vscode.OpenDialogOptions = {
    //         openLabel: "Upload",
    //     };
    //     const filePathUri = await vscode.window.showOpenDialog(options);
    //     if (!filePathUri) {
    //         return;
    //     }

    //     const filePath = filePathUri[0].fsPath;
    //     if (!fs.existsSync(filePath)) {
    //         vscode.window.showWarningMessage(`${filePath} does not exist.`);
    //         return;
    //     }
    //     vscode.window.showInputBox({
    //         prompt: "Enter blob name",
    //         value: path.basename(filePath),
    //     }).then(async (blobName: string) => {
    //         if (!blobName) {
    //             return;
    //         }
    //         vscode.window.withProgress({
    //             title: `Uploading ${filePath} to ${this.container.name} ...`,
    //             location: vscode.ProgressLocation.Window,
    //         }, async (progress) => {
    //             await new Promise((resolve, reject) => {
    //                 this.blobService.createBlockBlobFromLocalFile(this.container.name, blobName, filePath, (error, result, response) => {
    //                     if (error) {
    //                         reject(error.message);
    //                     } else {
    //                         // vscode.window.showInformationMessage(`Blob [${blobName}] is uploaded.`);
    //                         storageTreeDataProvider.refresh(this);
    //                         resolve();
    //                     }
    //                 });
    //             });
    //         });
    //     });
    // }

    // public deleteContainer(storageTreeDataProvider: StorageTreeDataProvider) {
    //     const yes = "Yes";
    //     const no = "No";
    //     vscode.window.showInformationMessage<vscode.MessageItem>(`Are you sure to delete ${this.container.name}?`,
    //         { title: yes },
    //         { title: no, isCloseAffordance: true },
    //     ).then((selection) => {
    //         switch (selection && selection.title) {
    //             case yes:
    //                 vscode.window.withProgress({
    //                     title: `Deleting container [${this.container.name}] ...`,
    //                     location: vscode.ProgressLocation.Window,
    //                 }, async (progress) => {
    //                     await new Promise((resolve, reject) => {
    //                         this.blobService.deleteContainer(this.container.name, (error, response) => {
    //                             if (error) {
    //                                 reject(error.message);
    //                             } else {
    //                                 // vscode.window.showInformationMessage(`Blob [${this.blob.name}] is deleted.`);
    //                                 storageTreeDataProvider.refresh(this.blobContainerLabelNode);
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
