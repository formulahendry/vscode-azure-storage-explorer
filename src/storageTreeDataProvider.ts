import * as path from "path";
import * as vscode from "vscode";
import { AzureAccount, AzureLoginStatus, AzureResourceFilter, AzureSession } from "./azure-account.api";
import { INode } from "./model/INode";
import { SubscriptionNode } from "./model/SubscriptionNode";

export class StorageTreeDataProvider implements vscode.TreeDataProvider<INode> {
    public _onDidChangeTreeData: vscode.EventEmitter<INode> = new vscode.EventEmitter<INode>();
    public readonly onDidChangeTreeData: vscode.Event<INode> = this._onDidChangeTreeData.event;
    private readonly accountApi: AzureAccount;

    constructor(context: vscode.ExtensionContext) {
        this.accountApi = vscode.extensions.getExtension<AzureAccount>("ms-vscode.azure-account")!.exports;
        // this.accountApi.onFiltersChanged(this.onSubscriptionChanged);
        // this.accountApi.onSessionsChanged(this.onSubscriptionChanged);
    }

    public getTreeItem(element: INode): vscode.TreeItem {
        return element.getTreeItem();
    }

    public getChildren(element?: INode): Thenable<INode[]> {
        if (!element) {
            return this.getSubscriptions();
        }

        return element.getChildren(this.accountApi);
    }

    private async getSubscriptions(): Promise<SubscriptionNode[]> {
        console.log("st1: " + this.accountApi.status);
        await this.accountApi.waitForLogin();
        console.log("st2: " + this.accountApi.status);
        console.log("c: " + this.accountApi.filters.length);
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
