# 🦞 Wibl Portal

Simply connected AI Agents. Design, deploy, and monitor enterprise-grade intelligent assistants through simple conversation.

## Features

- **Conversational Builder**: Create complex AI agents by just talking to Wibl.
- **Precision Knowledge Base**: RAG-powered data grounding for accurate responses.
- **Dynamic Tool Integrations**: Connect your agents to Hubspot, Salesforce, and custom APIs.
- **Multi-Channel Deployment**: Launch on Web, WhatsApp, Slack, Telegram, and Discord with one click.
- **Deep-Dive Analytics**: Monitor sentiment, resolution rates, and user satisfaction.
- **Enterprise Security**: Built-in prompt injection protection and PII redaction.

## Project Structure

- `src/app/(marketing)`: Public marketing site (Pricing, Features, Security, Docs, Contact).
- `src/app/(dashboard)`: Collaborative agent management platform.
- `src/components/ui`: Reusable brand-compliant component library.
- `src/lib/security`: Protection layers (Rate limiting, Injection detection, Audit logging).
- `src/lib/deployment`: Agent provisioning system (Wibl Manager).

## Getting Started

### Prerequisites

- Node.js ≥ 22
- pnpm

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the platform.

## Security

Wibl implements a multi-layer security architecture:
1. **Input Gateway**: Scans for prompt injection and malicious intent.
2. **Redaction Layer**: Automatically identifies and masks PII.
3. **Output Validation**: Prevents system prompt leakage and sensitive data exposure.

## Documentation

Full documentation is available at [/docs](http://localhost:3000/docs) when running locally.
