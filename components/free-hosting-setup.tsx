'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  ExternalLink, 
  CheckCircle, 
  Copy, 
  Key, 
  Database, 
  Globe, 
  BarChart3,
  Zap,
  ArrowRight,
  Clipboard,
  AlertCircle
} from 'lucide-react'
import { 
  FREE_HOSTING_SETUP, 
  API_SETUP_STEPS, 
  ENVIRONMENT_VARIABLES_TEMPLATE,
  DEPLOYMENT_CHECKLIST 
} from '@/lib/free-hosting-setup'

export default function FreeHostingSetup() {
  const [currentStep, setCurrentStep] = useState(1)
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    supabaseUrl: '',
    supabaseAnonKey: '',
    supabaseServiceKey: ''
  })
  const [copied, setCopied] = useState('')

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(''), 2000)
  }

  const generateEnvFile = () => {
    return ENVIRONMENT_VARIABLES_TEMPLATE
      .replace('sk-your-api-key-here', apiKeys.openai)
      .replace('https://your-project.supabase.co', apiKeys.supabaseUrl)
      .replace('your-anon-key-here', apiKeys.supabaseAnonKey)
      .replace('your-service-role-key-here', apiKeys.supabaseServiceKey)
  }

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed'
    if (stepNumber === currentStep) return 'current'
    return 'pending'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full text-white text-2xl">
          <Zap className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Free Hosting Setup Guide
          </h2>
          <p className="text-xl text-gray-600 mt-2">
            Deploy your app for <strong>$0/month</strong> with real API keys
          </p>
        </div>
      </div>

      {/* Free Tier Overview */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Zap className="w-5 h-5" />
            Free Tier Services
          </CardTitle>
          <CardDescription className="text-green-700">
            All services are completely free with generous limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <h4 className="font-semibold text-gray-900">Vercel Hosting</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                {FREE_HOSTING_SETUP.hosting.freeTierLimits.slice(0, 3).map((limit, index) => (
                  <li key={index}>• {limit}</li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-purple-500" />
                <h4 className="font-semibold text-gray-900">Supabase DB</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                {FREE_HOSTING_SETUP.database.freeTierLimits.slice(0, 3).map((limit, index) => (
                  <li key={index}>• {limit}</li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-5 h-5 text-orange-500" />
                <h4 className="font-semibold text-gray-900">OpenAI AI</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                {FREE_HOSTING_SETUP.ai.freeTierLimits.slice(0, 3).map((limit, index) => (
                  <li key={index}>• {limit}</li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-green-500" />
                <h4 className="font-semibold text-gray-900">Analytics</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                {FREE_HOSTING_SETUP.monitoring.freeTierLimits.slice(0, 3).map((limit, index) => (
                  <li key={index}>• {limit}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step-by-Step Setup */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900">Setup Steps</h3>
        
        {API_SETUP_STEPS.map((step) => (
          <Card key={step.step} className={`border-2 ${
            getStepStatus(step.step) === 'completed' ? 'border-green-200 bg-green-50' :
            getStepStatus(step.step) === 'current' ? 'border-blue-200 bg-blue-50' :
            'border-gray-200'
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    getStepStatus(step.step) === 'completed' ? 'bg-green-500 text-white' :
                    getStepStatus(step.step) === 'current' ? 'bg-blue-500 text-white' :
                    'bg-gray-300 text-gray-600'
                  }`}>
                    {getStepStatus(step.step) === 'completed' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.step}</span>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </div>
                </div>
                <Badge variant={getStepStatus(step.step) === 'completed' ? 'default' : 'secondary'}>
                  {getStepStatus(step.step) === 'completed' ? 'Completed' :
                   getStepStatus(step.step) === 'current' ? 'Current' : 'Pending'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-blue-500" />
                <a 
                  href={step.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {step.url}
                </a>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-sm text-gray-700">Action:</div>
                <div className="text-sm text-gray-600">{step.action}</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-sm text-gray-700">Expected Result:</div>
                <div className="text-sm text-gray-600">{step.expectedResult}</div>
              </div>

              {/* API Key Input Fields */}
              {step.step === 1 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      OpenAI API Key
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="sk-..."
                        value={apiKeys.openai}
                        onChange={(e) => setApiKeys({...apiKeys, openai: e.target.value})}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(apiKeys.openai, 'openai')}
                      >
                        {copied === 'openai' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {step.step === 2 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supabase URL
                    </label>
                    <Input
                      placeholder="https://your-project.supabase.co"
                      value={apiKeys.supabaseUrl}
                      onChange={(e) => setApiKeys({...apiKeys, supabaseUrl: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supabase Anon Key
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="eyJ..."
                        value={apiKeys.supabaseAnonKey}
                        onChange={(e) => setApiKeys({...apiKeys, supabaseAnonKey: e.target.value})}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(apiKeys.supabaseAnonKey, 'anon')}
                      >
                        {copied === 'anon' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supabase Service Role Key
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="eyJ..."
                        value={apiKeys.supabaseServiceKey}
                        onChange={(e) => setApiKeys({...apiKeys, supabaseServiceKey: e.target.value})}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(apiKeys.supabaseServiceKey, 'service')}
                      >
                        {copied === 'service' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                <Button
                  onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                  disabled={currentStep === 4}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {currentStep === 4 ? 'Complete' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clipboard className="w-5 h-5" />
            Environment Variables
          </CardTitle>
          <CardDescription>
            Copy these to your .env.local file or Vercel environment variables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={generateEnvFile()}
              readOnly
              rows={12}
              className="font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => copyToClipboard(generateEnvFile(), 'env')}
                className="bg-green-600 hover:bg-green-700"
              >
                {copied === 'env' ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                Copy Environment Variables
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Checklist */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <CheckCircle className="w-5 h-5" />
            Deployment Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {DEPLOYMENT_CHECKLIST.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5" />
            Next Steps After Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
              <div>
                <div className="font-semibold">Push to GitHub</div>
                <div className="text-sm text-gray-600">Create a GitHub repository and push your code</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
              <div>
                <div className="font-semibold">Connect to Vercel</div>
                <div className="text-sm text-gray-600">Import your GitHub repository in Vercel</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
              <div>
                <div className="font-semibold">Add Environment Variables</div>
                <div className="text-sm text-gray-600">Paste your API keys in Vercel dashboard</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
              <div>
                <div className="font-semibold">Deploy</div>
                <div className="text-sm text-gray-600">Your app will automatically deploy and be live!</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 