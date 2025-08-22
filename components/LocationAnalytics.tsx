interface LocationAnalyticsProps {
  countries: { country: string; visitors: number }[]
  cities: { city: string; visitors: number }[]
}

export default function LocationAnalytics({ countries, cities }: LocationAnalyticsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Countries */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Countries</h3>
          <p className="text-sm text-gray-500">Visitors by country</p>
        </div>
        <div className="p-6">
          {countries.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No location data yet</p>
          ) : (
            <div className="space-y-4">
              {countries.map((item, index) => (
                <div key={item.country} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-4 w-4">
                      {index + 1}
                    </span>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">
                        {item.country}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      {item.visitors} visitors
                    </span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ 
                          width: `${Math.max(10, (item.visitors / (countries[0]?.visitors || 1)) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Cities */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Cities</h3>
          <p className="text-sm text-gray-500">Visitors by city</p>
        </div>
        <div className="p-6">
          {cities.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No city data yet</p>
          ) : (
            <div className="space-y-4">
              {cities.map((item, index) => (
                <div key={item.city} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-4 w-4">
                      {index + 1}
                    </span>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">
                        {item.city}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      {item.visitors} visitors
                    </span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ 
                          width: `${Math.max(10, (item.visitors / (cities[0]?.visitors || 1)) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}