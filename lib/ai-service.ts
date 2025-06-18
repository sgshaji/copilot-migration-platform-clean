// Using only Hugging Face - completely FREE
import { HfInference } from '@huggingface/inference'

export interface BotAnalysis {
  name: string
  platform: string
  intents: string[]
  entities: string[]
  responses: string[]
  conversationLogs?: any[]
}

export interface DeltaScenario {
  name: string
  description: string
  currentLimitation: string
  copilotCapability: string
  businessValue: string
  roi: string
  feasibility: "High" | "Medium" | "Low"
  implementationSteps: string[]
  technicalRequirements: string[]
}

export interface MigrationAnalysis {
  originalBot: {
    name: string
    platform: string
    intentCount: number
    qualityScore: number
    limitations: string[]
  }
  transformedAgent: {
    name: string
    platform: string
    skillCount: number
    qualityScore: number
    newCapabilities: string[]
  }
  deltaScenarios: DeltaScenario[]
  businessImpact: {
    timeSavings: string
    efficiencyGain: string
    annualROI: string
    paybackPeriod: string
  }
  recommendations: string[]
  isAiGenerated: boolean // Track if this was AI-generated or fallback
}

export class AIService {
  private static instance: AIService
  private hasApiKey: boolean

  constructor() {
    // Check if we have an API key available
    this.hasApiKey = !!(
      process.env.OPENAI_API_KEY ||
      process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
      (typeof window !== "undefined" && (window as any).OPENAI_API_KEY)
    )
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  async analyzeBotForMigration(botAnalysis: BotAnalysis): Promise<MigrationAnalysis> {
    // Always use intelligent fallback for demo purposes
    console.log("🤖 AI Service: Using intelligent demo analysis (no API key required)")
    return this.getIntelligentFallbackAnalysis(botAnalysis)
  }

  async generateDeltaScenarios(botAnalysis: BotAnalysis): Promise<DeltaScenario[]> {
    // Always use intelligent fallback for demo purposes
    console.log("🤖 AI Service: Generating intelligent demo delta scenarios")
    return this.getIntelligentDeltaScenarios(botAnalysis)
  }

  async generateBusinessImpactAnalysis(botAnalysis: BotAnalysis, deltaScenarios: DeltaScenario[]): Promise<any> {
    // Always use intelligent fallback for demo purposes
    console.log("🤖 AI Service: Generating intelligent demo business impact")
    return this.getIntelligentBusinessImpact(botAnalysis)
  }

  private async tryAIGeneration(botAnalysis: BotAnalysis): Promise<MigrationAnalysis | null> {
    if (!this.hasApiKey) {
      return null
    }

    try {
      const prompt = this.buildAnalysisPrompt(botAnalysis)

      // Use Hugging Face instead of OpenAI (completely free)
      const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)
      const result = await hf.textGeneration({
        model: 'microsoft/DialoGPT-large',
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          return_full_text: false,
        }
      })

      const text = result.generated_text

      return this.parseAnalysisResponse(text, botAnalysis)
    } catch (error) {
      console.warn("AI generation failed, using fallback:", error)
      return null
    }
  }

  private buildAnalysisPrompt(botAnalysis: BotAnalysis): string {
    return `
You are an expert Microsoft Copilot migration consultant analyzing a legacy chatbot for transformation.

LEGACY BOT ANALYSIS:
- Name: ${botAnalysis.name}
- Platform: ${botAnalysis.platform}
- Intents: ${botAnalysis.intents.join(", ")}
- Entities: ${botAnalysis.entities.join(", ")}
- Sample Responses: ${botAnalysis.responses.slice(0, 3).join(" | ")}

TASK: Analyze this bot's transformation potential to Microsoft Copilot Studio.

Provide analysis in this EXACT JSON format:
{
  "qualityScore": <number 1-10>,
  "limitations": [<array of current bot limitations>],
  "newCapabilities": [<array of new Copilot capabilities>],
  "recommendations": [<array of specific recommendations>]
}

Focus on:
1. Current static limitations vs dynamic Copilot capabilities
2. Integration opportunities with M365 ecosystem
3. Proactive vs reactive behavior transformation
4. Cross-system orchestration possibilities
5. Contextual intelligence improvements

Be specific and enterprise-focused. Highlight impossible-before scenarios.
`
  }

  private parseAnalysisResponse(response: string, botAnalysis: BotAnalysis): MigrationAnalysis {
    try {
      const parsed = JSON.parse(response)

      return {
        originalBot: {
          name: botAnalysis.name,
          platform: botAnalysis.platform,
          intentCount: botAnalysis.intents.length,
          qualityScore: parsed.qualityScore || 6.8,
          limitations: parsed.limitations || [
            "Static responses only",
            "No context awareness",
            "Limited system integration",
            "Reactive, not proactive",
          ],
        },
        transformedAgent: {
          name: `${botAnalysis.name} - Copilot Agent`,
          platform: "Microsoft Copilot Studio",
          skillCount: botAnalysis.intents.length + 3,
          qualityScore: Math.min(parsed.qualityScore + 2.5, 10),
          newCapabilities: parsed.newCapabilities || [
            "Proactive recommendations",
            "Cross-system orchestration",
            "Contextual memory",
            "Predictive analytics",
          ],
        },
        deltaScenarios: [], // Will be populated separately
        businessImpact: {
          timeSavings: "45 minutes per interaction",
          efficiencyGain: "73% improvement",
          annualROI: "$156,000 for 100 employees",
          paybackPeriod: "3.2 months",
        },
        recommendations: parsed.recommendations || [
          "Implement proactive notification system",
          "Integrate with M365 Graph API",
          "Add contextual memory capabilities",
          "Enable cross-system workflow orchestration",
        ],
        isAiGenerated: true,
      }
    } catch (error) {
      return this.getIntelligentFallbackAnalysis(botAnalysis)
    }
  }

  private getIntelligentFallbackAnalysis(botAnalysis: BotAnalysis): MigrationAnalysis {
    const domain = this.inferDomain(botAnalysis)
    const complexityScore = this.calculateComplexity(botAnalysis)

    return {
      originalBot: {
        name: botAnalysis.name,
        platform: botAnalysis.platform,
        intentCount: botAnalysis.intents.length,
        qualityScore: Math.max(4.5, Math.min(8.5, 5 + botAnalysis.intents.length * 0.3)),
        limitations: this.getDomainSpecificLimitations(domain),
      },
      transformedAgent: {
        name: `${botAnalysis.name} - Copilot Agent`,
        platform: "Microsoft Copilot Studio",
        skillCount: botAnalysis.intents.length + Math.floor(botAnalysis.intents.length * 0.6),
        qualityScore: Math.min(9.5, 7.5 + complexityScore * 0.5),
        newCapabilities: this.getDomainSpecificCapabilities(domain),
      },
      deltaScenarios: this.getIntelligentDeltaScenarios(botAnalysis),
      businessImpact: this.getIntelligentBusinessImpact(botAnalysis),
      recommendations: this.getDomainSpecificRecommendations(domain),
      isAiGenerated: false, // This is intelligent fallback
    }
  }

  private inferDomain(botAnalysis: BotAnalysis): string {
    const name = botAnalysis.name.toLowerCase()
    const intents = botAnalysis.intents.join(" ").toLowerCase()

    if (
      name.includes("hr") ||
      intents.includes("leave") ||
      intents.includes("vacation") ||
      intents.includes("employee")
    ) {
      return "HR"
    } else if (
      name.includes("it") ||
      intents.includes("password") ||
      intents.includes("technical") ||
      intents.includes("support")
    ) {
      return "IT"
    } else if (
      name.includes("sales") ||
      intents.includes("pricing") ||
      intents.includes("demo") ||
      intents.includes("lead")
    ) {
      return "Sales"
    } else if (name.includes("customer") || intents.includes("order") || intents.includes("billing")) {
      return "Customer Support"
    }
    return "General Business"
  }

  private calculateComplexity(botAnalysis: BotAnalysis): number {
    let score = 0
    score += Math.min(botAnalysis.intents.length * 0.1, 1) // Intent complexity
    score += Math.min(botAnalysis.entities.length * 0.15, 1) // Entity complexity
    score += botAnalysis.responses.length > 10 ? 0.5 : 0.2 // Response variety
    return Math.min(score, 2)
  }

  private getDomainSpecificLimitations(domain: string): string[] {
    const baseLimitations = [
      "Static, pre-programmed responses only",
      "No context awareness between conversations",
      "Cannot access real-time enterprise data",
      "Reactive approach - waits for user input",
    ]

    const domainLimitations = {
      HR: [
        ...baseLimitations,
        "Cannot analyze team calendars or workload",
        "No integration with HRIS or payroll systems",
        "Unable to provide proactive policy recommendations",
      ],
      IT: [
        ...baseLimitations,
        "Cannot perform automated diagnostics",
        "No integration with monitoring systems",
        "Unable to predict or prevent issues",
      ],
      Sales: [
        ...baseLimitations,
        "Cannot access CRM or lead scoring data",
        "No competitive intelligence integration",
        "Unable to provide dynamic pricing recommendations",
      ],
    }

    return domainLimitations[domain as keyof typeof domainLimitations] || baseLimitations
  }

  private getDomainSpecificCapabilities(domain: string): string[] {
    const baseCapabilities = [
      "Dynamic, contextually-aware responses",
      "Cross-system data integration and orchestration",
      "Proactive recommendations and insights",
      "Continuous learning and adaptation",
    ]

    const domainCapabilities = {
      HR: [
        ...baseCapabilities,
        "Proactive leave conflict detection and resolution",
        "Automated workforce planning and optimization",
        "Real-time policy compliance monitoring",
        "Intelligent employee lifecycle management",
      ],
      IT: [
        ...baseCapabilities,
        "Predictive issue detection and prevention",
        "Automated incident response and resolution",
        "Real-time security threat analysis",
        "Self-healing system orchestration",
      ],
      Sales: [
        ...baseCapabilities,
        "Intelligent lead qualification and scoring",
        "Dynamic competitive positioning",
        "Automated pipeline forecasting",
        "Real-time market intelligence integration",
      ],
    }

    return domainCapabilities[domain as keyof typeof domainCapabilities] || baseCapabilities
  }

  private getIntelligentDeltaScenarios(botAnalysis: BotAnalysis): DeltaScenario[] {
    const domain = this.inferDomain(botAnalysis)

    const scenarioTemplates = {
      HR: [
        {
          name: "Proactive Leave Conflict Prevention",
          description:
            "Analyze team calendars, project deadlines, and workload patterns to suggest optimal leave timing and prevent conflicts before they occur",
          currentLimitation:
            "Static response about available leave balance with no context or intelligent recommendations",
          copilotCapability:
            "Real-time analysis of calendar data, project timelines, team coverage, and workload distribution with proactive conflict prevention",
          businessValue: "Prevents project delays, ensures adequate team coverage, and optimizes resource allocation",
          roi: "$2,400/employee/year",
          feasibility: "High",
          implementationSteps: [
            "Integrate with Microsoft Graph Calendar API",
            "Connect to project management systems (Azure DevOps, Project)",
            "Implement team coverage analysis algorithms",
            "Create proactive notification and approval workflows",
            "Deploy predictive analytics for workload forecasting",
          ],
          technicalRequirements: [
            "Microsoft Graph API access",
            "Azure Logic Apps for workflow automation",
            "Power BI for analytics and reporting",
            "SharePoint integration for policy management",
          ],
        },
        {
          name: "Intelligent Workforce Planning",
          description:
            "Predict staffing needs, identify skill gaps, and recommend hiring or training based on business growth patterns and seasonal trends",
          currentLimitation: "Manual, spreadsheet-based workforce planning with quarterly reviews and reactive hiring",
          copilotCapability:
            "AI-powered workforce analytics with predictive modeling, skill gap analysis, and automated recommendations",
          businessValue: "Reduces hiring costs, improves retention, and ensures optimal staffing levels",
          roi: "$15,000/month in hiring efficiency",
          feasibility: "Medium",
          implementationSteps: [
            "Implement workforce analytics platform",
            "Connect to HRIS and performance management systems",
            "Deploy predictive modeling for demand forecasting",
            "Create automated reporting and recommendation engine",
          ],
          technicalRequirements: [
            "Azure Machine Learning for predictive analytics",
            "Power Platform for workflow automation",
            "Integration with existing HRIS systems",
          ],
        },
      ],
      IT: [
        {
          name: "Predictive Issue Prevention",
          description:
            "Monitor system health patterns, user behavior, and infrastructure metrics to predict and prevent IT issues before they impact users",
          currentLimitation:
            "Reactive ticket-based support that only responds after issues occur and users report problems",
          copilotCapability:
            "Proactive monitoring with AI-powered anomaly detection, predictive failure analysis, and automated prevention workflows",
          businessValue:
            "Reduces system downtime, prevents user productivity loss, and minimizes support ticket volume",
          roi: "$8,000/incident prevented",
          feasibility: "High",
          implementationSteps: [
            "Deploy Azure Monitor and Application Insights",
            "Implement machine learning models for anomaly detection",
            "Create automated response and remediation workflows",
            "Integrate with existing ITSM tools",
          ],
          technicalRequirements: [
            "Azure Monitor and Log Analytics",
            "Azure Machine Learning for predictive models",
            "Power Automate for response workflows",
            "Integration with ServiceNow or similar ITSM",
          ],
        },
        {
          name: "Self-Healing Infrastructure",
          description:
            "Automatically detect, diagnose, and resolve common infrastructure issues without human intervention",
          currentLimitation: "Manual intervention required for routine maintenance, updates, and issue resolution",
          copilotCapability:
            "Automated issue detection, root cause analysis, and self-healing workflows with intelligent escalation",
          businessValue: "Reduces MTTR, improves system reliability, and frees IT staff for strategic initiatives",
          roi: "$3,200/month in operational savings",
          feasibility: "Medium",
          implementationSteps: [
            "Implement infrastructure as code practices",
            "Deploy automated monitoring and alerting",
            "Create self-healing scripts and workflows",
            "Establish intelligent escalation procedures",
          ],
          technicalRequirements: [
            "Azure Automation and PowerShell DSC",
            "Azure Logic Apps for orchestration",
            "Integration with existing monitoring tools",
          ],
        },
      ],
      Sales: [
        {
          name: "Intelligent Lead Qualification",
          description:
            "Analyze prospect behavior, company data, market signals, and interaction patterns to provide dynamic lead scoring and qualification",
          currentLimitation:
            "Basic form submission with manual qualification and static scoring based on limited demographic data",
          copilotCapability:
            "AI-powered lead scoring with behavioral analysis, intent detection, and real-time qualification updates",
          businessValue: "Improves conversion rates, reduces sales cycle length, and optimizes sales team focus",
          roi: "$187,500 average qualified deal size",
          feasibility: "High",
          implementationSteps: [
            "Implement behavioral tracking and analytics",
            "Connect to CRM and marketing automation platforms",
            "Deploy machine learning models for lead scoring",
            "Create automated qualification workflows",
          ],
          technicalRequirements: [
            "Dynamics 365 or Salesforce integration",
            "Azure Cognitive Services for intent analysis",
            "Power Platform for workflow automation",
            "Web analytics and tracking implementation",
          ],
        },
        {
          name: "Dynamic Competitive Intelligence",
          description:
            "Provide real-time competitive analysis, positioning recommendations, and win/loss insights based on market intelligence",
          currentLimitation:
            "Static competitive battlecards updated quarterly with limited market intelligence and positioning guidance",
          copilotCapability:
            "Real-time competitive intelligence with dynamic positioning strategies and automated market analysis",
          businessValue: "Increases win rates against competition and improves deal positioning",
          roi: "$23,000/won competitive deal",
          feasibility: "Medium",
          implementationSteps: [
            "Implement competitive intelligence platform",
            "Connect to market research and news sources",
            "Deploy sentiment analysis and trend detection",
            "Create automated competitive alerts and briefings",
          ],
          technicalRequirements: [
            "Azure Cognitive Services for text analytics",
            "Power BI for competitive dashboards",
            "Integration with market intelligence platforms",
            "Automated content aggregation and analysis",
          ],
        },
      ],
    }

    return scenarioTemplates[domain as keyof typeof scenarioTemplates] || scenarioTemplates.HR
  }

  private getIntelligentBusinessImpact(botAnalysis: BotAnalysis): any {
    const domain = this.inferDomain(botAnalysis)
    const complexity = this.calculateComplexity(botAnalysis)

    const baseROI = {
      HR: { base: 2400, multiplier: 1.2 },
      IT: { base: 3200, multiplier: 1.5 },
      Sales: { base: 8400, multiplier: 2.0 },
    }

    const domainROI = baseROI[domain as keyof typeof baseROI] || baseROI.HR
    const calculatedROI = Math.floor(domainROI.base * (1 + complexity) * domainROI.multiplier)

    return {
      timeSavings:
        domain === "Sales" ? "1.2 hours/interaction" : domain === "IT" ? "32 minutes/ticket" : "45 minutes/request",
      efficiencyGain: `${Math.floor(65 + complexity * 15)}% improvement`,
      annualROI: `$${calculatedROI.toLocaleString()}/year`,
      paybackPeriod: `${Math.max(2.1, 4.5 - complexity).toFixed(1)} months`,
      additionalMetrics: {
        errorReduction: `${Math.floor(60 + complexity * 10)}%`,
        userSatisfaction: `${Math.floor(85 + complexity * 5)}% increase`,
        processAutomation: `${Math.floor(8 + botAnalysis.intents.length * 0.5)} workflows automated`,
      },
    }
  }

  private getDomainSpecificRecommendations(domain: string): string[] {
    const recommendations = {
      HR: [
        "Implement proactive leave management with calendar integration",
        "Deploy workforce analytics for predictive planning",
        "Integrate with Microsoft Graph API for employee data",
        "Create automated policy compliance workflows",
        "Enable cross-system employee lifecycle management",
      ],
      IT: [
        "Deploy predictive monitoring and alerting systems",
        "Implement self-healing infrastructure workflows",
        "Integrate with Azure Monitor and Security Center",
        "Create automated incident response procedures",
        "Enable proactive security threat detection",
      ],
      Sales: [
        "Implement intelligent lead scoring and qualification",
        "Deploy competitive intelligence automation",
        "Integrate with CRM and marketing automation platforms",
        "Create dynamic pricing and proposal generation",
        "Enable predictive pipeline forecasting",
      ],
    }

    return recommendations[domain as keyof typeof recommendations] || recommendations.HR
  }
}
