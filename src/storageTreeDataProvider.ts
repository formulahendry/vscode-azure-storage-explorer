import * as path from "path";
import * as vscode from "vscode";
import { AzureAccount, AzureLoginStatus, AzureResourceFilter, AzureSession } from "./azure-account.api";
import { AppInsightsClient } from "./common/appInsightsClient";
import { InfoNode } from "./model/infoNode";
import { INode } from "./model/INode";
import { SelectSubscriptionsNode } from "./model/selectSubscriptionsNode";
import { SubscriptionNode } from "./model/subscriptionNode";
import { ToSignInNode } from "./model/toSignInNode";

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
        if (this.accountApi.status === "Initializing" || this.accountApi.status === "LoggingIn") {
            return [new InfoNode("Loading...")];
        }

        if (this.accountApi.status === "LoggedOut") {
            vscode.commands.executeCommand("azure-account.login");
            return [new ToSignInNode()];
        }

        if (!element) {
            return this.getSubscriptions();
        }

        return element.getChildren(this.accountApi);
    }

    public refresh(element?: INode): void {
        this._onDidChangeTreeData.fire(element);
    }

    private async getSubscriptions(): Promise<SubscriptionNode[] | SelectSubscriptionsNode[]> {
        // await this.accountApi.waitForFilters();
        if (this.accountApi.filters.length === 0) {
            return [new SelectSubscriptionsNode()];
        }
        const azureResourceFilters = await this.accountApi.filters;
        const nodes = azureResourceFilters.map<SubscriptionNode>((azureResourceFilter) => {
            return new SubscriptionNode(azureResourceFilter);
        });
        AppInsightsClient.sendEvent("loadSubscriptions", { SubscriptionCount: nodes.length.toString() });
        return nodes;
    }

    private onSubscriptionChanged() {
        this.refresh();
    }
}
