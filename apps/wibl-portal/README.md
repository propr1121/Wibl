# 🦞 Wibl Portal

Simply connected AI Agents. Design, deploy, and monitor enterprise-grade intelligent assistants through simple conversation.

## Features

- **Premium Agent Wizard**: Re-architected conversational engine for high-fidelity agent creation and deployment.
- **Precision Knowledge Base**: RAG-powered data grounding supporting PDF, XLS, and URL crawling.
- **Dynamic Tool Integrations**: Connect to Google Calendar, CRM systems, and Secure Payments.
- **Enterprise Safety**: Integrated PII redaction, strict sandboxing, and natural human-like response timing.
- **Multi-Channel Deployment**: One-click launch on WhatsApp Business, Slack Enterprise, Telegram, and Web Widgets.

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
