import { NextRequest, NextResponse } from 'next/server'
import { ProductionMigrationEngine } from '@/lib/production-migration-engine'

export async function POST(request: NextRequest) {
  try {
    const { botAnalysis, agentBlueprint } = await request.json()
    
    console.log("🚀 Starting production migration...")
    console.log("📊 Bot analysis:", botAnalysis)

    const migrationEngine = ProductionMigrationEngine.getInstance()
    
    const result = await migrationEngine.migrateToProduction(botAnalysis, agentBlueprint)
    
    console.log("✅ Production migration completed successfully")
    console.log("💰 Business impact:", result.businessImpact)
    console.log("🎯 Delta scenarios:", result.deltaScenarios.length)

    return NextResponse.json({
      success: true,
      agent: result.agent,
      deltaScenarios: result.deltaScenarios,
      migrationInstructions: result.migrationInstructions,
      businessImpact: result.businessImpact,
      copilotSuccessMetrics: {
        expectedUserAdoption: '90%',
        copilotUsageIncrease: '340%',
        timeToValue: '2.8 months',
        annualROI: result.businessImpact.totalAnnualROI
      }
    })

  } catch (error) {
    console.error("❌ Production migration failed:", error)
    return NextResponse.json({
      success: false,
      error: 'Production migration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')
    
    const migrationEngine = ProductionMigrationEngine.getInstance()
    
    // Return available delta scenarios for the domain
    const scenarios = await getDeltaScenariosForDomain(domain)
    
    return NextResponse.json({
      success: true,
      domain,
      availableScenarios: scenarios,
      totalBusinessValue: calculateTotalBusinessValue(scenarios),
      copilotFeatures: getCopilotFeaturesForDomain(domain)
    })

  } catch (error) {
    console.error("❌ Failed to get delta scenarios:", error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get delta scenarios'
    }, { status: 500 })
  }
}

async function getDeltaScenariosForDomain(domain: string | null): Promise<any[]> {
  // This would typically come from the migration engine
  // For now, return sample scenarios based on domain
  const scenarios = {
    hr: [
      {
        id: 'proactive_leave_management',
        name: 'Proactive Leave Management',
        category: 'proactive-automation',
        businessValue: '$45,000 annual ROI',
        copilotFeatures: ['Proactive notifications', 'Calendar optimization']
      },
      {
        id: 'cross_system_hr_orchestration',
        name: 'Cross-System HR Orchestration',
        category: 'cross-system-orchestration',
        businessValue: '$78,000 annual ROI',
        copilotFeatures: ['Multi-system orchestration', 'Data validation']
      },
      {
        id: 'predictive_attrition_intelligence',
        name: 'Predictive Attrition Intelligence',
        category: 'predictive-intelligence',
        businessValue: '$120,000 annual ROI',
        copilotFeatures: ['Predictive analytics', 'Risk scoring']
      }
    ],
    it: [
      {
        id: 'predictive_maintenance',
        name: 'Predictive System Maintenance',
        category: 'predictive-intelligence',
        businessValue: '$95,000 annual ROI',
        copilotFeatures: ['Predictive monitoring', 'Automated scheduling']
      },
      {
        id: 'automated_access_management',
        name: 'Automated Access Management',
        category: 'proactive-automation',
        businessValue: '$85,000 annual ROI',
        copilotFeatures: ['Automated provisioning', 'Role-based access']
      },
      {
        id: 'security_intelligence',
        name: 'Security Intelligence & Threat Detection',
        category: 'predictive-intelligence',
        businessValue: '$150,000 annual ROI',
        copilotFeatures: ['Threat detection', 'Automated response']
      }
    ],
    sales: [
      {
        id: 'lead_intelligence',
        name: 'Intelligent Lead Qualification',
        category: 'predictive-intelligence',
        businessValue: '$180,000 annual ROI',
        copilotFeatures: ['Lead scoring', 'Behavioral analysis']
      },
      {
        id: 'revenue_optimization',
        name: 'Revenue Optimization Intelligence',
        category: 'predictive-intelligence',
        businessValue: '$250,000 annual ROI',
        copilotFeatures: ['Revenue analytics', 'Pricing optimization']
      },
      {
        id: 'customer_insights',
        name: 'Customer Intelligence & Insights',
        category: 'contextual-memory',
        businessValue: '$180,000 annual ROI',
        copilotFeatures: ['Customer insights', 'Personalization']
      }
    ]
  }
  
  return scenarios[domain as keyof typeof scenarios] || scenarios.hr
}

function calculateTotalBusinessValue(scenarios: any[]): string {
  const totalROI = scenarios.reduce((sum, scenario) => {
    const roi = parseInt(scenario.businessValue.replace(/[^0-9]/g, ''))
    return sum + roi
  }, 0)
  
  return `$${totalROI.toLocaleString()} annual ROI`
}

function getCopilotFeaturesForDomain(domain: string | null): string[] {
  const features = {
    hr: [
      'Microsoft Graph API integration',
      'Teams deployment',
      'SharePoint automation',
      'Azure AD security',
      'Power Platform connectors'
    ],
    it: [
      'Azure integration',
      'Intune management',
      'Security Center',
      'Power Automate',
      'Azure Sentinel'
    ],
    sales: [
      'Microsoft 365 integration',
      'Power BI dashboards',
      'Dynamics 365 CRM',
      'Teams collaboration',
      'Business intelligence'
    ]
  }
  
  return features[domain as keyof typeof features] || features.hr
} 