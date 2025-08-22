# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DataGetsMe is a Next.js 15.5.0 MVP Web Analytics SaaS using React 19.1.0, TypeScript, Tailwind CSS v4, and Supabase. The project provides privacy-first web analytics with real-time tracking capabilities.

## Key Commands

- **Development server**: `npm run dev` (starts Next.js dev server with Turbopack)
- **Build**: `npm run build` (builds project with Turbopack)
- **Production**: `npm run start` (starts production server)
- **Linting**: `npm run lint` (runs ESLint with Next.js rules)

## Architecture

### Core Structure
- **Frontend**: Next.js App Router with TypeScript and Tailwind CSS v4
- **Authentication**: Supabase Auth with server/client components
- **Database**: Supabase PostgreSQL with RLS policies
- **Real-time**: Supabase subscriptions for live analytics
- **API Routes**: Next.js API routes for tracking and data management

### Key Directories
- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable React components
- `lib/` - Utility functions, database queries, and auth helpers
- `lib/supabase/` - Supabase client configurations
- `lib/auth/` - Authentication helpers for client and server
- `lib/database/` - Database queries and data management
- `supabase/migrations/` - Database schema migrations

### Core Features
- User authentication (sign-up/sign-in)
- Site management (add domains, get tracking scripts)
- Analytics tracking via lightweight JavaScript
- Real-time visitor counting
- Privacy-first approach (no cookies, respects DNT)
- Analytics dashboard with metrics and charts

## Database Schema

### Main Tables
- `sites` - User websites with domains
- `events` - Analytics events (page views, referrers, sessions)

### Key Queries
- `getUserSites()` - Get user's websites
- `trackEvent()` - Record analytics events
- `getAnalyticsData()` - Retrieve analytics with time filters

## Development Setup

1. Configure Supabase project and update `.env.local`
2. Run database migrations in Supabase SQL editor
3. Start development server with `npm run dev`
4. Test tracking by adding sites and using tracking scripts

See `SETUP.md` for detailed configuration instructions.

## API Endpoints

- `POST /api/track` - Analytics event tracking endpoint
- `GET /api/script/[siteId]` - Dynamic tracking script generation
- `GET/POST /api/sites` - Site management

## Environment Variables Required

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
