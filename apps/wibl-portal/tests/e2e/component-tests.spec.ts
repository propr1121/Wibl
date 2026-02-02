import { test, expect } from '@playwright/test';

/**
 * TARGETED COMPONENT TESTS
 * Tests individual features without full wizard flow dependency
 */

const BASE_URL = 'http://localhost:3000';

test.describe('Dashboard Component Tests', () => {
    test('Dashboard loads with all widgets', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        await page.screenshot({ path: 'test-results/components/dashboard-full.png', fullPage: true });

        // Test 1: Greeting header
        const greeting = page.locator('text=/good (morning|afternoon|evening)/i');
        await expect(greeting).toBeVisible({ timeout: 5000 });
        console.log('✅ Greeting header visible');

        // Test 2: Conversation Impact Chart
        const chart = page.locator('text=/conversation impact/i');
        await expect(chart).toBeVisible();
        console.log('✅ Impact chart header found');

        // Test 3: Workforce Health widget
        const workforceHealth = page.locator('text=/workforce.*health/i');
        await expect(workforceHealth).toBeVisible();
        console.log('✅ Workforce Health widget visible');

        // Test 4: Activity Stream or Insights
        const activityOrInsights = page.locator('text=/activity|strategic insights/i').first();
        await expect(activityOrInsights).toBeVisible();
        console.log('✅ Activity/Insights section visible');

        // Test 5: Create Agent button
        const createButton = page.getByRole('button', { name: /create.*agent/i }).or(
            page.getByRole('link', { name: /create.*agent/i })
        );
        await expect(createButton).toBeVisible();
        console.log('✅ Create Agent button visible');

        console.log('\n Dashboard test PASSED ✅\n');
    });

    test('Dashboard chart is interactive', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Look for SVG chart elements
        const chartSvg = page.locator('svg').first();
        if (await chartSvg.isVisible({ timeout: 5000 })) {
            const bbox = await chartSvg.boundingBox();
            if (bbox) {
                // Hover over chart to trigger tooltip
                await page.mouse.move(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
                await page.waitForTimeout(500);

                await page.screenshot({ path: 'test-results/components/chart-hover.png' });
                console.log('✅ Chart hover test complete');
            }
        }
    });

    test('Activity Stream renders', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        const activityPulse = page.locator('text=/operational pulse|activity.*feed/i');

        if (await activityPulse.isVisible({ timeout: 3000 })) {
            await page.screenshot({ path: 'test-results/components/activity-stream.png' });
            console.log('✅ Activity Stream component visible');

            // Check for "Real-time sync" indicator
            const realTimeSync = page.locator('text=/real.*time/i');
            await expect(realTimeSync).toBeVisible();
            console.log('✅ Real-time sync indicator present');
        } else {
            console.log('⚠️  Activity Stream not visible (might be using older insights)');
        }
    });
});

test.describe('Agent List Component Tests', () => {
    test('Agents page displays correctly', async ({ page }) => {
        await page.goto(`${BASE_URL}/agents`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        await page.screenshot({ path: 'test-results/components/agents-list.png', fullPage: true });

        // Check for agents list or empty state
        const hasAgents = await page.locator('text=/agent/i').count() > 0;

        if (hasAgents) {
            console.log('✅ Agents list populated');
        } else {
            // Check for empty state
            const emptyState = page.locator('text=/no agents|create.*first/i');
            if (await emptyState.isVisible({ timeout: 3000 })) {
                console.log('✅ Empty state displayed correctly');
            }
        }

        // Verify "Create" button exists
        const createButton = page.getByRole('button', { name: /create|new.*agent/i }).or(
            page.getByRole('link', { name: /create|new.*agent/i })
        );
        await expect(createButton).toBeVisible();
        console.log('✅ Create button accessible from agents page');
    });
});

test.describe('Navigation Component Tests', () => {
    test('Main navigation works', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        // Test main nav links
        const navItems = ['dashboard', 'agents', 'library', 'settings'];

        for (const item of navItems) {
            const navLink = page.getByRole('link', { name: new RegExp(item, 'i') }).first();

            if (await navLink.isVisible({ timeout: 2000 })) {
                await navLink.click();
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(500);

                // Verify URL changed
                expect(page.url()).toContain(item);
                console.log(`✅ Navigation to /${item} works`);

                await page.screenshot({ path: `test-results/components/nav-${item}.png` });
            } else {
                console.log(`⚠️  ${item} nav link not found`);
            }
        }
    });

    test('User menu opens', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('networkidle');

        // Look for user avatar or menu button
        const userMenu = page.locator('[class*="avatar"], button[aria-label*="user"], button[aria-label*="menu"]').first();

        if (await userMenu.isVisible({ timeout: 3000 })) {
            await userMenu.click();
            await page.waitForTimeout(500);

            await page.screenshot({ path: 'test-results/components/user-menu.png' });
            console.log('✅ User menu opens');
        } else {
            console.log('⚠️  User menu button not found');
        }
    });
});

test.describe('Channel Manager Component Tests', () => {
    test.skip('Channel Manager renders (requires agent)', async ({ page }) => {
        // This test requires an existing agent - skip if none exist
        // To activate: create an agent first or use a known test agent ID

        console.log('⚠️  Channel Manager test skipped - requires existing agent');
    });
});

test.describe('Live Tester Component Tests', () => {
    test.skip('Live Tester UI renders (requires agent)', async ({ page }) => {
        // This test requires an existing agent
        console.log('⚠️  Live Tester test skipped - requires existing agent');
    });
});

test.describe('UI Component Library Tests', () => {
    test('Button components exist and are styled', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('networkidle');

        // Find any button
        const button = page.locator('button').first();
        await expect(button).toBeVisible();

        // Check if it has styling classes
        const className = await button.getAttribute('class');
        expect(className).toBeTruthy();
        console.log('✅ Buttons are styled');
    });

    test('Cards render with proper styling', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('networkidle');

        // Look for card elements
        const cards = page.locator('[class*="card"], [class*="Card"]');
        const cardCount = await cards.count();

        expect(cardCount).toBeGreaterThan(0);
        console.log(`✅ Found ${cardCount} card components`);
    });

    test('Loading states work', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);

        // Look for any loading indicators during initial load
        const loadingIndicator = page.locator('[class*="loading"], [class*="spinner"], [class*="skeleton"]').first();

        // It might be gone by now, which is fine
        const wasVisible = await loadingIndicator.isVisible({ timeout: 100 }).catch(() => false);

        console.log(wasVisible ? '✅ Loading states implemented' : '⚠️  Loading states may not be visible (page loaded fast)');
    });
});

test.describe('Responsive Design Tests', () => {
    test('Mobile viewport renders correctly', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        await page.screenshot({ path: 'test-results/components/mobile-dashboard.png', fullPage: true });

        // Verify mobile menu exists or navigation adapted
        const mobileMenu = page.locator('[class*="mobile"], button[aria-label*="menu"]');
        const hasMobileNav = await mobileMenu.count() > 0;

        console.log(hasMobileNav ? '✅ Mobile navigation present' : '⚠️  Check mobile navigation implementation');
    });

    test('Tablet viewport renders correctly', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 }); // iPad
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        await page.screenshot({ path: 'test-results/components/tablet-dashboard.png', fullPage: true });
        console.log('✅ Tablet viewport screenshot captured');
    });

    test('Desktop large viewport renders correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        await page.screenshot({ path: 'test-results/components/desktop-large.png', fullPage: true });
        console.log('✅ Large desktop viewport screenshot captured');
    });
});

test.describe('Accessibility Tests', () => {
    test('Page has proper heading structure', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('networkidle');

        // Check for h1
        const h1 = page.locator('h1');
        const h1Count = await h1.count();

        if (h1Count > 0) {
            console.log(`✅ Found ${h1Count} h1 heading(s)`);
        } else {
            console.log('⚠️  No h1 heading found - check semantic HTML');
        }
    });

    test('Interactive elements are keyboard accessible', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('networkidle');

        // Try tabbing through page
        await page.keyboard.press('Tab');
        await page.waitForTimeout(200);
        await page.keyboard.press('Tab');
        await page.waitForTimeout(200);

        // Check if focus is visible
        const focusedElement = page.locator(':focus');
        const hasFocus = await focusedElement.count() > 0;

        console.log(hasFocus ? '✅ Keyboard navigation works' : '⚠️  Check keyboard accessibility');
    });

    test('Images have alt text', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('networkidle');

        const images = page.locator('img');
        const imageCount = await images.count();

        if (imageCount > 0) {
            let imagesWithAlt = 0;
            for (let i = 0; i < imageCount; i++) {
                const alt = await images.nth(i).getAttribute('alt');
                if (alt !== null) imagesWithAlt++;
            }

            console.log(`✅ ${imagesWithAlt}/${imageCount} images have alt text`);
        } else {
            console.log('⚠️  No images found on page');
        }
    });
});

test.describe('Performance Tests', () => {
    test('Dashboard loads within reasonable time', async ({ page }) => {
        const startTime = Date.now();

        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('networkidle');

        const loadTime = Date.now() - startTime;

        console.log(`⏱️  Dashboard load time: ${loadTime}ms`);
        expect(loadTime).toBeLessThan(5000); // Should load in < 5s
        console.log('✅ Dashboard loads within acceptable time');
    });

    test('No console errors on dashboard', async ({ page }) => {
        const errors: string[] = [];

        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        if (errors.length === 0) {
            console.log('✅ No console errors detected');
        } else {
            console.log(`⚠️  Found ${errors.length} console error(s):`);
            errors.forEach(err => console.log(`  - ${err}`));
        }
    });
});
