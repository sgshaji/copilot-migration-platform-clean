"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Minimize2, X } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatInterfaceProps {
  agentName?: string
  agentId?: string
}

export default function ChatInterface({ agentName = "AI Agent", agentId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: `Hello! I'm ${agentName}. I've been successfully migrated from a legacy chatbot and I'm now powered by advanced AI. How can I help you today?`,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(
      () => {
        const botResponse = generateBotResponse(inputValue)
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: botResponse,
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    // Sample responses based on common intents
    if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
      return "Hello! I'm your upgraded AI agent. I can help you with various tasks and provide intelligent responses. What would you like to know?"
    }

    if (input.includes("help") || input.includes("what can you do")) {
      return "I can assist you with:\n• Answering questions intelligently\n• Processing complex requests\n• Integrating with enterprise systems\n• Providing contextual responses\n• Learning from our conversations\n\nI'm much more capable than my legacy chatbot predecessor!"
    }

    if (input.includes("leave") || input.includes("vacation") || input.includes("time off")) {
      return "I can help you with leave requests! I can check your current balance, submit new requests, and track approval status. I'm integrated with your HR systems for real-time information."
    }

    if (input.includes("password") || input.includes("reset") || input.includes("login")) {
      return "I can assist with password resets and login issues. I'll guide you through the secure verification process and can create tickets for complex technical issues."
    }

    if (input.includes("product") || input.includes("demo") || input.includes("pricing")) {
      return "I'd be happy to help with product information! I can provide detailed specifications, arrange demos, and connect you with our sales team for pricing discussions."
    }

    if (input.includes("migration") || input.includes("upgrade") || input.includes("legacy")) {
      return "Great question! I'm a perfect example of successful bot migration. I was transformed from a legacy chatbot into this AI-powered agent with enhanced capabilities, better understanding, and enterprise integrations."
    }

    // Default intelligent response
    const responses = [
      "That's an interesting question! As an upgraded AI agent, I can provide more nuanced responses than traditional chatbots. Let me help you with that.",
      "I understand your request. With my enhanced AI capabilities, I can process complex queries and provide contextual assistance.",
      "Thanks for reaching out! I'm equipped with advanced natural language understanding to better serve your needs.",
      "I'm here to help! My AI-powered responses are designed to be more helpful and accurate than legacy chatbot systems.",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardHeader className="border-b bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{agentName}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                    Live Agent
                  </Badge>
                  <span className="text-xs text-muted-foreground">Powered by AI</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => window.close()}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "bot" && (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
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
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t bg-white p-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              This is your successfully migrated AI agent - now with enhanced capabilities!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
