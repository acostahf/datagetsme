import { requireAuth } from '@/lib/auth/server'
import { getSiteById, getAnalyticsData } from '@/lib/database/queries'
import { notFound } from 'next/navigation'
import AnalyticsOverview from '@/components/AnalyticsOverview'
import RealTimeCounter from '@/components/RealTimeCounter'
import VisitorTimeChart from '@/components/VisitorTimeChart'
import LocationAnalytics from '@/components/LocationAnalytics'
import DeviceAnalytics from '@/components/DeviceAnalytics'

interface AnalyticsPageProps {
  params: Promise<{ siteId: string }>
  searchParams: Promise<{ days?: string }>
}

export default async function AnalyticsPage({ params, searchParams }: AnalyticsPageProps) {
  await requireAuth()
  const { siteId } = await params
  const { days: daysParam } = await searchParams
  const days = parseInt(daysParam || '7')

  // Verify site exists and belongs to user
  const site = await getSiteById(siteId)
  if (!site) {
    notFound()
  }

  // Get analytics data
  const analyticsData = await getAnalyticsData(siteId, days)

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            {site.domain}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Analytics for the last {days} days
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-2">
          <span className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white">
            {days === 1 ? 'Last 24 hours' : 
             days === 7 ? 'Last 7 days' : 
             days === 30 ? 'Last 30 days' : 
             days === 90 ? 'Last 90 days' : 
             `Last ${days} days`}
          </span>
        </div>
      </div>

      {/* Real-time active users */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Active Users</h3>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-gray-500">Live</span>
          </div>
        </div>
        <RealTimeCounter siteId={siteId} initialCount={analyticsData.activeUsers} />
      </div>

      {/* Analytics Overview */}
      <AnalyticsOverview data={analyticsData} />

      {/* Visitor Time Chart */}
      <VisitorTimeChart data={analyticsData.visitorsByHour} />

      {/* Device Analytics */}
      <DeviceAnalytics 
        deviceTypes={analyticsData.deviceTypes}
        operatingSystems={analyticsData.operatingSystems}
        browsers={analyticsData.browsers}
      />

      {/* Location Analytics */}
      <LocationAnalytics 
        countries={analyticsData.topCountries}
        cities={analyticsData.topCities}
      />

      {/* Top Pages and Referrers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Pages</h3>
          </div>
          <div className="p-6">
            {analyticsData.topPages.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No page views yet</p>
            ) : (
              <div className="space-y-4">
                {analyticsData.topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 mr-4 w-4">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-900 font-mono">
                        {page.page}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{page.views} views</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Referrers</h3>
          </div>
          <div className="p-6">
            {analyticsData.topReferrers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No referrers yet</p>
            ) : (
              <div className="space-y-4">
                {analyticsData.topReferrers.map((referrer, index) => (
                  <div key={referrer.referrer} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 mr-4 w-4">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-900">
                        {new URL(referrer.referrer).hostname}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{referrer.views} visits</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}