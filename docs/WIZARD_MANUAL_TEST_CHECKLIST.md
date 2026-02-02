# 📝 WIBL AGENT WIZARD - MANUAL TEST CHECKLIST

**Purpose**: Verify all 10 steps of agent creation work correctly  
**Estimated Time**: 8-10 minutes per run  
**URL**: `http://localhost:3000/agents/new`

---

## STEP 1: Agent Purpose/Mission ✅

**Input Type**: Textarea  
**What to Test**:
- [ ] Page loads with Wibl mascot on left
- [ ] Progress indicator shows "Step 1 of 10"
- [ ] Wibl message asks: "What's the core mission?"
- [ ] Textarea has placeholder text
- [ ] Cannot submit with < 10 characters (button disabled)

**Test Action**:
```
Enter: "Handle customer refunds, schedule viewings via Google Calendar, or manage a waitlist"
```

**Validation**:
- [ ] "Continue" button (arrow icon) becomes enabled
- [ ] Pressing Enter or clicking button advances to Step 2
- [ ] Wibl shows "thinking" animation (loading dots)

**Screenshot**: `step-01-purpose.png`

---

## STEP 2: Agent Identity (Name + Avatar) ✅

**Input Type**: Identity Picker  
**What to Test**:
- [ ] Progress shows "Step 2 of 10"
- [ ] Wibl message includes suggested name (e.g., "HandleBot")
- [ ] Name input pre-filled with suggestion
- [ ] Avatar upload area visible

**Test Action**:
```
Name: "QA Test Agent"
Avatar: Click upload area (optional - can skip)
```

**Validation**:
- [ ] Can edit suggested name
- [ ] Avatar upload works (accepts image files)
- [ ] "Confirm Identity" button visible
- [ ] Clicking button advances to Step 3

**Screenshot**: `step-02-identity.png`

---

## STEP 3: Personality Selection ✅

**Input Type**: Visual Cards  
**What to Test**:
- [ ] Progress shows "Step 3 of 10"
- [ ] Four personality cards displayed:
  - Professional (Navy icon)
  - Friendly (Teal icon, RECOMMENDED badge)
  - Casual (Mint icon)
  - Custom (Gradient icon)

**Test Action**:
```
Click: "Friendly" card (recommended option)
```

**Validation**:
- [ ] Card highlights on hover
- [ ] Clicking card immediately advances (no separate submit)
- [ ] If "Custom" selected, should show Step 4 (custom personality textarea)
- [ ] Progress updates to Step 4 or 5 depending on choice

**Screenshot**: `step-03-personality.png`

---

## STEP 4: Custom Personality (Conditional) 🔀

**Input Type**: Textarea  
**When Shown**: Only if "Custom" selected in Step 3  
**What to Test**:
- [ ] Wibl asks to describe custom persona
- [ ] Textarea for detailed personality input

**Test Action** (if visible):
```
Enter: "A witty tech guru who uses emojis sparingly but effectively"
```

**Validation**:
- [ ] Can enter multi-line text
- [ ] Continue button advances to next step

**Screenshot**: `step-04-custom-personality.png`

---

## STEP 5: Knowledge Source ✅

**Input Type**: Choice Buttons  
**What to Test**:
- [ ] Progress shows correct step number
- [ ] Four options displayed as rounded buttons:
  - Upload Documents (PDF/XLS)
  - Crawl Domain URL
  - Use Vector Memory
  - Skip for now
- [ ] Hovering shows info tooltip below options

**Test Action**:
```
Click: "Skip for now"
```

**Validation**:
- [ ] Info tooltip appears on hover
- [ ] Clicking any option advances immediately
- [ ] If "Upload" or "URL" chosen, next screen shows input field
- [ ] "Skip" goes straight to tools

**Screenshot**: `step-05-knowledge.png`

---

## STEP 6: Knowledge Upload/URL (Conditional) 🔀

**Input Type**: Textarea  
**When Shown**: Only if "Upload Documents" or "Crawl Domain URL" selected  
**What to Test**:
- [ ] Appropriate prompt for selected option
- [ ] Textarea for file description or URL entry

**Test Action** (if "Upload" selected):
```
Enter: "Product catalog PDF and pricing spreadsheet"
```

**Test Action** (if "URL" selected):
```
Enter: "https://yourcompany.com/support"
```

**Validation**:
- [ ] Can enter text
- [ ] Continue button works

**Screenshot**: `step-06-knowledge-detail.png`

---

## STEP 7: Tools & Integrations ✅

**Input Type**: Multi-Select Chips  
**What to Test**:
- [ ] Progress shows correct step
- [ ] Five tool options as clickable chips:
  - Google Calendar API
  - Enterprise CRM
  - Real-time Web Search
  - Secure Payments
  - Auto-Tasker
- [ ] Hovering shows "Deep Dive" info box below
- [ ] Can select multiple

**Test Action**:
```
Select: "Google Calendar API" and "Enterprise CRM"
```

**Validation**:
- [ ] Selected chips show checkmark and teal gradient
- [ ] Unselected chips have white background
- [ ] Info box updates on hover
- [ ] "Looks good" button appears at bottom right
- [ ] Button disabled if nothing selected

**Screenshot**: `step-07-tools.png`

---

## STEP 8: Safety & Performance Settings ✅

**Input Type**: Multi-Select Chips  
**What to Test**:
- [ ] Four safety options:
  - PII Redaction (pre-selected)
  - Strict Sandbox (pre-selected)
  - Natural Response Delay
  - Output Validation
- [ ] Pre-selected items already highlighted
- [ ] Can toggle selections

**Test Action**:
```
Keep: PII Redaction, Strict Sandbox
Add:  Natural Response Delay
```

**Validation**:
- [ ] Can deselect pre-selected items
- [ ] Info tooltips work
- [ ] "Looks good" button enabled

**Screenshot**: `step-08-safety.png`

---

## STEP 9: Channel Selection ✅

**Input Type**: Multi-Select Chips  
**What to Test**:
- [ ] Four channel options:
  - WhatsApp Business
  - Web Widget
  - Slack Enterprise
  - Telegram Bot
- [ ] Display as larger chips with icons
- [ ] Multiple selection allowed

**Test Action**:
```
Select: "Web Widget" and "WhatsApp Business"
```

**Validation**:
- [ ] Selected channels show checkmark
- [ ] Visual feedback on selection
- [ ] "Looks good" button appears

**Screenshot**: `step-09-channels.png`

---

## STEP 10: Agent Preview ✅

**Input Type**: Agent Preview Card  
**What to Test**:
- [ ] Shows agent name "QA Test Agent"
- [ ] Shows avatar (or fallback initial "Q")
- [ ] Displays personality badge ("Friendly")
- [ ] Shows skill count badge
- [ ] Preview chat bubble with greeting
- [ ] Test message input at bottom (non-functional placeholder)

**Test Action**:
```
Click: "Next: Deployment" button
```

**Validation**:
- [ ] Preview card shows all entered information
- [ ] Button says "Next: Deployment" with arrow
- [ ] Clicking triggers agent creation (loading state)

**Screenshot**: `step-10-preview.png`

---

## FINAL: Success & Confetti 🎉

**What to Test**:
- [ ] Loading state while agent provisions (2-5 seconds)
- [ ] Success overlay appears with:
  - Animated confetti particles (teal, coral, navy colors)
  - Large check icon in circular gradient badge
  - Heading: "[Agent Name] is Live."
  - Descriptive text about readiness
- [ ] Two action buttons:
  - "Launch to Dashboard" (primary, teal gradient)
  - "Build another experience" (secondary, text only)

**Test Action**:
```
Click: "Launch to Dashboard"
```

**Validation**:
- [ ] Confetti animation plays (120 particles falling)
- [ ] Success message shows agent name
- [ ] Dashboard button redirects to /dashboard
- [ ] Agent appears in agents list on dashboard

**Screenshot**: `step-11-success-confetti.png`

---

## POST-CREATION VERIFICATION ✅

### Backend Validation
```bash
# Check agent directory created
ls -la ~/.clawdbot/deployments/

# View generated config
cat ~/.clawdbot/deployments/*/clawdbot.json

# Verify gateway process started
ps aux | grep -i "clawdbot.*gateway"

# Check port assignment
cat ~/.clawdbot/deployments/*/clawdbot.json | grep "port"
```

**Expected Results**:
- [ ] Directory exists: `~/.clawdbot/deployments/[agent-uuid]/`
- [ ] File exists: `clawdbot.json` with valid JSON
- [ ] File exists: `gateway.pid` with process ID
- [ ] Process running: Gateway on assigned port (19000-19999 range)

### Dashboard Verification
```
Navigate to: http://localhost:3000/dashboard
```

- [ ] New agent appears in "Your AI Workforce" section
- [ ] Agent card shows name "QA Test Agent"
- [ ] Status shows "ACTIVE" or "ONLINE"
- [ ] Click agent -> navigates to console
- [ ] Console shows selected channels (Web, WhatsApp)

---

## EDGE CASES TO TEST 🔬

### Validation Tests
1. **Short Purpose** (Step 1)
   - [ ] Enter only 5 characters → Button disabled
   - [ ] Enter exactly 10 characters → Button enabled

2. **Empty Name** (Step 2)
   - [ ] Clear the suggested name → Should still allow (uses default)

3. **No Tools Selected** (Step 7)
   - [ ] Don't select any tools → "Looks good" button disabled

4. **No Channels Selected** (Step 9)
   - [ ] Try to proceed without channels → Should block or warn

### Navigation Tests
1. **Back Button**
   - [ ] Click "Back" arrow (top left) after Step 2
   - [ ] Verify returns to Step 1
   - [ ] Data persists when going forward again

2. **Page Refresh**
   - [ ] Refresh page mid-wizard
   - [ ] Verify wizard restarts (data may be lost - expected)

3. **Direct URL Access**
   - [ ] Navigate directly to `/agents/new` while wizard in progress
   - [ ] Should restart wizard (expected behavior)

---

## PASS/FAIL CRITERIA ✅

**PASS if**:
- All 10 steps can be completed without errors
- Agent successfully provisions (backend creates config + starts gateway)
- Success confetti appears
- Dashboard redirect works
- Agent is functional (can access console)

**FAIL if**:
- Any step crashes or shows error
- Cannot advance past a certain step
- Agent creation hangs (> 30 seconds)
- No success screen appears
- Dashboard doesn't show new agent

---

## ISSUE REPORTING TEMPLATE 🐛

```markdown
### Wizard Test Issue

**Step Number**: [1-10]  
**Action Taken**: [What you clicked/entered]  
**Expected Behavior**: [What should happen]  
**Actual Behavior**: [What actually happened]  
**Browser**: [Chrome/Firefox/Safari + version]  
**Console Errors**: [F12 → Console tab - paste errors]  
**Screenshot**: [Attach if possible]  
**Reproducible**: [Yes/No - can you recreate it?]
```

---

## COMPLETION SIGN-OFF ✍️

- **Tester Name**: ________________
- **Date**: ________________
- **Test Run #**: ________________
- **All Steps Passed**: ☐ Yes ☐ No
- **Issues Found**: ☐ 0 ☐ 1 ☐ 2-5 ☐ 5+
- **Agent Successfully Created**: ☐ Yes ☐ No
- **Recommend for Production**: ☐ Yes ☐ No

**Notes**:
_______________________________________________________
_______________________________________________________
_______________________________________________________
