'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bot, 
  Settings, 
  Activity, 
  Zap, 
  Calendar, 
  FileText, 
  Workflow, 
  BarChart3,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Database,
  Shield,
  Globe,
  MessageSquare,
  Mail
} from 'lucide-react'
import { RealCopilotAgent, RealAIMigration } from '@/lib/real-ai-migration'
import RealAgentChat from '@/components/real-agent-chat'

interface AgentPageProps {
  params: {
    id: string
  }
}

export default function AgentPage({ params }: AgentPageProps) {
  const { id } = React.use(params)
  const [agent, setAgent] = useState<RealCopilotAgent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Simulate loading agent data
    const loadAgent = async () => {
      setIsLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create a mock agent for demonstration
      const aiMigration = RealAIMigration.getInstance()
      const mockSourceBot = {
        name: 'Customer Support Bot',
        description: 'Handles customer inquiries and support tickets',
        topics: [{ name: 'General Support' }],
        entities: [{ name: 'Product' }],
        powerAutomateFlows: [{ name: 'Create Ticket' }]
      }
      
      const realAgent = await aiMigration.createRealAgent(mockSourceBot, 'AI Support Assistant')
      realAgent.id = id
      realAgent.deploymentUrl = `https://copilot.microsoft.com/agents/${id}`
      
      setAgent(realAgent)
      setIsLoading(false)
    }

    loadAgent()
  }, [id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
              <Bot className="w-8 h-8" />
            </div>
            <div className="text-lg font-semibold text-gray-900">Loading AI Agent...</div>
            <div className="text-gray-600">Initializing Microsoft Copilot Studio capabilities</div>
          </div>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">Agent not found</div>
          <div className="text-gray-600">The requested AI agent could not be loaded.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{agent.name}</h1>
            <p className="text-gray-600">{agent.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {agent.model}
              </Badge>
              <Badge variant={agent.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                {agent.status}
              </Badge>
              <span className="text-xs text-gray-500">
                Created {new Date(agent.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowChat(!showChat)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {showChat ? 'Hide Chat' : 'Open Chat'}
          </Button>
          <Button variant="outline" asChild>
            <a href={agent.deploymentUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in Copilot Studio
            </a>
          </Button>
        </div>
      </div>

      {/* Chat Interface */}
      {showChat && (
        <div className="mb-8">
          <RealAgentChat agent={agent} onClose={() => setShowChat(false)} />
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
          <TabsTrigger value="extensions">Extensions</TabsTrigger>
          <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Agent Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant={agent.status === 'published' ? 'default' : 'secondary'}>
                      {agent.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Model</span>
                    <span className="text-sm text-gray-600">{agent.model}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Capabilities</span>
                    <span className="text-sm text-gray-600">{agent.capabilities.length} active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Extensions</span>
                    <span className="text-sm text-gray-600">{agent.extensions.filter(e => e.enabled).length} enabled</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="capabilities" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {agent.capabilities.map((capability) => (
              <Card key={capability.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {capability.type === 'conversation' && <MessageSquare className="w-5 h-5" />}
                    {capability.type === 'automation' && <Workflow className="w-5 h-5" />}
                    {capability.type === 'integration' && <Globe className="w-5 h-5" />}
                    {capability.type === 'analysis' && <BarChart3 className="w-5 h-5" />}
                    {capability.name}
                  </CardTitle>
                  <CardDescription>{capability.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={capability.enabled ? 'default' : 'secondary'} className="text-xs">
                        {capability.enabled ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-900">Examples:</div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {capability.examples.slice(0, 3).map((example, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="extensions" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {agent.extensions.map((extension) => (
              <Card key={extension.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {extension.type === 'teams' && <Users className="w-5 h-5" />}
                    {extension.type === 'outlook' && <Mail className="w-5 h-5" />}
                    {extension.type === 'calendar' && <Calendar className="w-5 h-5" />}
                    {extension.type === 'sharepoint' && <FileText className="w-5 h-5" />}
                    {extension.type === 'power-automate' && <Workflow className="w-5 h-5" />}
                    {extension.name}
                  </CardTitle>
                  <CardDescription>{extension.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={extension.enabled ? 'default' : 'secondary'} className="text-xs">
                        {extension.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-900">Capabilities:</div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {extension.capabilities.slice(0, 3).map((capability, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
                            {capability}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {extension.type === 'teams' && (
                      <Button
                        className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-200"
                        onClick={() => alert('Simulated: Teams meeting scheduled by AI agent!')}
                      >
                        Schedule Teams Meeting
                      </Button>
                    )}
                    {extension.type === 'outlook' && (
                      <Button
                        className="mt-2 bg-green-100 text-green-800 hover:bg-green-200"
                        onClick={() => alert('Simulated: Test email sent by AI agent!')}
                      >
                        Send Test Email
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="use-cases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Agentic Use Cases
              </CardTitle>
              <CardDescription>
                Real-world scenarios only possible with an AI agent (not a classic bot)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Book a Multi-User Teams Meeting
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• AI finds the best time for all invitees</p>
                    <p>• Schedules and sends invites automatically</p>
                    <Button
                      className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-200"
                      onClick={() => alert('Simulated: AI booked a Teams meeting for your group!')}
                    >
                      Try It
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Summarize Recent Emails
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• AI reads and summarizes your last 10 emails</p>
                    <p>• Sends a summary to your Teams channel</p>
                    <Button
                      className="mt-2 bg-green-100 text-green-800 hover:bg-green-200"
                      onClick={() => alert('Simulated: AI summarized your emails and posted to Teams!')}
                    >
                      Try It
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Workflow className="w-5 h-5" />
                    Automated Workflow Chaining
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• AI triggers a Power Automate flow based on conversation context</p>
                    <p>• Notifies you of the outcome in real time</p>
                    <Button
                      className="mt-2 bg-purple-100 text-purple-800 hover:bg-purple-200"
                      onClick={() => alert('Simulated: AI triggered a workflow and sent you a notification!')}
                    >
                      Try It
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Proactive Data Insights
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• AI analyzes your data and proactively suggests actions</p>
                    <p>• Classic bots cannot do this level of analysis</p>
                    <Button
                      className="mt-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      onClick={() => alert('Simulated: AI analyzed your data and suggested next steps!')}
                    >
                      Try It
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Usage Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Conversations</span>
                    <span className="text-sm text-gray-600">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Successful Actions</span>
                    <span className="text-sm text-gray-600">1,189 (95.3%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Session Time</span>
                    <span className="text-sm text-gray-600">4.2 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">User Satisfaction</span>
                    <span className="text-sm text-gray-600">4.6/5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 