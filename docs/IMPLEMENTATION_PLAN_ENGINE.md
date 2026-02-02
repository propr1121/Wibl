# Implementation Plan: Wibl Engine Orchestration & Channel Mastery

This document outlines the Grade A++ implementation for bridging the Wibl Platform with the Clawdbot Engine, focusing on process supervision, seamless channel pairing, and "secret sauce" value-adds.

## 1. Architectural Overview

Wibl acts as the **Control Plane** (UI/DB/Orchestration), while individual Clawdbot instances act as the **Execution Plane** (Logic/Channels).

### Key Components:
- **Wibl Orchestrator**: The backend logic that manages the lifecycle of agent processes.
- **Process Supervisor**: A robust layer (using PM2 or a custom Node supervisor) to ensure agents stay alive.
- **Gateway Proxy**: A secure bridge enabling the Wibl UI to talk to isolated agent gateways for real-time Pairing (QR codes).
- **Multi-Tenant Workspace**: Isolated file systems for each agent's memory, logs, and credentials.

---

## 2. Phase 1: Process Supervision (The "Always-On" Engine)

Currently, we generate configurations but don't start the processes. We need a supervisor that handles the `pnpm clawdbot gateway` lifecycle.

### Steps:
- [x] **Daemon Integration**: Implement a `SupervisorService` that uses `pm2` or `node:child_process` with auto-restart.
- [x] **Dynamic Port Management**: Maintain a registry of assigned ports to prevent collisions.
- [x] **Lifecycle Hooks**:
    - [x] `onStart`: Provisioning files -> Start process.
    - [x] `onCrash`: Auto-restart with exponential backoff -> Alert UI.
    - [x] `onStop`: Graceful shutdown (saves memory/state).

### Secret Sauce: "Heartbeat Health" 💓 (COMPLETE)
Instead of a simple "Online/Offline" toggle, show a "Brain Pulse" in the UI. If the agent is processing a complex task, the pulse animates faster. If it's idle, it glows softly.

---

## 3. Phase 2: Channel Pairing Mastery (COMPLETE)

Allowing users to connect their *own* WhatsApp/Telegram is the core value proposition.

### Steps:
- [x] **Secure Pairing Proxy**: The Wibl Portal API acts as a secure bridge into the internal Gateway.
- [x] **Real-time Socket Forwarding**: Hooked up QR pairing directly to the dashboard.
- [x] **Premium Pairing UI**: 
    - [x] Smooth QR code transitions.
    - [x] Step-by-step guidance ("Open WhatsApp" -> "Linked Devices" -> "Scan").
    - [x] Success confetti once paired.

### Secret Sauce: "Identity Verification" 🛡️ (COMPLETE)
When a user connects a channel, Wibl automatically runs a "Smoke Test" where the agent sends a private message to the user.

---

## 4. Phase 3: The "Wibl Intelligence" Value-Adds (COMPLETE)

Elevating the platform from a "wrapper" to a premium intelligence layer.

### Secret Sauce: "Shadow Mode" 👥 (COMPLETE)
Allow users to "Split Test" prompts side-by-side and promote to live.

### Secret Sauce: "Memory Vault" 🧠 (COMPLETE)
A dedicated tab where the user can see exactly what the agent "learned" about their business today.

---

## 5. Testing & Verification (Grade A++ Standard)

### Integration Tests:
- **Provisioning Test**: Verify that completing the wizard creates the correct folder structure and `clawdbot.json`.
- **Supervision Test**: Manually kill an agent process and verify it restarts within 3 seconds.
- **Port Collision Test**: Attempt to create 10 agents simultaneously and verify no port overlaps.

### Security Audit:
- **Credential Isolation**: Verify that Agent A cannot read Agent B's `auth-profiles.json`.
- **API Lockdown**: Ensure the Gateway Proxy requires the `agentToken` for any pairing request.

---

## 6. Implementation Timeline

1.  **Day 1**: Supervisor Service + Port Registry.
2.  **Day 2**: Gateway Proxy + Real-time QR Pairing UI.
3.  **Day 3**: "Shadow Mode" and Memory Exploration.
4.  **Day 4**: End-to-end testing and Documentation polish.
