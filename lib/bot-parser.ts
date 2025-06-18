import yaml from "js-yaml"

export interface NormalizedIntent {
  name: string
  description?: string
  utterances: string[]
  responses: string[]
  entities: string[]
  confidence?: number
}

export interface NormalizedBot {
  name: string
  platform: string
  version?: string
  language?: string
  intents: NormalizedIntent[]
  entities: Array<{
    name: string
    type: string
    values: string[]
  }>
  metadata: {
    totalIntents: number
    totalUtterances: number
    totalResponses: number
    complexity: "low" | "medium" | "high"
    domain: string
  }
}

export interface BotParseResult {
  success: boolean
  bot?: NormalizedBot
  errors: string[]
  warnings: string[]
}

export class BotParser {
  private static instance: BotParser

  public static getInstance(): BotParser {
    if (!BotParser.instance) {
      BotParser.instance = new BotParser()
    }
    return BotParser.instance
  }

  async parseFile(file: File): Promise<BotParseResult> {
    try {
      const content = await this.readFileContent(file)
      const extension = file.name.split(".").pop()?.toLowerCase()

      switch (extension) {
        case "json":
          return this.parseJSON(content, file.name)
        case "yaml":
        case "yml":
          return this.parseYAML(content, file.name)
        case "bot":
          return this.parseBotFramework(content, file.name)
        case "zip":
          return this.parseZipFile(file)
        default:
          return this.parseText(content, file.name)
      }
    } catch (error) {
      return {
        success: false,
        errors: [`Failed to parse file: ${error instanceof Error ? error.message : "Unknown error"}`],
        warnings: [],
      }
    }
  }

  private async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  private parseJSON(content: string, filename: string): BotParseResult {
    try {
      const data = JSON.parse(content)

      // Detect platform and parse accordingly
      if (data.activities || data.schema) {
        return this.parseBotFrameworkJSON(data, filename)
      } else if (data.intents || data.entities) {
        return this.parseDialogflowJSON(data, filename)
      } else if (data.topics || data.variables) {
        return this.parsePowerVirtualAgentsJSON(data, filename)
      } else {
        return this.parseGenericJSON(data, filename)
      }
    } catch (error) {
      return {
        success: false,
        errors: [`Invalid JSON format: ${error instanceof Error ? error.message : "Parse error"}`],
        warnings: [],
      }
    }
  }

  private parseYAML(content: string, filename: string): BotParseResult {
    try {
      const data = yaml.load(content) as any
      return this.parseGenericStructure(data, filename, "YAML")
    } catch (error) {
      return {
        success: false,
        errors: [`Invalid YAML format: ${error instanceof Error ? error.message : "Parse error"}`],
        warnings: [],
      }
    }
  }

  private parseBotFrameworkJSON(data: any, filename: string): BotParseResult {
    const warnings: string[] = []
    const errors: string[] = []

    try {
      const intents: NormalizedIntent[] = []
      const entities: Array<{ name: string; type: string; values: string[] }> = []

      // Extract intents from activities
      if (data.activities) {
        data.activities.forEach((activity: any, index: number) => {
          if (activity.type === "message") {
            const intent: NormalizedIntent = {
              name: activity.name || `Intent_${index}`,
              description: activity.description,
              utterances: this.extractUtterances(activity),
              responses: this.extractResponses(activity),
              entities: this.extractEntityReferences(activity),
            }
            intents.push(intent)
          }
        })
      }

      // Extract entities
      if (data.entities) {
        Object.entries(data.entities).forEach(([name, entityData]: [string, any]) => {
          entities.push({
            name,
            type: entityData.type || "simple",
            values: entityData.values || [],
          })
        })
      }

      const bot: NormalizedBot = {
        name: data.name || filename,
        platform: "Microsoft Bot Framework",
        version: data.version,
        language: data.language || "en",
        intents,
        entities,
        metadata: this.calculateMetadata(intents, "Bot Framework"),
      }

      return { success: true, bot, errors, warnings }
    } catch (error) {
      errors.push(`Bot Framework parsing error: ${error instanceof Error ? error.message : "Unknown error"}`)
      return { success: false, errors, warnings }
    }
  }

  private parseDialogflowJSON(data: any, filename: string): BotParseResult {
    const warnings: string[] = []
    const errors: string[] = []

    try {
      const intents: NormalizedIntent[] = []
      const entities: Array<{ name: string; type: string; values: string[] }> = []

      // Parse Dialogflow intents
      if (data.intents) {
        data.intents.forEach((intentData: any) => {
          const intent: NormalizedIntent = {
            name: intentData.name || intentData.displayName,
            description: intentData.description,
            utterances:
              intentData.trainingPhrases?.map(
                (phrase: any) => phrase.parts?.map((part: any) => part.text).join("") || phrase.text,
              ) || [],
            responses:
              intentData.responses?.map(
                (response: any) => response.text?.text?.[0] || response.text || response.message,
              ) || [],
            entities: this.extractDialogflowEntities(intentData),
          }
          intents.push(intent)
        })
      }

      // Parse Dialogflow entities
      if (data.entities) {
        data.entities.forEach((entityData: any) => {
          entities.push({
            name: entityData.name || entityData.displayName,
            type: entityData.kind || "KIND_MAP",
            values: entityData.entries?.map((entry: any) => entry.value) || [],
          })
        })
      }

      const bot: NormalizedBot = {
        name: data.displayName || filename,
        platform: "Google Dialogflow",
        version: data.version,
        language: data.defaultLanguageCode || "en",
        intents,
        entities,
        metadata: this.calculateMetadata(intents, "Dialogflow"),
      }

      return { success: true, bot, errors, warnings }
    } catch (error) {
      errors.push(`Dialogflow parsing error: ${error instanceof Error ? error.message : "Unknown error"}`)
      return { success: false, errors, warnings }
    }
  }

  private parsePowerVirtualAgentsJSON(data: any, filename: string): BotParseResult {
    const warnings: string[] = []
    const errors: string[] = []

    try {
      const intents: NormalizedIntent[] = []
      const entities: Array<{ name: string; type: string; values: string[] }> = []

      // Parse PVA topics as intents
      if (data.topics) {
        data.topics.forEach((topic: any) => {
          const intent: NormalizedIntent = {
            name: topic.name || topic.displayName,
            description: topic.description,
            utterances: topic.triggerPhrases || [],
            responses: this.extractPVAResponses(topic),
            entities: this.extractPVAEntities(topic),
          }
          intents.push(intent)
        })
      }

      // Parse PVA variables as entities
      if (data.variables) {
        data.variables.forEach((variable: any) => {
          entities.push({
            name: variable.name,
            type: variable.type || "string",
            values: variable.possibleValues || [],
          })
        })
      }

      const bot: NormalizedBot = {
        name: data.name || filename,
        platform: "Microsoft Power Virtual Agents",
        version: data.schemaVersion,
        language: data.language || "en-US",
        intents,
        entities,
        metadata: this.calculateMetadata(intents, "Power Virtual Agents"),
      }

      return { success: true, bot, errors, warnings }
    } catch (error) {
      errors.push(`Power Virtual Agents parsing error: ${error instanceof Error ? error.message : "Unknown error"}`)
      return { success: false, errors, warnings }
    }
  }

  private parseGenericJSON(data: any, filename: string): BotParseResult {
    return this.parseGenericStructure(data, filename, "Generic JSON")
  }

  private parseGenericStructure(data: any, filename: string, platform: string): BotParseResult {
    const warnings: string[] = []
    const errors: string[] = []

    try {
      const intents: NormalizedIntent[] = []
      const entities: Array<{ name: string; type: string; values: string[] }> = []

      // Try to extract intents from various possible structures
      const intentSources = [
        data.intents,
        data.topics,
        data.skills,
        data.actions,
        Object.values(data).find((val) => Array.isArray(val) && val.length > 0),
      ].filter(Boolean)

      if (intentSources.length > 0) {
        const intentData = intentSources[0] as any[]
        intentData.forEach((item: any, index: number) => {
          const intent: NormalizedIntent = {
            name: item.name || item.intent || item.topic || `Intent_${index}`,
            description: item.description || item.desc,
            utterances: this.extractGenericUtterances(item),
            responses: this.extractGenericResponses(item),
            entities: this.extractGenericEntities(item),
          }
          intents.push(intent)
        })
      }

      if (intents.length === 0) {
        warnings.push("No intents found in the file. Attempting to create a single intent from content.")
        intents.push({
          name: "ExtractedContent",
          utterances: ["user input"],
          responses: [JSON.stringify(data).substring(0, 200) + "..."],
          entities: [],
        })
      }

      const bot: NormalizedBot = {
        name: data.name || filename,
        platform,
        intents,
        entities,
        metadata: this.calculateMetadata(intents, platform),
      }

      return { success: true, bot, errors, warnings }
    } catch (error) {
      errors.push(`Generic parsing error: ${error instanceof Error ? error.message : "Unknown error"}`)
      return { success: false, errors, warnings }
    }
  }

  private parseBotFramework(content: string, filename: string): BotParseResult {
    // .bot files are typically JSON
    return this.parseJSON(content, filename)
  }

  private parseZipFile(file: File): Promise<BotParseResult> {
    // For now, return an error - ZIP parsing would require additional libraries
    return Promise.resolve({
      success: false,
      errors: ["ZIP file parsing not yet implemented. Please extract and upload individual files."],
      warnings: [],
    })
  }

  private parseText(content: string, filename: string): BotParseResult {
    const warnings: string[] = []

    // Try to detect if it's actually JSON or YAML
    try {
      const jsonData = JSON.parse(content)
      warnings.push("File detected as JSON despite extension")
      return this.parseGenericJSON(jsonData, filename)
    } catch {
      try {
        const yamlData = yaml.load(content)
        warnings.push("File detected as YAML despite extension")
        return this.parseGenericStructure(yamlData, filename, "YAML")
      } catch {
        // Treat as plain text and extract basic information
        const lines = content.split("\n").filter((line) => line.trim())
        const intent: NormalizedIntent = {
          name: "TextContent",
          utterances: lines.slice(0, 10), // First 10 lines as utterances
          responses: ["Extracted from text file"],
          entities: [],
        }

        const bot: NormalizedBot = {
          name: filename,
          platform: "Text File",
          intents: [intent],
          entities: [],
          metadata: this.calculateMetadata([intent], "Text"),
        }

        return { success: true, bot, errors: [], warnings }
      }
    }
  }

  // Helper methods for extracting data from different formats
  private extractUtterances(data: any): string[] {
    const sources = [data.utterances, data.examples, data.trainingPhrases, data.triggerPhrases, data.patterns]

    for (const source of sources) {
      if (Array.isArray(source)) {
        return source.map((item) => (typeof item === "string" ? item : item.text || item.value || String(item)))
      }
    }

    return []
  }

  private extractResponses(data: any): string[] {
    const sources = [data.responses, data.replies, data.messages, data.outputs]

    for (const source of sources) {
      if (Array.isArray(source)) {
        return source.map((item) => (typeof item === "string" ? item : item.text || item.message || String(item)))
      }
    }

    return []
  }

  private extractEntityReferences(data: any): string[] {
    const entities: string[] = []
    const content = JSON.stringify(data)

    // Look for common entity patterns
    const patterns = [
      /@(\w+)/g, // @entityName
      /\{(\w+)\}/g, // {entityName}
      /\$(\w+)/g, // $entityName
    ]

    patterns.forEach((pattern) => {
      const matches = content.match(pattern)
      if (matches) {
        entities.push(...matches.map((match) => match.replace(/[@{}$]/g, "")))
      }
    })

    return [...new Set(entities)]
  }

  private extractDialogflowEntities(intentData: any): string[] {
    const entities: string[] = []

    if (intentData.parameters) {
      entities.push(...intentData.parameters.map((param: any) => param.name || param.displayName))
    }

    if (intentData.trainingPhrases) {
      intentData.trainingPhrases.forEach((phrase: any) => {
        if (phrase.parts) {
          phrase.parts.forEach((part: any) => {
            if (part.entityType) {
              entities.push(part.entityType)
            }
          })
        }
      })
    }

    return [...new Set(entities)]
  }

  private extractPVAResponses(topic: any): string[] {
    const responses: string[] = []

    if (topic.nodes) {
      topic.nodes.forEach((node: any) => {
        if (node.kind === "SendMessage" && node.message) {
          responses.push(node.message)
        }
      })
    }

    return responses
  }

  private extractPVAEntities(topic: any): string[] {
    const entities: string[] = []

    if (topic.nodes) {
      topic.nodes.forEach((node: any) => {
        if (node.kind === "Question" && node.variable) {
          entities.push(node.variable.name)
        }
      })
    }

    return [...new Set(entities)]
  }

  private extractGenericUtterances(item: any): string[] {
    return this.extractUtterances(item)
  }

  private extractGenericResponses(item: any): string[] {
    return this.extractResponses(item)
  }

  private extractGenericEntities(item: any): string[] {
    return this.extractEntityReferences(item)
  }

  private calculateMetadata(intents: NormalizedIntent[], platform: string): NormalizedBot["metadata"] {
    const totalUtterances = intents.reduce((sum, intent) => sum + intent.utterances.length, 0)
    const totalResponses = intents.reduce((sum, intent) => sum + intent.responses.length, 0)

    let complexity: "low" | "medium" | "high" = "low"
    if (intents.length > 10 || totalUtterances > 50) complexity = "medium"
    if (intents.length > 20 || totalUtterances > 100) complexity = "high"

    const domain = this.inferDomain(intents)

    return {
      totalIntents: intents.length,
      totalUtterances,
      totalResponses,
      complexity,
      domain,
    }
  }

  private inferDomain(intents: NormalizedIntent[]): string {
    const allText = intents
      .map((intent) => `${intent.name} ${intent.utterances.join(" ")} ${intent.responses.join(" ")}`)
      .join(" ")
      .toLowerCase()

    if (
      allText.includes("leave") ||
      allText.includes("vacation") ||
      allText.includes("hr") ||
      allText.includes("employee")
    ) {
      return "HR"
    } else if (
      allText.includes("password") ||
      allText.includes("technical") ||
      allText.includes("support") ||
      allText.includes("it")
    ) {
      return "IT"
    } else if (
      allText.includes("sales") ||
      allText.includes("pricing") ||
      allText.includes("demo") ||
      allText.includes("lead")
    ) {
      return "Sales"
    } else if (allText.includes("customer") || allText.includes("order") || allText.includes("billing")) {
      return "Customer Service"
    }

    return "General"
  }
}
