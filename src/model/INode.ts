import * as vscode from "vscode";
import { AzureAccount } from "../azure-account.api";

export interface INode {

    getTreeItem(): vscode.TreeItem;

    getChildren(azureAccount: AzureAccount): Promise<INode[]>;
}
