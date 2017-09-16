import * as vscode from "vscode";
import { AzureAccount, AzureResourceFilter } from "../azure-account.api";
import { INode } from "./INode";

export class SubscriptionNode implements INode {
    constructor(private readonly azureResourceFilter: AzureResourceFilter) {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: this.azureResourceFilter.subscription.displayName,
        };
    }

    public getChildren(azureAccount: AzureAccount): Promise<INode[]> {
        return [];
    }
}
