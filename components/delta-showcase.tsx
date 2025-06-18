"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Zap,
  Brain,
  TrendingUp,
  Users,
  Shield,
  Database,
  ArrowRight,
  CheckCircle,
  XCircle,
  Sparkles,
  Clock,
  BarChart3,
} from "lucide-react"

interface DeltaScenario {
  id: string
  name: string
  domain: string
  description: string
  legacyResponse: {
    text: string
    limitations: string[]
    userExperience: "poor" | "basic" | "good"
  }
  aiResponse: {
    text: string
    capabilities: string[]
    userExperience: "excellent" | "amazing" | "revolutionary"
    proactiveActions: string[]
    dataIntegrations: string[]
  }
  businessImpact: {
    timeSaved: string
    efficiencyGain: string
    roi: string
    preventedIssues: string
  }
  impossibleBefore: string[]
}

const DELTA_SCENARIOS: DeltaScenario[] = [
  {
    id: "hr-leave-intelligence",
    name: "Intelligent Leave Planning",
    domain: "HR",
    description: "Transform simple leave balance checks into intelligent workforce optimization",
    legacyResponse: {
      text: "You have 15 vacation days remaining this year.",
      limitations: [
        "Static data only",
        "No context awareness",
        "No team impact analysis",
        "No proactive recommendations",
        "Manual follow-up required",
      ],
      userExperience: "basic",
    },
    aiResponse: {
      text: `🧠 **AI Leave Intelligence Analysis**

**Your Leave Context:**
• You have 15 vacation days (10 expire Dec 31st) 
• Q4 project deadline: November 15th
• Team coverage analysis: ✅ Available Oct 20-30

**🎯 AI Recommendation:**
Take leave October 23-27 (5 days) because:
• AI analysis shows no project conflicts
• Machine learning predicts optimal team coverage  
• Automated workflow can handle approvals
• Prevents 3 potential scheduling conflicts

**🚀 I can automatically:**
1. Draft approval email to Sarah (your manager)
2. Block your calendar and set coverage
3. Notify project stakeholders
4. Schedule handoff meetings
5. Update resource planning systems

**💰 Value Created:**
• Prevented potential project delays
• Optimized team productivity
• Saved 45 minutes of coordination
• Ensured policy compliance`,
      capabilities: [
        "Cross-system calendar analysis",
        "Predictive conflict detection",
        "Automated workflow orchestration",
        "Proactive stakeholder communication",
        "Real-time policy compliance",
      ],
      userExperience: "revolutionary",
      proactiveActions: [
        "Auto-draft manager approval email",
        "Schedule coverage assignments",
        "Block calendar automatically",
        "Notify project team",
        "Update resource planning",
      ],
      dataIntegrations: [
        "Microsoft Graph Calendar",
        "Project Management Systems",
        "HRIS Database",
        "Team Directory",
        "Policy Management",
      ],
    },
    businessImpact: {
      timeSaved: "45 minutes per leave request",
      efficiencyGain: "73% reduction in coordination time",
      roi: "$2,400/employee/year",
      preventedIssues: "89% fewer scheduling conflicts",
    },
    impossibleBefore: [
      "Predictive conflict analysis across multiple systems",
      "Automated cross-team coordination",
      "Proactive policy compliance checking",
      "Real-time resource optimization",
      "Intelligent timing recommendations",
    ],
  },
  {
    id: "it-predictive-support",
    name: "Predictive IT Support",
    domain: "IT",
    description: "Transform reactive password resets into predictive issue prevention",
    legacyResponse: {
      text: "I'll help you reset your password. Please visit reset.company.com and follow the instructions.",
      limitations: [
        "Reactive response only",
        "No security analysis",
        "No pattern detection",
        "Manual process required",
        "No prevention insights",
      ],
      userExperience: "basic",
    },
    aiResponse: {
      text: `🔧 **AI Security & Predictive Analysis**

**Issue Context Detected:**
• Password reset request from secure location
• AI security analysis: No anomalies detected
• Behavioral pattern: Normal (96% confidence)
• Account health score: 8.7/10

**🎯 Intelligent Resolution:**
I've already:
✅ Verified your identity via Azure AD
✅ Analyzed recent access patterns (all normal)
✅ Prepared secure reset credentials
✅ Detected potential future issues

**🚀 Automated Actions:**
1. **Instant Reset**: Secure link sent to verified email
2. **Security Scan**: No compromised credentials found
3. **Predictive Alert**: Your password expires in 12 days
4. **Proactive Setup**: Windows Hello recommended

**🛡️ AI Prevention Insights:**
• 67% of users in your role benefit from passwordless auth
• Your login pattern suggests mobile access needs
• Recommend: Enable biometric authentication
• Predicted: 3 similar requests prevented this month

**💡 Proactive Recommendations:**
• Enable Windows Hello for seamless access
• Set up mobile authenticator app
• Schedule security training refresh`,
      capabilities: [
        "Real-time security analysis",
        "Behavioral pattern recognition",
        "Predictive issue detection",
        "Automated identity verification",
        "Proactive security recommendations",
      ],
      userExperience: "revolutionary",
      proactiveActions: [
        "Instant secure password reset",
        "Automated security scanning",
        "Predictive expiration alerts",
        "Biometric setup assistance",
        "Security training scheduling",
      ],
      dataIntegrations: [
        "Azure Active Directory",
        "Security Information Systems",
        "Behavioral Analytics",
        "Identity Management",
        "Threat Intelligence",
      ],
    },
    businessImpact: {
      timeSaved: "32 minutes per IT ticket",
      efficiencyGain: "67% reduction in security incidents",
      roi: "$8,000/incident prevented",
      preventedIssues: "78% fewer password-related tickets",
    },
    impossibleBefore: [
      "Real-time behavioral security analysis",
      "Predictive credential expiration management",
      "Automated identity verification workflows",
      "Cross-system security pattern detection",
      "Proactive authentication recommendations",
    ],
  },
  {
    id: "sales-intelligent-qualification",
    name: "AI Lead Qualification",
    domain: "Sales",
    description: "Transform basic lead capture into intelligent revenue optimization",
    legacyResponse: {
      text: "Thank you for your interest! A sales representative will contact you within 24 hours.",
      limitations: [
        "No lead analysis",
        "Generic response",
        "No qualification scoring",
        "Manual follow-up required",
        "No competitive intelligence",
      ],
      userExperience: "poor",
    },
    aiResponse: {
      text: `💼 **AI Revenue Intelligence Analysis**

**Lead Intelligence:**
• Company: TechCorp (250 employees, SaaS industry)
• AI Qualification Score: 8.7/10 (HIGH VALUE)
• Behavioral Analysis: Strong buying signals detected
• Budget Indicator: $50K-100K range (ML prediction)

**🎯 Intelligent Qualification:**
**Perfect ICP Match Detected:**
• SaaS company (ideal customer profile)
• 250 employees (sweet spot for our solution)
• Decision maker level contact (VP Operations)
• Active evaluation phase (downloaded 3 resources)

**🚀 AI-Automated Intelligence:**
1. ✅ Company financial analysis: Healthy growth
2. ✅ Competitive landscape: Evaluating 2 alternatives  
3. ✅ Pain point detection: Workflow automation needs
4. ✅ Optimal timing: 67% close probability in 30 days
5. ✅ Personalized demo environment prepared

**💡 Strategic Recommendations:**
• **Demo Focus**: Emphasize workflow automation ROI
• **Pricing Strategy**: Professional tier ($75/user/month)
• **Timeline**: Decision expected within 30 days
• **Competition**: Position against Competitor X strengths

**💰 Revenue Optimization:**
• Projected deal size: $187,500 (Professional tier)
• Close probability: 73% (based on similar profiles)
• Expected timeline: 28 days
• Upsell potential: Enterprise features in 6 months

**🎯 Next Actions (Auto-Scheduled):**
• Demo invitation sent for optimal time slot
• ROI calculator prepared with their data
• Competitive positioning doc generated
• Follow-up sequence activated`,
      capabilities: [
        "Real-time lead scoring with ML",
        "Competitive intelligence analysis",
        "Behavioral buying signal detection",
        "Dynamic pricing optimization",
        "Automated revenue forecasting",
      ],
      userExperience: "revolutionary",
      proactiveActions: [
        "Intelligent lead scoring",
        "Automated demo scheduling",
        "Personalized ROI calculation",
        "Competitive analysis generation",
        "Revenue forecasting",
      ],
      dataIntegrations: [
        "CRM Systems",
        "Web Analytics",
        "Market Intelligence",
        "Financial Databases",
        "Competitive Analysis Tools",
      ],
    },
    businessImpact: {
      timeSaved: "1.2 hours per lead",
      efficiencyGain: "45% higher conversion rates",
      roi: "$187,500 average deal size",
      preventedIssues: "34% fewer lost opportunities",
    },
    impossibleBefore: [
      "Real-time behavioral lead scoring",
      "Automated competitive positioning",
      "Dynamic pricing optimization",
      "Predictive revenue forecasting",
      "Intelligent demo personalization",
    ],
  },
]

export default function DeltaShowcase() {
  const [activeScenario, setActiveScenario] = useState<string>("hr-leave-intelligence")
  const [viewMode, setViewMode] = useState<"comparison" | "legacy" | "ai">("comparison")

  const currentScenario = DELTA_SCENARIOS.find((s) => s.id === activeScenario)!

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-yellow-500" />
          Impossible-Before AI Capabilities
        </h1>
        <p className="text-gray-600">Experience the dramatic difference between legacy bots and AI agents</p>
      </div>

      {/* Scenario Selector */}
      <Tabs value={activeScenario} onValueChange={setActiveScenario}>
        <TabsList className="grid w-full grid-cols-3">
          {DELTA_SCENARIOS.map((scenario) => (
            <TabsTrigger key={scenario.id} value={scenario.id} className="flex items-center gap-2">
              {scenario.domain === "HR" && <Users className="w-4 h-4" />}
              {scenario.domain === "IT" && <Shield className="w-4 h-4" />}
              {scenario.domain === "Sales" && <TrendingUp className="w-4 h-4" />}
              {scenario.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeScenario} className="space-y-6">
          {/* View Mode Selector */}
          <div className="flex justify-center">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "legacy" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("legacy")}
                className="flex items-center gap-2"
              >
                <XCircle className="w-4 h-4 text-red-500" />
                Legacy Bot
              </Button>
              <Button
                variant={viewMode === "comparison" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("comparison")}
                className="flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Side by Side
              </Button>
              <Button
                variant={viewMode === "ai" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("ai")}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
                AI Agent
              </Button>
            </div>
          </div>

          {/* Scenario Description */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">{currentScenario.name}</h2>
              <p className="text-gray-700">{currentScenario.description}</p>
            </CardContent>
          </Card>

          {/* Response Comparison */}
          {viewMode === "comparison" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Legacy Response */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <XCircle className="w-5 h-5" />
                    Legacy Chatbot Response
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white p-4 rounded border border-red-200">
                    <p className="text-gray-800">{currentScenario.legacyResponse.text}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-red-700 mb-2">❌ Limitations:</h4>
                    <ul className="space-y-1">
                      {currentScenario.legacyResponse.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-red-600">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Badge variant="destructive" className="w-fit">
                    User Experience: {currentScenario.legacyResponse.userExperience}
                  </Badge>
                </CardContent>
              </Card>

              {/* AI Response */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Brain className="w-5 h-5" />
                    AI Copilot Agent Response
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white p-4 rounded border border-green-200">
                    <div className="whitespace-pre-line text-sm text-gray-800">{currentScenario.aiResponse.text}</div>
                  </div>

                  <div>
                    <h4 className="font-medium text-green-700 mb-2">✅ New Capabilities:</h4>
                    <ul className="space-y-1">
                      {currentScenario.aiResponse.capabilities.map((capability, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {capability}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Badge className="bg-green-100 text-green-800 w-fit">
                    User Experience: {currentScenario.aiResponse.userExperience}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Legacy Only View */}
          {viewMode === "legacy" && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <XCircle className="w-5 h-5" />
                  Legacy Chatbot Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white p-6 rounded border border-red-200">
                  <p className="text-lg text-gray-800 mb-4">{currentScenario.legacyResponse.text}</p>
                  <div className="text-sm text-gray-500">
                    <p>
                      💬 <strong>What happens next:</strong> User must manually coordinate, check calendars, contact
                      managers, and handle all follow-up tasks.
                    </p>
                  </div>
                </div>

                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Legacy Limitations:</strong> This response requires significant manual work, provides no
                    insights, and creates potential for errors and conflicts.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* AI Only View */}
          {viewMode === "ai" && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Brain className="w-5 h-5" />
                  AI Copilot Agent Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white p-6 rounded border border-green-200">
                  <div className="whitespace-pre-line text-gray-800 mb-4">{currentScenario.aiResponse.text}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-3">🚀 Proactive Actions:</h4>
                    <ul className="space-y-2">
                      {currentScenario.aiResponse.proactiveActions.map((action, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Zap className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-green-700 mb-3">🔗 Data Integrations:</h4>
                    <ul className="space-y-2">
                      {currentScenario.aiResponse.dataIntegrations.map((integration, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Database className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          {integration}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>AI Advantage:</strong> This response provides immediate value, prevents issues, and
                    automates follow-up tasks - all impossible with legacy bots.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Impossible Before Section */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Sparkles className="w-5 h-5" />
                Impossible-Before Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentScenario.impossibleBefore.map((capability, index) => (
                  <div key={index} className="bg-white p-4 rounded border border-purple-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                      </div>
                      <p className="text-sm font-medium text-purple-800">{capability}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Business Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Business Impact Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{currentScenario.businessImpact.timeSaved}</p>
                  <p className="text-sm text-gray-600">Time Saved</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{currentScenario.businessImpact.efficiencyGain}</p>
                  <p className="text-sm text-gray-600">Efficiency Gain</p>
                </div>
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{currentScenario.businessImpact.roi}</p>
                  <p className="text-sm text-gray-600">ROI</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">{currentScenario.businessImpact.preventedIssues}</p>
                  <p className="text-sm text-gray-600">Issues Prevented</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
