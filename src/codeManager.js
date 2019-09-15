Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const path_1 = require("path");
const vscode = require("vscode");
const fs = require("fs");
const TmpDir = os.tmpdir();
class CodeManager {
    constructor() {
        this._terminalList = [];
        this._config = vscode.workspace.getConfiguration("q-runner");
    }
    onDidCloseTerminal() {
        this._terminalList = null;
    }
    execInitCmd(terminal) {
        const initWinGitBashCmd = this._config.get('initWinGitBashCmd');
        terminal.sendText(initWinGitBashCmd);
    }
    createTerminal() {
        const newTerminal = vscode.window.createTerminal('runQ ' + (this._terminalList.length + 1));
        this._terminalList.push(newTerminal);
        this.execInitCmd(newTerminal);
        newTerminal.show();
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
        if (this.parenthesesAreBalanced(command)) {
            return command;
        } else {
            vscode.window.showErrorMessage('Imbalanced Brackets or Parentheses in Selection');
            return '0N!`$"ERROR: Executing Selection; Imbalanced Brackets or Parentheses";';
        }
    }
    getWorkspaceFolder(editor) {
        const doc = editor.document;
        if (vscode.workspace.workspaceFolders) {
            if (doc) {
                const workspaceFolder = vscode.workspace.getWorkspaceFolder(doc.uri);
                if (workspaceFolder) {
                    return workspaceFolder.uri.fsPath;
                }
            }
            return vscode.workspace.workspaceFolders[0].uri.fsPath;
        }
        else {
            return undefined;
        }
    }
    getAndExecuteTmpFile(editor) {
        let tmpCodeFilePath = this._config.get('tmpCodeFilePath');
        if (tmpCodeFilePath.isEmpty || tmpCodeFilePath === "") {
            tmpCodeFilePath = this._config.get('exportPath');
        }
        if (tmpCodeFilePath.isEmpty || tmpCodeFilePath === "") {
            tmpCodeFilePath = this.getWorkspaceFolder(editor);
        }
        if (tmpCodeFilePath.isEmpty || tmpCodeFilePath === "") {
            tmpCodeFilePath = path_1.dirname(editor.document.fileName);
        }
        if (tmpCodeFilePath.isEmpty || tmpCodeFilePath === "") {
            tmpCodeFilePath = TmpDir;
        }
        tmpCodeFilePath = tmpCodeFilePath[tmpCodeFilePath.length - 1] === '/' 
            ? tmpCodeFilePath
            : tmpCodeFilePath + '/';
        
        const commandText = editor.selection.isEmpty ? editor.document.getText() : editor.document.getText(editor.selection);
        this.createRandomFile(commandText, tmpCodeFilePath);
        
    }
    rndName() {
        return new Date().toISOString().replace(/[-:.]/g, '_');
    }
    createRandomFile(content, folder) {
        const tmpFileName = "tmp_" + this.rndName() + ".q";
        this._codeFile = path_1.join(folder, tmpFileName);
        fs.writeFileSync(this._codeFile, content);
    }
    qExportFn(tmpName) {
        let exportPath = this._config.get('exportPath');
        if (exportPath.isEmpty || exportPath === "") {
            exportPath = './export/';
        } else {
            exportPath = exportPath[exportPath.length - 1] === '/' 
                ? exportPath + 'export/'
                : exportPath + '/export/';
        }
        console.log(exportPath);
        return '@[{show `$"Exporting to ",(string x), "...";save x; show `$"Exporting....Done";delete ' + tmpName + ' from `.};'
            + '`$"' + exportPath + tmpName + '.csv";'
            + '{show `$"ERROR: ",x;show `$raze "ERROR: Exporting to ", (system "pwd"), "/export; Not a Table? Access?";delete ' + tmpName + ' from `.}];';
    }
    qExecuteForExport(tmpName, command) {
        const exec = tmpName + ':: { ' + command + ' }[]; ';
        const ret = '@[{show `$"Executing Selection..."; ' + exec + ';show `$"Executing Selection...Done"};1b;'
            + '{show `$"ERROR: ",x;show `$"ERROR: Executing Selection; Try Run Selection First Before Exporting"}];';
        return ret;
    }
    qExportParser(editor) {
        const command = this.qParser(editor);
        const tmpName = 'runQExport_' + this.rndName();
        const exportComm = this.qExecuteForExport(tmpName, command) + this.qExportFn(tmpName);
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