
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test environment variable access
    const envTest = {
      totalEnvVars: Object.keys(process.env).length,
      hasBotpressToken: !!process.env.BOTPRESS_TOKEN,
      sampleEnvKeys: Object.keys(process.env).slice(0, 10),
      botpressValue: process.env.BOTPRESS_TOKEN ? "FOUND (length: " + process.env.BOTPRESS_TOKEN.length + ")" : "NOT FOUND",
      replitEnvVars: {
        REPL_ID: process.env.REPL_ID || "missing",
        REPLIT_DB_URL: !!process.env.REPLIT_DB_URL,
        NODE_ENV: process.env.NODE_ENV || "missing"
      }
    }

    console.log("🧪 Environment test results:", envTest)

    return NextResponse.json({
      success: true,
      message: "Environment variable test completed",
      results: envTest
    })
  } catch (error) {
    console.error("❌ Environment test failed:", error)
    return NextResponse.json({
      success: false,
      error: "Environment test failed",
      details: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
