'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface DeviceAnalyticsProps {
  deviceTypes: { device: string; visitors: number }[]
  operatingSystems: { os: string; visitors: number }[]
  browsers: { browser: string; visitors: number }[]
}

const DEVICE_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']
const OS_COLORS = ['#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1']
const BROWSER_COLORS = ['#14b8a6', '#f43f5e', '#a855f7', '#eab308', '#3b82f6']

export default function DeviceAnalytics({ deviceTypes, operatingSystems, browsers }: DeviceAnalyticsProps) {
  const deviceData = deviceTypes.slice(0, 5) // Top 5 devices
  const osData = operatingSystems.slice(0, 5) // Top 5 OS
  const browserData = browsers.slice(0, 5) // Top 5 browsers

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    if (percent < 0.05) return null // Hide labels for slices < 5%
    
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12" fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Device Types */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Device Types</h3>
          <p className="text-sm text-gray-500">Visitors by device</p>
        </div>
        <div className="p-6">
          {deviceData.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No device data yet</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="visitors"
                    nameKey="device"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} visitors`, 'Visitors']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Operating Systems */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Operating Systems</h3>
          <p className="text-sm text-gray-500">Visitors by OS</p>
        </div>
        <div className="p-6">
          {osData.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No OS data yet</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={osData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="visitors"
                    nameKey="os"
                  >
                    {osData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={OS_COLORS[index % OS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} visitors`, 'Visitors']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Browsers */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Browsers</h3>
          <p className="text-sm text-gray-500">Visitors by browser</p>
        </div>
        <div className="p-6">
          {browserData.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No browser data yet</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={browserData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="visitors"
                    nameKey="browser"
                  >
                    {browserData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BROWSER_COLORS[index % BROWSER_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} visitors`, 'Visitors']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}