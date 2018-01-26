
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const os = require("os");
const path_1 = require("path");
const vscode = require("vscode");
// const appInsightsClient_1 = require("./appInsightsClient");
const TmpDir = os.tmpdir();
class CodeManager {
    constructor() {
        this._outputChannel = vscode.window.createOutputChannel("Code");
        // this._terminal =  vscode.window.activeTerminal();
        // this._appInsightsClient = new appInsightsClient_1.AppInsightsClient();
    }
    onDidCloseTerminal() {
        this._terminal = null;
    }
    changeFilePathForBashOnWindows(command) {
        if (os.platform() === "win32") {
            const windowsShell = vscode.workspace.getConfiguration("terminal").get("integrated.shell.windows");
            const terminalRoot = this._config.get("terminalRoot");
            if (windowsShell && terminalRoot) {
                command = command
                    .replace(/([A-Za-z]):\\/g, (match, p1) => `${terminalRoot}${p1.toLowerCase()}/`)
                    .replace(/\\/g, "/");
            }
            else if (windowsShell && windowsShell.toLowerCase().indexOf("bash") > -1 && windowsShell.toLowerCase().indexOf("windows") > -1) {
                command = command.replace(/([A-Za-z]):\\/g, this.replacer).replace(/\\/g, "/");
            }
        }
        return command;
    }
}
exports.CodeManager = CodeManager;