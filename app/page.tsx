import Chat from './components/chat';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-[#0d1117] text-white p-4 font-sans text-sm">
      <h1 className="text-xl font-bold mb-2">DevDoc Copilot</h1>
      <Chat />
    </div>
  );
}
