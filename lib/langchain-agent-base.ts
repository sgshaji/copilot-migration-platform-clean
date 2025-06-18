export interface LangChainConfig {
  name: string
  domain: string
  systemPrompt: string
  tools: string[]
  temperature: number
  maxTokens: number
}

export interface AgentResponse {
  message: string
  type: 'response' | 'action' | 'error'
  metadata: any
}

export class LangChainAgentBase {
  private config: LangChainConfig

  constructor(config: LangChainConfig) {
    this.config = config
    console.log(`🧠 LangChain Agent initialized: ${config.name} (${config.domain})`)
  }

  async processMessage(message: string, context: any = {}): Promise<AgentResponse> {
    try {
      // Simulate intelligent processing based on domain
      const response = await this.generateDomainResponse(message, context)

      return {
        message: response,
        type: 'response',
        metadata: {
          domain: this.config.domain,
          temperature: this.config.temperature,
          tools: this.config.tools,
          agentName: this.config.name
        }
      }
    } catch (error) {
      return {
        message: `Error processing request: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error',
        metadata: { error: true }
      }
    }
  }

  private async generateDomainResponse(message: string, context: any): Promise<string> {
    const domain = this.config.domain
    const systemPrompt = this.config.systemPrompt

    // Domain-specific response logic
    const responses = {
      hr: this.generateHRResponse(message),
      it: this.generateITResponse(message),
      sales: this.generateSalesResponse(message),
      default: this.generateDefaultResponse(message)
    }

    const response = responses[domain as keyof typeof responses] || responses.default
    return `${systemPrompt}\n\n${response}\n\n*Powered by LangChain AI Agent*`
  }

  private generateHRResponse(message: string): string {
    if (message.toLowerCase().includes('leave') || message.toLowerCase().includes('vacation')) {
      return "I can help you with leave requests. Please provide the dates and type of leave you're requesting."
    }
    if (message.toLowerCase().includes('policy')) {
      return "I'll check our HR policies for you. What specific policy information do you need?"
    }
    return "Hello! I'm your HR assistant. I can help with leave requests, policies, benefits, and general HR questions."
  }

  private generateITResponse(message: string): string {
    if (message.toLowerCase().includes('password')) {
      return "I can help you reset your password. Please verify your identity and I'll guide you through the process."
    }
    if (message.toLowerCase().includes('access') || message.toLowerCase().includes('login')) {
      return "Let me check your access permissions. What system are you trying to access?"
    }
    return "Hi! I'm your IT support agent. I can help with technical issues, access problems, and system support."
  }

  private generateSalesResponse(message: string): string {
    if (message.toLowerCase().includes('price') || message.toLowerCase().includes('cost')) {
      return "I'd be happy to provide pricing information. What product or service are you interested in?"
    }
    if (message.toLowerCase().includes('demo')) {
      return "I can schedule a product demo for you. What's your preferred time and what would you like to see?"
    }
    return "Welcome! I'm your sales assistant. I can help with product information, pricing, and demo scheduling."
  }

  private generateDefaultResponse(message: string): string {
    return "Hello! I'm an AI agent ready to assist you. How can I help you today?"
  }
}