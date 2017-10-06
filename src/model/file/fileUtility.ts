import azureStorage = require("azure-storage");
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import * as azureStorageTypings from "../../../node_modules/azure-storage/typings/azure-storage/azure-storage";
import { AzureAccount } from "../../azure-account.api";
import { StorageTreeDataProvider } from "../../storageTreeDataProvider";
import { DirectoryNode } from "./directoryNode";
import { FileNode } from "./fileNode";
import { InfoNode } from "../infoNode";
import { INode } from "../INode";

export class FileUtility {
    public static listFilesAndDirectories(fileShare: azureStorageTypings.services.file.FileService.ShareResult,
        fileService: azureStorageTypings.services.file.FileService,
        fileShareOrDirectoryNode: INode,
        directoryPath: string): Promise<INode[]> {
        return new Promise<INode[]>((resolve, reject) => {
            fileService.listFilesAndDirectoriesSegmented(fileShare.name, directoryPath, null, (error, result, response) => {
                if (error) {
                    resolve([new InfoNode(`Failed to list files and directories: ${error})`)]);
                }
                const fileNodes = result.entries.files.map((file) => {
                    return new FileNode(file, directoryPath, fileShare, fileService, fileShareOrDirectoryNode);
                });
                const directoryNodes = result.entries.directories.map((directory) => {
                    return new DirectoryNode(directory, directoryPath, fileShare, fileService, fileShareOrDirectoryNode);
                });
                resolve([...fileNodes, ...directoryNodes]);
            });
        });
    }
}
