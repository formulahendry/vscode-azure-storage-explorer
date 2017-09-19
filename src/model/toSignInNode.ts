import * as vscode from "vscode";
import { INode } from "./INode";

export class ToSignInNode implements INode {
    constructor() {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: "Click to sign in",
            command: {
                command: "azure-account.login",
                title: "",
            },
        };
    }

    public getChildren(): INode[] {
        return [];
    }
}
