"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, Bot, MessageCircle, FileText, Send } from "lucide-react"

interface ChatMessage {
  id: string
  sender: "user" | "bot"
  message: string
  timestamp: Date
  intent?: string
  confidence?: number
}

interface BotConfig {
  name: string
  platform: string
  description: string
  intents: Array<{
    name: string
    examples: string[]
    responses: string[]
  }>
  entities: Array<{
    name: string
    values: string[]
  }>
  fallbackResponse: string
}

const HR_BOT_CONFIG: BotConfig = {
  name: "HR Leave Assistant",
  platform: "Microsoft Bot Framework v4.0",
  description: "Handles employee leave requests and HR inquiries",
  intents: [
    {
      name: "CheckLeaveBalance",
      examples: [
        "how many vacation days do i have",
        "check my leave balance",
        "remaining vacation days",
        "how much time off do i have left",
        "vacation days",
        "leave balance",
        "time off",
        "days left",
        "vacation",
        "leave",
      ],
      responses: [
        "You have 15 vacation days remaining this year.",
        "Your current leave balance is 15 vacation days.",
        "You have 15 days of vacation time left.",
      ],
    },
    {
      name: "ApplyForLeave",
      examples: [
        "i want to apply for leave",
        "request vacation time",
        "take time off",
        "submit leave request",
        "apply leave",
        "request leave",
        "book vacation",
        "schedule time off",
        "leave request",
        "vacation request",
      ],
      responses: [
        "Please fill out the leave request form at hr.company.com/leave-request",
        "To apply for leave, visit our HR portal and submit a request form.",
        "You can submit your leave request through the employee portal.",
      ],
    },
    {
      name: "GetHolidays",
      examples: [
        "when is the next holiday",
        "company holidays",
        "holiday schedule",
        "upcoming holidays",
        "holidays",
        "next holiday",
        "holiday dates",
        "public holidays",
        "company calendar",
      ],
      responses: [
        "The next company holiday is Thanksgiving on November 23rd.",
        "Our upcoming holidays are: Thanksgiving (Nov 23), Christmas (Dec 25).",
        "Check the company calendar for all holiday dates.",
      ],
    },
    {
      name: "ContactHR",
      examples: [
        "contact hr",
        "speak to hr representative",
        "hr phone number",
        "hr email",
        "hr contact",
        "talk to hr",
        "hr help",
        "human resources",
        "hr department",
      ],
      responses: [
        "You can contact HR at hr@company.com or call (555) 123-4567.",
        "HR is available Monday-Friday 9AM-5PM. Email: hr@company.com",
        "For urgent matters, call HR at (555) 123-4567.",
      ],
    },
  ],
  entities: [
    {
      name: "leaveType",
      values: ["vacation", "sick", "personal", "maternity", "paternity"],
    },
    {
      name: "dateRange",
      values: ["today", "tomorrow", "next week", "next month"],
    },
  ],
  fallbackResponse:
    "I'm sorry, I didn't understand that. I can help you with leave balances, applying for leave, holidays, or contacting HR.",
}

const IT_BOT_CONFIG: BotConfig = {
  name: "IT Helpdesk Bot",
  platform: "Google Dialogflow ES",
  description: "Provides IT support and troubleshooting assistance",
  intents: [
    {
      name: "PasswordReset",
      examples: [
        "reset my password",
        "forgot password",
        "password not working",
        "can't login",
        "password reset",
        "forgot my password",
        "password help",
        "login issues",
        "password",
        "reset password",
        "login problem",
      ],
      responses: [
        "I'll help you reset your password. Please visit reset.company.com and follow the instructions.",
        "To reset your password, go to the IT portal and click 'Forgot Password'.",
        "Password reset link has been sent to your email. Check your inbox.",
      ],
    },
    {
      name: "SoftwareRequest",
      examples: [
        "need new software",
        "install application",
        "software access",
        "request program",
        "software request",
        "install software",
        "new application",
        "software installation",
        "program request",
        "app install",
      ],
      responses: [
        "Please submit a software request ticket through the IT portal.",
        "Software requests require manager approval. Submit a ticket with justification.",
        "I've created a software request ticket. IT will review within 2 business days.",
      ],
    },
    {
      name: "TechnicalIssue",
      examples: [
        "computer not working",
        "internet down",
        "printer issues",
        "technical problem",
        "tech issue",
        "computer problem",
        "system down",
        "technical support",
        "it problem",
        "computer help",
      ],
      responses: [
        "I've logged your technical issue. IT support will contact you within 4 hours.",
        "For urgent technical issues, call the IT helpdesk at (555) 123-TECH.",
        "Please provide more details about the issue and I'll escalate to IT support.",
      ],
    },
    {
      name: "AccessRequest",
      examples: [
        "need access to system",
        "permission request",
        "can't access folder",
        "system access",
        "access request",
        "need permissions",
        "folder access",
        "system permissions",
        "access help",
        "permission denied",
      ],
      responses: [
        "Access requests require manager approval. Please submit through the IT portal.",
        "I'll create an access request ticket. Your manager will need to approve it.",
        "System access is granted based on role requirements. Submit a formal request.",
      ],
    },
  ],
  entities: [
    {
      name: "softwareType",
      values: ["Adobe", "Office", "Slack", "Zoom", "Salesforce"],
    },
    {
      name: "urgency",
      values: ["low", "medium", "high", "critical"],
    },
  ],
  fallbackResponse:
    "I can help with password resets, software requests, technical issues, or access requests. Please rephrase your question.",
}

const SALES_BOT_CONFIG: BotConfig = {
  name: "Sales Inquiry Bot",
  platform: "Microsoft Power Virtual Agents",
  description: "Handles sales inquiries and lead qualification",
  intents: [
    {
      name: "ProductInquiry",
      examples: ["tell me about your products", "what do you sell", "product information", "your solutions"],
      responses: [
        "We offer enterprise software solutions for HR, Finance, and Operations.",
        "Our main products include HRPro, FinanceMax, and OptiFlow platforms.",
        "I can provide detailed information about our software solutions. Which area interests you?",
      ],
    },
    {
      name: "PricingRequest",
      examples: ["how much does it cost", "pricing information", "what are your rates", "cost of software"],
      responses: [
        "Pricing varies based on company size and requirements. I'll connect you with sales.",
        "Our pricing starts at $50/user/month. Let me get you a custom quote.",
        "I'll have a sales representative contact you with detailed pricing information.",
      ],
    },
    {
      name: "DemoRequest",
      examples: ["schedule a demo", "product demonstration", "see the software", "show me how it works"],
      responses: [
        "I'd be happy to schedule a demo! Please provide your contact information.",
        "Our demos are available Tuesday-Thursday. What time works best for you?",
        "I'll set up a personalized demo with one of our product specialists.",
      ],
    },
    {
      name: "ContactSales",
      examples: ["speak to sales", "talk to salesperson", "sales representative", "contact sales team"],
      responses: [
        "I'll connect you with our sales team. Please hold while I transfer you.",
        "Our sales team is available at sales@company.com or (555) 123-SALE.",
        "A sales representative will contact you within 1 business day.",
      ],
    },
  ],
  entities: [
    {
      name: "companySize",
      values: ["startup", "small", "medium", "enterprise"],
    },
    {
      name: "industry",
      values: ["healthcare", "finance", "retail", "manufacturing", "technology"],
    },
  ],
  fallbackResponse: "I can help with product information, pricing, demos, or connecting you with our sales team.",
}

const BOT_CONFIGS = {
  hr: HR_BOT_CONFIG,
  it: IT_BOT_CONFIG,
  sales: SALES_BOT_CONFIG,
}

export default function LegacyChatbots() {
  const [activeBot, setActiveBot] = useState<keyof typeof BOT_CONFIGS>("hr")
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({
    hr: [],
    it: [],
    sales: [],
  })
  const [currentInput, setCurrentInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const calculateSimilarity = (userInput: string, intentExample: string): number => {
    const userWords = userInput
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2)
    const exampleWords = intentExample
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2)

    // Check for exact phrase matches first
    if (
      userInput.toLowerCase().includes(intentExample.toLowerCase()) ||
      intentExample.toLowerCase().includes(userInput.toLowerCase())
    ) {
      return 0.9
    }

    // Check for key word matches
    let matchCount = 0
    for (const userWord of userWords) {
      for (const exampleWord of exampleWords) {
        if (userWord === exampleWord || userWord.includes(exampleWord) || exampleWord.includes(userWord)) {
          matchCount++
          break
        }
      }
    }

    return matchCount / Math.max(userWords.length, exampleWords.length, 1)
  }

  const processMessage = (botKey: keyof typeof BOT_CONFIGS, userMessage: string) => {
    const config = BOT_CONFIGS[botKey]
    const lowerMessage = userMessage.toLowerCase()

    // Find matching intent
    let matchedIntent = null
    let confidence = 0

    for (const intent of config.intents) {
      for (const example of intent.examples) {
        const similarity = calculateSimilarity(lowerMessage, example.toLowerCase())
        if (similarity > confidence) {
          confidence = similarity
          matchedIntent = intent
        }
      }
    }

    // Get response - LOWER the threshold from 0.6 to 0.3
    let botResponse = config.fallbackResponse
    let detectedIntent = "fallback"

    if (matchedIntent && confidence > 0.3) {
      const responses = matchedIntent.responses
      botResponse = responses[Math.floor(Math.random() * responses.length)]
      detectedIntent = matchedIntent.name
    }

    return { response: botResponse, intent: detectedIntent, confidence: Math.round(confidence * 100) }
  }

  const sendMessage = async () => {
    if (!currentInput.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      message: currentInput,
      timestamp: new Date(),
    }

    setChatMessages((prev) => ({
      ...prev,
      [activeBot]: [...prev[activeBot], userMessage],
    }))

    setCurrentInput("")
    setIsTyping(true)

    // Simulate bot thinking time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    const { response, intent, confidence } = processMessage(activeBot, currentInput)

    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: "bot",
      message: response,
      timestamp: new Date(),
      intent,
      confidence,
    }

    setChatMessages((prev) => ({
      ...prev,
      [activeBot]: [...prev[activeBot], botMessage],
    }))

    setIsTyping(false)
  }

  const downloadBotArtifact = (botKey: keyof typeof BOT_CONFIGS) => {
    const config = BOT_CONFIGS[botKey]
    const artifact = {
      name: config.name,
      platform: config.platform,
      description: config.description,
      version: "1.0.0",
      created: new Date().toISOString(),
      intents: config.intents.map((intent) => ({
        name: intent.name,
        examples: intent.examples,
        responses: intent.responses,
      })),
      entities: config.entities,
      fallbackResponse: config.fallbackResponse,
      conversationLogs: chatMessages[botKey].map((msg) => ({
        timestamp: msg.timestamp.toISOString(),
        sender: msg.sender,
        message: msg.message,
        intent: msg.intent,
        confidence: msg.confidence,
      })),
    }

    const blob = new Blob([JSON.stringify(artifact, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${config.name.toLowerCase().replace(/\s+/g, "-")}-config.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const currentConfig = BOT_CONFIGS[activeBot]
  const currentMessages = chatMessages[activeBot]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">🤖 Legacy Chatbot Showcase</h1>
        <p className="text-gray-600">Experience our actual working legacy chatbots before migration</p>
      </div>

      <Tabs value={activeBot} onValueChange={(value) => setActiveBot(value as keyof typeof BOT_CONFIGS)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hr" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            HR Assistant
          </TabsTrigger>
          <TabsTrigger value="it" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            IT Helpdesk
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Sales Inquiry
          </TabsTrigger>
        </TabsList>

        {Object.entries(BOT_CONFIGS).map(([key, config]) => (
          <TabsContent key={key} value={key} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bot Info & Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Bot Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Platform:</span>
                      <Badge variant="outline">{config.platform}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Intents:</span>
                      <span className="font-medium">{config.intents.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Entities:</span>
                      <span className="font-medium">{config.entities.length}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Available Intents:</h4>
                    <div className="space-y-1">
                      {config.intents.map((intent, index) => (
                        <Badge key={index} variant="secondary" className="mr-1 mb-1 text-xs">
                          {intent.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Try These Phrases:</h4>
                    <div className="space-y-1 text-xs text-gray-600">
                      {config.intents.slice(0, 2).map((intent, index) => (
                        <div key={index}>
                          <p className="font-medium">• {intent.examples[0]}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => downloadBotArtifact(key as keyof typeof BOT_CONFIGS)}
                    className="w-full flex items-center gap-2"
                    variant="outline"
                  >
                    <Download className="w-4 h-4" />
                    Download Bot Config
                  </Button>
                </CardContent>
              </Card>

              {/* Chat Interface */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Chat with {config.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{config.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Chat Messages */}
                  <ScrollArea className="h-80 w-full border rounded p-4">
                    <div className="space-y-4">
                      {currentMessages.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                          <Bot className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>Start a conversation with {config.name}</p>
                          <p className="text-sm mt-1">Try: "{config.intents[0].examples[0]}"</p>
                        </div>
                      )}

                      {currentMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</p>
                              {message.sender === "bot" && message.intent && (
                                <Badge variant="outline" className="text-xs">
                                  {message.intent} ({message.confidence}%)
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 px-4 py-2 rounded-lg">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="flex gap-2">
                    <Input
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      placeholder={`Ask ${config.name} something...`}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      disabled={isTyping}
                    />
                    <Button onClick={sendMessage} disabled={isTyping || !currentInput.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    {config.intents.slice(0, 3).map((intent, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentInput(intent.examples[0])
                          setTimeout(sendMessage, 100)
                        }}
                        disabled={isTyping}
                      >
                        {intent.examples[0]}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bot Limitations */}
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">🚨 Legacy Bot Limitations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-red-700 mb-2">Functional Limitations:</h4>
                    <ul className="space-y-1 text-red-600">
                      <li>• Static, pre-programmed responses only</li>
                      <li>• No context awareness between conversations</li>
                      <li>• Cannot access real-time data or systems</li>
                      <li>• Limited to exact intent matching</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-700 mb-2">Business Impact:</h4>
                    <ul className="space-y-1 text-red-600">
                      <li>• Users must navigate to external systems</li>
                      <li>• No proactive recommendations or insights</li>
                      <li>• Cannot orchestrate multi-step workflows</li>
                      <li>• Requires manual follow-up for complex tasks</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
