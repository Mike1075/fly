# Fly - Multiplayer Flight Simulator

A browser-based multiplayer flight simulation game built with Three.js, WebSocket, and Supabase.

## Features

- **Real-time Multiplayer**: Fly with other players in real-time
- **Low-Poly Graphics**: Beautiful minimalist 3D graphics
- **Combat System**: Fire missiles and engage in dogfights
- **Leaderboard**: Track your score and compete with others
- **Instant Play**: No registration required - just enter a nickname and fly!

## Tech Stack

- **Frontend**: Three.js, Vite
- **Backend**: Node.js, WebSocket (ws)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (frontend), Railway/Render (backend)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works fine)

### Setup

1. **Clone the repository**

```bash
cd fly
```

2. **Install dependencies**

```bash
# Install frontend dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

3. **Configure Supabase**

- Create a new project on [Supabase](https://supabase.com)
- Go to SQL Editor and run the schema from `supabase/schema.sql`
- Get your project URL and keys from Settings > API

4. **Environment Variables**

Frontend (`.env`):
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_WS_URL=ws://localhost:8080
```

Server (`server/.env`):
```env
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
PORT=8080
```

### Development

Run the development server:

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

Open http://localhost:3000 in your browser.

### Production Build

```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

## Game Controls

- **WASD / Arrow Keys**: Pitch and Roll
- **Space**: Fire Missile
- **Shift**: Boost

## Project Structure

```
fly/
├── src/
│   ├── game/
│   │   ├── Scene.js          # Three.js scene setup
│   │   ├── Plane.js          # Player plane with physics
│   │   ├── Missile.js        # Missile system
│   │   └── GameManager.js    # Main game loop
│   ├── network/
│   │   └── WebSocketClient.js # WebSocket client
│   ├── ui/
│   │   └── UIManager.js      # HUD and UI
│   ├── config/
│   │   └── supabase.js       # Supabase client
│   └── main.js               # Entry point
├── server/
│   └── src/
│       └── server.js         # WebSocket server
├── supabase/
│   └── schema.sql            # Database schema
├── index.html                # HTML template
└── package.json
```

## Architecture

### Client-Server Architecture

```
┌─────────────┐         WebSocket         ┌─────────────┐
│             │◄──────────────────────────►│             │
│   Browser   │    Real-time Updates       │  WS Server  │
│  (Three.js) │                            │  (Node.js)  │
│             │                            │             │
└─────────────┘                            └──────┬──────┘
      │                                           │
      │ HTTP                                      │ REST
      │                                           │
      ▼                                           ▼
┌─────────────────────────────────────────────────────┐
│                    Supabase                         │
│              (PostgreSQL + Realtime)                │
└─────────────────────────────────────────────────────┘
```

### Key Systems

1. **Physics Simulation**: Client-side prediction with server validation
2. **State Synchronization**: 20Hz server updates with client-side interpolation
3. **Combat System**: Hit detection with server-authoritative validation
4. **Leaderboard**: Real-time updates via Supabase

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Backend (Railway/Render)

1. Create new project
2. Connect GitHub repo
3. Set root directory to `server/`
4. Add environment variables
5. Deploy!

## Performance Optimization

- **Instanced Meshes**: For rendering multiple planes efficiently
- **LOD (Level of Detail)**: Reduce polygon count for distant objects
- **Frustum Culling**: Only render visible objects
- **Object Pooling**: Reuse missile objects

## Roadmap

- [ ] Mobile controls (touch joystick)
- [ ] Airplane skins/customization
- [ ] Different game modes (Team Deathmatch, Capture the Flag)
- [ ] Power-ups (shields, speed boost, etc.)
- [ ] Voice chat
- [ ] Spectator mode
- [ ] Replays

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning or building your own game!

## Acknowledgments

- Inspired by [fly.pieter.com](https://fly.pieter.com)
- Built with guidance from the GDD and PRD in this repository

---

**Happy Flying!** ✈️
