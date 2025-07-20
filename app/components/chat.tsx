"use client";

import { useState, useEffect } from "react";

// let vscode: ReturnType<typeof acquireVsCodeApi> | undefined;

// if (typeof window !== 'undefined') {
//   vscode = acquireVsCodeApi();
// }

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  /* const sendMessage = () => {
    if (!input.trim() || !vscode) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    vscode.postMessage({
      type: 'ask-openai',
      value: {
        messages: [
          { role: 'system', content: 'You are a helpful DevDoc assistant.' },
          ...messages,
          userMessage,
        ],
      },
    });
  };

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      const { type, value } = event.data;
      if (type === 'openai-response') {
        setMessages((prev) => [...prev, { role: 'assistant', content: value }]);
        setLoading(false);
      }
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []); */

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-md max-w-[80%] ${
              msg.role === "user"
                ? "bg-blue-500 ml-auto"
                : "bg-gray-700 mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-sm text-gray-400">Thinking...</div>}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // sendMessage();
        }}
        className="flex gap-2 mt-auto"
      >
        <input
          type="text"
          className="flex-1 p-2 bg-[#161b22] border border-gray-600 rounded-md"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 bg-blue-600 text-white rounded-md"
        >
          Send
        </button>
      </form>
    </div>
  );
}
