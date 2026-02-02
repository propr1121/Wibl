# End-to-End Test Plan: Wibl Platform

**Test Date**: 2026-02-02  
**Objective**: Verify all critical user flows work perfectly from UI to database to engine.

---

## Test Suite 1: Agent Creation Flow

### Test 1.1: Wizard Navigation
- [ ] Open `/agents/new`
- [ ] Complete Step 1: Agent Identity (Name, Role)
- [ ] Complete Step 2: Channel Selection
- [ ] Complete Step 3: Knowledge Upload
- [ ] Submit and verify redirect to Agent Console

**Expected Behavior**:
- Form validation works on all steps
- Cannot proceed without required fields
- Preview cards update in real-time
- Success confetti triggers on creation

### Test 1.2: Database Persistence
- [ ] Verify agent record created in Supabase `agents` table
- [ ] Confirm `user_id` matches authenticated user
- [ ] Check deployment object contains `gatewayUrl` and `status`

### Test 1.3: File System Provisioning
- [ ] Check `~/.clawdbot/deployments/{agent-id}/` directory exists
- [ ] Verify `clawdbot.json` configuration file present
- [ ] Validate JSON schema matches ClawdbotConfig interface
- [ ] Confirm port allocation (19000-19999 range)

---

## Test Suite 2: Process Supervision

### Test 2.1: Automatic Startup
- [ ] After agent creation, verify `gateway.pid` file created
- [ ] Check process is running: `ps aux | grep gateway`
- [ ] Confirm gateway listening on assigned port

### Test 2.2: Health Monitoring
- [ ] Navigate to Agent Console
- [ ] Verify "Brain Pulse" indicator shows "Online"
- [ ] Check execution logs display real-time output

### Test 2.3: Crash Recovery
- [ ] Manually kill the gateway process: `kill -9 {pid}`
- [ ] Wait 5 seconds
- [ ] Verify daemon auto-restarts the process
- [ ] Check UI updates status accordingly

---

## Test Suite 3: Channel Pairing (WhatsApp)

### Test 3.1: QR Generation
- [ ] Click "Connect" on WhatsApp channel card
- [ ] Verify modal opens with QR code
- [ ] Confirm QR is base64 image (not placeholder)
- [ ] Check WebSocket connection to gateway established

### Test 3.2: Scan Simulation
- [ ] Trigger scan event (or use real phone)
- [ ] Verify success screen appears
- [ ] Confirm confetti animation triggers
- [ ] Check channel status updates to "Connected"

### Test 3.3: Session Persistence
- [ ] Refresh the page
- [ ] Verify WhatsApp still shows "Connected"
- [ ] Check auth credentials stored in agent workspace

---

## Test Suite 4: Live Tester & Communication

### Test 4.1: Gateway Handshake
- [ ] Open Live Tester tab
- [ ] Verify WebSocket connection status: "ACTIVE"
- [ ] Check session key generated

### Test 4.2: Message Exchange
- [ ] Send test message: "Hello, what can you do?"
- [ ] Verify message appears in chat window
- [ ] Check agent responds with streaming delta events
- [ ] Confirm final message state

### Test 4.3: Citations & Knowledge
- [ ] Upload a knowledge document
- [ ] Ask question related to uploaded content
- [ ] Verify response includes citation badges
- [ ] Check relevance scores displayed

---

## Test Suite 5: Shadow Training (RLHF)

### Test 5.1: Correction Flow
- [ ] Receive an agent response
- [ ] Click "Edit & Train" button
- [ ] Modify the response text
- [ ] Click "Save & Train"
- [ ] Verify correction saved to Knowledge API

### Test 5.2: Knowledge Fragment Creation
- [ ] Check `/api/knowledge` endpoint
- [ ] Verify new fragment created with:
  - Type: 'text'
  - Content: Contains Q&A pair
  - Agent ID: Matches current agent

### Test 5.3: Learning Persistence
- [ ] Ask the same question again
- [ ] Verify agent uses corrected knowledge
- [ ] Check citation references the training fragment

---

## Test Suite 6: Analytics & Telemetry

### Test 6.1: Metrics Collection
- [ ] Send 5 messages to agent
- [ ] Navigate to Dashboard
- [ ] Verify conversation count incremented
- [ ] Check token usage updated

### Test 6.2: Live Charts
- [ ] Hover over Impact Chart data points
- [ ] Verify tooltip shows correct values
- [ ] Check trend indicators (+/- percentages)

### Test 6.3: Activity Stream
- [ ] Verify Activity Pulse shows recent events
- [ ] Check agent avatars display correctly
- [ ] Confirm timestamps are accurate

---

## Test Suite 7: Multi-Agent Coordination

### Test 7.1: Second Agent Creation
- [ ] Create second agent with different channels
- [ ] Verify unique port allocation
- [ ] Confirm both gateways run simultaneously

### Test 7.2: Isolation Testing
- [ ] Send message to Agent 1
- [ ] Verify Agent 2 does not receive it
- [ ] Check workspace directories are separate

---

## Test Suite 8: Error Handling & Edge Cases

### Test 8.1: Invalid Configuration
- [ ] Attempt to create agent without name
- [ ] Verify validation error displayed
- [ ] Check form submission blocked

### Test 8.2: Port Collision
- [ ] Create 10 agents sequentially
- [ ] Verify no port conflicts
- [ ] Confirm all gateways accessible

### Test 8.3: Network Failure
- [ ] Disconnect from internet
- [ ] Verify offline indicators appear
- [ ] Check graceful degradation

---

## Critical Metrics for Success

- **Agent Creation**: < 3 seconds from submit to console
- **QR Generation**: < 500ms
- **Message Response**: < 2 seconds (first token)
- **Process Recovery**: < 5 seconds after crash
- **Zero Data Loss**: All messages/knowledge persisted

---

## Test Execution Log

| Test ID | Status | Issues Found | Resolution |
|---------|--------|--------------|------------|
| 1.1     | ⏳     | -            | -          |
| 1.2     | ⏳     | -            | -          |

**Legend**: ⏳ Pending | ✅ Pass | ❌ Fail | 🔧 Fixed
