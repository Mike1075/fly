# How to Get Supabase API Keys

## Step 1: Access Your Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `wejxhbotghxqyprdckjp`

## Step 2: Navigate to API Settings

1. In the left sidebar, click on **Settings** (gear icon)
2. Click on **API**

## Step 3: Copy Your Keys

You will see several keys on this page. You need TWO specific keys:

### For Frontend (.env in root folder)

Find the section called **Project API keys** and copy:

**anon / public key**
- This is a long JWT token starting with `eyJ...`
- Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long)
- This key is safe to use in the browser

Copy this value and paste it into `.env` as:
```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### For Backend (server/.env)

Find the same section and copy:

**service_role key**
- This is also a long JWT token starting with `eyJ...`
- ⚠️ **IMPORTANT**: This key should NEVER be exposed to the client
- This key has admin privileges

Copy this value and paste it into `server/.env` as:
```
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Verify Your Configuration

After updating the keys, your files should look like:

**`.env` (root folder):**
```env
VITE_SUPABASE_URL=https://wejxhbotghxqyprdckjp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey... (your anon key)
VITE_WS_URL=ws://localhost:8080
```

**`server/.env`:**
```env
SUPABASE_URL=https://wejxhbotghxqyprdckjp.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey... (your service role key)
PORT=8080
```

## Screenshot Reference

In the Supabase API settings page, you should see something like:

```
Project URL
https://wejxhbotghxqyprdckjp.supabase.co

Project API keys
┌──────────────────────────────────────┐
│ anon / public                        │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV... │
│ This key is safe to use in a browser │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ service_role                         │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV... │
│ This key has admin privileges        │
└──────────────────────────────────────┘
```

## Next Steps

Once you have updated both `.env` files with the correct keys:

1. Set up the database schema (see next step)
2. Install dependencies
3. Run the development servers

---

Need help? Check the [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete instructions.
