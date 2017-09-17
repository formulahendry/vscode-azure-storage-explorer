import storageManagementClient = require("azure-arm-storage");
import * as vscode from "vscode";
import { AzureAccount, AzureResourceFilter } from "../azure-account.api";
import { INode } from "./INode";
import { StorageAccountNode } from "./storageAccountNode";

export class SubscriptionNode implements INode {
    constructor(private readonly azureResourceFilter: AzureResourceFilter) {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: this.azureResourceFilter.subscription.displayName,
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
        };
    }

    public async getChildren(azureAccount: AzureAccount): Promise<INode[]> {
        const client = new storageManagementClient(this.azureResourceFilter.session.credentials, this.azureResourceFilter.subscription.subscriptionId);
        const nodes = await client.storageAccounts.list().then((storageAccounts) => {
            return storageAccounts.map(async (storageAccount) => {
                const storageAccountKeys = await client.storageAccounts.listKeys("azureiot", storageAccount.name).then((_storageAccountKeys) => {
                    return _storageAccountKeys.keys;
                });
                return new StorageAccountNode(storageAccount, storageAccountKeys);
            });
        });
        return Promise.all(nodes).then((_nodes) => {
            return _nodes;
        });
    }
}
