import azureStorage = require("azure-storage");
import * as vscode from "vscode";
import * as azureStorageTypings from "../../node_modules/azure-storage/typings/azure-storage/azure-storage";
import { AzureAccount } from "../azure-account.api";
import { Utility } from "../common/utility";
import { InfoNode } from "./infoNode";
import { INode } from "./INode";

export class BlobNode implements INode {
    constructor(private readonly blob: azureStorageTypings.services.blob.blobservice.BlobService.BlobResult,
                private readonly container: azureStorageTypings.services.blob.blobservice.BlobService.ContainerResult,
                private readonly blobService: azureStorageTypings.services.blob.blobservice.BlobService) {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: this.blob.name,
            command: {
                command: "azure-storage-explorer.getBlob",
                title: "",
                arguments: [this],
            },
            contextValue: "blob",
        };
    }

    public getChildren(azureAccount: AzureAccount): INode[] {
        return [];
    }

    public getBlob() {
        Utility.appendLine(JSON.stringify(this.blob, null, 2));
    }

    public downloadBlob() {
        this.blobService.getBlobToLocalFile(this.container.name, this.blob.name, "/Users/junhan/Desktop/Try/test/vsc-test.txt", (error, result, response) => {
            if (error) {
                vscode.window.showErrorMessage(error.message);
            } else {
                console.log(result);
                Utility.appendLine(JSON.stringify(result, null, 2));
                // vscode.window.showInformationMessage(result);
            }
        });
        vscode.window.showInformationMessage(this.blob.name);
    }
}
