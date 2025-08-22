export default function TestTrackingPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Analytics Test Page</h1>
      <p className="mb-4">This page should trigger analytics tracking when loaded.</p>
      <p className="text-sm text-gray-600">
        Site ID: fc6d9d30-f274-4092-baf8-09b254cdbf9f
      </p>
      
      {/* Load the tracking script */}
      <script 
        src="/api/script/fc6d9d30-f274-4092-baf8-09b254cdbf9f"
        async
      />
    </div>
  )
}