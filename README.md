# Azure Storage Explorer

Azure Storage Explorer for VS Code. Currently, it supports management of Azure Blob storage.

## Features

* List Subscriptions
* List Storage Accounts
* List Blob Contianers
* Create Blob Container
* Delete Blob Container
* List Blobs
* View Blob information
* downloadBlob
* uploadBlob
* deleteBlob

## Prerequisites

* An Azure Subscription. If you don't have, click [here](https://azure.microsoft.com/en-us/free/) to get a free one.

## Usage

1. Click to sign in 
    
  ![sign-in](images/sign-in.png)

2. After sign-in, click the `+` button to select Azure Subscription
3. Wait for a moment, the Blob storage list will be shown

  ![explorer](images/explorer.png)

## Telemetry data

By default, anonymous telemetry data collection is turned on to understand user behavior to improve this extension. To disable it, update the settings.json as below:
```json
{
    "azure-storage-explorer.enableTelemetry": false
}
```

## Change Log

See Change Log [here](CHANGELOG.md)

## Issues

Currently, the extension is in the very initial phase. If you find any bug or have any suggestion/feature request, please submit the [issues](https://github.com/formulahendry/vscode-azure-storage-explorer/issues) to the GitHub Repo.
