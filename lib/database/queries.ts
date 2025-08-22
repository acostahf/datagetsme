import { createClient } from '@/lib/supabase/server'
import type { Site, Event, AnalyticsData, TeamMember, Invitation } from '@/lib/types/database'

export async function getUserSites(userId: string): Promise<Site[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createSite(userId: string, domain: string): Promise<Site> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('sites')
    .insert({ user_id: userId, domain })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getSiteById(siteId: string): Promise<Site | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', siteId)
    .single()

  if (error) return null
  return data
}

// Special function for anonymous access (used by tracking endpoint)
export async function getSiteByIdAnonymous(siteId: string): Promise<Site | null> {
  const { createClient } = await import('@supabase/supabase-js')
  
  // Use service role key to bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET!
  )
  
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', siteId)
    .single()

  if (error) return null
  return data
}

export async function trackEvent(event: Omit<Event, 'id' | 'timestamp'>): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('events')
    .insert(event)

  if (error) throw error
}

export async function getAnalyticsData(siteId: string, days: number = 7): Promise<AnalyticsData> {
  const supabase = await createClient()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // Get total unique visitors (sessions)
  const { data: totalVisitorsData, error: visitorsError } = await supabase
    .from('events')
    .select('session_id')
    .eq('site_id', siteId)
    .gte('timestamp', startDate.toISOString())

  if (visitorsError) throw visitorsError

  const uniqueVisitors = new Set(totalVisitorsData?.map(e => e.session_id) || []).size

  // Get active users (last 5 minutes)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  const { data: activeUsersData, error: activeError } = await supabase
    .from('events')
    .select('session_id')
    .eq('site_id', siteId)
    .gte('timestamp', fiveMinutesAgo.toISOString())

  if (activeError) throw activeError

  const activeUsers = new Set(activeUsersData?.map(e => e.session_id) || []).size

  // Get all events data for the time period
  const { data: eventsData, error: eventsError } = await supabase
    .from('events')
    .select('page, referrer, country, city, device_type, operating_system, browser, session_id, timestamp')
    .eq('site_id', siteId)
    .gte('timestamp', startDate.toISOString())

  if (eventsError) throw eventsError

  const events = eventsData || []

  // Process top pages
  const pageViews = events.reduce((acc: Record<string, number>, event) => {
    acc[event.page] = (acc[event.page] || 0) + 1
    return acc
  }, {})

  const topPages = Object.entries(pageViews)
    .map(([page, views]) => ({ page, views: views as number }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)

  // Process top referrers
  const referrerViews = events.reduce((acc: Record<string, number>, event) => {
    if (event.referrer) {
      acc[event.referrer] = (acc[event.referrer] || 0) + 1
    }
    return acc
  }, {})

  const topReferrers = Object.entries(referrerViews)
    .map(([referrer, views]) => ({ referrer, views: views as number }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)

  // Process countries (unique sessions)
  const countryVisitors = events.reduce((acc: Record<string, Set<string>>, event) => {
    if (event.country && event.country !== 'Unknown') {
      if (!acc[event.country]) acc[event.country] = new Set()
      acc[event.country].add(event.session_id)
    }
    return acc
  }, {} as Record<string, Set<string>>)

  const topCountries = Object.entries(countryVisitors)
    .map(([country, sessions]) => ({ country, visitors: sessions.size }))
    .sort((a, b) => b.visitors - a.visitors)
    .slice(0, 10)

  // Process cities (unique sessions)
  const cityVisitors = events.reduce((acc: Record<string, Set<string>>, event) => {
    if (event.city && event.city !== 'Unknown') {
      if (!acc[event.city]) acc[event.city] = new Set()
      acc[event.city].add(event.session_id)
    }
    return acc
  }, {} as Record<string, Set<string>>)

  const topCities = Object.entries(cityVisitors)
    .map(([city, sessions]) => ({ city, visitors: sessions.size }))
    .sort((a, b) => b.visitors - a.visitors)
    .slice(0, 10)

  // Process device types (unique sessions)
  const deviceVisitors = events.reduce((acc: Record<string, Set<string>>, event) => {
    if (event.device_type) {
      if (!acc[event.device_type]) acc[event.device_type] = new Set()
      acc[event.device_type].add(event.session_id)
    }
    return acc
  }, {} as Record<string, Set<string>>)

  const deviceTypes = Object.entries(deviceVisitors)
    .map(([device, sessions]) => ({ device, visitors: sessions.size }))
    .sort((a, b) => b.visitors - a.visitors)

  // Process operating systems (unique sessions)
  const osVisitors = events.reduce((acc: Record<string, Set<string>>, event) => {
    if (event.operating_system) {
      if (!acc[event.operating_system]) acc[event.operating_system] = new Set()
      acc[event.operating_system].add(event.session_id)
    }
    return acc
  }, {} as Record<string, Set<string>>)

  const operatingSystems = Object.entries(osVisitors)
    .map(([os, sessions]) => ({ os, visitors: sessions.size }))
    .sort((a, b) => b.visitors - a.visitors)

  // Process browsers (unique sessions)
  const browserVisitors = events.reduce((acc: Record<string, Set<string>>, event) => {
    if (event.browser) {
      if (!acc[event.browser]) acc[event.browser] = new Set()
      acc[event.browser].add(event.session_id)
    }
    return acc
  }, {} as Record<string, Set<string>>)

  const browsers = Object.entries(browserVisitors)
    .map(([browser, sessions]) => ({ browser, visitors: sessions.size }))
    .sort((a, b) => b.visitors - a.visitors)

  // Process visitors by hour
  const hourlyVisitors = events.reduce((acc: Record<string, Set<string>>, event) => {
    const hour = new Date(event.timestamp).getHours().toString().padStart(2, '0') + ':00'
    if (!acc[hour]) acc[hour] = new Set()
    acc[hour].add(event.session_id)
    return acc
  }, {} as Record<string, Set<string>>)

  const visitorsByHour = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0') + ':00'
    return {
      hour,
      visitors: hourlyVisitors[hour]?.size || 0
    }
  })

  return {
    totalVisitors: uniqueVisitors,
    activeUsers,
    topPages,
    topReferrers,
    topCountries,
    topCities,
    deviceTypes,
    operatingSystems,
    browsers,
    visitorsByHour,
  }
}

// Team member management functions
export async function getTeamMembers(siteId: string): Promise<TeamMember[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false })

  if (error) throw error
  
  // Get user emails for each team member
  const teamMembers = data || []
  const membersWithEmails = await Promise.all(
    teamMembers.map(async (member) => {
      try {
        const { data: userData } = await supabase.auth.admin.getUserById(member.user_id)
        return {
          ...member,
          user: userData.user ? { email: userData.user.email || 'Unknown' } : undefined
        }
      } catch {
        return {
          ...member,
          user: { email: 'Unknown' }
        }
      }
    })
  )
  
  return membersWithEmails
}

export async function getSiteInvitations(siteId: string): Promise<Invitation[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('site_id', siteId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function inviteTeamMember(
  siteId: string, 
  email: string, 
  role: 'admin' | 'viewer',
  invitedBy: string
): Promise<Invitation> {
  const supabase = await createClient()
  
  // Check if user is already a team member
  const { data: existingMember } = await supabase
    .from('team_members')
    .select('*')
    .eq('site_id', siteId)
    .eq('user_id', invitedBy)
    .single()

  if (!existingMember || !['owner', 'admin'].includes(existingMember.role)) {
    throw new Error('Insufficient permissions to invite team members')
  }

  // Check if invitation already exists
  const { data: existingInvitation } = await supabase
    .from('invitations')
    .select('*')
    .eq('site_id', siteId)
    .eq('email', email)
    .eq('status', 'pending')
    .single()

  if (existingInvitation) {
    throw new Error('Invitation already sent to this email')
  }

  // Check if user is already a team member by email
  const { data: existingUser } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', email)
    .single()

  if (existingUser) {
    const { data: existingTeamMember } = await supabase
      .from('team_members')
      .select('*')
      .eq('site_id', siteId)
      .eq('user_id', existingUser.id)
      .single()

    if (existingTeamMember) {
      throw new Error('User is already a team member')
    }
  }

  const { data, error } = await supabase
    .from('invitations')
    .insert({
      site_id: siteId,
      email,
      role,
      invited_by: invitedBy
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function acceptInvitation(token: string): Promise<void> {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Find invitation
  const { data: invitation, error: inviteError } = await supabase
    .from('invitations')
    .select('*')
    .eq('token', token)
    .eq('status', 'pending')
    .single()

  if (inviteError || !invitation) {
    throw new Error('Invalid or expired invitation')
  }

  // Check if invitation is for the current user's email
  if (invitation.email !== user.email) {
    throw new Error('This invitation is not for your email address')
  }

  // Check if invitation has expired
  if (new Date(invitation.expires_at) < new Date()) {
    await supabase
      .from('invitations')
      .update({ status: 'expired' })
      .eq('id', invitation.id)
    
    throw new Error('Invitation has expired')
  }

  // Add user to team
  const { error: teamError } = await supabase
    .from('team_members')
    .insert({
      site_id: invitation.site_id,
      user_id: user.id,
      role: invitation.role,
      invited_by: invitation.invited_by
    })

  if (teamError) throw teamError

  // Mark invitation as accepted
  const { error: updateError } = await supabase
    .from('invitations')
    .update({ status: 'accepted' })
    .eq('id', invitation.id)

  if (updateError) throw updateError
}

export async function removeTeamMember(siteId: string, userId: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('site_id', siteId)
    .eq('user_id', userId)

  if (error) throw error
}

export async function cancelInvitation(invitationId: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('invitations')
    .delete()
    .eq('id', invitationId)

  if (error) throw error
}