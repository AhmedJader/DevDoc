import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'devdoc.panel',
      new DevDocViewProvider()
    )
  );
}

class DevDocViewProvider implements vscode.WebviewViewProvider {
  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = `
      <!DOCTYPE html>
      <html><body style="margin:0">
        <iframe src="http://localhost:3000" style="width:100vw;height:100vh;border:none;"></iframe>
      </body></html>
    `;
  }
}
