import storageManagementClient = require("azure-arm-storage");
import * as vscode from "vscode";
import * as StorageAccountModels from "../../node_modules/azure-arm-storage/lib/models";
import { BlobContainerLabelNode } from "./blobContainerLabelNode";
import { INode } from "./INode";

export class StorageAccountNode implements INode {
    constructor(private readonly storageAccount: StorageAccountModels.StorageAccount, private readonly storageAccountKeys: StorageAccountModels.StorageAccountKey[]) {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: this.storageAccount.name,
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
            contextValue: "storageAccount",
        };
    }

    public getChildren(): INode[] {
        return [new BlobContainerLabelNode(this.storageAccount, this.storageAccountKeys)];
    }
}
