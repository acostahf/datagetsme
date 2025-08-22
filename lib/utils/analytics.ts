interface LocationData {
  city?: string
  country?: string
}

interface DeviceInfo {
  deviceType: string
  operatingSystem: string
  browser: string
}

// Get location data from IP address using ipapi.co free service
export async function getLocationFromIP(ip: string): Promise<LocationData> {
  // Skip for local/private IPs
  if (ip === 'unknown' || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return { city: 'Unknown', country: 'Unknown' }
  }

  try {
    const response = await fetch(`http://ipapi.co/${ip}/json/`, {
      timeout: 2000, // 2 second timeout
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      city: data.city || 'Unknown',
      country: data.country_name || 'Unknown'
    }
  } catch (error) {
    console.error('Error fetching location data:', error)
    return { city: 'Unknown', country: 'Unknown' }
  }
}

// Parse user agent to extract device, OS, and browser information
export function parseUserAgent(userAgent: string): DeviceInfo {
  const ua = userAgent.toLowerCase()
  
  // Detect device type
  let deviceType = 'desktop'
  if (ua.includes('mobile') && !ua.includes('tablet')) {
    deviceType = 'mobile'
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    deviceType = 'tablet'
  }
  
  // Detect operating system
  let operatingSystem = 'Unknown'
  if (ua.includes('windows')) {
    operatingSystem = 'Windows'
  } else if (ua.includes('mac os x') || ua.includes('macos')) {
    operatingSystem = 'macOS'
  } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ios')) {
    operatingSystem = 'iOS'
  } else if (ua.includes('android')) {
    operatingSystem = 'Android'
  } else if (ua.includes('linux')) {
    operatingSystem = 'Linux'
  } else if (ua.includes('cros')) {
    operatingSystem = 'Chrome OS'
  }
  
  // Detect browser
  let browser = 'Unknown'
  if (ua.includes('edg/')) {
    browser = 'Edge'
  } else if (ua.includes('chrome/') && !ua.includes('edg/')) {
    browser = 'Chrome'
  } else if (ua.includes('firefox/')) {
    browser = 'Firefox'
  } else if (ua.includes('safari/') && !ua.includes('chrome/')) {
    browser = 'Safari'
  } else if (ua.includes('opera/') || ua.includes('opr/')) {
    browser = 'Opera'
  }
  
  return {
    deviceType,
    operatingSystem,
    browser
  }
}

// Detect if user agent indicates a mobile device
export function isMobileDevice(userAgent: string): boolean {
  const mobileKeywords = [
    'mobile', 'android', 'iphone', 'ipod', 'blackberry', 'opera mini', 'windows mobile'
  ]
  
  const ua = userAgent.toLowerCase()
  return mobileKeywords.some(keyword => ua.includes(keyword)) && !ua.includes('tablet')
}

// Detect if user agent indicates a tablet device
export function isTabletDevice(userAgent: string): boolean {
  const tabletKeywords = ['tablet', 'ipad', 'kindle', 'silk', 'playbook']
  const ua = userAgent.toLowerCase()
  return tabletKeywords.some(keyword => ua.includes(keyword))
}

// Clean and limit string length for database storage
export function sanitizeString(str: string | null | undefined, maxLength: number = 100): string | null {
  if (!str) return null
  return str.trim().substring(0, maxLength)
}