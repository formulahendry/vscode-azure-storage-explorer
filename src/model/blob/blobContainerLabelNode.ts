import azureStorage = require("azure-storage");
import * as path from "path";
import * as vscode from "vscode";
import * as StorageAccountModels from "../../../node_modules/azure-arm-storage/lib/models";
import { StorageTreeDataProvider} from "../../storageTreeDataProvider";
import { BlobContainerNode } from "./blobContainerNode";
import { InfoNode } from "../infoNode";
import { INode } from "../INode";

export class BlobContainerLabelNode implements INode {
    constructor(private readonly storageAccount: StorageAccountModels.StorageAccount, private readonly storageAccountKeys: StorageAccountModels.StorageAccountKey[]) {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: "[Blob Container]",
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
            contextValue: "blobContainerLabel",
            iconPath: path.join(__filename, "..", "..", "..", "..", "..", "resources", "AzureBlob_16x.png"),
        };
    }

    public getChildren(): Promise<INode[]> {
        const blobService = azureStorage.createBlobService(this.storageAccount.name, this.storageAccountKeys[0].value);
        return new Promise<INode[]>((resolve, reject) => {
            blobService.listContainersSegmented(null, (error, result, response) => {
                if (error) {
                    resolve([new InfoNode(`Failed to list containers: ${error})`)]);
                }
                const containerNodes = result.entries.map((container) => {
                    return new BlobContainerNode(container, blobService, this);
                });
                resolve(containerNodes);
            });
        });
    }

    public createContainer(storageTreeDataProvider: StorageTreeDataProvider) {
        const blobService = azureStorage.createBlobService(this.storageAccount.name, this.storageAccountKeys[0].value);
        vscode.window.showInputBox({
            prompt: "Enter container name",
        }).then(async (containerName: string) => {
            if (!containerName) {
                return;
            }
            vscode.window.withProgress({
                title: `Creating container [${containerName}] ...`,
                location: vscode.ProgressLocation.Window,
            }, async (progress) => {
                await new Promise((resolve, reject) => {
                    blobService.createContainerIfNotExists(containerName, (error, result, response) => {
                        if (error) {
                            vscode.window.showErrorMessage(error.message);
                            reject(error.message);
                        } else {
                            // vscode.window.showInformationMessage(`Container [${containerName}] is created.`);
                            storageTreeDataProvider.refresh(this);
                            resolve();
                        }
                    });
                });
            });
        });
    }
}
