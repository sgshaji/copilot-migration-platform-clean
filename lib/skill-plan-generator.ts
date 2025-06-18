
export interface SkillPlan {
  goal: string
  requiredTools: string[]
  expectedSystem: string
  actions: SkillAction[]
  integrations: string[]
  complexity: "low" | "medium" | "high"
  estimatedValue: string
}

export interface SkillAction {
  name: string
  type: "api_call" | "workflow" | "integration" | "ai_analysis"
  description: string
  config: Record<string, any>
}

export interface SkillTemplate {
  name: string
  domain: string
  description: string
  triggers: string[]
  actions: SkillAction[]
  requiredIntegrations: string[]
  complexity: "low" | "medium" | "high"
}

export class SkillPlanGenerator {
  private static instance: SkillPlanGenerator
  private skillTemplates: Map<string, SkillTemplate[]> = new Map()

  public static getInstance(): SkillPlanGenerator {
    if (!SkillPlanGenerator.instance) {
      SkillPlanGenerator.instance = new SkillPlanGenerator()
    }
    return SkillPlanGenerator.instance
  }

  constructor() {
    this.initializeSkillTemplates()
  }

  generateSkillPlan(intent: string, domain: string): SkillPlan {
    console.log(`🎯 Generating skill plan for intent: ${intent} in domain: ${domain}`)
    
    const templates = this.skillTemplates.get(domain.toLowerCase()) || []
    const matchedTemplate = this.findBestMatch(intent, templates)
    
    if (matchedTemplate) {
      return this.buildSkillPlan(intent, matchedTemplate)
    }
    
    // Fallback to generic skill plan
    return this.buildGenericSkillPlan(intent, domain)
  }

  generateSkillPlansForBot(intents: string[], domain: string): SkillPlan[] {
    return intents.map(intent => this.generateSkillPlan(intent, domain))
  }

  private findBestMatch(intent: string, templates: SkillTemplate[]): SkillTemplate | null {
    const intentLower = intent.toLowerCase()
    
    // Find exact trigger match
    for (const template of templates) {
      if (template.triggers.some(trigger => intentLower.includes(trigger))) {
        return template
      }
    }
    
    // Find partial keyword match
    for (const template of templates) {
      const keywords = template.name.toLowerCase().split(' ')
      if (keywords.some(keyword => intentLower.includes(keyword))) {
        return template
      }
    }
    
    return null
  }

  private buildSkillPlan(intent: string, template: SkillTemplate): SkillPlan {
    return {
      goal: `Transform "${intent}" into intelligent Copilot capability: ${template.description}`,
      requiredTools: this.extractRequiredTools(template),
      expectedSystem: this.determineExpectedSystem(template),
      actions: template.actions,
      integrations: template.requiredIntegrations,
      complexity: template.complexity,
      estimatedValue: this.calculateEstimatedValue(template)
    }
  }

  private buildGenericSkillPlan(intent: string, domain: string): SkillPlan {
    return {
      goal: `Transform "${intent}" into intelligent ${domain} automation`,
      requiredTools: ["AI Analysis", "Workflow Engine", "Data Integration"],
      expectedSystem: `${domain} Management System with AI capabilities`,
      actions: [
        {
          name: "analyzeUserRequest",
          type: "ai_analysis",
          description: "Use AI to understand user intent and context",
          config: { model: "gpt-4", intent: intent }
        },
        {
          name: "executeWorkflow",
          type: "workflow",
          description: "Execute automated workflow based on analysis",
          config: { workflow: `${intent.toLowerCase()}_automation` }
        }
      ],
      integrations: ["Microsoft Graph", "Enterprise APIs"],
      complexity: "medium",
      estimatedValue: "$5,000-15,000 annual efficiency gains"
    }
  }

  private extractRequiredTools(template: SkillTemplate): string[] {
    const tools = new Set<string>()
    
    template.actions.forEach(action => {
      switch (action.type) {
        case "ai_analysis":
          tools.add("AI Analysis Engine")
          break
        case "api_call":
          tools.add("API Integration")
          break
        case "workflow":
          tools.add("Workflow Orchestrator")
          break
        case "integration":
          tools.add("System Integration")
          break
      }
    })
    
    return Array.from(tools)
  }

  private determineExpectedSystem(template: SkillTemplate): string {
    const systemMap = {
      hr: "Microsoft 365 + HRIS with AI-powered workflow automation",
      it: "Azure Monitor + ServiceNow with predictive analytics",
      sales: "Dynamics 365 + Marketing Automation with revenue intelligence",
      default: "Enterprise systems with intelligent automation"
    }
    
    return systemMap[template.domain.toLowerCase() as keyof typeof systemMap] || systemMap.default
  }

  private calculateEstimatedValue(template: SkillTemplate): string {
    const valueMap = {
      low: "$2,000-8,000 annual savings",
      medium: "$10,000-25,000 annual efficiency gains", 
      high: "$30,000-100,000 annual value creation"
    }
    
    return valueMap[template.complexity]
  }

  private initializeSkillTemplates(): void {
    // HR Skills
    this.skillTemplates.set("hr", [
      {
        name: "Leave Management",
        domain: "HR",
        description: "Intelligent leave request processing with conflict detection",
        triggers: ["leave", "vacation", "time off", "pto"],
        actions: [
          {
            name: "checkLeaveBalance",
            type: "api_call",
            description: "Check employee leave balance from HRIS",
            config: { endpoint: "/hr/leave-balance", method: "GET" }
          },
          {
            name: "analyzeTeamCoverage",
            type: "workflow",
            description: "Analyze team coverage and identify conflicts",
            config: { workflow: "team-coverage-analysis" }
          },
          {
            name: "submitLeaveRequest",
            type: "integration",
            description: "Submit leave request to HRIS system",
            config: { system: "HRIS", action: "create-leave-request" }
          }
        ],
        requiredIntegrations: ["Microsoft Graph", "HRIS", "Calendar"],
        complexity: "medium"
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
            description: "Create user account in Azure AD",
            config: { system: "Azure AD", action: "create-user" }
          },
          {
            name: "assignEquipment",
            type: "workflow",
            description: "Assign equipment and setup workspace",
            config: { workflow: "equipment-assignment" }
          }
        ],
        requiredIntegrations: ["Azure AD", "Equipment Management", "HRIS"],
        complexity: "high"
      }
    ])

    // IT Skills
    this.skillTemplates.set("it", [
      {
        name: "Password Reset",
        domain: "IT",
        description: "Secure automated password reset with verification",
        triggers: ["password", "reset", "login", "access"],
        actions: [
          {
            name: "verifyIdentity",
            type: "ai_analysis",
            description: "AI-powered identity verification",
            config: { method: "biometric_behavioral" }
          },
          {
            name: "resetPassword",
            type: "integration",
            description: "Reset password in Azure AD",
            config: { system: "Azure AD", action: "reset-password" }
          }
        ],
        requiredIntegrations: ["Azure AD", "Identity Verification"],
        complexity: "medium"
      },
      {
        name: "Incident Management",
        domain: "IT",
        description: "Automated incident creation and routing",
        triggers: ["incident", "issue", "problem", "technical"],
        actions: [
          {
            name: "categorizeIncident",
            type: "ai_analysis",
            description: "AI categorization of incident type and priority",
            config: { model: "classification" }
          },
          {
            name: "createTicket",
            type: "integration",
            description: "Create ticket in ServiceNow",
            config: { system: "ServiceNow", action: "create-incident" }
          }
        ],
        requiredIntegrations: ["ServiceNow", "Monitoring Systems"],
        complexity: "medium"
      }
    ])

    // Sales Skills  
    this.skillTemplates.set("sales", [
      {
        name: "Lead Qualification",
        domain: "Sales",
        description: "AI-powered lead qualification and scoring",
        triggers: ["lead", "prospect", "qualification", "scoring"],
        actions: [
          {
            name: "analyzeLeadData",
            type: "ai_analysis",
            description: "AI analysis of lead data and behavior",
            config: { model: "lead-scoring", sources: ["CRM", "Web", "Social"] }
          },
          {
            name: "updateCRM",
            type: "integration",
            description: "Update lead score in CRM system",
            config: { system: "Dynamics365", action: "update-lead" }
          }
        ],
        requiredIntegrations: ["Dynamics 365", "Marketing Automation", "Web Analytics"],
        complexity: "high"
      },
      {
        name: "Demo Scheduling",
        domain: "Sales",
        description: "Intelligent demo scheduling with optimal timing",
        triggers: ["demo", "meeting", "schedule", "presentation"],
        actions: [
          {
            name: "findOptimalTime",
            type: "ai_analysis",
            description: "AI-powered optimal meeting time analysis",
            config: { analysis: "calendar_behavioral_timezone" }
          },
          {
            name: "scheduleMeeting",
            type: "integration",
            description: "Schedule meeting in calendar systems",
            config: { system: "Microsoft Graph", action: "create-event" }
          }
        ],
        requiredIntegrations: ["Microsoft Graph", "CRM", "Calendar"],
        complexity: "medium"
      }
    ])
  }

  getSkillTemplatesByDomain(domain: string): SkillTemplate[] {
    return this.skillTemplates.get(domain.toLowerCase()) || []
  }

  getAllSkillTemplates(): Map<string, SkillTemplate[]> {
    return this.skillTemplates
  }
}
