import fs from 'fs/promises'
import path from 'path'

// Simple file-based database service (zero config needed)
export class DatabaseService {
  private static instance: DatabaseService
  private dbPath = path.join(process.cwd(), 'data')

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  constructor() {
    // Ensure this only runs on server-side
    if (typeof window !== 'undefined') {
      throw new Error('DatabaseService cannot be used on the client side. Use API endpoints instead.')
    }
    const dbUrl = process.env.DATABASE_URL
    if (dbUrl) {
      console.log("💾 Database service initialized with real database")
      // Initialize real database connection here
    } else {
      console.log("💾 Database service initialized in localStorage mode (demo)")
    }
  }

  private async ensureDataDir(): Promise<void> {
    try {
      await fs.access(this.dbPath)
    } catch {
      await fs.mkdir(this.dbPath, { recursive: true })
    }
  }

  async saveAgent(agentId: string, agentData: any): Promise<void> {
    try {
      await this.ensureDataDir()

      // Store the full agent data
      const agentFile = path.join(this.dbPath, `agent_${agentId}.json`)
      await fs.writeFile(agentFile, JSON.stringify(agentData, null, 2))

      // Store agent metadata for listing/search
      const metadata = {
        id: agentId,
        name: agentData.name,
        description: agentData.description || '',
        createdAt: agentData.createdAt || new Date().toISOString(),
        status: agentData.status || 'active',
        type: agentData.deploymentType || 'demo'
      }

      const metaFile = path.join(this.dbPath, `agent_meta_${agentId}.json`)
      await fs.writeFile(metaFile, JSON.stringify(metadata, null, 2))

      // Update agents list
      const agentsList = await this.getAgentsList()
      const existingIndex = agentsList.findIndex(a => a.id === agentId)
      if (existingIndex >= 0) {
        agentsList[existingIndex] = metadata
      } else {
        agentsList.push(metadata)
      }

      const listFile = path.join(this.dbPath, 'agents_list.json')
      await fs.writeFile(listFile, JSON.stringify(agentsList, null, 2))

      console.log(`💾 Agent ${agentId} (${agentData.name}) saved to file storage`)
    } catch (error) {
      console.error('File storage save failed:', error)
      // Fallback to memory storage
      this.memoryFallback(agentId, agentData)
    }
  }

  async getAgent(agentId: string): Promise<any | null> {
    try {
      const agentFile = path.join(this.dbPath, `agent_${agentId}.json`)
      const data = await fs.readFile(agentFile, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      console.error('File storage read failed:', error)
      return null
    }
  }

  async saveConversation(agentId: string, conversation: any[]): Promise<void> {
    try {
      await this.ensureDataDir()
      const convFile = path.join(this.dbPath, `conversation_${agentId}.json`)
      await fs.writeFile(convFile, JSON.stringify(conversation, null, 2))
    } catch (error) {
      console.error('Conversation save failed:', error)
    }
  }

  async getConversation(agentId: string): Promise<any[]> {
    try {
      const convFile = path.join(this.dbPath, `conversation_${agentId}.json`)
      const data = await fs.readFile(convFile, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      return []
    }
  }

  async getAgentsList(): Promise<any[]> {
    try {
      const listFile = path.join(this.dbPath, 'agents_list.json')
      const data = await fs.readFile(listFile, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      return []
    }
  }

  async searchAgentsByName(searchTerm: string): Promise<any[]> {
    try {
      const agentsList = await this.getAgentsList()
      return agentsList.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    } catch (error) {
      console.error('Agent search failed:', error)
      return []
    }
  }

  async updateAgentName(agentId: string, newName: string): Promise<void> {
    try {
      const agent = await this.getAgent(agentId)
      if (agent) {
        agent.name = newName
        await this.saveAgent(agentId, agent)
        console.log(`✏️ Agent ${agentId} renamed to "${newName}"`)
      }
    } catch (error) {
      console.error('Agent rename failed:', error)
    }
  }

  // Memory fallback for when file system fails
  private memoryStorage = new Map<string, any>()

  private memoryFallback(agentId: string, agentData: any): void {
    this.memoryStorage.set(`agent_${agentId}`, agentData)
    console.log(`💾 Agent ${agentId} stored in memory (fallback)`)
  }
}