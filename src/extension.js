// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const codeManager_1 = require("./codeManager");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let terminalStack = [];

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "q-runner" is now active!');

    const codeManager = new codeManager_1.CodeManager();
    vscode.window.onDidCloseTerminal(() => {
        codeManager.onDidCloseTerminal();
    });
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('extension.sayHello', function () {
        vscode.window.showInformationMessage('Hello World!');
    });
    const disposable1 = vscode.commands.registerCommand('q-runner.sayHello1', function () {
        vscode.window.showInformationMessage('Hello World 1!');
    });
    const createTerminal = vscode.commands.registerCommand('q-runner.createTerminal', function() {
        terminalStack.push(vscode.window.createTerminal('runQ ' + (terminalStack.length + 1) ));
        getLatestTerminal().show();
    });
    context.subscriptions.push(vscode.commands.registerCommand('q-runner.sendText', function () {
		if (terminalStack.length === 0) {
			vscode.window.showErrorMessage('No active terminals');
		}
		getLatestTerminal().sendText("echo 'Hello world!'");
	}));

    context.subscriptions.push(disposable);
    context.subscriptions.push(disposable1);
    context.subscriptions.push(createTerminal);

    function getLatestTerminal() {
        return terminalStack[terminalStack.length - 1];
}
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;