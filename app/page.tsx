import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/server'

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">DataGetsMe</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              Your Data
              <span className="text-blue-600"> Gets You</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Privacy-first web analytics that gives you actionable insights. 
              Lightweight, fast, and focused on what your business needs to grow.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {user ? (
                <Link
                  href="/dashboard"
                  className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Start Free
                  </Link>
                  <Link
                    href="/login"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    Sign in <span aria-hidden="true">→</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 text-blue-600">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">Real-time Analytics</h3>
                <p className="mt-2 text-gray-600">
                  See who&apos;s on your website right now with live visitor tracking.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto h-12 w-12 text-blue-600">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">Privacy First</h3>
                <p className="mt-2 text-gray-600">
                  No cookies, no personal data collection, respects Do Not Track.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto h-12 w-12 text-blue-600">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">Lightweight</h3>
                <p className="mt-2 text-gray-600">
                  Minimal impact on your site&apos;s performance with our tiny tracking script.
                </p>
              </div>
            </div>
          </div>

          {/* Simple Setup */}
          <div className="mt-20">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Get started in seconds</h2>
              <p className="mt-4 text-lg text-gray-600">
                Add one line of code to start tracking your website analytics
              </p>
              <div className="mt-8 bg-gray-900 rounded-lg p-6 text-left max-w-2xl mx-auto">
                <code className="text-green-400 text-sm font-mono">
                  {'<script async src="https://yoursite.com/api/script/[site-id]"></script>'}
                </code>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
