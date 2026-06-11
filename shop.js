/**
 * VisorUp Shop — browse the full SportsBikeShop catalogue (affiliate).
 * Data: public/data/shop/index.json, <category>.json, search-index.json
 * All product links carry the VisorUp affiliate tag (built into the data).
 */

var SHOP_CAT_META = {
  'Helmets':     { icon: 'fa-helmet-safety', blurb: 'Full-face, modular, adventure & open-face lids' },
  'Jackets':     { icon: 'fa-vest',          blurb: 'Textile, leather, waterproof & summer jackets' },
  'Trousers':    { icon: 'fa-person',        blurb: 'Riding jeans, textile & leather trousers' },
  'Gloves':      { icon: 'fa-mitten',        blurb: 'Summer, winter, waterproof & heated gloves' },
  'Boots':       { icon: 'fa-shoe-prints',   blurb: 'Touring, adventure, sport & waterproof boots' },
  'Base Layers': { icon: 'fa-shirt',         blurb: 'Thermals, neck tubes & base layers' },
  'Protection':  { icon: 'fa-shield-halved', blurb: 'Back protectors, armour & airbags' },
  'Luggage':     { icon: 'fa-suitcase-rolling', blurb: 'Panniers, tank bags, tail packs & racks' },
  'Electronics': { icon: 'fa-headset',       blurb: 'Intercoms, cameras, sat navs & chargers' },
  'Exhausts':    { icon: 'fa-fire',          blurb: 'Full systems, slip-ons & silencers' },
  'Parts':       { icon: 'fa-gears',         blurb: 'Chains, brakes, levers, screens & filters' },
  'Accessories': { icon: 'fa-screwdriver-wrench', blurb: 'Locks, covers, cleaning & care' },
  'Casual':      { icon: 'fa-tshirt',        blurb: 'T-shirts, hoodies & off-bike clothing' },
  'Other':       { icon: 'fa-box',           blurb: 'Everything else for bike & rider' },
};

var SHOP_PAGE_SIZE = 24;

var Shop = {
  index: null,
  searchIndex: null,
  state: { catName: '', slug: '', all: [], filtered: [], brand: '', sort: 'price-desc', priceMax: 0, shown: 0 },

  // ---------- HUB ----------
  initHub: function () {
    var self = this;
    var grid = document.getElementById('shopCatGrid');
    if (!grid) return;
    this._loadIndex(function (idx) {
      if (!idx) { grid.innerHTML = '<p class="shop-empty">Catalogue unavailable. Please try again later.</p>'; return; }
      var order = Object.keys(SHOP_CAT_META).filter(function (c) { return idx.categories[c]; });
      grid.innerHTML = order.map(function (cat) {
        var c = idx.categories[cat];
        var meta = SHOP_CAT_META[cat] || { icon: 'fa-box', blurb: '' };
        return '<a href="/shop/' + c.slug + '" class="shop-cat-card">' +
          '<div class="shop-cat-icon"><i class="fas ' + meta.icon + '"></i></div>' +
          '<div class="shop-cat-body">' +
            '<h3>' + cat + '</h3>' +
            '<p>' + meta.blurb + '</p>' +
            '<span class="shop-cat-meta">' + c.count.toLocaleString() + ' products · from £' + Math.round(c.minPrice) + '</span>' +
          '</div>' +
          '<i class="fas fa-chevron-right shop-cat-arrow"></i>' +
        '</a>';
      }).join('');
      var totalEl = document.getElementById('shopTotalCount');
      if (totalEl) totalEl.textContent = idx.total.toLocaleString();
    });
  },

  // ---------- CATEGORY ----------
  initCategory: function (slug) {
    var self = this;
    this.state.slug = slug;
    this._loadIndex(function (idx) {
      var catName = null;
      if (idx) {
        for (var k in idx.categories) { if (idx.categories[k].slug === slug) { catName = k; break; } }
      }
      if (!catName) { self._renderCatError(); return; }
      self.state.catName = catName;
      var titleEl = document.getElementById('shopCatTitle');
      var crumbEl = document.getElementById('shopCrumbCat');
      if (titleEl) titleEl.textContent = catName;
      if (crumbEl) crumbEl.textContent = catName;
      document.title = catName + ' — Shop Motorcycle Gear | VisorUp';

      fetch('public/data/shop/' + slug + '.json')
        .then(function (r) { return r.json(); })
        .then(function (items) {
          self.state.all = items;
          self.state.filtered = items.slice();
          self.state.priceMax = Math.ceil(idx.categories[catName].maxPrice);
          self._buildFilters(idx.categories[catName]);
          self._applyFilters();
        })
        .catch(function () { self._renderCatError(); });
    });
  },

  _buildFilters: function (catInfo) {
    var brandSel = document.getElementById('shopBrandFilter');
    if (brandSel && catInfo.brands) {
      brandSel.innerHTML = '<option value="">All brands (' + catInfo.count + ')</option>' +
        catInfo.brands.map(function (b) {
          return '<option value="' + b.brand.replace(/"/g, '&quot;') + '">' + b.brand + ' (' + b.count + ')</option>';
        }).join('');
    }
    var priceRange = document.getElementById('shopPriceRange');
    var priceLabel = document.getElementById('shopPriceLabel');
    if (priceRange) {
      priceRange.min = 0;
      priceRange.max = this.state.priceMax;
      priceRange.value = this.state.priceMax;
      if (priceLabel) priceLabel.textContent = 'Up to £' + this.state.priceMax;
    }
  },

  onFilterChange: function () {
    var brand = document.getElementById('shopBrandFilter');
    var sort = document.getElementById('shopSort');
    var price = document.getElementById('shopPriceRange');
    var priceLabel = document.getElementById('shopPriceLabel');
    this.state.brand = brand ? brand.value : '';
    this.state.sort = sort ? sort.value : 'price-desc';
    this.state.priceMax = price ? parseInt(price.value, 10) : this.state.priceMax;
    if (priceLabel && price) priceLabel.textContent = (parseInt(price.value, 10) >= parseInt(price.max, 10)) ? 'Any price' : 'Up to £' + price.value;
    this._applyFilters();
  },

  _applyFilters: function () {
    var s = this.state;
    var q = (document.getElementById('shopCatSearch') || {}).value || '';
    q = q.trim().toLowerCase();
    s.filtered = s.all.filter(function (p) {
      if (s.brand && p.brand !== s.brand) return false;
      if (s.priceMax && p.priceNum > s.priceMax) return false;
      if (q && (p.name + ' ' + p.brand).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    var sort = s.sort;
    s.filtered.sort(function (a, b) {
      if (sort === 'price-asc') return a.priceNum - b.priceNum;
      if (sort === 'price-desc') return b.priceNum - a.priceNum;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
    s.shown = 0;
    var grid = document.getElementById('shopGrid');
    if (grid) grid.innerHTML = '';
    this._renderMore();
    var countEl = document.getElementById('shopResultCount');
    if (countEl) countEl.textContent = s.filtered.length.toLocaleString() + ' product' + (s.filtered.length === 1 ? '' : 's');
  },

  _renderMore: function () {
    var s = this.state;
    var grid = document.getElementById('shopGrid');
    if (!grid) return;
    var slice = s.filtered.slice(s.shown, s.shown + SHOP_PAGE_SIZE);
    grid.insertAdjacentHTML('beforeend', slice.map(this._card).join(''));
    s.shown += slice.length;
    var moreBtn = document.getElementById('shopLoadMore');
    if (moreBtn) moreBtn.style.display = s.shown < s.filtered.length ? 'inline-flex' : 'none';
    if (s.filtered.length === 0) {
      grid.innerHTML = '<p class="shop-empty">No products match your filters. Try widening your price range or brand.</p>';
    }
  },

  loadMore: function () { this._renderMore(); },

  _card: function (p) {
    var colourBadge = p.colourCount > 1 ? '<span class="shop-card-colours">' + p.colourCount + ' colours</span>' : '';
    return '<div class="shop-card">' +
      '<a href="' + p.affiliateUrl + '" target="_blank" rel="noopener sponsored" class="shop-card-imglink">' +
        '<img src="' + p.thumb + '" alt="' + p.name.replace(/"/g, '&quot;') + '" loading="lazy" />' +
        colourBadge +
      '</a>' +
      '<div class="shop-card-body">' +
        '<span class="shop-card-brand">' + p.brand + '</span>' +
        '<a href="' + p.affiliateUrl + '" target="_blank" rel="noopener sponsored" class="shop-card-name">' + p.name + '</a>' +
        '<div class="shop-card-foot">' +
          '<span class="shop-card-price">' + p.price + '</span>' +
          '<a href="' + p.affiliateUrl + '" target="_blank" rel="noopener sponsored" class="shop-card-btn">View <i class="fas fa-arrow-right"></i></a>' +
        '</div>' +
      '</div>' +
    '</div>';
  },

  _renderCatError: function () {
    var grid = document.getElementById('shopGrid');
    if (grid) grid.innerHTML = '<p class="shop-empty">This category could not be found. <a href="/shop">Back to shop</a>.</p>';
  },

  // ---------- SEARCH ----------
  initSearch: function (query) {
    var self = this;
    var input = document.getElementById('shopSearchInput');
    if (input) input.value = query || '';
    if (!query) { this._renderSearchResults([]); return; }
    this._loadSearchIndex(function (idx) {
      if (!idx) return;
      var q = query.trim().toLowerCase();
      var terms = q.split(/\s+/);
      var results = idx.filter(function (p) {
        var hay = (p.n + ' ' + p.b).toLowerCase();
        return terms.every(function (t) { return hay.indexOf(t) !== -1; });
      });
      self._renderSearchResults(results, query);
    });
  },

  doSearch: function (ev) {
    if (ev) ev.preventDefault();
    var input = document.getElementById('shopSearchInput');
    var q = input ? input.value.trim() : '';
    if (q) window.history.pushState({}, '', '/shop/search?q=' + encodeURIComponent(q));
    this.initSearch(q);
    return false;
  },

  _renderSearchResults: function (results, query) {
    var grid = document.getElementById('shopSearchGrid');
    var count = document.getElementById('shopSearchCount');
    if (!grid) return;
    if (count) count.textContent = query ? (results.length.toLocaleString() + ' result' + (results.length === 1 ? '' : 's') + ' for "' + query + '"') : '';
    if (!results.length) {
      grid.innerHTML = query ? '<p class="shop-empty">No products found for "' + query + '". Try a different term or <a href="/shop">browse categories</a>.</p>' : '';
      return;
    }
    grid.innerHTML = results.slice(0, 60).map(function (p) {
      return '<div class="shop-card">' +
        '<a href="' + p.u + '" target="_blank" rel="noopener sponsored" class="shop-card-imglink"><img src="' + p.t + '" alt="' + p.n.replace(/"/g, '&quot;') + '" loading="lazy" /></a>' +
        '<div class="shop-card-body">' +
          '<span class="shop-card-brand">' + p.b + '</span>' +
          '<a href="' + p.u + '" target="_blank" rel="noopener sponsored" class="shop-card-name">' + p.n + '</a>' +
          '<div class="shop-card-foot"><span class="shop-card-price">£' + p.p + '</span>' +
          '<a href="' + p.u + '" target="_blank" rel="noopener sponsored" class="shop-card-btn">View <i class="fas fa-arrow-right"></i></a></div>' +
        '</div>' +
      '</div>';
    }).join('');
    if (results.length > 60) {
      grid.insertAdjacentHTML('afterend', '');
    }
  },

  // ---------- loaders ----------
  _loadIndex: function (cb) {
    if (this.index) { cb(this.index); return; }
    var self = this;
    fetch('public/data/shop/index.json')
      .then(function (r) { return r.json(); })
      .then(function (j) { self.index = j; cb(j); })
      .catch(function () { cb(null); });
  },

  _loadSearchIndex: function (cb) {
    if (this.searchIndex) { cb(this.searchIndex); return; }
    var self = this;
    var grid = document.getElementById('shopSearchGrid');
    if (grid) grid.innerHTML = '<p class="shop-loading"><i class="fas fa-spinner fa-spin"></i> Searching catalogue…</p>';
    fetch('public/data/shop/search-index.json')
      .then(function (r) { return r.json(); })
      .then(function (j) { self.searchIndex = j; cb(j); })
      .catch(function () { cb(null); });
  },
};

// ---------- render shells ----------
function renderShopHub() {
  return '' +
  '<div class="content-hero" style="background:linear-gradient(135deg, var(--bg-primary), var(--bg-card))">' +
    '<div class="hero-content">' +
      '<span class="hero-badge"><i class="fas fa-tags"></i> Gear Shop</span>' +
      '<h1>Shop Motorcycle Gear &amp; Parts</h1>' +
      '<p class="hero-subtitle">Browse <strong id="shopTotalCount">16,000+</strong> products from SportsBikeShop — helmets, clothing, luggage, parts and more. Free UK delivery and 365-day returns on every order.</p>' +
      '<form class="shop-search-form" onsubmit="return Shop.doSearch(event)">' +
        '<input type="search" id="shopSearchInput" placeholder="Search helmets, jackets, brands…" aria-label="Search products" />' +
        '<button type="submit"><i class="fas fa-search"></i></button>' +
      '</form>' +
    '</div>' +
  '</div>' +
  '<section class="page-section">' +
    '<div class="container">' +
      '<div class="shop-cat-grid" id="shopCatGrid"><p class="shop-loading"><i class="fas fa-spinner fa-spin"></i> Loading catalogue…</p></div>' +
      '<p class="shop-affiliate-note"><i class="fas fa-circle-info"></i> VisorUp may earn a commission on purchases made through these links, at no extra cost to you. This helps keep our tools free.</p>' +
    '</div>' +
  '</section>';
}

function renderShopCategory() {
  return '' +
  '<section class="page-section" style="padding-top:calc(var(--nav-h, 60px) + 24px)">' +
    '<div class="container">' +
      '<nav class="breadcrumb"><a href="/">Home</a> <i class="fas fa-chevron-right"></i> <a href="/shop">Shop</a> <i class="fas fa-chevron-right"></i> <span id="shopCrumbCat">Category</span></nav>' +
      '<h1 class="shop-cat-h1" id="shopCatTitle">Category</h1>' +
      '<div class="shop-layout">' +
        '<aside class="shop-filters">' +
          '<div class="shop-filter-group">' +
            '<label for="shopCatSearch">Search in category</label>' +
            '<input type="search" id="shopCatSearch" placeholder="Filter…" oninput="Shop._applyFilters()" />' +
          '</div>' +
          '<div class="shop-filter-group">' +
            '<label for="shopBrandFilter">Brand</label>' +
            '<select id="shopBrandFilter" onchange="Shop.onFilterChange()"><option value="">All brands</option></select>' +
          '</div>' +
          '<div class="shop-filter-group">' +
            '<label for="shopPriceRange">Max price: <span id="shopPriceLabel">Any price</span></label>' +
            '<input type="range" id="shopPriceRange" min="0" max="1000" value="1000" oninput="Shop.onFilterChange()" />' +
          '</div>' +
          '<div class="shop-filter-group">' +
            '<label for="shopSort">Sort by</label>' +
            '<select id="shopSort" onchange="Shop.onFilterChange()">' +
              '<option value="price-desc">Price: high to low</option>' +
              '<option value="price-asc">Price: low to high</option>' +
              '<option value="name">Name A–Z</option>' +
            '</select>' +
          '</div>' +
        '</aside>' +
        '<div class="shop-main">' +
          '<div class="shop-results-bar"><span id="shopResultCount">Loading…</span></div>' +
          '<div class="shop-grid" id="shopGrid"><p class="shop-loading"><i class="fas fa-spinner fa-spin"></i> Loading products…</p></div>' +
          '<div style="text-align:center;margin-top:28px"><button id="shopLoadMore" class="shop-loadmore" style="display:none" onclick="Shop.loadMore()">Load more</button></div>' +
        '</div>' +
      '</div>' +
      '<p class="shop-affiliate-note"><i class="fas fa-circle-info"></i> VisorUp may earn a commission on purchases made through these links, at no extra cost to you.</p>' +
    '</div>' +
  '</section>';
}

function renderShopSearch() {
  return '' +
  '<section class="page-section" style="padding-top:calc(var(--nav-h, 60px) + 24px)">' +
    '<div class="container">' +
      '<nav class="breadcrumb"><a href="/">Home</a> <i class="fas fa-chevron-right"></i> <a href="/shop">Shop</a> <i class="fas fa-chevron-right"></i> <span>Search</span></nav>' +
      '<form class="shop-search-form shop-search-form--inline" onsubmit="return Shop.doSearch(event)">' +
        '<input type="search" id="shopSearchInput" placeholder="Search helmets, jackets, brands…" aria-label="Search products" />' +
        '<button type="submit"><i class="fas fa-search"></i></button>' +
      '</form>' +
      '<p class="shop-results-bar" id="shopSearchCount"></p>' +
      '<div class="shop-grid" id="shopSearchGrid"></div>' +
      '<p class="shop-affiliate-note"><i class="fas fa-circle-info"></i> VisorUp may earn a commission on purchases made through these links, at no extra cost to you.</p>' +
    '</div>' +
  '</section>';
}
