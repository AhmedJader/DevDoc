import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();


export async function activate(context: vscode.ExtensionContext) {
  // 🔑 Check if key exists
  const key = await context.secrets.get('openai-api-key');

  if (!key) {
    const enteredKey = await vscode.window.showInputBox({
      prompt: 'Enter your OpenAI API key',
      placeHolder: 'sk-...',
      ignoreFocusOut: true,
      password: true,
    });

    if (enteredKey) {
      await context.secrets.store('openai-api-key', enteredKey);
      vscode.window.showInformationMessage('✅ API key saved securely.');
    } else {
      vscode.window.showErrorMessage('❌ OpenAI key not provided.');
      return;
    }
  }

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'devdoc.panel',
      new DevDocViewProvider(context)
    )
  );
}


class DevDocViewProvider implements vscode.WebviewViewProvider {
  

  constructor(private readonly context: vscode.ExtensionContext) {
    // delay actual key access until resolveWebviewView
  }

  async resolveWebviewView(webviewView: vscode.WebviewView) {
    const webview = webviewView.webview;

    webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, 'webview-static'),
      ],
    };

    const indexPath = path.join(
      this.context.extensionPath,
      'webview-static',
      'index.html'
    );

    let html = fs.readFileSync(indexPath, 'utf-8');
    html = html.replace(
      /"\/_next\//g,
      `"${webview.asWebviewUri(
        vscode.Uri.joinPath(this.context.extensionUri, 'webview-static', '_next')
      )}/`
    );
    html = html.replace(
      /"\/favicon.ico/g,
      `"${webview.asWebviewUri(
        vscode.Uri.joinPath(this.context.extensionUri, 'webview-static', 'favicon.ico')
      )}`
    );

    webviewView.webview.html = html;

    // ✅ get key securely
    const key = await this.context.secrets.get('openai-api-key');
    if (!key) {
      vscode.window.showErrorMessage('❌ Missing OpenAI API key.');
      return;
    }

    // ✅ Handle messages
    webviewView.webview.onDidReceiveMessage(async (message) => {
      if (message.type === 'ask-openai') {
        const { messages } = message.value;

        try {
          const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${key}`, // ← secure use here
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              messages,
            }),
          });

          const json: any = await res.json();
          const reply = json.choices?.[0]?.message?.content ?? '⚠️ No reply received.';
          webviewView.webview.postMessage({ type: 'openai-response', value: reply });
        } catch (err) {
          webviewView.webview.postMessage({
            type: 'openai-response',
            value: '❌ Failed to contact OpenAI.',
          });
        }
      }
    });
  }
}


