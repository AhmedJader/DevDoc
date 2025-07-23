"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
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
import { PlusIcon } from "lucide-react";
import { Message } from "ai";
import { AIResponse } from "@/components/ui/kibo-ui/ai/response";
import { cn } from "@/lib/utils";

import assistantImage from "@/app/components/assets/assistant.png";
import userImage from "@/app/components/assets/user.png";

// acquireVsCodeApi can only be called once in a webview's lifecycle
const vscode = typeof window !== "undefined" ? acquireVsCodeApi() : undefined;

const models = [
  { id: 0, modelId: "google:gemini-2.5-flash", name: "Gemini 2.5 Pro" },
  { id: 1, modelId: "google:gemini-2.5-flash", name: "Gemini 2.5 Flash" },
  { id: 2, modelId: "google:gemini-2.5-flash", name: "Claude Sonnet 3.5" },
  { id: 3, modelId: "google:gemini-2.5-flash", name: "Claude Sonnet 3.7" },
  {
    id: 4,
    modelId: "google:gemini-2.5-flash",
    name: "Claude Sonnet 3.7 Thinking",
  },
  { id: 5, modelId: "google:gemini-2.5-flash", name: "Claude Sonnet 4" },
  { id: 6, modelId: "google:gemini-2.5-flash", name: "GPT-4o" },
  { id: 7, modelId: "google:gemini-2.5-flash", name: "GPT-3.5 Turbo" },
];

export default function Chat() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!input.trim() || !vscode) return;

    const userMessage: Message = {
      id: String(Date.now()),
      role: "user",
      content: input,
    };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Add a placeholder for the assistant's response that we will fill
    setMessages((prev) => [
      ...prev,
      { id: "assistant-response", role: "assistant", content: "" },
    ]);

    vscode.postMessage({
      type: "chat-request",
      value: {
        messages: newMessages,
        model: model,
      },
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // This effect listens for messages from the VS Code extension and correctly parses the stream
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      const { type, value } = event.data;

      switch (type) {
        case "response-chunk":
          // The value might contain multiple data lines, so we split by newline
          value.split("\n").forEach((line: string) => {
            if (line.startsWith("0:")) {
              // This is a text chunk. Extract the JSON string part.
              const jsonString = line.substring(2);
              try {
                const textChunk = JSON.parse(jsonString);
                // Append this chunk to the assistant's message content
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === "assistant-response"
                      ? { ...msg, content: msg.content + textChunk }
                      : msg
                  )
                );
              } catch (e) {
                // Ignore any lines that aren't valid JSON
              }
            }
          });
          break;

        case "response-end":
          // The stream is complete. Stop loading and give the message a permanent ID.
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === "assistant-response"
                ? { ...msg, id: String(Date.now()) }
                : msg
            )
          );
          setLoading(false);
          break;

        case "response-error":
          // Handle errors from the backend
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === "assistant-response"
                ? {
                    ...msg,
                    id: String(Date.now()),
                    content: `[**Error**] ${value}`,
                  }
                : msg
            )
          );
          setLoading(false);
          break;
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);

  return (
    <div className="flex flex-col h-full w-full gap-2 p-2">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              className={cn("flex gap-4 items-start justify-start", {
                "flex-row": msg.role !== "user",
                "flex-row-reverse": msg.role === "user",
              })}
            >
              {msg.role === "user" ? (
                <svg
                  className="w-10 h-10 rounded-full"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  fill="none"
                  shape-rendering="auto"
                >
                  <mask id="viewboxMask">
                    <rect
                      width="64"
                      height="64"
                      rx="32"
                      ry="32"
                      x="0"
                      y="0"
                      fill="#fff"
                    />
                  </mask>
                  <g mask="url(#viewboxMask)">
                    <rect fill="#b6e3f4" width="64" height="64" x="0" y="0" />
                    <path
                      d="M37 46.08V52a5 5 0 0 1-10 0v-5.92A14.04 14.04 0 0 1 18.58 37h-.08a4.5 4.5 0 0 1-.5-8.97V27a14 14 0 1 1 28 0v1.03a4.5 4.5 0 0 1-.58 8.97A14.04 14.04 0 0 1 37 46.08Z"
                      fill="#d78774"
                    />
                    <mask
                      id="personas-a"
                      maskUnits="userSpaceOnUse"
                      x="14"
                      y="13"
                      width="36"
                      height="44"
                    >
                      <path
                        d="M37 46.08V52a5 5 0 0 1-10 0v-5.92A14.04 14.04 0 0 1 18.58 37h-.08a4.5 4.5 0 0 1-.5-8.97V27a14 14 0 1 1 28 0v1.03a4.5 4.5 0 0 1-.58 8.97A14.04 14.04 0 0 1 37 46.08Z"
                        fill="#fff"
                      />
                    </mask>
                    <g mask="url(#personas-a)">
                      <path
                        d="M32 13a14 14 0 0 1 14 14v6a14 14 0 1 1-28 0v-6a14 14 0 0 1 14-14Z"
                        fill="#fff"
                        opacity=".36"
                      />
                    </g>
                    <g transform="translate(20 24)">
                      <path
                        d="M3.76 6.21c.4.13.82-.08.95-.47.23-.7.62-1 1.3-1 .66 0 1.05.3 1.28 1a.75.75 0 1 0 1.42-.48c-.43-1.3-1.38-2.01-2.7-2.01-1.34 0-2.29.71-2.72 2.01-.13.4.08.82.47.95ZM15.76 6.21c.4.13.82-.08.95-.47.23-.7.62-1 1.29-1s1.06.3 1.29 1a.75.75 0 1 0 1.42-.48c-.43-1.3-1.38-2.01-2.71-2.01s-2.28.71-2.71 2.01c-.13.4.08.82.47.95Z"
                        fill="#1B0640"
                      />
                    </g>
                    <g transform="translate(2 2)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M44 26c-2.18-2.42-3.65-5.54-4.42-9.36a19.6 19.6 0 0 1-9.08 7.86c-4.67 2-9.5 2.33-14.5 1v.53c-.73.08-1.42.34-2 .73V25.5C14 16.39 21.16 9 30 9s16 7.39 16 16.5v1.26a4.47 4.47 0 0 0-2-.73V26Zm-9 21.31v-3.23A14.04 14.04 0 0 0 43.42 35h.08c.93 0 1.78-.28 2.5-.76V45a38.74 38.74 0 0 1-11 2.31ZM14 45a38.74 38.74 0 0 0 11 2.31v-3.23A14.04 14.04 0 0 1 16.58 35h-.08c-.93 0-1.79-.28-2.5-.76V45Z"
                        fill="#dee1f5"
                      />
                      <path
                        d="M30 9c-8.84 0-16 7.39-16 16.5v1.26c.58-.4 1.27-.65 2-.73v-.53c5 1.33 9.83 1 14.5-1a19.6 19.6 0 0 0 9.08-7.86c.77 3.82 2.24 6.94 4.42 9.36v.03c.73.08 1.42.34 2 .73V25.5C46 16.39 38.84 9 30 9Z"
                        fill="#fff"
                        opacity=".26"
                      />
                    </g>
                    <g transform="translate(11 44)">
                      <path
                        d="M16 5v3a5 5 0 0 0 10 0V5l6.65 2.05a9 9 0 0 1 6.35 8.6V20H3v-4.35a9 9 0 0 1 6.35-8.6L16 5Z"
                        fill="#54d7c7"
                      />
                      <path
                        d="m11 6.54-1.65.5A9 9 0 0 0 7 8.17V20h4V6.54ZM15 20h4v-5.29a7.02 7.02 0 0 1-4-3.1V20ZM23 20h4v-8.4a7.02 7.02 0 0 1-4 3.11v5.3ZM31 20h4V8.16a9 9 0 0 0-2.35-1.12L31 6.55V20Z"
                        opacity=".4"
                        fill="#000"
                      />
                      <path
                        d="M3.4 13a9.01 9.01 0 0 1 2.53-4h8.14a6.98 6.98 0 0 0 2.03 4H3.4ZM39 17v3H3v-3h36ZM36.07 9a9.01 9.01 0 0 1 2.53 4H25.9a6.98 6.98 0 0 0 2.03-4h8.14Z"
                        opacity=".17"
                        fill="#fff"
                      />
                    </g>
                    <g transform="translate(23 36)">
                      <path
                        d="M5 4.13a1 1 0 1 0 1 1.74A6 6 0 0 1 9 5a6 6 0 0 1 3 .87 1 1 0 1 0 1-1.74A8 8 0 0 0 9 3a8 8 0 0 0-4 1.13Z"
                        fill="#1B0640"
                      />
                    </g>
                    <g transform="translate(24 28)">
                      <path
                        d="M4.25 5a.75.75 0 0 1 1.5 0c0 .84.91 1.75 2.25 1.75 1.34 0 2.25-.91 2.25-1.75a.75.75 0 0 1 1.5 0c0 1.66-1.59 3.25-3.75 3.25S4.25 6.66 4.25 5Z"
                        fill="#000"
                        opacity=".36"
                      />
                    </g>
                    <g transform="translate(14 26)" />
                  </g>
                </svg>
              ) : (
                <svg
                  className="w-10 h-10 rounded-full"
                  viewBox="0 0 512 512"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_2638_3)">
                    <rect width="512" height="512" rx="256" fill="white" />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M256 0C397.385 0 512 114.615 512 256C512 397.385 397.385 512 256 512C114.615 512 0 397.385 0 256C0 114.615 114.615 0 256 0ZM336.261 138.83C329.387 132.071 318.338 132.16 311.58 139.034C305.243 145.479 304.928 155.601 310.58 162.409L311.795 163.716L405.648 256L311.795 348.284C304.922 355.042 304.821 366.092 311.58 372.966C318.338 379.84 329.387 379.929 336.261 373.17L442.784 268.443C446.12 265.162 448 260.679 448 256C448 251.321 446.12 246.838 442.784 243.557L336.261 138.83ZM200.42 139.034C194.084 132.59 183.971 132.103 177.068 137.636L175.739 138.83L69.2159 243.557C65.8798 246.838 64 251.321 64 256C64 260.679 65.8798 265.162 69.2159 268.443L175.739 373.17L177.068 374.364C183.971 379.897 194.084 379.41 200.42 372.966C206.757 366.521 207.072 356.399 201.42 349.591L200.205 348.284L106.341 256L200.205 163.716C207.078 156.958 207.179 145.908 200.42 139.034Z"
                      fill="url(#paint0_linear_2638_3)"
                    />
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_linear_2638_3"
                      x1="0"
                      y1="0"
                      x2="51200"
                      y2="51200"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#3B82F6" />
                      <stop offset="0.5" stop-color="#2563EB" />
                      <stop offset="1" stop-color="#1D4ED8" />
                    </linearGradient>
                    <clipPath id="clip0_2638_3">
                      <rect width="512" height="512" rx="256" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              )}

              <div
                key={msg.id}
                className={cn("p-4 rounded-xl max-w-[75%]", {
                  "bg-blue-600 text-white ml-auto": msg.role === "user",
                  "bg-[#0d1117] text-white mr-auto": msg.role !== "user",
                })}
              >
                {msg.role === "assistant" ? (
                  <AIResponse>{msg.content}</AIResponse>
                ) : (
                  msg.content
                )}
              </div>
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
            <p>{process.env.NEXT_PUBLIC_BACKEND_URL}</p>
          </div>
        )}
        {loading && (
          <div className="text-sm text-gray-400 self-start px-3 pt-2">
            Assistant is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <AIInput onSubmit={handleSubmit}>
        <AIInputTextarea
          onChange={(e: any) => setInput(e.target.value)}
          value={input}
          placeholder="Ask a question about your code..."
        />
        <AIInputToolbar>
          <AIInputTools>
            <AIInputButton>
              <PlusIcon size={16} />
            </AIInputButton>
            <AIInputModelSelect
              onValueChange={(modelName) => {
                const selectedModel = models.find(
                  (m) => m.id === Number(modelName)
                );
                if (selectedModel) {
                  setModel(selectedModel.id);
                }
              }}
              value={String(model)}
            >
              <AIInputModelSelectTrigger>
                <AIInputModelSelectValue />
              </AIInputModelSelectTrigger>
              <AIInputModelSelectContent>
                {models.map((model) => (
                  <AIInputModelSelectItem
                    key={model.id}
                    value={String(model.id)}
                  >
                    {model.name}
                  </AIInputModelSelectItem>
                ))}
              </AIInputModelSelectContent>
            </AIInputModelSelect>
          </AIInputTools>
          <AIInputSubmit disabled={!input.trim() || loading} />
        </AIInputToolbar>
      </AIInput>
    </div>
  );
}
