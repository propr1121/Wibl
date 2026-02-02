INSERT INTO tool_registry (slug, name, description, category, provider, auth_type, risk_level, enabled)
VALUES 
  ('whatsapp-business', 'WhatsApp Business', 'Send and receive messages via Official WhatsApp API.', 'communication', 'Meta', 'oauth2', 'medium', true),
  ('gmail', 'Gmail', 'Draft and send emails, manage labels.', 'communication', 'Google', 'oauth2', 'medium', true),
  ('hubspot', 'HubSpot CRM', 'Create leads, update deals, and log activities.', 'data', 'HubSpot', 'oauth2', 'high', true),
  ('stripe', 'Stripe', 'Generate payment links and check subscription status.', 'automation', 'Stripe', 'api_key', 'high', true),
  ('google-calendar', 'Google Calendar', 'Schedule viewings and management appointments.', 'productivity', 'Google', 'oauth2', 'low', true)
ON CONFLICT (slug) DO NOTHING;
