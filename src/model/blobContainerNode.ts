import azureStorage = require("azure-storage");
import * as vscode from "vscode";
import * as azureStorageTypings from "../../node_modules/azure-storage/typings/azure-storage/azure-storage";
import { AzureAccount } from "../azure-account.api";
import { BlobNode } from "./blobNode";
import { InfoNode } from "./infoNode";
import { INode } from "./INode";

export class BlobContainerNode implements INode {
    constructor(private readonly container: azureStorageTypings.services.blob.blobservice.BlobService.ContainerResult,
                private readonly blobService: azureStorageTypings.services.blob.blobservice.BlobService) {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: this.container.name,
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
        };
    }

    public getChildren(azureAccount: AzureAccount): Promise<INode[]> {
        return new Promise<INode[]>((resolve, reject) => {
            this.blobService.listBlobsSegmented(this.container.name, null, (error, result, response) => {
                if (error) {
                    resolve([new InfoNode(`Failed to list containers: ${error})`)]);
                }
                const blobNodes = result.entries.map((blob) => {
                    return new BlobNode(blob, this.container, this.blobService);
                });
                resolve(blobNodes);
            });
        });
    }
}
