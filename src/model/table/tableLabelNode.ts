import azureStorage = require("azure-storage");
import * as path from "path";
import * as vscode from "vscode";
import * as StorageAccountModels from "../../../node_modules/azure-arm-storage/lib/models";
import { StorageTreeDataProvider} from "../../storageTreeDataProvider";
import { InfoNode } from "../infoNode";
import { INode } from "../INode";
import { TableNode } from "./tableNode";

export class TableLabelNode implements INode {
    constructor(private readonly storageAccount: StorageAccountModels.StorageAccount, private readonly storageAccountKeys: StorageAccountModels.StorageAccountKey[]) {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: "[Tables]",
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
            contextValue: "tableLabel",
            iconPath: path.join(__filename, "..", "..", "..", "..", "..", "resources", "AzureTable_16x.png"),
        };
    }

    public getChildren(): Promise<INode[]> {
        const tableService = azureStorage.createTableService(this.storageAccount.name, this.storageAccountKeys[0].value);
        return new Promise<INode[]>((resolve, reject) => {
            tableService.listTablesSegmented(null, (error, result, response) => {
                if (error) {
                    resolve([new InfoNode(`Failed to list tables: ${error})`)]);
                }
                const tableNodes = result.entries.map((table) => {
                    return new TableNode(table, tableService, this);
                });
                resolve(tableNodes);
            });
        });
    }

    public createTable(storageTreeDataProvider: StorageTreeDataProvider) {
        const tableService = azureStorage.createTableService(this.storageAccount.name, this.storageAccountKeys[0].value);
        vscode.window.showInputBox({
            prompt: "Enter table name",
        }).then(async (tableName: string) => {
            if (!tableName) {
                return;
            }
            vscode.window.withProgress({
                title: `Creating table [${tableName}] ...`,
                location: vscode.ProgressLocation.Window,
            }, async (progress) => {
                await new Promise((resolve, reject) => {
                    tableService.createTableIfNotExists(tableName, (error, result, response) => {
                        if (error) {
                            vscode.window.showErrorMessage(error.message);
                            reject(error.message);
                        } else {
                            storageTreeDataProvider.refresh(this);
                            resolve();
                        }
                    });
                });
            });
        });
    }
}
