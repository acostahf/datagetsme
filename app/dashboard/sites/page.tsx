import { requireAuth } from '@/lib/auth/server'
import { getUserSites } from '@/lib/database/queries'
import SitesList from '@/components/SitesList'
import AddSiteForm from '@/components/AddSiteForm'

export default async function SitesPage() {
  const user = await requireAuth()
  const sites = await getUserSites(user.id)

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Your Sites
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your websites and get their tracking scripts
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AddSiteForm />
        </div>
        <div className="lg:col-span-2">
          <SitesList sites={sites} />
        </div>
      </div>
    </div>
  )
}