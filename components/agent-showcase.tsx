'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, ExternalLink, Calendar, Settings } from "lucide-react"
import Link from "next/link"

interface Agent {
  id: string
  name: string
  description?: string
  createdAt: string
  status: string
  type: string
}

export default function AgentShowcase() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents')
      const result = await response.json()
      if (result.success) {
        setAgents(result.agents || [])
      } else {
        setError(result.error || 'Failed to fetch agents')
      }
    } catch (err) {
      setError('Failed to load agents')
      console.error('Error fetching agents:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Your AI Agents</h2>
          <p className="text-muted-foreground">Loading your deployed agents...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Your AI Agents</h2>
          <p className="text-red-600">Error: {error}</p>
          <Button onClick={fetchAgents} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Your AI Agents</h2>
        <p className="text-muted-foreground">
          {agents.length > 0 
            ? `Manage your ${agents.length} deployed AI agent${agents.length === 1 ? '' : 's'}`
            : "No agents deployed yet. Start by migrating a legacy bot!"
          }
        </p>
      </div>

      {agents.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent>
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Agents Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by migrating your first legacy chatbot to create an AI agent.
            </p>
            <Link href="/migration">
              <Button>
                <Bot className="mr-2 h-4 w-4" />
                Start Migration
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                  </div>
                  <Badge 
                    variant={agent.status === 'active' ? 'default' : 'outline'} 
                    className={agent.status === 'active' ? 'text-green-600' : ''}
                  >
                    <div className={`w-2 h-2 rounded-full mr-1 ${
                      agent.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                    }`}></div>
                    {agent.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {agent.description || `AI-powered assistant created from migrated bot`}
                </p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Created {new Date(agent.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {agent.type === 'demo' ? 'Demo Agent' : agent.type}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Link href={`/chat/${agent.id}`} className="flex-1">
                    <Button className="w-full" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Chat Now
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {agents.length > 0 && (
        <div className="text-center">
          <Link href="/migration">
            <Button variant="outline">
              <Bot className="mr-2 h-4 w-4" />
              Migrate Another Bot
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
