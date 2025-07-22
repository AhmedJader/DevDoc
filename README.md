<p align="center">
  <img width="1280" height="720" alt="Frame 134" src="https://github.com/AhmedJader/DevDoc/blob/main/public/devdoc.png" />
</p>

<h1 align="center">DevDoc</h1>

<p align="center">
  <a href="https://devdoc-ai.vercel.app/" target="_blank"><strong>🚀 VISIT THE LANDING PAGE</strong></a>
</p>


<p align="center">
  <strong>Stop writing outdated code. DevDoc is a VS Code extension that ensures your AI-generated code is always correct and secure by using a real-time documentation vector store.</strong>
</p>

<p align="center">
  <!-- VS Code Marketplace Version -->
  <a href="https://marketplace.visualstudio.com/items?itemName=dev-doc.dev-doc">
    <img src="https://img.shields.io/visual-studio-marketplace/v/dev-doc.dev-doc?style=for-the-badge&label=VS%20Marketplace&color=blue" alt="VS Code Marketplace Version">
  </a>

 <!-- VS Code Marketplace Rating -->
  <a href="https://marketplace.visualstudio.com/items?itemName=dev-doc.dev-doc">
    <img src="https://img.shields.io/badge/RAG-Enabled-brightgreen?style=for-the-badge&logo=brain&logoColor=white" alt="RAG-based AI">
  </a>

  <!-- GitHub Actions CI Status (customize USERNAME and REPO) -->
  <a href="https://devpost.com/software/devdoc-c4xwkv">
  <img src="https://img.shields.io/badge/DevPost-Project-0A0A23?style=for-the-badge&logo=devpost&logoColor=white" alt="DevPost">
</a>

</p>


# 🧠 DevDoc – Real-Time Docs Meet AI Coding

> Stop using stale AI. DevDoc brings **live docs** into your code suggestions.

In 2025, a major Next.js vulnerability (CVE-2025-29927) exposed how dangerous outdated AI tools can be. While most coding assistants kept generating vulnerable patterns, **DevDoc** ensures your code is **secure**, **accurate**, and **up-to-date**—always.

DevDoc is a VS Code extension that combines OpenAI’s GPT-4o with **real-time documentation embeddings**. Instead of guessing from frozen training data, it pulls live documentation from frameworks like Next.js, Tailwind CSS, and more—so your AI code suggestions actually match today’s APIs, not last year’s.

---

## ⚙️ How It Works

- 🧠 **LLM + RAG**: GPT-4o + vector search over live, embedded docs.
- 🧩 **Framework-Aware**: Understands breaking changes in tools like Tailwind CSS v4 and Next.js middleware.
- 🛠️ **Tool Calls**: Fetch specific docs, versions, or security warnings when needed.
- ✍️ **Diff Viewer UI**: Review and apply code suggestions from inside your IDE.
- 🔐 **Secure-by-Default**: Warns you about known CVEs and deprecated patterns.

---

## 🚀 Why DevDoc Wins

| Feature                        | **DevDoc**                      | Copilot       | Cursor         | Context7       | CodeWhisperer     |
|-------------------------------|----------------------------------|---------------|----------------|----------------|--------------------|
| 📚 Real-Time Docs             | ✅ Yes                          | ❌ No         | ❌ No          | ⚠️ Local only   | ❌ No               |
| 🧠 Vector Context             | ✅ Full doc retrieval           | ⚠️ Partial    | ✅ Local indexing | ✅ Current file+ | ⚠️ Limited          |
| ⚙️ Tool Calls (Agentic)       | ✅ Yes                          | ❌ No         | ❌ No          | ❌ No           | ❌ No               |
| 🔍 CVE Detection              | ✅ Yes                          | ❌ No         | ❌ No          | ❌ No           | ❌ No               |
| 💬 IDE Chat Panel             | ✅ Yes                          | ✅ Yes        | ✅ Yes         | ⚠️ Minimal      | ✅ Yes              |
| 🔄 Diff-Based Suggestions     | ✅ Inline preview               | ❌ No         | ✅ Yes         | ❌ No           | ❌ No               |
| 🛠️ Custom Docs & Tools       | ✅ Embeddable & extendable      | ❌ No         | ❌ No          | ⚠️ Manual inject | ❌ No               |
| 📦 Framework Awareness        | ✅ Tailwind v4, Next.js 14+     | ❌ Outdated   | ⚠️ Partial     | ⚠️ Local only   | ⚠️ Java-focused     |
| 🛰️ Open Source               | ✅ Fully open                   | ❌ Closed     | ⚠️ Semi-open   | ⚠️ Partially    | ❌ Closed           |


---

## 🧪 Getting Started

### Install via VS Code Marketplace (Recommended)

1. Open the Extensions view in VS Code (`Ctrl+Shift+X`)
2. Search for `DevDoc`
3. Click **Install**

