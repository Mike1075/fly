-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id BIGSERIAL PRIMARY KEY,
  player_id TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on score for faster leaderboard queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);

-- Create players table (optional - for storing player stats)
CREATE TABLE IF NOT EXISTS players (
  id BIGSERIAL PRIMARY KEY,
  player_id TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  total_kills INTEGER DEFAULT 0,
  total_deaths INTEGER DEFAULT 0,
  total_playtime INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game sessions table (optional - for analytics)
CREATE TABLE IF NOT EXISTS game_sessions (
  id BIGSERIAL PRIMARY KEY,
  player_id TEXT NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  kills INTEGER DEFAULT 0,
  deaths INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 0,
  FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE
);

-- Enable Row Level Security (RLS)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to leaderboard"
  ON leaderboard FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to players"
  ON players FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated write access (using service role)
CREATE POLICY "Allow service role to insert/update leaderboard"
  ON leaderboard FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow service role to insert/update players"
  ON players FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow service role to insert/update game_sessions"
  ON game_sessions FOR ALL
  TO service_role
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on leaderboard
CREATE TRIGGER update_leaderboard_updated_at
  BEFORE UPDATE ON leaderboard
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
