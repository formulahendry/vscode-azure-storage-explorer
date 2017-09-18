import azureStorage = require("azure-storage");
import * as vscode from "vscode";
import * as azureStorageTypings from "../../node_modules/azure-storage/typings/azure-storage/azure-storage";
import { AzureAccount } from "../azure-account.api";
import { InfoNode } from "./infoNode";
import { INode } from "./INode";

export class BlobNode implements INode {
    constructor(private readonly blob: azureStorageTypings.services.blob.blobservice.BlobService.BlobResult) {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: this.blob.name,
        };
    }

    public getChildren(azureAccount: AzureAccount): INode[] {
        return [];
    }
}
