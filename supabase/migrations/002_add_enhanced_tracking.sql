-- Add enhanced tracking columns to events table
ALTER TABLE events ADD COLUMN city TEXT;
ALTER TABLE events ADD COLUMN country TEXT;
ALTER TABLE events ADD COLUMN device_type TEXT; -- mobile, tablet, desktop
ALTER TABLE events ADD COLUMN operating_system TEXT; -- iOS, Android, Windows, macOS, Linux
ALTER TABLE events ADD COLUMN browser TEXT; -- Chrome, Safari, Firefox, Edge, etc.

-- Create indexes for performance on new columns
CREATE INDEX idx_events_country ON events(country);
CREATE INDEX idx_events_device_type ON events(device_type);
CREATE INDEX idx_events_operating_system ON events(operating_system);
CREATE INDEX idx_events_browser ON events(browser);
CREATE INDEX idx_events_city ON events(city);

-- Add index for hourly analytics (for time series charts)
CREATE INDEX idx_events_timestamp_hour ON events(DATE_TRUNC('hour', timestamp));