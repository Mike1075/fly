# Setup Guide

This guide will help you set up and run the Fly multiplayer flight simulator game.

## Step 1: Install Dependencies

First, install all required dependencies:

```bash
# Install frontend dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

## Step 2: Set Up Supabase

### 2.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the details:
   - Project name: `fly-game` (or any name you prefer)
   - Database password: Choose a strong password
   - Region: Choose closest to you
5. Wait for the project to be created (takes ~2 minutes)

### 2.2 Run the Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Click "New Query"
3. Copy the contents of `supabase/schema.sql` from this project
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

This will create:
- `leaderboard` table - for storing player scores
- `players` table - for player statistics
- `game_sessions` table - for analytics
- Required indexes and policies

### 2.3 Get Your API Keys

1. In Supabase dashboard, go to Settings > API
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)
   - **service_role key** (another long string starting with `eyJ...`)

⚠️ **Important**: The `service_role` key should NEVER be exposed to the client. Only use it in the server.

## Step 3: Configure Environment Variables

### 3.1 Frontend Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_WS_URL=ws://localhost:8080
```

### 3.2 Server Configuration

Create a `.env` file in the server directory:

```bash
cd server
cp .env.example .env
cd ..
```

Edit `server/.env` and add your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
PORT=8080
```

## Step 4: Run the Development Servers

You need to run both the frontend and backend servers.

### Option A: Using Two Terminals (Recommended)

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run server
```

### Option B: Using a Process Manager

Install `concurrently`:
```bash
npm install -g concurrently
```

Then run both servers:
```bash
concurrently "npm run dev" "npm run server"
```

## Step 5: Test the Game

1. Open your browser and go to [http://localhost:3000](http://localhost:3000)
2. Enter a nickname
3. Click "Start Flying"
4. You should see the 3D scene with your plane
5. Use WASD to fly, Space to shoot

### Testing Multiplayer

To test multiplayer functionality:

1. Open the game in two different browser windows (or use incognito mode)
2. Enter different nicknames in each
3. You should see each other's planes in the game
4. Try shooting missiles and see if they synchronize

## Step 6: Verify Supabase Integration

1. Play the game and shoot down another player
2. Go to your Supabase dashboard
3. Navigate to Table Editor > leaderboard
4. You should see entries with player nicknames and scores

## Troubleshooting

### Problem: "Failed to connect to game server"

**Solution:**
- Make sure the server is running (`npm run server`)
- Check that the WebSocket URL in `.env` is correct
- Verify the server is listening on port 8080

### Problem: "Supabase credentials not found"

**Solution:**
- Make sure you created both `.env` files (root and server)
- Check that the environment variable names are correct
- Restart both servers after changing `.env` files

### Problem: Players not syncing

**Solution:**
- Check the browser console for WebSocket errors
- Verify both clients are connected to the same server
- Make sure your firewall isn't blocking port 8080

### Problem: Database errors

**Solution:**
- Verify you ran the `schema.sql` in Supabase SQL Editor
- Check that the tables were created successfully
- Verify your service_role key has the correct permissions

## Production Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_WS_URL` (use your production WebSocket URL)
6. Click "Deploy"

### Backend (Railway)

1. Go to [railway.app](https://railway.app)
2. Click "New Project" > "Deploy from GitHub repo"
3. Select your repository
4. Set the root directory to `server`
5. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `PORT` (Railway will provide this automatically)
6. Deploy!

### Alternative Backend (Render)

1. Go to [render.com](https://render.com)
2. Click "New +" > "Web Service"
3. Connect your GitHub repository
4. Settings:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables
6. Click "Create Web Service"

## Next Steps

Once everything is working:

1. Customize the game (colors, plane models, etc.)
2. Add more features (see Roadmap in README)
3. Optimize performance
4. Add analytics
5. Share with friends!

## Need Help?

If you encounter any issues:

1. Check the browser console for errors (F12)
2. Check the server logs in the terminal
3. Review the Supabase logs in the dashboard
4. Make sure all environment variables are set correctly

Happy flying! ✈️
