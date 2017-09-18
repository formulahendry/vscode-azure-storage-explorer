import * as path from "path";
import * as vscode from "vscode";
import { AzureAccount, AzureLoginStatus, AzureResourceFilter, AzureSession } from "./azure-account.api";
import { INode } from "./model/INode";
import { SubscriptionNode } from "./model/subscriptionNode";

export class StorageTreeDataProvider implements vscode.TreeDataProvider<INode> {
    public _onDidChangeTreeData: vscode.EventEmitter<INode> = new vscode.EventEmitter<INode>();
    public readonly onDidChangeTreeData: vscode.Event<INode> = this._onDidChangeTreeData.event;
    private readonly accountApi: AzureAccount;

    constructor(context: vscode.ExtensionContext) {
        this.accountApi = vscode.extensions.getExtension<AzureAccount>("ms-vscode.azure-account")!.exports;
        this.accountApi.onFiltersChanged(this.onSubscriptionChanged, this);
        this.accountApi.onSessionsChanged(this.onSubscriptionChanged, this);
    }

    public getTreeItem(element: INode): vscode.TreeItem {
        return element.getTreeItem();
    }

    public getChildren(element?: INode): Thenable<INode[]> | INode[] {
        if (!element) {
            return this.getSubscriptions();
        }

        return element.getChildren(this.accountApi);
    }

    private async getSubscriptions(): Promise<SubscriptionNode[]> {
        await this.accountApi.waitForFilters();
        const azureResourceFilters = await this.accountApi.filters;
        const nodes = azureResourceFilters.map<SubscriptionNode>((azureResourceFilter) => {
            return new SubscriptionNode(azureResourceFilter);
        });

        return nodes;
    }

    private onSubscriptionChanged() {
        this._onDidChangeTreeData.fire();
    }
}