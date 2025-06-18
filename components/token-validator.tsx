
"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export function TokenValidator() {
  const [token, setToken] = useState('')
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<{
    valid: boolean
    message: string
    details?: any
  } | null>(null)

  const validateToken = async () => {
    if (!token || !token.startsWith('bp_pat_')) {
      setResult({
        valid: false,
        message: 'Token must start with "bp_pat_"'
      })
      return
    }

    setTesting(true)
    setResult(null)

    try {
      // Test the token directly against Botpress API
      const response = await fetch('https://api.botpress.cloud/v1/admin/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const userInfo = await response.json()
        setResult({
          valid: true,
          message: 'Token is valid!',
          details: userInfo
        })
      } else {
        const errorText = await response.text()
        setResult({
          valid: false,
          message: `Token validation failed: ${response.status}`,
          details: errorText
        })
      }
    } catch (error) {
      setResult({
        valid: false,
        message: 'Network error - check your connection',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Test Botpress Token
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="bp_pat_..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={testing}
          />
          <Button 
            onClick={validateToken} 
            disabled={testing || !token}
            className="w-full"
          >
            {testing ? 'Testing...' : 'Test Token'}
          </Button>
        </div>

        {result && (
          <Alert className={`${result.valid ? 'border-green-500' : 'border-red-500'}`}>
            <div className="flex items-center gap-2">
              {result.valid ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              <AlertDescription>
                <div>
                  <p className="font-medium">{result.message}</p>
                  {result.details && (
                    <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                      {typeof result.details === 'string' 
                        ? result.details 
                        : JSON.stringify(result.details, null, 2)
                      }
                    </pre>
                  )}
                </div>
              </AlertDescription>
            </div>
          </Alert>
        )}

        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Get a valid token:</strong></p>
          <p>1. Go to <a href="https://botpress.com" target="_blank" className="text-blue-600 underline">botpress.com</a></p>
          <p>2. Sign up or sign in</p>
          <p>3. Create a new bot</p>
          <p>4. Go to Settings → API Keys</p>
          <p>5. Generate a new Personal Access Token</p>
        </div>
      </CardContent>
    </Card>
  )
}
