'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { 
  Bot, 
  Copy, 
  Settings, 
  TestTube, 
  Rocket, 
  CheckCircle, 
  XCircle, 
  Clock,
  ExternalLink,
  Building2,
  Zap,
  Shield,
  Database,
  Workflow,
  MessageSquare,
  Users,
  ArrowRight,
  Play,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { 
  ClassicBot, 
  CopilotAgent, 
  MigrationFlow, 
  MigrationStep,
  CopilotStudioMigration 
} from '@/lib/copilot-studio-migration'
import { RealCopilotAgent, RealAIMigration } from '@/lib/real-ai-migration'

export default function EnterpriseMigrationUI() {
  const [classicBots, setClassicBots] = useState<ClassicBot[]>([])
  const [selectedBot, setSelectedBot] = useState<ClassicBot | null>(null)
  const [agentName, setAgentName] = useState('')
  const [migrationFlow, setMigrationFlow] = useState<MigrationFlow | null>(null)
  const [isMigrating, setIsMigrating] = useState(false)
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [realAgent, setRealAgent] = useState<RealCopilotAgent | null>(null)
  const [showMigrationProgress, setShowMigrationProgress] = useState(false)

  const migration = CopilotStudioMigration.getInstance()
  const realAIMigration = RealAIMigration.getInstance()

  useEffect(() => {
    // Load mock classic bots
    let bots: ClassicBot[] = migration.getMockClassicBots()
    if (!bots || bots.length === 0) {
      bots = [
        {
          id: 'bot-1',
          name: 'Customer Support Bot',
          description: 'Handles customer inquiries and support tickets',
          topics: [],
          entities: [],
          powerAutomateFlows: [],
          channels: [],
          authorization: { type: 'azure-ad', configuration: {}, isMigratable: true },
          botFrameworkSkills: [],
          customComponents: [],
          status: 'active',
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        },
        {
          id: 'bot-2',
          name: 'Sales Assistant Bot',
          description: 'Helps with sales inquiries and lead qualification',
          topics: [],
          entities: [],
          powerAutomateFlows: [],
          channels: [],
          authorization: { type: 'azure-ad', configuration: {}, isMigratable: true },
          botFrameworkSkills: [],
          customComponents: [],
          status: 'active',
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        },
        {
          id: 'bot-3',
          name: 'HR FAQ Bot',
          description: 'Answers HR-related questions for employees',
          topics: [],
          entities: [],
          powerAutomateFlows: [],
          channels: [],
          authorization: { type: 'azure-ad', configuration: {}, isMigratable: true },
          botFrameworkSkills: [],
          customComponents: [],
          status: 'active',
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        },
        {
          id: 'bot-4',
          name: 'IT Helpdesk Bot',
          description: 'Provides IT support and troubleshooting',
          topics: [],
          entities: [],
          powerAutomateFlows: [],
          channels: [],
          authorization: { type: 'azure-ad', configuration: {}, isMigratable: true },
          botFrameworkSkills: [],
          customComponents: [],
          status: 'active',
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        }
      ]
    }
    setClassicBots(bots)
  }, [])

  // When a bot is selected, automatically open the name dialog
  useEffect(() => {
    if (selectedBot && !showNameDialog && !migrationFlow) {
      setShowNameDialog(true)
    }
  }, [selectedBot, showNameDialog, migrationFlow])

  const startMigration = async () => {
    if (!selectedBot || !agentName.trim()) return

    setIsMigrating(true)
    setShowNameDialog(false)
    setShowMigrationProgress(true)

    try {
      // Start the traditional migration flow
      const flow = await migration.startMigration(selectedBot, agentName)
      setMigrationFlow(flow)
      
      // Create the real AI agent with actual LLM capabilities
      const realAgent = await realAIMigration.createRealAgent(selectedBot, agentName)
      setRealAgent(realAgent)
      
      // Simulate real-time updates
      const interval = setInterval(() => {
        setMigrationFlow(prev => {
          if (!prev) return prev
          return { ...prev }
        })
      }, 1000)

      // Clear interval when migration completes
      setTimeout(() => {
        clearInterval(interval)
        setIsMigrating(false)
        setShowMigrationProgress(false)
      }, 30000) // 30 seconds for full migration

    } catch (error) {
      console.error('Migration failed:', error)
      setIsMigrating(false)
      setShowMigrationProgress(false)
    }
  }

  const getStepIcon = (step: MigrationStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in-progress':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStepColor = (step: MigrationStep) => {
    switch (step.status) {
      case 'completed':
        return 'border-green-200 bg-green-50'
      case 'in-progress':
        return 'border-blue-200 bg-blue-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'deploying':
        return 'bg-blue-100 text-blue-800'
      case 'testing':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white text-2xl">
          <Building2 className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Migration
          </h2>
          <p className="text-xl text-gray-600 mt-2">
            Enterprise-grade migration flow
          </p>
        </div>
      </div>

      {/* Migration Flow Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Workflow className="w-5 h-5" />
            Official Migration Flow
          </CardTitle>
          <CardDescription className="text-blue-700">
            Follows Microsoft's recommended migration process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
              <div>
                <div className="font-semibold text-gray-900">Open Classic Bot</div>
                <div className="text-sm text-gray-600">Access source chatbot in Copilot Studio</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
              <div>
                <div className="font-semibold text-gray-900">Clone & Convert</div>
                <div className="text-sm text-gray-600">Copy and convert to AI agent</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
              <div>
                <div className="font-semibold text-gray-900">Name & Create</div>
                <div className="text-sm text-gray-600">Set custom name and create agent</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
              <div>
                <div className="font-semibold text-gray-900">Deploy Live</div>
                <div className="text-sm text-gray-600">Publish and go live with new agent</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Select Classic Bot */}
      {!selectedBot && !migrationFlow && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Step 1: Select Your Classic Bot
            </CardTitle>
            <CardDescription>
              Choose the classic chatbot you want to migrate to Copilot Studio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {(classicBots as ClassicBot[]).map((bot) => (
                <Card
                  key={bot.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedBot?.id === bot.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedBot(bot)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{bot.name}</CardTitle>
                      <Badge variant="outline">{bot.status}</Badge>
                    </div>
                    <CardDescription>{bot.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-semibold text-gray-900">Topics</div>
                        <div className="text-gray-600">{bot.topics.filter(t => t.isMigratable).length} migratable</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Entities</div>
                        <div className="text-gray-600">{bot.entities.filter(e => e.isMigratable).length} custom</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Flows</div>
                        <div className="text-gray-600">{bot.powerAutomateFlows.filter(f => f.isMigratable).length} Power Automate</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Channels</div>
                        <div className="text-gray-600">{bot.channels.filter(c => c.isMigratable).length} active</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {selectedBot && (
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={() => setShowNameDialog(true)}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Copy className="w-5 h-5 mr-2" />
                  Copy This Chatbot
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Name Your Agent */}
      {showNameDialog && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Copy className="w-5 h-5" />
              Copy and Convert This Bot
            </CardTitle>
            <CardDescription className="text-blue-700">
              Create a new AI agent using the unified authoring experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="agentName" className="text-sm font-medium text-gray-700">
                Agent Name
              </label>
              <Input
                id="agentName"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder={`${selectedBot?.name} (AI)`}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                This will be the name of your new AI agent
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2">What will be migrated:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Web canvas topics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Custom entities</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Power Automate flows</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <span>Manual reconfiguration needed</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => setShowNameDialog(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                onClick={startMigration}
                disabled={!agentName.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                Create AI Agent
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Migration Progress (show immediately when starting migration) */}
      {(showMigrationProgress || migrationFlow) && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <RefreshCw className={`w-5 h-5 animate-spin`} />
              <CardTitle>Migration Progress</CardTitle>
            </div>
            <CardDescription>
              {migrationFlow
                ? `Converting "${migrationFlow.sourceBot.name}" to "${migrationFlow.targetAgent.name}"`
                : 'Initializing migration...'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {migrationFlow ? (
              <div className="space-y-4">
                {migrationFlow.steps.map((step) => (
                  <div key={step.id} className={`p-4 rounded-lg border-2 ${getStepColor(step)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getStepIcon(step)}
                        <div>
                          <div className="font-semibold text-gray-900">{step.name}</div>
                          <div className="text-sm text-gray-600">{step.description}</div>
                        </div>
                      </div>
                      <Badge variant={step.status === 'completed' ? 'default' : 'secondary'}>
                        {step.status}
                      </Badge>
                    </div>
                    {step.status === 'in-progress' && (
                      <Progress value={step.progress} className="w-full" />
                    )}
                    <div className="text-sm text-gray-600 mt-2">
                      {step.details}
                    </div>
                    {step.error && (
                      <div className="text-sm text-red-600 mt-2">
                        Error: {step.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-24">
                <span className="text-blue-600 font-semibold">Preparing migration steps...</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Migration Complete */}
      {migrationFlow?.status === 'completed' && realAgent && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <CheckCircle className="w-5 h-5" />
              Migration Complete!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-2">Your new AI agent is ready!</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Agent: {realAgent.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Model: {realAgent.model}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Status: Published</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Capabilities: {realAgent.capabilities.length} active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Extensions: {realAgent.extensions.filter(e => e.enabled).length} enabled</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">🤖 Real AI Capabilities Enabled</h4>
                <div className="grid gap-2 text-sm text-blue-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>GPT-4 Turbo LLM integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Microsoft Teams meeting scheduling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>SharePoint document collaboration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Power Automate workflow triggers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Real-time data analysis and insights</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => window.open(`/agents/${realAgent.id}`, '_blank')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open AI Agent
                </Button>
                <Button 
                  onClick={() => window.open(realAgent.deploymentUrl, '_blank')}
                  variant="outline"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Copilot Studio
                </Button>
                <Button 
                  onClick={() => {
                    setMigrationFlow(null)
                    setSelectedBot(null)
                    setAgentName('')
                    setRealAgent(null)
                  }}
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start New Migration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      {migrationFlow?.status === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                <div>
                  <div className="font-semibold">Reconfigure Authorization</div>
                  <div className="text-sm text-gray-600">Set up Azure AD, API keys, or OAuth in Copilot Studio</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                <div>
                  <div className="font-semibold">Reconnect Channels</div>
                  <div className="text-sm text-gray-600">Configure Teams, web chat, and other channels</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                <div>
                  <div className="font-semibold">Reconnect Bot Framework Skills</div>
                  <div className="text-sm text-gray-600">Link your custom skills and components</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                <div>
                  <div className="font-semibold">Test Everything</div>
                  <div className="text-sm text-gray-600">Validate all flows, topics, and integrations</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 