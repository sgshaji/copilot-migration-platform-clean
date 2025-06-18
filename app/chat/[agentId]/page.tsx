import { redirect } from "next/navigation"
import AgenticChatInterface from "./chat-interface"

interface PageProps {
  params: Promise<{
    agentId: string
  }>
}

export default async function ChatPage({ params }: { params: Promise<{ agentId: string }> }) {
  const resolvedParams = await params
  const isReplitHosted = resolvedParams.agentId.startsWith('replit_')

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b p-4">
        <h1 className="text-xl font-semibold">AI Agent Chat</h1>
        <p className="text-sm text-gray-600">Agent ID: {resolvedParams.agentId}</p>
        {isReplitHosted && (
          <p className="text-xs text-green-600">🚀 Hosted on Replit Native</p>
        )}
      </div>
      <div className="flex-1">
        <AgenticChatInterface agentId={resolvedParams.agentId} />
      </div>
    </div>
  )
}