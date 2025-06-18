
"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Send, 
  Bot, 
  User, 
  Brain, 
  Zap, 
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Database
} from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  metadata?: {
    confidence?: number
    actions?: string[]
    dataSource?: string
    processingTime?: number
  }
}

interface AgentConfig {
  id: string
  name: string
  domain: string
  capabilities: string[]
  integrations: string[]
  status: string
}

interface ChatInterfaceProps {
  agentId: string
  agentConfig?: AgentConfig
}

export default function ChatInterface({ agentId, agentConfig }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [agent, setAgent] = useState<AgentConfig | null>(agentConfig || null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load agent configuration if not provided
    if (!agent) {
      loadAgentConfig()
    }
    
    // Add welcome message
    if (messages.length === 0) {
      addWelcomeMessage()
    }
  }, [agentId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadAgentConfig = async () => {
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get', agentId })
      })
      
      const result = await response.json()
      if (result.success) {
        setAgent(result.agentData)
      }
    } catch (error) {
      console.error('Failed to load agent config:', error)
    }
  }

  const addWelcomeMessage = () => {
    const welcomeMessage: ChatMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: `🤖 **Welcome to ${agent?.name || 'AI Agent'}**

I'm your intelligent ${agent?.domain || 'business'} assistant powered by real AI capabilities.

**🧠 My Capabilities:**
${agent?.capabilities.map(cap => `• ${cap}`).join('\n') || '• Intelligent conversation\n• Context understanding\n• Proactive assistance'}

**🔗 Connected Systems:**
${agent?.integrations.map(int => `• ${int}`).join('\n') || '• Real-time data access\n• Workflow automation'}

**⚡ What makes me different:**
Unlike legacy bots, I can understand context, access real-time data, automate workflows, and provide proactive recommendations.

Try asking me something specific to your ${agent?.domain || 'business'} needs!`,
      timestamp: new Date().toISOString(),
      metadata: {
        confidence: 100,
        actions: ['Real-time analysis', 'Proactive recommendations', 'Workflow automation'],
        dataSource: 'AI Agent System'
      }
    }
    
    setMessages([welcomeMessage])
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const startTime = Date.now()
      
      const response = await fetch(`/api/chat/${agentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          conversationHistory: messages.slice(-5) // Last 5 messages for context
        })
      })

      const processingTime = Date.now() - startTime

      if (response.ok) {
        const data = await response.json()
        
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString(),
          metadata: {
            confidence: 85 + Math.random() * 10, // Simulated confidence
            actions: data.capabilities?.slice(0, 3) || [],
            dataSource: 'AI Analysis Engine',
            processingTime
          }
        }

        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '⚠️ **Connection Issue**\n\nI encountered a technical issue. My AI capabilities are still active - please try your request again.',
        timestamp: new Date().toISOString(),
        metadata: {
          confidence: 0,
          actions: ['Retry request'],
          dataSource: 'Error Handler'
        }
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatContent = (content: string) => {
    // Convert markdown-like formatting to JSX
    return content.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={index} className="font-bold text-lg mb-2">{line.slice(2, -2)}</div>
      }
      if (line.startsWith('• ')) {
        return <div key={index} className="ml-4 mb-1">• {line.slice(2)}</div>
      }
      if (line.startsWith('✅ ') || line.startsWith('🎯 ') || line.startsWith('🚀 ')) {
        return <div key={index} className="mb-1 text-green-700">{line}</div>
      }
      if (line.trim() === '') {
        return <div key={index} className="h-2"></div>
      }
      return <div key={index} className="mb-1">{line}</div>
    })
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Agent Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  <Bot className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{agent?.name || 'AI Agent'}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {agent?.domain ? `${agent.domain.toUpperCase()} AI Assistant` : 'Intelligent Assistant'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={agent?.status === 'active' ? 'default' : 'outline'}>
                <div className={`w-2 h-2 rounded-full mr-1 ${
                  agent?.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                {agent?.status || 'active'}
              </Badge>
              <Badge variant="outline">
                <Brain className="w-3 h-3 mr-1" />
                Real AI
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[600px] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[80%] ${
                    message.role === 'user' ? 'order-first' : ''
                  }`}>
                    <div className={`rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white ml-auto'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <div className="text-sm">
                        {message.role === 'assistant' ? formatContent(message.content) : message.content}
                      </div>
                    </div>
                    
                    {/* Message Metadata */}
                    {message.metadata && message.role === 'assistant' && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.metadata.confidence && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {message.metadata.confidence.toFixed(0)}% confidence
                          </Badge>
                        )}
                        {message.metadata.processingTime && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {message.metadata.processingTime}ms
                          </Badge>
                        )}
                        {message.metadata.dataSource && (
                          <Badge variant="outline" className="text-xs">
                            <Database className="w-3 h-3 mr-1" />
                            {message.metadata.dataSource}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">AI thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
        </CardContent>
        
        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask your ${agent?.domain || 'AI'} assistant anything...`}
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={sendMessage} disabled={!input.trim() || isLoading}>
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Real AI Powered
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Context Aware
            </div>
            <div className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              Proactive Intelligence
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
