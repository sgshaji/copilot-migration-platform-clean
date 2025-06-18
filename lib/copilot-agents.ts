import { generateText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Simulated enterprise data sources
const ENTERPRISE_DATA = {
  employees: [
    { id: "emp001", name: "John Doe", department: "Engineering", manager: "Sarah Johnson", leaveBalance: 15 },
    { id: "emp002", name: "Jane Smith", department: "Marketing", manager: "Mike Wilson", leaveBalance: 8 },
  ],
  projects: [
    { id: "proj001", name: "Q4 Platform Release", deadline: "2024-11-15", team: ["emp001", "emp003"] },
    { id: "proj002", name: "Marketing Campaign", deadline: "2024-10-30", team: ["emp002"] },
  ],
  tickets: [
    { id: "tick001", type: "password_reset", user: "emp001", status: "open", priority: "medium" },
    { id: "tick002", type: "software_request", user: "emp002", status: "pending_approval", priority: "low" },
  ],
  leads: [
    {
      id: "lead001",
      company: "TechCorp",
      contact: "Sarah Johnson",
      size: 250,
      industry: "SaaS",
      score: 87,
      stage: "qualification",
    },
    {
      id: "lead002",
      company: "RetailMax",
      contact: "Mike Chen",
      size: 500,
      industry: "Retail",
      score: 72,
      stage: "demo_scheduled",
    },
  ],
}

// Check if we have API key available
const hasApiKey = !!(
  process.env.OPENAI_API_KEY ||
  process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
  (typeof window !== "undefined" && (window as any).OPENAI_API_KEY)
)

// HR Agent Tools
const hrTools = {
  checkLeaveBalance: tool({
    description: "Check employee leave balance and analyze optimal timing",
    parameters: z.object({
      employeeId: z.string().optional(),
      requestedDates: z.string().optional(),
    }),
    execute: async ({ employeeId = "emp001", requestedDates }) => {
      const employee = ENTERPRISE_DATA.employees.find((emp) => emp.id === employeeId)
      const projects = ENTERPRISE_DATA.projects.filter((proj) => proj.team.includes(employeeId))

      // Simulate team coverage analysis
      const teamCoverage = Math.random() > 0.3 ? "available" : "limited"
      const conflictRisk = projects.length > 1 ? "high" : "low"

      return {
        employee: employee?.name || "Current User",
        leaveBalance: employee?.leaveBalance || 15,
        expiringDays: Math.floor(Math.random() * 10),
        teamCoverage,
        conflictRisk,
        projects: projects.map((p) => ({ name: p.name, deadline: p.deadline })),
        optimalDates: "October 23-27, 2024",
        reasoning: "Based on project timelines and team availability analysis",
      }
    },
  }),

  analyzeTeamWorkload: tool({
    description: "Analyze team workload and capacity for coverage planning",
    parameters: z.object({
      department: z.string().optional(),
      timeframe: z.string().optional(),
    }),
    execute: async ({ department = "Engineering", timeframe = "next_month" }) => {
      return {
        department,
        currentCapacity: "78%",
        availableForCoverage: ["John Doe", "Mike Wilson"],
        upcomingDeadlines: ENTERPRISE_DATA.projects.map((p) => ({
          project: p.name,
          deadline: p.deadline,
          impact: "medium",
        })),
        recommendation: "Optimal leave window: Oct 20-30 with John covering critical tasks",
      }
    },
  }),
}

// IT Agent Tools
const itTools = {
  analyzeSecurityContext: tool({
    description: "Analyze user security context and access patterns",
    parameters: z.object({
      userId: z.string().optional(),
      requestType: z.string(),
    }),
    execute: async ({ userId = "emp001", requestType }) => {
      return {
        userId,
        securityScore: Math.floor(Math.random() * 30) + 70, // 70-100
        lastLogin: "2024-01-15T10:30:00Z",
        suspiciousActivity: Math.random() > 0.8,
        mfaEnabled: Math.random() > 0.3,
        complianceStatus: "compliant",
        riskLevel: Math.random() > 0.7 ? "medium" : "low",
        recommendations: [
          "Enable Windows Hello for passwordless auth",
          "Review recent access patterns",
          "Update security training completion",
        ],
      }
    },
  }),

  predictIssueResolution: tool({
    description: "Predict issue resolution path and automate common fixes",
    parameters: z.object({
      issueType: z.string(),
      userContext: z.string().optional(),
    }),
    execute: async ({ issueType, userContext }) => {
      const resolutionPaths = {
        password_reset: {
          automated: true,
          steps: ["Verify identity", "Send secure reset link", "Update security score"],
          estimatedTime: "2 minutes",
          successRate: "96%",
        },
        software_request: {
          automated: false,
          steps: ["Check license availability", "Manager approval", "IT deployment"],
          estimatedTime: "2-4 hours",
          successRate: "89%",
        },
        access_request: {
          automated: true,
          steps: ["Validate role requirements", "Security check", "Auto-provision"],
          estimatedTime: "15 minutes",
          successRate: "94%",
        },
      }

      return resolutionPaths[issueType as keyof typeof resolutionPaths] || resolutionPaths.password_reset
    },
  }),
}

// Sales Agent Tools
const salesTools = {
  qualifyLead: tool({
    description: "Analyze and qualify sales lead with intelligence data",
    parameters: z.object({
      leadId: z.string().optional(),
      companyName: z.string().optional(),
    }),
    execute: async ({ leadId = "lead001", companyName }) => {
      const lead = ENTERPRISE_DATA.leads.find((l) => l.id === leadId)

      return {
        company: lead?.company || companyName || "TechCorp",
        qualificationScore: lead?.score || Math.floor(Math.random() * 40) + 60,
        buyingSignals: [
          "Downloaded 3 whitepapers in past week",
          "Visited pricing page 5 times",
          "Decision maker level contact",
        ],
        competitiveIntel: {
          currentSolution: "Legacy system (5+ years old)",
          evaluatingAlternatives: ["Competitor A", "Build vs Buy"],
          decisionTimeline: "30-45 days",
        },
        recommendedApproach: {
          demoFocus: "Workflow automation and ROI calculator",
          pricingStrategy: "Professional tier with volume discount",
          nextSteps: ["Schedule technical demo", "Provide ROI analysis", "Connect with technical team"],
        },
        projectedValue: {
          dealSize: "$187,500",
          probability: "73%",
          expectedClose: "28 days",
        },
      }
    },
  }),

  analyzePipeline: tool({
    description: "Analyze sales pipeline and provide forecasting insights",
    parameters: z.object({
      timeframe: z.string().optional(),
      stage: z.string().optional(),
    }),
    execute: async ({ timeframe = "current_quarter", stage }) => {
      return {
        timeframe,
        totalPipeline: "$2.4M",
        weightedForecast: "$1.8M",
        topOpportunities: ENTERPRISE_DATA.leads.map((lead) => ({
          company: lead.company,
          value: "$" + (lead.size * 750).toLocaleString(),
          probability: lead.score + "%",
          stage: lead.stage,
        })),
        insights: [
          "67% of qualified leads convert within 30 days",
          "Enterprise deals (500+ employees) have 23% higher close rates",
          "Demo completion increases conversion by 45%",
        ],
        recommendations: [
          "Focus on TechCorp - highest probability close",
          "Schedule RetailMax technical demo this week",
          "Follow up on 3 stalled opportunities",
        ],
      }
    },
  }),
}

// Intelligent fallback responses when no API key
const getIntelligentFallback = (agentType: string, message: string) => {
  const lowerMessage = message.toLowerCase()

  if (agentType === "hr") {
    if (lowerMessage.includes("vacation") || lowerMessage.includes("leave") || lowerMessage.includes("time off")) {
      return {
        message: `🧠 **HR Intelligence Analysis** (Demo Mode - No API Key Required)

**Your Leave Request Context:**
• You have 15 vacation days (10 expire Dec 31st)
• Q4 project deadline: November 15th  
• Team coverage analysis: ✅ Available Oct 20-30

**🎯 Smart Recommendation:**
Take leave October 23-27 (5 days) because:
• Avoids project crunch period
• John can cover your client calls  
• Aligns with team's lighter workload period
• Maximizes your expiring days usage

**🚀 I can automatically:**
1. Draft approval email to Sarah (your manager)
2. Block your calendar for those dates
3. Set up coverage assignments with John
4. Schedule project handoff meeting
5. Add reminders for preparation tasks

**💰 Value Created:**
• Prevented potential project conflict
• Optimized team productivity  
• Saved 45 minutes of manual coordination
• Ensured compliance with company policies

*Note: This is an intelligent demo response. With API access, I would provide even more personalized analysis.*`,
        type: "insight" as const,
        metadata: {
          confidence: 94,
          actions: ["Draft email", "Block calendar", "Assign coverage", "Schedule meeting"],
          dataSource: "Demo: M365 Graph + HR Systems",
          roi: "$2,400 annual value",
        },
      }
    }
  } else if (agentType === "it") {
    if (lowerMessage.includes("password") || lowerMessage.includes("login") || lowerMessage.includes("access")) {
      return {
        message: `🔧 **IT Operations Intelligence** (Demo Mode - No API Key Required)

**Issue Context Detected:**
• Password reset request from secure location
• No recent security incidents on your account
• Last password change: 45 days ago (within policy)

**🎯 Proactive Resolution:**
I've already:
✅ Verified your identity via Azure AD
✅ Checked for any security flags (none found)  
✅ Prepared temporary access credentials

**🚀 Automated Actions Available:**
1. **Instant Reset**: Send secure reset link to your verified email
2. **Temporary Access**: 4-hour bypass code for urgent work
3. **Security Scan**: Check for any compromised credentials
4. **Policy Update**: Remind about MFA setup if not enabled

**🛡️ Security Intelligence:**
• No suspicious login attempts detected
• Your account security score: 8.7/10
• Recommended: Enable Windows Hello for seamless access

**💡 Predictive Insight:**
Based on patterns, 67% of users in your role benefit from passwordless authentication. Would you like me to set this up?

*Note: This is an intelligent demo response. With API access, I would provide real-time security analysis.*`,
        type: "workflow" as const,
        metadata: {
          confidence: 96,
          actions: ["Reset password", "Enable MFA", "Setup Windows Hello", "Security scan"],
          dataSource: "Demo: Azure AD + Security Center",
          roi: "32 min saved vs traditional ticket",
        },
      }
    }
  } else if (agentType === "sales") {
    if (
      lowerMessage.includes("lead") ||
      lowerMessage.includes("prospect") ||
      lowerMessage.includes("demo") ||
      lowerMessage.includes("pricing")
    ) {
      return {
        message: `💼 **Sales Intelligence Analysis** (Demo Mode - No API Key Required)

**Lead Context:**
• Company: TechCorp (250 employees, SaaS industry)
• Contact: Sarah Johnson, VP Operations
• Previous interactions: 2 website visits, downloaded whitepaper
• Budget indicator: $50K-100K range (based on company profile)

**🎯 Intelligent Qualification:**
**High-Value Opportunity Detected** (Score: 8.7/10)
• Perfect ICP match (SaaS, 250 employees)
• Active buying signals (recent content engagement)
• Decision maker level contact
• Budget alignment confirmed

**🚀 Automated Actions Completed:**
1. ✅ Pulled company financial data (healthy growth)
2. ✅ Identified 3 key pain points from website behavior
3. ✅ Prepared personalized demo environment
4. ✅ Generated competitive positioning doc
5. ✅ Scheduled optimal follow-up timing

**💡 Strategic Recommendations:**
• **Demo Focus**: Emphasize workflow automation (their #1 pain point)
• **Pricing Strategy**: Start with Professional tier ($75/user/month)
• **Timeline**: 67% probability of decision within 30 days
• **Competition**: They're also evaluating Competitor X (here's how we win)

**💰 Projected Value:**
• Deal size: $187,500 (Professional tier, 250 users)
• Probability: 73% (based on similar profiles)
• Expected close: 28 days

*Note: This is an intelligent demo response. With API access, I would provide real-time CRM and market intelligence.*`,
        type: "action" as const,
        metadata: {
          confidence: 87,
          actions: ["Send demo invite", "Prepare ROI calc", "Schedule follow-up", "Update CRM"],
          dataSource: "Demo: CRM + Web Analytics + Market Intelligence",
          roi: "$187K deal potential",
        },
      }
    }
  }

  return {
    message: `I'm your intelligent ${agentType.toUpperCase()} agent running in demo mode (no API key required). I can demonstrate advanced capabilities that were impossible with legacy bots. 

**Demo Features Active:**
• Intelligent response generation
• Enterprise data simulation  
• Workflow automation previews
• Predictive analytics demos

Try asking about specific scenarios related to ${agentType} operations to see my advanced capabilities in action!

*Note: With API access, I would provide even more dynamic and personalized responses using real AI.*`,
    type: "text" as const,
    metadata: {
      confidence: 85,
      actions: [],
      dataSource: "Demo mode - intelligent fallback",
    },
  }
}

// Agent Classes
export class HRCopilotAgent {
  async processMessage(message: string, context?: any) {
    console.log("🤖 HR Agent: Processing message in demo mode")

    if (hasApiKey) {
      try {
        const { text } = await generateText({
          model: openai("gpt-4o"),
          messages: [
            {
              role: "system",
              content: `You are an intelligent HR Copilot Agent with advanced capabilities that were impossible with legacy chatbots.

CAPABILITIES:
- Proactive leave conflict detection and optimization
- Cross-system data integration (calendars, projects, team data)
- Predictive workforce analytics
- Automated workflow orchestration
- Contextual policy compliance

PERSONALITY:
- Professional but friendly
- Proactive and insightful
- Data-driven recommendations
- Focus on preventing issues before they occur

When users ask about leave, vacation, or HR topics:
1. Use tools to gather real data
2. Provide proactive analysis and recommendations
3. Offer automated actions
4. Show business value and time savings

Always format responses with clear sections using markdown and emojis for visual appeal.`,
            },
            {
              role: "user",
              content: message,
            },
          ],
          tools: hrTools,
          maxToolRoundtrips: 3,
          temperature: 0.7,
        })

        return {
          message: text,
          type: "insight" as const,
          metadata: {
            confidence: Math.floor(Math.random() * 20) + 80,
            dataSource: "Real AI: M365 Graph + HR Systems",
            actions: ["Schedule meeting", "Send approval", "Block calendar", "Update policies"],
          },
        }
      } catch (error) {
        console.warn("HR Agent AI failed, using intelligent fallback:", error)
      }
    }

    // Use intelligent fallback
    return getIntelligentFallback("hr", message)
  }
}

export class ITCopilotAgent {
  async processMessage(message: string, context?: any) {
    console.log("🤖 IT Agent: Processing message in demo mode")

    if (hasApiKey) {
      try {
        const { text } = await generateText({
          model: openai("gpt-4o"),
          messages: [
            {
              role: "system",
              content: `You are an intelligent IT Operations Copilot Agent with advanced capabilities impossible with legacy helpdesk bots.

CAPABILITIES:
- Predictive issue detection and prevention
- Automated security analysis and compliance checking
- Self-healing workflow orchestration
- Real-time system health monitoring
- Intelligent ticket routing and resolution

PERSONALITY:
- Technical but accessible
- Security-focused
- Proactive problem solver
- Efficiency-oriented

When users have IT issues:
1. Analyze security context and user patterns
2. Predict resolution paths and automate where possible
3. Provide proactive recommendations
4. Show time/cost savings vs traditional tickets

Format responses with technical details, security insights, and clear action items.`,
            },
            {
              role: "user",
              content: message,
            },
          ],
          tools: itTools,
          maxToolRoundtrips: 3,
          temperature: 0.6,
        })

        return {
          message: text,
          type: "workflow" as const,
          metadata: {
            confidence: Math.floor(Math.random() * 15) + 85,
            dataSource: "Real AI: Azure AD + Security Center + ITSM",
            actions: ["Reset password", "Update permissions", "Run diagnostics", "Create ticket"],
          },
        }
      } catch (error) {
        console.warn("IT Agent AI failed, using intelligent fallback:", error)
      }
    }

    // Use intelligent fallback
    return getIntelligentFallback("it", message)
  }
}

export class SalesCopilotAgent {
  async processMessage(message: string, context?: any) {
    console.log("🤖 Sales Agent: Processing message in demo mode")

    if (hasApiKey) {
      try {
        const { text } = await generateText({
          model: openai("gpt-4o"),
          messages: [
            {
              role: "system",
              content: `You are an intelligent Sales Copilot Agent with advanced capabilities impossible with legacy sales bots.

CAPABILITIES:
- Dynamic lead qualification with behavioral analysis
- Real-time competitive intelligence
- Pipeline forecasting with predictive analytics
- Automated opportunity scoring and routing
- Cross-platform data integration (CRM, web analytics, market data)

PERSONALITY:
- Results-driven and strategic
- Data-informed recommendations
- Revenue-focused insights
- Proactive opportunity identification

When handling sales inquiries:
1. Qualify leads with intelligent scoring
2. Provide competitive positioning
3. Calculate ROI and business value
4. Recommend optimal next actions
5. Show pipeline impact and forecasting

Format with business metrics, competitive insights, and clear revenue opportunities.`,
            },
            {
              role: "user",
              content: message,
            },
          ],
          tools: salesTools,
          maxToolRoundtrips: 3,
          temperature: 0.7,
        })

        return {
          message: text,
          type: "action" as const,
          metadata: {
            confidence: Math.floor(Math.random() * 20) + 80,
            dataSource: "Real AI: CRM + Web Analytics + Market Intelligence",
            actions: ["Schedule demo", "Send proposal", "Update CRM", "Generate ROI report"],
          },
        }
      } catch (error) {
        console.warn("Sales Agent AI failed, using intelligent fallback:", error)
      }
    }

    // Use intelligent fallback
    return getIntelligentFallback("sales", message)
  }
}

// Agent Factory
export const createCopilotAgent = (agentType: "hr" | "it" | "sales") => {
  switch (agentType) {
    case "hr":
      return new HRCopilotAgent()
    case "it":
      return new ITCopilotAgent()
    case "sales":
      return new SalesCopilotAgent()
    default:
      throw new Error(`Unknown agent type: ${agentType}`)
  }
}
