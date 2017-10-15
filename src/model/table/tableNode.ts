import azureStorage = require("azure-storage");
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import * as azureStorageTypings from "../../../node_modules/azure-storage/typings/azure-storage/azure-storage";
import { AzureAccount } from "../../azure-account.api";
import { StorageTreeDataProvider } from "../../storageTreeDataProvider";
import { InfoNode } from "../infoNode";
import { INode } from "../INode";

export class TableNode implements INode {
    constructor(private readonly table: string,
                private readonly tableService: azureStorageTypings.services.table.TableService,
                private readonly tableLabelNode: INode) {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: this.table,
            contextValue: "table",
            iconPath: path.join(__filename, "..", "..", "..", "..", "..", "resources", "AzureTable_16x.png"),
        };
    }

    public getChildren(azureAccount: AzureAccount): INode[] {
        return [];
    }

    public deleteTable(storageTreeDataProvider: StorageTreeDataProvider) {
        const yes = "Yes";
        const no = "No";
        vscode.window.showInformationMessage<vscode.MessageItem>(`Are you sure to delete ${this.table}?`,
            { title: yes },
            { title: no, isCloseAffordance: true },
        ).then((selection) => {
            switch (selection && selection.title) {
                case yes:
                    vscode.window.withProgress({
                        title: `Deleting table [${this.table}] ...`,
                        location: vscode.ProgressLocation.Window,
                    }, async (progress) => {
                        await new Promise((resolve, reject) => {
                            this.tableService.deleteTableIfExists(this.table, (error, response) => {
                                if (error) {
                                    vscode.window.showErrorMessage(error.message);
                                    reject(error.message);
                                } else {
                                    storageTreeDataProvider.refresh(this.tableLabelNode);
                                    resolve();
                                }
                            });
                        });
                    });
                    break;
                default:
            }
        });
    }
}
