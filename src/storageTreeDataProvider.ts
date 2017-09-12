import * as path from "path";
import * as vscode from "vscode";

export class StorageTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private containerStrings = [];

    constructor(context: vscode.ExtensionContext) {
    }

    public getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    public getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
        return [];
    }
}
