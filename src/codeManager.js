Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const path_1 = require("path");
const vscode = require("vscode");
// const appInsightsClient_1 = require("./appInsightsClient");
const TmpDir = os.tmpdir();
class CodeManager {
    constructor() {
        this._terminalList = [];
        this._config = vscode.workspace.getConfiguration("q-runner");
    }
    onDidCloseTerminal() {
        this._terminalList = null;
    }
    sshKerberosTerminal(terminal) {
        let options = {
            password: true,
            placeHolder: "Kerberos Password",
            prompt: "Enter Kerberos Password",
            ignoreFocusOut: true
        }
        const initWinGitBashCmd = this._config.get('initWinGitBashCmd');
        const initUnixCmd = this._config.get('initUnixCmd');
        const initKerberosHost = this._config.get('initKerberosHost');
        vscode.window.showInputBox(options).then( (pw) => {
            terminal.sendText(initWinGitBashCmd);
            terminal.sendText('ssh '+ initKerberosHost);
            terminal.sendText(pw);
            terminal.sendText(initUnixCmd);
            terminal.show();
        });
    }
    createTerminal() {
        const newTerminal = vscode.window.createTerminal('runQ ' + (this._terminalList.length + 1));
        this._terminalList.push(newTerminal);
        this.sshKerberosTerminal(newTerminal);
    }
    disposeLastTerminal() {
        if (this._terminalList.length === 0) {
            vscode.window.showErrorMessage('No active runQ terminals');
        } else 
        {
            this._terminalList[length-1].dispose();
            this._terminalList.pop();
        }        
    }
    getTerminalById(termId) {
        if (this._terminalList.length === 0) {
            vscode.window.showErrorMessage('No active runQ terminals');
            return;
        } else if (this._terminalList[termId - 1] === null || this._terminalList[termId - 1] === undefined) {
            vscode.window.showErrorMessage('Terminal runQ ' + termId + ' not defined');
            return;
        }
        this._terminalList[termId - 1].show(true);
        return this._terminalList[termId - 1];
    }
    runSelectionInLastTerminal(){
        this.runSelectionInTerminal(this._terminalList.length);
    }
    runSelectionInTerminal(termId){
        const editor = vscode.window.activeTextEditor;
        this.getTerminalById(termId).sendText(this.qParser(editor));
    }
    runAndExportInLastTerminal(){
        this.runAndExportInTerminal(this._terminalList.length);
    }
    runAndExportInTerminal(termId){
        const editor = vscode.window.activeTextEditor;
        this.getTerminalById(termId).sendText(this.qExportParser(editor));
    }
    removeComments(txt) {
        if (txt.startsWith('/')) {
            return '';
        }
        const comm = txt.split(' /')[0];
        return comm;
    }
    qParser(editor) {
        let command = '';
        const commandText = editor.selection.isEmpty ? editor.document.getText() : editor.document.getText(editor.selection);
        const splitedLines = commandText.match(/[^\r\n]+/g) || "";
        for (let i = 0; i < splitedLines.length; i++) {
            command += this.removeComments(splitedLines[i]) + ' ';
        }
        // return command;
        // TODO: check balanced parentheses 
        if (this.parenthesesAreBalanced(command)) {
            return command;
        } else {
            vscode.window.showErrorMessage('Imbalanced Brackets or Parentheses in Selection');
            return '0N!`$"ERROR: Executing Selection; Imbalanced Brackets or Parentheses";';
        }
    }
    qExportFn(tmpVar) {
        let exportPath = this._config.get('exportPath');
        console.log(exportPath);
        if (exportPath.isEmpty || exportPath === "") {
            exportPath = './export/';
        } else {
            exportPath = exportPath[exportPath.length - 1] === '/' 
                ? exportPath + 'export/'
                : exportPath + '/export/';
        }
        console.log(exportPath);
        return '@[{show `$"Exporting to ",(string x), "...";save x; show `$"Exporting....Done";delete ' + tmpVar + ' from `.};'
            + '`$"' + exportPath + tmpVar + '.csv";'
            + '{show `$"ERROR: ",x;show `$raze "ERROR: Exporting to ", (system "pwd"), "/export; Not a Table? Access?";delete ' + tmpVar + ' from `.}];';
    }
    qExecuteForExport(tmpVar, command) {
        const exec = tmpVar + ':: { ' + command + ' }[]; ';
        const ret = '@[{show `$"Executing Selection..."; ' + exec + ';show `$"Executing Selection...Done"};1b;'
            + '{show `$"ERROR: ",x;show `$"ERROR: Executing Selection; Try Run Selection First Before Exporting"}];';
        return ret;
    }
    qExportParser(editor) {
        const command = this.qParser(editor);
        const dateTimeString = new Date().toISOString().replace(/[-:.]/g, '_');
        const tmpVar = 'runQExport_' + dateTimeString;
        const exportComm = this.qExecuteForExport(tmpVar, command) + this.qExportFn(tmpVar);
        return exportComm;
    }
    parenthesesAreBalanced(checkStr) {
        const parentheses = "[]{}()";
        let stack = [], 
        i, character, bracePosition, 
        isInQuotation = false;
        for (i = 0; character = checkStr[i]; i++) {
            // check if is in quotation now 
            if (character === '"' && checkStr[i-1] != '\\') {
                isInQuotation = !isInQuotation;
            }
            // check balance
            bracePosition = parentheses.indexOf(character);
            if(bracePosition === -1 || isInQuotation) {
                continue;
            }
            if(bracePosition % 2 === 0) {
                stack.push(bracePosition + 1); // push next expected brace position
            } else {
                if(stack.length === 0 || stack.pop() !== bracePosition) {
                return false;
                }
            }
        }
        return stack.length === 0;
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