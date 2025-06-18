import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Bot, Zap, BarChart3 } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="max-w-lg w-full mx-auto p-10 text-center shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome to Copilot Migration</h1>
        <p className="text-gray-600 mb-6">Easily migrate your classic chatbots to modern AI agents and unlock new capabilities.</p>
        <div className="flex justify-center gap-6 mb-8">
          <div className="flex flex-col items-center">
            <Bot className="w-7 h-7 text-blue-600 mb-1" />
            <span className="text-lg font-bold">4</span>
            <span className="text-xs text-gray-500">Classic Bots</span>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="w-7 h-7 text-purple-600 mb-1" />
            <span className="text-lg font-bold">2</span>
            <span className="text-xs text-gray-500">AI Agents</span>
          </div>
          <div className="flex flex-col items-center">
            <BarChart3 className="w-7 h-7 text-green-600 mb-1" />
            <span className="text-lg font-bold">2024-05-01</span>
            <span className="text-xs text-gray-500">Last Migration</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-2">
          <Button asChild className="bg-blue-600 text-white">
            <Link href="/migration">Start Migration</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/agents">View Agents</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/delta-analysis">Delta Analysis</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}