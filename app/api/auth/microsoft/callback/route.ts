
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    console.error('Microsoft auth error:', error)
    return NextResponse.redirect(`${request.nextUrl.origin}/migration?auth=error`)
  }

  if (!code) {
    console.error('No authorization code received')
    return NextResponse.redirect(`${request.nextUrl.origin}/migration?auth=error`)
  }

  const clientId = process.env.MICROSOFT_CLIENT_ID
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET
  const redirectUri = `${request.nextUrl.origin}/api/auth/microsoft/callback`

  if (!clientId || !clientSecret) {
    console.error('Microsoft credentials not configured')
    return NextResponse.redirect(`${request.nextUrl.origin}/migration?auth=error`)
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      console.error('Token exchange error:', tokenData.error)
      return NextResponse.redirect(`${request.nextUrl.origin}/migration?auth=error`)
    }

    // Store token in session/cookies (simplified for demo)
    console.log('✅ Microsoft Graph access token obtained successfully!')
    console.log('📊 Token scope:', tokenData.scope)
    
    // Redirect to migration page with success
    return NextResponse.redirect(`${request.nextUrl.origin}/migration?auth=success&token=${encodeURIComponent(tokenData.access_token)}`)
  } catch (error) {
    console.error('Microsoft auth callback error:', error)
    return NextResponse.redirect(`${request.nextUrl.origin}/migration?auth=error`)
  }
}
