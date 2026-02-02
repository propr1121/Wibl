-- Telemetry & Usage Tracking
CREATE TABLE usage_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  session_key TEXT,
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  cost_estimate DECIMAL(10, 6) DEFAULT 0.0,
  sentiment_score DECIMAL(3, 2), -- -1.0 to 1.0
  intent_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX usage_metrics_agent_created_idx ON usage_metrics(agent_id, created_at);
CREATE INDEX usage_metrics_user_created_idx ON usage_metrics(user_id, created_at);

-- Daily aggregation for fast dashboard charts
CREATE TABLE daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  total_conversations INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  avg_sentiment DECIMAL(3, 2),
  total_cost DECIMAL(10, 6) DEFAULT 0.0,
  UNIQUE(agent_id, metric_date)
);
