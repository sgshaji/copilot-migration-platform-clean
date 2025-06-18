"use client";
import { useState } from "react"
import { classicBots } from "@/lib/delta-demo-data"

export default function DeltaAnalysisPage() {
  const [selectedBot, setSelectedBot] = useState(classicBots[0]?.id || "")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const runDeltaAnalysis = async () => {
    setLoading(true)
    setError("")
    setResult(null)
    try {
      // Pass the selected classic bot ID as a query param
      const res = await fetch(`/api/delta-analysis?classicId=${selectedBot}`)
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError("Failed to run delta analysis.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Delta Analysis</h1>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Classic Bot:</label>
        <select
          className="border rounded px-3 py-2 w-full"
          value={selectedBot}
          onChange={e => setSelectedBot(e.target.value)}
        >
          {classicBots.map(bot => (
            <option key={bot.id} value={bot.id}>{bot.name}</option>
          ))}
        </select>
      </div>
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded mb-6"
        onClick={runDeltaAnalysis}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Run Delta Analysis"}
      </button>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {result && (
        <div className="bg-gray-50 p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Classic Bot</h2>
          <pre className="text-xs bg-white p-2 rounded mb-2 overflow-x-auto">{JSON.stringify(result.classic, null, 2)}</pre>
          <h2 className="font-semibold mb-2">Migrated Agent</h2>
          <pre className="text-xs bg-white p-2 rounded mb-2 overflow-x-auto">{JSON.stringify(result.agent, null, 2)}</pre>
          <h2 className="font-semibold mb-2">Delta (Rule-Based)</h2>
          <pre className="text-xs bg-white p-2 rounded mb-2 overflow-x-auto">{JSON.stringify(result.delta, null, 2)}</pre>
          {result.llmSummary && (
            <>
              <h2 className="font-semibold mb-2">LLM-Powered Summary</h2>
              <div className="bg-white p-3 rounded text-sm mb-2">{result.llmSummary}</div>
            </>
          )}
        </div>
      )}
    </div>
  )
} 