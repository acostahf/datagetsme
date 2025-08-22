import { requireAuth } from '@/lib/auth/server'
import { getUserSites } from '@/lib/database/queries'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await requireAuth()
  const sites = await getUserSites(user.id)

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here&apos;s an overview of your analytics
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link
            href="/dashboard/sites"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Site
          </Link>
        </div>
      </div>

      {sites.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No sites</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first website to track analytics.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/sites"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add your first site
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <div key={site.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {site.domain.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {site.domain}
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {new Date(site.created_at).toLocaleDateString()}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href={`/dashboard/analytics/${site.id}`}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    View analytics
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}