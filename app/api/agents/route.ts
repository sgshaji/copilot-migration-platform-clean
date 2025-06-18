import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database-service'
import { AgenticAIEngine } from '@/lib/agentic-ai-engine'
import { ReplitAgentHostingService } from "../../../lib/replit-agent-hosting"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Expecting: { name, description, config }
    const { name, description, config } = body
    const { data, error } = await supabase.from('agents').insert([
      { name, description, config: JSON.stringify(config), createdAt: new Date().toISOString(), status: 'active', type: 'agentic' }
    ]).select()
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true, agent: data[0] })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create agent' }, { status: 500 })
  }
}

export async function GET() {
  const { data: agents, error } = await supabase.from('agents').select('*')
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true, agents })
}