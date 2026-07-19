import { test, expect } from '@playwright/test';

test.describe('Fan Mode', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('should load the fan assistant by default', async ({ page }) => {
    // Check if the Fan Assistant is visible
    await expect(page.getByRole('heading', { name: /app.title/i, includeHidden: true }).or(page.locator('h1'))).toBeVisible();
    
    // Check for the welcome message
    await expect(page.getByText(/Welcome to the stadium!/i)).toBeVisible();
    
    // Check for the input field
    const input = page.getByPlaceholder(/Ask about navigation/i);
    await expect(input).toBeVisible();
  });

  test('should allow user to ask a question and get a response', async ({ page }) => {
    const input = page.getByPlaceholder(/Ask about navigation/i);
    const sendButton = page.getByRole('button', { name: /Send message/i });

    // Type a message
    await input.fill('Where is the nearest restroom?');
    await expect(input).toHaveValue('Where is the nearest restroom?');
    
    // Ensure button is enabled
    await expect(sendButton).toBeEnabled();

    // Click send
    await sendButton.click();

    // The user's message should appear in the chat
    await expect(page.getByText('Where is the nearest restroom?')).toBeVisible();

    // The AI takes 1-2s to respond. Wait for it.
    await expect(page.getByText(/The closest restrooms are located near/i)).toBeVisible({ timeout: 10000 });
  });

  test('should allow using quick suggestion buttons', async ({ page }) => {
    // Find a suggestion button
    const suggestionBtn = page.getByRole('button', { name: /Where's the nearest food/i });
    await expect(suggestionBtn).toBeVisible();

    // Click the suggestion
    await suggestionBtn.click();

    // The message should appear in chat
    await expect(page.getByText(/Where's the nearest food/i).first()).toBeVisible();
  });
});
