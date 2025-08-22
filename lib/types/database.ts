export interface Site {
  id: string
  user_id: string
  domain: string
  created_at: string
}

export interface Event {
  id: string
  site_id: string
  session_id: string
  page: string
  referrer: string | null
  timestamp: string
  ip_address?: string
  user_agent?: string
  city?: string | null
  country?: string | null
  device_type?: string | null
  operating_system?: string | null
  browser?: string | null
}

export interface TeamMember {
  id: string
  site_id: string
  user_id: string
  role: 'owner' | 'admin' | 'viewer'
  invited_by: string
  created_at: string
  user?: {
    email: string
  }
}

export interface Invitation {
  id: string
  site_id: string
  email: string
  role: 'admin' | 'viewer'
  invited_by: string
  token: string
  status: 'pending' | 'accepted' | 'expired'
  expires_at: string
  created_at: string
}

export interface AnalyticsData {
  totalVisitors: number
  activeUsers: number
  topPages: { page: string; views: number }[]
  topReferrers: { referrer: string; views: number }[]
  topCountries: { country: string; visitors: number }[]
  topCities: { city: string; visitors: number }[]
  deviceTypes: { device: string; visitors: number }[]
  operatingSystems: { os: string; visitors: number }[]
  browsers: { browser: string; visitors: number }[]
  visitorsByHour: { hour: string; visitors: number }[]
}