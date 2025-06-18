
export interface ConnectedPlatform {
  id: string
  name: string
  type: 'power-virtual-agents' | 'dialogflow' | 'bot-framework' | 'botpress'
  status: 'connected' | 'disconnected' | 'error'
  lastSync: string
  apiEndpoint?: string
  bots: ConnectedBot[]
}

export interface ConnectedBot {
  id: string
  name: string
  platform: string
  description: string
  status: 'active' | 'inactive' | 'error'
  lastModified: string
  intents: number
  conversations: number
  isClassic: boolean
  metadata?: {
    version?: string
    language?: string
    totalUtterances?: number
    complexity?: 'low' | 'medium' | 'high'
  }
}

export class PlatformIntegrationService {
  private static instance: PlatformIntegrationService
  private connectedPlatforms: Map<string, ConnectedPlatform> = new Map()

  public static getInstance(): PlatformIntegrationService {
    if (!PlatformIntegrationService.instance) {
      PlatformIntegrationService.instance = new PlatformIntegrationService()
    }
    return PlatformIntegrationService.instance
  }

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    // Mock connected platforms for demo
    const mockPlatforms: ConnectedPlatform[] = [
      {
        id: 'pva-main',
        name: 'Microsoft Power Virtual Agents',
        type: 'power-virtual-agents',
        status: 'connected',
        lastSync: '2024-01-20T10:30:00Z',
        apiEndpoint: 'https://powerva.microsoft.com/api/v1',
        bots: [
          {
            id: 'pva-hr-bot',
            name: 'Employee Services Bot',
            platform: 'Microsoft Power Virtual Agents',
            description: 'HR bot handling vacation requests and policy questions',
            status: 'active',
            lastModified: '2024-01-15',
            intents: 12,
            conversations: 1847,
            isClassic: true,
            metadata: {
              version: '2.0',
              language: 'en-US',
              complexity: 'medium'
            }
          }
        ]
      },
      {
        id: 'dialogflow-main',
        name: 'Google Dialogflow',
        type: 'dialogflow',
        status: 'connected',
        lastSync: '2024-01-19T15:45:00Z',
        apiEndpoint: 'https://dialogflow.googleapis.com/v2',
        bots: [
          {
            id: 'df-support-bot',
            name: 'Customer Support Assistant',
            platform: 'Google Dialogflow',
            description: 'Handles customer inquiries and technical support',
            status: 'active',
            lastModified: '2024-01-10',
            intents: 8,
            conversations: 892,
            isClassic: true,
            metadata: {
              version: 'v2',
              language: 'en',
              complexity: 'low'
            }
          }
        ]
      },
      {
        id: 'botframework-main',
        name: 'Microsoft Bot Framework',
        type: 'bot-framework',
        status: 'connected',
        lastSync: '2024-01-18T09:20:00Z',
        apiEndpoint: 'https://api.botframework.com/v3',
        bots: [
          {
            id: 'bf-sales-bot',
            name: 'Sales Inquiry Bot',
            platform: 'Microsoft Bot Framework',
            description: 'Qualifies leads and schedules product demos',
            status: 'active',
            lastModified: '2024-01-20',
            intents: 15,
            conversations: 634,
            isClassic: true,
            metadata: {
              version: '4.0',
              language: 'en-US',
              complexity: 'medium'
            }
          }
        ]
      }
    ]

    mockPlatforms.forEach(platform => {
      this.connectedPlatforms.set(platform.id, platform)
    })
  }

  async getConnectedPlatforms(): Promise<ConnectedPlatform[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return Array.from(this.connectedPlatforms.values())
  }

  async getConnectedBots(): Promise<ConnectedBot[]> {
    const platforms = await this.getConnectedPlatforms()
    return platforms.flatMap(platform => platform.bots)
  }

  async getBotById(botId: string): Promise<ConnectedBot | null> {
    const bots = await this.getConnectedBots()
    return bots.find(bot => bot.id === botId) || null
  }

  async analyzeBotForMigration(botId: string): Promise<any> {
    const bot = await this.getBotById(botId)
    if (!bot) {
      throw new Error('Bot not found')
    }

    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000))

    return {
      botType: 'Classic Chatbot',
      name: bot.name,
      platform: bot.platform,
      intents: bot.intents,
      entities: Math.floor(bot.intents * 0.6), // Estimate entities
      complexity: bot.metadata?.complexity || 'medium',
      migrationTime: this.estimateMigrationTime(bot),
      compatibility: this.calculateCompatibility(bot),
      estimatedSteps: 6,
      conversationHistory: bot.conversations,
      recommendations: this.generateRecommendations(bot)
    }
  }

  private estimateMigrationTime(bot: ConnectedBot): string {
    const baseTime = 20
    const complexityMultiplier = {
      low: 1,
      medium: 1.25,
      high: 1.5
    }
    
    const complexity = bot.metadata?.complexity || 'medium'
    const estimatedMinutes = Math.round(baseTime * complexityMultiplier[complexity])
    
    return `${estimatedMinutes}-${estimatedMinutes + 10} minutes`
  }

  private calculateCompatibility(bot: ConnectedBot): number {
    let baseCompatibility = 95

    // Reduce compatibility based on platform-specific factors
    if (bot.platform.includes('Bot Framework') && bot.metadata?.version === '3.0') {
      baseCompatibility -= 5 // Older version
    }

    if (bot.intents > 20) {
      baseCompatibility -= 2 // High complexity
    }

    return Math.max(85, baseCompatibility)
  }

  private generateRecommendations(bot: ConnectedBot): string[] {
    const recommendations = [
      'Upgrade to modern AI responses with contextual understanding',
      'Add proactive conversation capabilities',
      'Integrate with Microsoft 365 ecosystem'
    ]

    if (bot.platform.includes('Power Virtual Agents')) {
      recommendations.push('Migrate Power Automate flows to Power Platform connectors')
    }

    if (bot.platform.includes('Dialogflow')) {
      recommendations.push('Convert Google Cloud integrations to Azure services')
    }

    if (bot.intents > 15) {
      recommendations.push('Consolidate similar intents using AI intent recognition')
    }

    return recommendations
  }

  async connectPlatform(platformType: string, credentials: any): Promise<boolean> {
    // Simulate platform connection
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In a real implementation, this would:
    // 1. Validate credentials
    // 2. Test API connection
    // 3. Fetch bot list
    // 4. Store connection details
    
    return true
  }

  async disconnectPlatform(platformId: string): Promise<boolean> {
    return this.connectedPlatforms.delete(platformId)
  }

  async syncPlatform(platformId: string): Promise<boolean> {
    const platform = this.connectedPlatforms.get(platformId)
    if (!platform) return false

    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    platform.lastSync = new Date().toISOString()
    this.connectedPlatforms.set(platformId, platform)
    
    return true
  }
}
