import * as vscode from "vscode";
import { INode } from "./INode";

export class SelectSubscriptionsNode implements INode {
    constructor() {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: "Click to select subscriptions, or subscriptions is loading",
            command: {
                command: "azure-account.selectSubscriptions",
                title: "",
            },
        };
    }

    public getChildren(): INode[] {
        return [];
    }
}
