'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth/client'
import type { User } from '@supabase/supabase-js'
import ThemeToggle from './ThemeToggle'

interface DashboardNavProps {
  user: User
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setLoading(true)
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">DataGetsMe</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                href="/dashboard"
                className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/sites"
                className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sites
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <span className="text-sm text-gray-600 dark:text-gray-400">{user.email}</span>
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}