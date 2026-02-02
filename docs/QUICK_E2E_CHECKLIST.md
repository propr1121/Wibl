# 🎯 QUICK E2E VALIDATION CHECKLIST

Copy this checklist and test each item in your browser at **http://localhost:3000**

---

## ✅ CRITICAL PATH TEST (5 minutes)

### 1. Login & Dashboard
```
□ Open http://localhost:3000
□ Login with your Supabase credentials
□ Verify dashboard loads with Activity Stream
□ Check that "Create New Agent" button is visible
```

### 2. Create Test Agent
```
□ Click "Create New Agent"
□ Enter name: "QA Test Bot"
□ Select Intelligence tier
□ Choose channels: Web + WhatsApp
□ Skip knowledge upload
□ Click "Deploy Agent"
□ VERIFY: Success confetti triggers 🎊
□ VERIFY: Redirects to agent console
```

### 3. Agent Console
```
□ Check "Brain Pulse" indicator (should be 🟢 Online)
□ Navigate to "Channels" tab
□ Verify WhatsApp card shows "Not Connected"
□ Navigate to "Live Tester" tab
□ Check connection status shows "ACTIVE"
```

### 4. Live Chat Test
```
□ In Live Tester, type: "Hello, introduce yourself"
□ Press Enter
□ VERIFY: Typing indicator appears
□ VERIFY: Response streams in token-by-token
□ VERIFY: Response completes successfully
□ Hover over agent response
□ VERIFY: "Edit & Train" button appears
```

### 5. RLHF Training
```
□ Click "Edit & Train" on any agent message
□ Change the response text
□ Click "Save & Train"
□ VERIFY: Message updates
□ VERIFY: Success notification
□ Ask the same question again
□ VERIFY: Agent uses corrected knowledge
```

### 6. WhatsApp Pairing
```
□ Go back to "Channels" tab
□ Click "Connect" on WhatsApp card
□ VERIFY: QR code modal opens
□ VERIFY: QR is NOT a placeholder (actual black/white squares)
□ VERIFY: Instructions display
□ Close modal (real scanning requires phone)
```

### 7. Dashboard Analytics
```
□ Navigate to /dashboard
□ VERIFY: Activity Stream shows events
□ VERIFY: Chart displays conversation data
□ Hover over chart points
□ VERIFY: Tooltip shows metrics
□ VERIFY: Workforce Health widget shows stats
```

---

## 🔍 VERIFICATION COMMANDS

Run these in your terminal to verify backend state:

```bash
# Check if agent was created
ls -la ~/.clawdbot/deployments/
# Should show a directory with UUID name

# View generated config
cat ~/.clawdbot/deployments/*/clawdbot.json
# Should show valid JSON with gateway settings

# Check if gateway started
ps aux | grep -i "clawdbot.*gateway" | grep -v grep
# Should show running process

# Check assigned port
cat ~/.clawdbot/deployments/*/clawdbot.json | grep -A2 "gateway"
# Should show port in 19000-19999 range

# Test gateway health
GATEWAY_PORT=$(cat ~/.clawdbot/deployments/*/clawdbot.json | grep "port" | grep -o "[0-9]*")
curl -s http://localhost:$GATEWAY_PORT 2>&1 | head -c 50
# Should respond (even if error, means it's listening)
```

---

## ❌ FAILURE SCENARIOS TO TEST

### Crash Recovery
```
1. Find gateway PID: ps aux | grep gateway
2. Kill it: kill -9 [PID]
3. Wait 5 seconds
4. Verify it restarts automatically
5. Check agent console - should reconnect
```

### Network Interruption
```
1. While chatting, disconnect WiFi
2. Send a message
3. VERIFY: Error message appears
4. Reconnect WiFi
5. Send message again
6. VERIFY: Works correctly
```

### Invalid Input
```
1. Try creating agent with empty name
2. VERIFY: Validation error displays
3. VERIFY: Form doesn't submit
```

---

## 📊 PASS CRITERIA

All items below must be TRUE:

- [ ] Agent creation completes in < 3 seconds
- [ ] Live chat responds in < 2 seconds (first token)
- [ ] QR code generates instantly (< 500ms)
- [ ] No console errors in browser DevTools
- [ ] Process restarts within 5 seconds if killed
- [ ] All data persists after page refresh
- [ ] Activity Stream updates in real-time
- [ ] RLHF corrections save successfully

---

## 🚨 REPORT ISSUES

If any test fails, note:
1. **What you did** (exact steps)
2. **What happened** (actual result)
3. **What you expected** (desired result)
4. **Browser console errors** (F12 → Console tab)
5. **Network tab errors** (F12 → Network tab)

---

## ✅ SIGN-OFF

- **Tester**: ________________
- **Date**: 2026-02-02
- **Browser**: ________________
- **All Tests Passed**: YES / NO
- **Critical Bugs Found**: ___ (count)
- **Platform Ready**: YES / NO

---

**Next Steps After Passing**:
1. Deploy to staging
2. Run load tests (10+ concurrent agents)
3. WhatsApp production pairing with real phone
4. Invite beta users
