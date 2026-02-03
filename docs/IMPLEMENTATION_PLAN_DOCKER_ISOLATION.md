# Implementation Plan: Enterprise Docker Isolation

This plan outlines the transition from local process-based isolation to true containerized isolation using Docker. This move will upgrade Wibl from a "High-Fidelity Prototype" to an "Enterprise-Grade Workforce" that is secure, scalable, and resilient.

## 🎯 Objective
To wrap every Wibl AI Agent (Clawdbot) in its own secure, resource-constrained, and independent Docker container, managed dynamically by the Wibl Portal.

---

## 🏗️ Phase 1: The Base Image
Build a standardized engine environment that can be spun up in milliseconds.

- [ ] **Clawdbot Base Image**: Create a minimized Alpine-based Docker image containing the Node.js runtime and the Clawdbot core logic.
- [ ] **Multi-Arch Support**: Ensure images run on Intel (x86) and Apple Silicon (ARM) for flexible deployment.
- [ ] **Standardized Entrypoint**: A robust script to initialize the agent using provided environment variables and configuration files.

## 🔒 Phase 2: Secure Provisioning (The "Manager" Refactor)
Upgrade the `ClawdbotManager` to speak the Docker protocol.

- [ ] **Docker SDK Integration**: Integrate `dockerode` or a similar SDK into the `apps/wibl-portal`.
- [ ] **Dynamic Provisioning**: Instead of `child_process.spawn`, use `docker.createContainer()` to launch new agents.
- [ ] **Environment Seeding**: Securely pass API keys (Anthropic, OpenAI) and tokens only into the container's environment, never storing them in the image.
- [ ] **Resource Guardrails**: Implement hard limits (e.g., `--memory=512m`, `--cpus=0.5`) to prevent "Noisy Neighbor" scenarios.

## 📁 Phase 3: Persistent Intelligence (Volumes)
Ensuring knowledge and memory survive container restarts.

- [ ] **Isolated Volumes**: Mount a dedicated Docker Volume for each agent's `/workspace` and `/knowledge` directories.
- [ ] **Encryption at Rest**: Ensure the underlying storage for these volumes is encrypted for enterprise compliance.
- [ ] **State Restoration**: If a container fails or the server reboots, Docker's `restart: always` policy combined with persistent volumes ensures the agent resumes exactly where it left off.

## 🌐 Phase 4: Network & Gateway Isolation
Creating a secure network perimeter for the workforce.

- [ ] **Internal Bridge Network**: All agents run on a private internal Docker network, invisible to the public internet.
- [ ] **Unified Gateway**: A single "Traffic Control" point (Nginx or Traefik) that routes external requests (WhatsApp webhooks, Web Chat) to the correct internal container based on the `agent_id`.
- [ ] **SSL Termination**: Centralized SSL management for all agent communication.

---

## 📈 Evolution Strategy

| Stage | Current (Logical Isolation) | Future (Docker Isolation) |
| :--- | :--- | :--- |
| **Execution** | OS Process (Node.js) | Docker Container (Isolated Runtime) |
| **Separation** | File Path isolation | Kernel-level Namespace isolation |
| **Resources** | Shared Host Resources | Hard Capped Limits (CPU/RAM) |
| **Security** | Process-level permissions | Rootless/User-isolated containers |
| **Scale** | Limited by host OS process count | Limited by Node cluster / Swarm / K8s |

---

## 🛠️ Implementation Steps (When Ready)

1. **Refactor `ClawdbotManager`**: Create a `DockerClawdbotProvider` that implements the same interface as our current manager.
2. **Setup Docker Registry**: A private registry to store and version our engine images.
3. **Rollout Canary Infrastructure**: Test the Docker approach on a few agents before migrating the entire workforce.

**This plan transforms Wibl into a "Zero-Trust" platform where every agent is a secure fortress.** 🛡️🚀
