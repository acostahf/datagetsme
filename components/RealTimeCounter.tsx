'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface RealTimeCounterProps {
  siteId: string
  initialCount: number
}

export default function RealTimeCounter({ siteId, initialCount }: RealTimeCounterProps) {
  const [activeUsers, setActiveUsers] = useState(initialCount)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    
    // Function to fetch current active users
    const fetchActiveUsers = async () => {
      try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
        const { data, error } = await supabase
          .from('events')
          .select('session_id')
          .eq('site_id', siteId)
          .gte('timestamp', fiveMinutesAgo.toISOString())

        if (error) throw error

        const uniqueUsers = new Set(data?.map(e => e.session_id) || []).size
        setActiveUsers(uniqueUsers)
        setIsConnected(true)
      } catch (error) {
        console.error('Error fetching active users:', error)
        setIsConnected(false)
      }
    }

    // Fetch immediately
    fetchActiveUsers()

    // Set up real-time subscription
    const subscription = supabase
      .channel(`active-users-${siteId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'events',
          filter: `site_id=eq.${siteId}`,
        },
        () => {
          // Refetch active users when new events are added
          fetchActiveUsers()
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
        } else if (status === 'CLOSED') {
          setIsConnected(false)
        }
      })

    // Refresh every 30 seconds to keep count accurate
    const interval = setInterval(fetchActiveUsers, 30000)

    return () => {
      subscription.unsubscribe()
      clearInterval(interval)
    }
  }, [siteId])

  return (
    <div className="mt-2">
      <div className="text-3xl font-bold text-gray-900">
        {activeUsers.toLocaleString()}
      </div>
      <div className="flex items-center mt-1">
        <div 
          className={`w-2 h-2 rounded-full mr-2 ${
            isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}
        />
        <span className="text-sm text-gray-500">
          {isConnected ? 'Connected' : 'Connecting...'}
        </span>
      </div>
    </div>
  )
}