export interface FreeHostingConfig {
  // Free hosting providers
  hosting: {
    provider: 'vercel' | 'netlify' | 'railway'
    setupUrl: string
    freeTierLimits: string[]
  }
  
  // Free database providers
  database: {
    provider: 'supabase' | 'planetscale' | 'neon'
    setupUrl: string
    freeTierLimits: string[]
  }
  
  // Free AI providers
  ai: {
    provider: 'openai' | 'huggingface' | 'cohere'
    setupUrl: string
    freeTierLimits: string[]
    apiKeyInstructions: string[]
  }
  
  // Free monitoring
  monitoring: {
    provider: 'vercel-analytics' | 'google-analytics' | 'mixpanel'
    setupUrl: string
    freeTierLimits: string[]
  }
}

export const FREE_HOSTING_SETUP: FreeHostingConfig = {
  hosting: {
    provider: 'vercel',
    setupUrl: 'https://vercel.com/signup',
    freeTierLimits: [
      '100GB bandwidth/month',
      '6000 build minutes/month',
      '100GB-hours serverless functions',
      'Automatic SSL certificates',
      'Global CDN',
      'Custom domains'
    ]
  },
  
  database: {
    provider: 'supabase',
    setupUrl: 'https://supabase.com/signup',
    freeTierLimits: [
      '500MB database storage',
      '2GB bandwidth/month',
      '20 concurrent connections',
      'Automatic daily backups',
      'Real-time subscriptions',
      'Row Level Security'
    ]
  },
  
  ai: {
    provider: 'openai',
    setupUrl: 'https://platform.openai.com/signup',
    freeTierLimits: [
      'Free API credits on signup',
      '3 requests/minute rate limit',
      '4000 tokens per request',
      'GPT-3.5-turbo access',
      'GPT-4 access (with credits)'
    ],
    apiKeyInstructions: [
      '1. Go to https://platform.openai.com/signup',
      '2. Create free account (no credit card required)',
      '3. Get $5 free credits automatically',
      '4. Go to API Keys section',
      '5. Create new API key',
      '6. Copy the key (starts with sk-)',
      '7. Add to environment variables'
    ]
  },
  
  monitoring: {
    provider: 'vercel-analytics',
    setupUrl: 'https://vercel.com/analytics',
    freeTierLimits: [
      '100,000 events/month',
      '30 days data retention',
      'Real-time dashboards',
      'Custom event tracking',
      'Performance monitoring'
    ]
  }
}

export interface APISetupInstructions {
  step: number
  title: string
  description: string
  url: string
  action: string
  expectedResult: string
}

export const API_SETUP_STEPS: APISetupInstructions[] = [
  {
    step: 1,
    title: 'OpenAI API Key',
    description: 'Get free API credits and create API key',
    url: 'https://platform.openai.com/signup',
    action: 'Sign up for free account',
    expectedResult: 'API key starting with sk-'
  },
  {
    step: 2,
    title: 'Supabase Database',
    description: 'Create free database project',
    url: 'https://supabase.com/signup',
    action: 'Create new project',
    expectedResult: 'Database URL and API keys'
  },
  {
    step: 3,
    title: 'Vercel Hosting',
    description: 'Deploy your app for free',
    url: 'https://vercel.com/signup',
    action: 'Connect GitHub repository',
    expectedResult: 'Live deployment URL'
  },
  {
    step: 4,
    title: 'Environment Variables',
    description: 'Configure API keys in Vercel',
    url: 'https://vercel.com/dashboard',
    action: 'Add environment variables',
    expectedResult: 'App working with real APIs'
  }
]

export const ENVIRONMENT_VARIABLES_TEMPLATE = `
# Copy these to your .env.local file or Vercel environment variables

# OpenAI API (Get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-api-key-here

# Supabase Database (Get from https://supabase.com/dashboard)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Application Settings
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
`

export const DEPLOYMENT_CHECKLIST = [
  '✅ OpenAI API key configured',
  '✅ Supabase database created',
  '✅ Vercel project connected',
  '✅ Environment variables set',
  '✅ GitHub repository pushed',
  '✅ Deployment successful',
  '✅ Live URL accessible',
  '✅ Database connected',
  '✅ AI services responding'
] 