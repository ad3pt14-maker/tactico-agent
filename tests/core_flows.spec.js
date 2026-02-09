import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Tactico AI Core Flows', () => {
    test.beforeEach(async ({ page }) => {
        // Load the local index.html file
        // Note: In a real CI environment, we would serve this via a local server
        const indexPath = path.join(__dirname, '../docs/index.html');
        // Convert Windows path to File URL format if needed, but Playwright handles absolute paths well usually. 
        // For file:// protocol, we strictly need file:///
        await page.goto(`file:///${indexPath.replace(/\\/g, '/')}`);
    });

    test('should load the landing page', async ({ page }) => {
        await expect(page).toHaveTitle(/Tactico AI/);
        await expect(page.locator('h1')).toContainText('Unlock the Pitch');
        await expect(page.locator('.status-dot')).toBeVisible();
    });

    test('should respond to Quick Prompts (Lamine Yamal)', async ({ page }) => {
        // Click the quick prompt button
        await page.click('text=⚡ Lamine Yamal Stats');

        // Wait for the simulated network delay (800ms defined in app.js) + some buffer
        const agentMessage = page.locator('.message.agent').last();
        await expect(agentMessage).toContainText('ANALYSIS COMPLETE: Lamine Yamal', { timeout: 5000 });
        await expect(agentMessage).toContainText('xG/90: 0.35');
    });

    test('should scout for similar players (Free Text Input)', async ({ page }) => {
        // Type a query
        await page.fill('#agent-input', 'find me creative players');
        await page.click('#send-btn');

        // Check response
        const agentMessage = page.locator('.message.agent').last();
        await expect(agentMessage).toContainText('SCOUTING REPORT', { timeout: 5000 });
        await expect(agentMessage).toContainText('Vinicius Jr');
        await expect(agentMessage).toContainText('Lamine Yamal');
    });

    test('should handle unknown queries gracefully', async ({ page }) => {
        await page.fill('#agent-input', 'blabla unexpected query');
        await page.keyboard.press('Enter');

        const agentMessage = page.locator('.message.agent').last();
        await expect(agentMessage).toContainText('TACTICO ERROR', { timeout: 5000 });
    });
});
