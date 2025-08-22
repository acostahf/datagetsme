-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create sites table
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, domain)
);

-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  page TEXT NOT NULL,
  referrer TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Create indexes for performance
CREATE INDEX idx_events_site_id ON events(site_id);
CREATE INDEX idx_events_timestamp ON events(timestamp);
CREATE INDEX idx_events_session_id ON events(session_id);
CREATE INDEX idx_sites_user_id ON sites(user_id);

-- Enable Row Level Security
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sites table
CREATE POLICY "Users can view their own sites" ON sites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sites" ON sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sites" ON sites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sites" ON sites
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for events table
CREATE POLICY "Users can view events for their sites" ON events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sites 
      WHERE sites.id = events.site_id 
      AND sites.user_id = auth.uid()
    )
  );

-- Allow anonymous inserts for tracking (we'll validate site ownership in the API)
CREATE POLICY "Allow anonymous event inserts" ON events
  FOR INSERT WITH CHECK (true);