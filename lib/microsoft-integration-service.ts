
import { MicrosoftGraphService } from "./microsoft-graph-service"

export class MicrosoftIntegrationService {
  private static instance: MicrosoftIntegrationService
  private graphService: MicrosoftGraphService

  public static getInstance(): MicrosoftIntegrationService {
    if (!MicrosoftIntegrationService.instance) {
      MicrosoftIntegrationService.instance = new MicrosoftIntegrationService()
    }
    return MicrosoftIntegrationService.instance
  }

  constructor() {
    this.graphService = MicrosoftGraphService.getInstance()
    console.log("🔗 Microsoft Integration Service initialized")
    console.log("📝 Usage of Microsoft keys:")
    console.log("   - MICROSOFT_CLIENT_ID: OAuth app registration")
    console.log("   - MICROSOFT_CLIENT_SECRET: App authentication")
    console.log("   - Used for: Graph API, Teams integration, Calendar access")
    console.log("   - Copilot Studio: Uses separate licensing (M365 Business+)")
  }

  async validateCopilotStudioAccess(): Promise<{
    hasAccess: boolean
    licenseType: string
    requiredLicenses: string[]
  }> {
    // Check if user has required Microsoft licenses for Copilot Studio
    const clientId = process.env.MICROSOFT_CLIENT_ID
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return {
        hasAccess: false,
        licenseType: "None",
        requiredLicenses: [
          "Microsoft 365 Business Premium",
          "Microsoft Copilot Studio License",
          "Power Platform Premium (for connectors)"
        ]
      }
    }

    // In real implementation, this would check actual licenses via Graph API
    return {
      hasAccess: true,
      licenseType: "Microsoft 365 Business Premium",
      requiredLicenses: []
    }
  }

  async getCopilotStudioDeploymentInstructions(agentConfig: any): Promise<{
    steps: string[]
    microsoftAppsRequired: string[]
    estimatedCost: string
  }> {
    return {
      steps: [
        "🔑 Authenticate with your Microsoft work account",
        "🏢 Navigate to Microsoft Copilot Studio (copilotstudio.microsoft.com)",
        "🤖 Create new Copilot agent",
        "📊 Import configuration from Botpress export",
        "🔗 Connect to Microsoft Graph API using your credentials",
        "⚙️ Configure Power Platform connectors",
        "📱 Deploy to Microsoft Teams channels",
        "🛡️ Set up governance and compliance policies"
      ],
      microsoftAppsRequired: [
        "Microsoft Copilot Studio",
        "Microsoft Teams",
        "Power Platform Admin Center",
        "Azure Active Directory"
      ],
      estimatedCost: "$20-200/month depending on usage and license tier"
    }
  }

  async getTeamsIntegrationStatus(): Promise<{
    connected: boolean
    channels: string[]
    permissions: string[]
  }> {
    // Real implementation would use Graph API to check Teams access
    return {
      connected: !!process.env.MICROSOFT_CLIENT_ID,
      channels: ["General", "HR Support", "IT Helpdesk"],
      permissions: ["Chat.Read", "ChannelMessage.Send", "User.Read"]
    }
  }
}
