// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const codeManager_1 = require("./codeManager");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "q-runner" is now active!');

    const codeManager = new codeManager_1.CodeManager();
    // vscode.window.onDidCloseTerminal(() => {
    //     codeManager.onDidCloseTerminal();
    // });
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json

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