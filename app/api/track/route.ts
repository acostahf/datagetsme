import { NextRequest, NextResponse } from 'next/server'
import { getSiteByIdAnonymous, trackEvent } from '@/lib/database/queries'
import { headers } from 'next/headers'
import { getLocationFromIP, parseUserAgent, sanitizeString } from '@/lib/utils/analytics'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { site_id, session_id, page, referrer } = body

    // Validate required fields
    if (!site_id || !session_id || !page) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify site exists
    const site = await getSiteByIdAnonymous(site_id)
    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    // Get IP address and user agent
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || 
               headersList.get('x-real-ip') || 
               'unknown'
    const userAgent = headersList.get('user-agent') || ''

    // Basic bot detection
    const botPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /headless/i,
      /phantom/i,
      /selenium/i,
    ]
    
    const isBot = botPatterns.some(pattern => pattern.test(userAgent))
    
    if (isBot) {
      // Still return success to avoid breaking the tracking script
      return NextResponse.json({ success: true })
    }

    // Get enhanced data
    const cleanIP = ip.split(',')[0].trim() // Take first IP if multiple
    const locationData = await getLocationFromIP(cleanIP)
    const deviceInfo = parseUserAgent(userAgent)

    // Track the event with enhanced data
    await trackEvent({
      site_id,
      session_id,
      page: page.substring(0, 500), // Limit page URL length
      referrer: referrer ? referrer.substring(0, 500) : null,
      ip_address: cleanIP,
      user_agent: userAgent.substring(0, 500), // Limit user agent length
      city: sanitizeString(locationData.city),
      country: sanitizeString(locationData.country),
      device_type: sanitizeString(deviceInfo.deviceType),
      operating_system: sanitizeString(deviceInfo.operatingSystem),
      browser: sanitizeString(deviceInfo.browser),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking event:', error)
    
    // Return success even on error to avoid breaking the tracking script
    return NextResponse.json({ success: true })
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}