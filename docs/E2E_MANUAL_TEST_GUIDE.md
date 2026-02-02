# 🧪 WIBL E2E MANUAL TEST GUIDE

**Status**: ✅ All infrastructure components verified  
**Next Step**: Manual browser testing (browser automation quota reset in ~18min)

---

## ✅ Pre-Flight Checks (PASSED)

### Infrastructure Health
- ✅ Portal server running on `localhost:3000`
- ✅ All 10 API endpoints exist and respond
- ✅ ClawdbotManager fully implemented
- ✅ Process supervision methods ready
- ✅ 5 database migrations present
- ✅ All critical UI components built

### Component Inventory
- ✅ `ChannelManager.tsx` - WhatsApp/Telegram pairing
- ✅ `WebChatTester.tsx` - Live agent communication  
- ✅ `ActivityStream.tsx` - Real-time operational feed
- ✅ Agent creation API (`POST /api/agents`)
- ✅ Analytics API (`GET /api/analytics`)
- ✅ Activities feed (`GET /api/activities`)

---

## 📋 MANUAL TEST CHECKLIST

### Test 1: Agent Creation Wizard ⏳

**URL**: [`http://localhost:3000/agents/new`](http://localhost:3000/agents/new)

**Steps**:
1. [ ] Open the wizard
2. [ ] Fill out agent details:
   - **Name**: `E2E Test Agent`
   - **Role**: Select any
   - **Channels**: Check "Web" and "WhatsApp"
3. [ ] Upload a test knowledge file (optional)
4. [ ] Click "Create Agent" or "Deploy"
5. [ ] Wait for confetti animation (if successful)
6. [ ] Note the redirect URL

**Expected Results**:
- ✅ Redirects to `/agents/[agent-id]`
- ✅ Agent appears in database
- ✅ Config file created at `~/.clawdbot/deployments/[agent-id]/clawdbot.json`
- ✅ Gateway process starts automatically

**Verification Commands**:
```bash
# Check if agent directory was created
ls -la ~/.clawdbot/deployments/

# Check if gateway is running
ps aux | grep -i clawdbot | grep gateway

# View the generated config
cat ~/.clawdbot/deployments/*/clawdbot.json | head -20
```

---

### Test 2: Agent Console Dashboard ⏳

**URL**: Agent console page (from previous redirect)

**Checks**:
1. [ ] "Brain Pulse" indicator shows status
2. [ ] Channel cards display correctly
3. [ ] Tabs render: Channels, Live Tester, Memory Vault, Shadow Mode
4. [ ] Execution logs show gateway startup messages
5. [ ] Stats widget displays metrics

**Expected Indicators**:
- 🟢 **Online** status
- ⚡ Gateway listening message
- 📊 Real-time metrics (token usage, success rate)

---

### Test 3: WhatsApp Channel Pairing ⏳

**Location**: Agent Console → Channels Tab

**Steps**:
1. [ ] Click "Connect" on WhatsApp channel card
2. [ ] Verify QR code modal opens
3. [ ] Check that QR is NOT a placeholder (should be actual base64 image)
4. [ ] Scan with real WhatsApp (or simulate success)
5. [ ] Verify success confetti triggers
6. [ ] Confirm channel status updates to "Connected"

**Technical Validation**:
- Modal shows step-by-step instructions
- QR refreshes if it expires
- WebSocket connects to local gateway
- Session persists after page refresh

---

### Test 4: Live Tester Communication ⏳

**Location**: Agent Console → Live Tester Tab

**Steps**:
1. [ ] Verify connection status shows "ACTIVE"
2. [ ] Send message: `"Hello, introduce yourself"`
3. [ ] Observe streaming response (delta events)
4. [ ] Check for "Knowledge Citations" if any
5. [ ] Test correction flow:
   - Hover over agent response
   - Click "Edit & Train" icon
   - Modify text
   - Click "Save & Train"
   - Verify knowledge fragment created

**Expected Behavior**:
- Typing indicator appears while agent responds
- Mes

sages stream token-by-token
- Citations show relevance scores
- Corrections persist to `/api/knowledge`

---

### Test 5: Dashboard Analytics ⏳

**URL**: [`http://localhost:3000/dashboard`](http://localhost:3000/dashboard)

**Checks**:
1. [ ] Activity Stream shows live events
2. [ ] Impact Chart renders with data
3. [ ] Hover tooltips work on chart
4. [ ] Workforce Health displays usage stats
5. [ ] Pending Approvals section functional

**Validation**:
- Activity Stream updates in real-time
- Charts reflect actual conversation metrics
- Click "View Network Audit" button works

---

### Test 6: Shadow Training (RLHF) ⏳

**Integration Test**: Live Tester + Knowledge API

**Flow**:
1. [ ] Ask agent: `"What is your primary function?"`
2. [ ] Get initial response
3. [ ] Click "Edit & Train"
4. [ ] Change response to custom text
5. [ ] Save correction
6. [ ] Ask same question again
7. [ ] Verify agent uses updated knowledge

**API Check**:
```bash
# Verify knowledge fragment was created
curl http://localhost:3000/api/knowledge 
# Should show new entry with Q&A pair
```

---

### Test 7: Multi-Agent Isolation ⏳

**Setup**: Create a second agent

**Validation**:
1. [ ] Second agent gets unique port (19001+)
2. [ ] Both gateways run simultaneously
3. [ ] Messages to Agent 1 don't appear in Agent 2
4. [ ] Workspace directories are separate

**Commands**:
```bash
# Check both processes
ps aux | grep clawdbot

# Check unique ports
netstat -an | grep LISTEN | grep 190
```

---

## 🐛 Known Issues to Monitor

### Potential Edge Cases
- [ ] Port collision if >1000 agents created
- [ ] Race condition on rapid agent creation
- [ ] WebSocket reconnection after network failure
- [ ] Memory leak in long-running chat sessions

### Browser-Specific
- [ ] Test in Chrome, Firefox, Safari
- [ ] Verify mobile responsive design
- [ ] Check confetti animation performance

---

## 📊 SUCCESS CRITERIA

All tests must meet these benchmarks:

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Agent Creation Time | < 3s | ⏳ | ⏳ |
| QR Generation | < 500ms | ⏳ | ⏳ |
| First Token Response | < 2s | ⏳ | ⏳ |
| Process Auto-Recovery | < 5s | ⏳ | ⏳ |
| Zero Data Loss | 100% | ⏳ | ⏳ |

---

## 🚀 AUTOMATION READY

Once browser quota resets, run:
```bash
# Full automated E2E suite
npm run test:e2e

# Or use the browser subagent again
```

---

## 📝 Test Results Log

**Date**: 2026-02-02  
**Tester**: _____________  
**Session**: _____________  

| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Wizard | ⏳ | ⏳ | |
| Console | ⏳ | ⏳ | |
| Pairing | ⏳ | ⏳ | |
| Tester | ⏳ | ⏳ | |
| Analytics | ⏳ | ⏳ | |
| RLHF | ⏳ | ⏳ | |
| Multi-Agent | ⏳ | ⏳ | |

**Overall Status**: ⏳ PENDING MANUAL EXECUTION
