<p align="center">
  <img width="1280" height="720" alt="Frame 134" src="https://raw.githubusercontent.com/AhmedJader/ht6/refs/heads/main/assets/hero.png" />
</p>

<h1 align="center">DevDoc</h1>

<p align="center">
  <strong>Stop writing outdated code. DevDoc is a VS Code extension that ensures your AI-generated code is always correct and secure by using a real-time documentation vector store.</strong>
</p>

<p align="center">
  <a href="URL_TO_MARKETPLACE"><img src="https://img.shields.io/visual-studio-marketplace/v/YOUR_PUBLISHER.devdoc?style=for-the-badge&label=VS%20Marketplace&color=blue" alt="VS Code Marketplace Version"></a>
  <a href="URL_TO_LICENSE"><img src="https://img.shields.io/github/license/YOUR_USERNAME/devdoc?style=for-the-badge&color=brightgreen" alt="License"></a>
  <a href="URL_TO_GITHUB_ACTIONS"><img src="https://img.shields.io/github/actions/workflow/status/YOUR_USERNAME/devdoc/main.yml?style=for-the-badge" alt="Build Status"></a>
</p>

---

### The Silent Risk of AI-Powered Development

In early 2025, a critical vulnerability (CVE-2025-29927) was discovered in Next.js, one of the world's most popular web frameworks. This flaw allowed attackers to completely bypass middleware authorization, gaining access to protected routes simply by manipulating an HTTP header. The vulnerability affected millions of applications, yet for months, AI coding assistants continued to generate the vulnerable code patterns because their training data was frozen in the past.

This is the ticking time bomb in modern development. AI tools like Cursor, GPTs, and Copilot accelerate our workflow but are inherently trained on outdated data. They generate code with deprecated functions, old configurations, and critical security holes that have since been patched. Relying on them is like building a futuristic car with a faulty engine from a decade ago.

### Our Solution: AI That Reads the Latest Docs

**DevDoc** is our answer to this problem. We are building a VS Code extension that bridges the gap between the power of AI and the pace of modern software documentation.

Instead of relying on a static, outdated model, DevDoc connects to a vector database that is continuously updated with the latest documentation from popular libraries and frameworks. When you ask DevDoc to generate code, it doesn't just guess based on old patterns—it consults the *current* official docs to provide code that is accurate, secure, and up-to-date.

The generated changes are presented in a clean diff editor, right in your IDE. You have the final say: review the correct, updated code and simply click **Accept** or **Reject**.

### ✨ Key Features

*   **⚡ Real-Time Documentation Sync:** Our vector database is constantly updated as major packages evolve, ensuring the AI is never out of sync with the latest standards.
*   **✅ Accurate & Secure Code Generation:** Eliminate bugs and vulnerabilities from outdated APIs and configurations. DevDoc knows about breaking changes so you don't have to.
*   **↔️ Interactive Diff Editor:** Seamlessly review, approve, or discard AI-generated changes without leaving your workflow. What you see is what you get.
*   **🧩 Seamless VS Code Integration:** Installs in seconds and lives in your side panel, ready whenever you need it.
*   **🚀 Support for Major Frameworks:** Starting with a focus on the most dynamic and widely-used technologies in the web development ecosystem.

### 🚀 Getting Started

#### 1. Installation

You can get DevDoc up and running in two ways:

*   **VS Code Marketplace (Recommended):**
    1.  Open the **Extensions** view in VS Code (`Ctrl+Shift+X`).
    2.  Search for `DevDoc`.
    3.  Click **Install**.

*   **Build from Source:**
    1.  Clone the repository: `git clone https://github.com/YOUR_USERNAME/devdoc.git`
    2.  Install dependencies: `npm install`
    3.  Press `F5` to open a new VS Code window with the extension running.

#### 2. How to Use

1.  Click the **DevDoc** icon in the Activity Bar on the side of VS Code to open the extension panel.
2.  In the input box, describe the code you want to generate or modify. Be specific!
    *   *Good Prompt:* "Create a Next.js middleware file that protects the `/dashboard` route and redirects unauthenticated users to `/login`."
    *   *Good Prompt:* "Generate the new Tailwind CSS v4 configuration for my project."
3.  DevDoc will analyze your request using the latest documentation and generate the required code.
4.  A **diff editor** will appear showing the proposed changes (additions in green, deletions in red).
5.  Review the changes and click **Accept** to apply them to your files or **Reject** to discard them.

### Examples in Action

See how DevDoc prevents common issues caused by other AI tools.

#### Example 1: Tailwind CSS v4 Configuration

Many AI tools are still trained on data from before Tailwind CSS v4, which introduced a major change to the configuration file.

**❌ Outdated Code (from other AI tools):**
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**✅ Correct Code (from DevDoc):**
DevDoc knows that `tailwind.config.js` is no longer the primary method and that you should use `@import` in your main CSS file. It would guide you to create the correct setup:

```css
/* main.css */
@import 'tailwindcss';

@theme {
  /* Your theme extensions here */
}
```
*And provide instructions to update your `postcss.config.js` if necessary.*

#### Example 2: Next.js Secure Middleware

Using outdated patterns for Next.js middleware can expose critical security vulnerabilities.

**❌ Vulnerable Code (from other AI tools):**
An AI unaware of the CVE-2025-29927 patch might generate middleware that is bypassable. The vulnerability isn't in the code itself, but in the environment it runs on. DevDoc would ensure you're using a secure version and pattern.

**✅ Secure Guidance (from DevDoc):**
DevDoc would not only generate the correct middleware logic but also check your `package.json` and warn you if your `next` version is vulnerable.

```javascript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Your authentication logic here...
  const isAuthenticated = checkAuth(request);

  if (!isAuthenticated && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}
```
***And it would add a warning:*** "⚠️ **Security Alert:** Your `next` version is outdated and vulnerable to CVE-2025-29927. Please update to version `14.2.25` or newer."

### 🤝 Contributing

We are building DevDoc as an open-source project and welcome all contributions! Whether you want to fix a bug, add support for a new framework, or improve the documentation, we'd love your help.

*   **Report Issues:** Find a bug? Please create an issue on our [GitHub Issues](URL_TO_GITHUB_ISSUES) page.
*   **Suggest Features:** Have an idea? We'd love to hear it! Create an issue and let's discuss.
*   **Submit Pull Requests:** Please feel free to fork the repo and submit a PR. For major changes, please open an issue first to discuss what you would like to change.

Please read our `CONTRIBUTING.md` for more details on our code of conduct and the process for submitting pull requests.

### 📝 License

This project is licensed under the **MIT License**. See the [LICENSE](URL_TO_LICENSE) file for details.
