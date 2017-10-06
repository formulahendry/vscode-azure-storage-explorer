import storageManagementClient = require("azure-arm-storage");
import * as path from "path";
import * as vscode from "vscode";
import * as StorageAccountModels from "../../node_modules/azure-arm-storage/lib/models";
import { BlobContainerLabelNode } from "./blob/blobContainerLabelNode";
import { FileShareLabelNode } from "./file/fileShareLabelNode";
import { INode } from "./INode";

export class StorageAccountNode implements INode {
    constructor(private readonly storageAccount: StorageAccountModels.StorageAccount, private readonly storageAccountKeys: StorageAccountModels.StorageAccountKey[]) {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: this.storageAccount.name,
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
            contextValue: "storageAccount",
            iconPath: path.join(__filename, "..", "..", "..", "..", "resources", "AzureStorageAccount_16x.png"),
        };
    }

    public getChildren(): INode[] {
        return [new BlobContainerLabelNode(this.storageAccount, this.storageAccountKeys),
                new FileShareLabelNode(this.storageAccount, this.storageAccountKeys)];
    }
}
