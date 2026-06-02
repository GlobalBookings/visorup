const COASTAL_CORNWALL = {
  slug: 'coastal-cornwall',
  name: 'Coastal Cornwall',
  tagline: 'Four days chasing Atlantic waves from Exeter to Land\'s End and back — cliff roads, fishing harbours, and the wildest coastline in England',
  duration: '4 days',
  distance: '~350 miles',
  startLocation: 'Exeter',
  endLocation: 'Exeter',
  difficulty: 'Moderate',
  bestTime: 'May to October',
  description: 'A four-day loop from Exeter that traces the entire Cornish coast on two wheels. Start by heading north to pick up the legendary Atlantic Highway — the A39 — which hugs the rugged north coast from Barnstaple to Bude and beyond. From there, ride down through the dramatic clifftop ruins of Tintagel, the fishing villages of Port Isaac and Padstow, and the surf beaches of Newquay before reaching the artists\' colony of St Ives. Day three takes you to the very tip of England at Land\'s End, past the cliffside Minack Theatre, and down to Lizard Point — the southernmost spot on the British mainland. The return leg sweeps through Falmouth, Fowey, and Plymouth before crossing Dartmoor back to Exeter. Expect narrow lanes, sudden sea views, cream teas, and some of the best coastal riding in Europe.',
  highlights: [
    'Atlantic Highway (A39) — sweeping coast road from Barnstaple to Bude',
    'Tintagel Castle — Arthurian legend clinging to a clifftop',
    'Padstow harbour — Rick Stein\'s seafood empire and a gorgeous working port',
    'St Ives — turquoise water, white sand, and the Tate gallery',
    'Land\'s End — the dramatic westernmost point of mainland England',
    'Minack Theatre — open-air theatre carved into a cliff above the Atlantic',
    'Lizard Point — the southernmost point of mainland Britain',
    'Kynance Cove — serpentine rock stacks and impossibly clear water',
    'Clovelly — car-free cobbled village tumbling down to the harbour',
    'Dartmoor crossing — wild moorland and granite tors on the return'
  ],

  meta: {
    title: 'Coastal Cornwall',
    subtitle: '4 Days Along England\'s Atlantic Coast to Land\'s End and Back',
    totalDays: 4,
    totalDistance: '~350 miles / ~560 km',
    fuelStrategy: 'Fill up in Exeter, Barnstaple, Bude, Newquay, Penzance, and Plymouth. Fuel stations exist in most Cornish towns but are sparse on the coast roads between them. Never pass a fuel station on empty in west Cornwall.',
    packingEssentials: [
      'Waterproofs — Atlantic weather can change in minutes',
      'Warm layers — coastal winds are deceptive even in summer',
      'Tank bag with map pocket for the narrow lanes',
      'Phone mount + USB charger (signal drops in valleys and headlands)',
      'Chain lube — salt air accelerates corrosion',
      'Suncream — reflected sea light catches you out',
      'Camping: tent, sleeping bag, mat, stove',
      'OS Explorer maps 111, 102, 106, 107, 108, 126 (offline essential in rural Cornwall)'
    ]
  },

  dayColors: [
    '#FF6B6B', // Day 1 - coral
    '#4D96FF', // Day 2 - blue
    '#6BCB77', // Day 3 - green
    '#FFA502'  // Day 4 - orange
  ],

  markerColors: {
    castle: '#6c5ce7',
    village: '#2d98da',
    viewpoint: '#e8713a',
    landmark: '#9b59b6',
    beach: '#e17055',
    harbour: '#2d98da',
    road: '#e74c3c',
    camp: '#27ae60',
    fuel: '#fdcb6e',
    theatre: '#9b59b6',
    headland: '#e74c3c',
    pub: '#c0392b',
    moorland: '#8e44ad'
  },

  days: [
    // =====================================================
    // DAY 1 — Exeter to Bude via the Atlantic Highway
    // =====================================================
    {
      day: 1,
      title: 'Exeter to Bude',
      distance: '~105 miles',
      duration: '~4-5 hrs riding',
      summary: 'Head north from Exeter to pick up the spectacular A39 coast road. Detour to Dunster Castle in the Exmoor foothills, ride through the Valley of Rocks above Lynton, then join the Atlantic Highway proper at Barnstaple. The A39 sweeps west along the north Devon coast through Bideford to the impossibly picturesque Clovelly, before finishing in the surfer-friendly town of Bude on the Cornwall border.',
      center: [51.00, -3.95],
      zoom: 9,
      region: 'devon-north',

      waypoints: [
        [50.724, -3.527], [50.870, -3.480], [51.030, -3.460],
        [51.182, -3.441], [51.233, -3.852], [51.185, -3.910],
        [51.080, -4.061], [51.017, -4.206], [51.013, -4.257],
        [50.999, -4.400], [50.880, -4.490], [50.830, -4.543]
      ],

      stops: [
        {
          name: 'Exeter Cathedral Green',
          type: 'landmark',
          lat: 50.7224,
          lng: -3.5275,
          description: 'Your starting point. Exeter\'s medieval cathedral is one of the finest Gothic buildings in England, with the longest unbroken vaulted ceiling in the world. Grab a coffee on Cathedral Green, fill up at the garage on the ring road, and head north on the A396 towards Tiverton.',
          rating: 4
        },
        {
          name: 'Dunster Castle',
          type: 'castle',
          lat: 51.1815,
          lng: -3.4410,
          description: 'A fairy-tale castle perched on a wooded tor above the medieval village of Dunster. The gatehouse dates from 1420 and the views across to Exmoor and the Bristol Channel are superb. The village below has a 17th-century yarn market and excellent cream teas. Allow an hour if you go inside.',
          rating: 5
        },
        {
          name: 'Valley of Rocks',
          type: 'viewpoint',
          lat: 51.2325,
          lng: -3.8520,
          description: 'A dry valley above Lynton lined with dramatic rock formations — Castle Rock, Ragged Jack, and the Devil\'s Cheesewring. Wild goats roam the crags and the views along the coast are extraordinary. The road in from Lynton is narrow and twisting but utterly spectacular.',
          rating: 5
        },
        {
          name: 'Barnstaple',
          type: 'village',
          lat: 51.0800,
          lng: -4.0610,
          description: 'Devon\'s oldest borough and your fuel and food stop before the Atlantic Highway. The ancient Long Bridge spans the Taw estuary and the pannier market is one of the finest Victorian covered markets in the country. Fill up here — fuel gets scarcer heading west.',
          rating: 3
        },
        {
          name: 'Clovelly Village',
          type: 'village',
          lat: 50.9986,
          lng: -4.4003,
          description: 'A privately owned village tumbling 400ft down a cliff to a tiny harbour via a single cobbled street too steep for cars. Donkeys and sledges carry supplies. It\'s touristy and there\'s an entry fee, but the setting is genuinely extraordinary. Leave the bike at the top and walk down — the harbour at the bottom is worth every cobblestone.',
          rating: 5
        },
        {
          name: 'Bude',
          type: 'village',
          lat: 50.8296,
          lng: -4.5434,
          description: 'A laid-back surf town right on the Cornwall border with a dramatic sea pool carved into the rocks, wide sandy beaches, and a canal-side cricket pitch. Good selection of pubs and fish & chip shops. Camp at Upper Lynstone or grab a B&B on the Crescent.',
          rating: 4
        },
        {
          name: 'Bude Sea Pool',
          type: 'landmark',
          lat: 50.8310,
          lng: -4.5530,
          description: 'A semi-natural tidal swimming pool built into the rocks below Summerleaze Beach. Free to swim in and refreshingly bracing even in August. The breakwater gives panoramic views of the Atlantic.',
          rating: 4
        },
        {
          name: 'Upper Lynstone Campsite',
          type: 'camp',
          lat: 50.8200,
          lng: -4.5500,
          description: 'Clifftop campsite with sea views just south of Bude. Flat pitches, hot showers, and a short walk to the coastal path. Well-run and popular with bikers. Book ahead in school holidays.',
          rating: 4
        }
      ],

      roads: [
        {
          name: 'A396 Exeter to Tiverton and Exmoor approach',
          rating: 3,
          description: 'A gentle warm-up ride through the Exe Valley. Green rolling hills, thatched villages, and sweeping bends along the river. Good surface and light traffic.'
        },
        {
          name: 'A39 Porlock to Lynton coast road',
          rating: 5,
          description: 'One of the most dramatic roads in the Southwest. Climbs over Porlock Hill (1 in 4 gradient — take the toll road for a gentler alternative), then hugs the cliffs above the Bristol Channel. The stretch into Lynton is raw, exposed, and unforgettable.'
        },
        {
          name: 'A39 Atlantic Highway — Barnstaple to Bude',
          rating: 4,
          description: 'The legendary Atlantic Highway. A fast, sweeping dual carriageway in places that opens up to big coastal views. Good surface, long straights, and satisfying bends. Watch for caravans in summer.'
        }
      ],

      route: [
        [50.724, -3.527], [50.780, -3.490], [50.870, -3.480],
        [50.960, -3.460], [51.030, -3.460], [51.100, -3.440],
        [51.182, -3.441], [51.210, -3.700], [51.233, -3.852],
        [51.185, -3.910], [51.140, -3.980], [51.080, -4.061],
        [51.030, -4.180], [51.017, -4.206], [51.013, -4.257],
        [50.999, -4.400], [50.950, -4.450], [50.880, -4.490],
        [50.850, -4.520], [50.830, -4.543]
      ],

      tips: 'Porlock Hill is steep and technical — take the toll road if you\'re on a heavy bike or it\'s wet. Fill up in Barnstaple; fuel options thin out on the Atlantic Highway. Clovelly charges an entry fee (~£8) but it\'s worth it. Bude gets busy with surfers in summer — book accommodation ahead.'
    },

    // =====================================================
    // DAY 2 — Bude to St Ives via Tintagel and Padstow
    // =====================================================
    {
      day: 2,
      title: 'Bude to St Ives',
      distance: '~95 miles',
      duration: '~4-5 hrs riding',
      summary: 'The Arthurian coastline day. Drop south from Bude to the dramatic clifftop ruins of Tintagel Castle, then weave through Port Isaac (Doc Martin\'s Portwenn), Padstow\'s foodie harbour, and the surf beaches of Newquay. The coast road continues past the old tin-mining headlands of St Agnes before finishing in the jewel of Cornwall — St Ives, where turquoise water meets white sand and the Tate gallery.',
      center: [50.45, -5.05],
      zoom: 9,
      region: 'cornwall-north',

      waypoints: [
        [50.830, -4.543], [50.750, -4.620], [50.668, -4.758],
        [50.592, -4.830], [50.541, -4.937], [50.430, -5.030],
        [50.415, -5.076], [50.310, -5.221], [50.260, -5.310],
        [50.213, -5.481]
      ],

      stops: [
        {
          name: 'Tintagel Castle',
          type: 'castle',
          lat: 50.6685,
          lng: -4.7579,
          description: 'The legendary birthplace of King Arthur, perched on a headland connected to the mainland by a dramatic footbridge. English Heritage rebuilt the bridge in 2019 and it\'s a stunning piece of engineering. The 13th-century castle ruins and the Dark Age settlement beneath are genuinely atmospheric. The cliff path approach is steep — leave the bike in the village car park and allow 90 minutes.',
          rating: 5
        },
        {
          name: 'Port Isaac',
          type: 'village',
          lat: 50.5928,
          lng: -4.8296,
          description: 'The impossibly photogenic fishing village that doubles as Portwenn in Doc Martin. Narrow lanes squeeze between whitewashed cottages down to a tiny harbour. Squeeze Belly Alley is genuinely tight. Excellent crab sandwiches from Fresh From The Sea on the harbour. The ride down is steep — first gear and feather the brakes.',
          rating: 5
        },
        {
          name: 'Padstow Harbour',
          type: 'harbour',
          lat: 50.5407,
          lng: -4.9374,
          description: 'Rick Stein transformed this medieval fishing port into Britain\'s foodie capital. His fish & chips on the quay are legendary (and there\'s always a queue). Beyond the celebrity restaurants, Padstow is a genuinely beautiful working harbour with ferries to Rock and the Camel Trail cycle path along the estuary. Good fuel stop.',
          rating: 5
        },
        {
          name: 'Newquay Beaches',
          type: 'beach',
          lat: 50.4152,
          lng: -5.0757,
          description: 'Cornwall\'s surf capital. Fistral Beach is the most famous — host of national surfing championships — but Watergate Bay and Crantock are arguably more beautiful. The town itself is lively and slightly chaotic in summer. Fuel up here for the run south.',
          rating: 4
        },
        {
          name: 'St Agnes Head',
          type: 'headland',
          lat: 50.3120,
          lng: -5.2268,
          description: 'A haunting headland scarred by centuries of tin mining. The engine houses of Wheal Coates cling to the cliffs above Chapel Porth beach — one of the most photographed scenes in Cornwall. The village of St Agnes above is quietly charming with a good pub (the Railway Inn) and a craft bakery.',
          rating: 5
        },
        {
          name: 'St Ives',
          type: 'village',
          lat: 50.2128,
          lng: -5.4807,
          description: 'The crown jewel of Cornwall. A maze of narrow lanes and whitewashed cottages wrapped around a harbour with water so clear it looks Mediterranean. The Tate St Ives overlooks Porthmeor Beach and the Barbara Hepworth Museum is a hidden gem. Parking is a nightmare in summer — use the park-and-ride or arrive early. Stay at Ayr Holiday Park or one of the harbour B&Bs.',
          rating: 5
        },
        {
          name: 'Tate St Ives',
          type: 'landmark',
          lat: 50.2155,
          lng: -5.4850,
          description: 'A beautifully designed gallery perched above Porthmeor Beach showcasing modern art inspired by Cornwall\'s light and landscape. The rooftop terrace has one of the best views in town. Even if art isn\'t your thing, the building and the setting are worth the visit.',
          rating: 4
        },
        {
          name: 'Ayr Holiday Park',
          type: 'camp',
          lat: 50.2180,
          lng: -5.4900,
          description: 'Well-positioned campsite above St Ives with sea views and a short walk into town. Hot showers, small shop, and flat grass pitches. Popular and busy in summer — book well ahead. The coastal path passes right by.',
          rating: 4
        }
      ],

      roads: [
        {
          name: 'B3263 Bude to Tintagel coast road',
          rating: 4,
          description: 'A twisting, narrow road that follows the clifftops between Bude and Tintagel. Dramatic views, sudden dips, and blind bends — take your time and watch for tractors. The surface is patchy in places but the scenery is relentless.'
        },
        {
          name: 'B3314 / B3276 Padstow to Newquay coastal road',
          rating: 4,
          description: 'The scenic route hugging the coast between Padstow and Newquay. Narrower and slower than the A39 but infinitely more rewarding. Passes through Porthcothan, Mawgan Porth, and Watergate Bay with sea views the entire way.'
        },
        {
          name: 'B3277 / B3285 St Agnes to St Ives',
          rating: 4,
          description: 'Quiet back roads threading through old mining country and dropping into St Ives from above. The descent into town on the B3306 is tight and steep — first gear territory — but the view opening up below you is stunning.'
        }
      ],

      route: [
        [50.830, -4.543], [50.780, -4.590], [50.750, -4.620],
        [50.710, -4.700], [50.668, -4.758], [50.630, -4.800],
        [50.592, -4.830], [50.560, -4.880], [50.541, -4.937],
        [50.480, -4.990], [50.430, -5.030], [50.415, -5.076],
        [50.370, -5.130], [50.310, -5.221], [50.260, -5.310],
        [50.240, -5.400], [50.213, -5.481]
      ],

      tips: 'Tintagel gets packed in summer — arrive before 10am or after 4pm to avoid the worst crowds. Port Isaac\'s lanes are genuinely scary on a big bike — consider parking at the top. Padstow is impossible to park in during school holidays. St Ives park-and-ride saves a lot of stress.'
    },

    // =====================================================
    // DAY 3 — St Ives to Lizard Point via Land's End
    // =====================================================
    {
      day: 3,
      title: 'St Ives to Lizard Point',
      distance: '~70 miles',
      duration: '~3-4 hrs riding',
      summary: 'The most concentrated day of the trip. Ride the wild B3306 coast road to Zennor, continue to the very tip of England at Land\'s End, then loop south past the extraordinary Minack Theatre carved into a cliff above the sea. Drop down to the gorgeous cove of Porthcurno before heading east along the south coast to reach Lizard Point — the southernmost spot on the British mainland. Short miles but enormous drama.',
      center: [50.10, -5.45],
      zoom: 10,
      region: 'cornwall-west',

      waypoints: [
        [50.213, -5.481], [50.192, -5.562], [50.148, -5.602],
        [50.118, -5.532], [50.065, -5.713], [50.044, -5.646],
        [50.042, -5.647], [50.060, -5.560], [50.050, -5.400],
        [49.958, -5.204]
      ],

      stops: [
        {
          name: 'St Ives Harbour',
          type: 'harbour',
          lat: 50.2128,
          lng: -5.4807,
          description: 'Start the day with a walk along Smeaton\'s Pier and a coffee overlooking the harbour. Early morning light on the water here is magical — you\'ll see why artists have been coming for a century. Check the bike and head west on the B3306.',
          rating: 5
        },
        {
          name: 'Zennor',
          type: 'village',
          lat: 50.1919,
          lng: -5.5622,
          description: 'A tiny granite hamlet clinging to the moor above the sea. The church of St Senara has a famous medieval mermaid carving on a bench end. The Tinners Arms serves proper Cornish ale in a 13th-century pub. D.H. Lawrence lived here during WWI until he was suspected of signalling to German submarines. Gloriously bleak and atmospheric.',
          rating: 4
        },
        {
          name: 'Land\'s End',
          type: 'landmark',
          lat: 50.0654,
          lng: -5.7132,
          description: 'The westernmost point of mainland England. The famous signpost is a bit cheesy and the theme park complex is best ignored — but walk past it to the actual headland and the views are genuinely spectacular. The Longships lighthouse sits a mile offshore and on a clear day you can see the Isles of Scilly 28 miles away. Dramatic granite cliffs dropping into boiling Atlantic surf.',
          rating: 4
        },
        {
          name: 'Minack Theatre',
          type: 'theatre',
          lat: 50.0442,
          lng: -5.6453,
          description: 'An open-air theatre carved into the granite cliff 200ft above the sea by Rowena Cade, starting in the 1930s. Even without a performance, the terraced seating and the ocean backdrop are breathtaking. If you can catch an evening show, it\'s one of the most magical experiences in Britain. The gardens cascading down the cliff are planted with subtropical species.',
          rating: 5
        },
        {
          name: 'Porthcurno Beach',
          type: 'beach',
          lat: 50.0440,
          lng: -5.6494,
          description: 'A perfect crescent of white sand in a sheltered cove directly below the Minack Theatre. The turquoise water is Caribbean-clear on a sunny day. The Telegraph Museum nearby tells the story of the undersea cables that once connected Britain to the world from this very beach.',
          rating: 5
        },
        {
          name: 'Penzance',
          type: 'village',
          lat: 50.1186,
          lng: -5.5315,
          description: 'Fuel and food stop on the route west. A handsome Regency town with views across Mount\'s Bay to St Michael\'s Mount. The promenade is worth a stroll and the Turk\'s Head claims to be the oldest pub in Cornwall (1233). Fill up here — there\'s nothing at Land\'s End.',
          rating: 3
        },
        {
          name: 'Lizard Point',
          type: 'headland',
          lat: 49.9577,
          lng: -5.2042,
          description: 'The southernmost point of mainland Britain. A windswept headland of dark serpentine rock with a lighthouse, a lifeboat station, and views that stretch to the horizon in every direction. The old lifeboat house at Polpeor Cove is now a café — arguably the best-located cream tea in Britain. The serpentine rock is unique to this peninsula and polished souvenirs are a local speciality.',
          rating: 5
        },
        {
          name: 'Lizard YHA / Wild Camp',
          type: 'camp',
          lat: 49.9620,
          lng: -5.2070,
          description: 'The YHA hostel at Lizard Point is perfectly positioned for the sunset. For camping, Henry\'s Campsite in the Lizard village is basic, cheap, and friendly — flat pitches in a sheltered field with hot showers. A short walk to the village pub (the Top House) for a pint of Doom Bar.',
          rating: 4
        }
      ],

      roads: [
        {
          name: 'B3306 St Ives to St Just',
          rating: 5,
          description: 'The finest coastal road in Cornwall. A narrow, twisting single-carriageway that clings to the clifftops above the Atlantic with heart-stopping views at every turn. Ancient stone walls, moorland, abandoned mine workings, and the sea crashing below. Take it slow and savour every mile — this is what you came for.'
        },
        {
          name: 'A30 / B3315 Land\'s End to Porthcurno',
          rating: 4,
          description: 'A quick blast on the A30 to the Land\'s End turnoff, then narrow lanes drop south to the Minack Theatre and Porthcurno. The final descent to Porthcurno is steep and tight but the reward is one of Britain\'s best beaches.'
        },
        {
          name: 'A394 / A3083 to Lizard Point',
          rating: 3,
          description: 'Straightforward main roads across the base of the Lizard peninsula. Not the most exciting riding but efficient and the landscape shifts noticeably — heathland replaces granite moor. The final stretch to Lizard village is quiet and atmospheric.'
        }
      ],

      route: [
        [50.213, -5.481], [50.200, -5.520], [50.192, -5.562],
        [50.170, -5.580], [50.148, -5.602], [50.130, -5.570],
        [50.118, -5.532], [50.095, -5.610], [50.080, -5.670],
        [50.065, -5.713], [50.055, -5.680], [50.044, -5.646],
        [50.042, -5.647], [50.060, -5.560], [50.080, -5.450],
        [50.050, -5.400], [50.020, -5.300], [49.980, -5.250],
        [49.958, -5.204]
      ],

      tips: 'The B3306 is narrow and has blind bends — don\'t push it. Land\'s End car park charges ~£7 but it\'s the only option. Fill up in Penzance — there\'s no fuel between there and the Lizard. The Minack Theatre shows run from May to September; check the website and book ahead for evening performances. Porthcurno car park fills early on sunny days.'
    },

    // =====================================================
    // DAY 4 — Lizard to Exeter via Falmouth and Plymouth
    // =====================================================
    {
      day: 4,
      title: 'Lizard to Exeter',
      distance: '~160 miles',
      duration: '~5-6 hrs riding',
      summary: 'The longest day but a glorious homeward run. Start with the stunning Kynance Cove, then sweep up through Falmouth\'s maritime harbour and across to the Fowey estuary. Follow the coast through the twin fishing towns of Looe and Polperro, cross the Tamar into Devon at Plymouth, and ride home across the wild expanse of Dartmoor. You\'ll arrive back in Exeter with salt in your hair and 350 miles of Atlantic coastline in your memory.',
      center: [50.35, -4.40],
      zoom: 9,
      region: 'cornwall-south',

      waypoints: [
        [49.958, -5.204], [49.974, -5.232], [50.054, -5.130],
        [50.154, -5.071], [50.270, -4.780], [50.336, -4.635],
        [50.354, -4.453], [50.332, -4.414], [50.366, -4.142],
        [50.385, -4.025], [50.547, -3.922], [50.724, -3.527]
      ],

      stops: [
        {
          name: 'Kynance Cove',
          type: 'beach',
          lat: 49.9740,
          lng: -5.2316,
          description: 'Often called the most beautiful cove in Britain. Dark serpentine rock stacks rise from impossibly clear turquoise water, with caves to explore at low tide and a tiny beach café above. The 15-minute walk down from the car park builds the anticipation. Go at low tide for the full experience — the islands and caves are submerged at high water.',
          rating: 5
        },
        {
          name: 'Falmouth Harbour',
          type: 'harbour',
          lat: 50.1543,
          lng: -5.0710,
          description: 'The world\'s third-largest natural harbour and still a working port. The National Maritime Museum is excellent, and the town has a lively cafe and pub scene. Custom House Quay is a good spot for a pasty and a view. Fill up here for the run east.',
          rating: 4
        },
        {
          name: 'Fowey',
          type: 'village',
          lat: 50.3362,
          lng: -4.6354,
          description: 'A gorgeous estuary town that was Daphne du Maurier\'s home and inspiration. Steep narrow streets drop to a busy harbour where working boats mix with yachts. The Lugger Inn on the quay serves excellent seafood. The car ferry from Bodinnick across the river is a moment of theatre in itself.',
          rating: 4
        },
        {
          name: 'Looe',
          type: 'village',
          lat: 50.3537,
          lng: -4.4532,
          description: 'A proper Cornish fishing town split into East and West by the river. The fish market still operates from the quay and the narrow streets are packed with character. Less polished than some Cornish towns but all the more genuine for it. Good ice cream from Penguin\'s on the harbour.',
          rating: 3
        },
        {
          name: 'Plymouth Hoe',
          type: 'viewpoint',
          lat: 50.3659,
          lng: -4.1424,
          description: 'The famous promenade where Drake supposedly finished his bowls before defeating the Armada. The views across Plymouth Sound are magnificent — the Breakwater, Drake\'s Island, and the open sea beyond. Smeaton\'s Tower (the relocated Eddystone Lighthouse) stands proudly on the headland. A fitting pause before the final leg across Dartmoor.',
          rating: 4
        },
        {
          name: 'Dartmoor — Two Bridges',
          type: 'moorland',
          lat: 50.5477,
          lng: -3.9220,
          description: 'The wild heart of Devon. Two Bridges sits at the junction of the B3357 and B3212 in the middle of the moor — granite tors, open heathland, and Dartmoor ponies in every direction. The Two Bridges Hotel does a proper cream tea. The road from Princetown across the moor to Moretonhampstead is one of Devon\'s finest.',
          rating: 4
        },
        {
          name: 'Princetown & Dartmoor Prison',
          type: 'landmark',
          lat: 50.5434,
          lng: -3.9874,
          description: 'The highest town in England at 1,430ft, dominated by the infamous prison built to hold Napoleonic War prisoners. The Dartmoor Prison Museum is grimly fascinating. The Plume of Feathers pub claims to be the oldest building on Dartmoor. Bleak, atmospheric, and a world away from the coast you just left.',
          rating: 3
        },
        {
          name: 'Exeter — Journey\'s End',
          type: 'landmark',
          lat: 50.7236,
          lng: -3.5275,
          description: 'Back where you started, 350 miles and four days later. Drop into the Ship Inn on Martin\'s Lane — it\'s been serving Drake\'s ale since 1587 — and toast a proper Cornish circumnavigation. You\'ve ridden the Atlantic Highway, stood at Land\'s End, touched the southernmost point of Britain, and crossed Dartmoor. Not bad for a long weekend.',
          rating: 4
        }
      ],

      roads: [
        {
          name: 'A3083 / coast road Lizard to Falmouth',
          rating: 3,
          description: 'Quick run up from the Lizard to Helston, then A394 and back roads to Falmouth via the Helford River. Quiet, green, and gently rolling. The King Harry Ferry across the Fal is a charming shortcut.'
        },
        {
          name: 'A390 / B3269 Fowey to Looe',
          rating: 4,
          description: 'Rolling south Cornwall lanes dipping in and out of wooded valleys and estuary crossings. Narrower and more technical than the north coast roads. Watch for tractors and delivery vans on blind bends.'
        },
        {
          name: 'A38 Looe to Plymouth',
          rating: 3,
          description: 'Fast dual carriageway sweeping around the coast into Plymouth. Efficient rather than scenic but gets you across the Tamar Bridge and into Devon quickly. Good surface and well-signposted.'
        },
        {
          name: 'B3212 Dartmoor crossing — Yelverton to Moretonhampstead',
          rating: 5,
          description: 'The classic Dartmoor road. Climbs from the Tavy Valley onto the open moor, through Princetown and Two Bridges, then descends through Postbridge to Moretonhampstead. Big open views, sweeping bends, and granite everywhere. Wild ponies and sheep on the road — stay alert. The final descent into Exeter on the A382 is fast and satisfying.'
        }
      ],

      route: [
        [49.958, -5.204], [49.974, -5.232], [50.000, -5.200],
        [50.054, -5.130], [50.100, -5.100], [50.154, -5.071],
        [50.200, -5.000], [50.270, -4.780], [50.310, -4.700],
        [50.336, -4.635], [50.354, -4.453], [50.350, -4.350],
        [50.332, -4.414], [50.366, -4.142], [50.385, -4.025],
        [50.450, -3.980], [50.500, -3.960], [50.543, -3.987],
        [50.547, -3.922], [50.580, -3.850], [50.620, -3.750],
        [50.660, -3.650], [50.700, -3.560], [50.724, -3.527]
      ],

      tips: 'Kynance Cove car park is National Trust — free for members, ~£6 otherwise. Check tide times before going down. The King Harry Ferry across the Fal saves miles and is a lovely crossing — runs every 20 minutes. Plymouth is a busy city — follow signs for the Hoe to avoid getting lost in the one-way system. Dartmoor ponies are unpredictable — slow down when you see them. Fill up in Plymouth; there\'s no fuel on the moor.'
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { COASTAL_CORNWALL };
}
