export interface ClassicBot {
  id: string
  name: string
  description: string
  topics: Topic[]
  entities: Entity[]
  powerAutomateFlows: PowerAutomateFlow[]
  channels: Channel[]
  authorization: Authorization
  botFrameworkSkills: BotFrameworkSkill[]
  customComponents: CustomComponent[]
  status: 'active' | 'inactive' | 'migrating'
  createdAt: string
  lastModified: string
}

export interface Topic {
  id: string
  name: string
  description: string
  type: 'web-canvas' | 'code' | 'fallback'
  content: string
  isMigratable: boolean
}

export interface Entity {
  id: string
  name: string
  type: 'custom' | 'system' | 'prebuilt'
  synonyms: string[]
  isMigratable: boolean
}

export interface PowerAutomateFlow {
  id: string
  name: string
  description: string
  trigger: string
  actions: string[]
  isMigratable: boolean
}

export interface Channel {
  id: string
  name: string
  type: 'teams' | 'web' | 'mobile' | 'email'
  configuration: any
  isMigratable: boolean
}

export interface Authorization {
  type: 'azure-ad' | 'api-key' | 'oauth'
  configuration: any
  isMigratable: boolean
}

export interface BotFrameworkSkill {
  id: string
  name: string
  endpoint: string
  msAppId: string
  isMigratable: boolean
}

export interface CustomComponent {
  id: string
  name: string
  type: 'api' | 'service' | 'database'
  endpoint: string
  configuration: any
  isMigratable: boolean
}

export interface CopilotAgent {
  id: string
  name: string
  description: string
  sourceBotId: string
  topics: Topic[]
  entities: Entity[]
  powerAutomateFlows: PowerAutomateFlow[]
  channels: Channel[]
  authorization: Authorization
  botFrameworkSkills: BotFrameworkSkill[]
  customComponents: CustomComponent[]
  status: 'draft' | 'testing' | 'published' | 'error'
  createdAt: string
  publishedAt?: string
  deploymentUrl?: string
}

export interface MigrationStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'error'
  progress: number
  details: string
  error?: string
}

export interface MigrationFlow {
  id: string
  sourceBot: ClassicBot
  targetAgent: CopilotAgent
  steps: MigrationStep[]
  status: 'initializing' | 'cloning' | 'converting' | 'configuring' | 'testing' | 'deploying' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
}

export class CopilotStudioMigration {
  private static instance: CopilotStudioMigration

  public static getInstance(): CopilotStudioMigration {
    if (!CopilotStudioMigration.instance) {
      CopilotStudioMigration.instance = new CopilotStudioMigration()
    }
    return CopilotStudioMigration.instance
  }

  async startMigration(sourceBot: ClassicBot, agentName: string): Promise<MigrationFlow> {
    const migrationFlow: MigrationFlow = {
      id: this.generateId(),
      sourceBot,
      targetAgent: {
        id: this.generateId(),
        name: agentName,
        description: `Migrated from ${sourceBot.name}`,
        sourceBotId: sourceBot.id,
        topics: [],
        entities: [],
        powerAutomateFlows: [],
        channels: [],
        authorization: sourceBot.authorization,
        botFrameworkSkills: [],
        customComponents: [],
        status: 'draft',
        createdAt: new Date().toISOString()
      },
      steps: this.createMigrationSteps(),
      status: 'initializing',
      createdAt: new Date().toISOString()
    }

    // Start the migration process
    await this.executeMigration(migrationFlow)
    
    return migrationFlow
  }

  private createMigrationSteps(): MigrationStep[] {
    return [
      {
        id: 'step-1',
        name: 'Open Classic Bot',
        description: 'Accessing the source classic chatbot in Copilot Studio',
        status: 'pending',
        progress: 0,
        details: 'Connecting to Copilot Studio...'
      },
      {
        id: 'step-2',
        name: 'Clone and Convert',
        description: 'Creating a copy and converting to AI agent',
        status: 'pending',
        progress: 0,
        details: 'Preparing to clone the bot...'
      },
      {
        id: 'step-3',
        name: 'Name and Create',
        description: 'Setting up the new AI agent with custom name',
        status: 'pending',
        progress: 0,
        details: 'Configuring agent name...'
      },
      {
        id: 'step-4',
        name: 'Review Migrated Content',
        description: 'Validating topics, entities, and Power Automate flows',
        status: 'pending',
        progress: 0,
        details: 'Analyzing migrated content...'
      },
      {
        id: 'step-5',
        name: 'Reconfigure Settings',
        description: 'Setting up authorization, channels, and security',
        status: 'pending',
        progress: 0,
        details: 'Configuring security settings...'
      },
      {
        id: 'step-6',
        name: 'Test Everything',
        description: 'Validating all flows, topics, and integrations',
        status: 'pending',
        progress: 0,
        details: 'Running comprehensive tests...'
      },
      {
        id: 'step-7',
        name: 'Deploy Agent',
        description: 'Publishing the new AI agent to production',
        status: 'pending',
        progress: 0,
        details: 'Preparing for deployment...'
      }
    ]
  }

  private async executeMigration(migrationFlow: MigrationFlow): Promise<void> {
    try {
      // Step 1: Open Classic Bot
      await this.executeStep(migrationFlow, 'step-1', async () => {
        await this.simulateDelay(2000)
        return 'Successfully connected to Copilot Studio'
      })

      // Step 2: Clone and Convert
      await this.executeStep(migrationFlow, 'step-2', async () => {
        await this.simulateDelay(3000)
        const clonedTopics = migrationFlow.sourceBot.topics.filter(t => t.isMigratable)
        const clonedEntities = migrationFlow.sourceBot.entities.filter(e => e.isMigratable)
        const clonedFlows = migrationFlow.sourceBot.powerAutomateFlows.filter(f => f.isMigratable)
        
        migrationFlow.targetAgent.topics = clonedTopics
        migrationFlow.targetAgent.entities = clonedEntities
        migrationFlow.targetAgent.powerAutomateFlows = clonedFlows
        
        return `Cloned ${clonedTopics.length} topics, ${clonedEntities.length} entities, and ${clonedFlows.length} flows`
      })

      // Step 3: Name and Create
      await this.executeStep(migrationFlow, 'step-3', async () => {
        await this.simulateDelay(1500)
        migrationFlow.targetAgent.name = migrationFlow.targetAgent.name
        return `Agent "${migrationFlow.targetAgent.name}" created successfully`
      })

      // Step 4: Review Migrated Content
      await this.executeStep(migrationFlow, 'step-4', async () => {
        await this.simulateDelay(2500)
        const webCanvasTopics = migrationFlow.targetAgent.topics.filter(t => t.type === 'web-canvas')
        const customEntities = migrationFlow.targetAgent.entities.filter(e => e.type === 'custom')
        
        return `Migrated ${webCanvasTopics.length} web canvas topics and ${customEntities.length} custom entities`
      })

      // Step 5: Reconfigure Settings
      await this.executeStep(migrationFlow, 'step-5', async () => {
        await this.simulateDelay(3000)
        // Note: Authorization, channels, and skills need manual reconfiguration
        return 'Security settings configured. Manual reconfiguration required for channels and skills.'
      })

      // Step 6: Test Everything
      await this.executeStep(migrationFlow, 'step-6', async () => {
        await this.simulateDelay(4000)
        const testResults = await this.runComprehensiveTests(migrationFlow.targetAgent)
        return `Tests completed: ${testResults.passed}/${testResults.total} passed`
      })

      // Step 7: Deploy Agent
      await this.executeStep(migrationFlow, 'step-7', async () => {
        await this.simulateDelay(5000)
        const deploymentUrl = await this.deployAgent(migrationFlow.targetAgent)
        migrationFlow.targetAgent.deploymentUrl = deploymentUrl
        migrationFlow.targetAgent.status = 'published'
        migrationFlow.targetAgent.publishedAt = new Date().toISOString()
        
        return `Agent deployed successfully at ${deploymentUrl}`
      })

      migrationFlow.status = 'completed'
      migrationFlow.completedAt = new Date().toISOString()

    } catch (error) {
      migrationFlow.status = 'failed'
      console.error('Migration failed:', error)
    }
  }

  private async executeStep(migrationFlow: MigrationFlow, stepId: string, action: () => Promise<string>): Promise<void> {
    const step = migrationFlow.steps.find(s => s.id === stepId)
    if (!step) return

    step.status = 'in-progress'
    step.progress = 0

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        if (step.progress < 90) {
          step.progress += Math.random() * 20
        }
      }, 200)

      const result = await action()
      
      clearInterval(progressInterval)
      step.progress = 100
      step.status = 'completed'
      step.details = result

      // Update migration status
      const stepIndex = migrationFlow.steps.findIndex(s => s.id === stepId)
      if (stepIndex === 0) migrationFlow.status = 'cloning'
      else if (stepIndex === 1) migrationFlow.status = 'converting'
      else if (stepIndex === 2) migrationFlow.status = 'configuring'
      else if (stepIndex === 3) migrationFlow.status = 'testing'
      else if (stepIndex === 4) migrationFlow.status = 'deploying'

    } catch (error) {
      step.status = 'error'
      step.error = error instanceof Error ? error.message : 'Unknown error'
      throw error
    }
  }

  private async runComprehensiveTests(agent: CopilotAgent): Promise<{ passed: number; total: number }> {
    const tests = [
      { name: 'Topic Validation', passed: Math.random() > 0.1 },
      { name: 'Entity Recognition', passed: Math.random() > 0.1 },
      { name: 'Power Automate Integration', passed: Math.random() > 0.1 },
      { name: 'Channel Connectivity', passed: Math.random() > 0.1 },
      { name: 'Authorization Security', passed: Math.random() > 0.1 },
      { name: 'Custom Component Integration', passed: Math.random() > 0.1 }
    ]

    const passed = tests.filter(t => t.passed).length
    return { passed, total: tests.length }
  }

  private async deployAgent(agent: CopilotAgent): Promise<string> {
    // Simulate deployment to Copilot Studio
    const deploymentId = this.generateId()
    return `https://copilot.microsoft.com/agents/${deploymentId}`
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Mock data for demonstration
  getMockClassicBots(): ClassicBot[] {
    return [
      {
        id: 'bot-1',
        name: 'Customer Support Bot',
        description: 'Handles customer inquiries and support tickets',
        topics: [
          { id: 't1', name: 'General Inquiries', description: 'Basic customer questions', type: 'web-canvas', content: '...', isMigratable: true },
          { id: 't2', name: 'Technical Support', description: 'Technical issues and troubleshooting', type: 'web-canvas', content: '...', isMigratable: true },
          { id: 't3', name: 'Billing Questions', description: 'Payment and billing inquiries', type: 'code', content: '...', isMigratable: false }
        ],
        entities: [
          { id: 'e1', name: 'Product', type: 'custom', synonyms: ['item', 'service'], isMigratable: true },
          { id: 'e2', name: 'IssueType', type: 'custom', synonyms: ['problem', 'error'], isMigratable: true }
        ],
        powerAutomateFlows: [
          { id: 'f1', name: 'Create Support Ticket', description: 'Creates a new support ticket', trigger: 'user_message', actions: ['create_ticket'], isMigratable: true },
          { id: 'f2', name: 'Send Email Notification', description: 'Sends email to support team', trigger: 'ticket_created', actions: ['send_email'], isMigratable: true }
        ],
        channels: [
          { id: 'c1', name: 'Teams', type: 'teams', configuration: {}, isMigratable: true },
          { id: 'c2', name: 'Web Chat', type: 'web', configuration: {}, isMigratable: true }
        ],
        authorization: { type: 'azure-ad', configuration: {}, isMigratable: true },
        botFrameworkSkills: [
          { id: 's1', name: 'Calendar Skill', endpoint: 'https://calendar-skill.azurewebsites.net', msAppId: 'app-1', isMigratable: true }
        ],
        customComponents: [
          { id: 'cc1', name: 'CRM Integration', type: 'api', endpoint: 'https://api.crm.com', configuration: {}, isMigratable: true }
        ],
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        lastModified: '2024-06-18T00:00:00Z'
      },
      {
        id: 'bot-2',
        name: 'Sales Assistant Bot',
        description: 'Helps with sales inquiries and lead qualification',
        topics: [
          { id: 't4', name: 'Product Information', description: 'Product details and pricing', type: 'web-canvas', content: '...', isMigratable: true },
          { id: 't5', name: 'Lead Qualification', description: 'Qualifies sales leads', type: 'web-canvas', content: '...', isMigratable: true }
        ],
        entities: [
          { id: 'e3', name: 'Lead', type: 'custom', synonyms: ['prospect', 'potential'], isMigratable: true },
          { id: 'e4', name: 'Product', type: 'custom', synonyms: ['solution', 'service'], isMigratable: true }
        ],
        powerAutomateFlows: [
          { id: 'f3', name: 'Create Lead', description: 'Creates a new lead in CRM', trigger: 'lead_identified', actions: ['create_lead'], isMigratable: true }
        ],
        channels: [
          { id: 'c3', name: 'Teams', type: 'teams', configuration: {}, isMigratable: true }
        ],
        authorization: { type: 'azure-ad', configuration: {}, isMigratable: true },
        botFrameworkSkills: [],
        customComponents: [
          { id: 'cc2', name: 'Salesforce Integration', type: 'api', endpoint: 'https://api.salesforce.com', configuration: {}, isMigratable: true }
        ],
        status: 'active',
        createdAt: '2024-02-01T00:00:00Z',
        lastModified: '2024-06-18T00:00:00Z'
      }
    ]
  }
} 