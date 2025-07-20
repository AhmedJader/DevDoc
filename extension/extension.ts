import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

// Use a 'require' statement for 'node-fetch' to ensure CommonJS compatibility,
// which is required for VS Code extensions.
// Make sure you have installed the compatible version: npm install node-fetch@2 @types/node-fetch@2
const fetch = require("node-fetch");

// Import the Response type for better type-checking of the fetch response.
const { Response } = require("node-fetch");

/**
 * !!! IMPORTANT !!!
 * This URL points to your local development server.
 * When you deploy, change this to your actual Vercel application URL.
 */
const VERCEL_BACKEND_URL = `http://localhost:3000/api/chat`;

/**
 * This function is called when your extension is activated.
 * It's the main entry point for the extension.
 * @param {vscode.ExtensionContext} context - The context provided by VS Code.
 */
export async function activate(context: vscode.ExtensionContext) {
  // Register the DevDocViewProvider, which is responsible for creating and managing the webview panel.
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "devdoc.panel", // This ID must match the one in your package.json
      new DevDocViewProvider(context)
    )
  );
}

/**
 * This class manages the state and behavior of the DevDoc webview.
 */
class DevDocViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly context: vscode.ExtensionContext) {}

  /**
   * This method is called when a webview needs to be resolved.
   * It sets up the webview's initial HTML content and handles communication.
   * @param {vscode.WebviewView} webviewView - The webview instance to resolve.
   */
  public resolveWebviewView(webviewView: vscode.WebviewView) {
    const webview = webviewView.webview;

    // Configure webview options
    webview.options = {
      // Enable scripts in the webview
      enableScripts: true,
      // Restrict the webview to only load resources from the 'webview-static' directory
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, "webview-static"),
      ],
    };

    // --- Start of Corrected HTML Path Logic ---

    // Load the HTML file from your Next.js build output
    const htmlPath = vscode.Uri.joinPath(
      this.context.extensionUri,
      "webview-static",
      "index.html"
    );
    const htmlContent = fs.readFileSync(htmlPath.fsPath, "utf8");

    // Get the base URI for all assets in the webview-static folder.
    // This will be something like: vscode-webview://<id>/path/to/your/extension/webview-static
    const baseUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "webview-static")
    );

    // Use a smarter regex to replace all absolute paths (e.g., src="/_next/...")
    // with the correct webview-compatible URI, preserving the HTML attributes.
    const finalHtml = htmlContent.replace(
      /(src|href)="(\/[^"]*)"/g,
      `$1="${baseUri}$2"`
    );

    // Set the webview's HTML content with the corrected paths
    webview.html = finalHtml;

    // --- End of Corrected HTML Path Logic ---

    // Set up a listener for messages sent from the webview (your frontend)
    webview.onDidReceiveMessage(async (message) => {
      if (message.type === "chat-request") {
        const { messages, model } = message.value;

        try {
          // Use node-fetch to make a POST request to your Vercel/local backend.
          // This runs in a Node.js environment, so it is NOT subject to CORS.
          const res: typeof Response = await fetch(VERCEL_BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages, model }),
          });

          // If the response status is not 'ok' (e.g., 401, 403, 500), it's an error.
          if (!res.ok) {
            // Read the error message from the backend response for better debugging.
            const errorText = await res.text();
            throw new Error(
              `Request failed with status ${res.status}: ${errorText}`
            );
          }

          // Ensure the response body exists before trying to read it.
          if (!res.body) {
            throw new Error("Response body is empty.");
          }

          // The response from the backend is a stream. We need to read it in chunks.
          const reader = res.body;
          const decoder = new TextDecoder();

          // Listen for 'data' events on the stream.
          reader.on("data", (chunk: Buffer) => {
            const decodedChunk = decoder.decode(chunk, { stream: true });
            // Send each chunk of data back to the webview as it arrives.
            webview.postMessage({
              type: "response-chunk",
              value: decodedChunk,
            });
          });

          // Listen for the 'end' event, which signifies the stream is complete.
          reader.on("end", () => {
            webview.postMessage({ type: "response-end" });
          });
        } catch (err: any) {
          // If any error occurs during the fetch or streaming, catch it.
          console.error("Error fetching from backend:", err);
          // Send a descriptive error message back to the webview to display to the user.
          webview.postMessage({
            type: "response-error",
            value: `[Backend Proxy Error] ${err.message}`,
          });
        }
      }
    });
  }
}
