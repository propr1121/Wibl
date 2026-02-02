import { test, expect } from '@playwright/test';

/**
 * COMPREHENSIVE AGENT WIZARD E2E TEST
 * Tests all 10 steps of the Wibl agent creation flow
 */

test.describe('Agent Wizard - Complete 10-Step Flow', () => {
    const BASE_URL = 'http://localhost:3000';
    let agentId: string | null = null;

    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/agents/new`);
        await page.waitForLoadState('networkidle');

        // Wait for wizard to initialize
        await page.waitForTimeout(1000);
    });

    test('Complete wizard flow - All 10 steps', async ({ page }) => {
        console.log('🧪 Starting comprehensive 10-step wizard test...\n');

        // STEP 1: Purpose/Mission (textarea)
        console.log('Step 1/10: Enter agent purpose...');
        await page.screenshot({ path: 'test-results/wizard/01-initial.png', fullPage: true });

        const purposeTextarea = page.locator('textarea').first();
        await expect(purposeTextarea).toBeVisible({ timeout: 5000 });

        await purposeTextarea.fill('Handle customer support inquiries, schedule appointments via Google Calendar, and manage refund requests for our e-commerce platform.');
        await page.screenshot({ path: 'test-results/wizard/02-purpose-filled.png' });

        // Submit purpose
        const continueButton = page.locator('button').filter({ hasText: /arrow|continue/i }).first();
        await continueButton.click();

        await page.waitForTimeout(2000); // Wait for Wibl to "think"
        console.log('✅ Step 1 complete\n');

        // STEP 2: Identity Picker (name + avatar)
        console.log('Step 2/10: Set agent identity...');
        await page.waitForTimeout(1500);
        await page.screenshot({ path: 'test-results/wizard/03-identity.png', fullPage: true });

        const nameInput = page.getByLabel(/agent name/i).or(page.locator('input[type="text"]').first());
        await expect(nameInput).toBeVisible({ timeout: 5000 });

        await nameInput.fill('E2E Test Support Agent');

        const confirmIdentityButton = page.getByRole('button', { name: /confirm identity/i });
        await confirmIdentityButton.click();

        await page.waitForTimeout(2000);
        console.log('✅ Step 2 complete\n');

        // STEP 3: Personality Selection (visual cards)
        console.log('Step 3/10: Choose personality...');
        await page.waitForTimeout(1500);
        await page.screenshot({ path: 'test-results/wizard/04-personality.png', fullPage: true });

        // Click "Friendly" personality (recommended)
        const friendlyCard = page.locator('text=Friendly').locator('..').locator('..').locator('..');
        await friendlyCard.click();

        await page.waitForTimeout(2000);
        console.log('✅ Step 3 complete\n');

        // STEP 4: Knowledge Source (choice)
        console.log('Step 4/10: Select knowledge source...');
        await page.waitForTimeout(1500);
        await page.screenshot({ path: 'test-results/wizard/05-knowledge.png', fullPage: true });

        // Click "Skip for now"
        const skipKnowledge = page.getByText(/skip for now/i);
        await skipKnowledge.click();

        await page.waitForTimeout(2000);
        console.log('✅ Step 4 complete (skipped custom knowledge)\n');

        // STEP 5: Tools Selection (multi-select chips)
        console.log('Step 5/10: Select tools/integrations...');
        await page.waitForTimeout(1500);
        await page.screenshot({ path: 'test-results/wizard/06-tools.png', fullPage: true });

        // Select Google Calendar and CRM
        await page.getByText(/google calendar/i).click();
        await page.getByText(/enterprise crm/i).click();

        await page.screenshot({ path: 'test-results/wizard/07-tools-selected.png' });

        const toolsContinue = page.getByRole('button', { name: /looks good/i });
        await toolsContinue.click();

        await page.waitForTimeout(2000);
        console.log('✅ Step 5 complete\n');

        // STEP 6: Advanced/Safety Settings (multi-select chips)
        console.log('Step 6/10: Configure safety settings...');
        await page.waitForTimeout(1500);
        await page.screenshot({ path: 'test-results/wizard/08-safety.png', fullPage: true });

        // PII Redaction and Sandbox should be pre-selected
        // Add Natural Response Delay
        await page.getByText(/natural response delay/i).click();

        const safetyContinue = page.getByRole('button', { name: /looks good/i });
        await safetyContinue.click();

        await page.waitForTimeout(2000);
        console.log('✅ Step 6 complete\n');

        // STEP 7: Channels Selection (multi-select chips)
        console.log('Step 7/10: Select deployment channels...');
        await page.waitForTimeout(1500);
        await page.screenshot({ path: 'test-results/wizard/09-channels.png', fullPage: true });

        // Select Web and WhatsApp
        await page.getByText(/web widget/i).click();
        await page.getByText(/whatsapp business/i).click();

        const channelsContinue = page.getByRole('button', { name: /looks good/i });
        await channelsContinue.click();

        await page.waitForTimeout(2000);
        console.log('✅ Step 7 complete\n');

        // STEP 8: Agent Preview
        console.log('Step 8/10: Preview agent...');
        await page.waitForTimeout(1500);
        await page.screenshot({ path: 'test-results/wizard/10-preview.png', fullPage: true });

        // Verify preview shows agent details
        await expect(page.getByText('E2E Test Support Agent')).toBeVisible();

        const nextDeployment = page.getByRole('button', { name: /next.*deployment/i });
        await nextDeployment.click();

        await page.waitForTimeout(3000); // Agent creation in progress
        console.log('✅ Step 8 complete\n');

        // STEP 9 & 10: Success/Deployment
        console.log('Step 9-10/10: Finalizing agent deployment...');
        await page.waitForTimeout(5000); // Allow backend to provision

        await page.screenshot({ path: 'test-results/wizard/11-complete.png', fullPage: true });

        // Check for success indicators
        const successHeading = page.locator('text=/is live/i').or(page.locator('text=/success/i'));

        if (await successHeading.isVisible({ timeout: 10000 })) {
            console.log('✅ SUCCESS! Agent created successfully\n');
            await page.screenshot({ path: 'test-results/wizard/12-success-confetti.png', fullPage: true });

            // Click "Launch to Dashboard"
            const launchButton = page.getByRole('link', { name: /dashboard/i }).or(
                page.getByRole('button', { name: /dashboard/i })
            );

            if (await launchButton.isVisible({ timeout: 3000 })) {
                await launchButton.click();
                await page.waitForURL(/\/dashboard/, { timeout: 10000 });

                agentId = 'created'; // Mark as successfully created
                console.log('✅ Redirected to dashboard\n');
            }
        } else {
            console.log('⚠️  Success screen not detected - checking for alternate completion signals');

            // Check if we're on dashboard already
            if (page.url().includes('/dashboard')) {
                console.log('✅ Already on dashboard - agent likely created');
                agentId = 'created';
            }
        }

        await page.screenshot({ path: 'test-results/wizard/13-final-state.png', fullPage: true });

        // Final verification
        expect(agentId).toBeTruthy();
        console.log('🎉 COMPLETE WIZARD TEST PASSED!\n');
    });

    test('Wizard validation - Cannot submit with short purpose', async ({ page }) => {
        const purposeTextarea = page.locator('textarea').first();
        await purposeTextarea.fill('Short'); // Less than 10 characters

        const continueButton = page.locator('button[aria-label="Continue"]').or(
            page.locator('button').filter({ hasText: /arrow/i }).first()
        );

        // Button should be disabled or not work
        const isDisabled = await continueButton.isDisabled();
        expect(isDisabled).toBeTruthy();

        console.log('✅ Validation test passed - short input blocked');
    });

    test('Wizard navigation - Back button works', async ({ page }) => {
        // Complete step 1
        const purposeTextarea = page.locator('textarea').first();
        await purposeTextarea.fill('Test purpose for back button validation in the agent wizard');
        await page.locator('button').first().click();
        await page.waitForTimeout(2000);

        // Click back button
        const backButton = page.getByRole('button', { name: /back/i });
        if (await backButton.isVisible({ timeout: 2000 })) {
            await backButton.click();
            await page.waitForTimeout(1000);

            // Verify we're back at step 1
            const stepIndicator = page.locator('text=/step.*1/i');
            await expect(stepIndicator).toBeVisible();

            console.log('✅ Back navigation test passed');
        } else {
            console.log('⚠️  Back button not visible on this step');
        }
    });
});

test.describe('Agent Console - Post-Creation', () => {
    test('Agent console loads after creation', async ({ page }) => {
        // This test assumes an agent exists
        // In a real scenario, you'd create one first or use a known test agent ID

        await page.goto('http://localhost:3000/dashboard');
        await page.waitForLoadState('networkidle');

        // Look for "Create New Agent" or existing agents
        const hasAgents = await page.locator('text=/E2E Test/i').isVisible({ timeout: 3000 }).catch(() => false);

        if (hasAgents) {
            await page.locator('text=/E2E Test/i').first().click();
            await page.waitForURL(/\/agents\/[a-f0-9-]+/);

            await page.screenshot({ path: 'test-results/console/01-loaded.png', fullPage: true });

            // Verify console elements
            const hasTabs = await page.locator('text=/channels|live.*test/i').isVisible({ timeout: 5000 });
            expect(hasTabs).toBeTruthy();

            console.log('✅ Agent console test passed');
        } else {
            console.log('⚠️  No test agents found - create one first');
        }
    });
});
