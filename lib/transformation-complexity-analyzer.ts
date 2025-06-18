
export interface TransformationComplexity {
  simplicityLevel: "Simple" | "Moderate" | "Complex" | "Enterprise"
  challengeAreas: string[]
  requiredChanges: string[]
  estimatedEffort: string
  businessValue: string
}

export class TransformationComplexityAnalyzer {
  static analyzeComplexity(botConfig: any): TransformationComplexity {
    const intentCount = botConfig.intents?.length || 0
    const entityCount = botConfig.entities?.length || 0
    const platform = botConfig.platform?.toLowerCase() || ""

    // Determine complexity based on bot characteristics
    let complexity: TransformationComplexity["simplicityLevel"] = "Simple"
    let challengeAreas: string[] = []
    let requiredChanges: string[] = []

    if (intentCount > 20 || entityCount > 15) {
      complexity = "Complex"
      challengeAreas.push("Large intent/entity mapping required")
    }

    if (platform.includes("dialogflow") || platform.includes("bot framework")) {
      challengeAreas.push("Platform-specific flow conversion")
      requiredChanges.push("Convert Dialogflow intents to Copilot topics")
    }

    if (platform.includes("power virtual agents")) {
      complexity = "Moderate"
      requiredChanges.push("Migrate Power Virtual Agents topics to Copilot Studio")
    }

    // Always complex transformations
    challengeAreas.push(
      "Static responses → Dynamic AI conversations",
      "Rule-based logic → Contextual understanding",
      "Single-purpose → Multi-domain intelligence",
      "Reactive → Proactive assistance"
    )

    requiredChanges.push(
      "Redesign conversation flows for AI-driven interactions",
      "Implement context awareness and memory",
      "Add Microsoft Graph API integrations",
      "Configure enterprise authentication (Azure AD)",
      "Set up Power Platform connectors",
      "Create proactive notification workflows",
      "Implement cross-system orchestration",
      "Add predictive analytics capabilities"
    )

    const effortMap = {
      Simple: "2-4 weeks",
      Moderate: "1-3 months", 
      Complex: "3-6 months",
      Enterprise: "6-12 months"
    }

    return {
      simplicityLevel: complexity,
      challengeAreas,
      requiredChanges,
      estimatedEffort: effortMap[complexity],
      businessValue: "10x improvement in user experience, 60% reduction in support tickets, proactive issue resolution"
    }
  }

  static getTransformationRoadmap(complexity: TransformationComplexity) {
    return {
      phase1: {
        title: "Foundation & Migration",
        duration: "2-4 weeks",
        activities: [
          "Export existing bot configuration",
          "Set up Microsoft Copilot Studio environment", 
          "Configure basic authentication and permissions",
          "Migrate core intents and entities",
          "Basic conversation flow setup"
        ]
      },
      phase2: {
        title: "AI Enhancement",
        duration: "4-8 weeks",
        activities: [
          "Implement natural language understanding",
          "Add context awareness and conversation memory",
          "Configure AI-powered response generation",
          "Set up proactive notifications",
          "Integrate with Microsoft Graph API"
        ]
      },
      phase3: {
        title: "Enterprise Integration",
        duration: "4-12 weeks",
        activities: [
          "Connect to enterprise systems (ERP, CRM, ITSM)",
          "Set up Power Platform connectors",
          "Implement cross-system orchestration",
          "Add predictive analytics and insights",
          "Configure governance and compliance policies"
        ]
      },
      phase4: {
        title: "Optimization & Scale",
        duration: "2-4 weeks",
        activities: [
          "Performance optimization and monitoring",
          "User experience refinement",
          "Advanced analytics and reporting",
          "Change management and user training",
          "Go-live and support transition"
        ]
      }
    }
  }
}
