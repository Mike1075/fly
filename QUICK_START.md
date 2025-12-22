# Quick Start Guide

Get the game running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free)

## Setup Steps

### 1. Install Dependencies (1 minute)

```bash
npm install
cd server && npm install && cd ..
```

### 2. Set Up Supabase (2 minutes)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the contents of `supabase/schema.sql`
3. Get your API keys from Settings > API

### 3. Configure Environment (1 minute)

Create `.env` in the root directory:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_WS_URL=ws://localhost:8080
```

Create `server/.env`:

```env
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-role-key
PORT=8080
```

### 4. Run the Game (1 minute)

Open two terminals:

**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
npm run server
```

### 5. Play!

Open http://localhost:3000 in your browser and start flying!

## Controls

- **WASD / Arrows** - Fly
- **Space** - Shoot
- **Shift** - Boost

---

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)
