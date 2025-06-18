
import { NextRequest, NextResponse } from "next/server"

// Simple in-memory storage for the session (in production, use a database)
let sessionToken: string | null = null

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    if (!token || !token.startsWith('bp_pat_')) {
      return NextResponse.json({
        success: false,
        error: "Invalid Botpress token format. Should start with 'bp_pat_'"
      })
    }

    // Validate token against Botpress API
    const response = await fetch("https://api.botpress.cloud/v1/chat/users", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `Token validation failed: ${response.status} ${response.statusText}`
      })
    }

    // Store token for this session
    sessionToken = token
    
    return NextResponse.json({
      success: true,
      message: "Token validated and stored successfully"
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to process token",
      details: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

export async function GET() {
  return NextResponse.json({
    hasToken: !!sessionToken,
    tokenPrefix: sessionToken ? sessionToken.substring(0, 10) + "..." : null
  })
}

// Export the token for use in other services
export function getStoredToken(): string | null {
  return sessionToken
}
