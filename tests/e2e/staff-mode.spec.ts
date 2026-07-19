import { test, expect } from '@playwright/test';

test.describe('Staff Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Switch to staff mode
    const staffButton = page.getByRole('button', { name: /app.staffPortal/i }).or(page.locator('button:has-text("Staff Portal")'));
    await staffButton.click();
  });

  test('should display login screen for staff mode', async ({ page }) => {
    // Should see Staff Access Login
    await expect(page.getByRole('heading', { name: /Staff Portal/i })).toBeVisible();
    await expect(page.getByPlaceholder('Username')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
  });

  test('should allow login and view dashboard', async ({ page }) => {
    // Fill credentials
    await page.getByPlaceholder('Username').fill('admin');
    await page.getByPlaceholder('Password').fill('password');
    await page.getByRole('button', { name: /Authenticate/i }).click();

    // Verify dashboard elements
    await expect(page.getByRole('heading', { name: /Global Command Center/i })).toBeVisible();
    await expect(page.getByText(/Total Attendees/i)).toBeVisible();
    await expect(page.getByText(/Active Incidents/i)).toBeVisible();
    await expect(page.getByText(/Crowd Density/i)).toBeVisible();
  });

  test('should allow interacting with stadium map and camera modal after login', async ({ page }) => {
    // Login
    await page.getByPlaceholder('Username').fill('admin');
    await page.getByPlaceholder('Password').fill('password');
    await page.getByRole('button', { name: /Authenticate/i }).click();

    // Wait for dashboard to load
    await expect(page.getByRole('heading', { name: /Global Command Center/i })).toBeVisible();

    // The StadiumMap SVG should be visible
    const stadiumMap = page.locator('svg.w-full.h-full');
    await expect(stadiumMap).toBeVisible();

    // Click on the North Stand sector (has text "North Stand")
    const northStand = page.locator('g').filter({ hasText: 'North Stand' });
    await northStand.click();

    // Wait for Sector Details to show "North Stand"
    await expect(page.getByRole('heading', { name: /North Stand/i })).toBeVisible();

    // Click "View Camera Feed"
    await page.getByRole('button', { name: /View Camera Feed/i }).click();

    // Camera Modal should appear
    await expect(page.getByRole('heading', { name: /Camera: North Stand/i })).toBeVisible();
    
    // Close Camera Modal
    await page.getByRole('button', { name: /Close Camera Modal/i }).or(page.locator('button[aria-label="Close"]')).click();
    
    // Camera modal should be closed
    await expect(page.getByRole('heading', { name: /Camera: North Stand/i })).not.toBeVisible();
  });
});
