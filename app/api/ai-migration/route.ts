import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { action, sourceBot, agentName } = await request.json()

    switch (action) {
      case 'createAgent':
        const agent = await createRealAgent(sourceBot, agentName)
        return NextResponse.json({ success: true, agent })

      case 'generateDescription':
        const description = await generateAgentDescription(sourceBot, agentName)
        return NextResponse.json({ success: true, description })

      case 'analyzeCapabilities':
        const capabilities = await analyzeCapabilities(sourceBot)
        return NextResponse.json({ success: true, capabilities })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('AI Migration API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function createRealAgent(sourceBot: any, agentName: string) {
  const { description, descriptionSource } = await generateAgentDescription(sourceBot, agentName)
  const capabilities = await analyzeCapabilities(sourceBot)
  const extensions = configureMicrosoftExtensions(sourceBot)

  const agent = {
    id: generateId(),
    name: agentName,
    description,
    descriptionSource,
    model: 'gpt-4-turbo',
    capabilities,
    extensions,
    status: 'draft',
    deploymentUrl: `https://copilot.microsoft.com/agents/${generateId()}`,
    createdAt: new Date().toISOString(),
    type: 'agentic',
    config: {} // Add config if needed
  }

  // Insert into Supabase
  const { data, error } = await supabase.from('agents').insert([
    {
      name: agent.name,
      description: agent.description,
      config: agent.config,
      createdat: agent.createdAt,
      status: agent.status,
      type: agent.type
    }
  ])
  if (error) {
    throw new Error('Failed to insert agent into Supabase: ' + error.message)
  }

  return agent
}

async function generateAgentDescription(sourceBot: any, agentName: string): Promise<{ description: string, descriptionSource: string }> {
  try {
    const prompt = `Generate a professional description for a Microsoft Copilot Studio AI agent named "${agentName}" that was migrated from a classic chatbot with the following characteristics:
    
    Source Bot: ${sourceBot.name}
    Description: ${sourceBot.description}
    Topics: ${sourceBot.topics?.length || 0} topics
    Entities: ${sourceBot.entities?.length || 0} entities
    Power Automate Flows: ${sourceBot.powerAutomateFlows?.length || 0} flows
    
    The description should be:
    - Professional and enterprise-focused
    - Highlight AI capabilities and Microsoft integration
    - Mention specific use cases and benefits
    - 2-3 sentences maximum
    
    Generate only the description, no additional text.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.7
    })

    return {
      description: completion.choices[0]?.message?.content || `AI-powered ${agentName} migrated from ${sourceBot.name}`,
      descriptionSource: 'openai'
    }
  } catch (error) {
    console.error('Error generating description:', error)
    return {
      description: `AI-powered ${agentName} with Microsoft Copilot Studio capabilities`,
      descriptionSource: 'fallback'
    }
  }
}

async function analyzeCapabilities(sourceBot: any) {
  return [
    {
      id: 'conv-1',
      name: 'Intelligent Conversations',
      description: 'Advanced natural language processing with context awareness',
      type: 'conversation',
      enabled: true,
      examples: [
        'Multi-turn conversations with memory',
        'Context-aware responses',
        'Natural language understanding',
        'Intent recognition and classification'
      ]
    },
    {
      id: 'auto-1',
      name: 'Workflow Automation',
      description: 'Automate business processes and workflows',
      type: 'automation',
      enabled: true,
      examples: [
        'Create and manage tickets',
        'Process approvals and requests',
        'Generate reports and summaries',
        'Trigger Power Automate flows'
      ]
    },
    {
      id: 'int-1',
      name: 'Microsoft 365 Integration',
      description: 'Seamless integration with Microsoft 365 services',
      type: 'integration',
      enabled: true,
      examples: [
        'Access Teams, Outlook, and Calendar',
        'Read and write SharePoint documents',
        'Manage OneDrive files',
        'Interact with Power Platform'
      ]
    },
    {
      id: 'anal-1',
      name: 'Data Analysis & Insights',
      description: 'Analyze data and provide actionable insights',
      type: 'analysis',
      enabled: true,
      examples: [
        'Analyze conversation patterns',
        'Generate performance reports',
        'Identify trends and anomalies',
        'Provide recommendations'
      ]
    }
  ]
}

function configureMicrosoftExtensions(sourceBot: any) {
  return [
    {
      id: 'teams-ext',
      name: 'Microsoft Teams',
      type: 'teams',
      description: 'Full Teams integration for meetings, chats, and collaboration',
      enabled: true,
      configuration: {
        appId: process.env.TEAMS_APP_ID,
        tenantId: process.env.TENANT_ID,
        permissions: ['Chat.ReadWrite', 'Channel.ReadBasic.All', 'Calendars.ReadWrite']
      },
      capabilities: [
        'Schedule Teams meetings',
        'Join existing meetings',
        'Send messages to channels',
        'Create and manage teams',
        'Access team files and documents'
      ]
    },
    {
      id: 'outlook-ext',
      name: 'Microsoft Outlook',
      type: 'outlook',
      description: 'Email and calendar management integration',
      enabled: true,
      configuration: {
        appId: process.env.OUTLOOK_APP_ID,
        tenantId: process.env.TENANT_ID,
        permissions: ['Mail.ReadWrite', 'Calendars.ReadWrite']
      },
      capabilities: [
        'Read and compose emails',
        'Schedule calendar events',
        'Manage meeting invitations',
        'Search email archives',
        'Set up email rules and filters'
      ]
    },
    {
      id: 'sharepoint-ext',
      name: 'SharePoint & OneDrive',
      type: 'sharepoint',
      description: 'Document and file management integration',
      enabled: true,
      configuration: {
        appId: process.env.SHAREPOINT_APP_ID,
        tenantId: process.env.TENANT_ID,
        permissions: ['Files.ReadWrite.All', 'Sites.ReadWrite.All']
      },
      capabilities: [
        'Read and write documents',
        'Search across SharePoint sites',
        'Manage file permissions',
        'Create and organize folders',
        'Collaborate on documents in real-time'
      ]
    },
    {
      id: 'power-automate-ext',
      name: 'Power Automate',
      type: 'power-automate',
      description: 'Workflow automation and business process integration',
      enabled: true,
      configuration: {
        appId: process.env.POWER_AUTOMATE_APP_ID,
        tenantId: process.env.TENANT_ID,
        permissions: ['Workflow.ReadWrite.All']
      },
      capabilities: [
        'Trigger automated workflows',
        'Process approval requests',
        'Send notifications and alerts',
        'Integrate with external systems',
        'Monitor workflow execution'
      ]
    }
  ]
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
} 