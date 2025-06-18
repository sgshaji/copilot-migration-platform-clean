import { NextRequest, NextResponse } from 'next/server'
import { ProductionInfrastructure } from '@/lib/production-infrastructure'

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Starting production infrastructure initialization...")
    
    const infrastructure = ProductionInfrastructure.getInstance()
    
    const result = await infrastructure.initializeInfrastructure()
    
    if (result.success) {
      console.log("✅ Infrastructure initialization completed successfully")
      
      return NextResponse.json({
        success: true,
        message: "Production infrastructure initialized successfully",
        data: {
          deploymentUrl: result.deploymentUrl,
          status: result.status,
          instructions: result.instructions,
          freeTierInfo: {
            hosting: "Vercel - 100GB bandwidth, 6000 build minutes",
            database: "Supabase - 500MB storage, 2GB bandwidth",
            ai: "OpenAI - 3 requests/minute, 4000 tokens/request",
            monitoring: "Vercel Analytics - 100k events/month"
          }
        }
      })
    } else {
      console.error("❌ Infrastructure initialization failed")
      
      return NextResponse.json({
        success: false,
        message: "Infrastructure initialization failed",
        error: result.instructions.join(", "),
        data: {
          status: result.status
        }
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error("❌ Infrastructure initialization error:", error)
    
    return NextResponse.json({
      success: false,
      message: "Infrastructure initialization error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const infrastructure = ProductionInfrastructure.getInstance()
    const status = infrastructure.getInfrastructureStatus()
    const config = infrastructure.getInfrastructureConfig()
    const health = await infrastructure.healthCheck()
    
    return NextResponse.json({
      success: true,
      data: {
        status,
        config,
        health,
        freeTierLimits: {
          hosting: config.hosting.freeTierLimits,
          database: config.database.freeTierLimits,
          ai: config.ai.freeTierLimits,
          monitoring: config.monitoring.freeTierLimits
        }
      }
    })
    
  } catch (error) {
    console.error("❌ Infrastructure status check error:", error)
    
    return NextResponse.json({
      success: false,
      message: "Failed to get infrastructure status",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 