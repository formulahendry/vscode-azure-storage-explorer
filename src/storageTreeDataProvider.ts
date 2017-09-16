import * as path from "path";
import * as vscode from "vscode";
import { AzureAccount, AzureLoginStatus, AzureSession } from "./azure-account.api";

export class StorageTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private readonly accountApi: AzureAccount;

    constructor(context: vscode.ExtensionContext) {
        this.accountApi = vscode.extensions.getExtension<AzureAccount>("ms-vscode.azure-account")!.exports;
    }

    public getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    public getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
        return [];
    }
}
