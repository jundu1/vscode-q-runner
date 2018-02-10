Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class QDocumentSymbolProvider {
    constructor() {
        this.kind = vscode_1.SymbolKind.Variable;
    }
    
    async provideDocumentSymbols(document, token) {
        try {
            const txt = document.getText();
            const symbols = [];
            const splitedLines = txt.split(/\r?\n/) || ""; 
            for (let i = 0; i < splitedLines.length; i++) {
                const varRegex = /((?=([^a-zA-Z0-9]|\b))((\.*)+[a-zA-Z]+[a-zA-Z0-9_\.]*):)/g;
                const match = varRegex.exec(splitedLines[i]);
                if (match && match.index === 0)
                {
                    symbols.push(new vscode_1.SymbolInformation(match[0], this.kind, '', new vscode_1.Location(document, new vscode_1.Position(i, 0))));
                }
            }
            // TODO: detect range for nested tree structure
            // let testTmp = new vscode_1.SymbolInformation('tmp', this.kind, '', new vscode_1.Location(document, new vscode_1.Range(1, 0, 5, 3)));
            // symbols.push(testTmp);
            return symbols;
        }
        catch (e) {
            return [];
        }
    }
}
exports.QDocumentSymbolProvider = QDocumentSymbolProvider;
