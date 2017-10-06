import azureStorage = require("azure-storage");
import * as path from "path";
import * as vscode from "vscode";
import * as StorageAccountModels from "../../../node_modules/azure-arm-storage/lib/models";
import { StorageTreeDataProvider} from "../../storageTreeDataProvider";
import { FileShareNode } from "./fileShareNode";
import { InfoNode } from "../infoNode";
import { INode } from "../INode";

export class FileShareLabelNode implements INode {
    constructor(private readonly storageAccount: StorageAccountModels.StorageAccount, private readonly storageAccountKeys: StorageAccountModels.StorageAccountKey[]) {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: "[File Shares]",
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
            contextValue: "fileShareLabel",
            iconPath: path.join(__filename, "..", "..", "..", "..", "..", "resources", "AzureBlob_16x.png"),
        };
    }

    public getChildren(): Promise<INode[]> {
        const fileService = azureStorage.createFileService(this.storageAccount.name, this.storageAccountKeys[0].value);
        return new Promise<INode[]>((resolve, reject) => {
            fileService.listSharesSegmented(null, (error, result, response) => {
                if (error) {
                    resolve([new InfoNode(`Failed to list file shares: ${error})`)]);
                }
                const fileshareNodes = result.entries.map((fileShare) => {
                    return new FileShareNode(fileShare, fileService, this);
                });
                resolve(fileshareNodes);
            });
        });
    }

    public createContainer(storageTreeDataProvider: StorageTreeDataProvider) {
        const blobService = azureStorage.createBlobService(this.storageAccount.name, this.storageAccountKeys[0].value);
        vscode.window.showInputBox({
            prompt: "Enter container name",
        }).then(async (containerName: string) => {
            if (!containerName) {
                return;
            }
            vscode.window.withProgress({
                title: `Creating container [${containerName}] ...`,
                location: vscode.ProgressLocation.Window,
            }, async (progress) => {
                await new Promise((resolve, reject) => {
                    blobService.createContainerIfNotExists(containerName, (error, result, response) => {
                        if (error) {
                            reject(error.message);
                        } else {
                            // vscode.window.showInformationMessage(`Container [${containerName}] is created.`);
                            storageTreeDataProvider.refresh(this);
                            resolve();
                        }
                    });
                });
            });
        });
    }
}
