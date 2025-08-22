'use client'

import { useState } from 'react'
import type { Site } from '@/lib/types/database'
import Link from 'next/link'
import TeamManagement from './TeamManagement'

interface SitesListProps {
  sites: Site[]
}

export default function SitesList({ sites }: SitesListProps) {
  const [copiedScript, setCopiedScript] = useState<string | null>(null)
  const [teamManagementSite, setTeamManagementSite] = useState<string | null>(null)

  const generateTrackingScript = (siteId: string) => {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app'
      : 'http://localhost:3000'
    
    return `<!-- DataGetsMe Tracking Script -->
<script async src="${baseUrl}/api/script/${siteId}"></script>

<!-- Alternative: Inline Script -->
<!--
<script>
(function() {
  'use strict';
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;
  
  var sessionId = localStorage.getItem('sa_session_id');
  if (!sessionId) {
    sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    localStorage.setItem('sa_session_id', sessionId);
  }

  function track() {
    fetch('${baseUrl}/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site_id: '${siteId}',
        session_id: sessionId,
        page: window.location.pathname,
        referrer: document.referrer || null,
        timestamp: new Date().toISOString()
      })
    }).catch(function() {});
  }
  
  track();
  var originalPushState = history.pushState;
  history.pushState = function() {
    originalPushState.apply(history, arguments);
    setTimeout(track, 0);
  };
  window.addEventListener('popstate', track);
})();
</script>
-->`
  }

  const copyToClipboard = async (siteId: string) => {
    const script = generateTrackingScript(siteId)
    try {
      await navigator.clipboard.writeText(script)
      setCopiedScript(siteId)
      setTimeout(() => setCopiedScript(null), 2000)
    } catch (err) {
      console.error('Failed to copy script:', err)
    }
  }

  if (sites.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sites yet</h3>
          <p className="text-gray-500">Add your first site to start tracking analytics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Sites</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {sites.map((site) => (
          <li key={site.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{site.domain}</p>
                    <p className="text-xs text-gray-500">
                      Added {new Date(site.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  href={`/dashboard/analytics/${site.id}`}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Analytics
                </Link>
                <button
                  onClick={() => setTeamManagementSite(site.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Team
                </button>
                <button
                  onClick={() => copyToClipboard(site.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {copiedScript === site.id ? 'Copied!' : 'Copy Script'}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {teamManagementSite && (
        <TeamManagement
          siteId={teamManagementSite}
          isOpen={true}
          onClose={() => setTeamManagementSite(null)}
        />
      )}
    </div>
  )
}