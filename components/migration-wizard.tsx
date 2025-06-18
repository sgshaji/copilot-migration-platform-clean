
"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, AlertCircle, Bot, Zap, Brain, TrendingUp, TestTube, Shield, Upload, FileText, Sparkles, Clock, Target, Users, ChevronRight, Play, Pause, RotateCcw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { PlatformIntegrationService } from "@/lib/platform-integration-service"

// Non-blocking toast notification system
const useToast = () => ({
  toast: ({ title, description, variant = "default" }: { title: string; description: string; variant?: string }) => {
    // Create non-blocking toast notification
    if (typeof window !== 'undefined') {
      const toast = document.createElement('div')
      toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full ${
        variant === 'destructive' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
      }`
      toast.innerHTML = `
        <div class="flex items-center justify-between">
          <div>
            <div class="font-semibold">${title}</div>
            <div class="text-sm opacity-90">${description}</div>
          </div>
          <button class="ml-4 text-white hover:opacity-70" onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>
      `
      document.body.appendChild(toast)
      
      // Animate in
      setTimeout(() => toast.classList.remove('translate-x-full'), 100)
      
      // Auto remove after 4 seconds
      setTimeout(() => {
        toast.classList.add('translate-x-full')
        setTimeout(() => toast.remove(), 300)
      }, 4000)
    }
  }
})

const PRE_BUILT_BOTS = [
  {
    id: "hr-assistant",
    name: "HR Assistant",
    description: "Leave requests, employee queries, policy information",
    domain: "hr",
    version: "3.1",
    features: ["Leave Management", "Policy Queries", "Employee Directory"],
    icon: "👥",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "it-helpdesk",
    name: "IT Helpdesk",
    description: "Password resets, access requests, technical support",
    domain: "it",
    version: "3.1",
    features: ["Password Management", "Access Control", "Ticket Creation"],
    icon: "🔧",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "sales-assistant",
    name: "Sales Assistant",
    description: "Lead qualification, product demos, sales support",
    domain: "sales",
    version: "3.1",
    features: ["Lead Scoring", "Demo Scheduling", "CRM Integration"],
    icon: "📈",
    color: "from-purple-500 to-pink-500"
  }
]

// Mock integrated platforms and their bots
const MOCK_INTEGRATED_BOTS = [
  {
    id: "pva-hr-bot",
    name: "Employee Services Bot",
    platform: "Microsoft Power Virtual Agents",
    description: "HR bot handling vacation requests and policy questions",
    status: "active",
    lastModified: "2024-01-15",
    intents: 12,
    conversations: 1847,
    isClassic: true,
    icon: "🏢",
    platformColor: "bg-blue-100 text-blue-800"
  },
  {
    id: "df-support-bot",
    name: "Customer Support Assistant",
    platform: "Google Dialogflow",
    description: "Handles customer inquiries and technical support",
    status: "active", 
    lastModified: "2024-01-10",
    intents: 8,
    conversations: 892,
    isClassic: true,
    icon: "🤖",
    platformColor: "bg-orange-100 text-orange-800"
  },
  {
    id: "bf-sales-bot",
    name: "Sales Inquiry Bot",
    platform: "Microsoft Bot Framework",
    description: "Qualifies leads and schedules product demos",
    status: "active",
    lastModified: "2024-01-20",
    intents: 15,
    conversations: 634,
    isClassic: true,
    icon: "💼",
    platformColor: "bg-indigo-100 text-indigo-800"
  }
]

interface MigrationStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'error'
  progress: number
  details?: string[]
  icon: React.ComponentType<any>
  estimatedTime: string
}

export default function MigrationWizard() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [botUrl, setBotUrl] = useState("")
  const [selectedBot, setSelectedBot] = useState<string | null>(null)
  const [migrationMode, setMigrationMode] = useState<'analyze' | 'prebuilt' | 'integrated'>('analyze')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [agentName, setAgentName] = useState("")
  const [testResults, setTestResults] = useState<any>(null)
  const [connectedPlatforms, setConnectedPlatforms] = useState<any[]>([])
  const [selectedIntegratedBot, setSelectedIntegratedBot] = useState<string | null>(null)
  const [isLoadingIntegrations, setIsLoadingIntegrations] = useState(false)

  const migrationSteps: MigrationStep[] = [
    {
      id: 'analyze-bot',
      title: 'Analyze Existing Bot',
      description: 'Extract intents, entities, and conversation flows',
      status: 'pending',
      progress: 0,
      icon: Brain,
      estimatedTime: '2-3 min',
      details: [
        'Scanning bot configuration',
        'Extracting conversation flows',
        'Identifying intents and entities',
        'Analyzing response patterns'
      ]
    },
    {
      id: 'transform-architecture',
      title: 'Transform Architecture',
      description: 'Convert to modern AI agent architecture',
      status: 'pending',
      progress: 0,
      icon: Zap,
      estimatedTime: '5-7 min',
      details: [
        'Upgrading to LLM-based responses',
        'Converting rule-based logic',
        'Implementing context management',
        'Setting up intent recognition'
      ]
    },
    {
      id: 'enhance-capabilities',
      title: 'Enhance Capabilities',
      description: 'Add enterprise features and integrations',
      status: 'pending',
      progress: 0,
      icon: TrendingUp,
      estimatedTime: '3-5 min',
      details: [
        'Adding enterprise integrations',
        'Implementing advanced NLP',
        'Setting up knowledge base',
        'Configuring security features'
      ]
    },
    {
      id: 'deploy-agent',
      title: 'Deploy AI Agent',
      description: 'Deploy your enhanced agent to production',
      status: 'pending',
      progress: 0,
      icon: Bot,
      estimatedTime: '2-3 min',
      details: [
        'Configuring deployment environment',
        'Setting up monitoring',
        'Configuring webhooks',
        'Initializing agent runtime'
      ]
    },
    {
      id: 'test-validate',
      title: 'Test & Validate',
      description: 'Comprehensive testing and validation',
      status: 'pending',
      progress: 0,
      icon: TestTube,
      estimatedTime: '3-4 min',
      details: [
        'Running conversation tests',
        'Validating intent recognition',
        'Testing integrations',
        'Performance benchmarking'
      ]
    },
    {
      id: 'go-live',
      title: 'Go Live',
      description: 'Launch your AI agent to users',
      status: 'pending',
      progress: 0,
      icon: Shield,
      estimatedTime: '1-2 min',
      details: [
        'Final security checks',
        'User access configuration',
        'Monitoring setup',
        'Agent activation'
      ]
    }
  ]

  const [steps, setSteps] = useState<MigrationStep[]>(migrationSteps)

  const simulateStepExecution = async (stepIndex: number) => {
    const step = steps[stepIndex]

    // Start step
    setSteps(prev => prev.map((s, i) => 
      i === stepIndex ? { ...s, status: 'running', progress: 0 } : s
    ))

    // Simulate progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 300))
      setSteps(prev => prev.map((s, i) => 
        i === stepIndex ? { ...s, progress } : s
      ))
    }

    // Complete step
    setSteps(prev => prev.map((s, i) => 
      i === stepIndex ? { ...s, status: 'completed', progress: 100 } : s
    ))

    // Auto-advance to next step if not the last one
    if (stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex + 1)
    }
  }

  const handleAnalyzeBot = async () => {
    if (!botUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a bot URL or configuration",
        variant: "destructive"
      })
      return
    }

    setIsAnalyzing(true)

    try {
      await simulateStepExecution(0)

      // Mock analysis result
      setAnalysisResult({
        botType: "Legacy Chatbot",
        intents: ["greeting", "password_reset", "account_help", "goodbye"],
        entities: ["user_id", "account_type", "email"],
        complexity: "Medium",
        migrationTime: "25-30 minutes",
        compatibility: 95,
        estimatedSteps: 6
      })

      toast({
        title: "Analysis Complete",
        description: "Your bot has been successfully analyzed and is ready for transformation."
      })
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the bot. Please check the URL and try again.",
        variant: "destructive"
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSelectPrebuilt = (botId: string) => {
    setSelectedBot(botId)
    const bot = PRE_BUILT_BOTS.find(b => b.id === botId)
    if (bot) {
      setAnalysisResult({
        botType: "Pre-built Agent",
        name: bot.name,
        domain: bot.domain,
        features: bot.features,
        complexity: "Low",
        migrationTime: "15-20 minutes",
        compatibility: 100,
        estimatedSteps: 6
      })
      
      // Complete first step for pre-built
      setSteps(prev => prev.map((s, i) => 
        i === 0 ? { ...s, status: 'completed', progress: 100 } : s
      ))
      setCurrentStep(1)
    }
  }

  const loadConnectedPlatforms = async () => {
    setIsLoadingIntegrations(true)
    try {
      const platformService = PlatformIntegrationService.getInstance()
      const bots = await platformService.getConnectedBots()
      setConnectedPlatforms(bots)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load connected platforms",
        variant: "destructive"
      })
    } finally {
      setIsLoadingIntegrations(false)
    }
  }

  const handleSelectIntegratedBot = async (botId: string) => {
    setSelectedIntegratedBot(botId)
    setIsAnalyzing(true)
    
    try {
      const platformService = PlatformIntegrationService.getInstance()
      const analysisResult = await platformService.analyzeBotForMigration(botId)
      
      setAnalysisResult(analysisResult)

      // Complete first step
      setSteps(prev => prev.map((s, i) => 
        i === 0 ? { ...s, status: 'completed', progress: 100 } : s
      ))
      setCurrentStep(1)

      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed classic bot from ${analysisResult.platform}`
      })
    } catch (error) {
      toast({
        title: "Analysis Failed", 
        description: "Failed to analyze the integrated bot",
        variant: "destructive"
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Load connected platforms when integrated tab is selected
  React.useEffect(() => {
    if (migrationMode === 'integrated' && connectedPlatforms.length === 0) {
      loadConnectedPlatforms()
    }
  }, [migrationMode])

  const handleExecuteStep = async (stepIndex: number) => {
    setIsProcessing(true)
    try {
      await simulateStepExecution(stepIndex)
      
      // Special handling for test step
      if (stepIndex === 4) {
        setTestResults({
          conversationTests: { passed: 18, failed: 2, total: 20 },
          intentRecognition: { accuracy: 94.5 },
          integrationTests: { passed: 5, failed: 0, total: 5 },
          performanceScore: 87
        })
      }

      toast({
        title: "Step Complete",
        description: `${steps[stepIndex].title} completed successfully!`
      })
    } catch (error) {
      toast({
        title: "Step Failed",
        description: `Failed to complete ${steps[stepIndex].title}. Please try again.`,
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const renderStepContent = () => {
    const step = steps[currentStep]
    
    if (currentStep === 0) {
      return (
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white text-2xl font-bold">
              🚀
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Start Your Migration Journey</h2>
              <p className="text-gray-600 mt-2">Choose how you'd like to begin transforming your chatbot into an AI agent</p>
            </div>
          </div>

          <Tabs value={migrationMode} onValueChange={(value: any) => setMigrationMode(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-12">
              <TabsTrigger value="analyze" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Files
              </TabsTrigger>
              <TabsTrigger value="integrated" className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                Connected Bots
              </TabsTrigger>
              <TabsTrigger value="prebuilt" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Pre-built Templates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analyze" className="space-y-6 mt-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500 rounded-lg text-white">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-2">Upload Bot Configuration</h3>
                    <p className="text-blue-700 text-sm mb-4">
                      Upload your existing bot files and we'll analyze them to create your AI agent
                    </p>
                    <Input
                      placeholder="Drop files here or paste configuration URL..."
                      value={botUrl}
                      onChange={(e) => setBotUrl(e.target.value)}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <div className="flex flex-wrap gap-2 mt-3 text-xs text-blue-600">
                      <Badge variant="outline" className="border-blue-200">JSON</Badge>
                      <Badge variant="outline" className="border-blue-200">YAML</Badge>
                      <Badge variant="outline" className="border-blue-200">ZIP</Badge>
                      <Badge variant="outline" className="border-blue-200">Bot Framework</Badge>
                      <Badge variant="outline" className="border-blue-200">Dialogflow</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleAnalyzeBot}
                disabled={isAnalyzing}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Analyzing Bot...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Bot Configuration
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="integrated" className="space-y-6 mt-8">
              {isLoadingIntegrations ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <div className="animate-pulse">
                      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                        <Bot className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Loading Connected Platforms</h3>
                      <p className="text-sm text-gray-600">Fetching your connected chatbots...</p>
                    </div>
                  </div>
                </div>
              ) : connectedPlatforms.length === 0 ? (
                <div className="text-center py-12">
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                      <Bot className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">No Connected Platforms</h3>
                      <p className="text-gray-600 mt-2 max-w-md mx-auto">
                        Connect your existing bot platforms to migrate classic chatbots to modern AI agents
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={loadConnectedPlatforms}
                      className="border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Connect Platforms
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <Alert className="border-blue-200 bg-blue-50">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Migration Process:</strong> Select a classic chatbot below to copy and convert it to a modern AI agent with enhanced capabilities.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid gap-4">
                    {MOCK_INTEGRATED_BOTS.map((bot) => (
                      <Card
                        key={bot.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          selectedIntegratedBot === bot.id 
                            ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => handleSelectIntegratedBot(bot.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="text-2xl">{bot.icon}</div>
                              <div className="flex-1">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  {bot.name}
                                  {bot.isClassic && (
                                    <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                                      Classic Bot
                                    </Badge>
                                  )}
                                </CardTitle>
                                <CardDescription className="mt-1">{bot.description}</CardDescription>
                                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                                  <Badge className={bot.platformColor}>{bot.platform}</Badge>
                                  <span className="flex items-center gap-1">
                                    <Target className="w-3 h-3" />
                                    {bot.intents} intents
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {bot.conversations.toLocaleString()} conversations
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant={bot.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                {bot.status}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Modified: {new Date(bot.lastModified).toLocaleDateString()}
                            </span>
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSelectIntegratedBot(bot.id)
                              }}
                            >
                              Copy & Convert
                              <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="prebuilt" className="space-y-6 mt-8">
              <Alert className="border-purple-200 bg-purple-50">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <AlertDescription className="text-purple-800">
                  <strong>Quick Start:</strong> Choose from our pre-built agent templates to get started immediately with proven configurations.
                </AlertDescription>
              </Alert>

              <div className="grid gap-6">
                {PRE_BUILT_BOTS.map((bot) => (
                  <Card
                    key={bot.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg group ${
                      selectedBot === bot.id 
                        ? 'ring-2 ring-purple-500 shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleSelectPrebuilt(bot.id)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bot.color} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                            {bot.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <CardTitle className="text-xl">{bot.name}</CardTitle>
                              <Badge variant="secondary" className="text-xs">v{bot.version}</Badge>
                            </div>
                            <CardDescription className="mt-2 text-base">{bot.description}</CardDescription>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {bot.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs bg-gray-50">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Ready in ~15 minutes
                        </span>
                        <Button 
                          size="sm" 
                          className={`bg-gradient-to-r ${bot.color} hover:opacity-90 transition-opacity`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectPrebuilt(bot.id)
                          }}
                        >
                          Select Template
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )
    }

    if (currentStep === 4 && testResults) {
      return (
        <div className="space-y-6">
          <Alert className="border-green-200 bg-green-50">
            <TestTube className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Validation Complete!</strong> Your AI agent has passed comprehensive testing and is ready for deployment.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Conversation Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((testResults.conversationTests.passed / testResults.conversationTests.total) * 100)}%
                </div>
                <p className="text-sm text-gray-600">
                  {testResults.conversationTests.passed}/{testResults.conversationTests.total} tests passed
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Intent Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {testResults.intentRecognition.accuracy}%
                </div>
                <p className="text-sm text-gray-600">Accuracy rate</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Integration Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {testResults.integrationTests.passed}/{testResults.integrationTests.total}
                </div>
                <p className="text-sm text-gray-600">All integrations working</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Performance Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {testResults.performanceScore}/100
                </div>
                <p className="text-sm text-gray-600">Overall performance</p>
              </CardContent>
            </Card>
          </div>

          <Button 
            onClick={() => handleExecuteStep(currentStep)}
            disabled={isProcessing || step.status === 'completed'}
            className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            {step.status === 'completed' ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Validation Complete
              </>
            ) : isProcessing ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Running Validation Tests...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Validation Tests
              </>
            )}
          </Button>
        </div>
      )
    }

    if (currentStep === 5) {
      return (
        <div className="space-y-6">
          {step.status === 'completed' ? (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full text-white text-4xl">
                🎉
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Migration Complete!</h2>
                <p className="text-gray-600 mt-2 text-lg">Your AI agent is now live and ready for production use</p>
              </div>

              <Alert className="border-green-200 bg-green-50 text-left">
                <Shield className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Status: Active</strong><br />
                  Your agent is processing conversations and ready for users.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-4 text-left">
                <Card className="border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-green-700">Migration Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>• Intents: {analysisResult?.intents?.length || 'Multiple'} successfully migrated</div>
                    <div>• Entities: {analysisResult?.entities?.length || 'Multiple'} converted to AI format</div>
                    <div>• Performance: {testResults?.performanceScore || '95'}/100 validated</div>
                    <div>• Integrations: All enterprise features active</div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-blue-700">Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>• Configure user access and permissions</div>
                    <div>• Set up monitoring and analytics</div>
                    <div>• Train users on new capabilities</div>
                    <div>• Monitor performance metrics</div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-3 justify-center">
                <Link href="/agents">
                  <Button variant="outline" className="border-2">
                    <Bot className="w-4 h-4 mr-2" />
                    View All Agents
                  </Button>
                </Link>
                <Link href={`/chat/${analysisResult?.domain || 'demo'}`}>
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Your Agent
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <Alert>
                <AlertDescription>
                  Ready to launch your AI agent to production. This will make it available to all users.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={() => handleExecuteStep(currentStep)}
                disabled={isProcessing}
                className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Going Live...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Launch AI Agent
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )
    }

    // Default step content for steps 1-3
    return (
      <div className="space-y-6">
        {analysisResult && currentStep === 1 && (
          <Alert className="border-blue-200 bg-blue-50">
            <Brain className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><strong>Bot Type:</strong> {analysisResult.botType}</div>
                <div><strong>Complexity:</strong> {analysisResult.complexity}</div>
                <div><strong>Estimated Time:</strong> {analysisResult.migrationTime}</div>
                <div><strong>Compatibility:</strong> {analysisResult.compatibility}%</div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg`}>
              <step.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Estimated time: {step.estimatedTime}</span>
              </div>
            </div>
          </div>
          
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Current Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-blue-800">
                {step.details?.map((detail, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    {detail}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Button 
          onClick={() => handleExecuteStep(currentStep)}
          disabled={isProcessing || step.status === 'completed'}
          className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        >
          {step.status === 'completed' ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              {step.title} Complete
            </>
          ) : isProcessing ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Executing {step.title}...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Execute {step.title}
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-2xl">
                <span className="mr-3 text-3xl">🚀</span>
                Bot Migration Wizard
              </CardTitle>
              <CardDescription className="text-blue-100 mt-2">
                Transform your legacy chatbot into an AI-powered agent with enterprise capabilities
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">Total Time</div>
              <div className="text-xl font-bold">15-30 min</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Enhanced Progress Steps */}
            <div className="overflow-x-auto pb-4">
              <div className="flex items-center justify-between min-w-[800px]">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`
                        w-14 h-14 rounded-full flex items-center justify-center text-sm font-medium relative transition-all duration-300
                        ${step.status === 'completed' ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg scale-105' : 
                          step.status === 'running' ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg animate-pulse' :
                          index === currentStep ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 border-3 border-blue-500 shadow-md' :
                          'bg-gray-100 text-gray-500'}
                      `}>
                        {step.status === 'completed' ? <CheckCircle className="w-6 h-6" /> : 
                         step.status === 'running' ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : 
                         <step.icon className="w-5 h-5" />}
                      </div>
                      <div className="mt-3 text-center min-w-0 max-w-[120px]">
                        <div className="text-xs font-medium truncate">{step.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{step.estimatedTime}</div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-1 w-16 mx-4 rounded-full transition-all duration-500 ${
                        step.status === 'completed' ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Current Step Progress */}
            {steps[currentStep] && steps[currentStep].status === 'running' && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-blue-700">{steps[currentStep].title}</span>
                  <span className="text-blue-600">{steps[currentStep].progress}%</span>
                </div>
                <Progress 
                  value={steps[currentStep].progress} 
                  className="w-full h-3 bg-blue-100" 
                />
              </div>
            )}

            {/* Step Content */}
            <div className="min-h-[500px] bg-white rounded-lg border border-gray-200 p-6">
              {renderStepContent()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
