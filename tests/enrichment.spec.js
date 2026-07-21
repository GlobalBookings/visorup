const { test, expect } = require('@playwright/test');

test.describe('Article enrichment (Phase 1)', () => {
  test('pilot article renders takeaways, table, pros/cons, FAQ, disclosure, updated date', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/guides/gear/best-adventure-motorcycle-gear-uk');
    await expect(page.locator('.article-takeaways')).toBeVisible();
    await expect(page.locator('.article-takeaways li')).toHaveCount(5);
    await expect(page.locator('.article-table')).toBeVisible();
    await expect(page.locator('.article-table th')).toHaveCount(3);
    await expect(page.locator('.article-proscons .proscons-pros')).toBeVisible();
    await expect(page.locator('.article-proscons .proscons-cons')).toBeVisible();
    await expect(page.locator('.article-faq .faq-item')).toHaveCount(5);
    await expect(page.locator('.article-affiliate-disclosure')).toBeVisible();
    await expect(page.locator('.article-hero-meta')).toContainText('Updated 2026-07-21');
    expect(errors).toEqual([]);
  });

  test('pilot article JSON-LD has @graph with Article, BreadcrumbList, FAQPage, ItemList', async ({ page }) => {
    await page.goto('/guides/gear/best-adventure-motorcycle-gear-uk');
    const ld = await page.locator('#visorup-jsonld').textContent();
    const data = JSON.parse(ld);
    expect(Array.isArray(data['@graph'])).toBe(true);
    const types = data['@graph'].map((n) => n['@type']);
    expect(types).toContain('Article');
    expect(types).toContain('BreadcrumbList');
    expect(types).toContain('FAQPage');
    expect(types).toContain('ItemList');
    const article = data['@graph'].find((n) => n['@type'] === 'Article');
    expect(article.dateModified).toBe('2026-07-21');
  });

  const BUYING = ['best-motorcycle-helmets-uk-2026', 'best-motorcycle-intercoms-uk-2026', 'best-motorcycle-boots-uk-2026'];
  for (const slug of BUYING) {
    test(`buying-guide ${slug} shows enrichment + FAQPage schema`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('/guides/buying-guides/' + slug);
      await expect(page.locator('.article-takeaways')).toBeVisible();
      await expect(page.locator('.article-table')).toBeVisible();
      await expect(page.locator('.article-faq .faq-item').first()).toBeVisible();
      const ld = await page.locator('#visorup-jsonld').textContent();
      const types = JSON.parse(ld)['@graph'].map((n) => n['@type']);
      expect(types).toContain('FAQPage');
      expect(types).toContain('BreadcrumbList');
      expect(errors).toEqual([]);
    });
  }

  test('plain article without enrichment still renders and emits breadcrumb schema', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/guides/routes/best-roads-for-sportsbikes-uk');
    await expect(page.locator('.article-body')).toBeVisible();
    const ld = await page.locator('#visorup-jsonld').textContent();
    const types = JSON.parse(ld)['@graph'].map((n) => n['@type']);
    expect(types).toContain('Article');
    expect(types).toContain('BreadcrumbList');
    expect(errors).toEqual([]);
  });
});
