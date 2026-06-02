const NC500_COMPLETE = {
  slug: 'nc500-complete',
  name: 'NC500 Complete',
  tagline: 'Scotland\'s Ultimate Coastal Circuit — 516 Miles of Raw Highland Glory',
  duration: '6 days',
  distance: '~516 miles',
  startLocation: 'Inverness',
  endLocation: 'Inverness',
  difficulty: 'Moderate',
  bestTime: 'May to September',
  description: 'The North Coast 500 is Scotland\'s answer to Route 66 — a 516-mile loop around the wild northern Highlands that serves up single-track roads, ancient castles, jaw-dropping sea cliffs, and some of the emptiest tarmac in Europe. Starting and finishing in Inverness, the route punches west through the dramatic Torridon mountains, tackles the legendary Bealach na Bà pass, traces the shattered coastline of Assynt, rounds the top of mainland Britain at Dunnet Head, and sweeps back down the east coast through Viking country. Six days of riding that will rewire your brain and ruin every other road trip forever.',
  highlights: [
    'Bealach na Bà — the greatest motorcycle road in Britain, 2,053ft of Alpine-grade switchbacks',
    'Smoo Cave — a cathedral-sized sea cave with a waterfall inside it',
    'Dunnet Head — the true most northerly point of mainland Britain (not John O\'Groats)',
    'Kylesku Bridge — a sweeping arc of concrete over a sea loch, pure engineering beauty',
    'Stac Pollaidh and Suilven — otherworldly sandstone peaks rising from the moor',
    'Duncansby Stacks — towering sea stacks that make you feel tiny',
    'Old Man of Stoer — a 200ft sea stack standing defiant against the Atlantic',
    'Applecross Peninsula — the most remote community on mainland Britain',
    'Inverewe Gardens — tropical plants thriving at 57°N thanks to the Gulf Stream',
    'Dornoch Cathedral — 13th-century gem in a whisky-soaked Highland town'
  ],

  dayColors: [
    '#FF6B6B', // Day 1 - coral
    '#FFA502', // Day 2 - orange
    '#6BCB77', // Day 3 - green
    '#4D96FF', // Day 4 - blue
    '#9B59B6', // Day 5 - purple
    '#E17055'  // Day 6 - salmon
  ],

  markerColors: {
    camp: '#27ae60',
    viewpoint: '#e8713a',
    landmark: '#9b59b6',
    beach: '#e17055',
    wildlife: '#f39c12',
    castle: '#6c5ce7',
    distillery: '#d35400',
    road: '#e74c3c',
    bridge: '#2d98da',
    fuel: '#fdcb6e',
    pub: '#c0392b',
    waterfall: '#00cec9',
    cave: '#636e72'
  },

  days: [
    // =====================================================
    // DAY 1 — Inverness to Applecross
    // =====================================================
    {
      day: 1,
      title: 'Inverness to Applecross',
      distance: '~112 miles',
      duration: '~4-5 hrs riding',
      summary: 'Leave the Highland capital behind and head west into increasingly wild terrain. The A835 to Contin eases you in, then the A832 takes you through Achnasheen and into the shadow of the Torridon mountains. The day climaxes with the Bealach na Bà — Britain\'s most spectacular mountain pass — before dropping into the impossibly remote Applecross peninsula.',
      center: [57.55, -5.30],
      zoom: 9,
      region: 'scotland-highlands',

      waypoints: [
        [57.4778, -4.2247],  // Inverness
        [57.4930, -4.3100],  // A835 heading west
        [57.5120, -4.4600],  // Marybank
        [57.5590, -4.6280],  // Contin
        [57.5810, -4.8200],  // Gorstan
        [57.5750, -5.0700],  // Garve
        [57.5580, -5.2400],  // Loch Luichart
        [57.5130, -5.3400],  // Achnasheen
        [57.5210, -5.4400],  // Glen Carron
        [57.5300, -5.5100],  // A896 junction
        [57.4800, -5.5500],  // Tornapress
        [57.4310, -5.6400],  // Bealach na Bà ascent
        [57.4180, -5.6870],  // Bealach na Bà summit
        [57.4340, -5.7500],  // Descent to Applecross
        [57.4340, -5.8120]   // Applecross
      ],

      stops: [
        {
          name: 'Inverness Castle Viewpoint',
          type: 'landmark',
          lat: 57.4778,
          lng: -4.2247,
          description: 'The start line. Inverness Castle sits on a bluff above the River Ness — pause here for your "before" photo. The castle forecourt gives panoramic views up the Great Glen. Fill your tank at the Tesco on the A82 before heading out — fuel gets sparse fast.',
          rating: 3
        },
        {
          name: 'Rogie Falls',
          type: 'waterfall',
          lat: 57.5710,
          lng: -4.6750,
          description: 'A short detour off the A835 near Contin. Walk 15 minutes through Caledonian pine forest to a suspension bridge over a thundering waterfall. In autumn, Atlantic salmon leap up the falls — one of nature\'s great spectacles. Even in summer, the mossy gorge feels primeval.',
          rating: 4
        },
        {
          name: 'Achnasheen Fuel Stop',
          type: 'fuel',
          lat: 57.5130,
          lng: -5.3420,
          description: 'Last reliable fuel before Applecross. This tiny settlement at the crossroads of the A832 and A890 is your lifeline — fill up here regardless of your gauge. The next pump is Lochcarron or Applecross, and neither is guaranteed.',
          rating: 3
        },
        {
          name: 'Bealach na Bà',
          type: 'road',
          lat: 57.4180,
          lng: -5.6870,
          description: 'The greatest motorcycle road in Britain, full stop. A single-track road that climbs 2,053ft in just 6 miles via a series of savage Alpine-grade switchbacks carved into the mountainside. The gradient hits 1-in-5 in places, and the hairpins are tight enough to scrape pegs on a sportbike. At the summit, you\'re above the clouds with views to Skye, the Outer Hebrides, and what feels like the edge of the world. Do NOT attempt in fog, ice, or high winds. Caravans are strongly advised not to use this road — bikes have it made.',
          rating: 5
        },
        {
          name: 'Bealach na Bà Summit Viewpoint',
          type: 'viewpoint',
          lat: 57.4200,
          lng: -5.6920,
          description: 'Pull into the car park at the top and let your hands stop shaking. The panorama from 2,053ft takes in the Isle of Skye, Raasay, the Cuillin ridge, and on a clear day, the Outer Hebrides. There\'s a stone cairn and a viewing platform. You\'ll want 20 minutes here minimum — partly for photos, partly because your brain needs to process what your throttle hand just did.',
          rating: 5
        },
        {
          name: 'Applecross Bay',
          type: 'beach',
          lat: 57.4340,
          lng: -5.8120,
          description: 'After the Bealach, Applecross feels like arriving in paradise. A perfect crescent of white sand looking across the Inner Sound to Raasay and Skye. The water is Caribbean-clear (and Arctic-cold). The most remote community on the British mainland, connected by one terrifying pass and one precarious coast road. It doesn\'t get more "away from it all" than this.',
          rating: 5
        },
        {
          name: 'Applecross Inn',
          type: 'pub',
          lat: 57.4335,
          lng: -5.8135,
          description: 'Legendary pub right on the shore. Famous for hand-dived Applecross Bay prawns, local venison, and some of the best pub food in the Highlands. Bikers congregate on the stone terrace watching the sun set over Skye. If you only eat one pub meal on the NC500, make it this one.',
          rating: 5
        },
        {
          name: 'Applecross Campsite',
          type: 'camp',
          lat: 57.4300,
          lng: -5.8050,
          description: 'Flower-filled campsite a stone\'s throw from the beach. Basic but beautiful — loos, showers, and a view to Skye that no five-star hotel can match. Book ahead in summer or arrive early. Fall asleep to the sound of waves and wake up to one of the finest views in Scotland.',
          rating: 4
        }
      ],

      roads: [
        {
          name: 'A835 Inverness to Contin',
          rating: 3,
          description: 'Fast, flowing A-road through farmland and forest. Good dual carriageway stretches for warming up. Nothing too dramatic but pleasant Highland scenery.'
        },
        {
          name: 'A832 Contin to Achnasheen',
          rating: 3,
          description: 'Gradually narrows as you head into wilder country. Loch Luichart appears on your left, mountains close in. The road surface is generally good but watch for logging trucks.'
        },
        {
          name: 'Bealach na Bà',
          rating: 5,
          description: 'Britain\'s greatest biking road. 2,053ft of Alpine switchbacks, brutal gradients, and views that will make you pull over involuntarily. Single-track with passing places. The descent into Applecross is almost as dramatic as the climb.'
        }
      ],

      tips: 'Fill up in Inverness or Contin — fuel is scarce beyond Achnasheen. The Bealach na Bà is NOT suitable in bad weather, high winds, or low visibility. If conditions are grim, take the coastal road via Lochcarron and Shieldaig instead. Midges are brutal in Applecross from June-Sept — bring Smidge repellent and a head net.'
    },

    // =====================================================
    // DAY 2 — Applecross to Lochinver
    // =====================================================
    {
      day: 2,
      title: 'Applecross to Lochinver',
      distance: '~120 miles',
      duration: '~5-6 hrs riding',
      summary: 'The wildest day on the NC500. Head north along the single-track Applecross coast road, then through Torridon\'s mountain fortress to Gairloch and Poolewe. The landscape shifts from Torridon sandstone giants to the shattered gneiss moonscape of Assynt. By Lochinver, you\'re in one of Europe\'s last true wildernesses.',
      center: [57.85, -5.40],
      zoom: 9,
      region: 'scotland-highlands',

      waypoints: [
        [57.4340, -5.8120],  // Applecross
        [57.4700, -5.7800],  // Coast road north
        [57.5100, -5.7000],  // Cuaig
        [57.5300, -5.6400],  // Kenmore
        [57.5450, -5.5100],  // Shieldaig
        [57.5560, -5.4950],  // Torridon village
        [57.5610, -5.3600],  // Glen Torridon
        [57.5400, -5.3100],  // Kinlochewe
        [57.6300, -5.4300],  // Loch Maree
        [57.7210, -5.6920],  // Gairloch
        [57.7700, -5.6000],  // Loch Ewe
        [57.7730, -5.5990],  // Poolewe
        [57.8500, -5.4700],  // Gruinard Bay
        [57.9100, -5.3500],  // Dundonnell
        [57.9500, -5.2500],  // Braemore Junction
        [58.0000, -5.2200],  // Ullapool approach
        [57.8950, -5.1600],  // Ullapool
        [58.0400, -5.1400],  // A835 north
        [58.0900, -5.0800],  // Knockan Crag
        [58.1200, -5.1600],  // Inverpolly
        [58.1497, -5.2484]   // Lochinver
      ],

      stops: [
        {
          name: 'Applecross Coast Road',
          type: 'road',
          lat: 57.4800,
          lng: -5.7600,
          description: 'The alternative to the Bealach na Bà, but a spectacular ride in its own right. This single-track road clings to the coast with vertiginous drops to the sea, blind crests, and passing places every 50 yards. Views across to Skye are staggering. Not for the faint-hearted — but you\'ve already done the Bealach, so you\'re ready.',
          rating: 4
        },
        {
          name: 'Shieldaig Village',
          type: 'landmark',
          lat: 57.5170,
          lng: -5.6440,
          description: 'A whitewashed fishing village perched on the shore of Loch Torridon. Shieldaig Island sits in the middle of the loch, covered in ancient Scots pine — one of the last remnants of the Caledonian Forest. The village store does excellent coffee and bacon rolls.',
          rating: 3
        },
        {
          name: 'Torridon Mountains Viewpoint',
          type: 'viewpoint',
          lat: 57.5560,
          lng: -5.4950,
          description: 'Pull over anywhere along the A896 through Glen Torridon and weep. Liathach (1,055m) rears up on your right — a fortress of 750-million-year-old Torridonian sandstone with quartzite pinnacles. Beinn Eighe (1,010m) guards the other side. These are some of the oldest mountains on Earth, and they look like they were dropped here from another planet.',
          rating: 5
        },
        {
          name: 'Beinn Eighe Visitor Centre',
          type: 'wildlife',
          lat: 57.5580,
          lng: -5.3500,
          description: 'Britain\'s first National Nature Reserve. The ancient Caledonian pine forest here harbours pine martens, red deer, golden eagles, and Scottish wildcats. Short woodland trails start from the car park. Even a 30-minute walk puts you among 400-year-old Scots pines draped in lichen.',
          rating: 4
        },
        {
          name: 'Loch Maree',
          type: 'viewpoint',
          lat: 57.6300,
          lng: -5.4300,
          description: 'Widely considered the most beautiful loch in Scotland (and that\'s a competitive field). Studded with pine-capped islands, flanked by Slioch (981m), and mirror-still on calm mornings. The A832 runs right along its southern shore — 10 miles of lakeside perfection.',
          rating: 5
        },
        {
          name: 'Gairloch Beach',
          type: 'beach',
          lat: 57.7280,
          lng: -5.6960,
          description: 'Sandy beach with views to the Outer Hebrides. Keep your eyes on the water — this is prime dolphin, porpoise, and minke whale territory. The beach car park has portaloos and a snack van in summer. Great place to stretch your legs after Torridon.',
          rating: 4
        },
        {
          name: 'Inverewe Gardens',
          type: 'landmark',
          lat: 57.7730,
          lng: -5.5990,
          description: 'A botanical miracle at 57°N latitude. Thanks to the Gulf Stream, this sheltered peninsula grows Himalayan rhododendrons, Tasmanian eucalyptus, Chinese magnolias, and South African proteas. Created from bare rock and peat by Osgood Mackenzie from 1862. The most unlikely garden in the world — and it\'s glorious.',
          rating: 4
        },
        {
          name: 'Gruinard Bay',
          type: 'beach',
          lat: 57.8500,
          lng: -5.4700,
          description: 'Sweeping bay of pink sand and turquoise water framed by mountains. Gruinard Island — the infamous "Anthrax Island" used for biological warfare tests in WWII — sits in the middle of the bay. It was finally decontaminated in 1990. The beaches on the mainland are stunning and usually deserted.',
          rating: 4
        },
        {
          name: 'Ullapool',
          type: 'fuel',
          lat: 57.8950,
          lng: -5.1630,
          description: 'The last proper town for a while. Fill up, grab cash, buy supplies. Ullapool is a pretty fishing village with whitewashed houses along the harbour. The Ceilidh Place is an excellent pit stop for food and coffee. There\'s a chippy on the harbour that\'s famous across the Highlands.',
          rating: 4
        },
        {
          name: 'Knockan Crag',
          type: 'viewpoint',
          lat: 58.0900,
          lng: -5.0800,
          description: 'The place where the science of geology was turned upside down. In 1907, geologists proved that older rock sits ON TOP of younger rock here — the Moine Thrust Zone. A short trail lets you literally put your hand on the junction between 500-million-year-old rock and 1-billion-year-old rock. Mind-bending stuff, and the views of Cul Mor and Stac Pollaidh are phenomenal.',
          rating: 4
        },
        {
          name: 'Stac Pollaidh Viewpoint',
          type: 'viewpoint',
          lat: 58.0520,
          lng: -5.1800,
          description: 'This sandstone pinnacle rises 612m from the Assynt moorland like a miniature Matterhorn. The silhouette is utterly distinctive — a serrated ridge of weathered towers that looks like a dragon\'s spine. You can see it for miles. The car park on the Achiltibuie road gives the iconic view.',
          rating: 5
        },
        {
          name: 'Lochinver Larder',
          type: 'pub',
          lat: 58.1497,
          lng: -5.2484,
          description: 'Famous throughout Scotland for their pies — venison, wild boar, steak and ale, and about a dozen other fillings, all in buttery shortcrust pastry. The "Lochinver Larder pie" is a rite of passage on the NC500. Eat in or take away. You will want two.',
          rating: 5
        },
        {
          name: 'Clachtoll Beach Campsite',
          type: 'camp',
          lat: 58.1870,
          lng: -5.3350,
          description: 'Wild camping on the edge of the Atlantic. The beach here is a split cove of white sand between rugged gneiss headlands — some of the oldest rock in Europe at 3 billion years old. Basic campsite with loos and showers. Fall asleep to the sound of the Atlantic pounding Lewisian gneiss.',
          rating: 5
        }
      ],

      roads: [
        {
          name: 'Applecross Coast Road',
          rating: 4,
          description: 'Single-track cliffside drama. Not as famous as the Bealach but equally intense. Tight, blind, vertiginous. Take it slow and enjoy the views.'
        },
        {
          name: 'A896 through Glen Torridon',
          rating: 4,
          description: 'Winding road through one of the most dramatic glens in Scotland. The mountains close in on both sides. Surface is good but watch for sheep and slow motorhomes.'
        },
        {
          name: 'A832 Kinlochewe to Gairloch',
          rating: 3,
          description: 'Loch Maree on one side, Slioch on the other. 10 miles of lakeside bliss with gentle curves. Occasionally slippery near Slattadale.'
        }
      ],

      tips: 'This is a long day with lots of single-track — don\'t rush it. Fill up in Gairloch or Ullapool. The coast road from Applecross is slow going (25-30mph average) but mesmerising. If you\'re camping at Clachtoll, arrive by 5pm in summer to bag a pitch with a sea view.'
    },

    // =====================================================
    // DAY 3 — Lochinver to Durness
    // =====================================================
    {
      day: 3,
      title: 'Lochinver to Durness',
      distance: '~75 miles',
      duration: '~3-4 hrs riding',
      summary: 'A shorter day through the most remote landscape in Britain. The road north from Lochinver winds through the shattered gneiss wilderness of Assynt, crosses the spectacular Kylesku Bridge, and follows the rugged coast through Scourie and Kinlochbervie before reaching Durness — Britain\'s most north-westerly village. Smoo Cave alone is worth the ride.',
      center: [58.30, -5.00],
      zoom: 9,
      region: 'scotland-highlands',

      waypoints: [
        [58.1497, -5.2484],  // Lochinver
        [58.1870, -5.3350],  // Clachtoll
        [58.2100, -5.3000],  // Stoer road
        [58.2370, -5.2500],  // Drumbeg
        [58.2530, -5.2200],  // Nedd
        [58.2650, -5.0720],  // Kylesku Bridge
        [58.2900, -5.0400],  // A894 north
        [58.3100, -5.0800],  // Scourie
        [58.3500, -5.0500],  // Laxford Bridge
        [58.3700, -5.0700],  // Rhiconich
        [58.3900, -4.9500],  // A838 coast
        [58.4017, -4.7458],  // Durness
        [58.4100, -4.7200]   // Smoo Cave
      ],

      stops: [
        {
          name: 'Old Man of Stoer',
          type: 'viewpoint',
          lat: 58.2370,
          lng: -5.3970,
          description: 'A 200ft sea stack standing proud against the Atlantic fury. It\'s a 4-mile walk from the Stoer lighthouse car park along the cliff tops, but even the lighthouse viewpoint gives you a taste of this coast\'s savage beauty. First climbed in 1966 — people abseil down one side and climb up the other. From a bike, the road to the lighthouse is a wild single-track detour.',
          rating: 5
        },
        {
          name: 'Drumbeg Road',
          type: 'road',
          lat: 58.2370,
          lng: -5.2500,
          description: 'The B869 from Lochinver to Kylesku via Drumbeg is one of the most challenging single-track roads in the Highlands. Tight bends, blind summits, cattle grids, and an almost total absence of other traffic. The scenery is Mars-like — bare Lewisian gneiss humps and lochans stretching to the horizon. Your speedo will rarely top 30mph and you won\'t care.',
          rating: 5
        },
        {
          name: 'Kylesku Bridge',
          type: 'bridge',
          lat: 58.2650,
          lng: -5.0720,
          description: 'An elegantly curved concrete bridge arcing over Loch a\' Chàirn Bhàin. Opened in 1984, replacing the last car ferry in mainland Scotland. The design is gorgeous — a sweeping 902ft arc that seems to hover over the water. Stop in the car park on the north side for the best angle. The old slipways of the ferry crossing are still visible below.',
          rating: 5
        },
        {
          name: 'Eas a\' Chual Aluinn',
          type: 'waterfall',
          lat: 58.2800,
          lng: -5.0300,
          description: 'Britain\'s highest waterfall at 658ft — three times the height of Niagara. You can\'t see it from the road, but boat trips run from Kylesku pier. The waterfall plunges off a cliff into a hidden fjord-like loch. Even without the boat trip, the landscape around Kylesku is utterly wild and humbling.',
          rating: 4
        },
        {
          name: 'Scourie Bay',
          type: 'beach',
          lat: 58.3530,
          lng: -5.1580,
          description: 'Sheltered sandy bay with crystal-clear water. Handa Island lies offshore — a seabird mega-colony with 200,000 puffins, guillemots, and razorbills. Boat trips depart from nearby Tarbet in season. Even from Scourie beach, you can sometimes see gannets diving offshore like white missiles.',
          rating: 4
        },
        {
          name: 'Kinlochbervie',
          type: 'landmark',
          lat: 58.3580,
          lng: -5.0510,
          description: 'Once the busiest fishing port in north-west Scotland, now a quieter place with a working harbour. Fresh langoustines are landed here daily and shipped straight to the restaurants of Spain. If you can buy some at the quayside, do — they\'re the finest shellfish in Europe.',
          rating: 3
        },
        {
          name: 'Sandwood Bay',
          type: 'beach',
          lat: 58.3770,
          lng: -5.1800,
          description: 'Often called Britain\'s most beautiful beach, but there\'s a catch: it\'s a 4.5-mile walk from the nearest road. If you have the time and the legs, it\'s a mile of pink sand, a 200ft sea stack (Am Buachaille), and not another soul in sight. Even the walk in, through moorland and past lochans, is magnificent. Not a quick bike stop, but a reason to extend Day 3.',
          rating: 5
        },
        {
          name: 'Loch Eriboll',
          type: 'viewpoint',
          lat: 58.4400,
          lng: -4.7200,
          description: 'A vast, fjord-like sea loch that the road traces around for a mesmerising 12 miles. Used as a naval base in WWII — U-boats surrendered here in 1945. The water is impossibly blue, and the surrounding mountains reflected in the loch on still days create a mirror-world effect. Nicknamed "Loch \'Orrible" by WWII sailors stationed here in winter.',
          rating: 4
        },
        {
          name: 'Smoo Cave',
          type: 'cave',
          lat: 58.4100,
          lng: -4.7200,
          description: 'A vast sea cave with a freshwater waterfall thundering down inside it — where an ocean cave meets a sinkhole. The main chamber is 200ft long and 130ft wide, with a 50ft ceiling. You can walk into the outer chamber for free, or take a boat tour into the inner chambers where the waterfall crashes into a plunge pool. Viking legends say this was an entrance to the underworld. They might have been right.',
          rating: 5
        },
        {
          name: 'Durness Village',
          type: 'landmark',
          lat: 58.4017,
          lng: -4.7458,
          description: 'Britain\'s most north-westerly mainland village. John Lennon spent childhood summers here — there\'s a memorial garden. The craft village in the former radar station is worth a wander. Sango Sands beach below the village is a hidden gem of golden sand between limestone cliffs.',
          rating: 4
        },
        {
          name: 'Sango Sands Oasis Campsite',
          type: 'camp',
          lat: 58.4020,
          lng: -4.7400,
          description: 'Campsite perched on the cliff above Sango Sands beach. Possibly the most spectacular campsite location in Britain — your tent is pitched on a grassy clifftop with the Atlantic raging below and views to Cape Wrath. Hot showers, small shop, and a genuine sense of being at the edge of the world.',
          rating: 5
        }
      ],

      roads: [
        {
          name: 'B869 Drumbeg Road',
          rating: 5,
          description: 'Legendary single-track through the Assynt moonscape. Technically demanding with blind crests and tight bends, but incredibly rewarding. You\'ll average 25mph and love every second.'
        },
        {
          name: 'A894 Kylesku to Scourie',
          rating: 3,
          description: 'Wider road with flowing bends through moorland. Good surface, light traffic. The Kylesku Bridge is the highlight.'
        },
        {
          name: 'A838 to Durness',
          rating: 3,
          description: 'Remote coast road with long straights and sweeping bends. Loch Eriboll section is particularly beautiful but can be windy.'
        }
      ],

      tips: 'Short mileage today but plenty to see — don\'t rush. The Drumbeg road (B869) is the scenic option; the A837/A894 via Skiag Bridge is faster but less interesting. Fuel up in Lochinver — next reliable fuel is Durness. Midges at Sango Sands can be biblical in calm, warm evenings — head nets essential.'
    },

    // =====================================================
    // DAY 4 — Durness to Thurso
    // =====================================================
    {
      day: 4,
      title: 'Durness to Thurso',
      distance: '~80 miles',
      duration: '~3-4 hrs riding',
      summary: 'The north coast — raw, exposed, and exhilarating. Ride east from Durness through Tongue and Bettyhill, past Viking burial grounds and WWII relics, to the nuclear weirdness of Dounreay. Then make the pilgrimage to Dunnet Head — the true most northerly point of the British mainland. Finish in the honest surfing town of Thurso.',
      center: [58.55, -4.10],
      zoom: 9,
      region: 'scotland-highlands',

      waypoints: [
        [58.4017, -4.7458],  // Durness
        [58.4300, -4.6500],  // A838 east
        [58.4500, -4.5500],  // Hope
        [58.4800, -4.4200],  // Tongue approach
        [58.4750, -4.4270],  // Tongue
        [58.5200, -4.2200],  // Borgie
        [58.5630, -4.0830],  // Bettyhill
        [58.5700, -3.9100],  // Melvich
        [58.5830, -3.7420],  // Reay
        [58.5770, -3.7460],  // Dounreay
        [58.6170, -3.3750],  // Dunnet Head
        [58.5938, -3.5215]   // Thurso
      ],

      stops: [
        {
          name: 'Kyle of Tongue',
          type: 'viewpoint',
          lat: 58.4800,
          lng: -4.4200,
          description: 'A causeway crosses this tidal inlet with Ben Hope (the most northerly Munro at 927m) towering to the south and the ruins of Castle Varrich on the headland. The old road went all the way around the kyle — the causeway shortcut saves 10 miles but misses some beautiful coastline. At low tide, the exposed sand flats are surreal.',
          rating: 4
        },
        {
          name: 'Castle Varrich',
          type: 'castle',
          lat: 58.4770,
          lng: -4.4260,
          description: 'A ruined Norse castle on a crag above the village of Tongue. The 15-minute walk to the top rewards you with panoramic views of the Kyle of Tongue, Ben Hope, Ben Loyal, and the open Atlantic. Built by the MacKays in the 14th century on an older Viking site. Atmospheric and almost always deserted.',
          rating: 4
        },
        {
          name: 'Bettyhill & Strathnaver Museum',
          type: 'landmark',
          lat: 58.5630,
          lng: -4.0830,
          description: 'Small village with a big story. The Strathnaver Museum tells the harrowing tale of the Highland Clearances — thousands of families burned out of their homes to make way for sheep in the 1800s. The museum is housed in the old church where many evicted families sheltered. Moving and important. The beach at Farr Bay below is stunning.',
          rating: 4
        },
        {
          name: 'Farr Bay Beach',
          type: 'beach',
          lat: 58.5600,
          lng: -4.0450,
          description: 'A gorgeous sweep of golden sand at the mouth of the River Naver. Surfers use it when the north swell hits. The river is famous for Atlantic salmon — watch for leaping fish from the bridge. Usually deserted even in high summer.',
          rating: 4
        },
        {
          name: 'Dounreay Nuclear Site',
          type: 'landmark',
          lat: 58.5770,
          lng: -3.7460,
          description: 'The iconic (now decommissioned) fast breeder reactor dome sits eerily on the clifftop. You can\'t visit, but the sphere is visible from the A836. Britain\'s nuclear frontier from the 1950s-90s, now being slowly dismantled. There\'s a surreal contrast between cutting-edge nuclear tech and the ancient, empty landscape around it.',
          rating: 3
        },
        {
          name: 'Dunnet Head',
          type: 'viewpoint',
          lat: 58.6720,
          lng: -3.3770,
          description: 'The TRUE most northerly point of mainland Britain (John O\'Groats is a pretender — it\'s 2 miles further south). A single-track road leads to a Stevenson lighthouse on 300ft sea cliffs. On a clear day, you can see Orkney, Hoy\'s Old Man, and the Pentland Firth boiling below. Puffins nest in the cliffs in summer. This is the real deal — wind, sea spray, and the absolute top of Britain.',
          rating: 5
        },
        {
          name: 'Dunnet Bay',
          type: 'beach',
          lat: 58.6200,
          lng: -3.3870,
          description: 'A two-mile arc of perfect sand on the approach to Dunnet Head. Surf breaks here rival anything in Cornwall. The Seadrift visitor centre has a small café. One of the finest beaches on the north coast, and somehow still uncrowded.',
          rating: 4
        },
        {
          name: 'Holborn Head',
          type: 'viewpoint',
          lat: 58.6050,
          lng: -3.5480,
          description: 'Wild sea cliffs just west of Thurso with blowholes that erupt in heavy seas. A short walk from the car park gives you views of the Pentland Firth, Orkney, and Dunnet Head. Less visited than Dunnet but equally dramatic.',
          rating: 3
        },
        {
          name: 'Thurso — Pentland Hotel',
          type: 'pub',
          lat: 58.5938,
          lng: -3.5210,
          description: 'Thurso is an honest working town with good pubs and accommodation. The Pentland Hotel is a solid base. Y-Not bar does decent food. Thurso East is a world-class reef break — check out the surfers from the harbour. Fill up here: good fuel stations, Co-op, and cash machines.',
          rating: 3
        },
        {
          name: 'Thurso Campsite',
          type: 'camp',
          lat: 58.5870,
          lng: -3.5000,
          description: 'Dunnet Bay Caravan Club site offers well-maintained pitches with hot showers, right beside Dunnet Bay beach. Wake up to views of Dunnet Head and walk to the surf in 2 minutes. One of the best-located campsites on the route.',
          rating: 4
        }
      ],

      roads: [
        {
          name: 'A838 Durness to Tongue',
          rating: 3,
          description: 'Remote single-carriageway through empty moorland. Can be very exposed in high winds. The Kyle of Tongue causeway is a highlight.'
        },
        {
          name: 'A836 Tongue to Thurso',
          rating: 3,
          description: 'Straight, fast, and occasionally boring stretches broken by stunning coastal views. The road surface improves as you approach Thurso. Watch for sheep — they own this road.'
        }
      ],

      tips: 'This is an exposed coast — wind can be fierce and cold even in summer. Layer up. Fuel at Tongue or Bettyhill if needed. The Dunnet Head detour adds 15 miles but is absolutely non-negotiable — it\'s the real top of Britain. Don\'t skip it for John O\'Groats (that\'s tomorrow).'
    },

    // =====================================================
    // DAY 5 — Thurso to Golspie
    // =====================================================
    {
      day: 5,
      title: 'Thurso to Golspie',
      distance: '~115 miles',
      duration: '~4-5 hrs riding',
      summary: 'Round the top corner of Britain at John O\'Groats, marvel at the Duncansby sea stacks, then begin the long sweep south down the east coast. Through Viking-influenced Caithness, past the harbours of Wick and Lybster, along the dramatic Ord of Caithness, through the Gold Rush town of Helmsdale to Golspie in Sutherland. The east coast is gentler than the west — but don\'t mistake gentle for dull.',
      center: [58.25, -3.40],
      zoom: 9,
      region: 'scotland-highlands',

      waypoints: [
        [58.5938, -3.5215],  // Thurso
        [58.5900, -3.3000],  // Castletown
        [58.6000, -3.1000],  // Gills Bay
        [58.6440, -3.0690],  // John O'Groats
        [58.6440, -3.0250],  // Duncansby Head
        [58.5800, -3.0300],  // Freswick
        [58.4400, -3.0900],  // Wick
        [58.3500, -3.2400],  // Lybster
        [58.2700, -3.3000],  // Dunbeath
        [58.1780, -3.5200],  // Berriedale Braes
        [58.1150, -3.6510],  // Helmsdale
        [58.0400, -3.7600],  // Brora
        [57.9730, -3.9780]   // Golspie
      ],

      stops: [
        {
          name: 'John O\'Groats',
          type: 'landmark',
          lat: 58.6440,
          lng: -3.0690,
          description: 'Yes, it\'s touristy. Yes, the famous signpost costs money to photograph with. But it\'s still a milestone — the north-eastern tip of mainland Britain. The harbour has been rebuilt and there\'s a decent café and craft shop. Get your photo and move on to the REAL attraction two miles east.',
          rating: 3
        },
        {
          name: 'Duncansby Head & Stacks',
          type: 'viewpoint',
          lat: 58.6440,
          lng: -3.0250,
          description: 'The actual north-eastern tip of mainland Britain, and infinitely more spectacular than John O\'Groats. A short walk from the lighthouse along the cliff tops reveals the Duncansby Stacks — three towering sandstone pinnacles rising from the boiling sea. The Great Stack is 200ft tall. Geos (narrow inlets) slice into the clifftops around you. Puffins, guillemots, and fulmars wheel overhead. This is the real thing — savage, beautiful, and humbling.',
          rating: 5
        },
        {
          name: 'Castle of Mey',
          type: 'castle',
          lat: 58.6100,
          lng: -3.2200,
          description: 'The Queen Mother\'s beloved Scottish retreat. She bought and restored this 16th-century castle in 1952 and visited every August and October until her death in 2002. The gardens are immaculate, the rooms are intimate (not grand — she wanted it homely), and the views to Orkney are magnificent. A touching, personal place.',
          rating: 4
        },
        {
          name: 'Wick Heritage Centre',
          type: 'landmark',
          lat: 58.4400,
          lng: -3.0900,
          description: 'Wick was once the herring capital of Europe — at peak, 1,000 boats worked from the harbour. The heritage centre tells this incredible story with photos, boats, and a reconstructed herring-curing yard. The old harbour is still atmospheric. Worth a fuel and coffee stop.',
          rating: 3
        },
        {
          name: 'Whaligoe Steps',
          type: 'landmark',
          lat: 58.3400,
          lng: -3.1500,
          description: '365 flagstone steps hand-cut into a 250ft sea cliff by fisherwomen in the 18th century — they carried herring up these steps in creels on their backs. The harbour at the bottom is a tiny miracle of engineering. The steps are steep, slippery, and seriously atmospheric. One of the most dramatic historical sites in Scotland.',
          rating: 5
        },
        {
          name: 'Lybster Harbour',
          type: 'landmark',
          lat: 58.3500,
          lng: -3.2900,
          description: 'Another former herring boomtown. The harbour was built to accommodate 200 boats. Now it\'s quiet, with just a few creelers working the coast. The Waterlines heritage centre is good. The drive through Lybster gives you a feel for the east coast\'s very different character — Norse-influenced, agricultural, weather-beaten.',
          rating: 3
        },
        {
          name: 'Berriedale Braes',
          type: 'road',
          lat: 58.1780,
          lng: -3.5200,
          description: 'The A9 plunges down to sea level and back up via a series of steep, tight hairpin bends as it crosses the Berriedale river. A notorious section — the descent is 1-in-5 gradient with a sharp turn at the bottom. An improvement scheme has widened it slightly, but it\'s still exciting on a bike. The views from the top are spectacular.',
          rating: 4
        },
        {
          name: 'Timespan Heritage Centre, Helmsdale',
          type: 'landmark',
          lat: 58.1150,
          lng: -3.6510,
          description: 'Award-winning museum in the fishing village of Helmsdale. Covers the Clearances, the 1868 Kildonan Gold Rush (yes, there was a Scottish gold rush), and local history. The attached café/restaurant — La Mirage — is an eccentric Highland–Italian gem run for decades by a local legend. One of the quirkiest lunch stops on the NC500.',
          rating: 4
        },
        {
          name: 'Brora Beach',
          type: 'beach',
          lat: 58.0100,
          lng: -3.8400,
          description: 'Long sandy beach with good surf and views north to the Caithness hills. Brora itself has a golf course, a small heritage centre, and Clynelish Distillery just outside town. A pleasant stop if the weather\'s kind.',
          rating: 3
        },
        {
          name: 'Clynelish Distillery',
          type: 'distillery',
          lat: 58.0230,
          lng: -3.8700,
          description: 'Produces a waxy, coastal single malt that\'s a favourite of whisky geeks worldwide. The visitor centre offers tours and tastings. Obviously, the rider doesn\'t drink — but your pillion might, and you can buy a bottle for tonight\'s campfire. The distillery sits above Brora with views to the Moray Firth.',
          rating: 4
        },
        {
          name: 'Dunrobin Castle',
          type: 'castle',
          lat: 57.9860,
          lng: -3.9460,
          description: 'A fairy-tale French château inexplicably perched on the Scottish coast. With 189 rooms, it\'s the largest house in the northern Highlands. The formal gardens — modelled on Versailles — tumble down to the sea. There are falconry displays on the lawn. The contrast between this opulence and the clearance villages it replaced is striking and uncomfortable. Magnificent and morally complex.',
          rating: 5
        },
        {
          name: 'Golspie — Big Burn Walk',
          type: 'viewpoint',
          lat: 57.9730,
          lng: -3.9780,
          description: 'Golspie is a quiet Sutherland town with good facilities. The Big Burn walk follows a wooded gorge with waterfalls right from the town centre. On the hilltop above stands the Duke of Sutherland statue — a 100ft monument to the man who ordered the Clearances. Locals have debated removing it for decades.',
          rating: 3
        },
        {
          name: 'Golspie Camping',
          type: 'camp',
          lat: 57.9700,
          lng: -3.9800,
          description: 'Golspie Caravan Park sits right by the shore with views to the Moray Firth. Tidy site with hot showers, hook-ups, and a drying room (you\'ll need it). Walking distance to the town centre for supplies and a pint.',
          rating: 3
        }
      ],

      roads: [
        {
          name: 'A99 Wick to Lybster',
          rating: 2,
          description: 'Straight, flat, and windswept through agricultural Caithness. Not exciting to ride but the coastal views are good. Watch for farm traffic.'
        },
        {
          name: 'A9 Berriedale Braes',
          rating: 4,
          description: 'Steep, tight hairpins dropping 500ft to a river crossing. The infamous descent tests your brakes and your nerve. Recently improved but still exciting.'
        },
        {
          name: 'A9 Helmsdale to Golspie',
          rating: 3,
          description: 'Fast, sweeping coastal road with good views. One of the better-surfaced stretches of the A9 in the north.'
        }
      ],

      tips: 'Get to Duncansby Head early before the tour buses — the walk to the stacks takes 20 minutes. Don\'t miss Whaligoe Steps (signposted from the A99 south of Wick). The Berriedale Braes descent requires care — use engine braking. Fill up in Wick or Helmsdale.'
    },

    // =====================================================
    // DAY 6 — Golspie to Inverness
    // =====================================================
    {
      day: 6,
      title: 'Golspie to Inverness',
      distance: '~80 miles',
      duration: '~3-4 hrs riding',
      summary: 'The final day loops you back to Inverness through the gentler eastern Highlands. Cross the Dornoch Firth to the cathedral town of Dornoch, through Tain\'s whisky heritage, over the Struie viewpoint for one last jaw-dropping panorama, then via Dingwall and the Black Isle back to where it all began. The NC500 ends where it started — but you\'re not the same rider who left.',
      center: [57.70, -4.20],
      zoom: 9,
      region: 'scotland-highlands',

      waypoints: [
        [57.9730, -3.9780],  // Golspie
        [57.8980, -4.0230],  // Dornoch Bridge
        [57.8800, -4.0280],  // Dornoch
        [57.8130, -4.0530],  // Tain
        [57.7600, -4.2400],  // Struie Hill
        [57.7200, -4.3000],  // Alness
        [57.6980, -4.3200],  // Evanton
        [57.6590, -4.4700],  // Dingwall
        [57.5800, -4.3500],  // Black Isle
        [57.5200, -4.2500],  // North Kessock
        [57.4778, -4.2247]   // Inverness
      ],

      stops: [
        {
          name: 'Dornoch Cathedral',
          type: 'landmark',
          lat: 57.8800,
          lng: -4.0280,
          description: 'A beautiful 13th-century cathedral in a tiny Highland town. The warm sandstone glows golden in the morning light. Dornoch is also famous for its links golf course (one of the world\'s finest), its excellent bookshop, and the fact that Madonna chose to christen her son here. Wander the pretty streets and grab breakfast at one of the cafés.',
          rating: 4
        },
        {
          name: 'Dornoch Beach',
          type: 'beach',
          lat: 57.8750,
          lng: -4.0100,
          description: 'Miles of clean, golden sand backed by dunes and the golf links. The water is warmer here on the east coast (relatively speaking — it\'s still Scotland). Seals haul out on the sandbanks in the firth. A perfect morning walk before the last riding day.',
          rating: 4
        },
        {
          name: 'Glenmorangie Distillery',
          type: 'distillery',
          lat: 57.8130,
          lng: -4.0530,
          description: 'Home of one of Scotland\'s most popular single malts. The tall copper stills (the tallest in Scotland) produce a light, elegant Highland whisky. Excellent visitor centre with tours, tastings, and a well-stocked shop. Riders: buy a bottle for tonight, let someone else taste today. The distillery sits right on the main road through Tain.',
          rating: 4
        },
        {
          name: 'Tain Through Time',
          type: 'landmark',
          lat: 57.8120,
          lng: -4.0500,
          description: 'Heritage centre in the ancient Royal Burgh of Tain. This was a place of pilgrimage for 1,000 years — the shrine of St Duthac drew kings and commoners alike. Robert the Bruce\'s wife and daughter were captured here. The town\'s history is layered and fascinating. Good coffee shop attached.',
          rating: 3
        },
        {
          name: 'Struie Viewpoint',
          type: 'viewpoint',
          lat: 57.7600,
          lng: -4.2400,
          description: 'The single best viewpoint on the NC500\'s final stretch. A layby on the B9176 (the Struie road) gives you a sweeping panorama of the Kyle of Sutherland, the Dornoch Firth, and the mountains rolling away to the west. On a clear day, you can see Ben Wyvis, the Fannichs, and all the way to the peaks you rode through on Day 1. A moment to reflect on what you\'ve just done.',
          rating: 5
        },
        {
          name: 'Dalmore Distillery',
          type: 'distillery',
          lat: 57.6890,
          lng: -4.2680,
          description: 'Makers of the famous stag-crested whisky, sitting right on the shore of the Cromarty Firth. The 12-year-old is a rich, sherried classic. The distillery building itself is Victorian industrial beauty. Tours available but booking is recommended.',
          rating: 4
        },
        {
          name: 'Black Isle Brewery',
          type: 'pub',
          lat: 57.5650,
          lng: -4.3100,
          description: 'Scotland\'s first organic brewery, producing excellent ales in the heart of the Black Isle. The taproom does tastings and tours. The Black Isle itself is not an island — it\'s a fertile peninsula between the Cromarty and Moray Firths. Rich farmland, red kites overhead, and a surprisingly mild microclimate.',
          rating: 3
        },
        {
          name: 'Chanonry Point',
          type: 'wildlife',
          lat: 57.5720,
          lng: -4.0960,
          description: 'THE best place in Britain to see wild bottlenose dolphins from shore. A spit of land jutting into the Moray Firth where dolphins come within metres of the beach to hunt salmon on the rising tide. Arrive 1-2 hours after low tide for the best chance. The Moray Firth dolphins are the most northerly resident bottlenose population in the world. Seeing them from 10 feet away is a genuine life highlight.',
          rating: 5
        },
        {
          name: 'Fortrose Cathedral',
          type: 'landmark',
          lat: 57.5800,
          lng: -4.1300,
          description: 'Atmospheric red sandstone ruins on the Black Isle. Founded in the 13th century, now a peaceful shell with fine carved stonework. The Brahan Seer — Scotland\'s answer to Nostradamus — was allegedly burned alive in a tar barrel here in the 17th century for his uncomfortably accurate prophecies.',
          rating: 3
        },
        {
          name: 'North Kessock — Moray Firth View',
          type: 'viewpoint',
          lat: 57.5200,
          lng: -4.2500,
          description: 'Just before you cross the Kessock Bridge back into Inverness, pull over at North Kessock for one last view. The Moray Firth stretches out before you, the Black Isle behind you, and the Kessock Bridge — your final crossing — arcs over the narrows. Dolphins are often visible from the bridge. The NC500 loop is almost complete.',
          rating: 3
        },
        {
          name: 'Inverness — Finish Line',
          type: 'landmark',
          lat: 57.4778,
          lng: -4.2247,
          description: 'You\'ve done it. 516 miles of the wildest, most beautiful roads in Britain. Park up at Inverness Castle, take the same photo you took on Day 1, and marvel at the difference. You left as a tourist. You return as someone who has genuinely seen the top of the world. Celebrate at the Castle Tavern on View Place — great real ales and a raised terrace with castle views.',
          rating: 5
        }
      ],

      roads: [
        {
          name: 'A9 Golspie to Dornoch Bridge',
          rating: 3,
          description: 'Fast, well-surfaced trunk road. Not thrilling but efficient. The Dornoch Firth bridge gives good views.'
        },
        {
          name: 'B9176 Struie Road',
          rating: 4,
          description: 'A fantastic alternative to the A9 between Ardgay and Alness. Sweeping bends through forestry with the Struie viewpoint at the top. Excellent road surface, almost no traffic. The best riding on Day 6.'
        },
        {
          name: 'A9 Dingwall to Inverness',
          rating: 2,
          description: 'Dual carriageway bringing you home. Efficient but not exciting. The Kessock Bridge crossing into Inverness is a fitting finale.'
        }
      ],

      tips: 'Take the B9176 Struie road instead of the A9 — it\'s a far better ride and the viewpoint is world-class. Allow time for Chanonry Point dolphins (tide-dependent — check times). The Black Isle is worth exploring if you have spare time. Fill up in Tain or Alness for the final push to Inverness.'
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NC500_COMPLETE };
}
