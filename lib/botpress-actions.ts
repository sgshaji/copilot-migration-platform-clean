
import type { RealBotpressDeployment, RealBotpressAgent } from "./real-botpress-service"

export interface BotpressAgent {
  id: string
  name: string
  url: string
  status: "deploying" | "active" | "error"
  capabilities: string[]
  integrations: string[]
  createdAt: string
  replId?: string
  publicUrl?: string
  deploymentType?: string
}

export interface BotpressDeployment {
  success: boolean
  agent?: BotpressAgent
  error?: string
  migrationInstructions?: {
    replitSteps?: string[]
    microsoftSteps: string[]
    requiredKeys: string[]
    estimatedTime: string
  }
}

import { deployBotpressAgent } from "./real-botpress-service"

export async function deployToBotpress(botAnalysis: any, agentBlueprint: any): Promise<BotpressDeployment> {
  try {
    console.log("🚀 Starting Botpress deployment on Replit...")
    console.log("📊 Bot analysis:", botAnalysis)

    const botpressResult = await deployBotpressAgent(botAnalysis, agentBlueprint)
    
    if (botpressResult.success && botpressResult.agent) {
      // Convert to expected format
      const agent: BotpressAgent = {
        id: botpressResult.agent.id,
        name: botpressResult.agent.name,
        url: botpressResult.agent.url,
        status: botpressResult.agent.status,
        capabilities: botpressResult.agent.capabilities,
        integrations: botpressResult.agent.integrations,
        createdAt: botpressResult.agent.createdAt,
        replId: botpressResult.agent.botpressId,
        publicUrl: botpressResult.agent.publicUrl,
        deploymentType: botpressResult.agent.deploymentType
      }

      return {
        success: true,
        agent,
        migrationInstructions: botpressResult.migrationInstructions
      }
    }

    return {
      success: false,
      error: botpressResult.error || "Unknown deployment error"
    }

  } catch (error) {
    console.error("❌ Deployment exception:", error)
    return {
      success: false,
      error: `Deployment failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

// Helper functions for the UI
const deployedAgents = new Map<string, BotpressAgent>()

export async function getDeployedAgents(): Promise<BotpressAgent[]> {
  return Array.from(deployedAgents.values())
}

export async function storeDeployedAgent(agent: BotpressAgent): Promise<void> {
  deployedAgents.set(agent.id, agent)
}
