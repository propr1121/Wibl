#!/bin/bash

# Wibl Manual Testing Companion
# Real-time verification helper

echo "🧪 WIBL MANUAL TESTING COMPANION"
echo "================================="
echo ""
echo "✅ Wizard opened in browser: http://localhost:3000/agents/new"
echo "✅ Test checklist opened in editor"
echo "✅ Playwright report available at: http://localhost:9323"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 QUICK REFERENCE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "STEP 1: Enter Purpose (min 10 characters)"
echo "  Example: 'Handle customer support, schedule appointments, manage refunds'"
echo ""
echo "STEP 2: Agent Identity"
echo "  Name: 'Manual Test Agent'"
echo "  Avatar: Upload or skip"
echo ""
echo "STEP 3: Personality"
echo "  Click: 'Friendly' (recommended)"
echo ""
echo "STEP 4: (Conditional) Custom Personality"
echo "  Only if 'Custom' selected in Step 3"
echo ""
echo "STEP 5: Knowledge Source"
echo "  Click: 'Skip for now' (fastest)"
echo ""
echo "STEP 6: (Conditional) Knowledge Detail"
echo "  Only if Upload/URL selected"
echo ""
echo "STEP 7: Tools & Integrations"
echo "  Select: 'Google Calendar' + 'Enterprise CRM'"
echo "  Click: 'Looks good'"
echo ""
echo "STEP 8: Safety Settings"
echo "  Keep: 'PII Redaction', 'Strict Sandbox'"
echo "  Add: 'Natural Response Delay'"
echo "  Click: 'Looks good'"
echo ""
echo "STEP 9: Channels"
echo "  Select: 'Web Widget' + 'WhatsApp Business'"
echo "  Click: 'Looks good'"
echo ""
echo "STEP 10: Preview & Deploy"
echo "  Verify preview shows your details"
echo "  Click: 'Next: Deployment'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 EXPECTED: Success confetti + redirect to dashboard"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Press Enter to start backend verification..."
read

echo ""
echo "🔍 BACKEND VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check deployment directory
if [ -d "$HOME/.clawdbot/deployments" ]; then
    AGENT_COUNT=$(find "$HOME/.clawdbot/deployments" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')
    echo "✅ Deployment directory exists"
    echo "   Agents found: $AGENT_COUNT"
    
    if [ "$AGENT_COUNT" -gt 0 ]; then
        echo ""
        echo "📁 Latest agent details:"
        LATEST_AGENT=$(find "$HOME/.clawdbot/deployments" -mindepth 1 -maxdepth 1 -type d -print0 | xargs -0 ls -td | head -1)
        echo "   Directory: $(basename "$LATEST_AGENT")"
        
        if [ -f "$LATEST_AGENT/clawdbot.json" ]; then
            echo "   ✅ Config file exists"
            PORT=$(grep -o '"port":[[:space:]]*[0-9]*' "$LATEST_AGENT/clawdbot.json" | grep -o '[0-9]*')
            echo "   Port: $PORT"
        fi
        
        if [ -f "$LATEST_AGENT/gateway.pid" ]; then
            PID=$(cat "$LATEST_AGENT/gateway.pid")
            if ps -p $PID > /dev/null 2>&1; then
                echo "   ✅ Gateway running (PID: $PID)"
            else
                echo "   ⚠️  Gateway not running (stale PID)"
            fi
        else
            echo "   ⚠️  No PID file (gateway may not have started)"
        fi
    fi
else
    echo "⚠️  No deployment directory yet"
    echo "   (Will be created when agent provisions)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏁 MANUAL TEST COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next: Check dashboard at http://localhost:3000/dashboard"
echo "Verify your new agent appears in the list!"
echo ""
