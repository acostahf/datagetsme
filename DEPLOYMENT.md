# DataGetsMe - Production Deployment Guide

This guide walks you through deploying DataGetsMe to Vercel with Supabase as the backend.

## Prerequisites

- [Vercel Account](https://vercel.com) (free tier available)
- [Supabase Account](https://supabase.com) (free tier available)
- [GitHub Account](https://github.com) (for code hosting)
- Domain name (optional - Vercel provides free domains)

## Phase 1: Supabase Production Setup

### 1.1 Create Production Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `DataGetsMe Production`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project provisioning (2-3 minutes)

### 1.2 Configure Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Run the migrations in order:

**Migration 1**: Copy and paste content from `supabase/migrations/001_initial_schema.sql`
**Migration 2**: Copy and paste content from `supabase/migrations/002_add_enhanced_tracking.sql`  
**Migration 3**: Copy and paste content from `supabase/migrations/003_add_team_members.sql`

3. Click "Run" for each migration

### 1.3 Configure Authentication

1. Go to **Authentication** > **Settings**
2. Configure **Site URL**: `https://your-domain.com` (or your Vercel URL)
3. Add **Redirect URLs**:
   - `https://your-domain.com/auth/callback`
   - `https://your-app-name.vercel.app/auth/callback` (if using Vercel domain)
4. **Email Templates** (optional): Customize signup/login emails
5. **SMTP Settings** (optional): Configure custom email provider

### 1.4 Get API Keys

1. Go to **Settings** > **API**
2. Copy these values (you'll need them for Vercel):
   - `Project URL`
   - `anon public` key
   - `service_role` key (click "Reveal" and copy)

## Phase 2: GitHub Repository Setup

### 2.1 Create GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository
2. Name it `datagetsme` or your preferred name
3. Set it to **Public** or **Private** (your choice)
4. **Don't** initialize with README (we already have one)

### 2.2 Push Code to GitHub

```bash
# Add GitHub remote (replace with your username/repo)
git remote add origin https://github.com/YOUR_USERNAME/datagetsme.git

# Push code
git branch -M main
git push -u origin main
```

## Phase 3: Vercel Deployment

### 3.1 Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (auto-detected)

### 3.2 Configure Environment Variables

In Vercel project settings, add these environment variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

```

### 3.3 Deploy

1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Your app will be available at `https://your-app.vercel.app`

## Phase 4: Custom Domain (Optional)

### 4.1 Add Custom Domain

1. In Vercel project settings, go to **Domains**
2. Add your domain: `yourdomain.com`
3. Configure DNS records as shown by Vercel
4. Wait for DNS propagation (up to 24 hours)

### 4.2 Update Domain Configuration

1. The application automatically detects your custom domain
2. No environment variable changes needed
3. Redeploy the project

## Phase 5: Post-Deployment Testing

### 5.1 Authentication Test

1. Visit your deployed app
2. Try signing up with magic link
3. Try signing up with password
4. Verify email works (check Supabase Auth logs if issues)

### 5.2 Analytics Test

1. Log in to your app
2. Add a test site (e.g., `test.com`)
3. Copy the tracking script
4. Create a test HTML file:

```html
<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body>
    <h1>Testing DataGetsMe</h1>
    <!-- Replace YOUR_SITE_ID with actual ID -->
    <script async src="https://your-domain.com/api/script/YOUR_SITE_ID"></script>
</body>
</html>
```

5. Open the file in a browser
6. Check if events appear in your analytics dashboard

### 5.3 Team Management Test

1. Add a site
2. Click "Team" button
3. Invite another email address
4. Verify invitation functionality

## Phase 6: Production Optimizations

### 6.1 Performance Monitoring

1. Set up [Vercel Analytics](https://vercel.com/analytics)
2. Monitor Core Web Vitals
3. Check tracking script performance

### 6.2 Error Monitoring

1. Configure error tracking (Sentry, LogRocket, etc.)
2. Monitor Supabase logs for database errors
3. Set up alerts for critical issues

### 6.3 Security Review

1. Review RLS policies in Supabase
2. Verify API endpoint authentication
3. Test tracking from different domains
4. Ensure environment variables are secure

## Troubleshooting

### Common Issues

**Authentication Not Working**:
- Check Supabase redirect URLs match your deployment domain
- Ensure Supabase Auth is configured with correct redirect URLs
- Verify Site URL in Supabase Auth settings

**Tracking Not Working**:
- Verify CORS headers in next.config.ts
- Check API endpoints are accessible
- Review Supabase RLS policies

**Build Failures**:
- Check Node.js version compatibility
- Verify all environment variables are set
- Review build logs for specific errors

### Support

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## Maintenance

### Regular Tasks

1. **Database Backups**: Enable automatic backups in Supabase
2. **Dependency Updates**: Keep packages updated for security
3. **Performance Monitoring**: Review metrics weekly
4. **Security Updates**: Monitor for security advisories

### Scaling Considerations

- **Database**: Upgrade Supabase plan as you grow
- **Vercel**: Consider Pro plan for better performance
- **CDN**: Implement CDN for global tracking script delivery
- **Analytics**: Consider data archiving for large datasets

---

🎉 **Congratulations!** Your DataGetsMe analytics platform is now live in production!