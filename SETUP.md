# DataGetsMe Setup Guide

## 1. Supabase Configuration

### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key from Settings > API
4. Note your project reference (from the URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`)
5. Create a personal access token at: https://supabase.com/dashboard/account/tokens

### Update Environment Variables
Edit `.env.local` with your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_string_here

# MCP Configuration (for development)
SUPABASE_ACCESS_TOKEN=your_personal_access_token
SUPABASE_PROJECT_REF=your_project_ref
```

### Run Database Migration
In your Supabase dashboard, go to SQL Editor and run the migration:

```sql
-- Copy and paste the content from supabase/migrations/001_initial_schema.sql
```

Or use the Supabase CLI:
```bash
npx supabase db reset
```

### Configure MCP Integration
1. Update `.mcp.json` with your actual Supabase credentials:
   - Replace `YOUR_PROJECT_REF` with your project reference
   - The `SUPABASE_ACCESS_TOKEN` will be read from your environment variables

2. Restart Claude Code to load the MCP configuration:
   ```bash
   # Exit Claude Code and restart
   ```

3. Verify MCP is working:
   ```bash
   /mcp
   ```
   You should see the Supabase MCP server listed.

## 2. Development Setup

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 3. Testing the Application

### 1. Create an Account
- Go to `http://localhost:3000`
- Click "Get Started" and create an account
- Verify your email (check Supabase Auth settings)

### 2. Add a Site
- After logging in, go to "Sites"
- Add a test domain (e.g., `test.local`)
- Copy the tracking script

### 3. Test Tracking
You can test the tracking in several ways:

#### Option A: Create a Test HTML File
Create a file called `test.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Analytics</title>
</head>
<body>
    <h1>Test Page</h1>
    <p>This page is being tracked.</p>
    
    <!-- Paste your tracking script here -->
    <script async src="http://localhost:3000/api/script/YOUR_SITE_ID"></script>
</body>
</html>
```

#### Option B: Use the Browser Console
Open browser developer tools and paste:

```javascript
fetch('http://localhost:3000/api/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    site_id: 'YOUR_SITE_ID',
    session_id: 'test-session-123',
    page: '/test',
    referrer: 'https://google.com',
    timestamp: new Date().toISOString()
  })
});
```

### 4. View Analytics
- Go to your dashboard
- Click "View Analytics" for your test site
- You should see the tracked events appear

## 4. Features Overview

### Core Features ✅
- User registration and authentication
- Site management (add/remove domains)
- Real-time analytics tracking
- Privacy-first approach (no cookies, respects DNT)
- Analytics dashboard with:
  - Total visitors (unique sessions)
  - Active users (last 5 minutes)
  - Top pages
  - Top referrers
- Lightweight tracking script
- Bot detection

### MVP Complete
The MVP includes all the core requirements:
- ✅ Users can embed a tracking script
- ✅ System records page views, referrers, URLs, timestamps, session IDs
- ✅ Dashboard shows total visitors, active users, pages, referrers
- ✅ Real-time updates using Supabase subscriptions

## 5. Production Deployment

### Environment Variables for Production
Update your `.env.local` for production:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_secure_production_secret
```

### Deploy Steps
1. Deploy to Vercel, Netlify, or your preferred platform
2. Update environment variables in your deployment platform
3. Update the tracking script URLs in the codebase to use your production domain
4. Test the tracking functionality

## 6. Customization

### Adding More Analytics
You can extend the analytics by:
- Adding more event types to the `events` table
- Creating new queries in `lib/database/queries.ts`
- Building new dashboard components

### Styling
- Customize the design by editing Tailwind classes
- Add your own branding and colors
- Modify the landing page content

## 7. MCP Integration Benefits

With Supabase MCP server configured, you can now:

### Database Management
- Query your analytics data directly: "Show me the top 10 pages from the events table"
- Generate migrations: "Create a migration to add a country column to events table"
- Manage schemas: "Show me the structure of the sites table"

### Development Assistance  
- Debug queries: "Why is my getAnalyticsData query slow?"
- Optimize performance: "Suggest indexes for the events table"
- Generate reports: "Create a summary of analytics data for the last week"

### Project Management
- Monitor logs: "Show me recent errors in the Supabase logs"
- Check configurations: "What are my current RLS policies?"
- Manage types: "Generate TypeScript types for my database schema"

### Security Features
- Read-only mode: MCP server is configured in read-only mode for safety
- Project-scoped: Limited to your specific analytics project
- Token-based auth: Secure personal access token authentication

The MCP integration enhances your development workflow by providing direct AI-assisted database management capabilities.

The MVP is now complete and ready for use!