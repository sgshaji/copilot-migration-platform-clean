import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { HfInference } from "@huggingface/inference"
import type { NormalizedBot } from "./bot-parser"
import { SkillPlanGenerator, type SkillPlan } from "./skill-plan-generator"

export interface AgentBlueprint {
  systemPrompt: string
  tools: AgentTool[]
  workflow: WorkflowStep[]
  capabilities: string[]
  integrations: Integration[]
  skillPlans: SkillPlan[]
  metadata: {
    model: string
    confidence: number
    generatedAt: string
  }
}

export interface AgentTool {
  name: string
  description: string
  parameters: Record<string, any>
  implementation: string
}

export interface WorkflowStep {
  id: string
  name: string
  type: "trigger" | "action" | "condition" | "response"
  config: Record<string, any>
}

export interface Integration {
  system: string
  type: "api" | "webhook" | "database" | "service"
  endpoints: string[]
  authentication: string
}

export interface TransformationConfig {
  model: "gpt-4o" | "gpt-3.5-turbo" | "huggingface"
  maxRetries: number
  temperature: number
  maxTokens: number
  includeIntegrations: boolean
  targetPlatform: "copilot-studio" | "azure-bot-service" | "generic"
}

export class AITransformer {
  private static instance: AITransformer
  private hf: HfInference | null = null
  private hasOpenAI = false
  private hasHuggingFace = false

  constructor() {
    // Check available AI services
    this.hasOpenAI = !!(process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY)

    const hfKey = process.env.HUGGINGFACE_API_KEY || process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY
    if (hfKey) {
      this.hf = new HfInference(hfKey)
      this.hasHuggingFace = true
    }

    console.log(`🤖 AI Transformer initialized - OpenAI: ${this.hasOpenAI}, HuggingFace: ${this.hasHuggingFace}`)
  }

  public static getInstance(): AITransformer {
    if (!AITransformer.instance) {
      AITransformer.instance = new AITransformer()
    }
    return AITransformer.instance
  }

  async transformBot(bot: NormalizedBot, config: Partial<TransformationConfig> = {}): Promise<AgentBlueprint> {
    const fullConfig: TransformationConfig = {
      model: "gpt-4o",
      maxRetries: 3,
      temperature: 0.7,
      maxTokens: 2000,
      includeIntegrations: true,
      targetPlatform: "copilot-studio",
      ...config,
    }

    console.log(`🔄 Transforming ${bot.name} using ${fullConfig.model}`)

    // Generate skill plans for each intent
    const skillPlanGenerator = SkillPlanGenerator.getInstance()
    const skillPlans = skillPlanGenerator.generateSkillPlansForBot(
      bot.intents.map(i => i.name), 
      bot.metadata.domain
    )

    console.log(`🎯 Generated ${skillPlans.length} skill plans`)

    // Try different models with fallback
    const models = this.getAvailableModels(fullConfig.model)

    for (const model of models) {
      try {
        const blueprint = await this.attemptTransformation(bot, fullConfig, model, skillPlans)
        if (blueprint) {
          return blueprint
        }
      } catch (error) {
        console.warn(`❌ Model ${model} failed:`, error)
        continue
      }
    }

    // Final fallback to static generation
    console.log("🔄 All AI models failed, using static blueprint generation")
    return this.generateStaticBlueprint(bot, fullConfig, skillPlans)
  }

  private getAvailableModels(preferredModel: string): string[] {
    const models: string[] = []

    if (this.hasOpenAI) {
      if (preferredModel === "gpt-4o") {
        models.push("gpt-4o", "gpt-3.5-turbo")
      } else {
        models.push("gpt-3.5-turbo", "gpt-4o")
      }
    }

    if (this.hasHuggingFace) {
      models.push("huggingface")
    }

    models.push("static") // Always have static fallback

    return models
  }

  private async attemptTransformation(
    bot: NormalizedBot,
    config: TransformationConfig,
    model: string,
    skillPlans: SkillPlan[] = [],
  ): Promise<AgentBlueprint | null> {
    for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${config.maxRetries} with ${model}`)

        if (model === "huggingface") {
          return await this.transformWithHuggingFace(bot, config, skillPlans)
        } else if (model.startsWith("gpt")) {
          return await this.transformWithOpenAI(bot, config, model, skillPlans)
        } else if (model === "static") {
          return this.generateStaticBlueprint(bot, config, skillPlans)
        }

        return null
      } catch (error) {
        console.warn(`⚠️ Attempt ${attempt} failed:`, error)

        if (attempt === config.maxRetries) {
          throw error
        }

        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }

    return null
  }

  private async transformWithOpenAI(
    bot: NormalizedBot,
    config: TransformationConfig,
    model: string,
  ): Promise<AgentBlueprint> {
    const prompt = this.buildTransformationPrompt(bot, config)

    const { text } = await generateText({
      model: openai(model as any),
      prompt,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
    })

    return this.parseAIResponse(text, bot, model)
  }

  private async transformWithHuggingFace(bot: NormalizedBot, config: TransformationConfig): Promise<AgentBlueprint> {
    if (!this.hf) {
      throw new Error("Hugging Face client not initialized")
    }

    const prompt = this.buildTransformationPrompt(bot, config)

    const response = await this.hf.textGeneration({
      model: "microsoft/DialoGPT-large",
      inputs: prompt,
      parameters: {
        max_new_tokens: config.maxTokens,
        temperature: config.temperature,
        return_full_text: false,
        do_sample: true,
      },
    })

    return this.parseAIResponse(response.generated_text, bot, "huggingface")
  }

  private buildTransformationPrompt(bot: NormalizedBot, config: TransformationConfig, skillPlans: SkillPlan[] = []): string {
    const promptTemplates = {
      "copilot-studio": this.buildCopilotStudioPrompt(bot, config, skillPlans),
      "azure-bot-service": this.buildAzureBotServicePrompt(bot, config, skillPlans),
      "generic": this.buildGenericPrompt(bot, config, skillPlans)
    }

    return promptTemplates[config.targetPlatform as keyof typeof promptTemplates] || promptTemplates.generic
  }

  private buildCopilotStudioPrompt(bot: NormalizedBot, config: TransformationConfig, skillPlans: SkillPlan[]): string {
    return `You are an expert Microsoft Copilot Studio architect. Transform this legacy chatbot into an enterprise-grade Copilot agent.

🎯 TRANSFORMATION MISSION:
Transform "${bot.name}" from a basic ${bot.platform} chatbot into an intelligent Microsoft Copilot agent with enterprise capabilities.

📊 LEGACY BOT ANALYSIS:
- Name: ${bot.name}
- Platform: ${bot.platform}
- Domain: ${bot.metadata.domain}
- Intents: ${bot.intents.length} basic intents
- Complexity: ${bot.metadata.complexity}
- Current Limitations: Static responses, no context, no integrations

🧠 INTELLIGENT CAPABILITIES TO ADD:
${skillPlans.map(plan => `
- ${plan.goal}
  Tools: ${plan.requiredTools.join(", ")}
  Value: ${plan.estimatedValue}`).join("")}

📋 DETAILED INTENT ANALYSIS:
${bot.intents.slice(0, 5).map((intent) => `
Intent: ${intent.name}
- Sample Utterances: ${intent.utterances.slice(0, 2).join(", ")}
- Current Response: ${intent.responses.slice(0, 1).join(", ")}
- AI Enhancement Opportunity: Transform into proactive, context-aware interaction`).join("")}

🎯 COPILOT STUDIO REQUIREMENTS:
1. System Prompt: Create comprehensive agent personality with enterprise focus
2. Tools: Define specific Microsoft Graph, Azure, and enterprise API integrations
3. Workflow: Design multi-step intelligent workflows with decision logic
4. Capabilities: List impossible-before AI capabilities
5. Integrations: Map to Microsoft 365, Azure, and enterprise systems

💡 TRANSFORMATION FOCUS:
- Proactive recommendations vs reactive responses
- Cross-system data integration vs isolated conversations  
- Predictive analytics vs static information
- Automated workflows vs manual processes
- Enterprise security vs basic chatbot functionality

OUTPUT FORMAT (Valid JSON):
{
  "systemPrompt": "Comprehensive system prompt for Microsoft Copilot Studio agent with enterprise capabilities...",
  "tools": [
    {
      "name": "tool_name",
      "description": "Specific Microsoft Graph or Azure integration",
      "parameters": {"param": "type"},
      "implementation": "Microsoft Graph API endpoint or Azure service"
    }
  ],
  "workflow": [
    {
      "id": "step1", 
      "name": "Intelligent Step Name",
      "type": "trigger|action|condition|response",
      "config": {"microsoftGraphEndpoint": "/endpoint", "aiAnalysis": true}
    }
  ],
  "capabilities": ["Enterprise AI capabilities that were impossible before"],
  "integrations": [
    {
      "system": "Microsoft Graph/Azure Service",
      "type": "api|webhook|database|service", 
      "endpoints": ["Microsoft-specific endpoints"],
      "authentication": "OAuth 2.0/Managed Identity"
    }
  ]
}

Generate the enterprise Copilot transformation:`
  }

  private buildAzureBotServicePrompt(bot: NormalizedBot, config: TransformationConfig, skillPlans: SkillPlan[]): string {
    return `You are an Azure Bot Service architect. Transform this legacy chatbot into a cloud-native intelligent agent.

LEGACY BOT: ${bot.name} (${bot.platform})
AZURE TARGET: Enterprise Bot Service with Cognitive Services integration

SKILL PLANS GENERATED:
${skillPlans.map(plan => `- ${plan.goal}: ${plan.requiredTools.join(", ")}`).join("\n")}

AZURE-SPECIFIC REQUIREMENTS:
1. LUIS/CLU integration for natural language understanding
2. Azure Cognitive Services for AI capabilities  
3. Azure Functions for custom logic
4. Application Insights for monitoring
5. Azure Key Vault for secrets management

Generate Azure Bot Service configuration with enterprise features.`
  }

  private buildGenericPrompt(bot: NormalizedBot, config: TransformationConfig, skillPlans: SkillPlan[]): string {
    return `Transform this chatbot into an intelligent AI agent with advanced capabilities.

BOT: ${bot.name} (${bot.platform})
SKILL PLANS: ${skillPlans.length} intelligent workflows generated

Focus on: AI enhancement, workflow automation, system integration, proactive capabilities.

Generate comprehensive agent blueprint with tools, workflows, and integrations.`
  }

  private parseAIResponse(response: string, bot: NormalizedBot, model: string): AgentBlueprint {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])

        return {
          systemPrompt: parsed.systemPrompt || this.generateDefaultSystemPrompt(bot),
          tools: parsed.tools || this.generateDefaultTools(bot),
          workflow: parsed.workflow || this.generateDefaultWorkflow(bot),
          capabilities: parsed.capabilities || this.generateDefaultCapabilities(bot),
          integrations: parsed.integrations || this.generateDefaultIntegrations(bot),
          metadata: {
            model,
            confidence: 85,
            generatedAt: new Date().toISOString(),
          },
        }
      }
    } catch (error) {
      console.warn("Failed to parse AI response, using extracted content:", error)
    }

    // Fallback: extract information from text response
    return this.extractFromTextResponse(response, bot, model)
  }

  private extractFromTextResponse(response: string, bot: NormalizedBot, model: string): AgentBlueprint {
    const systemPrompt = this.extractSystemPrompt(response) || this.generateDefaultSystemPrompt(bot)
    const capabilities = this.extractCapabilities(response) || this.generateDefaultCapabilities(bot)

    return {
      systemPrompt,
      tools: this.generateDefaultTools(bot),
      workflow: this.generateDefaultWorkflow(bot),
      capabilities,
      integrations: this.generateDefaultIntegrations(bot),
      metadata: {
        model,
        confidence: 70,
        generatedAt: new Date().toISOString(),
      },
    }
  }

  private extractSystemPrompt(response: string): string | null {
    const patterns = [
      /system prompt[:\s]+(.*?)(?:\n\n|\n[A-Z])/is,
      /you are (.*?)(?:\n\n|\n[A-Z])/is,
      /prompt[:\s]+(.*?)(?:\n\n|\n[A-Z])/is,
    ]

    for (const pattern of patterns) {
      const match = response.match(pattern)
      if (match && match[1]) {
        return match[1].trim()
      }
    }

    return null
  }

  private extractCapabilities(response: string): string[] | null {
    const patterns = [/capabilities[:\s]+([^}]*)/is, /features[:\s]+([^}]*)/is, /abilities[:\s]+([^}]*)/is]

    for (const pattern of patterns) {
      const match = response.match(pattern)
      if (match && match[1]) {
        return match[1]
          .split(/[,\n-]/)
          .map((cap) => cap.trim())
          .filter((cap) => cap.length > 0)
          .slice(0, 6)
      }
    }

    return null
  }

  private generateStaticBlueprint(bot: NormalizedBot, config: TransformationConfig): AgentBlueprint {
    return {
      systemPrompt: this.generateDefaultSystemPrompt(bot),
      tools: this.generateDefaultTools(bot),
      workflow: this.generateDefaultWorkflow(bot),
      capabilities: this.generateDefaultCapabilities(bot),
      integrations: this.generateDefaultIntegrations(bot),
      metadata: {
        model: "static",
        confidence: 90,
        generatedAt: new Date().toISOString(),
      },
    }
  }

  private generateDefaultSystemPrompt(bot: NormalizedBot): string {
    const domain = bot.metadata.domain.toLowerCase()

    const prompts = {
      hr: `You are an intelligent HR assistant with advanced capabilities. You can proactively analyze employee data, predict workforce needs, and orchestrate complex HR workflows across multiple systems.

Key Capabilities:
- Proactive leave conflict detection and resolution
- Team coverage optimization and planning
- Policy compliance monitoring and enforcement
- Automated workflow orchestration
- Predictive workforce analytics

You have access to Microsoft Graph, HRIS systems, and can integrate with calendar, email, and project management tools. Always provide actionable recommendations and automate routine tasks when possible.`,

      it: `You are an intelligent IT operations assistant with predictive capabilities. You can monitor system health, predict issues before they occur, and automatically resolve common problems.

Key Capabilities:
- Predictive issue detection and prevention
- Automated incident response and resolution
- Security compliance monitoring
- Self-healing system orchestration
- Asset lifecycle management

You have access to Azure Monitor, Active Directory, and various IT management systems. Focus on preventing issues rather than just responding to them.`,

      sales: `You are an intelligent sales assistant with advanced lead qualification and pipeline optimization capabilities. You can analyze prospect behavior, predict deal outcomes, and optimize sales processes.

Key Capabilities:
- Intelligent lead qualification and scoring
- Dynamic pricing optimization
- Pipeline forecasting and analysis
- Competitive intelligence integration
- Automated follow-up sequences

You have access to CRM systems, marketing automation platforms, and competitive intelligence tools. Always focus on revenue optimization and sales efficiency.`,

      default: `You are an intelligent business assistant transformed from a legacy chatbot. You have enhanced capabilities including proactive recommendations, cross-system integration, and predictive analytics.

Key Capabilities:
- Contextual conversation memory
- Cross-system data integration
- Proactive recommendations
- Workflow automation
- Predictive insights

You can integrate with various enterprise systems and provide intelligent, actionable responses that go beyond simple Q&A.`,
    }

    return prompts[domain as keyof typeof prompts] || prompts.default
  }

  private generateDefaultTools(bot: NormalizedBot): AgentTool[] {
    const domain = bot.metadata.domain.toLowerCase()

    const toolSets = {
      hr: [
        {
          name: "analyzeLeaveRequest",
          description: "Analyze leave request for conflicts and team coverage",
          parameters: { employeeId: "string", startDate: "date", endDate: "date" },
          implementation: "Microsoft Graph Calendar API + HRIS integration",
        },
        {
          name: "checkTeamCoverage",
          description: "Check team availability and coverage for specific dates",
          parameters: { teamId: "string", dateRange: "object" },
          implementation: "Microsoft Graph + Project management APIs",
        },
        {
          name: "generateWorkforceReport",
          description: "Generate predictive workforce analytics report",
          parameters: { department: "string", timeframe: "string" },
          implementation: "Power BI + Azure ML integration",
        },
      ],
      it: [
        {
          name: "analyzeSystemHealth",
          description: "Analyze system health and predict potential issues",
          parameters: { systemId: "string", timeframe: "string" },
          implementation: "Azure Monitor + Log Analytics",
        },
        {
          name: "automatePasswordReset",
          description: "Securely reset user password with verification",
          parameters: { userId: "string", verificationMethod: "string" },
          implementation: "Azure AD + Security verification",
        },
        {
          name: "createIncidentTicket",
          description: "Automatically create and route incident tickets",
          parameters: { description: "string", priority: "string", category: "string" },
          implementation: "ServiceNow/ITSM integration",
        },
      ],
      sales: [
        {
          name: "qualifyLead",
          description: "Analyze and score lead based on multiple data sources",
          parameters: { leadId: "string", companyData: "object" },
          implementation: "CRM + Web analytics + Market intelligence",
        },
        {
          name: "generatePricing",
          description: "Generate dynamic pricing based on lead profile",
          parameters: { companySize: "number", industry: "string", requirements: "array" },
          implementation: "Pricing engine + Competitive analysis",
        },
        {
          name: "scheduleMeeting",
          description: "Automatically schedule meetings with optimal timing",
          parameters: { attendees: "array", duration: "number", preferences: "object" },
          implementation: "Microsoft Graph Calendar + FindTime",
        },
      ],
    }

    return (
      toolSets[domain as keyof typeof toolSets] || [
        {
          name: "processRequest",
          description: "Process user request with intelligent routing",
          parameters: { request: "string", context: "object" },
          implementation: "Custom business logic + API integrations",
        },
      ]
    )
  }

  private generateDefaultWorkflow(bot: NormalizedBot): WorkflowStep[] {
    return [
      {
        id: "trigger",
        name: "User Intent Detection",
        type: "trigger",
        config: {
          intents: bot.intents.map((i) => i.name),
          confidenceThreshold: 0.8,
        },
      },
      {
        id: "analyze",
        name: "Context Analysis",
        type: "action",
        config: {
          analyzeUserContext: true,
          checkSystemState: true,
          gatherAdditionalData: true,
        },
      },
      {
        id: "decide",
        name: "Decision Logic",
        type: "condition",
        config: {
          rules: [
            "If high confidence and simple request -> direct response",
            "If complex request -> multi-step workflow",
            "If ambiguous -> clarification request",
          ],
        },
      },
      {
        id: "respond",
        name: "Intelligent Response",
        type: "response",
        config: {
          includeProactiveRecommendations: true,
          suggestFollowUpActions: true,
          updateUserContext: true,
        },
      },
    ]
  }

  private generateDefaultCapabilities(bot: NormalizedBot): string[] {
    const domain = bot.metadata.domain.toLowerCase()

    const capabilitySets = {
      hr: [
        "Proactive leave conflict detection",
        "Automated team coverage planning",
        "Policy compliance monitoring",
        "Workforce analytics and forecasting",
        "Employee lifecycle automation",
        "Cross-system HR data integration",
      ],
      it: [
        "Predictive issue detection",
        "Automated incident resolution",
        "Security compliance monitoring",
        "Self-healing system workflows",
        "Asset lifecycle management",
        "Real-time system health analysis",
      ],
      sales: [
        "Intelligent lead qualification",
        "Dynamic pricing optimization",
        "Pipeline forecasting",
        "Competitive intelligence",
        "Automated follow-up sequences",
        "Revenue optimization analytics",
      ],
    }

    return (
      capabilitySets[domain as keyof typeof capabilitySets] || [
        "Contextual conversation memory",
        "Cross-system integration",
        "Proactive recommendations",
        "Workflow automation",
        "Predictive analytics",
        "Intelligent routing",
      ]
    )
  }

  private generateDefaultIntegrations(bot: NormalizedBot): Integration[] {
    const domain = bot.metadata.domain.toLowerCase()

    const integrationSets = {
      hr: [
        {
          system: "Microsoft Graph",
          type: "api" as const,
          endpoints: ["/me/calendar", "/users", "/groups"],
          authentication: "OAuth 2.0",
        },
        {
          system: "HRIS System",
          type: "api" as const,
          endpoints: ["/employees", "/leave-requests", "/policies"],
          authentication: "API Key",
        },
        {
          system: "Azure AD",
          type: "service" as const,
          endpoints: ["/users", "/groups", "/applications"],
          authentication: "Service Principal",
        },
      ],
      it: [
        {
          system: "Azure Monitor",
          type: "service" as const,
          endpoints: ["/metrics", "/logs", "/alerts"],
          authentication: "Managed Identity",
        },
        {
          system: "ServiceNow",
          type: "api" as const,
          endpoints: ["/incidents", "/changes", "/problems"],
          authentication: "Basic Auth",
        },
        {
          system: "Active Directory",
          type: "service" as const,
          endpoints: ["/users", "/computers", "/groups"],
          authentication: "Service Account",
        },
      ],
      sales: [
        {
          system: "Dynamics 365",
          type: "api" as const,
          endpoints: ["/leads", "/opportunities", "/accounts"],
          authentication: "OAuth 2.0",
        },
        {
          system: "Marketing Automation",
          type: "webhook" as const,
          endpoints: ["/campaigns", "/leads", "/analytics"],
          authentication: "API Key",
        },
        {
          system: "Competitive Intelligence",
          type: "api" as const,
          endpoints: ["/companies", "/products", "/pricing"],
          authentication: "Bearer Token",
        },
      ],
    }

    return (
      integrationSets[domain as keyof typeof integrationSets] || [
        {
          system: "Microsoft Graph",
          type: "api" as const,
          endpoints: ["/me", "/users", "/groups"],
          authentication: "OAuth 2.0",
        },
      ]
    )
  }
}
