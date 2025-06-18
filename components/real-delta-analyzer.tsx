"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  TrendingUp,
  Zap,
  Brain,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Target,
  Lightbulb,
  ArrowRight,
} from "lucide-react"
import { DeltaAnalysisEngine, type DeltaAnalysisResult, type DeltaOpportunity } from "@/lib/delta-analysis-engine"

interface RealDeltaAnalyzerProps {
  botData?: {
    name: string
    platform: string
    intents: Array<{ name: string; utterances: string[]; responses: string[] }>
    entities: Array<{ name: string; values: string[] }>
  }
}

export default function RealDeltaAnalyzer({ botData }: RealDeltaAnalyzerProps) {
  const [analysisResult, setAnalysisResult] = useState<DeltaAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<DeltaOpportunity | null>(null)
  const [analysisEngine] = useState(() => DeltaAnalysisEngine.getInstance())

  // Sample bot data for demo
  const sampleBotData = {
    name: "HR Leave Assistant",
    platform: "Microsoft Bot Framework",
    intents: [
      {
        name: "CheckLeaveBalance",
        utterances: ["how many vacation days do i have", "check my leave balance", "remaining vacation days"],
        responses: [
          "You have 15 vacation days remaining this year.",
          "Your current leave balance is 15 vacation days.",
        ],
      },
      {
        name: "ApplyForLeave",
        utterances: ["i want to apply for leave", "request vacation time", "submit leave request"],
        responses: [
          "Please fill out the leave request form at hr.company.com/leave-request",
          "To apply for leave, visit our HR portal and submit a request form.",
        ],
      },
      {
        name: "GetHolidays",
        utterances: ["when is the next holiday", "company holidays", "holiday schedule"],
        responses: [
          "The next company holiday is Thanksgiving on November 23rd.",
          "Check the company calendar for all holiday dates.",
        ],
      },
      {
        name: "ContactHR",
        utterances: ["contact hr", "speak to hr representative", "hr phone number"],
        responses: ["You can contact HR at hr@company.com or call (555) 123-4567."],
      },
    ],
    entities: [
      { name: "leaveType", values: ["vacation", "sick", "personal", "maternity"] },
      { name: "employeeId", values: ["emp001", "emp002", "emp003"] },
    ],
  }

  const runAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      const dataToAnalyze = botData || sampleBotData
      console.log("🔍 Running real delta analysis on:", dataToAnalyze.name)

      const result = await analysisEngine.analyzeBotForDeltas(dataToAnalyze)
      setAnalysisResult(result)
      console.log("✅ Analysis complete:", result)
    } catch (error) {
      console.error("❌ Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "high":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getImpactIcon = (type: string) => {
    switch (type) {
      case "proactive":
        return <Brain className="w-5 h-5 text-purple-600" />
      case "integration":
        return <Zap className="w-5 h-5 text-blue-600" />
      case "automation":
        return <Target className="w-5 h-5 text-green-600" />
      case "intelligence":
        return <Lightbulb className="w-5 h-5 text-yellow-600" />
      default:
        return <TrendingUp className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Search className="w-8 h-8 text-blue-600" />
          Real Delta Analysis Engine
        </h1>
        <p className="text-gray-600">
          Analyze actual bot configurations to identify specific AI transformation opportunities
        </p>
      </div>

      {/* Analysis Trigger */}
      {!analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>🔍 Analyze Bot for Delta Opportunities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Search className="h-4 w-4" />
              <AlertDescription>
                This engine analyzes real bot configurations to identify specific patterns, limitations, and AI
                transformation opportunities with calculated ROI.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium mb-2">Sample Analysis Target:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <strong>Bot:</strong> {sampleBotData.name}
                  </p>
                  <p>
                    <strong>Platform:</strong> {sampleBotData.platform}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Intents:</strong> {sampleBotData.intents.length}
                  </p>
                  <p>
                    <strong>Entities:</strong> {sampleBotData.entities.length}
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={runAnalysis} disabled={isAnalyzing} className="w-full" size="lg">
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing Bot Patterns...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Run Real Delta Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <h3 className="font-semibold">Analyzing Bot Configuration</h3>
                <p className="text-sm text-gray-600">Running pattern detection algorithms...</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Detecting bot patterns...</span>
                  <span>100%</span>
                </div>
                <Progress value={100} />

                <div className="flex justify-between text-sm">
                  <span>Identifying delta opportunities...</span>
                  <span>85%</span>
                </div>
                <Progress value={85} />

                <div className="flex justify-between text-sm">
                  <span>Calculating business impact...</span>
                  <span>60%</span>
                </div>
                <Progress value={60} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{analysisResult.deltaOpportunities.length}</p>
                <p className="text-sm text-gray-600">Delta Opportunities</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{formatCurrency(analysisResult.totalPotentialROI)}</p>
                <p className="text-sm text-gray-600">Total Potential ROI</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{analysisResult.botSummary.qualityScore}/10</p>
                <p className="text-sm text-gray-600">Current Quality Score</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Badge className={`${getComplexityColor(analysisResult.botSummary.complexity)} text-lg px-3 py-1`}>
                  {analysisResult.botSummary.complexity}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">Bot Complexity</p>
              </CardContent>
            </Card>
          </div>

          {/* Detected Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Detected Bot Patterns & Limitations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.detectedPatterns.map((pattern, index) => (
                  <div key={index} className="border rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">{pattern.type.replace("_", " ")}</h4>
                      <Badge
                        variant={
                          pattern.impact === "high"
                            ? "destructive"
                            : pattern.impact === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {pattern.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{pattern.pattern}</p>
                    <div className="text-xs text-gray-500">
                      <p>
                        <strong>Frequency:</strong> {pattern.frequency}
                      </p>
                      <p>
                        <strong>Examples:</strong> {pattern.examples.slice(0, 2).join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delta Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Identified Delta Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Opportunities</TabsTrigger>
                  <TabsTrigger value="quick-wins">Quick Wins</TabsTrigger>
                  <TabsTrigger value="high-impact">High Impact</TabsTrigger>
                  <TabsTrigger value="strategic">Strategic</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {analysisResult.deltaOpportunities.map((opportunity, index) => (
                    <div
                      key={index}
                      className="border rounded p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedOpportunity(opportunity)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getImpactIcon(opportunity.type)}
                          <div>
                            <h3 className="font-semibold">{opportunity.name}</h3>
                            <p className="text-sm text-gray-600 capitalize">{opportunity.type} transformation</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(opportunity.businessImpact.annualROI)}
                          </p>
                          <p className="text-xs text-gray-500">Annual ROI</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-red-600 mb-1">Current Limitation:</p>
                          <p className="text-gray-600">{opportunity.currentLimitation.description}</p>
                        </div>
                        <div>
                          <p className="font-medium text-green-600 mb-1">AI Transformation:</p>
                          <p className="text-gray-600">{opportunity.aiTransformation.description}</p>
                        </div>
                        <div>
                          <p className="font-medium text-blue-600 mb-1">Business Impact:</p>
                          <p className="text-gray-600">
                            {opportunity.businessImpact.timeSavingsPerInteraction} min saved per interaction
                          </p>
                          <p className="text-gray-600">{opportunity.businessImpact.efficiencyGain}% efficiency gain</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <div className="flex items-center gap-4">
                          <Badge className={getComplexityColor(opportunity.implementationComplexity)}>
                            {opportunity.implementationComplexity} complexity
                          </Badge>
                          <span className="text-sm text-gray-500">{opportunity.confidence}% confidence</span>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="quick-wins">
                  <div className="space-y-4">
                    {analysisResult.prioritizedRecommendations.quickWins.map((opportunity, index) => (
                      <div key={index} className="border rounded p-4 bg-green-50 border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <h3 className="font-semibold text-green-800">{opportunity.name}</h3>
                        </div>
                        <p className="text-sm text-green-700 mb-2">{opportunity.aiTransformation.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-600">
                            ROI: {formatCurrency(opportunity.businessImpact.annualROI)}
                          </span>
                          <Badge className="bg-green-100 text-green-800">
                            {opportunity.implementationComplexity} complexity
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="high-impact">
                  <div className="space-y-4">
                    {analysisResult.prioritizedRecommendations.highImpact.map((opportunity, index) => (
                      <div key={index} className="border rounded p-4 bg-blue-50 border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-blue-800">{opportunity.name}</h3>
                        </div>
                        <p className="text-sm text-blue-700 mb-2">{opportunity.aiTransformation.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-600">
                            ROI: {formatCurrency(opportunity.businessImpact.annualROI)}
                          </span>
                          <span className="text-sm text-blue-600">
                            {opportunity.businessImpact.efficiencyGain}% efficiency gain
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="strategic">
                  <div className="space-y-4">
                    {analysisResult.prioritizedRecommendations.strategicInitiatives.map((opportunity, index) => (
                      <div key={index} className="border rounded p-4 bg-purple-50 border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-5 h-5 text-purple-600" />
                          <h3 className="font-semibold text-purple-800">{opportunity.name}</h3>
                        </div>
                        <p className="text-sm text-purple-700 mb-2">{opportunity.aiTransformation.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-purple-600">
                            ROI: {formatCurrency(opportunity.businessImpact.annualROI)}
                          </span>
                          <Badge className="bg-purple-100 text-purple-800">Strategic Initiative</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Implementation Roadmap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Implementation Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-green-600 mb-3">Phase 1: Quick Wins</h3>
                  <div className="space-y-2">
                    {analysisResult.implementationRoadmap.phase1.map((opp, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded border border-green-200">
                        <p className="font-medium text-sm">{opp.name}</p>
                        <p className="text-xs text-green-600">{formatCurrency(opp.businessImpact.annualROI)} ROI</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-blue-600 mb-3">Phase 2: Core Enhancements</h3>
                  <div className="space-y-2">
                    {analysisResult.implementationRoadmap.phase2.map((opp, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded border border-blue-200">
                        <p className="font-medium text-sm">{opp.name}</p>
                        <p className="text-xs text-blue-600">{formatCurrency(opp.businessImpact.annualROI)} ROI</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-purple-600 mb-3">Phase 3: Strategic Initiatives</h3>
                  <div className="space-y-2">
                    {analysisResult.implementationRoadmap.phase3.map((opp, index) => (
                      <div key={index} className="p-3 bg-purple-50 rounded border border-purple-200">
                        <p className="font-medium text-sm">{opp.name}</p>
                        <p className="text-xs text-purple-600">{formatCurrency(opp.businessImpact.annualROI)} ROI</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reset Button */}
          <div className="text-center">
            <Button onClick={() => setAnalysisResult(null)} variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Run New Analysis
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}