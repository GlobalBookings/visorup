const { test, expect } = require('@playwright/test');

const NEW_BIKES = [
  'honda-transalp-xl750', 'ktm-890-adventure', 'triumph-rocket-3-gt',
  'zero-dsr-x', 'honda-forza-750', 'royal-enfield-interceptor-650'
];
const NEW_GUIDES = [
  'how-to-tour-on-a-sportsbike', 'how-to-tour-on-a-cruiser',
  'how-to-tour-on-an-adventure-bike', 'how-to-tour-on-a-classic-retro-bike'
];

test.describe('New bike detail pages', () => {
  for (const slug of NEW_BIKES) {
    test(`${slug} bike page loads`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('/bikes/' + slug);
      await expect(page.locator('.page-hero-title')).toBeVisible();
      await expect(page.locator('.detail-grid')).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
});

test.describe('New touring guide pages', () => {
  for (const slug of NEW_GUIDES) {
    test(`${slug} guide page loads`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('/guides/bikes/' + slug);
      await expect(page.locator('.page-hero-title')).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
});
