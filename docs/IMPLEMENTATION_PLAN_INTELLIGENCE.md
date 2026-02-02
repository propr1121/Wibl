# Implementation Plan: Wibl Intelligence & Knowledge Mastery

This document outlines Phase 2 of the Wibl Platform evolution, focusing on Data Persistence, RAG-powered Knowledge Base, and the "Super Enhancements" that define a Grade A++ enterprise-grade AI experience.

## 1. Phase 4: Persistence & Provisioning (COMPLETE)
Bridge the gap between the conversational Wizard and the physical Clawdbot Engine.

- [x] **Wizard Sink**: Implemented `/api/agents` POST endpoint to persist Wizard data.
- [x] **Physical Bootloader**: UI now triggers `ClawdbotManager.provision()` and `startInstance()` on Launch.
- [x] **Fleets Overview**: Agents dashboard updated to fetch real data and show deployment status.
- [x] **Config Hot-Reload**: Deep-link console loading now retrieves live agent configuration.

## 2. Phase 5: Knowledge & RAG Mastery (COMPLETE)
Transform static documents into an active, searchable intelligence layer.

- [x] **Visual Indexer**: Dashboard shows "Indexing..." status with real-time polling until documents are Ready.
- [x] **URL Auto-Crawler**: Implemented `/api/knowledge` with support for URL-based intelligence gathering.
- [x] **Citation Engine**: Live Tester now visualizes "Sources" used for each response, ensuring RAG transparency.
- [x] **Partitioned Vaults**: Knowledge is bound to specific agents or a Global Library for shared intelligence.

## 3. Phase 6: Skills & Human-in-the-Loop (COMPLETE)
Expand agent capabilities with strict safety controls.

- [x] **Skill Marketplace**: Implemented `/skills` UI for discovering and connecting enterprise tools (WhatsApp, HubSpot, Stripe).
- [x] **Connection Handshake**: Implemented JSON-based "Tool Connections" that persist authorized skills to the database.
- [x] **Action Approval Dashboard**: New "Human-in-the-loop" widget on the Dashboard to review and authorize high-risk agent actions.
- [x] **Execution Logs**: Skill execution now includes "Risk Level" badges and status tracking.

## 4. Phase 7: Autonomous Workforce (COMPLETE)
Ensuring your workforce never sleeps.

- [x] **BrainPulse v2**: Visual indicator for agent health and "Self-Healing" daemon active status.
- [x] **Auto-Recovery**: `ClawdbotManager` daemon monitors and restarts failed agent instances automatically.
- [x] **Real-time Status Sync**: Console state is synchronized with the actual engine process status.

---

## ⚡ Super Enhancements (The "Wibl Advantage")

These enhancements move Wibl from a "Tool" to a "Category Leader."

### A. Blueprint Engine 📐
Instead of starting from scratch, users can choose from premium **Blueprints**:
*   **Real Estate Closer**: Pre-configured with Property Search, Viewing Scheduler, and Contract logic.
*   **E-commerce Guru**: Pre-loaded with Shopify/Stripe integrations and Return Policy templates.
*   **Executive PA**: Specialized in Calendar management, Travel booking, and Email summarization.

### B. Voice Synthesis Preview 🎙️
In the **Live Tester**, add a "Speak" toggle. Uses high-fidelity TTS (ElevenLabs/OpenAI) to let users *hear* their agent's voice during the testing phase. Match the voice to the persona.

### C. "Time Travel" Debugging ⏳
In the **Live Tester**, allow users to click any previous message in the transcript and "Fork" the conversation. 
*   *Utility*: "What if I said X instead of Y?" 
*   *Benefit*: High-speed prompt engineering and edge-case testing.

### D. Automated "Smoke Test" 🚬
Automatically trigger a hidden test run upon every deployment. Wibl "QA Bots" message the new agent with tricky questions to ensure it adheres to safety guidelines before it goes live to customers.

---

## 5. Execution Timeline

1.  **Phase 4 (Persistence)**: Connect Wizard -> DB -> Engine. (Days 5-6)
2.  **Phase 5 (Knowledge)**: Real RAG Indexing & Citations. (Days 7-9)
3.  **Phase 6 (Skills)**: Approval flows and Tool management. (Days 10-12)
4.  **Phase 7 (Analytics)**: Dashboarding and Sentiment. (Days 13-14)
