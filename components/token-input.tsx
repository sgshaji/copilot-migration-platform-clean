
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function TokenInput() {
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch('/api/manual-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()
      
      if (data.success) {
        setSuccess(true)
        setMessage("✅ Token validated! You can now deploy real agents.")
        setToken("")
      } else {
        setSuccess(false)
        setMessage(`❌ ${data.error}`)
      }
    } catch (error) {
      setSuccess(false)
      setMessage("❌ Failed to validate token")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Add Botpress Token</CardTitle>
        <CardDescription>
          Enter your Botpress token to enable real deployments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="bp_pat_..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !token}>
            {loading ? "Validating..." : "Add Token"}
          </Button>
        </form>
        
        {message && (
          <Alert className={`mt-4 ${success ? 'border-green-500' : 'border-red-500'}`}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Get your FREE token:</strong></p>
          <p>1. Visit <a href="https://botpress.com" target="_blank" className="text-blue-600 underline">botpress.com</a></p>
          <p>2. Sign up for free</p>
          <p>3. Go to your dashboard → API Keys</p>
          <p>4. Copy your token and paste it here</p>
        </div>
      </CardContent>
    </Card>
  )
}
