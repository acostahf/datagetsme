import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/server'
import { createSite, getUserSites } from '@/lib/database/queries'

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sites = await getUserSites(user.id)
    return NextResponse.json({ sites })
  } catch (error) {
    console.error('Error fetching sites:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { domain } = await request.json()
    
    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
    if (!domainRegex.test(domain)) {
      return NextResponse.json({ error: 'Invalid domain format' }, { status: 400 })
    }

    const site = await createSite(user.id, domain.toLowerCase())
    return NextResponse.json({ site }, { status: 201 })
  } catch (error) {
    console.error('Error creating site:', error)
    
    // Handle duplicate domain error
    if (error instanceof Error && error.message.includes('duplicate')) {
      return NextResponse.json({ error: 'Domain already exists' }, { status: 409 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}