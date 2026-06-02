const CHANNEL_ISLANDS_EXPLORER = {
  slug: 'channel-islands-explorer',
  name: 'Channel Islands Explorer',
  tagline: 'Island-hopping through Guernsey and Jersey — coastal forts, cliff roads, and wartime history on two wheels',
  duration: '5 days',
  distance: '~120 miles',
  startLocation: 'St Peter Port, Guernsey',
  endLocation: 'St Helier, Jersey',
  difficulty: 'Easy',
  bestTime: 'May to September',
  description: 'A compact five-day motorcycle tour across the two largest Channel Islands. Start in Guernsey\'s elegant St Peter Port, loop the island\'s rugged north coast and fortified south, then hop the ferry to Jersey for wartime tunnels, dramatic hill climbs, and a lighthouse sunset at La Corbière. Short daily distances mean plenty of time to stop, explore, and soak in the sea air. Roads are narrow and quiet — perfect for an unhurried ride with ocean views around every bend.',
  highlights: [
    'Castle Cornet — 800 years of fortification guarding St Peter Port harbour',
    'The Little Chapel — a miniature church covered in shells, pebbles and broken china',
    'Pleinmont headland — Guernsey\'s wild southwest tip with WWII observation towers',
    'Jersey War Tunnels — the most powerful Occupation museum in the islands',
    'Bouley Bay hill climb — Jersey\'s legendary motorsport road',
    'La Corbière Lighthouse — iconic tidal causeway sunset spot',
    'Mont Orgueil Castle — medieval fortress looming over Gorey harbour',
    'La Hougue Bie — one of Europe\'s best-preserved Neolithic passage graves'
  ],

  dayColors: [
    '#FF6B6B', // Day 1 - coral
    '#4D96FF', // Day 2 - blue
    '#FFA502', // Day 3 - orange
    '#6BCB77', // Day 4 - green
    '#9B59B6'  // Day 5 - purple
  ],

  markerColors: {
    landmark: '#9b59b6',
    viewpoint: '#e8713a',
    beach: '#e17055',
    castle: '#6c5ce7',
    museum: '#3498db',
    ferry: '#3498db',
    camp: '#27ae60',
    fort: '#e74c3c',
    historical: '#cd853f',
    fuel: '#fdcb6e',
    church: '#f39c12',
    harbour: '#2d98da',
    lighthouse: '#e74c3c',
    road: '#e74c3c'
  },

  days: [
    // =====================================================
    // DAY 1 — Guernsey North Coast
    // =====================================================
    {
      day: 1,
      title: 'Guernsey North Coast',
      distance: '~20 miles',
      duration: '~2-3 hrs riding',
      summary: 'Ease into island life with a loop around Guernsey\'s north coast. Start at the harbour fortress of Castle Cornet, ride through the low-lying parishes of Vale and Castel, and finish at the sheltered inlet of Bordeaux Harbour. Narrow lanes, granite walls, and sea glimpses at every turn.',
      center: [49.4700, -2.5400],
      zoom: 13,
      region: 'guernsey',
      waypoints: [
        [49.4566, -2.5356],
        [49.4530, -2.5310],
        [49.4600, -2.5250],
        [49.4680, -2.5300],
        [49.4750, -2.5480],
        [49.4820, -2.5500],
        [49.4870, -2.5380],
        [49.4850, -2.5270],
        [49.4830, -2.5170],
        [49.4780, -2.5080],
        [49.4700, -2.5100]
      ],
      stops: [
        {
          name: 'St Peter Port Harbour',
          type: 'harbour',
          lat: 49.4566,
          lng: -2.5356,
          description: 'Guernsey\'s capital and your starting point. A handsome harbour town stacked up a steep hillside. Top up fuel at the garage on the esplanade before heading out — stations are sparse once you leave town.',
          rating: 4
        },
        {
          name: 'Castle Cornet',
          type: 'castle',
          lat: 49.4530,
          lng: -2.5310,
          description: 'An 800-year-old fortress on a tidal islet at the mouth of St Peter Port harbour. Five museums inside, plus the noon-day gun fired daily in summer. The battlements give a 360° panorama of the harbour, Herm, Sark, and the French coast on clear days.',
          rating: 5
        },
        {
          name: 'Salerie Corner Fuel Station',
          type: 'fuel',
          lat: 49.4610,
          lng: -2.5270,
          description: 'Fill up here before heading north. Guernsey\'s 35mph island-wide speed limit means fuel goes further, but stations are few and far between outside St Peter Port.',
          rating: 2
        },
        {
          name: 'Vale Church',
          type: 'landmark',
          lat: 49.4770,
          lng: -2.5480,
          description: 'Ancient parish church surrounded by some of Guernsey\'s oldest lanes. The Vale was once a separate tidal island — you can still trace the old shoreline. Quiet, atmospheric, and a good orientation stop.',
          rating: 3
        },
        {
          name: 'L\'Ancresse Common & Beach',
          type: 'beach',
          lat: 49.4870,
          lng: -2.5380,
          description: 'A wide sandy bay backed by common land and a golf course on Guernsey\'s northernmost tip. Loophole towers and Martello towers dot the headland — reminders of the island\'s centuries of fortification. Great spot to stretch your legs.',
          rating: 4
        },
        {
          name: 'Pembroke Bay',
          type: 'beach',
          lat: 49.4860,
          lng: -2.5220,
          description: 'Quieter than L\'Ancresse next door, with rock pools at low tide and a dramatic German bunker built into the headland. The concrete observation tower is worth scrambling up for the view.',
          rating: 3
        },
        {
          name: 'Bordeaux Harbour',
          type: 'harbour',
          lat: 49.4830,
          lng: -2.5150,
          description: 'A tiny sheltered harbour on Guernsey\'s northeast coast with views across to Herm and Jethou. Park up at the slipway and walk out along the rocks. At low tide you can see the fish traps that have been here since medieval times.',
          rating: 4
        },
        {
          name: 'Beaucette Marina Wild Camp Spot',
          type: 'camp',
          lat: 49.4850,
          lng: -2.5100,
          description: 'Discreet wild camping possibility on the headland above Beaucette quarry marina. Flat grassy areas with views to Herm. Be respectful and leave no trace — Guernsey is small and word travels fast. Alternatively, book at Vaugrat Campsite nearby.',
          rating: 3
        }
      ],
      roads: [
        {
          name: 'Route du Braye / North Coast Road',
          rating: 3,
          description: 'Guernsey\'s north coast road sweeps along the bays from Vale to Bordeaux. Flat and open with sea views. Max 35mph but the scenery makes up for the speed limit.'
        }
      ],
      route: [
        [49.4566, -2.5356], [49.4530, -2.5310], [49.4600, -2.5250],
        [49.4680, -2.5300], [49.4750, -2.5480], [49.4820, -2.5500],
        [49.4870, -2.5380], [49.4850, -2.5270], [49.4830, -2.5170],
        [49.4830, -2.5150]
      ],
      tips: 'Guernsey\'s speed limit is 35mph island-wide (25mph in built-up areas). Don\'t fight it — the lanes are narrow, hedgerows are high, and there are blind bends everywhere. Ride slow, enjoy the views.'
    },

    // =====================================================
    // DAY 2 — Guernsey South & West Coast
    // =====================================================
    {
      day: 2,
      title: 'Guernsey South & West Coast',
      distance: '~18 miles',
      duration: '~3-4 hrs riding',
      summary: 'The wilder side of Guernsey. From the eccentric Little Chapel to the brooding German bunkers at Pleinmont, this loop covers the island\'s most dramatic coastline. Fort Grey\'s shipwreck museum and the sweeping curve of Rocquaine Bay are highlights.',
      center: [49.4400, -2.5750],
      zoom: 13,
      region: 'guernsey',
      waypoints: [
        [49.4566, -2.5356],
        [49.4460, -2.5580],
        [49.4440, -2.5640],
        [49.4400, -2.5700],
        [49.4340, -2.5830],
        [49.4280, -2.5990],
        [49.4310, -2.5980],
        [49.4350, -2.5950],
        [49.4370, -2.5900],
        [49.4450, -2.5680],
        [49.4566, -2.5356]
      ],
      stops: [
        {
          name: 'The Little Chapel',
          type: 'church',
          lat: 49.4440,
          lng: -2.5640,
          description: 'Possibly the smallest chapel in the world — a miniature church decorated with seashells, pebbles, and fragments of broken china. Built by a monk in 1914, inspired by the grotto at Lourdes. Quirky, beautiful, and completely unique. Free to visit.',
          rating: 5
        },
        {
          name: 'German Occupation Museum',
          type: 'museum',
          lat: 49.4460,
          lng: -2.5770,
          description: 'A sobering and fascinating private collection documenting the five-year German occupation of Guernsey (1940-1945). Packed with original artefacts — uniforms, documents, equipment, and personal stories from both sides. Essential context for the bunkers and fortifications you\'ll see all over the island.',
          rating: 5
        },
        {
          name: 'Pleinmont Headland',
          type: 'viewpoint',
          lat: 49.4280,
          lng: -2.5990,
          description: 'Guernsey\'s wild southwest tip — dramatic cliffs, heathland, and the largest concentration of German fortifications on the island. The observation tower (MP3) is accessible and gives sweeping views towards Jersey and France. A bleak, windswept place with real atmosphere.',
          rating: 5
        },
        {
          name: 'Pleinmont WWII Bunkers',
          type: 'historical',
          lat: 49.4290,
          lng: -2.5970,
          description: 'A network of German bunkers, gun emplacements, and command posts scattered across the headland. Some are open to explore — bring a torch. These were part of Hitler\'s Atlantic Wall, built by forced labourers under brutal conditions.',
          rating: 4
        },
        {
          name: 'Rocquaine Bay',
          type: 'beach',
          lat: 49.4350,
          lng: -2.5950,
          description: 'A long sweeping bay on Guernsey\'s west coast, sheltered by Lihou Island offshore. At very low spring tides you can walk the causeway to Lihou — but check tide times carefully or you\'ll be stranded. The bay catches the sunset beautifully.',
          rating: 4
        },
        {
          name: 'Fort Grey — Shipwreck Museum',
          type: 'fort',
          lat: 49.4370,
          lng: -2.5900,
          description: 'A Martello tower on a tidal islet, now housing the Shipwreck Museum. Guernsey\'s west coast was notorious for wrecks — hundreds of ships came to grief on these rocks. The museum tells their stories with recovered artefacts, and the tower itself is a fine example of Napoleonic coastal defence.',
          rating: 4
        },
        {
          name: 'Lihou Island Causeway',
          type: 'landmark',
          lat: 49.4340,
          lng: -2.5980,
          description: 'A tidal causeway connecting Guernsey to tiny Lihou Island, home to a ruined medieval priory. Only passable at low tide — check Guernsey tide tables before attempting the crossing. The island is a nature reserve with nesting seabirds.',
          rating: 3
        },
        {
          name: 'Vazon Bay Wild Camp',
          type: 'camp',
          lat: 49.4530,
          lng: -2.5780,
          description: 'West coast surf beach with grassy areas behind the sea wall suitable for a discreet overnight. Popular with surfers so not entirely private. For a proper site, Vaugrat Campsite in Castel has flat pitches and basic facilities.',
          rating: 3
        }
      ],
      roads: [
        {
          name: 'Route de Pleinmont',
          rating: 3,
          description: 'Narrow lane winding down to Guernsey\'s southwest tip. Hedgerows close in tight — use the horn on blind bends. The final stretch across the headland opens up with big cliff views.'
        },
        {
          name: 'West Coast Road (Route de la Rocque)',
          rating: 3,
          description: 'Follows the curve of Rocquaine Bay with the sea right beside you. Flat and open with good sight lines. One of the most pleasant stretches of road on the island.'
        }
      ],
      route: [
        [49.4566, -2.5356], [49.4460, -2.5580], [49.4440, -2.5640],
        [49.4460, -2.5770], [49.4400, -2.5700], [49.4340, -2.5830],
        [49.4280, -2.5990], [49.4310, -2.5980], [49.4350, -2.5950],
        [49.4370, -2.5900], [49.4530, -2.5780], [49.4566, -2.5356]
      ],
      tips: 'The German Occupation Museum closes at 5pm. Pleinmont headland is exposed — take a windproof layer even in summer. If you want to walk to Lihou Island, plan around low tide (usually a 3-hour window).'
    },

    // =====================================================
    // DAY 3 — Ferry to Jersey & St Helier
    // =====================================================
    {
      day: 3,
      title: 'Ferry to Jersey & St Helier',
      distance: '~15 miles',
      duration: '~2 hrs riding + ferry',
      summary: 'Cross to Jersey on the inter-island ferry and explore the capital. Elizabeth Castle sits on a tidal islet in St Aubin\'s Bay, the Jersey War Tunnels burrow deep into a hillside, and the Royal Square is the heart of the old town.',
      center: [49.1950, -2.1200],
      zoom: 13,
      region: 'jersey',
      waypoints: [
        [49.4566, -2.5356],
        [49.1858, -2.1065],
        [49.1790, -2.1150],
        [49.1863, -2.1078],
        [49.2100, -2.1450],
        [49.1900, -2.1200]
      ],
      stops: [
        {
          name: 'St Peter Port Ferry Terminal',
          type: 'ferry',
          lat: 49.4566,
          lng: -2.5356,
          description: 'Condor Ferries inter-island service to Jersey. The crossing takes about an hour on the high-speed ferry. Book bike spaces in advance — they\'re limited. Arrive 60 minutes before departure.',
          rating: 3
        },
        {
          name: 'St Helier Ferry Terminal',
          type: 'ferry',
          lat: 49.1830,
          lng: -2.1120,
          description: 'Arrival at Elizabeth Harbour. Jersey drives on the left (same as Guernsey). Speed limits: 40mph max, 30mph in town, 20mph in green lanes. Fill up at the Esplanade garage before exploring.',
          rating: 3
        },
        {
          name: 'Elizabeth Castle',
          type: 'castle',
          lat: 49.1790,
          lng: -2.1150,
          description: 'A dramatic fortress on a tidal islet in St Aubin\'s Bay, accessible by amphibious ferry (the "Castle Ferry") or on foot at low tide. Built in the 1590s and named after Elizabeth I. Sir Walter Raleigh was governor here. The views back to St Helier from the battlements are superb.',
          rating: 5
        },
        {
          name: 'Royal Square, St Helier',
          type: 'landmark',
          lat: 49.1863,
          lng: -2.1078,
          description: 'The historic heart of Jersey\'s capital. The gilded statue of George II presides over a cobbled square lined with the States Chamber (Jersey\'s parliament), the Royal Court, and the public library. Market stalls on Saturdays.',
          rating: 4
        },
        {
          name: 'Central Market',
          type: 'landmark',
          lat: 49.1870,
          lng: -2.1100,
          description: 'A beautiful Victorian covered market in the centre of St Helier. Iron-and-glass roof, fountain in the middle, and stalls selling fresh Jersey produce — royals, seafood, cider, and black butter. Good lunch stop.',
          rating: 4
        },
        {
          name: 'Jersey War Tunnels (Hohlgangsanlage 8)',
          type: 'museum',
          lat: 49.2100,
          lng: -2.1450,
          description: 'A vast underground hospital complex carved out of solid rock by forced labourers during the German Occupation. Now a deeply moving museum that focuses on the human stories of the Occupation — the enslaved workers, the deported islanders, the acts of resistance. Allow 2 hours. The most important historical site in the Channel Islands.',
          rating: 5
        },
        {
          name: 'Howard Davis Park',
          type: 'landmark',
          lat: 49.1920,
          lng: -2.1000,
          description: 'Elegant public park with a memorial garden to Jersey soldiers killed in WWI. Donated by a grieving father in memory of his son. The rose gardens are lovely in summer. Good spot to stretch out after the intensity of the War Tunnels.',
          rating: 3
        },
        {
          name: 'St Brelade\'s Bay Wild Camp',
          type: 'camp',
          lat: 49.1780,
          lng: -2.1650,
          description: 'Jersey is small and wild camping is technically not permitted, but discreet overnighting is possible on the headland above St Brelade\'s Bay. For a proper site, Beauvelande Camp Site near St Martin is bike-friendly with hot showers.',
          rating: 3
        }
      ],
      roads: [
        {
          name: 'St Aubin\'s Bay Esplanade',
          rating: 3,
          description: 'The seafront road from St Helier west towards St Aubin. Flat and straight with views across the bay to Elizabeth Castle. A gentle introduction to Jersey\'s roads.'
        }
      ],
      route: [
        [49.1830, -2.1120], [49.1790, -2.1150], [49.1858, -2.1065],
        [49.1863, -2.1078], [49.1870, -2.1100], [49.1920, -2.1000],
        [49.2100, -2.1450], [49.1900, -2.1200]
      ],
      ferryRoute: [
        [49.4566, -2.5356], [49.4200, -2.4800], [49.3700, -2.4000],
        [49.3200, -2.3200], [49.2700, -2.2500], [49.2200, -2.1800],
        [49.1900, -2.1200], [49.1830, -2.1120]
      ],
      tips: 'Book the earliest ferry to maximise your Jersey time. Elizabeth Castle is tidal — check times or take the amphibious ferry. The War Tunnels close at 4:30pm (last entry 3pm), so plan accordingly. Jersey fuel is cheaper than Guernsey — fill up here.'
    },

    // =====================================================
    // DAY 4 — Jersey North Coast
    // =====================================================
    {
      day: 4,
      title: 'Jersey North Coast',
      distance: '~35 miles',
      duration: '~4-5 hrs riding',
      summary: 'The best riding day. Jersey\'s north coast is a string of dramatic bays, cliff paths, and one legendary hill climb. Bouley Bay\'s 1-in-4 gradient is the steepest road in the Channel Islands and hosts an annual motorcycle hill climb. End at La Corbière Lighthouse for sunset.',
      center: [49.2250, -2.1300],
      zoom: 12,
      region: 'jersey',
      waypoints: [
        [49.1858, -2.1065],
        [49.2050, -2.0600],
        [49.2200, -2.0250],
        [49.2350, -2.0200],
        [49.2430, -2.0620],
        [49.2400, -2.1100],
        [49.2420, -2.1760],
        [49.2520, -2.1900],
        [49.2200, -2.2200],
        [49.1920, -2.2460],
        [49.1750, -2.2590]
      ],
      stops: [
        {
          name: 'Rozel Bay',
          type: 'harbour',
          lat: 49.2350,
          lng: -2.0200,
          description: 'A tiny, impossibly pretty harbour tucked into Jersey\'s northeast corner. The Hungry Man kiosk serves legendary crab sandwiches — queue up with the locals. The steep lane down to the harbour is a taste of what\'s to come at Bouley Bay.',
          rating: 4
        },
        {
          name: 'Bouley Bay Hill Climb',
          type: 'road',
          lat: 49.2430,
          lng: -2.0620,
          description: 'Jersey\'s most famous road — a 1-in-4 gradient plunge down to the bay, used since 1928 for the annual motorcycle and car hill climb. The hairpin bends, tree-lined canopy, and absurd gradient make this an absolute must-ride. Go down, then ride back up with the throttle wide open. The annual hill climb event draws competitors from across the British Isles.',
          rating: 5
        },
        {
          name: 'Bonne Nuit Bay',
          type: 'beach',
          lat: 49.2440,
          lng: -2.1050,
          description: 'A sheltered north-coast bay with a small harbour and a pebble beach. The name means "good night" — legend says it was the last bay Jersey fishermen saw before heading out into the dark Atlantic. The café does decent tea and cake.',
          rating: 3
        },
        {
          name: 'Devil\'s Hole',
          type: 'viewpoint',
          lat: 49.2400,
          lng: -2.1300,
          description: 'A natural blowhole in the cliffs where the sea surges into a collapsed cave. The path down is steep but short. At high tide and swell the water erupts dramatically. A bronze devil statue marks the entrance — legend says a shipwrecked figurehead washed up here.',
          rating: 4
        },
        {
          name: 'Grève de Lecq',
          type: 'beach',
          lat: 49.2420,
          lng: -2.1760,
          description: 'One of Jersey\'s finest bays — a wide sandy beach backed by a wooded valley. The barracks above the bay are now a National Trust café. Good for a swim if the tide is right. The ride down through the valley is tree-lined and atmospheric.',
          rating: 4
        },
        {
          name: 'Plemont Point & Beach',
          type: 'beach',
          lat: 49.2520,
          lng: -2.1900,
          description: 'Jersey\'s most dramatic beach — only accessible at low tide through a cave or down steep clifftop steps. The point itself has wild cliff walks and was controversially saved from development by the National Trust for Jersey. Raw, beautiful, and genuinely remote-feeling.',
          rating: 5
        },
        {
          name: 'Grosnez Castle Ruins',
          type: 'castle',
          lat: 49.2540,
          lng: -2.2500,
          description: 'Ruined 14th-century castle on Jersey\'s northwest tip with views to all the other Channel Islands — Guernsey, Sark, Herm, and the distant Minquiers reef. Only a single arch and wall fragments survive, but the setting is spectacular.',
          rating: 3
        },
        {
          name: 'La Corbière Lighthouse',
          type: 'lighthouse',
          lat: 49.1750,
          lng: -2.2590,
          description: 'Jersey\'s most iconic landmark — a white lighthouse on a tidal reef connected to the mainland by a concrete causeway. The first concrete lighthouse in the British Isles (1874). At sunset the light silhouettes against the Atlantic and the whole scene turns golden. An essential stop and the perfect end to a riding day.',
          rating: 5
        },
        {
          name: 'La Corbière Wild Camp',
          type: 'camp',
          lat: 49.1770,
          lng: -2.2550,
          description: 'Grassy headland above La Corbière with flat spots overlooking the lighthouse. Exposed to Atlantic wind but unforgettable if the weather\'s calm. Alternatively, Beauvelande Camp Site is 15 minutes east.',
          rating: 3
        }
      ],
      roads: [
        {
          name: 'Bouley Bay Hill',
          rating: 5,
          description: 'The Channel Islands\' most famous motorcycle road. 1-in-4 gradient, hairpin bends, tree canopy. Annual hill climb since 1928. Ride it both ways.'
        },
        {
          name: 'North Coast Road (C103/C105)',
          rating: 4,
          description: 'Jersey\'s north coast road threads between the bays, dipping into valleys and climbing back to the clifftops. Narrow, twisting, and tree-lined with occasional sea views. The best continuous riding in the Channel Islands.'
        }
      ],
      route: [
        [49.1858, -2.1065], [49.2050, -2.0600], [49.2200, -2.0250],
        [49.2350, -2.0200], [49.2430, -2.0620], [49.2440, -2.1050],
        [49.2400, -2.1300], [49.2420, -2.1760], [49.2520, -2.1900],
        [49.2540, -2.2500], [49.2200, -2.2200], [49.1920, -2.2460],
        [49.1750, -2.2590]
      ],
      tips: 'Bouley Bay hill climb is steep — use engine braking going down and don\'t ride the front brake. La Corbière causeway is tidal — DO NOT walk out when the tide is coming in (sirens warn you). Arrive at Corbière by 7pm for golden hour.'
    },

    // =====================================================
    // DAY 5 — Jersey East & South Coast
    // =====================================================
    {
      day: 5,
      title: 'Jersey East & South Coast',
      distance: '~30 miles',
      duration: '~3-4 hrs riding',
      summary: 'The final loop takes in Jersey\'s east and south coasts — medieval Mont Orgueil Castle towering over Gorey harbour, the long arm of St Catherine\'s Breakwater, the ancient passage grave at La Hougue Bie, and the windswept gun emplacements at Noirmont Point. A satisfying finish to the island-hopping tour.',
      center: [49.2000, -2.0700],
      zoom: 12,
      region: 'jersey',
      waypoints: [
        [49.1858, -2.1065],
        [49.1920, -2.1000],
        [49.2100, -2.0600],
        [49.2050, -2.0150],
        [49.2220, -2.0020],
        [49.2350, -2.0200],
        [49.2100, -2.0500],
        [49.1900, -2.0800],
        [49.1750, -2.1000],
        [49.1670, -2.1600],
        [49.1858, -2.1065]
      ],
      stops: [
        {
          name: 'Mont Orgueil Castle',
          type: 'castle',
          lat: 49.2050,
          lng: -2.0150,
          description: 'A towering medieval fortress dominating Gorey harbour, built in the 13th century to defend against French invasion. Six centuries of history layered into the rock — medieval chambers, Tudor gun ports, and modern art installations. The view from the top across to Normandy on a clear day is breathtaking. One of the finest castles in the British Isles.',
          rating: 5
        },
        {
          name: 'Gorey Harbour',
          type: 'harbour',
          lat: 49.2000,
          lng: -2.0170,
          description: 'A picturesque working harbour in the shadow of Mont Orgueil. Seafood restaurants line the waterfront — the Jersey oysters and moules frites are excellent. Park up on the pier and soak in the castle views over lunch.',
          rating: 4
        },
        {
          name: 'St Catherine\'s Breakwater',
          type: 'landmark',
          lat: 49.2220,
          lng: -2.0020,
          description: 'A massive Victorian breakwater stretching half a mile into the sea. Built in the 1840s as part of a planned harbour of refuge that was never completed — one of the great British engineering follies. Walk to the end for views back to the coast and out to the Ecréhous reef. Excellent fishing from the wall.',
          rating: 4
        },
        {
          name: 'Archirondel Tower & Beach',
          type: 'beach',
          lat: 49.2170,
          lng: -2.0050,
          description: 'A distinctive red-and-white painted Martello tower on a rocky headland between Anne Port and St Catherine\'s. The beach below is a sheltered spot with clear water. Less crowded than the big bays — a local favourite.',
          rating: 3
        },
        {
          name: 'La Hougue Bie',
          type: 'historical',
          lat: 49.2100,
          lng: -2.0600,
          description: 'One of the ten oldest buildings in the world — a 6,000-year-old Neolithic passage grave buried beneath a medieval mound. Crawl through the low entrance passage to reach the inner chamber, lit by torchlight. On top sits a medieval chapel. A German bunker from WWII is built into the side. Three layers of history in one extraordinary site.',
          rating: 5
        },
        {
          name: 'Green Island Beach',
          type: 'beach',
          lat: 49.1780,
          lng: -2.0700,
          description: 'Jersey\'s most southerly beach — a small sandy cove with a tidal island offshore. Quieter than the big bays and popular with snorkellers. The Séymour Tower is visible offshore at low tide — one of the island\'s most remote structures.',
          rating: 3
        },
        {
          name: 'Noirmont Point',
          type: 'viewpoint',
          lat: 49.1670,
          lng: -2.1600,
          description: 'A windswept headland on Jersey\'s southwest coast, fortified by the Germans with a massive coastal battery and command bunker. The bunker (Battery Lothringen) is open to visitors and remarkably well preserved — you can explore the underground magazine rooms, range-finding equipment, and gun positions. The views across St Brelade\'s Bay and out to sea are superb.',
          rating: 5
        },
        {
          name: 'Noirmont Point WWII Command Bunker',
          type: 'historical',
          lat: 49.1680,
          lng: -2.1580,
          description: 'The German naval command bunker at Noirmont, restored and maintained by the Channel Islands Occupation Society. Original equipment, maps, and communications gear still in place. A fitting final stop on a tour that has traced the islands\' wartime history from Guernsey to Jersey.',
          rating: 4
        },
        {
          name: 'St Helier — End Point',
          type: 'harbour',
          lat: 49.1858,
          lng: -2.1065,
          description: 'Return to St Helier to complete the loop. Celebrate with a pint at the Lamplighter pub on Mulcaster Street — a proper Jersey local. If you\'re catching the ferry home, the terminal is a 5-minute ride from here.',
          rating: 4
        }
      ],
      roads: [
        {
          name: 'East Coast Road (A4/A6)',
          rating: 3,
          description: 'Flat coast road from Gorey south past the Royal Bay of Grouville. Open views to the Ecréhous reef and France beyond. Good flowing road with gentle curves.'
        },
        {
          name: 'Noirmont Lane',
          rating: 3,
          description: 'Narrow lane leading to the headland. Tree-lined, atmospheric, with a slight climb to the gun emplacements. A satisfying final ride to close the tour.'
        }
      ],
      route: [
        [49.1858, -2.1065], [49.1920, -2.1000], [49.2100, -2.0600],
        [49.2050, -2.0150], [49.2000, -2.0170], [49.2170, -2.0050],
        [49.2220, -2.0020], [49.2100, -2.0500], [49.1780, -2.0700],
        [49.1750, -2.1000], [49.1670, -2.1600], [49.1680, -2.1580],
        [49.1858, -2.1065]
      ],
      tips: 'Mont Orgueil opens at 10am — get there early to beat the tour groups. La Hougue Bie is a must-see but easy to miss — it\'s signed off the main road near Five Oaks. Noirmont bunker is only open certain days — check CIOS website. Allow time to return to St Helier for the ferry.'
    }
  ],

  bestRoads: [
    { name: 'Bouley Bay Hill Climb', day: 4, rating: 5, region: 'Jersey North' },
    { name: 'North Coast Road (C103/C105)', day: 4, rating: 4, region: 'Jersey North' },
    { name: 'Route du Braye — Guernsey North Coast', day: 1, rating: 3, region: 'Guernsey' },
    { name: 'Route de Pleinmont', day: 2, rating: 3, region: 'Guernsey South' },
    { name: 'West Coast Road', day: 2, rating: 3, region: 'Guernsey West' },
    { name: 'East Coast Road (A4/A6)', day: 5, rating: 3, region: 'Jersey East' }
  ]
};
