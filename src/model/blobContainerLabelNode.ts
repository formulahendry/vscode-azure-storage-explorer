import azureStorage = require("azure-storage");
import * as vscode from "vscode";
import * as StorageAccountModels from "../../node_modules/azure-arm-storage/lib/models";
import { BlobContainerNode } from "./blobContainerNode";
import { InfoNode } from "./infoNode";
import { INode } from "./INode";

export class BlobContainerLabelNode implements INode {
    constructor(private readonly storageAccount: StorageAccountModels.StorageAccount, private readonly storageAccountKeys: StorageAccountModels.StorageAccountKey[]) {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: "Blob Container",
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
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
                    return new BlobContainerNode(container, blobService);
                });
                resolve(containerNodes);
            });
        });
    }
}
