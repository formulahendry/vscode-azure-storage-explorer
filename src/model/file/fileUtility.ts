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

    public static async uploadFile(storageTreeDataProvider: StorageTreeDataProvider,
        fileShare: azureStorageTypings.services.file.FileService.ShareResult,
        fileService: azureStorageTypings.services.file.FileService,
        fileShareOrDirectoryNode: INode,
        directoryPath: string) {
        const options: vscode.OpenDialogOptions = {
            openLabel: "Upload",
        };
        const filePathUri = await vscode.window.showOpenDialog(options);
        if (!filePathUri) {
            return;
        }

        const filePath = filePathUri[0].fsPath;
        if (!fs.existsSync(filePath)) {
            vscode.window.showWarningMessage(`${filePath} does not exist.`);
            return;
        }
        const fileName = path.basename(filePath);
        if (!fileName) {
            return;
        }
        vscode.window.withProgress({
            title: `Uploading ${filePath} to ${fileShare.name} ...`,
            location: vscode.ProgressLocation.Window,
        }, async (progress) => {
            await new Promise((resolve, reject) => {
                fileService.createFileFromLocalFile(fileShare.name, directoryPath, fileName, filePath, (error, result, response) => {
                    if (error) {
                        vscode.window.showErrorMessage(error.message);
                        reject(error.message);
                    } else {
                        storageTreeDataProvider.refresh(fileShareOrDirectoryNode);
                        resolve();
                    }
                });
            });
        });
    }

    public static async createDirectory(storageTreeDataProvider: StorageTreeDataProvider,
        fileShare: azureStorageTypings.services.file.FileService.ShareResult,
        fileService: azureStorageTypings.services.file.FileService,
        fileShareOrDirectoryNode: INode,
        directoryPath: string) {
        vscode.window.showInputBox({
            prompt: "Enter directory name",
        }).then(async (directoryName: string) => {
            if (!directoryName) {
                return;
            }
            vscode.window.withProgress({
                title: `Creating directory [${directoryName}] ...`,
                location: vscode.ProgressLocation.Window,
            }, async (progress) => {
                await new Promise((resolve, reject) => {
                    fileService.createDirectoryIfNotExists(fileShare.name, path.join(directoryPath, directoryName), (error, result, response) => {
                        if (error) {
                            vscode.window.showErrorMessage(error.message);
                            reject(error.message);
                        } else {
                            storageTreeDataProvider.refresh(fileShareOrDirectoryNode);
                            resolve();
                        }
                    });
                });
            });
        });
    }
}
