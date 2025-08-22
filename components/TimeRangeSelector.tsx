'use client'

import { useRouter } from 'next/navigation'

interface TimeRangeSelectorProps {
  siteId: string
  currentDays: number
}

export default function TimeRangeSelector({ siteId, currentDays }: TimeRangeSelectorProps) {
  const router = useRouter()

  const handleChange = (newDays: string) => {
    router.push(`/dashboard/analytics/${siteId}?days=${newDays}`)
  }

  return (
    <select
      value={currentDays}
      onChange={(e) => handleChange(e.target.value)}
      className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
    >
      <option value="1">Last 24 hours</option>
      <option value="7">Last 7 days</option>
      <option value="30">Last 30 days</option>
      <option value="90">Last 90 days</option>
    </select>
  )
}