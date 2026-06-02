const { test, expect } = require('@playwright/test');

const BASE = 'file://' + require('path').resolve(__dirname, '..', 'index.html');

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
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
    await page.goto(BASE);
  });

  test('nav links exist', async ({ page }) => {
    await expect(page.locator('.nav-links a[href="#/routes"]')).toBeVisible();
    await expect(page.locator('.nav-links a[href="#/destinations"]')).toBeVisible();
    await expect(page.locator('.nav-links a[href="#/ferries"]')).toBeVisible();
    await expect(page.locator('.nav-links a[href="#/planning"]')).toBeVisible();
  });

  test('navigating to routes page', async ({ page }) => {
    await page.click('.nav-links a[href="#/routes"]');
    await expect(page.locator('.page-hero-title')).toContainText('Routes');
    await expect(page).toHaveTitle(/Routes/);
  });

  test('navigating to destinations page', async ({ page }) => {
    await page.click('.nav-links a[href="#/destinations"]');
    await expect(page.locator('.page-hero-title')).toContainText('Destinations');
    await expect(page).toHaveTitle(/Destinations/);
  });

  test('navigating to ferries page', async ({ page }) => {
    await page.click('.nav-links a[href="#/ferries"]');
    await expect(page.locator('.page-hero-title')).toContainText('Ferry');
    await expect(page).toHaveTitle(/Ferry/);
  });

  test('navigating to planning page', async ({ page }) => {
    await page.click('.nav-links a[href="#/planning"]');
    await expect(page.locator('.page-hero-title')).toContainText('Planning');
    await expect(page).toHaveTitle(/Planning/);
  });

  test('logo navigates to home', async ({ page }) => {
    await page.goto(BASE + '#/routes');
    await page.click('.nav-brand');
    await expect(page.locator('.hero-title')).toBeVisible();
  });
});

test.describe('Routes Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + '#/routes');
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
    await page.goto(BASE + '#/destinations');
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
      await page.goto(BASE + '#/destinations/' + slug);
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
    await page.goto(BASE + '#/ferries');
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
      await page.goto(BASE + '#/ferries/' + slug);
      await expect(page.locator('.page-hero-title')).toBeVisible();
      await expect(page.locator('.detail-grid')).toBeVisible();
      await expect(page.locator('.breadcrumb')).toBeVisible();
    });
  }
});

test.describe('Planning Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + '#/planning');
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
    await page.goto(BASE);
    const toggle = page.locator('#themeToggle');
    await expect(toggle).toBeVisible();
    const initial = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await toggle.click();
    const switched = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(initial).not.toBe(switched);
  });

  test('theme persists in localStorage', async ({ page }) => {
    await page.goto(BASE);
    await page.click('#themeToggle');
    const theme = await page.evaluate(() => localStorage.getItem('visorup-theme'));
    expect(theme).toBeTruthy();
  });
});

test.describe('404 Page', () => {
  test('shows 404 for unknown route', async ({ page }) => {
    await page.goto(BASE + '#/nonexistent-page');
    await expect(page.getByRole('heading', { name: 'Wrong Turn' })).toBeVisible();
    await expect(page.getByText('Back to Home')).toBeVisible();
    await expect(page).toHaveTitle(/Not Found/);
  });

  test('back to home button works', async ({ page }) => {
    await page.goto(BASE + '#/nonexistent-page');
    await page.getByText('Back to Home').click();
    await expect(page.locator('.hero-title')).toBeVisible();
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('hamburger menu opens and closes', async ({ page }) => {
    await page.goto(BASE);
    const menuBtn = page.locator('#navMenuBtn');
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    await expect(page.locator('#navMobileMenu')).toHaveClass(/open/);
    await menuBtn.click();
    await expect(page.locator('#navMobileMenu')).not.toHaveClass(/open/);
  });

  test('mobile menu links navigate correctly', async ({ page }) => {
    await page.goto(BASE);
    await page.click('#navMenuBtn');
    await page.click('#navMobileMenu a[href="#/routes"]');
    await expect(page.locator('.page-hero-title')).toContainText('Routes');
  });

  test('detail-grid stacks on mobile', async ({ page }) => {
    await page.goto(BASE + '#/destinations/isle-of-skye');
    const cols = await page.evaluate(() =>
      getComputedStyle(document.querySelector('.detail-grid')).gridTemplateColumns
    );
    const colCount = cols.split(' ').length;
    expect(colCount).toBe(1);
  });
});

test.describe('Coming Soon Pages', () => {
  const comingSoon = ['gear', 'reports', 'community'];

  for (const slug of comingSoon) {
    test(`${slug} shows coming soon`, async ({ page }) => {
      await page.goto(BASE + '#/' + slug);
      await expect(page.locator('.coming-soon-title')).toBeVisible();
    });
  }
});

test.describe('Route Detail Pages', () => {
  const routeSlugs = [
    'scottish-highlands-loop', 'nc500-complete', 'welsh-mountain-passes',
    'lake-district-ultimate', 'channel-islands-explorer'
  ];

  for (const slug of routeSlugs) {
    test(`${slug} route page loads`, async ({ page }) => {
      await page.goto(BASE + '#/routes/' + slug);
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
    await page.goto(BASE + '#/routes/island-to-highlands');
    await expect(page.locator('#plannerView')).toBeVisible();
    await expect(page.locator('#map')).toBeVisible();
  });

  test('planner back button returns to site view', async ({ page }) => {
    await page.goto(BASE + '#/routes/island-to-highlands');
    await page.locator('.planner-back').click();
    await expect(page.locator('#siteView')).toBeVisible();
  });
});
