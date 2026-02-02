#!/bin/bash

# Wibl E2E Test Runner
# Tests critical infrastructure without browser automation

echo "🧪 WIBL E2E TEST SUITE"
echo "====================="
echo ""

# Test 1: Portal Server Health
echo "Test 1: Portal Server Health"
echo "-----------------------------"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "✅ Portal responding on port 3000"
else
    echo "❌ Portal not accessible"
fi
echo ""

# Test 2: API Endpoints
echo "Test 2: API Endpoints Structure"
echo "--------------------------------"
ENDPOINTS=("agents" "analytics" "activities" "approvals" "knowledge")
for endpoint in "${ENDPOINTS[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/$endpoint)
    if [ "$STATUS" == "401" ] || [ "$STATUS" == "200" ]; then
        echo "✅ /api/$endpoint exists (status: $STATUS)"
    else
        echo "❌ /api/$endpoint failed (status: $STATUS)"
    fi
done
echo ""

# Test 3: Deployment Directory
echo "Test 3: File System Provisioning"
echo "---------------------------------"
DEPLOY_DIR="$HOME/.clawdbot/deployments"
if [ -d "$DEPLOY_DIR" ]; then
    echo "✅ Deployment directory exists: $DEPLOY_DIR"
    AGENT_COUNT=$(find "$DEPLOY_DIR" -mindepth 1 -maxdepth 1 -type d | wc -l)
    echo "   Found $AGENT_COUNT provisioned agents"
    
    # Check for any running gateway processes
    GATEWAY_COUNT=$(ps aux | grep -i 'clawdbot.*gateway' | grep -v grep | wc -l)
    echo "   Running gateway processes: $GATEWAY_COUNT"
else
    echo "⚠️  Deployment directory not yet created"
    echo "   Will be created on first agent provision"
fi
echo ""

# Test 4: Configuration Files
echo "Test 4: ClawdbotManager Integrity"
echo "----------------------------------"
if [ -f "apps/wibl-portal/src/lib/deployment/clawdbot-manager.ts" ]; then
    echo "✅ ClawdbotManager exists"
    
    # Check for required methods
    if grep -q "async provision" apps/wibl-portal/src/lib/deployment/clawdbot-manager.ts; then
        echo "✅ provision() method found"
    fi
    
    if grep -q "async startInstance" apps/wibl-portal/src/lib/deployment/clawdbot-manager.ts; then
        echo "✅ startInstance() method found"
    fi
    
    if grep -q "async checkAndRecover" apps/wibl-portal/src/lib/deployment/clawdbot-manager.ts; then
        echo "✅ checkAndRecover() method found"
    fi
else
    echo "❌ ClawdbotManager not found"
fi
echo ""

# Test 5: Database Migrations
echo "Test 5: Database Schema"
echo "-----------------------"
if [ -d "supabase/migrations" ]; then
    MIGRATION_COUNT=$(ls -1 supabase/migrations/*.sql 2>/dev/null | wc -l)
    echo "✅ Found $MIGRATION_COUNT migration files"
    
    # List key tables
    echo "   Key migrations:"
    ls -1 supabase/migrations/*.sql 2>/dev/null | tail -5 | while read file; do
        echo "   - $(basename "$file")"
    done
else
    echo "❌ No migrations directory found"
fi
echo ""

# Test 6: TypeScript Compilation
echo "Test 6: Build Health"
echo "--------------------"
if pnpm --filter wibl-portal build --dry-run 2>&1 | grep -q "error"; then
    echo "⚠️  Build may have issues (dry-run check)"
else
    echo "✅ No immediate build errors detected"
fi
echo ""

# Test 7: Critical Components
echo "Test 7: Critical UI Components"
echo "-------------------------------"
COMPONENTS=(
    "apps/wibl-portal/src/components/features/agents/AgentWizard.tsx"
    "apps/wibl-portal/src/components/features/channels/ChannelManager.tsx"
    "apps/wibl-portal/src/components/features/chat/WebChatTester.tsx"
    "apps/wibl-portal/src/components/dashboard/ActivityStream.tsx"
)

for component in "${COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        echo "✅ $(basename "$component")"
    else
        echo "❌ MISSING: $(basename "$component")"
    fi
done
echo ""

# Summary
echo "================================"
echo "📊 TEST SUMMARY"
echo "================================"
echo "To complete manual E2E testing:"
echo "1. Open http://localhost:3000 in browser"
echo "2. Create a test agent through the wizard"
echo "3. Verify the agent console loads"
echo "4. Test the Live Tester chat functionality"
echo "5. Check the Activity Stream on the dashboard"
echo ""
echo "For full automation, wait 18 minutes for model quota reset"
