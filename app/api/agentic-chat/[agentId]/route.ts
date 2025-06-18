import { NextRequest, NextResponse } from "next/server"
import { AgenticAIEngine } from "@/lib/agentic-ai-engine"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const startTime = Date.now()
  let agent = null

  try {
    const { message, userContext } = await request.json()
    const resolvedParams = await params
    const agentId = resolvedParams.agentId

    if (!message || !agentId) {
      return NextResponse.json({
        error: "Message and agent ID are required"
      }, { status: 400 })
    }

    console.log(`🤖 Agentic API: Processing message for agent ${agentId} (${message.length} chars)`)

    const agenticEngine = AgenticAIEngine.getInstance()

    // Check if agent exists, if not create it based on stored config
    let agent = agenticEngine.getAgent(agentId)

    if (!agent) {
      // Try to load agent from database with performance monitoring
      const { DatabaseService } = await import('@/lib/database-service')
      const dbService = new DatabaseService()

      // Use optimized loading method
      agent = await agenticEngine.loadAgentWithMetrics(agentId, dbService)

      if (!agent) {
        // Create default agent as fallback
        const fallbackStart = Date.now()
        agent = await agenticEngine.createAgenticAgent({
          name: `Agent ${agentId}`,
          domain: 'general',
          intents: ['general_inquiry'],
          customSkills: ['predictive_analytics']
        })
        console.log(`🚀 Created fallback agent in ${Date.now() - fallbackStart}ms: ${agent.name}`)
      }
    }

    // Process the request with agentic AI
    const processingStart = Date.now()
    const result = await agenticEngine.processAgenticRequest(
      agent.id,
      message,
      userContext
    )
    const processingTime = Date.now() - processingStart
    const totalTime = Date.now() - startTime

    console.log(`⚡ Performance: Agent loading: ${processingStart - startTime}ms, Processing: ${processingTime}ms, Total: ${totalTime}ms`)

    return NextResponse.json({
      success: true,
      ...result,
      agentInfo: {
        id: agent.id,
        name: agent.name,
        domain: agent.domain,
        skillCount: agent.skills.length,
        type: "agentic-ai"
      },
      performance: {
        totalTime,
        processingTime,
        agentLoadTime: processingStart - startTime
      }
    })

  } catch (error) {
    console.error("❌ Agentic API error:", error)
    console.error("❌ Stack trace:", error.stack)
    console.error("❌ Agent state:", agent ? `Agent ${agent.name} loaded` : "No agent loaded")

    return NextResponse.json({
      success: false,
      error: "Agentic processing failed",
      response: "I'm experiencing technical difficulties with my agentic AI capabilities. Please try again.",
      skillsUsed: [],
      insights: ["System recovery in progress"],
      nextActions: ["Retry request"],
      confidence: 50,
      debug: {
        errorType: error.constructor.name,
        errorMessage: error.message,
        agentLoaded: !!agent,
        processingTime: Date.now() - startTime
      }
    }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const resolvedParams = await params
    const agentId = resolvedParams.agentId
    const agenticEngine = AgenticAIEngine.getInstance()

    const agent = agenticEngine.getAgent(agentId)

    if (!agent) {
      return NextResponse.json({
        error: "Agent not found"
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        name: agent.name,
        domain: agent.domain,
        skills: agent.skills.map(s => ({
          id: s.id,
          name: s.name,
          description: s.description,
          category: s.category,
          enabled: s.enabled
        })),
        skillCount: agent.skills.length,
        type: "agentic-ai"
      }
    })

  } catch (error) {
    console.error("❌ Agent info error:", error)
    return NextResponse.json({
      error: "Failed to get agent info"
    }, { status: 500 })
  }
}