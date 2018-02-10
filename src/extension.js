// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const codeManager_1 = require("./codeManager");
const symbolManager_1 = require("./symbolManager");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    const codeManager = new codeManager_1.CodeManager();
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider( 
        {language: 'q', scheme: 'file'}, 
        new symbolManager_1.QDocumentSymbolProvider())),
    // context.subscriptions.push(vscode.languages.registerWorkspaceSymbolProvider(new symbolManager_1.QWorkspaceSymbolProvider()));
    
    context.subscriptions.push(vscode.commands.registerCommand('q-runner.createTerminal', () => {
        codeManager.createTerminal()
    }));
    context.subscriptions.push(vscode.commands.registerCommand('q-runner.runSelectionInLastTerminal', () => {
        codeManager.runSelectionInLastTerminal()
    }));
    context.subscriptions.push(vscode.commands.registerCommand('q-runner.runAndExportInLastTerminal', () => {
        codeManager.runAndExportInLastTerminal()
    }));
    context.subscriptions.push(vscode.commands.registerCommand('q-runner.runSelectionInRunQ_1', () => {
        codeManager.runSelectionInTerminal(1)
    }));
    context.subscriptions.push(vscode.commands.registerCommand('q-runner.runSelectionInRunQ_2', () => {
        codeManager.runSelectionInTerminal(2)
    }));
    context.subscriptions.push(vscode.commands.registerCommand('q-runner.runSelectionInRunQ_3', () => {
        codeManager.runSelectionInTerminal(3)
    }));
    context.subscriptions.push(vscode.commands.registerCommand('q-runner.runSelectionInRunQ_4', () => {
        codeManager.runSelectionInTerminal(4)
    }));
    context.subscriptions.push(vscode.commands.registerCommand('q-runner.runSelectionInRunQ_5', () => {
        codeManager.runSelectionInTerminal(5)
    }));
    context.subscriptions.push(vscode.commands.registerCommand('q-runner.runSelectionInRunQ_6', () => {
        codeManager.runSelectionInTerminal(6)
    }));
    context.subscriptions.push(vscode.commands.registerCommand('q-runner.runAndExportInRunQ_1', () => {
        codeManager.runAndExportInTerminal(1)
    }));
    context.subscriptions.push(vscode.commands.registerCommand('q-runner.runAndExportInRunQ_2', () => {
        codeManager.runAndExportInTerminal(2)
    }));
    context.subscriptions.push(vscode.commands.registerCommand('q-runner.runAndExportInRunQ_3', () => {
        codeManager.runAndExportInTerminal(3)
    }));
    context.subscriptions.push(vscode.commands.registerCommand('q-runner.runAndExportInRunQ_4', () => {
        codeManager.runAndExportInTerminal(4)
    }));
    context.subscriptions.push(vscode.commands.registerCommand('q-runner.runAndExportInRunQ_5', () => {
        codeManager.runAndExportInTerminal(5)
    }));
    context.subscriptions.push(vscode.commands.registerCommand('q-runner.runAndExportInRunQ_6', () => {
        codeManager.runAndExportInTerminal(6)
    }));

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;