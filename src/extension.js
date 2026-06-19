const vscode = require("vscode");
const {
  classifyTypeCost,
  flattenHoverText,
  truncate
} = require("./typeCost");

const SUPPORTED_LANGUAGES = new Set(["typescript", "typescriptreact"]);

function activate(context) {
  const disposable = vscode.commands.registerCommand(
    "tsTypeCostLens.measureTypeAtCursor",
    measureTypeAtCursor
  );

  context.subscriptions.push(disposable);
}

async function measureTypeAtCursor() {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showInformationMessage("Open a TypeScript file first.");
    return;
  }

  const { document, selection } = editor;

  if (!SUPPORTED_LANGUAGES.has(document.languageId)) {
    vscode.window.showInformationMessage(
      "TS Type Cost Lens works with TypeScript and TSX files."
    );
    return;
  }

  const position = selection.active;
  const started = performance.now();

  const hovers = await vscode.commands.executeCommand(
    "vscode.executeHoverProvider",
    document.uri,
    position
  );

  const elapsedMs = performance.now() - started;
  const hoverText = flattenHoverText(hovers);
  const textLength = hoverText.length;
  const label = classifyTypeCost(elapsedMs, textLength);

  const report = [
    `TS Type Cost Lens`,
    ``,
    `File: ${document.fileName}`,
    `Position: ${position.line + 1}:${position.character + 1}`,
    `Hover latency: ${elapsedMs.toFixed(2)} ms`,
    `Type text length: ${textLength} characters`,
    `Complexity label: ${label}`,
    ``,
    `Preview:`,
    truncate(hoverText || "(no hover text returned)", 1200)
  ].join("\n");

  const output = getOutputChannel();
  output.clear();
  output.appendLine(report);
  output.show(true);

  vscode.window.showInformationMessage(
    `Type cost: ${label} (${elapsedMs.toFixed(0)} ms, ${textLength} chars)`
  );
}

let outputChannel;

function getOutputChannel() {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel("TS Type Cost Lens");
  }
  return outputChannel;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
  _internal: {
    classifyTypeCost,
    flattenHoverText,
    truncate
  }
};
