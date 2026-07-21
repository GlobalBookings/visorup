const { test, expect } = require('@playwright/test');

test.describe('E-E-A-T + affiliate trust (Phase 5)', () => {
  test('article shows author bio and team author schema', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/guides/gear/best-touring-helmets-uk');
    await expect(page.locator('.article-author-bio h4')).toHaveText('The VisorUp Team');
    const ld = JSON.parse(await page.locator('#visorup-jsonld').textContent());
    const article = ld['@graph'].find((n) => n['@type'] === 'Article');
    expect(article.author.name).toBe('The VisorUp Team');
    expect(article.author.description).toBeTruthy();
    expect(errors).toEqual([]);
  });

  test('buying-guide affiliate items show a Check latest price link', async ({ page }) => {
    await page.goto('/guides/buying-guides/best-motorcycle-helmets-uk-2026');
    await expect(page.locator('.article-affiliate-cta').first()).toContainText('Check latest price');
  });

  test('infographic page shows author bio', async ({ page }) => {
    await page.goto('/infographics/uk-motorcycle-roads-ranked');
    await expect(page.locator('.article-author-bio h4')).toHaveText('The VisorUp Team');
  });
});
