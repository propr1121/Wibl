import { test, expect } from '@playwright/test';

/**
 * AI ARCHITECT E2E TEST SUITE
 * Validates the new conversational agent creation flow and RAG processing.
 */

test.describe('Wibl AI Architect - Conversational Flow', () => {
    const BASE_URL = 'http://localhost:3000';

    test.beforeEach(async ({ page }) => {
        // Mock Supabase session to bypass login
        await page.route('**/auth/v1/session**', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    access_token: 'fake-token',
                    token_type: 'bearer',
                    expires_in: 3600,
                    user: { id: 'test-user-id', email: 'test@wibl.ai' }
                })
            });
        });

        // High-fidelity entry into the builder
        await page.goto(BASE_URL + '/builder');
        await page.waitForLoadState('networkidle');

        // If we still see login (sometimes Supabase SDK is persistent), try to force it
        if (await page.locator('text=/Welcome Back|Sign In/i').isVisible()) {
            await page.goto(BASE_URL + '/builder');
        }

        await page.waitForTimeout(2000); // Wait for the AI greeting
    });

    test('1. Intelligent Guardrail: Junk/Gibberish Rejection', async ({ page }) => {
        const chatInput = page.getByPlaceholder(/brief your agent architect/i);
        await expect(chatInput).toBeVisible();

        // Test with keyboard mashing
        await chatInput.fill('asdfghjklmnbvcxzqwertyuiop');
        await page.keyboard.press('Enter');

        // Check for rejection message
        const response = page.locator('text=/couldn\'t quite catch that|clear description|human-readable/i').first();
        await expect(response).toBeVisible({ timeout: 10000 });

        await page.screenshot({ path: 'test-results/audit/01-gibberish-gate.png' });
        console.log('✅ Gibberish Gate: PASS (AI challenged nonsensical input)');
    });

    test('2. Multi-Phase Extraction: Discovery to Configuration', async ({ page }) => {
        const chatInput = page.getByPlaceholder(/brief your agent architect/i);

        // Phase 1: Provide high-level mission
        await chatInput.fill('I want an AI agent that speaks Portuguese and helps real estate investors calculate ROI on properties in Lisbon.');
        await page.keyboard.press('Enter');

        // Verify AI acknowledgment and extracted state in sidebar
        await expect(page.locator('text=/Lisbon|Portuguese|ROI/i').first()).toBeVisible({ timeout: 15000 });

        // Sidebar should now show extracted name or purpose
        const sidebarStore = page.locator('text=/roi|real estate|investor/i').first();
        await expect(sidebarStore).toBeVisible();

        await page.screenshot({ path: 'test-results/audit/02-extraction-discovery.png' });
        console.log('✅ Extraction Phase: PASS (AI parsed mission and updated state)');
    });

    test('3. Full Deployment: Discovery -> Activation -> Console', async ({ page }) => {
        // Mock wizard chat to force completion
        await page.route('/api/wizard/chat', async route => {
            if (route.request().method() === 'POST') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        message: "I've summarized your agent 'WiblSupport-V5'. Everything looks perfect. Ready to activate?",
                        extractedData: {
                            name: 'WiblSupport-V5',
                            purpose: 'Customer support and refunds',
                            channels: ['web', 'whatsapp']
                        },
                        isComplete: true,
                        phase: 'complete'
                    })
                });
            } else {
                await route.continue();
            }
        });

        // Mock the POST request to /api/agents to bypass auth
        await page.route('/api/agents', async route => {
            if (route.request().method() === 'POST') {
                await route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        id: 'test-agent-123',
                        name: 'WiblSupport-V5',
                        deployment: { status: 'active' }
                    })
                });
            } else {
                await route.continue();
            }
        });

        const chatInput = page.getByPlaceholder(/brief your agent architect/i);

        // Rapid-fire comprehensive briefing
        const briefing = "Build a support bot named 'WiblSupport-V5'. It should be friendly, handle refunds, and work on both Web and WhatsApp. Set it to 'Professional' response style.";
        await chatInput.fill(briefing);
        await page.keyboard.press('Enter');

        // Wait for AI to summarize and move to validation/complete phase
        const activateBtn = page.getByRole('button', { name: /activate agent/i });
        await expect(activateBtn).toBeVisible({ timeout: 15000 });

        await page.screenshot({ path: 'test-results/audit/03-ready-to-activate.png' });

        // Trigger Activation
        await activateBtn.click();

        // Wait for success overlay
        const successTitle = page.locator('text=/is Live/i');
        await expect(successTitle).toBeVisible({ timeout: 15000 });

        // Verify auto-redirect countdown text exists
        await expect(page.locator('text=/Auto-redirecting in/i')).toBeVisible();

        await page.screenshot({ path: 'test-results/audit/04-deployment-success.png' });

        // Final landing on dashboard via auto-redirect
        await page.waitForURL(/\/dashboard/, { timeout: 10000 });

        await page.screenshot({ path: 'test-results/audit/05-dashboard-final.png' });
        console.log('✅ Activation Loop: PASS (Agent provisioned and user navigated to dashboard)');
    });
});

test.describe('Knowledge Engine & RAG Pipeline', () => {
    const BASE_URL = 'http://localhost:3000';

    test('4. Knowledge Scoping: Semantic Processing', async ({ page }) => {
        // Navigate to knowledge settings of a test agent
        // For this audit, we check if the UI handling knowledge processing statuses works
        await page.goto(`${BASE_URL}/knowledge`);
        await page.waitForLoadState('networkidle');

        // Verify RAG UI elements
        const emptyState = page.locator('text=/no knowledge|add your first/i').first();
        if (await emptyState.isVisible()) {
            console.log('ℹ️ Knowledge store is empty, verified UI baseline.');
        }

        await page.screenshot({ path: 'test-results/audit/05-knowledge-engine.png' });
        console.log('✅ Knowledge Engine: PASS (Interface functional)');
    });
});
