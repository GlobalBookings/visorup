const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders hero section', async ({ page }) => {
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('.hero-title')).toContainText('Britain');
  });

  test('renders featured route card', async ({ page }) => {
    await expect(page.locator('.featured-route-card')).toBeVisible();
  });

  test('renders destination grid with 6 cards', async ({ page }) => {
    const cards = page.locator('.dest-card');
    await expect(cards).toHaveCount(6);
  });

  test('renders ferry guide section on homepage', async ({ page }) => {
    await expect(page.locator('.ferry-guide-card').first()).toBeVisible();
  });

  test('renders newsletter section', async ({ page }) => {
    await expect(page.locator('.newsletter-section')).toBeVisible();
    await expect(page.locator('.newsletter-input')).toBeVisible();
  });

  test('renders footer', async ({ page }) => {
    await expect(page.locator('.site-footer')).toBeVisible();
    await expect(page.locator('.footer-grid')).toBeVisible();
  });

  test('title is correct', async ({ page }) => {
    await expect(page).toHaveTitle(/VisorUp/);
  });
});

test.describe('Navigation (Desktop)', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('mega menu triggers exist', async ({ page }) => {
    await expect(page.locator('.mega-trigger').first()).toBeVisible();
  });

  test('navigating to routes page', async ({ page }) => {
    await page.goto('/routes');
    await expect(page.locator('.page-hero-title')).toContainText('Routes');
    await expect(page).toHaveTitle(/Routes/);
  });

  test('navigating to destinations page', async ({ page }) => {
    await page.goto('/destinations');
    await expect(page.locator('.page-hero-title')).toContainText('Destinations');
    await expect(page).toHaveTitle(/Destinations/);
  });

  test('navigating to ferries page', async ({ page }) => {
    await page.goto('/ferries');
    await expect(page.locator('.page-hero-title')).toContainText('Ferry');
    await expect(page).toHaveTitle(/Ferry/);
  });

  test('navigating to planning page', async ({ page }) => {
    await page.goto('/planning');
    await expect(page.locator('.page-hero-title')).toContainText('Planning');
    await expect(page).toHaveTitle(/Planning/);
  });

  test('logo navigates to home', async ({ page }) => {
    await page.goto('/routes');
    await page.click('.nav-brand');
    await expect(page.locator('.hero-title')).toBeVisible();
  });
});

test.describe('Routes Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/routes');
  });

  test('renders route cards', async ({ page }) => {
    await expect(page.locator('.route-card').first()).toBeVisible();
  });

  test('route card has expected content', async ({ page }) => {
    const card = page.locator('.route-card').first();
    await expect(card).toContainText('Island To Highlands');
  });
});

test.describe('Destinations Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/destinations');
  });

  test('renders all destination cards', async ({ page }) => {
    const cards = page.locator('.dest-card');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(10);
  });

  test('filter pills visible and work', async ({ page }) => {
    const pills = page.locator('.filter-pill');
    await expect(pills.first()).toBeVisible();
    await pills.nth(1).click();
    await expect(page.locator('.dest-card').first()).toBeVisible();
  });

  test('clicking destination navigates to detail', async ({ page }) => {
    await page.locator('a.dest-card[href*="isle-of-skye"]').click();
    await expect(page.locator('.detail-grid')).toBeVisible();
    await expect(page).toHaveTitle(/Isle of Skye/);
  });
});

const DEST_SLUGS = [
  'isle-of-skye', 'glencoe', 'nc500', 'lake-district',
  'yorkshire-dales', 'snowdonia', 'brecon-beacons',
  'outer-hebrides', 'isle-of-man', 'scottish-borders',
  'northumberland', 'jersey', 'guernsey'
];

test.describe('Destination Detail Pages', () => {
  for (const slug of DEST_SLUGS) {
    test(`${slug} page loads with content`, async ({ page }) => {
      await page.goto('/destinations/' + slug);
      await expect(page.locator('.page-hero-title')).toBeVisible();
      await expect(page.locator('.detail-grid')).toBeVisible();
      await expect(page.locator('.detail-main')).toBeVisible();
      await expect(page.locator('.detail-sidebar')).toBeVisible();
      await expect(page.locator('.breadcrumb')).toBeVisible();
    });
  }
});

test.describe('Ferries Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ferries');
  });

  test('renders ferry cards', async ({ page }) => {
    const cards = page.locator('.ferry-full-card');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('clicking ferry navigates to detail', async ({ page }) => {
    await page.locator('.ferry-full-card').filter({ hasText: 'Guernsey' }).first().click();
    await expect(page.locator('.detail-grid')).toBeVisible();
    await expect(page).toHaveTitle(/Guernsey/);
  });
});

const FERRY_SLUGS = [
  'guernsey-to-uk', 'jersey-to-uk', 'isle-of-man',
  'skye-ferry', 'outer-hebrides', 'orkney'
];

test.describe('Ferry Detail Pages', () => {
  for (const slug of FERRY_SLUGS) {
    test(`${slug} ferry page loads`, async ({ page }) => {
      await page.goto('/ferries/' + slug);
      await expect(page.locator('.page-hero-title')).toBeVisible();
      await expect(page.locator('.detail-grid')).toBeVisible();
      await expect(page.locator('.breadcrumb')).toBeVisible();
    });
  }
});

test.describe('Planning Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/planning');
  });

  test('renders planning tools', async ({ page }) => {
    await expect(page.locator('.tools-grid')).toBeVisible();
  });

  test('renders packing checklist', async ({ page }) => {
    await expect(page.locator('.packing-checklist')).toBeVisible();
    await expect(page.locator('.packing-list-site li').first()).toBeVisible();
  });

  test('renders planning tips', async ({ page }) => {
    await expect(page.locator('.planning-tips-grid')).toBeVisible();
  });
});

test.describe('Dark/Light Mode', () => {
  test('toggle switches theme', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('#themeToggle');
    await expect(toggle).toBeVisible();
    const initial = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await toggle.click();
    const switched = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(initial).not.toBe(switched);
  });

  test('theme persists in localStorage', async ({ page }) => {
    await page.goto('/');
    await page.click('#themeToggle');
    const theme = await page.evaluate(() => localStorage.getItem('visorup-theme'));
    expect(theme).toBeTruthy();
  });
});

test.describe('404 Page', () => {
  test('shows 404 for unknown route', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await expect(page.getByRole('heading', { name: 'Wrong Turn' })).toBeVisible();
    await expect(page.getByText('Back to Home')).toBeVisible();
    await expect(page).toHaveTitle(/Not Found/);
  });

  test('back to home button works', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await page.getByText('Back to Home').click();
    await expect(page.locator('.hero-title')).toBeVisible();
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('hamburger menu opens and closes', async ({ page }) => {
    await page.goto('/');
    const menuBtn = page.locator('#navMenuBtn');
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    await expect(page.locator('#navMobileMenu')).toHaveClass(/open/);
    await menuBtn.click();
    await expect(page.locator('#navMobileMenu')).not.toHaveClass(/open/);
  });

  test('mobile menu links navigate correctly', async ({ page }) => {
    await page.goto('/');
    await page.click('#navMenuBtn');
    const exploreBtn = page.locator('[data-mob-toggle="mob-explore"]');
    if (await exploreBtn.count() > 0) {
      await exploreBtn.click();
      await page.click('#mob-explore a[href="/routes"]');
    } else {
      await page.click('#navMobileMenu a[href="/routes"]');
    }
    await expect(page.locator('.page-hero-title')).toContainText('Routes');
  });

  test('detail-grid stacks on mobile', async ({ page }) => {
    await page.goto('/destinations/isle-of-skye');
    const cols = await page.evaluate(() =>
      getComputedStyle(document.querySelector('.detail-grid')).gridTemplateColumns
    );
    const colCount = cols.split(' ').length;
    expect(colCount).toBe(1);
  });
});

test.describe('Coming Soon Pages', () => {
  const comingSoon = ['reports'];

  for (const slug of comingSoon) {
    test(`${slug} shows coming soon`, async ({ page }) => {
      await page.goto('/' + slug);
      await expect(page.locator('.coming-soon-title')).toBeVisible();
    });
  }
});

test.describe('Gear Finder', () => {
  async function runQuiz(page, { experience, style, weather, budget, gear }) {
    await page.goto('/gear');
    await expect(page.locator('#gfStep1')).toBeVisible();
    // Ensure the real catalogue picks have loaded (not the hardcoded fallback)
    await page.waitForFunction(() => window.GEAR_PICKS !== null, null, { timeout: 15000 });
    await page.locator('#gfStep1 .gf-option', { hasText: experience }).click();
    await page.locator('#gfStep2 .gf-option', { hasText: style }).click();
    await page.locator('#gfStep3 .gf-option', { hasText: weather }).click();
    await page.locator('#gfStep4 .gf-option', { hasText: budget }).click();
    await page.locator('#gfStep5 .gf-toggle[data-gear="' + gear + '"]').click();
    await page.locator('.gf-submit').click();
    return page.locator('#gfResults');
  }
  const priceNums = async (results) => {
    const texts = await results.locator('.gf-product-price').allInnerTexts();
    return texts.map((t) => parseFloat(t.replace(/[^0-9.]/g, '')));
  };

  test('budget quiz returns only in-budget picks (< £150) with valid images', async ({ page }) => {
    const results = await runQuiz(page, { experience: 'Beginner', style: 'Touring', weather: 'All Weather', budget: 'Budget-Friendly', gear: 'helmet' });
    await expect(results).toHaveClass(/active/);
    await expect(results.locator('.gf-category')).toBeVisible();
    const prices = await priceNums(results);
    expect(prices.length).toBeGreaterThan(0);
    for (const n of prices) expect(n).toBeLessThan(150);
    const imgs = results.locator('.gf-product-img img');
    const imgCount = await imgs.count();
    expect(imgCount).toBeGreaterThanOrEqual(1);
    for (let i = 0; i < imgCount; i++) {
      expect(await imgs.nth(i).getAttribute('src')).toMatch(/^https?:\/\//);
    }
  });

  test('premium quiz returns only premium picks (>= £400)', async ({ page }) => {
    const results = await runQuiz(page, { experience: 'Advanced', style: 'Touring', weather: 'All Weather', budget: 'Premium', gear: 'helmet' });
    await expect(results.locator('.gf-category')).toBeVisible();
    const prices = await priceNums(results);
    expect(prices.length).toBeGreaterThan(0);
    for (const n of prices) expect(n).toBeGreaterThanOrEqual(400);
  });

  test('mid-range quiz returns mid-tier picks (£150–£400)', async ({ page }) => {
    const results = await runQuiz(page, { experience: 'Intermediate', style: 'Adventure', weather: 'Fair Weather', budget: 'Mid-Range', gear: 'jacket' });
    await expect(results.locator('.gf-category')).toBeVisible();
    const prices = await priceNums(results);
    expect(prices.length).toBeGreaterThan(0);
    for (const n of prices) { expect(n).toBeGreaterThanOrEqual(150); expect(n).toBeLessThan(400); }
  });

  test('trousers option returns in-budget trousers with valid images', async ({ page }) => {
    const results = await runQuiz(page, { experience: 'Beginner', style: 'Touring', weather: 'All Weather', budget: 'Budget-Friendly', gear: 'trousers' });
    await expect(results.locator('.gf-category h3', { hasText: 'Trousers' })).toBeVisible();
    const prices = await priceNums(results);
    expect(prices.length).toBeGreaterThan(0);
    for (const n of prices) expect(n).toBeLessThan(150);
    const imgs = results.locator('.gf-product-img img');
    expect(await imgs.count()).toBeGreaterThanOrEqual(1);
    expect(await imgs.first().getAttribute('src')).toMatch(/^https?:\/\//);
  });

  test('body armour option returns premium armour (>= £400)', async ({ page }) => {
    const results = await runQuiz(page, { experience: 'Advanced', style: 'Touring', weather: 'All Weather', budget: 'Premium', gear: 'armour' });
    await expect(results.locator('.gf-category h3', { hasText: 'Body Armour' })).toBeVisible();
    const prices = await priceNums(results);
    expect(prices.length).toBeGreaterThan(0);
    for (const n of prices) expect(n).toBeGreaterThanOrEqual(400);
  });
});

test.describe('Route Detail Pages', () => {
  const routeSlugs = [
    'scottish-highlands-loop', 'nc500-complete', 'welsh-mountain-passes',
    'lake-district-ultimate', 'channel-islands-explorer'
  ];

  for (const slug of routeSlugs) {
    test(`${slug} route page loads`, async ({ page }) => {
      await page.goto('/routes/' + slug);
      await expect(page.locator('.page-hero-title')).toBeVisible();
      await expect(page.locator('.detail-grid')).toBeVisible();
      await expect(page.locator('.breadcrumb')).toBeVisible();
      await expect(page.locator('.detail-main')).toBeVisible();
      await expect(page.locator('.detail-sidebar')).toBeVisible();
    });
  }
});

test.describe('Interactive Planner', () => {
  test('planner view loads for island-to-highlands route', async ({ page }) => {
    await page.goto('/routes/island-to-highlands');
    await expect(page.locator('#plannerView')).toBeVisible();
    await expect(page.locator('#map')).toBeVisible();
  });

  test('planner back button returns to site view', async ({ page }) => {
    await page.goto('/routes/island-to-highlands');
    await page.locator('.planner-back').click();
    await expect(page.locator('#siteView')).toBeVisible();
  });
});

test.describe('Museums Hub', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/museums');
  });

  test('renders hub hero and title', async ({ page }) => {
    await expect(page.locator('.page-hero-title')).toContainText('Museums');
    await expect(page).toHaveTitle(/Museums/);
  });

  test('renders 18 museum cards across country sections', async ({ page }) => {
    await expect(page.locator('.museum-country-heading').first()).toBeVisible();
    await expect(page.locator('.museum-card')).toHaveCount(18);
  });

  test('clicking a museum navigates to its detail page', async ({ page }) => {
    await page.locator('.museum-card').filter({ hasText: 'National Motorcycle Museum' }).first().click();
    await expect(page.locator('.detail-grid')).toBeVisible();
    await expect(page).toHaveTitle(/National Motorcycle Museum/);
  });
});

const MUSEUM_SLUGS = [
  'national-motorcycle-museum', 'isle-of-man-motor-museum',
  'riverside-museum', 'ulster-transport-museum'
];

test.describe('Museum Detail Pages', () => {
  for (const slug of MUSEUM_SLUGS) {
    test(`${slug} museum page loads`, async ({ page }) => {
      await page.goto('/museums/' + slug);
      await expect(page.locator('.page-hero-title')).toBeVisible();
      await expect(page.locator('.detail-grid')).toBeVisible();
      await expect(page.locator('.breadcrumb')).toBeVisible();
      await expect(page.locator('.info-card h4').filter({ hasText: 'Admission' })).toBeVisible();
      await expect(page.locator('.info-card h4').filter({ hasText: 'Opening' })).toBeVisible();
      const ldBlocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(ldBlocks.some(t => t.includes('"@type":"Museum"'))).toBe(true);
    });
  }
});

test.describe('Museums Map Integration', () => {
  test('museum data and POI adapter are wired up', async ({ page }) => {
    await page.goto('/');
    const result = await page.evaluate(() => ({
      count: (window.MOTORCYCLE_MUSEUMS || []).length,
      poiCount: (window.MOTORCYCLE_MUSEUMS_POI || []).length,
      allHaveUrl: (window.MOTORCYCLE_MUSEUMS_POI || []).every(p => typeof p.url === 'string' && p.url.indexOf('/museums/') === 0),
      hasConfig: (typeof RouteBuilder !== 'undefined') && !!(RouteBuilder.POI_CONFIG && RouteBuilder.POI_CONFIG.museums)
    }));
    expect(result.count).toBe(18);
    expect(result.poiCount).toBe(18);
    expect(result.allHaveUrl).toBe(true);
    expect(result.hasConfig).toBe(true);
  });

  test('Museums layer toggle appears in the Route Builder', async ({ page }) => {
    await page.goto('/build-route');
    await expect(page.locator('input[data-poi-type="museums"]')).toHaveCount(1);
  });
});
