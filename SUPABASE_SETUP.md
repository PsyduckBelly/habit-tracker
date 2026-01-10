# Supabase Setup Guide

This guide will help you set up Supabase for cloud sync and workspace sharing features.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account (no credit card required)
3. Create a new project

## Step 2: Get Your Project Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Set Up Database Tables

Run the following SQL in your Supabase SQL Editor (Dashboard → SQL Editor):

```sql
-- Create workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  members TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_public BOOLEAN DEFAULT FALSE
);

-- Create workspace_data table
CREATE TABLE IF NOT EXISTS workspace_data (
  workspace_id UUID PRIMARY KEY REFERENCES workspaces(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_data ENABLE ROW LEVEL SECURITY;

-- Create policies for workspaces
CREATE POLICY "Users can view workspaces they are members of"
  ON workspaces FOR SELECT
  USING (auth.jwt() ->> 'email' = ANY(members));

CREATE POLICY "Users can create workspaces"
  ON workspaces FOR INSERT
  WITH CHECK (auth.jwt() ->> 'email' = created_by);

CREATE POLICY "Users can update workspaces they created or are members of"
  ON workspaces FOR UPDATE
  USING (auth.jwt() ->> 'email' = created_by OR auth.jwt() ->> 'email' = ANY(members));

-- Create policies for workspace_data
CREATE POLICY "Users can view workspace data for workspaces they are members of"
  ON workspace_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_data.workspace_id
      AND (auth.jwt() ->> 'email') = ANY(workspaces.members)
    )
  );

CREATE POLICY "Users can insert workspace data for workspaces they are members of"
  ON workspace_data FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_data.workspace_id
      AND (auth.jwt() ->> 'email') = ANY(workspaces.members)
    )
  );

CREATE POLICY "Users can update workspace data for workspaces they are members of"
  ON workspace_data FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_data.workspace_id
      AND (auth.jwt() ->> 'email') = ANY(workspaces.members)
    )
  );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_workspaces_members ON workspaces USING GIN(members);
```

## Step 5: Configure Authentication

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Enable **Email** provider (it's enabled by default)
3. **Enable Google OAuth** (recommended):
   - Scroll down to find **Google** provider
   - Click **Enable**
   - You'll need to create a Google OAuth app:
     - Go to [Google Cloud Console](https://console.cloud.google.com/)
     - Create a new project or select existing one
     - Enable Google+ API
     - Go to **Credentials** → **Create Credentials** → **OAuth client ID**
     - Application type: **Web application**
     - Authorized redirect URIs: `https://your-project-id.supabase.co/auth/v1/callback`
     - Copy the **Client ID** and **Client Secret** to Supabase
4. Configure email templates if needed (optional)

## Step 6: Set Up Email Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add your site URL to **Redirect URLs**:
   - For local development: `http://localhost:5173`
   - For production: `https://your-username.github.io/habit-tracker/`

## Step 7: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Click "Sign In" in the app
3. Enter your email address
4. Check your email for the magic link
5. Click the link to sign in

## Troubleshooting

### Magic link not working?
- Check that your redirect URL is configured correctly in Supabase
- Check your browser console for errors
- Make sure your `.env` file has the correct values

### Database errors?
- Make sure you've run all the SQL commands above
- Check that RLS policies are enabled
- Verify your user email matches the workspace members array

### Real-time sync not working?
- Make sure you've enabled Realtime for the `workspace_data` table in Supabase
- Go to **Database** → **Replication** and enable replication for `workspace_data`

## Free Tier Limits

Supabase free tier includes:
- 500 MB database storage
- 2 GB bandwidth per month
- 50,000 monthly active users
- Unlimited API requests

This should be more than enough for personal use and small teams!

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)

