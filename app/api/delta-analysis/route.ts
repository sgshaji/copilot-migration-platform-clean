import { NextResponse } from 'next/server'
import { classicBots, migratedAgents } from '@/lib/delta-demo-data'

export async function GET(request: Request) {
  // Get classicId from query params
  const url = new URL(request.url)
  const classicId = url.searchParams.get('classicId')
  let classic = classicBots[0]
  let agent = migratedAgents[0]

  if (classicId) {
    const idx = classicBots.findIndex(bot => bot.id === classicId)
    if (idx !== -1) {
      classic = classicBots[idx]
      agent = migratedAgents[idx] || migratedAgents[0]
    }
  }

  // Rule-based comparison
  const newSkills = agent.skills.filter(skill => !classic.intents.includes(skill))
  const newIntegrations = agent.integrations.filter(i => !classic.integrations.includes(i))
  const newCapabilities = agent.newCapabilities || []

  // Prepare delta object
  const delta = {
    newSkills,
    newIntegrations,
    newCapabilities
  }

  // LLM-powered summary (if OpenAI key is set)
  let llmSummary = null
  if (process.env.OPENAI_API_KEY) {
    try {
      const prompt = `Compare the following classic bot and migrated agent. List the new skills, integrations, and capabilities, and summarize the business value in 2-3 sentences.\n\nClassic Bot: ${JSON.stringify(classic, null, 2)}\n\nMigrated Agent: ${JSON.stringify(agent, null, 2)}\n\nDelta: ${JSON.stringify(delta, null, 2)}`
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are an expert AI migration analyst.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 256
        })
      })
      const data = await response.json()
      llmSummary = data.choices?.[0]?.message?.content || null
    } catch (err) {
      llmSummary = 'LLM summary unavailable.'
    }
  }

  return NextResponse.json({
    classic,
    agent,
    delta,
    llmSummary
  })
} 