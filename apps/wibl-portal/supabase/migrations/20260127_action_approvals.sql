-- Action Approvals for Human-in-the-loop
CREATE TABLE action_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tool_registry(id),
  action_type TEXT NOT NULL, -- e.g. 'send_whatsapp', 'update_crm'
  parameters JSONB NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'expired')) DEFAULT 'pending',
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  notes TEXT
);

CREATE INDEX action_approvals_user_status_idx ON action_approvals(user_id, status);
