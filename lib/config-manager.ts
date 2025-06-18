export interface SkillTemplate {
  name: string
  domain: string
  description: string
  triggers: string[]
  actions: SkillAction[]
  requiredIntegrations: string[]
  complexity: "low" | "medium" | "high"
}

export interface SkillAction {
  name: string
  type: "api_call" | "workflow" | "response" | "integration"
  config: Record<string, any>
}

export interface DeltaScenarioTemplate {
  name: string
  domain: string
  description: string
  currentLimitation: string
  copilotCapability: string
  businessValue: string
  roi: string
  feasibility: "High" | "Medium" | "Low"
  implementationSteps: string[]
  technicalRequirements: string[]
  keywords: string[]
}

export class ConfigManager {
  private static instance: ConfigManager
  private skillTemplates: SkillTemplate[] = []
  private deltaScenarios: DeltaScenarioTemplate[] = []

  constructor() {
    this.initializeSkillTemplates()
    this.initializeDeltaScenarios()
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  getSkillTemplates(domain?: string): SkillTemplate[] {
    if (domain) {
      return this.skillTemplates.filter((template) => template.domain.toLowerCase() === domain.toLowerCase())
    }
    return this.skillTemplates
  }

  getDeltaScenarios(domain?: string, keywords?: string[]): DeltaScenarioTemplate[] {
    let scenarios = this.deltaScenarios

    if (domain) {
      scenarios = scenarios.filter((scenario) => scenario.domain.toLowerCase() === domain.toLowerCase())
    }

    if (keywords && keywords.length > 0) {
      scenarios = scenarios.filter((scenario) =>
        keywords.some((keyword) =>
          scenario.keywords.some((scenarioKeyword) => scenarioKeyword.toLowerCase().includes(keyword.toLowerCase())),
        ),
      )
    }

    return scenarios
  }

  private initializeSkillTemplates(): void {
    this.skillTemplates = [
      // HR Skills
      {
        name: "Leave Management",
        domain: "HR",
        description: "Intelligent leave request processing with conflict detection",
        triggers: ["leave", "vacation", "time off", "pto"],
        actions: [
          {
            name: "checkLeaveBalance",
            type: "api_call",
            config: { endpoint: "/hr/leave-balance", method: "GET" },
          },
          {
            name: "analyzeTeamCoverage",
            type: "workflow",
            config: { workflow: "team-coverage-analysis" },
          },
          {
            name: "submitLeaveRequest",
            type: "integration",
            config: { system: "HRIS", action: "create-leave-request" },
          },
        ],
        requiredIntegrations: ["Microsoft Graph", "HRIS", "Calendar"],
        complexity: "medium",
      },
      {
        name: "Employee Onboarding",
        domain: "HR",
        description: "Automated employee onboarding workflow",
        triggers: ["onboarding", "new employee", "welcome"],
        actions: [
          {
            name: "createUserAccount",
            type: "integration",
            config: { system: "Azure AD", action: "create-user" },
          },
          {
            name: "assignEquipment",
            type: "workflow",
            config: { workflow: "equipment-assignment" },
          },
          {
            name: "scheduleOrientation",
            type: "api_call",
            config: { endpoint: "/calendar/schedule", method: "POST" },
          },
        ],
        requiredIntegrations: ["Azure AD", "Asset Management", "Calendar"],
        complexity: "high",
      },

      // IT Skills
      {
        name: "Password Management",
        domain: "IT",
        description: "Secure password reset with multi-factor verification",
        triggers: ["password", "reset", "login", "access"],
        actions: [
          {
            name: "verifyIdentity",
            type: "integration",
            config: { system: "Azure AD", action: "verify-user" },
          },
          {
            name: "resetPassword",
            type: "api_call",
            config: { endpoint: "/identity/reset-password", method: "POST" },
          },
          {
            name: "notifyUser",
            type: "workflow",
            config: { workflow: "password-reset-notification" },
          },
        ],
        requiredIntegrations: ["Azure AD", "Email Service", "SMS Service"],
        complexity: "medium",
      },
      {
        name: "System Monitoring",
        domain: "IT",
        description: "Proactive system health monitoring and alerting",
        triggers: ["system", "monitor", "health", "performance"],
        actions: [
          {
            name: "checkSystemHealth",
            type: "integration",
            config: { system: "Azure Monitor", action: "get-metrics" },
          },
          {
            name: "analyzePerformance",
            type: "workflow",
            config: { workflow: "performance-analysis" },
          },
          {
            name: "createAlert",
            type: "api_call",
            config: { endpoint: "/monitoring/alerts", method: "POST" },
          },
        ],
        requiredIntegrations: ["Azure Monitor", "Log Analytics", "Alert Manager"],
        complexity: "high",
      },

      // Sales Skills
      {
        name: "Lead Qualification",
        domain: "Sales",
        description: "Intelligent lead scoring and qualification",
        triggers: ["lead", "prospect", "qualify", "score"],
        actions: [
          {
            name: "analyzeLeadData",
            type: "integration",
            config: { system: "CRM", action: "get-lead-data" },
          },
          {
            name: "scoreLeadQuality",
            type: "workflow",
            config: { workflow: "lead-scoring-algorithm" },
          },
          {
            name: "updateCRM",
            type: "api_call",
            config: { endpoint: "/crm/leads", method: "PUT" },
          },
        ],
        requiredIntegrations: ["CRM", "Marketing Automation", "Web Analytics"],
        complexity: "medium",
      },
      {
        name: "Opportunity Management",
        domain: "Sales",
        description: "Pipeline management and forecasting",
        triggers: ["opportunity", "deal", "pipeline", "forecast"],
        actions: [
          {
            name: "analyzePipeline",
            type: "integration",
            config: { system: "CRM", action: "get-pipeline-data" },
          },
          {
            name: "generateForecast",
            type: "workflow",
            config: { workflow: "sales-forecasting" },
          },
          {
            name: "updateOpportunity",
            type: "api_call",
            config: { endpoint: "/crm/opportunities", method: "PUT" },
          },
        ],
        requiredIntegrations: ["CRM", "Analytics Platform", "Reporting Tools"],
        complexity: "high",
      },
    ]
  }

  private initializeDeltaScenarios(): void {
    this.deltaScenarios = [
      // HR Delta Scenarios
      {
        name: "Proactive Leave Conflict Prevention",
        domain: "HR",
        description: "AI analyzes team calendars, project deadlines, and workload to suggest optimal leave timing",
        currentLimitation:
          "Static response about available leave balance with no context or intelligent recommendations",
        copilotCapability:
          "Real-time analysis of calendar data, project timelines, and team coverage with proactive conflict prevention",
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
        keywords: ["leave", "vacation", "time off", "calendar", "team", "coverage"],
      },
      {
        name: "Intelligent Workforce Planning",
        domain: "HR",
        description:
          "Predict staffing needs, identify skill gaps, and recommend hiring based on business growth patterns",
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
          "Integrate with job posting and recruitment platforms",
        ],
        technicalRequirements: [
          "Azure Machine Learning for predictive analytics",
          "Power Platform for workflow automation",
          "Integration with existing HRIS systems",
          "Business intelligence and reporting tools",
        ],
        keywords: ["workforce", "hiring", "staffing", "planning", "analytics", "forecasting"],
      },

      // IT Delta Scenarios
      {
        name: "Predictive Issue Prevention",
        domain: "IT",
        description: "Monitor system health patterns and predict failures before they impact users",
        currentLimitation:
          "Reactive ticket-based support that only responds after issues occur and users report problems",
        copilotCapability:
          "Proactive monitoring with AI-powered anomaly detection, predictive failure analysis, and automated prevention workflows",
        businessValue: "Reduces system downtime, prevents user productivity loss, and minimizes support ticket volume",
        roi: "$8,000/incident prevented",
        feasibility: "High",
        implementationSteps: [
          "Deploy Azure Monitor and Application Insights",
          "Implement machine learning models for anomaly detection",
          "Create automated response and remediation workflows",
          "Integrate with existing ITSM tools (ServiceNow, etc.)",
          "Set up intelligent alerting and escalation procedures",
        ],
        technicalRequirements: [
          "Azure Monitor and Log Analytics",
          "Azure Machine Learning for predictive models",
          "Power Automate for response workflows",
          "Integration with ServiceNow or similar ITSM",
          "Custom dashboards and reporting tools",
        ],
        keywords: ["system", "monitoring", "predictive", "issues", "prevention", "health"],
      },
      {
        name: "Self-Healing Infrastructure",
        domain: "IT",
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
          "Integrate with configuration management tools",
        ],
        technicalRequirements: [
          "Azure Automation and PowerShell DSC",
          "Azure Logic Apps for orchestration",
          "Integration with existing monitoring tools",
          "Configuration management systems",
          "Automated testing and validation frameworks",
        ],
        keywords: ["infrastructure", "automation", "self-healing", "maintenance", "reliability"],
      },

      // Sales Delta Scenarios
      {
        name: "Intelligent Lead Qualification",
        domain: "Sales",
        description: "Analyze prospect behavior, company data, and market signals to provide dynamic lead scoring",
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
          "Integrate with web analytics and intent data providers",
        ],
        technicalRequirements: [
          "Dynamics 365 or Salesforce integration",
          "Azure Cognitive Services for intent analysis",
          "Power Platform for workflow automation",
          "Web analytics and tracking implementation",
          "Third-party intent data and enrichment services",
        ],
        keywords: ["lead", "qualification", "scoring", "prospect", "conversion", "sales"],
      },
      {
        name: "Dynamic Competitive Intelligence",
        domain: "Sales",
        description: "Provide real-time competitive analysis, positioning recommendations, and win/loss insights",
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
          "Integrate with sales enablement tools",
        ],
        technicalRequirements: [
          "Azure Cognitive Services for text analytics",
          "Power BI for competitive dashboards",
          "Integration with market intelligence platforms",
          "Automated content aggregation and analysis",
          "Sales enablement and content management systems",
        ],
        keywords: ["competitive", "intelligence", "positioning", "market", "analysis", "battlecards"],
      },
    ]
  }
}
