-- Create team_members table for site collaborators
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'viewer')),
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_id, user_id)
);

-- Create invitations table for pending team invites
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'viewer')),
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  token UUID NOT NULL DEFAULT uuid_generate_v4(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_id, email)
);

-- Create indexes for performance
CREATE INDEX idx_team_members_site_id ON team_members(site_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_invitations_site_id ON invitations(site_id);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_email ON invitations(email);

-- Enable Row Level Security
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Automatically add site owners as team members when they create a site
CREATE OR REPLACE FUNCTION add_site_owner_to_team()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO team_members (site_id, user_id, role, invited_by)
  VALUES (NEW.id, NEW.user_id, 'owner', NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_site_owner_trigger
  AFTER INSERT ON sites
  FOR EACH ROW
  EXECUTE FUNCTION add_site_owner_to_team();

-- RLS Policies for team_members table
CREATE POLICY "Users can view team members for sites they have access to" ON team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members tm 
      WHERE tm.site_id = team_members.site_id 
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Site owners and admins can manage team members" ON team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM team_members tm 
      WHERE tm.site_id = team_members.site_id 
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
    )
  );

-- RLS Policies for invitations table
CREATE POLICY "Users can view invitations for sites they own/admin" ON invitations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members tm 
      WHERE tm.site_id = invitations.site_id 
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Site owners and admins can manage invitations" ON invitations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM team_members tm 
      WHERE tm.site_id = invitations.site_id 
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
    )
  );

-- Update sites table RLS policies to include team members
DROP POLICY "Users can view their own sites" ON sites;
DROP POLICY "Users can update their own sites" ON sites;
DROP POLICY "Users can delete their own sites" ON sites;

CREATE POLICY "Users can view sites they have access to" ON sites
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members tm 
      WHERE tm.site_id = sites.id 
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Site owners can update sites" ON sites
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM team_members tm 
      WHERE tm.site_id = sites.id 
      AND tm.user_id = auth.uid()
      AND tm.role = 'owner'
    )
  );

CREATE POLICY "Site owners can delete sites" ON sites
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM team_members tm 
      WHERE tm.site_id = sites.id 
      AND tm.user_id = auth.uid()
      AND tm.role = 'owner'
    )
  );

-- Update events table RLS policy to include team members
DROP POLICY "Users can view events for their sites" ON events;

CREATE POLICY "Users can view events for sites they have access to" ON events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members tm 
      WHERE tm.site_id = events.site_id 
      AND tm.user_id = auth.uid()
    )
  );