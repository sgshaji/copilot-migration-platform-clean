import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ExternalLink,
  Bot,
  Copy,
  Settings,
  TestTube,
  Rocket,
  Building2,
  Workflow,
  Shield,
  Database,
  MessageSquare,
  Users,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function MigrationDocsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white text-2xl">
          <BookOpen className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Migration Guide
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            Official documentation for migrating classic chatbots
          </p>
        </div>
      </div>

      {/* Quick Start */}
      <Card className="mb-8 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Rocket className="w-5 h-5" />
            Quick Start Migration
          </CardTitle>
          <CardDescription className="text-blue-700">
            Get started with your first migration in minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/migration">
                <Bot className="w-4 h-4 mr-2" />
                Start Migration
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/studio-overview" target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                Official Docs
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Migration Flow */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="w-5 h-5" />
            Official Migration Flow
          </CardTitle>
          <CardDescription>
            Step-by-step process following Microsoft's recommended approach
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Open Your Classic Bot</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Go to Copilot Studio and open the classic chatbot you want to migrate.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Clone and Convert</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      On the Overview page, select "Copy this chatbot" and choose "Copy and convert this bot".
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Name and Create</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Modify the default name if needed and click Create to generate the new AI agent.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Review What's Migrated</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Topics, entities, and Power Automate flows are cloned and linked.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">5</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Reconfigure Settings</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Authorization, channels, and security need manual reconfiguration.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">6</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Go Live</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Test everything and publish your new AI agent to production.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What Gets Migrated */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Copy className="w-5 h-5" />
            What Gets Migrated
          </CardTitle>
          <CardDescription>
            Understanding what content and components are automatically transferred
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Automatically Migrated
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900">Topics</div>
                    <div className="text-sm text-gray-600">Only those built using the web canvas are cloned</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900">Entities</div>
                    <div className="text-sm text-gray-600">Custom entities and synonyms are carried over</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900">Power Automate Flows</div>
                    <div className="text-sm text-gray-600">These are cloned and linked to the new agent's topics</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Manual Reconfiguration Required
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900">Authorization</div>
                    <div className="text-sm text-gray-600">Azure AD, API keys, and OAuth settings</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900">Channels</div>
                    <div className="text-sm text-gray-600">Teams, web chat, mobile, and email channels</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900">Bot Framework Skills</div>
                    <div className="text-sm text-gray-600">Custom skills must be reconnected</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900">Custom Components</div>
                    <div className="text-sm text-gray-600">APIs and external services need re-integration</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Best Practices
          </CardTitle>
          <CardDescription>
            Follow these guidelines for a successful migration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Before Migration</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="text-sm text-gray-600">Backup your classic bot configuration</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="text-sm text-gray-600">Document all custom integrations and APIs</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="text-sm text-gray-600">Identify topics that use code-based logic</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="text-sm text-gray-600">Plan for downtime during migration</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">After Migration</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="text-sm text-gray-600">Test all conversation flows thoroughly</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="text-sm text-gray-600">Verify Power Automate integrations work</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="text-sm text-gray-600">Update deployment pipelines and references</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="text-sm text-gray-600">Monitor performance and user feedback</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Troubleshooting
          </CardTitle>
          <CardDescription>
            Common issues and their solutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-400 pl-4">
              <h4 className="font-semibold text-gray-900">Topics Not Migrating</h4>
              <p className="text-sm text-gray-600 mt-1">
                Only web canvas topics are automatically migrated. Code-based topics need manual recreation.
              </p>
            </div>
            <div className="border-l-4 border-red-400 pl-4">
              <h4 className="font-semibold text-gray-900">Power Automate Errors</h4>
              <p className="text-sm text-gray-600 mt-1">
                Check that all flow connections are properly configured and permissions are set correctly.
              </p>
            </div>
            <div className="border-l-4 border-blue-400 pl-4">
              <h4 className="font-semibold text-gray-900">Channel Connectivity Issues</h4>
              <p className="text-sm text-gray-600 mt-1">
                Reconfigure channel settings in Copilot Studio and verify endpoint URLs are correct.
              </p>
            </div>
            <div className="border-l-4 border-purple-400 pl-4">
              <h4 className="font-semibold text-gray-900">Authentication Problems</h4>
              <p className="text-sm text-gray-600 mt-1">
                Ensure Azure AD app registrations are properly configured with correct redirect URIs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Additional Resources
          </CardTitle>
          <CardDescription>
            Official Microsoft documentation and community resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Official Documentation</h3>
              <div className="space-y-2">
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/studio-overview" target="_blank">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Copilot Studio Overview
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/studio-overview" target="_blank">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Migration Guide
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/studio-overview" target="_blank">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Best Practices
                  </Link>
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Community & Support</h3>
              <div className="space-y-2">
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link href="https://techcommunity.microsoft.com/t5/microsoft-copilot-studio/bd-p/MicrosoftCopilotStudio" target="_blank">
                    <Users className="w-4 h-4 mr-2" />
                    Tech Community
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link href="https://github.com/microsoft/BotFramework-Samples" target="_blank">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    GitHub Samples
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/studio-overview" target="_blank">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Support Forum
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 