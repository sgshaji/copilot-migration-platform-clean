
export class DeploymentStatusService {
  static getDeploymentStatus() {
    const botpressToken = process.env.BOTPRESS_TOKEN
    const hasValidToken = botpressToken && botpressToken.length > 20

    return {
      currentStatus: hasValidToken ? "Live Hosting" : "Demo Mode",
      hostingProvider: hasValidToken ? "Botpress Cloud" : "Replit + Demo Backend",
      isFullyDeployed: hasValidToken,
      urls: {
        webhookBase: process.env.REPL_SLUG 
          ? `https://${process.env.REPL_SLUG}-${process.env.REPL_OWNER}.replit.dev`
          : "http://localhost:3001",
        botpressCloud: hasValidToken ? "https://cloud.botpress.com" : null
      },
      upgradeInstructions: hasValidToken ? null : {
        steps: [
          "1. Sign up for Botpress Cloud (free tier available)",
          "2. Create a new bot in Botpress dashboard", 
          "3. Go to Settings → API Keys → Generate new key",
          "4. Add the key to Replit Secrets as BOTPRESS_TOKEN",
          "5. Re-run migration - it will deploy to real Botpress Cloud"
        ],
        benefits: [
          "🌐 Real cloud hosting (not demo)",
          "📊 Analytics and monitoring dashboard",
          "🔗 Built-in integrations (Slack, Teams, WhatsApp)",
          "⚡ Auto-scaling and high availability",
          "🛡️ Enterprise security and compliance"
        ]
      }
    }
  }

  static async validateBotpressToken(token: string): Promise<{
    valid: boolean
    error?: string
    userInfo?: any
  }> {
    try {
      const response = await fetch('https://api.botpress.cloud/v1/admin/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const userInfo = await response.json()
        return { valid: true, userInfo }
      } else {
        const error = await response.text()
        return { valid: false, error: `API Error: ${response.status} - ${error}` }
      }
    } catch (error) {
      return { 
        valid: false, 
        error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }
    }
  }
}
