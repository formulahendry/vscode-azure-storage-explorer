import azureStorage = require("azure-storage");
import * as copypaste from "copy-paste";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";
import * as azureStorageTypings from "../../node_modules/azure-storage/typings/azure-storage/azure-storage";
import { AzureAccount } from "../azure-account.api";
import { Utility } from "../common/utility";
import { StorageTreeDataProvider} from "../storageTreeDataProvider";
import { InfoNode } from "./infoNode";
import { INode } from "./INode";

export class BlobNode implements INode {
    constructor(private readonly blob: azureStorageTypings.services.blob.blobservice.BlobService.BlobResult,
                private readonly container: azureStorageTypings.services.blob.blobservice.BlobService.ContainerResult,
                private readonly blobService: azureStorageTypings.services.blob.blobservice.BlobService,
                private readonly blobContainerNode: INode) {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: this.blob.name,
            command: {
                command: "azure-storage-explorer.getBlob",
                title: "",
                arguments: [this],
            },
            contextValue: "blob",
            iconPath: path.join(__filename, "..", "..", "..", "..", "resources", "Document_16x.png"),
        };
    }

    public getChildren(azureAccount: AzureAccount): INode[] {
        return [];
    }

    public getBlob() {
        Utility.appendLine(JSON.stringify(this.blob, null, 2));
    }

    public downloadBlob() {
        const folder = vscode.workspace.workspaceFolders[0] ? vscode.workspace.workspaceFolders[0].uri.fsPath : os.tmpdir();
        vscode.window.showInputBox({
            prompt: "Set download file path",
            value: path.join(folder, this.blob.name),
        }).then(async (filePath: string) => {
            if (!filePath) {
                return;
            }
            if (fs.existsSync(filePath)) {
                vscode.window.showWarningMessage(`${filePath} already exists. Please enter another file path.`);
                return;
            }
            vscode.window.withProgress({
                title: `Downloading blob to ${filePath} ...`,
                location: vscode.ProgressLocation.Window,
            }, async (progress) => {
                await new Promise((resolve, reject) => {
                    this.blobService.getBlobToLocalFile(this.container.name, this.blob.name, filePath, (error, result, response) => {
                        if (error) {
                            reject(error.message);
                        } else {
                            // vscode.window.showInformationMessage(`Blob [${this.blob.name}] is downloaded.`);
                            resolve();
                        }
                    });
                });
            });
        });
    }

    public copyBlobUrl() {
        const url = this.blobService.getUrl(this.container.name, this.blob.name);
        copypaste.copy(url, () => {
            vscode.window.showInformationMessage(`'${url}' is copied to clipboard.`);
        });
    }

    public deleteBlob(storageTreeDataProvider: StorageTreeDataProvider) {
        const yes = "Yes";
        const no = "No";
        vscode.window.showInformationMessage<vscode.MessageItem>(`Are you sure to delete ${this.blob.name}?`,
            { title: yes },
            { title: no, isCloseAffordance: true },
        ).then((selection) => {
            switch (selection && selection.title) {
                case yes:
                    vscode.window.withProgress({
                        title: `Deleting blob [${this.blob.name}] ...`,
                        location: vscode.ProgressLocation.Window,
                    }, async (progress) => {
                        await new Promise((resolve, reject) => {
                            this.blobService.deleteBlob(this.container.name, this.blob.name, (error, response) => {
                                if (error) {
                                    reject(error.message);
                                } else {
                                    // vscode.window.showInformationMessage(`Blob [${this.blob.name}] is deleted.`);
                                    storageTreeDataProvider.refresh(this.blobContainerNode);
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
