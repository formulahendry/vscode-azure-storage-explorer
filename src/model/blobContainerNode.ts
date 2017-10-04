import azureStorage = require("azure-storage");
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import * as azureStorageTypings from "../../node_modules/azure-storage/typings/azure-storage/azure-storage";
import { AzureAccount } from "../azure-account.api";
import { StorageTreeDataProvider } from "../storageTreeDataProvider";
import { BlobNode } from "./blobNode";
import { InfoNode } from "./infoNode";
import { INode } from "./INode";

export class BlobContainerNode implements INode {
    constructor(private readonly container: azureStorageTypings.services.blob.blobservice.BlobService.ContainerResult,
        private readonly blobService: azureStorageTypings.services.blob.blobservice.BlobService,
        private readonly blobContainerLabelNode: INode) {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: this.container.name,
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
            contextValue: "blobContainer",
            iconPath: path.join(__filename, "..", "..", "..", "..", "resources", "AzureBlob_16x.png"),
        };
    }

    public getChildren(azureAccount: AzureAccount): Promise<INode[]> {
        return new Promise<INode[]>((resolve, reject) => {
            this.blobService.listBlobsSegmented(this.container.name, null, (error, result, response) => {
                if (error) {
                    resolve([new InfoNode(`Failed to list containers: ${error})`)]);
                }
                const blobNodes = result.entries.map((blob) => {
                    return new BlobNode(blob, this.container, this.blobService, this);
                });
                resolve(blobNodes);
            });
        });
    }

    public async uploadBlob(storageTreeDataProvider: StorageTreeDataProvider) {
        const options: vscode.OpenDialogOptions = {
            openLabel: "Upload"
        };
        const filePathUri = await vscode.window.showOpenDialog(options);
        if (!filePathUri) {
            return;
        }

        const filePath = filePathUri[0].fsPath;
        if (!fs.existsSync(filePath)) {
            vscode.window.showWarningMessage(`${filePath} does not exist.`);
            return;
        }
        const blobName = path.basename(filePath);
        if (!blobName) {
            return;
        }
        vscode.window.withProgress({
            title: `Uploading ${filePath} to ${this.container.name} ...`,
            location: vscode.ProgressLocation.Window,
        }, async (progress) => {
            await new Promise((resolve, reject) => {
                this.blobService.createBlockBlobFromLocalFile(this.container.name, blobName, filePath, (error, result, response) => {
                    if (error) {
                        reject(error.message);
                    } else {
                        // vscode.window.showInformationMessage(`Blob [${blobName}] is uploaded.`);
                        storageTreeDataProvider.refresh(this);
                        resolve();
                    }
                });
            });
        });
    }

    public deleteContainer(storageTreeDataProvider: StorageTreeDataProvider) {
        const yes = "Yes";
        const no = "No";
        vscode.window.showInformationMessage<vscode.MessageItem>(`Are you sure to delete ${this.container.name}?`,
            { title: yes },
            { title: no, isCloseAffordance: true },
        ).then((selection) => {
            switch (selection && selection.title) {
                case yes:
                    vscode.window.withProgress({
                        title: `Deleting container [${this.container.name}] ...`,
                        location: vscode.ProgressLocation.Window,
                    }, async (progress) => {
                        await new Promise((resolve, reject) => {
                            this.blobService.deleteContainer(this.container.name, (error, response) => {
                                if (error) {
                                    reject(error.message);
                                } else {
                                    // vscode.window.showInformationMessage(`Blob [${this.blob.name}] is deleted.`);
                                    storageTreeDataProvider.refresh(this.blobContainerLabelNode);
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
