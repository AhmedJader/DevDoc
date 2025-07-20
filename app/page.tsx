import Chat from "./components/chat";

export default function Home() {
  return (
    <div className="flex flex-col h-screen text-white bg-black p-4 font-sans text-sm">
      <Chat />
    </div>
  );
}
