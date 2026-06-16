// VisorUp Affiliate Partner Hubs
// Generic, no-API affiliate directories sharing one renderer: breakdown cover,
// European travel/tour insurance, security & trackers, and tyres. Same model as the
// insurance hub - curated providers + content + signposting. Each CTA is an affiliate link.
//
// MONETISATION: once you're approved on each programme, replace the `url` values in
// PARTNER_HUBS[...].providers with your tracked affiliate deep-links. The current URLs
// point to the providers' own pages so every hub works today.

const PARTNER_HUBS = {
  'breakdown-cover': {
    slug: 'breakdown-cover',
    icon: 'fa-truck-pickup',
    badge: 'Breakdown Cover',
    h1: 'Motorbike Breakdown Cover',
    subtitle: 'Compare UK breakdown and recovery cover built for touring \u2014 roadside help, national recovery and European options so a breakdown never ends the trip.',
    title: 'Motorbike Breakdown Cover Compared \u2014 Roadside & Recovery',
    metaDesc: 'Compare UK motorcycle breakdown cover \u2014 roadside assistance, national recovery, home start and European cover from the AA, RAC, Green Flag, Start Rescue and more.',
    disclosure: 'VisorUp is a marketing partner, not a breakdown provider. We link to UK providers and may earn a commission at no extra cost to you. Always check the cover limits and terms before buying.',
    ctaText: 'Get a quote',
    featuredLabel: 'Best value pick',
    providersHeading: 'Compare breakdown providers',
    providersSub: 'Hand-picked UK breakdown and recovery providers \u2014 pick by what matters for your riding, then get a quote.',
    providers: [
      {
        key: 'green-flag', name: 'Green Flag', bestFor: 'Recovery to anywhere', featured: true,
        blurb: 'Recovery to any single UK destination, often undercutting the bigger names on price.',
        tags: ['Roadside', 'Recovery', 'At home', 'European'], badge: 'Often cheapest',
        features: ['Recovery to any UK destination', 'Frequently beats AA/RAC on price', 'Optional European cover'],
        url: 'https://www.greenflag.com/',
      },
      {
        key: 'the-aa', name: 'The AA', bestFor: 'Biggest patrol network',
        blurb: 'The UK\u2019s largest patrol force with a high roadside fix rate \u2014 reassuring on remote tours.',
        tags: ['Roadside', 'National recovery', 'At home', 'Onward travel'],
        features: ['UK\u2019s largest patrol force', 'High roadside fix rate', 'Motorbikes covered as standard'],
        url: 'https://www.theaa.com/breakdown-cover',
      },
      {
        key: 'rac', name: 'RAC', bestFor: 'Trusted all-rounder',
        blurb: 'Large patrol network with motorbike cover included and flexible add-ons for touring.',
        tags: ['Roadside', 'Recovery', 'At home', 'European'],
        features: ['Large patrol network', 'Motorbike cover included', 'Onward travel options'],
        url: 'https://www.rac.co.uk/breakdown-cover/',
      },
      {
        key: 'start-rescue', name: 'Start Rescue', bestFor: 'Budget-friendly cover',
        blurb: 'Consistently low prices with solid cover levels and European options \u2014 strong on value.',
        tags: ['Roadside', 'Recovery', 'European'], badge: 'Great value',
        features: ['Consistently low prices', 'European cover available', 'Highly rated for value'],
        url: 'https://www.startrescue.co.uk/',
      },
      {
        key: 'gem', name: 'GEM Motoring Assist', bestFor: 'Personal (any-vehicle) cover',
        blurb: 'Not-for-profit cover that follows you, the rider \u2014 break down on any bike or car and you\u2019re covered.',
        tags: ['Personal cover', 'Roadside', 'Recovery'], badge: 'Covers you on any bike',
        features: ['Covers you, not the vehicle', 'Ride any bike or drive any car', 'Not-for-profit, top rated'],
        url: 'https://www.motoringassist.com/',
      },
      {
        key: 'autoaid', name: 'AutoAid', bestFor: 'Two-rider household cover',
        blurb: 'Personal cover for two named people on any vehicle they ride or drive \u2014 great value for couples.',
        tags: ['Personal cover', 'Recovery'],
        features: ['Covers two named people', 'Any vehicle you ride or drive', 'Reimbursement model'],
        url: 'https://www.autoaid.co.uk/',
      },
    ],
    infoHeading: 'Levels of breakdown cover',
    infoCards: [
      { title: 'Roadside Assistance', body: 'Help if you break down away from home (usually beyond a set distance from your address). The patrol fixes you at the roadside or tows you to a nearby garage.' },
      { title: 'National Recovery', body: 'Recovery of you and your bike to any single UK destination if it can\u2019t be fixed at the roadside. Essential when touring far from home.' },
      { title: 'At Home / Home Start', body: 'Cover for breakdowns at or near your home \u2014 handy if the bike won\u2019t start on the driveway before a trip.' },
      { title: 'Onward Travel', body: 'A hire vehicle, hotel night or onward transport if the bike can\u2019t be fixed the same day, so a breakdown doesn\u2019t end the tour.' },
      { title: 'European Cover', body: 'Extends assistance to the Continent for tours abroad. Check the number of days included and whether repatriation is covered.' },
    ],
    guideHeading: 'Vehicle cover vs personal cover',
    guideIntro: 'There are two ways to buy breakdown cover \u2014 and for riders with more than one machine, the difference matters:',
    guideBullets: [
      { title: 'Vehicle-based cover', body: 'Attached to a specific bike (by registration). Cheapest if you only own one bike, but it won\u2019t help if you break down on a different machine.' },
      { title: 'Personal cover', body: 'Covers <strong>you</strong>, the rider, on any vehicle. Providers like GEM and AutoAid specialise in this \u2014 ideal if you ride several bikes or borrow one.' },
      { title: 'Already covered?', body: 'Some bike insurance policies and packaged bank accounts include basic breakdown cover. Check what you already have before buying a standalone policy.' },
    ],
    faqHeading: 'Breakdown cover FAQs',
    faqs: [
      { q: 'Do I need separate breakdown cover for a motorbike?', a: 'Not always \u2014 some providers cover you on any vehicle, and many car policies can add a bike. But check that motorcycles are included and that recovery limits suit touring distances.' },
      { q: 'Won\u2019t my bike insurance already include it?', a: 'Some comprehensive policies bundle basic breakdown cover or sell it as an add-on. It\u2019s often more limited than a standalone policy, so compare the cover levels.' },
      { q: 'Is European breakdown cover worth it for a tour?', a: 'If you\u2019re riding abroad, yes \u2014 recovery and repatriation from the Continent is expensive to arrange yourself. Check the day limit matches your trip length.' },
      { q: 'What\u2019s the difference between roadside and recovery?', a: 'Roadside gets you going or tows you to a local garage; national recovery takes you and the bike to any UK destination of your choice. For touring, recovery is the important bit.' },
    ],
  },

  'travel-insurance': {
    slug: 'travel-insurance',
    icon: 'fa-passport',
    badge: 'Travel Insurance',
    h1: 'Motorcycle Travel Insurance',
    subtitle: 'Touring abroad? Standard travel insurance often excludes riding bigger bikes. Compare cover that protects you on a motorcycle tour \u2014 medical, repatriation and cancellation included.',
    title: 'Motorcycle Travel Insurance for Touring Abroad',
    metaDesc: 'Compare travel insurance that covers motorcycling abroad \u2014 no engine-size traps, medical and repatriation cover for European and worldwide motorcycle tours.',
    disclosure: 'VisorUp is a marketing partner, not an insurer or broker. We link to providers and may earn a commission at no extra cost to you. Cover for motorcycling varies \u2014 always read the policy wording and check engine-size and licence conditions.',
    ctaText: 'Get a quote',
    featuredLabel: 'Specialist pick',
    providersHeading: 'Compare travel insurance for riders',
    providersSub: 'Providers that cover motorcycling abroad \u2014 check the engine-size and licence conditions, then get a quote.',
    providers: [
      {
        key: 'campbell-irvine', name: 'Campbell Irvine Direct', bestFor: 'No engine-size limit options', featured: true,
        blurb: 'Long-standing specialist offering motorcycling cover with options for larger bikes and longer trips.',
        tags: ['Motorcycling', 'Medical', 'Repatriation'], badge: 'Covers larger bikes',
        features: ['Established travel specialist', 'On/off-road motorcycling options', 'Single-trip & annual cover'],
        url: 'https://www.campbellirvinedirect.com/',
      },
      {
        key: 'navigator', name: 'Navigator Travel', bestFor: 'Adventure & big-cc touring',
        blurb: 'UK specialist covering motorcycling and adventurous activities abroad, including larger machines.',
        tags: ['Motorcycling', 'Adventure', 'Annual'],
        features: ['Covers motorcycling abroad', 'Adventurous activities included', 'UK-based specialist'],
        url: 'https://www.navigatortravel.co.uk/',
      },
      {
        key: 'dogtag', name: 'Dogtag', bestFor: 'Active & adventure riders',
        blurb: 'Activity-focused travel cover with motorcycling options and flexible top-ups for trips.',
        tags: ['Motorcycling', 'Adventure', 'Medical'],
        features: ['Activity-focused cover', 'Motorcycling options', 'Flexible top-ups'],
        url: 'https://www.dogtag.co.uk/',
      },
      {
        key: 'sports-cover-direct', name: 'Sports Cover Direct', bestFor: 'Activity add-ons',
        blurb: 'Add motorcycling to a travel policy alongside hundreds of other activities.',
        tags: ['Motorcycling', 'Activities', 'Single/Annual'],
        features: ['Add motorcycling to a policy', 'Hundreds of activities', 'Single-trip or annual'],
        url: 'https://www.sportscoverdirect.com/',
      },
      {
        key: 'true-traveller', name: 'True Traveller', bestFor: 'Long trips & buying abroad',
        blurb: 'Adventurous activity packs with the option to buy cover even when you\u2019re already travelling.',
        tags: ['Motorcycling', 'Adventure', 'Long-stay'], badge: 'Buy while travelling',
        features: ['Adventurous activity packs', 'Can buy when already abroad', 'Good for long tours'],
        url: 'https://www.truetraveller.com/',
      },
      {
        key: 'moneysupermarket', name: 'MoneySuperMarket', bestFor: 'Comparing standard policies',
        blurb: 'Compare many travel insurers quickly \u2014 filter for activities and check the motorcycling clause.',
        tags: ['Compare', 'Single/Annual'],
        features: ['Compare many insurers fast', 'Filter for activities', 'Free to use'],
        url: 'https://www.moneysupermarket.com/travel-insurance/',
      },
    ],
    infoHeading: 'What touring riders need to check',
    infoCards: [
      { title: 'Engine-size limit', body: 'Many standard policies only cover mopeds up to 125cc. For a touring bike you need a policy with no cc limit or a motorcycling add-on.' },
      { title: 'Licence & helmet', body: 'Cover usually requires the correct licence for the bike in the country you\u2019re riding and a helmet \u2014 even where local law doesn\u2019t demand one.' },
      { title: 'Medical & repatriation', body: 'The big risk abroad is medical costs and getting you home. Check generous medical limits and motorcycle-accident repatriation are included.' },
      { title: 'On-road vs off-road', body: 'Green-laning or trail riding may need a higher activity tier than road touring. Declare how you\u2019ll actually ride.' },
      { title: 'Not breakdown cover', body: 'Travel insurance covers you (medical, cancellation, baggage) \u2014 not your bike\u2019s recovery. Pair it with European breakdown cover.' },
    ],
    faqHeading: 'Travel insurance FAQs',
    faqs: [
      { q: 'Does normal travel insurance cover riding a motorbike abroad?', a: 'Often not for bikes over 125cc, or only if you hold the right licence and wear a helmet. Always check the motorcycling clause or buy specialist cover.' },
      { q: 'How is this different from my bike\u2019s European cover?', a: 'Your motorcycle policy\u2019s EU cover insures the bike (third-party/damage) for a number of days. Travel insurance covers you \u2014 medical bills, cancellation, baggage and getting you home.' },
      { q: 'Do I still need breakdown cover?', a: 'Yes \u2014 travel insurance won\u2019t recover a broken-down bike. Add European breakdown cover for that.' },
      { q: 'Annual or single-trip?', a: 'If you do two or more trips a year, an annual multi-trip policy with motorcycling added usually works out cheaper.' },
    ],
  },

  'bike-security': {
    slug: 'bike-security',
    icon: 'fa-lock',
    badge: 'Security & Trackers',
    h1: 'Motorbike Security & Trackers',
    subtitle: 'Keep your bike where you left it. Compare locks, chains, ground anchors, alarms and GPS trackers \u2014 layer them up and you may cut your insurance too.',
    title: 'Motorbike Security & GPS Trackers \u2014 Locks, Chains & Alarms',
    metaDesc: 'Protect your motorcycle from theft \u2014 compare Sold Secure chains and locks, ground anchors, alarms, forensic marking and Thatcham GPS trackers from Monimoto, BikeTrac, ABUS and more.',
    disclosure: 'VisorUp may earn a commission from links on this page at no extra cost to you. Product suitability and insurance recognition vary \u2014 always check current Thatcham/Sold Secure ratings and your insurer\u2019s requirements.',
    ctaText: 'View product',
    featuredLabel: 'Editor\u2019s pick',
    providersHeading: 'Compare security & trackers',
    providersSub: 'Trusted brands across every layer of bike security \u2014 lock it, chain it, anchor it, track it and mark it.',
    providers: [
      {
        key: 'monimoto', name: 'Monimoto', bestFor: 'Easy GPS tracking, no wiring', featured: true,
        blurb: 'A self-fit GPS tracker that alerts your phone the moment your bike is moved \u2014 no install bill.',
        tags: ['GPS tracker', 'Self-fit', 'No-subscription option'], badge: 'Insurance-friendly',
        features: ['Fob-based GPS tracker', 'Self-install in minutes', 'Phone alerts if the bike moves'],
        url: 'https://monimoto.com/',
      },
      {
        key: 'biketrac', name: 'BikeTrac', bestFor: 'Thatcham-approved tracking',
        blurb: 'Insurer-recognised tracker with 24/7 monitoring and a recovery team \u2014 may reduce your premium.',
        tags: ['GPS tracker', 'Thatcham', 'Recovery team'], badge: 'Thatcham approved',
        features: ['Insurer-recognised tracker', '24/7 monitoring & recovery', 'May cut your premium'],
        url: 'https://www.biketrac.co.uk/',
      },
      {
        key: 'datatag', name: 'Datatag', bestFor: 'Forensic marking & deterrent',
        blurb: 'Tamper-evident marking that deters thieves and dramatically improves recovery odds.',
        tags: ['Marking', 'Deterrent', 'MASTER scheme'],
        features: ['Tamper-evident marking kit', 'Boosts recovery odds', 'Visible theft deterrent'],
        url: 'https://www.datatag.co.uk/',
      },
      {
        key: 'abus', name: 'ABUS', bestFor: 'Chains, locks & disc locks',
        blurb: 'German security brand with the Granit high-security range and Sold Secure rated options.',
        tags: ['Chain', 'Disc lock', 'Sold Secure'],
        features: ['Granit high-security range', 'Sold Secure rated options', 'Trusted, well-built kit'],
        url: 'https://www.abus.com/uk',
      },
      {
        key: 'pragmasis', name: 'Pragmasis Protector', bestFor: 'Chains & ground anchors',
        blurb: 'Home-security favourite \u2014 Sold Secure Diamond chains and heavy-duty ground anchors.',
        tags: ['Chain', 'Ground anchor', 'Sold Secure'], badge: 'Top-rated chains',
        features: ['Sold Secure Diamond chains', 'Heavy-duty ground anchors', 'Serious home security'],
        url: 'https://www.pragmasis.com/',
      },
      {
        key: 'oxford', name: 'Oxford Products', bestFor: 'Alarms, locks & covers',
        blurb: 'Wide budget-to-premium range \u2014 alarmed disc locks, chains, covers, grips and more.',
        tags: ['Alarm disc lock', 'Locks', 'Covers'],
        features: ['Alarmed disc locks', 'Budget to premium range', 'Covers, grips & accessories'],
        url: 'https://www.oxfordproducts.com/',
      },
    ],
    infoHeading: 'Layer your security \u2014 the more, the better',
    infoCards: [
      { title: 'Lock it', body: 'A quality disc lock or grip lock stops a quick roll-away and is easy to carry. An alarmed disc lock adds an audible deterrent.' },
      { title: 'Chain it', body: 'A Sold Secure rated chain through the frame to an immovable object is the core of home security. Thicker hardened links resist bolt croppers.' },
      { title: 'Anchor it', body: 'A ground or wall anchor gives you something solid to chain to at home \u2014 far better than looping through a wheel.' },
      { title: 'Track it', body: 'A GPS tracker (ideally Thatcham-approved) helps police recover a stolen bike and can earn an insurance discount.' },
      { title: 'Mark it', body: 'Forensic marking and registration deter thieves and improve the odds of getting a recovered bike back to you.' },
      { title: 'Cover it', body: 'An opaque cover keeps the bike out of sight \u2014 thieves target what they can see and identify.' },
    ],
    faqHeading: 'Security FAQs',
    faqs: [
      { q: 'Will security kit lower my insurance?', a: 'Often yes \u2014 many insurers offer discounts for Thatcham-approved trackers and Sold Secure rated locks. Tell your insurer what you fit and keep the receipts.' },
      { q: 'What do "Sold Secure" and "Thatcham" mean?', a: 'They\u2019re independent security ratings. Sold Secure grades locks and chains (Bronze to Diamond); Thatcham approves alarms and trackers to insurer standards.' },
      { q: 'Do I really need a tracker and a chain?', a: 'They do different jobs \u2014 a chain prevents theft, a tracker helps recover the bike if it\u2019s stolen anyway. Layering both is the gold standard.' },
      { q: 'Are budget locks worth it?', a: 'A cheap lock can be cut in seconds. Spend a sensible proportion of the bike\u2019s value on security and look for a Sold Secure rating.' },
    ],
  },

  'tyres': {
    slug: 'tyres',
    icon: 'fa-record-vinyl',
    badge: 'Tyres',
    h1: 'Motorcycle Tyres',
    subtitle: 'The two contact patches that matter most. Compare trusted UK tyre retailers, find the right type for your riding, and buy online to fit at home or locally.',
    title: 'Motorcycle Tyres \u2014 Compare UK Retailers & Tyre Types',
    metaDesc: 'Buy motorcycle tyres online in the UK \u2014 compare retailers and find the right sport, sport-touring, touring or adventure tyre for your bike, with fitting advice.',
    disclosure: 'VisorUp may earn a commission from links on this page at no extra cost to you. Prices, stock and fitting services vary by retailer \u2014 always check the correct size and speed/load rating for your bike.',
    ctaText: 'Shop tyres',
    featuredLabel: 'Editor\u2019s pick',
    providersHeading: 'Compare tyre retailers',
    providersSub: 'Well-stocked UK retailers for road, touring and adventure tyres \u2014 buy online and fit at home or locally.',
    providers: [
      {
        key: 'sportsbikeshop', name: 'SportsBikeShop', bestFor: 'Huge range & fast delivery', featured: true,
        blurb: 'Massive tyre stock with free next-day UK delivery \u2014 fit at home or take to a local fitter.',
        tags: ['Online', 'All brands', 'Fast delivery'], badge: 'Free UK delivery',
        features: ['Massive tyre stock', 'Free next-day UK delivery', 'All major brands'],
        url: 'https://www.sportsbikeshop.co.uk/#/28914,3714,0',
      },
      {
        key: 'demon-tweeks', name: 'Demon Tweeks', bestFor: 'Performance & road',
        blurb: 'Established performance retailer with road, track and adventure tyres and frequent deals.',
        tags: ['Online', 'Performance', 'All brands'],
        features: ['Road, track & adventure tyres', 'Long-running performance retailer', 'Frequent deals'],
        url: 'https://www.demontweeks.com/',
      },
      {
        key: 'oponeo', name: 'Oponeo', bestFor: 'Comparing prices',
        blurb: 'Compare brands and prices across a large motorcycle tyre range with UK delivery.',
        tags: ['Online', 'Compare prices', 'Wide choice'], badge: 'Compare prices',
        features: ['Compare brands & prices', 'Large motorcycle range', 'UK delivery'],
        url: 'https://www.oponeo.co.uk/motorbike-tyres',
      },
      {
        key: 'get-geared', name: 'Get Geared', bestFor: 'Deals & offers',
        blurb: 'Regular tyre offers across road and adventure ranges from a long-running UK retailer.',
        tags: ['Online', 'Deals', 'All brands'],
        features: ['Regular tyre offers', 'Road & adventure ranges', 'UK retailer'],
        url: 'https://www.getgeared.co.uk/',
      },
      {
        key: 'mandp', name: 'M&P Direct', bestFor: 'One-stop bike shop',
        blurb: 'Tyres alongside parts and gear, with in-store fitting available at its depots.',
        tags: ['Online', 'In-store', 'Fitting'],
        features: ['Tyres plus parts & gear', 'In-store fitting at depots', 'Long-running UK retailer'],
        url: 'https://www.mandp.co.uk/',
      },
      {
        key: 'two-wheel-centre', name: 'Two Wheel Centre', bestFor: 'Supply & fit service',
        blurb: 'Supply-and-fit service with a full workshop and knowledgeable staff if you\u2019d rather not DIY.',
        tags: ['In-store', 'Fitting', 'Workshop'],
        features: ['Supply & fit service', 'Full workshop', 'Knowledgeable staff'],
        url: 'https://www.twowheel.co.uk/',
      },
    ],
    infoHeading: 'Which tyre type suits your riding?',
    infoCards: [
      { title: 'Sport', body: 'Maximum dry grip and quick warm-up for fast road and track riding. Softer compounds wear faster \u2014 not ideal for big touring miles.' },
      { title: 'Sport-touring', body: 'The all-rounder most tourers want \u2014 long-lasting, confident in the wet and grippy enough for spirited road riding.' },
      { title: 'Touring', body: 'Built for mileage and wet-weather security on heavier bikes \u2014 the longest-lasting choice for two-up, fully-loaded touring.' },
      { title: 'Adventure / dual-sport', body: 'From road-biased (90/10, 80/20) to off-road-biased (50/50) for adventure bikes. Pick by how much green-laning you\u2019ll do.' },
      { title: 'Cruiser / custom', body: 'Hard-wearing tyres sized for cruisers, with stable straight-line manners and good longevity.' },
    ],
    faqHeading: 'Tyre FAQs',
    faqs: [
      { q: 'Can I buy tyres online and get them fitted locally?', a: 'Yes \u2014 many riders buy online for the price, then pay a local garage a fitting fee. Some retailers also offer mobile fitting or a fit-at-home service.' },
      { q: 'How do I read my tyre size?', a: 'It\u2019s on the sidewall, e.g. 120/70 ZR17 \u2014 width (mm) / profile (%) / construction & rim diameter (in), plus a load and speed rating. Match the size in your bike\u2019s handbook.' },
      { q: 'When should I replace my motorcycle tyres?', a: 'Legally at 1mm of tread across the central three-quarters, but replace sooner if you see cracking or flat spots, or if the tyre is more than about 5\u20136 years old (check the DOT date).' },
      { q: 'Do I need to replace both tyres together?', a: 'Not always, but mixing a worn and a new tyre changes the handling. Replace in pairs where you can and stick to a matched front/rear set the manufacturer recommends.' },
    ],
  },
};

// Registry used for the cross-linking "More rider services" strip.
const RIDER_SERVICES = [
  { slug: 'insurance', label: 'Bike Insurance', icon: 'fa-shield-halved', desc: 'Compare specialist motorcycle insurers.' },
  { slug: 'breakdown-cover', label: 'Breakdown Cover', icon: 'fa-truck-pickup', desc: 'Roadside & recovery cover for tourers.' },
  { slug: 'travel-insurance', label: 'Travel Insurance', icon: 'fa-passport', desc: 'Cover for riding a bike abroad.' },
  { slug: 'bike-security', label: 'Security & Trackers', icon: 'fa-lock', desc: 'Locks, chains, alarms & GPS trackers.' },
  { slug: 'tyres', label: 'Tyres', icon: 'fa-record-vinyl', desc: 'Buy motorcycle tyres online.' },
  { slug: 'ferries', label: 'Ferries', icon: 'fa-ship', desc: 'Get your bike across the water.' },
];

const Partners = {
  track: function (slug, key) {
    try {
      if (typeof VisorUpAnalytics !== 'undefined' && VisorUpAnalytics.trackToolUsage) {
        VisorUpAnalytics.trackToolUsage(slug + '-' + key);
      }
    } catch (e) { /* non-fatal */ }
    return true;
  },
};

function _phChips(p) {
  var chips = '';
  (p.tags || []).forEach(function (t) {
    chips += '<span style="display:inline-block;font-size:11px;font-weight:600;padding:3px 8px;border-radius:6px;background:var(--bg-primary);border:1px solid var(--border);color:var(--text-muted);margin:0 4px 4px 0">' + t + '</span>';
  });
  if (p.badge) chips += '<span style="display:inline-block;font-size:11px;font-weight:600;padding:3px 8px;border-radius:6px;background:rgba(39,174,96,0.12);border:1px solid rgba(39,174,96,0.4);color:#27ae60;margin:0 4px 4px 0"><i class="fas fa-check"></i> ' + p.badge + '</span>';
  return chips;
}

function _phCard(cfg, p) {
  var feats = '';
  (p.features || []).forEach(function (f) {
    feats += '<li style="margin:0 0 6px 0;padding-left:22px;position:relative;font-size:14px;color:var(--text)"><i class="fas fa-check" style="position:absolute;left:0;top:3px;color:var(--accent);font-size:12px"></i>' + f + '</li>';
  });
  return '' +
    '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:22px;display:flex;flex-direction:column">' +
      '<h3 style="margin:0 0 4px 0;font-size:19px;color:var(--text)">' + p.name + '</h3>' +
      '<div style="font-size:12px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.4px;margin-bottom:10px">' + p.bestFor + '</div>' +
      '<p style="margin:0 0 12px 0;font-size:14px;line-height:1.5;color:var(--text-muted)">' + p.blurb + '</p>' +
      '<div style="margin-bottom:14px">' + _phChips(p) + '</div>' +
      '<ul style="list-style:none;margin:0 0 16px 0;padding:0">' + feats + '</ul>' +
      '<a href="' + p.url + '" target="_blank" rel="sponsored noopener nofollow" onclick="Partners.track(\'' + cfg.slug + '\',\'quote-' + p.key + '\')" ' +
        'style="margin-top:auto;display:block;text-align:center;background:var(--accent);color:#fff;font-weight:700;padding:12px 16px;border-radius:10px;text-decoration:none">' +
        cfg.ctaText + ' <i class="fas fa-arrow-right" style="font-size:12px"></i></a>' +
    '</div>';
}

function _phInfoCard(c) {
  return '' +
    '<div style="background:var(--bg-primary);border:1px solid var(--border);border-radius:12px;padding:18px">' +
      '<h3 style="margin:0 0 8px 0;font-size:17px;color:var(--text)">' + c.title + '</h3>' +
      '<p style="margin:0;font-size:14px;color:var(--text-muted);line-height:1.55">' + c.body + '</p>' +
    '</div>';
}

function _phBullet(b) {
  return '' +
    '<li style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:16px 18px;margin-bottom:12px">' +
      '<strong style="color:var(--text);font-size:16px">' + b.title + '</strong>' +
      '<p style="margin:6px 0 0 0;font-size:14px;color:var(--text-muted);line-height:1.55">' + b.body + '</p>' +
    '</li>';
}

function _phFaq(item) {
  return '' +
    '<div style="border-bottom:1px solid var(--border);padding:18px 0">' +
      '<h3 style="margin:0 0 8px 0;font-size:17px;color:var(--text)">' + item.q + '</h3>' +
      '<p style="margin:0;font-size:15px;color:var(--text-muted);line-height:1.6">' + item.a + '</p>' +
    '</div>';
}

function _phRelated(currentSlug) {
  var cards = RIDER_SERVICES.filter(function (s) { return s.slug !== currentSlug; }).map(function (s) {
    return '<a href="/' + s.slug + '" style="display:flex;align-items:flex-start;gap:12px;background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:16px;text-decoration:none">' +
      '<i class="fas ' + s.icon + '" style="color:var(--accent);font-size:20px;margin-top:2px"></i>' +
      '<span><strong style="display:block;color:var(--text);font-size:15px;margin-bottom:2px">' + s.label + '</strong>' +
      '<span style="font-size:13px;color:var(--text-muted)">' + s.desc + '</span></span>' +
    '</a>';
  }).join('');
  return '' +
    '<section class="page-section" style="background:var(--bg-card)">' +
      '<div class="container" style="max-width:1000px">' +
        '<h2 style="text-align:center;font-size:24px;color:var(--text);margin:0 0 22px 0">More rider services</h2>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px">' + cards + '</div>' +
      '</div>' +
    '</section>';
}

function renderPartnerHub(slug) {
  var cfg = PARTNER_HUBS[slug];
  if (!cfg) {
    return '<section class="page-section"><div class="container"><h1>Not found</h1></div></section>';
  }
  var featured = cfg.providers.filter(function (p) { return p.featured; })[0] || cfg.providers[0];
  var rest = cfg.providers.filter(function (p) { return p !== featured; });
  var cards = rest.map(function (p) { return _phCard(cfg, p); }).join('');
  var infoCards = cfg.infoCards.map(_phInfoCard).join('');

  var guideSection = '';
  if (cfg.guideBullets && cfg.guideBullets.length) {
    guideSection =
      '<h2 style="font-size:24px;color:var(--text);margin:8px 0 12px 0">' + cfg.guideHeading + '</h2>' +
      '<p style="font-size:15px;color:var(--text-muted);line-height:1.6;margin:0 0 16px 0">' + cfg.guideIntro + '</p>' +
      '<ul style="margin:0;padding-left:0;list-style:none">' + cfg.guideBullets.map(_phBullet).join('') + '</ul>';
  }

  return '' +
  '<div class="content-hero" style="background:linear-gradient(135deg, var(--bg-primary), var(--bg-card))">' +
    '<div class="hero-content">' +
      '<span class="hero-badge"><i class="fas ' + cfg.icon + '"></i> ' + cfg.badge + '</span>' +
      '<h1>' + cfg.h1 + '</h1>' +
      '<p class="hero-subtitle">' + cfg.subtitle + '</p>' +
      '<a href="' + featured.url + '" target="_blank" rel="sponsored noopener nofollow" onclick="Partners.track(\'' + cfg.slug + '\',\'quote-' + featured.key + '\')" ' +
        'style="display:inline-block;background:var(--accent);color:#fff;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:16px;margin-top:8px">' +
        '<i class="fas fa-arrow-right"></i> ' + cfg.ctaText + '</a>' +
      '<a href="#ph-compare" style="display:inline-block;color:var(--text);font-weight:600;padding:14px 20px;text-decoration:none;font-size:15px">Browse providers <i class="fas fa-chevron-down" style="font-size:12px"></i></a>' +
    '</div>' +
  '</div>' +

  // Disclosure strip
  '<section style="background:var(--bg-card);border-bottom:1px solid var(--border)">' +
    '<div class="container" style="max-width:900px;padding:14px 20px">' +
      '<p style="margin:0;font-size:13px;color:var(--text-muted);text-align:center">' +
        '<i class="fas fa-circle-info"></i> ' + cfg.disclosure +
      '</p>' +
    '</div>' +
  '</section>' +

  // Featured + provider grid
  '<section class="page-section" id="ph-compare">' +
    '<div class="container" style="max-width:1000px">' +
      '<div style="background:linear-gradient(135deg, rgba(255,107,53,0.10), var(--bg-card));border:1px solid var(--accent);border-radius:16px;padding:26px;margin-bottom:34px;display:flex;flex-wrap:wrap;align-items:center;gap:20px;justify-content:space-between">' +
        '<div style="flex:1;min-width:260px">' +
          '<div style="font-size:12px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">' + cfg.featuredLabel + '</div>' +
          '<h2 style="margin:0 0 8px 0;font-size:24px;color:var(--text)">' + featured.name + '</h2>' +
          '<p style="margin:0;font-size:15px;color:var(--text-muted);line-height:1.5">' + featured.blurb + '</p>' +
        '</div>' +
        '<a href="' + featured.url + '" target="_blank" rel="sponsored noopener nofollow" onclick="Partners.track(\'' + cfg.slug + '\',\'quote-' + featured.key + '\')" ' +
          'style="display:inline-block;background:var(--accent);color:#fff;font-weight:700;padding:14px 26px;border-radius:12px;text-decoration:none;white-space:nowrap">' + cfg.ctaText + ' <i class="fas fa-arrow-right" style="font-size:12px"></i></a>' +
      '</div>' +

      '<h2 style="text-align:center;font-size:26px;color:var(--text);margin:0 0 6px 0">' + cfg.providersHeading + '</h2>' +
      '<p style="text-align:center;font-size:15px;color:var(--text-muted);margin:0 0 28px 0">' + cfg.providersSub + '</p>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px">' + cards + '</div>' +
    '</div>' +
  '</section>' +

  // Info + optional guide
  '<section class="page-section" style="background:var(--bg-card)">' +
    '<div class="container" style="max-width:900px">' +
      '<h2 style="font-size:26px;color:var(--text);margin:0 0 20px 0">' + cfg.infoHeading + '</h2>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-bottom:' + (guideSection ? '34px' : '0') + '">' + infoCards + '</div>' +
      guideSection +
    '</div>' +
  '</section>' +

  // FAQ
  '<section class="page-section">' +
    '<div class="container" style="max-width:820px">' +
      '<h2 style="font-size:26px;color:var(--text);margin:0 0 20px 0">' + cfg.faqHeading + '</h2>' +
      cfg.faqs.map(_phFaq).join('') +
    '</div>' +
  '</section>' +

  _phRelated(cfg.slug);
}
