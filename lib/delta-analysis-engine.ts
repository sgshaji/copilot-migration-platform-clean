import { HfInference } from "@huggingface/inference"

export interface BotPattern {
  type: "static_response" | "reactive_intent" | "limited_entity" | "manual_workflow" | "no_integration"
  pattern: string
  examples: string[]
  frequency: number
  impact: "low" | "medium" | "high"
}

export interface DeltaOpportunity {
  id: string
  name: string
  type: "proactive" | "integration" | "automation" | "intelligence" | "orchestration"
  currentLimitation: {
    description: string
    examples: string[]
    userFriction: string
    businessCost: string
  }
  aiTransformation: {
    description: string
    capabilities: string[]
    implementation: string[]
    technicalRequirements: string[]
  }
  detectedFrom: {
    intents: string[]
    entities: string[]
    responses: string[]
    patterns: BotPattern[]
  }
  businessImpact: {
    timeSavingsPerInteraction: number // minutes
    interactionsPerMonth: number
    annualROI: number
    efficiencyGain: number // percentage
    riskReduction: string
  }
  implementationComplexity: "low" | "medium" | "high"
  confidence: number // 0-100
}

export interface DeltaAnalysisResult {
  botSummary: {
    name: string
    platform: string
    domain: string
    complexity: "low" | "medium" | "high"
    qualityScore: number
  }
  detectedPatterns: BotPattern[]
  deltaOpportunities: DeltaOpportunity[]
  prioritizedRecommendations: {
    quickWins: DeltaOpportunity[]
    highImpact: DeltaOpportunity[]
    strategicInitiatives: DeltaOpportunity[]
  }
  totalPotentialROI: number
  implementationRoadmap: {
    phase1: DeltaOpportunity[]
    phase2: DeltaOpportunity[]
    phase3: DeltaOpportunity[]
  }
}

export class DeltaAnalysisEngine {
  private static instance: DeltaAnalysisEngine
  private hf: HfInference | null = null
  private hasApiKey = false

  constructor() {
    const apiKey = process.env.HUGGINGFACE_API_KEY || process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY
    if (apiKey) {
      this.hf = new HfInference(apiKey)
      this.hasApiKey = true
      console.log("🔍 Delta Analysis Engine: Connected with Hugging Face API")
    }
  }

  public static getInstance(): DeltaAnalysisEngine {
    if (!DeltaAnalysisEngine.instance) {
      DeltaAnalysisEngine.instance = new DeltaAnalysisEngine()
    }
    return DeltaAnalysisEngine.instance
  }

  async analyzeBotForDeltas(botData: {
    name: string
    platform: string
    intents: Array<{ name: string; utterances: string[]; responses: string[] }>
    entities: Array<{ name: string; values: string[] }>
    conversationLogs?: Array<{ user: string; bot: string; timestamp: string }>
  }): Promise<DeltaAnalysisResult> {
    console.log("🔍 Starting real delta analysis for:", botData.name)

    // Step 1: Detect patterns in the bot
    const detectedPatterns = await this.detectBotPatterns(botData)

    // Step 2: Identify delta opportunities
    const deltaOpportunities = await this.identifyDeltaOpportunities(botData, detectedPatterns)

    // Step 3: Calculate business impact
    const enrichedOpportunities = await this.calculateBusinessImpact(deltaOpportunities, botData)

    // Step 4: Prioritize and create roadmap
    const prioritized = this.prioritizeOpportunities(enrichedOpportunities)
    const roadmap = this.createImplementationRoadmap(enrichedOpportunities)

    return {
      botSummary: {
        name: botData.name,
        platform: botData.platform,
        domain: this.inferDomain(botData),
        complexity: this.calculateComplexity(botData),
        qualityScore: this.calculateQualityScore(botData),
      },
      detectedPatterns,
      deltaOpportunities: enrichedOpportunities,
      prioritizedRecommendations: prioritized,
      totalPotentialROI: enrichedOpportunities.reduce((sum, opp) => sum + opp.businessImpact.annualROI, 0),
      implementationRoadmap: roadmap,
    }
  }

  private async detectBotPatterns(botData: any): Promise<BotPattern[]> {
    const patterns: BotPattern[] = []

    // Pattern 1: Static Response Detection
    const staticResponses = this.detectStaticResponses(botData.intents)
    if (staticResponses.length > 0) {
      patterns.push({
        type: "static_response",
        pattern: "Hardcoded responses without dynamic data",
        examples: staticResponses,
        frequency: staticResponses.length,
        impact: staticResponses.length > 5 ? "high" : "medium",
      })
    }

    // Pattern 2: Reactive Intent Detection
    const reactiveIntents = this.detectReactiveIntents(botData.intents)
    if (reactiveIntents.length > 0) {
      patterns.push({
        type: "reactive_intent",
        pattern: "Waits for user input, no proactive capabilities",
        examples: reactiveIntents,
        frequency: reactiveIntents.length,
        impact: "high",
      })
    }

    // Pattern 3: Limited Entity Usage
    const limitedEntities = this.detectLimitedEntityUsage(botData.entities, botData.intents)
    if (limitedEntities.length > 0) {
      patterns.push({
        type: "limited_entity",
        pattern: "Entities not used for system integration",
        examples: limitedEntities,
        frequency: limitedEntities.length,
        impact: "medium",
      })
    }

    // Pattern 4: Manual Workflow Detection
    const manualWorkflows = this.detectManualWorkflows(botData.intents)
    if (manualWorkflows.length > 0) {
      patterns.push({
        type: "manual_workflow",
        pattern: "Requires manual follow-up actions",
        examples: manualWorkflows,
        frequency: manualWorkflows.length,
        impact: "high",
      })
    }

    // Pattern 5: No Integration Capabilities
    const noIntegration = this.detectNoIntegration(botData.intents)
    if (noIntegration) {
      patterns.push({
        type: "no_integration",
        pattern: "Cannot access external systems or data",
        examples: ["All responses are self-contained", "No API calls or data fetching"],
        frequency: 1,
        impact: "high",
      })
    }

    return patterns
  }

  private detectStaticResponses(intents: any[]): string[] {
    const staticResponses: string[] = []

    intents.forEach((intent) => {
      intent.responses.forEach((response: string) => {
        // Check if response contains no variables or dynamic content
        if (!response.includes("{") && !response.includes("$") && !response.includes("{{")) {
          // Check if it's a simple, static statement
          if (response.length > 10 && !response.includes("please") && !response.includes("contact")) {
            staticResponses.push(`${intent.name}: "${response}"`)
          }
        }
      })
    })

    return staticResponses.slice(0, 5) // Return top 5 examples
  }

  private detectReactiveIntents(intents: any[]): string[] {
    const reactiveKeywords = ["check", "get", "show", "tell", "what", "how", "when", "where"]
    const reactiveIntents: string[] = []

    intents.forEach((intent) => {
      const intentName = intent.name.toLowerCase()
      const hasReactiveKeyword = reactiveKeywords.some((keyword) => intentName.includes(keyword))

      if (hasReactiveKeyword) {
        reactiveIntents.push(intent.name)
      }
    })

    return reactiveIntents
  }

  private detectLimitedEntityUsage(entities: any[], intents: any[]): string[] {
    const limitedEntities: string[] = []

    entities.forEach((entity) => {
      // Check if entity is used in a meaningful way
      const usageCount = intents.reduce((count, intent) => {
        const usedInResponses = intent.responses.some(
          (response: string) => response.includes(`{${entity.name}}`) || response.includes(`$${entity.name}`),
        )
        return usedInResponses ? count + 1 : count
      }, 0)

      if (usageCount === 0) {
        limitedEntities.push(entity.name)
      }
    })

    return limitedEntities
  }

  private detectManualWorkflows(intents: any[]): string[] {
    const manualIndicators = ["contact", "visit", "call", "email", "submit", "fill out", "go to"]
    const manualWorkflows: string[] = []

    intents.forEach((intent) => {
      intent.responses.forEach((response: string) => {
        const hasManualIndicator = manualIndicators.some((indicator) => response.toLowerCase().includes(indicator))

        if (hasManualIndicator) {
          manualWorkflows.push(`${intent.name}: Manual action required`)
        }
      })
    })

    return [...new Set(manualWorkflows)]
  }

  private detectNoIntegration(intents: any[]): boolean {
    // Check if any responses suggest external system access
    const integrationIndicators = ["api", "database", "system", "real-time", "current", "latest"]

    const hasIntegration = intents.some((intent) =>
      intent.responses.some((response: string) =>
        integrationIndicators.some((indicator) => response.toLowerCase().includes(indicator)),
      ),
    )

    return !hasIntegration
  }

  private async identifyDeltaOpportunities(botData: any, patterns: BotPattern[]): Promise<DeltaOpportunity[]> {
    const opportunities: DeltaOpportunity[] = []
    const domain = this.inferDomain(botData)

    // Opportunity 1: Static to Dynamic Transformation
    const staticPattern = patterns.find((p) => p.type === "static_response")
    if (staticPattern) {
      opportunities.push(await this.createStaticToDynamicOpportunity(botData, staticPattern, domain))
    }

    // Opportunity 2: Reactive to Proactive Transformation
    const reactivePattern = patterns.find((p) => p.type === "reactive_intent")
    if (reactivePattern) {
      opportunities.push(await this.createReactiveToProactiveOpportunity(botData, reactivePattern, domain))
    }

    // Opportunity 3: Manual to Automated Workflow
    const manualPattern = patterns.find((p) => p.type === "manual_workflow")
    if (manualPattern) {
      opportunities.push(await this.createManualToAutomatedOpportunity(botData, manualPattern, domain))
    }

    // Opportunity 4: Add System Integration
    const noIntegrationPattern = patterns.find((p) => p.type === "no_integration")
    if (noIntegrationPattern) {
      opportunities.push(await this.createSystemIntegrationOpportunity(botData, noIntegrationPattern, domain))
    }

    // Opportunity 5: Entity-Based Intelligence
    const entityPattern = patterns.find((p) => p.type === "limited_entity")
    if (entityPattern) {
      opportunities.push(await this.createEntityIntelligenceOpportunity(botData, entityPattern, domain))
    }

    return opportunities
  }

  private async createStaticToDynamicOpportunity(
    botData: any,
    pattern: BotPattern,
    domain: string,
  ): Promise<DeltaOpportunity> {
    return {
      id: "static-to-dynamic",
      name: "Transform Static Responses to Dynamic Intelligence",
      type: "intelligence",
      currentLimitation: {
        description: "Bot provides hardcoded responses without real-time data or context",
        examples: pattern.examples,
        userFriction: "Users receive outdated or generic information",
        businessCost: "Manual data updates and user dissatisfaction",
      },
      aiTransformation: {
        description: "Replace static responses with real-time data integration and contextual intelligence",
        capabilities: [
          "Real-time data fetching from enterprise systems",
          "Contextual response generation based on user profile",
          "Dynamic content personalization",
          "Automated data synchronization",
        ],
        implementation: [
          "Integrate with enterprise APIs (Graph, HRIS, CRM)",
          "Implement dynamic response templates",
          "Add user context tracking",
          "Create real-time data pipelines",
        ],
        technicalRequirements: [
          "Microsoft Graph API access",
          "Enterprise system APIs",
          "Azure Logic Apps for data flow",
          "Caching layer for performance",
        ],
      },
      detectedFrom: {
        intents: botData.intents.map((i: any) => i.name),
        entities: [],
        responses: pattern.examples,
        patterns: [pattern],
      },
      businessImpact: {
        timeSavingsPerInteraction: 5,
        interactionsPerMonth: this.estimateMonthlyInteractions(botData, domain),
        annualROI: 0, // Will be calculated
        efficiencyGain: 40,
        riskReduction: "Eliminates outdated information risks",
      },
      implementationComplexity: "medium",
      confidence: 85,
    }
  }

  private async createReactiveToProactiveOpportunity(
    botData: any,
    pattern: BotPattern,
    domain: string,
  ): Promise<DeltaOpportunity> {
    const domainSpecificProactive = {
      hr: {
        name: "Proactive Workforce Intelligence",
        capabilities: [
          "Predictive leave conflict detection",
          "Proactive policy compliance alerts",
          "Automated workforce planning recommendations",
          "Preventive employee lifecycle management",
        ],
        implementation: [
          "Implement calendar analysis algorithms",
          "Create predictive ML models for conflicts",
          "Set up proactive notification workflows",
          "Integrate with project management systems",
        ],
      },
      it: {
        name: "Predictive IT Operations",
        capabilities: [
          "Proactive system health monitoring",
          "Predictive failure detection",
          "Automated preventive maintenance",
          "Security threat prediction and prevention",
        ],
        implementation: [
          "Deploy Azure Monitor integration",
          "Implement anomaly detection algorithms",
          "Create automated remediation workflows",
          "Set up predictive alerting systems",
        ],
      },
      sales: {
        name: "Intelligent Revenue Optimization",
        capabilities: [
          "Proactive lead scoring and qualification",
          "Predictive pipeline management",
          "Automated competitive intelligence",
          "Revenue opportunity identification",
        ],
        implementation: [
          "Implement behavioral tracking and analysis",
          "Create predictive lead scoring models",
          "Set up automated competitive monitoring",
          "Deploy revenue forecasting algorithms",
        ],
      },
    }

    const config = domainSpecificProactive[domain as keyof typeof domainSpecificProactive] || domainSpecificProactive.hr

    return {
      id: "reactive-to-proactive",
      name: config.name,
      type: "proactive",
      currentLimitation: {
        description: "Bot only responds to user requests, missing opportunities for proactive assistance",
        examples: pattern.examples,
        userFriction: "Users must remember to ask for help and may miss important information",
        businessCost: "Reactive problem-solving instead of prevention",
      },
      aiTransformation: {
        description: "Transform reactive responses into proactive intelligence and recommendations",
        capabilities: config.capabilities,
        implementation: config.implementation,
        technicalRequirements: [
          "Machine learning models for prediction",
          "Real-time data streaming",
          "Automated workflow orchestration",
          "Intelligent notification systems",
        ],
      },
      detectedFrom: {
        intents: pattern.examples,
        entities: [],
        responses: [],
        patterns: [pattern],
      },
      businessImpact: {
        timeSavingsPerInteraction: 15,
        interactionsPerMonth: this.estimateMonthlyInteractions(botData, domain),
        annualROI: 0,
        efficiencyGain: 60,
        riskReduction: "Prevents issues before they escalate",
      },
      implementationComplexity: "high",
      confidence: 90,
    }
  }

  private async createManualToAutomatedOpportunity(
    botData: any,
    pattern: BotPattern,
    domain: string,
  ): Promise<DeltaOpportunity> {
    return {
      id: "manual-to-automated",
      name: "Automate Manual Workflows",
      type: "automation",
      currentLimitation: {
        description: "Bot requires users to perform manual actions outside the conversation",
        examples: pattern.examples,
        userFriction: "Context switching and manual task completion",
        businessCost: "Increased handling time and potential for errors",
      },
      aiTransformation: {
        description: "Automate manual workflows through intelligent orchestration",
        capabilities: [
          "Automated form submission and processing",
          "Intelligent workflow routing",
          "Cross-system task orchestration",
          "Automated approval workflows",
        ],
        implementation: [
          "Implement Power Automate workflows",
          "Create API integrations for task automation",
          "Set up intelligent routing logic",
          "Deploy automated approval systems",
        ],
        technicalRequirements: [
          "Power Platform licenses",
          "API access to target systems",
          "Workflow orchestration tools",
          "Authentication and authorization setup",
        ],
      },
      detectedFrom: {
        intents: [],
        entities: [],
        responses: pattern.examples,
        patterns: [pattern],
      },
      businessImpact: {
        timeSavingsPerInteraction: 20,
        interactionsPerMonth: this.estimateMonthlyInteractions(botData, domain) * 0.6, // 60% of interactions involve manual work
        annualROI: 0,
        efficiencyGain: 75,
        riskReduction: "Eliminates manual errors and delays",
      },
      implementationComplexity: "medium",
      confidence: 80,
    }
  }

  private async createSystemIntegrationOpportunity(
    botData: any,
    pattern: BotPattern,
    domain: string,
  ): Promise<DeltaOpportunity> {
    const domainIntegrations = {
      hr: ["Microsoft Graph", "HRIS Systems", "Payroll Systems", "Learning Management"],
      it: ["Azure Monitor", "ServiceNow", "Active Directory", "Security Systems"],
      sales: ["CRM Systems", "Marketing Automation", "Web Analytics", "Competitive Intelligence"],
    }

    return {
      id: "system-integration",
      name: "Enterprise System Integration",
      type: "integration",
      currentLimitation: {
        description: "Bot operates in isolation without access to enterprise systems and data",
        examples: ["Cannot access real-time data", "No system integration capabilities"],
        userFriction: "Users must manually gather information from multiple systems",
        businessCost: "Data silos and inefficient information access",
      },
      aiTransformation: {
        description: "Connect bot to enterprise systems for real-time data access and orchestration",
        capabilities: [
          "Real-time enterprise data access",
          "Cross-system workflow orchestration",
          "Unified data presentation",
          "Automated system synchronization",
        ],
        implementation: [
          "Implement Microsoft Graph API integration",
          "Set up enterprise system connectors",
          "Create unified data access layer",
          "Deploy real-time synchronization",
        ],
        technicalRequirements: domainIntegrations[domain as keyof typeof domainIntegrations] || domainIntegrations.hr,
      },
      detectedFrom: {
        intents: botData.intents.map((i: any) => i.name),
        entities: [],
        responses: [],
        patterns: [pattern],
      },
      businessImpact: {
        timeSavingsPerInteraction: 10,
        interactionsPerMonth: this.estimateMonthlyInteractions(botData, domain),
        annualROI: 0,
        efficiencyGain: 50,
        riskReduction: "Eliminates data inconsistency and manual lookups",
      },
      implementationComplexity: "high",
      confidence: 95,
    }
  }

  private async createEntityIntelligenceOpportunity(
    botData: any,
    pattern: BotPattern,
    domain: string,
  ): Promise<DeltaOpportunity> {
    return {
      id: "entity-intelligence",
      name: "Entity-Based Intelligence Enhancement",
      type: "intelligence",
      currentLimitation: {
        description: "Bot entities are underutilized for intelligent analysis and recommendations",
        examples: pattern.examples,
        userFriction: "Limited personalization and context awareness",
        businessCost: "Missed opportunities for intelligent assistance",
      },
      aiTransformation: {
        description: "Leverage entities for intelligent analysis, personalization, and recommendations",
        capabilities: [
          "Entity-based personalization",
          "Intelligent context analysis",
          "Predictive recommendations",
          "Cross-entity relationship analysis",
        ],
        implementation: [
          "Implement entity relationship mapping",
          "Create intelligent analysis algorithms",
          "Set up personalization engines",
          "Deploy recommendation systems",
        ],
        technicalRequirements: [
          "Machine learning models",
          "Entity relationship databases",
          "Personalization engines",
          "Analytics and reporting tools",
        ],
      },
      detectedFrom: {
        intents: [],
        entities: pattern.examples,
        responses: [],
        patterns: [pattern],
      },
      businessImpact: {
        timeSavingsPerInteraction: 8,
        interactionsPerMonth: this.estimateMonthlyInteractions(botData, domain),
        annualROI: 0,
        efficiencyGain: 35,
        riskReduction: "Improves user satisfaction and engagement",
      },
      implementationComplexity: "medium",
      confidence: 75,
    }
  }

  private async calculateBusinessImpact(opportunities: DeltaOpportunity[], botData: any): Promise<DeltaOpportunity[]> {
    const domain = this.inferDomain(botData)
    const avgHourlyRate = this.getAverageHourlyRate(domain)

    return opportunities.map((opp) => {
      const monthlyTimeSavings =
        (opp.businessImpact.timeSavingsPerInteraction / 60) * opp.businessImpact.interactionsPerMonth
      const annualTimeSavings = monthlyTimeSavings * 12
      const annualROI = Math.round(annualTimeSavings * avgHourlyRate)

      return {
        ...opp,
        businessImpact: {
          ...opp.businessImpact,
          annualROI,
        },
      }
    })
  }

  private prioritizeOpportunities(opportunities: DeltaOpportunity[]) {
    const quickWins = opportunities
      .filter((opp) => opp.implementationComplexity === "low" || opp.implementationComplexity === "medium")
      .sort((a, b) => b.businessImpact.annualROI - a.businessImpact.annualROI)
      .slice(0, 3)

    const highImpact = opportunities
      .filter((opp) => opp.businessImpact.annualROI > 50000)
      .sort((a, b) => b.businessImpact.annualROI - a.businessImpact.annualROI)

    const strategicInitiatives = opportunities
      .filter((opp) => opp.implementationComplexity === "high")
      .sort((a, b) => b.confidence - a.confidence)

    return { quickWins, highImpact, strategicInitiatives }
  }

  private createImplementationRoadmap(opportunities: DeltaOpportunity[]) {
    const sorted = [...opportunities].sort((a, b) => {
      // Sort by complexity (low first) then by ROI (high first)
      const complexityOrder = { low: 1, medium: 2, high: 3 }
      if (complexityOrder[a.implementationComplexity] !== complexityOrder[b.implementationComplexity]) {
        return complexityOrder[a.implementationComplexity] - complexityOrder[b.implementationComplexity]
      }
      return b.businessImpact.annualROI - a.businessImpact.annualROI
    })

    const phase1 = sorted.filter((opp) => opp.implementationComplexity === "low")
    const phase2 = sorted.filter((opp) => opp.implementationComplexity === "medium")
    const phase3 = sorted.filter((opp) => opp.implementationComplexity === "high")

    return { phase1, phase2, phase3 }
  }

  // Helper methods
  private inferDomain(botData: any): string {
    const allText = [
      botData.name,
      ...botData.intents.map((i: any) => i.name),
      ...botData.intents.flatMap((i: any) => i.responses),
    ]
      .join(" ")
      .toLowerCase()

    if (allText.includes("hr") || allText.includes("leave") || allText.includes("employee")) return "hr"
    if (allText.includes("it") || allText.includes("password") || allText.includes("technical")) return "it"
    if (allText.includes("sales") || allText.includes("lead") || allText.includes("pricing")) return "sales"
    return "general"
  }

  private calculateComplexity(botData: any): "low" | "medium" | "high" {
    const intentCount = botData.intents.length
    const entityCount = botData.entities.length
    const totalResponses = botData.intents.reduce((sum: number, intent: any) => sum + intent.responses.length, 0)

    const complexityScore = intentCount * 0.3 + entityCount * 0.2 + totalResponses * 0.1

    if (complexityScore < 10) return "low"
    if (complexityScore < 25) return "medium"
    return "high"
  }

  private calculateQualityScore(botData: any): number {
    let score = 50 // Base score

    // Intent quality
    const avgUtterancesPerIntent =
      botData.intents.reduce((sum: number, intent: any) => sum + intent.utterances.length, 0) / botData.intents.length
    score += Math.min(avgUtterancesPerIntent * 5, 20)

    // Response variety
    const avgResponsesPerIntent =
      botData.intents.reduce((sum: number, intent: any) => sum + intent.responses.length, 0) / botData.intents.length
    score += Math.min(avgResponsesPerIntent * 3, 15)

    // Entity usage
    score += Math.min(botData.entities.length * 2, 15)

    return Math.min(Math.round(score), 100) / 10 // Convert to 0-10 scale
  }

  private estimateMonthlyInteractions(botData: any, domain: string): number {
    const baseInteractions = {
      hr: 200,
      it: 300,
      sales: 150,
      general: 100,
    }

    const base = baseInteractions[domain as keyof typeof baseInteractions] || 100
    const complexityMultiplier = botData.intents.length > 10 ? 1.5 : 1
    return Math.round(base * complexityMultiplier)
  }

  private getAverageHourlyRate(domain: string): number {
    const rates = {
      hr: 45, // HR specialist hourly rate
      it: 65, // IT support hourly rate
      sales: 55, // Sales rep hourly rate
      general: 50,
    }

    return rates[domain as keyof typeof rates] || 50
  }
}
