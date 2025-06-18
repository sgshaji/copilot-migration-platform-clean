
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const clientId = process.env.MICROSOFT_CLIENT_ID
  const redirectUri = `${request.nextUrl.origin}/api/auth/microsoft/callback`
  
  if (!clientId) {
    return NextResponse.json({ error: 'Microsoft client ID not configured' }, { status: 500 })
  }

  // Microsoft Graph OAuth 2.0 authorization URL
  const authUrl = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', 'User.Read Calendars.Read Mail.Read Files.Read')
  authUrl.searchParams.set('response_mode', 'query')

  console.log(`🔗 Microsoft Auth: Redirecting to ${authUrl.toString()}`)
  
  return NextResponse.redirect(authUrl.toString())
}
