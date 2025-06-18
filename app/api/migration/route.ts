import { NextRequest, NextResponse } from 'next/server'
import { CopilotStudioMigration, ClassicBot } from '@/lib/copilot-studio-migration'

export async function POST(request: NextRequest) {
  try {
    const { sourceBotId, agentName } = await request.json()

    if (!sourceBotId || !agentName) {
      return NextResponse.json(
        { error: 'Source bot ID and agent name are required' },
        { status: 400 }
      )
    }

    const migration = CopilotStudioMigration.getInstance()
    const classicBots = migration.getMockClassicBots()
    const sourceBot = classicBots.find(bot => bot.id === sourceBotId)

    if (!sourceBot) {
      return NextResponse.json(
        { error: 'Source bot not found' },
        { status: 404 }
      )
    }

    // Start the migration process
    const migrationFlow = await migration.startMigration(sourceBot, agentName)

    return NextResponse.json({
      success: true,
      migrationFlow,
      message: 'Migration started successfully'
    })

  } catch (error) {
    console.error('Migration API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const migration = CopilotStudioMigration.getInstance()
    const classicBots = migration.getMockClassicBots()

    return NextResponse.json({
      success: true,
      classicBots,
      message: 'Classic bots retrieved successfully'
    })

  } catch (error) {
    console.error('Migration API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 