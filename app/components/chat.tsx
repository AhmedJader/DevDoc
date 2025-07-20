"use client";

import { useEffect, useState } from "react";
import {
  AIInput,
  AIInputButton,
  AIInputModelSelect,
  AIInputModelSelectContent,
  AIInputModelSelectItem,
  AIInputModelSelectTrigger,
  AIInputModelSelectValue,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@/components/ui/kibo-ui/ai/input";
import { GlobeIcon, MicIcon, PlusIcon } from "lucide-react";

let vscode: ReturnType<typeof acquireVsCodeApi> | undefined;
if (typeof window !== "undefined") {
  vscode = acquireVsCodeApi();
}

const models = [
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "claude-2", name: "Claude 2" },
  { id: "claude-instant", name: "Claude Instant" },
  { id: "palm-2", name: "PaLM 2" },
  { id: "llama-2-70b", name: "Llama 2 70B" },
  { id: "llama-2-13b", name: "Llama 2 13B" },
  { id: "cohere-command", name: "Command" },
  { id: "mistral-7b", name: "Mistral 7B" },
];

export default function Chat() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = () => {
    if (!input.trim() || !vscode) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    vscode.postMessage({
      type: "ask-openai",
      value: {
        messages: [
          { role: "system", content: "You are a helpful DevDoc assistant." },
          ...messages,
          userMessage,
        ],
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      const { type, value } = event.data;
      if (type === "openai-response") {
        setMessages((prev) => [...prev, { role: "assistant", content: value }]);
        setLoading(false);
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.length > 0 ? (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded-md max-w-[80%] ${
                msg.role === "user" ? "bg-blue-500 ml-auto" : "bg-gray-700 mr-auto"
              }`}
            >
              {msg.content}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center flex-col h-full">
              <div className="w-36 h-36 mb-2">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 2C36.1503 2 46 11.8497 46 24C46 36.1503 36.1503 46 24 46C11.8497 46 2 36.1503 2 24C2 11.8497 11.8497 2 24 2ZM30.8975 13.9307C30.3067 13.3499 29.3572 13.3575 28.7764 13.9482C28.2318 14.5021 28.2048 15.372 28.6904 15.957L28.7949 16.0693L36.8604 24L28.7949 31.9307C28.2042 32.5115 28.1956 33.461 28.7764 34.0518C29.3572 34.6425 30.3067 34.6501 30.8975 34.0693L40.0518 25.0693C40.3385 24.7874 40.5 24.4021 40.5 24C40.5 23.5979 40.3385 23.2126 40.0518 22.9307L30.8975 13.9307ZM19.2236 13.9482C18.6791 13.3944 17.81 13.3526 17.2168 13.8281L17.1025 13.9307L7.94824 22.9307C7.66155 23.2126 7.5 23.5979 7.5 24C7.5 24.4021 7.66155 24.7874 7.94824 25.0693L17.1025 34.0693L17.2168 34.1719C17.81 34.6474 18.6791 34.6056 19.2236 34.0518C19.7682 33.4979 19.7952 32.628 19.3096 32.043L19.2051 31.9307L11.1387 24L19.2051 16.0693C19.7958 15.4885 19.8044 14.539 19.2236 13.9482Z"
                    fill="url(#paint0_linear_2632_18)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_2632_18"
                      x1="2"
                      y1="2"
                      x2="4402"
                      y2="4402"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="oklch(70.7% 0.165 254.624)" />
                      <stop offset="1" stopColor="oklch(88.2% 0.059 254.128)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h1 className="text-5xl font-normal bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                DevDoc
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-600 text-center tracking-wide w-[80vw] mt-4 max-w-160">
                DevDoc is filly integrated with your IDE, so you can ask
                questions about your code, libraries, and frameworks without
                leaving your development environment.
              </p>
            </div>
        )}
        {loading && <div className="text-sm text-gray-400">Thinking...</div>}
      </div>
      <AIInput onSubmit={handleSubmit}>
        <AIInputTextarea onChange={(e: any) => setInput(e.target.value)} value={input} />
        <AIInputToolbar>
          <AIInputTools>
            <AIInputButton><PlusIcon size={16} /></AIInputButton>
            <AIInputButton><MicIcon size={16} /></AIInputButton>
            <AIInputButton><GlobeIcon size={16} /><span>Search</span></AIInputButton>
            <AIInputModelSelect onValueChange={setModel} value={model}>
              <AIInputModelSelectTrigger>
                <AIInputModelSelectValue />
              </AIInputModelSelectTrigger>
              <AIInputModelSelectContent>
                {models.map((model) => (
                  <AIInputModelSelectItem key={model.id} value={model.id}>
                    {model.name}
                  </AIInputModelSelectItem>
                ))}
              </AIInputModelSelectContent>
            </AIInputModelSelect>
          </AIInputTools>
          <AIInputSubmit disabled={!input.trim()} />
        </AIInputToolbar>
      </AIInput>
    </div>
  );
}
