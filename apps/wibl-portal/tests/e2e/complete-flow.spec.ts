import { test, expect } from '@playwright/test';

/**
 * Wibl E2E Test Suite
 * Comprehensive testing from agent creation to live communication
 */

test.describe('Wibl Platform E2E Tests', () => {
    const BASE_URL = 'http://localhost:3000';
    let agentId: string;

    test.beforeEach(async ({ page }) => {
        // Navigate to app
        await page.goto(BASE_URL);
    });

    test('1. Landing page loads successfully', async ({ page }) => {
        await expect(page).toHaveTitle(/Wibl/i);

        // Take screenshot
        await page.screenshot({ path: 'test-results/01-landing-page.png', fullPage: true });

        // Verify key elements
        const hasNavigation = await page.locator('nav').isVisible();
        expect(hasNavigation).toBeTruthy();
    });

    test('2. Authentication flow works', async ({ page }) => {
        // Look for sign in button
        const signInButton = page.getByRole('button', { name: /sign in|login|get started/i }).first();

        if (await signInButton.isVisible()) {
            await signInButton.click();
            await page.screenshot({ path: 'test-results/02-auth-screen.png' });

            // If there's a demo/test mode, use it
            const demoButton = page.getByRole('button', { name: /demo|test|skip/i }).first();
            if (await demoButton.isVisible({ timeout: 2000 }).catch(() => false)) {
                await demoButton.click();
            }
        }
    });

    test('3. Navigate to agent creation wizard', async ({ page }) => {
        // Try multiple navigation paths
        const createAgentButton = page.getByRole('link', { name: /create.*agent|new agent/i }).first();

        if (await createAgentButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await createAgentButton.click();
        } else {
            // Direct navigation
            await page.goto(`${BASE_URL}/agents/new`);
        }

        // Wait for wizard to load
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: 'test-results/03-agent-wizard.png', fullPage: true });

        // Verify wizard is displayed
        expect(page.url()).toContain('/agents/new');
    });

    test('4. Complete agent creation wizard', async ({ page }) => {
        await page.goto(`${BASE_URL}/agents/new`);
        await page.waitForLoadState('networkidle');

        // Step 1: Agent Identity
        const nameInput = page.getByLabel(/agent name|name/i).first();
        await nameInput.fill('E2E Test Agent');

        const roleSelect = page.getByLabel(/role|intelligence|tier/i).first();
        if (await roleSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
            await roleSelect.click();
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
        }

        // Take screenshot of step 1
        await page.screenshot({ path: 'test-results/04-wizard-step1.png' });

        // Click next or continue
        const nextButton = page.getByRole('button', { name: /next|continue/i }).first();
        if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await nextButton.click();
            await page.waitForTimeout(1000);
        }

        // Step 2: Channel Selection
        const webCheckbox = page.getByLabel(/web/i).first();
        if (await webCheckbox.isVisible({ timeout: 2000 }).catch(() => false)) {
            await webCheckbox.check();
        }

        await page.screenshot({ path: 'test-results/05-wizard-step2.png' });

        const nextButton2 = page.getByRole('button', { name: /next|continue/i }).first();
        if (await nextButton2.isVisible({ timeout: 2000 }).catch(() => false)) {
            await nextButton2.click();
            await page.waitForTimeout(1000);
        }

        // Step 3: Create/Deploy
        await page.screenshot({ path: 'test-results/06-wizard-step3.png' });

        const createButton = page.getByRole('button', { name: /create|deploy|submit/i }).first();
        await createButton.click();

        // Wait for creation and potential confetti animation
        await page.waitForTimeout(3000);
        await page.screenshot({ path: 'test-results/07-agent-created.png', fullPage: true });

        // Verify redirect to agent console
        await page.waitForURL(/\/agents\/[a-f0-9-]+/, { timeout: 10000 });
        agentId = page.url().split('/agents/')[1];

        console.log('✅ Agent created with ID:', agentId);
    });

    test('5. Agent console displays correctly', async ({ page }) => {
        // This assumes previous test created an agent
        // In real scenario, you'd create agent in beforeEach or use a known test agent
        await page.goto(`${BASE_URL}/agents/new`);
        await page.waitForLoadState('networkidle');

        // Quick agent creation
        await page.getByLabel(/name/i).first().fill('Console Test Agent');
        await page.getByRole('button', { name: /create|deploy/i }).last().click();

        await page.waitForURL(/\/agents\/[a-f0-9-]+/, { timeout: 10000 });

        // Verify console elements
        await page.screenshot({ path: 'test-results/08-agent-console.png', fullPage: true });

        // Check for Brain Pulse indicator
        const statusIndicator = page.locator('[class*="pulse"], [class*="status"]').first();
        expect(await statusIndicator.isVisible({ timeout: 5000 }).catch(() => false)).toBeTruthy();

        // Check for tabs
        const tabs = ['Channels', 'Live Tester', 'Memory', 'Shadow'];
        for (const tab of tabs) {
            const tabElement = page.getByRole('tab', { name: new RegExp(tab, 'i') }).first();
            if (await tabElement.isVisible({ timeout: 2000 }).catch(() => false)) {
                console.log(`✅ Found tab: ${tab}`);
            }
        }
    });

    test('6. Live Tester WebSocket connection', async ({ page }) => {
        // Navigate to an agent (create quick one for testing)
        await page.goto(`${BASE_URL}/agents/new`);
        await page.getByLabel(/name/i).first().fill('Chat Test Agent');
        await page.getByRole('button', { name: /create|deploy/i }).last().click();
        await page.waitForURL(/\/agents\/[a-f0-9-]+/, { timeout: 10000 });

        // Navigate to Live Tester tab
        const liveTesterTab = page.getByRole('tab', { name: /live.*test|tester/i }).first();
        if (await liveTesterTab.isVisible({ timeout: 3000 }).catch(() => false)) {
            await liveTesterTab.click();
        }

        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'test-results/09-live-tester.png', fullPage: true });

        // Check for connection status
        const connectionStatus = page.locator('text=/active|connected/i').first();
        expect(await connectionStatus.isVisible({ timeout: 10000 }).catch(() => false)).toBeTruthy();
    });

    test('7. Send message and receive response', async ({ page }) => {
        // Create agent and navigate to chat
        await page.goto(`${BASE_URL}/agents/new`);
        await page.getByLabel(/name/i).first().fill('Response Test Agent');
        await page.getByRole('button', { name: /create|deploy/i }).last().click();
        await page.waitForURL(/\/agents\/[a-f0-9-]+/, { timeout: 10000 });

        const liveTesterTab = page.getByRole('tab', { name: /live.*test|tester/i }).first();
        if (await liveTesterTab.isVisible({ timeout: 3000 }).catch(() => false)) {
            await liveTesterTab.click();
        }

        // Wait for connection
        await page.waitForTimeout(3000);

        // Find message input and send message
        const messageInput = page.getByPlaceholder(/message|type/i).first();
        await messageInput.fill('Hello, can you introduce yourself?');

        const sendButton = page.getByRole('button', { name: /send/i }).first();
        await sendButton.click();

        // Wait for response (up to 15 seconds)
        await page.waitForTimeout(15000);
        await page.screenshot({ path: 'test-results/10-chat-response.png', fullPage: true });

        // Verify response appeared
        const chatMessages = page.locator('[class*="message"], [role="log"]');
        const messageCount = await chatMessages.count();
        expect(messageCount).toBeGreaterThan(1); // User message + agent response
    });

    test('8. Dashboard displays analytics', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        await page.screenshot({ path: 'test-results/11-dashboard.png', fullPage: true });

        // Check for Activity Stream
        const activityStream = page.locator('text=/activity.*pulse|operational|live/i').first();
        expect(await activityStream.isVisible({ timeout: 5000 }).catch(() => false)).toBeTruthy();

        // Check for charts
        const chart = page.locator('svg, canvas').first();
        expect(await chart.isVisible({ timeout: 5000 }).catch(() => false)).toBeTruthy();
    });

    test('9. WhatsApp pairing modal opens', async ({ page }) => {
        // Navigate to agent
        await page.goto(`${BASE_URL}/agents/new`);
        await page.getByLabel(/name/i).first().fill('WhatsApp Test Agent');

        // Enable WhatsApp channel
        const whatsappCheckbox = page.getByLabel(/whatsapp/i).first();
        if (await whatsappCheckbox.isVisible({ timeout: 2000 }).catch(() => false)) {
            await whatsappCheckbox.check();
        }

        await page.getByRole('button', { name: /create|deploy/i }).last().click();
        await page.waitForURL(/\/agents\/[a-f0-9-]+/, { timeout: 10000 });

        // Go to Channels tab
        const channelsTab = page.getByRole('tab', { name: /channel/i }).first();
        if (await channelsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
            await channelsTab.click();
        }

        // Click WhatsApp connect button
        const connectButton = page.getByRole('button', { name: /connect/i }).first();
        if (await connectButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await connectButton.click();
            await page.waitForTimeout(2000);

            await page.screenshot({ path: 'test-results/12-whatsapp-qr.png', fullPage: true });

            // Verify QR code modal is visible
            const qrCode = page.locator('img[src*="data:image"], canvas, svg').first();
            expect(await qrCode.isVisible({ timeout: 5000 }).catch(() => false)).toBeTruthy();
        }
    });
});
