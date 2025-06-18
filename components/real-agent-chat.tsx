'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Send, 
  Bot, 
  User, 
  Calendar, 
  FileText, 
  Workflow, 
  BarChart3,
  Teams,
  Mail,
  Share,
  Zap,
  CheckCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'
import { RealCopilotAgent, AgenticUseCase } from '@/lib/real-ai-migration'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type: 'text' | 'action' | 'result'
  metadata?: {
    action?: string
    result?: any
    extensions?: string[]
  }
}

interface RealAgentChatProps {
  agent: RealCopilotAgent
  onClose?: () => void
}

export default function RealAgentChat({ agent, onClose }: RealAgentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeUseCase, setActiveUseCase] = useState<AgenticUseCase | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm ${agent.name}, your AI assistant powered by Microsoft Copilot Studio. I can help you with:

🤖 **Intelligent Conversations** - Natural language understanding and context awareness
📅 **Meeting Management** - Schedule Teams meetings, find available slots, manage calendar
📄 **Document Collaboration** - Create, edit, and share SharePoint documents
⚡ **Workflow Automation** - Trigger Power Automate flows and business processes
📊 **Data Analysis** - Generate insights and performance reports

What would you like to do today?`,
      timestamp: new Date(),
      type: 'text'
    }
    setMessages([welcomeMessage])
  }, [agent.name])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    setIsProcessing(true)

    // Simulate AI processing with real capabilities
    await processUserMessage(input)
  }

  const processUserMessage = async (userInput: string) => {
    const lowerInput = userInput.toLowerCase()
    
    // Determine the type of request and simulate real AI processing
    if (lowerInput.includes('meeting') || lowerInput.includes('schedule') || lowerInput.includes('calendar')) {
      await handleMeetingRequest(userInput)
    } else if (lowerInput.includes('document') || lowerInput.includes('sharepoint') || lowerInput.includes('file')) {
      await handleDocumentRequest(userInput)
    } else if (lowerInput.includes('workflow') || lowerInput.includes('automate') || lowerInput.includes('ticket')) {
      await handleWorkflowRequest(userInput)
    } else if (lowerInput.includes('analyze') || lowerInput.includes('report') || lowerInput.includes('insight')) {
      await handleAnalysisRequest(userInput)
    } else {
      await handleGeneralConversation(userInput)
    }

    setIsTyping(false)
    setIsProcessing(false)
  }

  const handleMeetingRequest = async (userInput: string) => {
    // Simulate Teams meeting scheduling
    const actionMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'I\'ll help you schedule that meeting. Let me check your calendar and Teams availability...',
      timestamp: new Date(),
      type: 'action',
      metadata: {
        action: 'schedule_meeting',
        extensions: ['teams', 'calendar', 'outlook']
      }
    }

    setMessages(prev => [...prev, actionMessage])

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    const resultMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `✅ **Meeting Scheduled Successfully!**

📅 **Meeting Details:**
- **Subject:** Team Standup Meeting
- **Date:** Tomorrow, 10:00 AM - 10:30 AM
- **Attendees:** Sales Team (5 people)
- **Platform:** Microsoft Teams
- **Meeting Link:** https://teams.microsoft.com/l/meetup-join/...

📧 **Actions Taken:**
- Created Teams meeting invitation
- Sent calendar invites to all attendees
- Set up recurring weekly schedule
- Added meeting agenda template

Would you like me to send a reminder email or modify any details?`,
      timestamp: new Date(),
      type: 'result',
      metadata: {
        action: 'meeting_scheduled',
        result: {
          meetingId: 'mtg-12345',
          teamsUrl: 'https://teams.microsoft.com/l/meetup-join/...',
          attendees: ['john@company.com', 'sarah@company.com', 'mike@company.com']
        }
      }
    }

    setMessages(prev => [...prev, resultMessage])
  }

  const handleDocumentRequest = async (userInput: string) => {
    const actionMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'I\'ll help you with document management. Let me access SharePoint and create the document...',
      timestamp: new Date(),
      type: 'action',
      metadata: {
        action: 'create_document',
        extensions: ['sharepoint', 'onedrive']
      }
    }

    setMessages(prev => [...prev, actionMessage])

    await new Promise(resolve => setTimeout(resolve, 1500))

    const resultMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `📄 **Document Created Successfully!**

📋 **Document Details:**
- **Name:** Q4 Sales Strategy Proposal
- **Location:** SharePoint > Documents > Sales
- **Type:** PowerPoint Presentation
- **Access:** Shared with Marketing Team
- **Link:** https://company.sharepoint.com/sites/sales/Documents/...

🔧 **Actions Completed:**
- Created new PowerPoint presentation
- Applied company template
- Set up collaborative editing permissions
- Added initial content structure
- Shared with relevant team members

The document is ready for collaboration. Would you like me to add specific content or invite additional team members?`,
      timestamp: new Date(),
      type: 'result',
      metadata: {
        action: 'document_created',
        result: {
          documentId: 'doc-67890',
          sharepointUrl: 'https://company.sharepoint.com/sites/sales/Documents/...',
          permissions: ['Marketing Team - Edit', 'Sales Team - Edit']
        }
      }
    }

    setMessages(prev => [...prev, resultMessage])
  }

  const handleWorkflowRequest = async (userInput: string) => {
    const actionMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'I\'ll trigger the workflow automation. Let me process your request through Power Automate...',
      timestamp: new Date(),
      type: 'action',
      metadata: {
        action: 'trigger_workflow',
        extensions: ['power-automate']
      }
    }

    setMessages(prev => [...prev, actionMessage])

    await new Promise(resolve => setTimeout(resolve, 3000))

    const resultMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `⚡ **Workflow Executed Successfully!**

🎫 **Support Ticket Created:**
- **Ticket ID:** TKT-2024-001
- **Priority:** Medium
- **Category:** Technical Support
- **Assigned To:** IT Support Team
- **Status:** In Progress

📧 **Notifications Sent:**
- Email confirmation to customer
- Slack notification to support team
- Teams channel update
- CRM record created

🔄 **Next Steps:**
- Support team will review within 2 hours
- Automated follow-up scheduled for 24 hours
- Escalation rules configured

The workflow has been triggered and all systems are updated. Is there anything else you need help with?`,
      timestamp: new Date(),
      type: 'result',
      metadata: {
        action: 'workflow_triggered',
        result: {
          ticketId: 'TKT-2024-001',
          workflowId: 'flow-abc123',
          notifications: ['email', 'slack', 'teams', 'crm']
        }
      }
    }

    setMessages(prev => [...prev, resultMessage])
  }

  const handleAnalysisRequest = async (userInput: string) => {
    const actionMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'I\'ll analyze the data and generate insights. Let me process the information...',
      timestamp: new Date(),
      type: 'action',
      metadata: {
        action: 'analyze_data',
        extensions: ['power-automate', 'sharepoint']
      }
    }

    setMessages(prev => [...prev, actionMessage])

    await new Promise(resolve => setTimeout(resolve, 2500))

    const resultMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `📊 **Analysis Complete - Key Insights Generated!**

📈 **Performance Summary:**
- **Customer Satisfaction:** 4.2/5 (↑ 12% vs last month)
- **Response Time:** 2.3 hours average (↓ 18% improvement)
- **Resolution Rate:** 94% (↑ 6% vs last month)
- **Ticket Volume:** 1,247 tickets (↓ 8% vs last month)

🎯 **Top Insights:**
1. **Peak Hours:** 2-4 PM has highest ticket volume
2. **Common Issues:** Password resets (23%), Software access (18%)
3. **Team Performance:** IT Support Team A leads with 98% satisfaction
4. **Trend:** Mobile app issues decreasing by 15%

📋 **Recommendations:**
- Add self-service password reset portal
- Implement chatbot for common software access requests
- Schedule additional support staff during peak hours
- Continue mobile app optimization efforts

Would you like me to create a detailed report or set up automated monitoring?`,
      timestamp: new Date(),
      type: 'result',
      metadata: {
        action: 'analysis_complete',
        result: {
          reportId: 'RPT-2024-001',
          insights: 4,
          recommendations: 4,
          dataPoints: 1247
        }
      }
    }

    setMessages(prev => [...prev, resultMessage])
  }

  const handleGeneralConversation = async (userInput: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const responseMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I understand you're asking about "${userInput}". As your AI assistant, I can help you with:

🤖 **Conversation:** I can engage in natural, context-aware conversations
📅 **Meetings:** Schedule, reschedule, or find available meeting times
📄 **Documents:** Create, edit, and collaborate on SharePoint documents
⚡ **Automation:** Trigger workflows and business processes
📊 **Analysis:** Generate insights and performance reports

What specific task would you like me to help you with?`,
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, responseMessage])
  }

  const quickActions = [
    {
      icon: <Calendar className="w-4 h-4" />,
      label: 'Schedule Meeting',
      action: 'Schedule a 30-minute meeting with the sales team tomorrow at 2 PM'
    },
    {
      icon: <FileText className="w-4 h-4" />,
      label: 'Create Document',
      action: 'Create a new project proposal document in SharePoint'
    },
    {
      icon: <Workflow className="w-4 h-4" />,
      label: 'Create Ticket',
      action: 'Create a support ticket for software access request'
    },
    {
      icon: <BarChart3 className="w-4 h-4" />,
      label: 'Generate Report',
      action: 'Analyze customer support trends and generate insights'
    }
  ]

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Badge variant="outline" className="text-xs">
                  {agent.model}
                </Badge>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Active
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            {onClose && (
              <Button variant="outline" size="sm" onClick={onClose}>
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 bg-gradient-to-br from-gray-50 to-white">
        {/* Quick Actions */}
        <div className="px-4 pb-3 border-b bg-white/80">
          <div className="flex gap-2 overflow-x-auto">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInput(action.action)}
                className="whitespace-nowrap"
              >
                {action.icon}
                <span className="ml-1">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4 bg-gradient-to-br from-gray-50 to-white" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`group max-w-[80%] rounded-2xl px-4 py-3 shadow-sm transition-all duration-150 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                  } hover:shadow-lg`}
                >
                  <div className="flex items-end gap-2">
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="whitespace-pre-wrap text-base leading-relaxed">{message.content}</div>
                      {message.metadata?.extensions && (
                        <div className="flex gap-1 mt-2">
                          {message.metadata.extensions.map((ext) => (
                            <Badge key={ext} variant="secondary" className="text-xs">
                              {ext}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-2 text-right">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-sm">
                  <Bot className="w-4 h-4 text-blue-500" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t bg-white/80">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything... (meetings, documents, workflows, analysis)"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isProcessing}
              className="flex-1 text-base px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isProcessing}
              className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 