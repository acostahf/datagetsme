import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/server'
import { removeTeamMember } from '@/lib/database/queries'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string; memberId: string }> }
) {
  try {
    const { siteId, memberId } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await removeTeamMember(siteId, memberId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to remove team member:', error)
    return NextResponse.json(
      { error: 'Failed to remove team member' },
      { status: 500 }
    )
  }
}