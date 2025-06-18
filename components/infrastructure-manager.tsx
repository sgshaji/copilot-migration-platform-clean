'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Server, 
  Database, 
  Brain, 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Play,
  RefreshCw,
  ExternalLink,
  Zap,
  Shield,
  Globe,
  Activity
} from 'lucide-react'

interface InfrastructureStatus {
  hosting: {
    status: 'active' | 'deploying' | 'error'
    url: string
    lastDeployed: string
  }
  database: {
    status: 'connected' | 'connecting' | 'error'
    tables: string[]
    lastBackup: string
  }
  ai: {
    status: 'active' | 'inactive' | 'error'
    model: string
    requestsToday: number
  }
  monitoring: {
    status: 'active' | 'inactive' | 'error'
    eventsToday: number
    uptime: string
  }
}

interface FreeTierLimits {
  hosting: {
    bandwidth: string
    buildMinutes: string
    serverlessFunctions: string
  }
  database: {
    storage: string
    bandwidth: string
    connections: string
  }
  ai: {
    requests: string
    tokens: string
  }
  monitoring: {
    events: string
    retention: string
  }
}

export default function InfrastructureManager() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [status, setStatus] = useState<InfrastructureStatus | null>(null)
  const [freeTierLimits, setFreeTierLimits] = useState<FreeTierLimits | null>(null)
  const [deploymentUrl, setDeploymentUrl] = useState('')
  const [instructions, setInstructions] = useState<string[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    checkInfrastructureStatus()
  }, [])

  const checkInfrastructureStatus = async () => {
    try {
      const response = await fetch('/api/infrastructure/initialize', {
        method: 'GET'
      })
      
      if (response.ok) {
        const data = await response.json()
        setStatus(data.data.status)
        setFreeTierLimits(data.data.freeTierLimits)
      }
    } catch (error) {
      console.error('Failed to check infrastructure status:', error)
    }
  }

  const initializeInfrastructure = async () => {
    setIsInitializing(true)
    setError('')
    setInstructions([])
    
    try {
      const response = await fetch('/api/infrastructure/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setStatus(data.data.status)
        setDeploymentUrl(data.data.deploymentUrl)
        setInstructions(data.data.instructions)
        setFreeTierLimits(data.data.freeTierInfo)
      } else {
        setError(data.error || 'Infrastructure initialization failed')
      }
    } catch (error) {
      setError('Failed to initialize infrastructure')
      console.error('Infrastructure initialization error:', error)
    } finally {
      setIsInitializing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'deploying':
      case 'connecting':
        return <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'inactive':
        return <AlertCircle className="w-5 h-5 text-gray-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
        return 'bg-green-100 text-green-800'
      case 'deploying':
      case 'connecting':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white text-2xl">
          <Server className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Production Infrastructure Manager
          </h2>
          <p className="text-xl text-gray-600 mt-2">
            Deploy your Copilot agents with <strong>free tier infrastructure</strong>
          </p>
        </div>
      </div>

      {/* Free Tier Overview */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Zap className="w-5 h-5" />
            Free Tier Infrastructure
          </CardTitle>
          <CardDescription className="text-green-700">
            Zero-cost production deployment with generous free limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border border-green-200">
              <Globe className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-sm font-semibold text-gray-900">Vercel Hosting</div>
              <div className="text-xs text-gray-600">100GB bandwidth</div>
              <div className="text-xs text-gray-600">6000 build minutes</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-green-200">
              <Database className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-sm font-semibold text-gray-900">Supabase DB</div>
              <div className="text-xs text-gray-600">500MB storage</div>
              <div className="text-xs text-gray-600">2GB bandwidth</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-green-200">
              <Brain className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-sm font-semibold text-gray-900">OpenAI AI</div>
              <div className="text-xs text-gray-600">3 req/min</div>
              <div className="text-xs text-gray-600">4000 tokens</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-green-200">
              <BarChart3 className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-sm font-semibold text-gray-900">Analytics</div>
              <div className="text-xs text-gray-600">100k events</div>
              <div className="text-xs text-gray-600">30 days retention</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Infrastructure Status */}
      {status && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Infrastructure Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-semibold">Hosting</div>
                    <div className="text-sm text-gray-600">Vercel</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.hosting.status)}
                  <Badge className={getStatusColor(status.hosting.status)}>
                    {status.hosting.status}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-purple-500" />
                  <div>
                    <div className="font-semibold">Database</div>
                    <div className="text-sm text-gray-600">Supabase</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.database.status)}
                  <Badge className={getStatusColor(status.database.status)}>
                    {status.database.status}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="font-semibold">AI Services</div>
                    <div className="text-sm text-gray-600">OpenAI</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.ai.status)}
                  <Badge className={getStatusColor(status.ai.status)}>
                    {status.ai.status}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-semibold">Monitoring</div>
                    <div className="text-sm text-gray-600">Analytics</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.monitoring.status)}
                  <Badge className={getStatusColor(status.monitoring.status)}>
                    {status.monitoring.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deployment URL */}
      {deploymentUrl && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <ExternalLink className="w-5 h-5" />
              Live Deployment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-sm font-semibold text-blue-900">Production URL</div>
                <div className="text-lg text-blue-700 font-mono">{deploymentUrl}</div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => window.open(deploymentUrl, '_blank')}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Site
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {instructions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Deployment Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{instruction}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <XCircle className="w-5 h-5" />
              <span className="font-semibold">Error:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button 
          onClick={initializeInfrastructure}
          disabled={isInitializing}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        >
          {isInitializing ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Initializing...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Initialize Infrastructure
            </>
          )}
        </Button>
        
        <Button 
          onClick={checkInfrastructureStatus}
          variant="outline"
          size="lg"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Check Status
        </Button>
      </div>

      {/* Progress Bar */}
      {isInitializing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Initializing production infrastructure...</span>
                <span>Please wait</span>
              </div>
              <Progress value={75} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 