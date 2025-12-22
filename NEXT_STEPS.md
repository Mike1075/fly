# Next Steps - Start Your Game! 🚀

Great! All the code is ready and dependencies are installed. Here's what you need to do to get your game running:

## Step 1: Get Supabase API Keys ⚠️ REQUIRED

The environment files are created but need your actual Supabase API keys.

1. **Read this guide**: [GET_SUPABASE_KEYS.md](GET_SUPABASE_KEYS.md)
2. **Go to**: [https://supabase.com/dashboard](https://supabase.com/dashboard)
3. **Select your project**: `wejxhbotghxqyprdckjp`
4. **Navigate to**: Settings > API
5. **Copy TWO keys**:
   - `anon/public` key → Put in `.env`
   - `service_role` key → Put in `server/.env`

The keys should be LONG JWT tokens starting with `eyJ...`

## Step 2: Set Up Database Schema

1. Go to your Supabase dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `supabase/schema.sql`
5. Paste into the SQL editor
6. Click **Run** to create the tables

This creates:
- `leaderboard` table (stores player scores)
- `players` table (player statistics)
- `game_sessions` table (analytics)

## Step 3: Start the Servers

Open **TWO** terminal windows:

### Terminal 1 - Frontend:
```bash
npm run dev
```

Expected output:
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:3000/
```

### Terminal 2 - Backend:
```bash
npm run server
```

Expected output:
```
WebSocket server running on port 8080
Game server started!
```

## Step 4: Play the Game!

1. Open your browser to: **http://localhost:3000**
2. Enter a nickname
3. Click "Start Flying"
4. Use these controls:
   - **WASD / Arrow Keys**: Fly
   - **Space**: Shoot missiles
   - **Shift**: Boost

## Step 5: Test Multiplayer

To test the multiplayer features:

1. Open a second browser window (or use Incognito mode)
2. Go to `http://localhost:3000`
3. Enter a different nickname
4. Both players should see each other!
5. Try shooting missiles at each other
6. Check the leaderboard in the top-right corner

## Verify Everything Works

### ✅ Checklist:

- [ ] Frontend starts without errors
- [ ] Backend starts and shows "Game server started!"
- [ ] Browser shows the 3D scene with a plane
- [ ] You can fly using WASD
- [ ] You can shoot missiles with Space
- [ ] Second player appears when you open another window
- [ ] Scores update in the leaderboard
- [ ] Data appears in Supabase dashboard (Table Editor > leaderboard)

## Troubleshooting

### "Failed to connect to game server"
- Make sure backend is running (`npm run server`)
- Check that port 8080 is not blocked

### "Supabase credentials not found"
- Update `.env` and `server/.env` with correct API keys
- Restart both servers after changing .env files

### Players not syncing
- Check browser console (F12) for errors
- Verify both players are connected to the same backend server

### Database errors
- Make sure you ran `schema.sql` in Supabase SQL Editor
- Check Supabase logs in dashboard

## Project Structure Overview

```
fly/
├── src/                      # Frontend code
│   ├── game/                # Game logic
│   │   ├── Scene.js        # 3D scene setup
│   │   ├── Plane.js        # Player plane & physics
│   │   ├── Missile.js      # Missile system
│   │   └── GameManager.js  # Main game loop
│   ├── network/            # WebSocket client
│   ├── ui/                 # HUD and UI
│   └── config/             # Supabase config
├── server/                  # Backend code
│   └── src/
│       └── server.js       # WebSocket server
├── supabase/               # Database
│   └── schema.sql          # Database schema
└── index.html              # Main HTML
```

## What's Implemented

✅ **Core Features:**
- 3D flight simulation with realistic-ish physics
- Real-time multiplayer (WebSocket)
- Combat system (missiles & hit detection)
- Leaderboard system
- Low-poly graphics
- Minimap
- Kill feed
- Player name tags

✅ **Technical Features:**
- Client-side prediction
- Server-authoritative validation
- State interpolation for smooth movement
- Supabase integration for persistent data
- Responsive design

## Next: Customization Ideas

Once everything works, you can:

1. **Change Colors**: Edit the plane colors in `src/game/Plane.js:51`
2. **Adjust Physics**: Tweak speeds and forces in `src/game/Plane.js:23-29`
3. **Add More Maps**: Create obstacles in `src/game/Scene.js:91`
4. **Custom Skins**: Replace the plane geometry with different shapes
5. **New Game Modes**: Add team deathmatch, capture the flag, etc.

## Production Deployment

When ready to deploy:

1. **Frontend** → Deploy to Vercel (see README.md)
2. **Backend** → Deploy to Railway or Render (see README.md)
3. Update `VITE_WS_URL` to your production WebSocket URL

## Resources

- [Complete Setup Guide](SETUP_GUIDE.md) - Detailed instructions
- [README](README.md) - Full project documentation
- [Three.js Docs](https://threejs.org/docs/) - 3D graphics
- [Supabase Docs](https://supabase.com/docs) - Database

---

**Ready to fly?** Follow the steps above and enjoy your game! ✈️

If you need help, all the documentation is in this folder.
