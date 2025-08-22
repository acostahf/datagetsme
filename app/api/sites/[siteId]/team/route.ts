import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/server'
import { getTeamMembers, getSiteInvitations, inviteTeamMember } from '@/lib/database/queries'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const { siteId } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [teamMembers, invitations] = await Promise.all([
      getTeamMembers(siteId),
      getSiteInvitations(siteId)
    ])

    return NextResponse.json({ teamMembers, invitations })
  } catch (error) {
    console.error('Failed to fetch team data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team data' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const { siteId } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email, role } = await request.json()

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      )
    }

    if (!['admin', 'viewer'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    const invitation = await inviteTeamMember(siteId, email, role, user.id)

    // TODO: Send invitation email here
    // You would integrate with your email service provider here

    return NextResponse.json({ invitation })
  } catch (error) {
    console.error('Failed to invite team member:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to invite team member' },
      { status: 500 }
    )
  }
}