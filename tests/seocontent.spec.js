const { test, expect } = require('@playwright/test');

const GUIDES = [
  ['gear', 'best-adventure-motorcycle-gear-uk'],
  ['gear', 'best-cruiser-riding-gear-uk'],
  ['gear', 'best-electric-motorcycle-gear-uk'],
  ['gear', 'green-laning-gear-essentials-uk'],
  ['gear', 'motorcycle-track-day-gear-checklist-uk'],
  ['routes', 'best-roads-for-sportsbikes-uk'],
  ['routes', 'best-electric-motorcycle-routes-uk'],
  ['routes', 'best-green-lanes-uk'],
  ['routes', 'trans-euro-trail-uk-guide'],
  ['bikes', 'green-laning-uk-beginners-guide'],
  ['bikes', 'motorcycle-track-days-uk-beginners-guide'],
  ['destinations', 'best-track-day-circuits-uk']
];

test.describe('New SEO cluster guides', () => {
  for (const [cat, slug] of GUIDES) {
    test(`${cat}/${slug} renders`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('/guides/' + cat + '/' + slug);
      await expect(page.locator('.page-hero-title')).toBeVisible();
      await expect(page.locator('.article-body')).toBeVisible();
      const bodyLen = (await page.locator('.article-body').innerText()).length;
      expect(bodyLen).toBeGreaterThan(1500);
      expect(errors).toEqual([]);
    });
  }
});
