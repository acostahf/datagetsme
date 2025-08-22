import { NextRequest, NextResponse } from 'next/server'
import { getSiteByIdAnonymous } from '@/lib/database/queries'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const { siteId } = await params

    // Verify site exists
    const site = await getSiteByIdAnonymous(siteId)
    if (!site) {
      return new NextResponse('Site not found', { status: 404 })
    }

    // Get the base URL for the tracking endpoint
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXTAUTH_URL || 'https://yourdomain.com'
      : process.env.NEXTAUTH_URL || 'http://localhost:3000'

    // Generate the tracking script
    const script = `
(function() {
  'use strict';
  
  // Don't track if Do Not Track is enabled
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') {
    return;
  }
  
  // Generate or retrieve session ID
  var sessionId = localStorage.getItem('sa_session_id');
  if (!sessionId) {
    sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    localStorage.setItem('sa_session_id', sessionId);
  }
  
  function track() {
    fetch('${baseUrl}/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        site_id: '${siteId}',
        session_id: sessionId,
        page: window.location.pathname,
        referrer: document.referrer || null,
        timestamp: new Date().toISOString()
      })
    }).catch(function() {
      // Silently handle errors to avoid breaking the page
    });
  }
  
  // Track initial page load
  track();
  
  // Track navigation changes (for SPAs)
  var originalPushState = history.pushState;
  var originalReplaceState = history.replaceState;
  
  history.pushState = function() {
    originalPushState.apply(history, arguments);
    setTimeout(track, 0);
  };
  
  history.replaceState = function() {
    originalReplaceState.apply(history, arguments);
    setTimeout(track, 0);
  };
  
  window.addEventListener('popstate', track);
})();
`.trim()

    return new NextResponse(script, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error generating tracking script:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}