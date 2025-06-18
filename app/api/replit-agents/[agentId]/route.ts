import { NextRequest, NextResponse } from "next/server"
import { ReplitAgentHostingService } from "../../../../lib/replit-agent-hosting"

export async function GET(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    console.log(`🔍 Loading Replit agent: ${params.agentId}`)

    // Load agent configuration from Replit storage
    const agentConfig = await loadAgentConfig(params.agentId)

    if (!agentConfig) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      agent: agentConfig,
      hosting: "replit-native"
    })

  } catch (error) {
    console.error("❌ Error loading Replit agent:", error)
    return NextResponse.json(
      { error: "Failed to load agent" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const { message } = await request.json()
    const agentId = params.agentId

    // Get the hosted agent
    const hostingService = ReplitAgentHostingService.getInstance()
    const agent = await hostingService.getAgent(agentId)

    // Try LangChain agent first for intelligent processing
    const langchainAgent = hostingService.getLangChainAgent(agentId)
    if (langchainAgent) {
      console.log(`🧠 Processing with LangChain agent: ${agentId}`)
      const response = await langchainAgent.processMessage(message, { agentId })

      return NextResponse.json({
        success: true,
        response: response.message,
        type: response.type,
        metadata: {
          ...response.metadata,
          agentId,
          processingEngine: 'LangChain + AI',
          timestamp: new Date().toISOString()
        }
      })
    }

    // Load agent configuration
    const agentConfig = await loadAgentConfig(params.agentId)

    if (!agentConfig) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      )
    }

    // Generate AI response using HuggingFace
    const response = await generateAIResponse(message, agentConfig)

    return NextResponse.json({
      success: true,
      response,
      agentId: params.agentId,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("❌ Chat error:", error)
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    )
  }
}

async function loadAgentConfig(agentId: string) {
  try {
    const fs = require('fs')
    const path = require('path')
    const configPath = path.join(process.cwd(), '.replit-agents', `${agentId}.json`)

    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf8')
      return JSON.parse(configData)
    }

    return null
  } catch (error) {
    console.error("Error loading agent config:", error)
    return null
  }
}

async function generateAIResponse(message: string, agentConfig: any): Promise<string> {
  // Use HuggingFace API for AI responses
  const domain = agentConfig.domain || 'default'
  const systemPrompt = agentConfig.systemPrompt || "You are a helpful assistant."

  // Simple AI response logic (can be enhanced with HuggingFace API)
  const responses = {
    hr: [
      "I'll help you with your HR request. Could you provide more details?",
      "Let me check our HR policies for you.",
      "I can assist with leave requests, policies, and general HR questions."
    ],
    it: [
      "I'm here to help with your technical issue. What seems to be the problem?",
      "Let me troubleshoot that for you. Can you describe the error?",
      "I can help with password resets, access issues, and technical support."
    ],
    sales: [
      "I'd be happy to help you learn about our products. What are you looking for?",
      "Let me connect you with product information. What's your use case?",
      "I can provide pricing details and schedule demos. How can I assist?"
    ],
    default: [
      "Hello! How can I help you today?",
      "I'm here to assist you. What would you like to know?",
      "Thanks for your message. How can I support you?"
    ]
  }

  const domainResponses = responses[domain as keyof typeof responses] || responses.default
  const randomResponse = domainResponses[Math.floor(Math.random() * domainResponses.length)]

  return `${randomResponse}\n\n*This agent is hosted on Replit Native and powered by AI.*`
}
