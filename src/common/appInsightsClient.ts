"use strict";
import appInsights = require("applicationinsights");
import * as vscode from "vscode";
import { Utility } from "./utility";

export class AppInsightsClient {
    public static sendEvent(eventName: string, properties?: { [key: string]: string; }): void {
        if (this._enableTelemetry) {
            this._client.trackEvent(eventName, properties);
        }
    }

    private static _client = appInsights.getClient("59e02958-e856-422b-97c0-caf495a4194d");
    private static _enableTelemetry = Utility.getConfiguration().get<boolean>("enableTelemetry");
}
