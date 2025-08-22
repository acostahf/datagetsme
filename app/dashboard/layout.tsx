import { requireAuth } from '@/lib/auth/server'
import DashboardNav from '@/components/DashboardNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav user={user} />
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}