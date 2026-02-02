#!/bin/bash

# Wibl E2E Test Suite - Master Runner
# Executes all test categories systematically

echo "🚀 WIBL E2E TEST SUITE - SYSTEMATIC EXECUTION"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results directory
RESULTS_DIR="apps/wibl-portal/test-results"
mkdir -p "$RESULTS_DIR/wizard" "$RESULTS_DIR/components" "$RESULTS_DIR/console"

echo -e "${BLUE}📁 Test results will be saved to: $RESULTS_DIR${NC}"
echo ""

# Function to run a test suite
run_test_suite() {
    local suite_name=$1
    local test_file=$2
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}▶ Running: $suite_name${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    cd apps/wibl-portal
    npx playwright test "$test_file" --project=chromium --reporter=list
    local exit_code=$?
    cd ../..
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✅ $suite_name PASSED${NC}"
    else
        echo -e "${YELLOW}⚠️  $suite_name had failures (exit code: $exit_code)${NC}"
    fi
    
    echo ""
    return $exit_code
}

# Track results
declare -a RESULTS
declare -a SUITE_NAMES

# TEST 1: Component Tests (no dependencies)
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}   PHASE 1: COMPONENT TESTS (Standalone)   ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""

run_test_suite "Component Tests" "tests/e2e/component-tests.spec.ts"
RESULTS+=($?)
SUITE_NAMES+=("Component Tests")

# TEST 2: Wizard Complete Flow
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}     PHASE 2: WIZARD COMPLETE FLOW         ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""

run_test_suite "Wizard Flow (All 10 Steps)" "tests/e2e/wizard-complete.spec.ts"
RESULTS+=($?)
SUITE_NAMES+=("Wizard Flow")

# TEST 3: Original Complete Flow (if exists)
if [ -f "apps/wibl-portal/tests/e2e/complete-flow.spec.ts" ]; then
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo -e "${BLUE}    PHASE 3: LEGACY COMPLETE FLOW TEST    ${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo ""
    
    run_test_suite "Legacy Complete Flow" "tests/e2e/complete-flow.spec.ts"
    RESULTS+=($?)
    SUITE_NAMES+=("Legacy Flow")
fi

# SUMMARY
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   TEST EXECUTION SUMMARY${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

total_suites=${#RESULTS[@]}
passed_suites=0
failed_suites=0

for i in "${!RESULTS[@]}"; do
    if [ "${RESULTS[$i]}" -eq 0 ]; then
        echo -e "  ✅ ${SUITE_NAMES[$i]}: ${GREEN}PASSED${NC}"
        ((passed_suites++))
    else
        echo -e "  ❌ ${SUITE_NAMES[$i]}: ${YELLOW}FAILED${NC}"
        ((failed_suites++))
    fi
done

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  Total Suites: $total_suites"
echo -e "  ${GREEN}Passed: $passed_suites${NC}"
echo -e "  ${YELLOW}Failed: $failed_suites${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Screenshots summary
echo -e "${BLUE}📸 SCREENSHOT SUMMARY${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
find "$RESULTS_DIR" -name "*.png" -type f | wc -l | xargs echo "Total screenshots captured:"
echo ""
echo "View screenshots:"
echo "  - Wizard steps: $RESULTS_DIR/wizard/"
echo "  - Components: $RESULTS_DIR/components/"
echo "  - Console: $RESULTS_DIR/console/"
echo ""

# HTML Report
echo -e "${BLUE}📊 DETAILED REPORTS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Open HTML report:"
echo "  npx playwright show-report"
echo ""
echo "Or view at:"
echo "  apps/wibl-portal/playwright-report/index.html"
echo ""

# Exit with failure if any suite failed
if [ $failed_suites -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Some test suites failed. Review results above.${NC}"
    exit 1
else
    echo -e "${GREEN}🎉 ALL TEST SUITES PASSED!${NC}"
    exit 0
fi
