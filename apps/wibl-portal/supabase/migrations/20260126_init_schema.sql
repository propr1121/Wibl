-- WIBL PLATFORM DATABASE SCHEMA
-- PROMPT 2.1: Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  business_description TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro', 'business', 'enterprise')),
  subscription_status TEXT DEFAULT 'inactive',
  stripe_customer_id TEXT UNIQUE,
  agent_slots INTEGER DEFAULT 0,
  tool_slots INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- PROMPT 4.1: Agents
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  personality JSONB DEFAULT '{
    "tone": "friendly",
    "customTraits": [],
    "greetingMessage": "Hi! How can I help you today?"
  }'::jsonb,
  capabilities JSONB DEFAULT '{
    "allowedActions": [],
    "restrictedTopics": []
  }'::jsonb,
  knowledge_source_ids UUID[] DEFAULT '{}',
  tool_connection_ids UUID[] DEFAULT '{}',
  context_rules JSONB DEFAULT '{
    "systemPromptAdditions": "",
    "responseFormat": "conversational",
    "maxTokens": 1000
  }'::jsonb,
  deployment JSONB DEFAULT '{
    "status": "draft",
    "channels": [],
    "gatewayUrl": null,
    "deployedAt": null
  }'::jsonb,
  security JSONB DEFAULT '{
    "inputSanitization": true,
    "outputValidation": true,
    "promptInjectionProtection": "strict",
    "piiRedaction": false,
    "rateLimits": {
      "requestsPerMinute": 20,
      "tokensPerHour": 10000
    }
  }'::jsonb,
  stats JSONB DEFAULT '{
    "totalConversations": 0,
    "avgResponseTime": 0,
    "lastActiveAt": null
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX agents_user_id_idx ON agents(user_id);
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own agents" ON agents FOR ALL USING (auth.uid() = user_id);

-- PROMPT 4.3: Knowledge Base
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE knowledge_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('document', 'url', 'text', 'qa_pair')),
  title TEXT NOT NULL,
  content TEXT,
  file_path TEXT,
  source_url TEXT,
  processing_status TEXT DEFAULT 'pending',
  processing_error TEXT,
  chunk_count INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_item_id UUID REFERENCES knowledge_items(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  token_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX knowledge_chunks_embedding_idx ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- PROMPT 5.2: Tool Registry
CREATE TABLE tool_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  category TEXT CHECK (category IN ('communication', 'productivity', 'data', 'automation', 'custom')),
  provider TEXT NOT NULL,
  auth_type TEXT CHECK (auth_type IN ('oauth2', 'api_key', 'webhook', 'none')),
  oauth_config JSONB,
  available_permissions TEXT[],
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')) DEFAULT 'medium',
  available_on_tiers TEXT[] DEFAULT '{pro, business, enterprise}',
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_tool_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tool_registry(id) ON DELETE CASCADE,
  credentials_encrypted TEXT,
  permissions_granted TEXT[],
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  UNIQUE(user_id, tool_id)
);
