import { type NextRequest, NextResponse } from "next/server"
import { HfInference } from "@huggingface/inference"

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY || process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY)

interface RouteParams {
  params: Promise<{
    agentId: string
  }>
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { agentId } = await params
    const body = await request.json()

    console.log(`📨 Webhook received for agent ${agentId}:`, body)

    // Get the message from different possible formats
    const userMessage = body.text || body.message || body.payload?.text || "Hello"
    const userId = body.userId || body.user || "anonymous"

    console.log(`👤 User ${userId}: ${userMessage}`)

    // Use Hugging Face service for intelligent responses
    const agentResponse = await generateAIResponse(userMessage, getBotConfig(agentId))

    console.log(`🤖 Agent response:`, agentResponse)

    // Return response in expected format
    return NextResponse.json({
      responses: [
        {
          text: agentResponse.message,
          type: agentResponse.type || "text",
          metadata: agentResponse.metadata || {}
        }
      ],
      agentId,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json(
      {
        responses: [
          {
            text: "I apologize, but I'm experiencing technical difficulties. Please try again.",
            type: "error"
          }
        ],
        error: "Internal server error"
      },
      { status: 500 }
    )
  }
}

function getBotConfig(agentId: string) {
  // In a real app, this would fetch from database
  // For now, return a default config based on agent type
  const configs = {
    hr: {
      domain: "hr",
      systemPrompt: "You are an HR assistant helping with leave requests and policies.",
      intents: ["leave_request", "policy_question", "team_coverage"],
    },
    it: {
      domain: "it",
      systemPrompt: "You are an IT support assistant helping with technical issues.",
      intents: ["password_reset", "access_request", "technical_issue"],
    },
    sales: {
      domain: "sales",
      systemPrompt: "You are a sales assistant helping with product inquiries.",
      intents: ["product_inquiry", "pricing_request", "demo_request"],
    },
  }

  // Determine config based on agent ID pattern
  if (agentId.includes("hr")) return configs.hr
  if (agentId.includes("it")) return configs.it
  if (agentId.includes("sales")) return configs.sales

  return configs.hr // default
}

async function generateAIResponse(userMessage: string, botConfig: any): Promise<string> {
  try {
    const prompt = `${botConfig.systemPrompt}

User: ${userMessage}
Assistant: `

    // Use a more reliable model
    const response = await hf.textGeneration({
      model: "microsoft/DialoGPT-medium",
      inputs: prompt,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.7,
        return_full_text: false,
        do_sample: true,
      },
    })

    return response.generated_text.trim()
  } catch (error) {
    console.error("AI generation failed:", error)
    // Provide domain-specific fallback responses
    const domain = botConfig.domain || 'general'
    const fallbacks = {
      hr: "I'm here to help with your HR needs. Could you please tell me more about what you're looking for?",
      it: "I can assist with your technical issue. Please provide more details about the problem you're experiencing.",
      sales: "I'd be happy to help you learn more about our products and services. What specific information are you looking for?",
      general: "I understand you're asking about that. Let me help you with the information I have available."
    }
    return fallbacks[domain as keyof typeof fallbacks] || fallbacks.general
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { agentId } = await params
  return NextResponse.json({
    status: "active",
    agentId: agentId,
    message: "Botpress webhook is running",
  })
}