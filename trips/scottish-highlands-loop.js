const SCOTTISH_HIGHLANDS_LOOP = {
  slug: 'scottish-highlands-loop',
  name: 'Scottish Highlands Loop',
  tagline: 'Seven days through Scotland\'s wild heart — from Inverness to the edge of the world and back',
  duration: '7 days',
  distance: '~650 miles',
  startLocation: 'Inverness',
  endLocation: 'Inverness',
  difficulty: 'Moderate',
  bestTime: 'May to September',
  description: 'A circular motorcycle tour starting and ending in Inverness, covering the very best Highland roads. Ride the legendary Bealach na Ba, cross the Kylesku Bridge, stand at mainland Britain\'s most northerly point at Dunnet Head, and explore the wild beauty of Wester Ross, Sutherland, and Caithness. The route follows much of the NC500 plus hidden gems like Glen Affric and the Black Isle. Expect single-track roads, jaw-dropping coastal scenery, ancient castles, remote beaches, and virtually no traffic once you leave Inverness. This is Scotland at its most dramatic and untamed.',
  highlights: [
    'Bealach na Ba — Britain\'s highest road pass with Alpine-style hairpins',
    'Kylesku Bridge — iconic curved bridge over a sea loch',
    'Dunnet Head — the actual most northerly point of mainland Britain',
    'Smoo Cave — massive sea cave with an inner waterfall',
    'Corrieshalloch Gorge — 150ft waterfall viewed from a swaying suspension bridge',
    'Beinn Eighe — Britain\'s first National Nature Reserve',
    'Applecross Bay — white sand paradise on the remote west coast',
    'Duncansby Stacks — dramatic sea stacks near John O\'Groats',
    'Glen Affric — one of Scotland\'s most beautiful glens',
    'NC500 northern section — empty roads through vast Sutherland wilderness'
  ],

  dayColors: [
    '#FF6B6B', // Day 1 - coral
    '#FFA502', // Day 2 - orange
    '#6BCB77', // Day 3 - green
    '#4D96FF', // Day 4 - blue
    '#9B59B6', // Day 5 - purple
    '#E17055', // Day 6 - salmon
    '#00B894'  // Day 7 - mint
  ],

  markerColors: {
    landmark: '#9b59b6',
    viewpoint: '#e8713a',
    waterfall: '#00cec9',
    road: '#e74c3c',
    camp: '#27ae60',
    wildlife: '#f39c12',
    fuel: '#fdcb6e',
    beach: '#e17055',
    castle: '#6c5ce7',
    distillery: '#d35400',
    pub: '#c0392b',
    bridge: '#2d98da',
    cave: '#636e72'
  },

  days: [
    // =====================================================
    // DAY 1 — Inverness to Torridon
    // =====================================================
    {
      day: 1,
      title: 'Inverness to Torridon',
      distance: '~85 miles',
      duration: '~3-4 hrs riding',
      summary: 'Head northwest from Inverness on the A835 through Contin and Garve, detour to the spectacular Corrieshalloch Gorge, then take the A832 west through Achnasheen to Kinlochewe and the ancient mountains of Torridon. A day of increasing wildness as civilisation falls away behind you.',
      center: [57.60, -5.00],
      zoom: 9,
      region: 'highlands-west',
      mergeable: false,
      stops: [
        {
          name: 'Inverness Castle Viewpoint',
          lat: 57.4778, lng: -4.2247,
          type: 'landmark',
          rating: 3,
          description: 'Starting point of the loop. The castle viewpoint offers panoramic views over the River Ness and the city. Fill up fuel, check tyre pressures, and prepare yourself — civilisation ends soon.'
        },
        {
          name: 'Rogie Falls',
          lat: 57.5870, lng: -4.6600,
          type: 'waterfall',
          rating: 4,
          description: 'Spectacular woodland waterfall with a swaying suspension bridge across the gorge. In summer and autumn, Atlantic salmon leap up the falls — watching a 10lb fish hurl itself upstream is unforgettable. 10-minute walk from the car park on the A835.'
        },
        {
          name: 'Black Water River Viewpoint',
          lat: 57.6050, lng: -4.7200,
          type: 'viewpoint',
          rating: 3,
          description: 'Layby on the A835 near Garve with sweeping views across Loch Garve and the surrounding hills. Good photo opportunity and a chance to stretch your legs before the wilder roads ahead.'
        },
        {
          name: 'Corrieshalloch Gorge',
          lat: 57.7529, lng: -5.0350,
          type: 'waterfall',
          rating: 5,
          description: '150ft waterfall plunging into a deep box canyon, viewed from a Victorian suspension bridge that sways as you walk across. Vertigo sufferers beware — the drop is dizzying. A quick stop right off the A835. The spray creates its own microclimate of ferns and moss. One of Scotland\'s natural wonders.',
          url: 'https://www.nts.org.uk/visit/places/corrieshalloch-gorge'
        },
        {
          name: 'Loch a\' Chroisg Viewpoint',
          lat: 57.5900, lng: -5.1500,
          type: 'viewpoint',
          rating: 3,
          description: 'Beautiful lochside layby on the A832 west of Achnasheen. Mountains reflected in still water on a calm day. The landscape here starts getting properly wild — you\'re entering the Torridon giants\' territory.'
        },
        {
          name: 'Beinn Eighe National Nature Reserve',
          lat: 57.6310, lng: -5.3400,
          type: 'wildlife',
          rating: 5,
          description: 'Britain\'s first National Nature Reserve, established in 1951. Ancient Caledonian pine forest that\'s home to pine martens, wildcats, and golden eagles. The mountain trails reveal 750-million-year-old quartzite peaks that look snow-capped even in summer. The visitor centre at Aultroy has good displays. Keep food locked away if camping — pine martens are curious thieves.',
          url: 'https://www.nature.scot/enjoying-outdoors/scotlands-national-nature-reserves/beinn-eighe-and-loch-maree-islands'
        },
        {
          name: 'Loch Maree Viewpoint',
          lat: 57.6600, lng: -5.4000,
          type: 'viewpoint',
          rating: 5,
          description: 'One of Scotland\'s most beautiful lochs — a huge body of dark water studded with pine-covered islands, backed by the massive bulk of Slioch mountain. The A832 runs along its southern shore with several laybys for photos. On a still day the reflections are extraordinary. The loch is also home to rare Arctic char.'
        },
        {
          name: 'Kinlochewe Fuel Stop',
          lat: 57.6080, lng: -5.3050,
          type: 'fuel',
          rating: 2,
          description: 'Last reliable fuel before Torridon. The small garage at Kinlochewe is a lifeline — don\'t pass it on less than half a tank. Opening hours can be limited, so fill up whenever you can in the Highlands.'
        },
        {
          name: 'Torridon Village',
          lat: 57.5450, lng: -5.5100,
          type: 'landmark',
          rating: 4,
          description: 'Tiny village dwarfed by the massive Torridon mountains — Liathach, Beinn Alligin, and Beinn Eighe. The scale of the landscape here is humbling. The mountains are made of 750-million-year-old Torridonian sandstone topped with quartzite. The Torridon Inn does decent food and has a cosy bar.'
        },
        {
          name: 'Torridon Campsite',
          lat: 57.5440, lng: -5.5080,
          type: 'camp',
          rating: 4,
          description: 'Basic but beautifully situated campsite at the foot of Liathach — one of Scotland\'s most dramatic mountains. Wake up to a view that most people only see on postcards. Hot showers available. The midges can be brutal in summer — bring repellent and a head net.',
          park4night: 'https://park4night.com/en/search?lat=57.54&lng=-5.51'
        }
      ],
      roads: [
        {
          name: 'A835 Inverness to Braemore',
          rating: 3,
          description: 'Well-surfaced main road climbing steadily northwest through forested glens. Good warm-up ride with flowing bends. Traffic thins out rapidly once you pass Garve.'
        },
        {
          name: 'A832 Achnasheen to Kinlochewe',
          rating: 4,
          description: 'Beautiful Highland road winding through increasingly dramatic mountain scenery. Lochside riding with the Torridon giants growing ahead of you. Empty and atmospheric.'
        }
      ],
      route: [
        [57.4778, -4.2247], [57.4900, -4.3000], [57.5100, -4.4000],
        [57.5300, -4.5000], [57.5600, -4.5800], [57.5770, -4.6650],
        [57.5870, -4.6600], [57.6100, -4.6840], [57.6500, -4.7500],
        [57.7000, -4.8500], [57.7529, -5.0350], [57.7000, -4.8500],
        [57.6500, -4.7500], [57.6100, -4.8000], [57.5900, -5.0000],
        [57.5840, -5.1260], [57.5900, -5.1500], [57.6080, -5.3050],
        [57.6310, -5.3400], [57.6600, -5.4000], [57.6080, -5.3050],
        [57.5700, -5.4000], [57.5450, -5.5100]
      ],
      tips: 'Fill up in Inverness before leaving — fuel stations are scarce heading northwest. Corrieshalloch Gorge is a short detour north on the A835 before you turn west on the A832. Kinlochewe is your last fuel stop before Torridon. The Torridon mountains look best in morning light.'
    },

    // =====================================================
    // DAY 2 — Torridon to Gairloch/Poolewe
    // =====================================================
    {
      day: 2,
      title: 'Torridon to Gairloch',
      distance: '~90 miles',
      duration: '~4-5 hrs riding',
      summary: 'The big road day. Head south to tackle the legendary Bealach na Ba — Britain\'s highest road pass with Alpine hairpins climbing to 2,053ft. Explore the remote Applecross peninsula, then ride the stunning Wester Ross coast north through Shieldaig to the beautiful village of Gairloch. A day of world-class roads and jaw-dropping coastal scenery.',
      center: [57.55, -5.70],
      zoom: 9,
      region: 'wester-ross',
      mergeable: false,
      stops: [
        {
          name: 'Upper Loch Torridon Viewpoint',
          lat: 57.5500, lng: -5.5900,
          type: 'viewpoint',
          rating: 5,
          description: 'Jaw-dropping layby viewpoint overlooking the upper reaches of Loch Torridon with the massive Torridon mountains rising straight from the water. The scale of the landscape here is humbling — mountains over 3,000ft dropping to sea level. Best in early morning light.'
        },
        {
          name: 'Bealach na Ba (Pass of the Cattle)',
          lat: 57.4167, lng: -5.7250,
          type: 'road',
          rating: 5,
          description: 'THE hardest road in the UK. 2,053ft of Alpine-style hairpins with gradients hitting 20%. The steepest sections will have your clutch hand screaming. Views from the summit across to Skye and the Outer Hebrides are genuinely world-class. Not for the faint-hearted on a loaded bike — but absolutely unmissable. A warning sign at the bottom reads \'Road normally impassable in wintry conditions\' — in summer it\'s rideable but intense.'
        },
        {
          name: 'Bealach na Ba Summit Viewpoint',
          lat: 57.4200, lng: -5.7350,
          type: 'viewpoint',
          rating: 5,
          description: 'The summit car park at 2,053ft offers panoramic views across to the Isle of Skye, the Cuillin mountains, and the islands of Raasay and Rona. On a clear day the Outer Hebrides are visible on the horizon. The sense of achievement after climbing the hairpins makes the view even sweeter.'
        },
        {
          name: 'Applecross Bay',
          lat: 57.4340, lng: -5.8130,
          type: 'beach',
          rating: 4,
          description: 'Stunning remote bay on the west coast. White sand, crystal clear water, views to Skye and Raasay. After the intensity of the Bealach, arriving here feels like reaching paradise. One of the most beautiful beaches on mainland Scotland.'
        },
        {
          name: 'Applecross Inn',
          lat: 57.4338, lng: -5.8120,
          type: 'pub',
          rating: 5,
          description: 'Famous wee pub right on the shore at Applecross. Legendary locally-caught seafood — the prawns and scallops are unbelievable. Bikers are warmly welcome. Book a table if you can or eat at the bar. This might be the best pub meal of the entire trip.',
          url: 'https://www.applecross.uk.com/inn'
        },
        {
          name: 'Shieldaig Village',
          lat: 57.5170, lng: -5.6450,
          type: 'landmark',
          rating: 4,
          description: 'Tiny whitewashed village on the shore of Loch Torridon. Perfectly picturesque Highland scene — colourful houses reflected in the loch with Shieldaig Island covered in ancient Scots pine in the bay. The village shop sells good coffee.'
        },
        {
          name: 'Red Point Beach',
          lat: 57.7080, lng: -5.8210,
          type: 'beach',
          rating: 4,
          description: 'Remote white sand beach at the end of a single-track road south of Gairloch. Views across to Skye and the Trotternish Ridge. Often completely deserted — feels like the edge of the world. Worth the detour if you have time.'
        },
        {
          name: 'Gairloch Beach',
          lat: 57.7310, lng: -5.6930,
          type: 'beach',
          rating: 3,
          description: 'Long sandy beach on the shore of Gairloch with views across to the mountains of Wester Ross. Good for a sunset stroll after the day\'s riding. The village has a small shop and a couple of eating options.'
        },
        {
          name: 'Inverewe Garden',
          lat: 57.7780, lng: -5.5990,
          type: 'landmark',
          rating: 4,
          description: 'Extraordinary subtropical garden on the shores of Loch Ewe — palm trees, exotic plants, and Himalayan rhododendrons thriving at 57°N thanks to the warming Gulf Stream. Created from bare Highland rock in 1862. A surreal contrast to the surrounding wild landscape.',
          url: 'https://www.nts.org.uk/visit/places/inverewe-garden'
        },
        {
          name: 'Sands Caravan & Camping, Gairloch',
          lat: 57.7200, lng: -5.7700,
          type: 'camp',
          rating: 4,
          description: 'Beachside campsite at Big Sand near Gairloch with stunning views across to Skye. Fall asleep to the sound of waves. Hot showers, small shop on site. The sunsets here are legendary — the sky turns pink and gold over the islands.',
          park4night: 'https://park4night.com/en/search?lat=57.72&lng=-5.77'
        }
      ],
      roads: [
        {
          name: 'Bealach na Ba',
          rating: 5,
          description: 'Britain\'s highest road pass at 2,053ft. Alpine hairpins, 20% gradients, single track in places. Absolutely thrilling on a motorbike. The summit views are among the best in Scotland. This is THE road of the Highlands.'
        },
        {
          name: 'Applecross Coast Road to Shieldaig',
          rating: 4,
          description: 'Narrow, winding coastal road with sea views the entire way. Less dramatic than the Bealach but beautifully remote. Single-track with passing places — ride it for the views, not the speed.'
        },
        {
          name: 'A896 Shieldaig to Kinlochewe',
          rating: 4,
          description: 'Winding single-track road beneath the massive Torridon mountains with sea loch views. Dramatic, remote, and very Scottish.'
        }
      ],
      route: [
        [57.5450, -5.5100], [57.5500, -5.5900], [57.5170, -5.6450],
        [57.4800, -5.6200], [57.4500, -5.6500], [57.4200, -5.6800],
        [57.4167, -5.7250], [57.4200, -5.7350], [57.4340, -5.8130],
        [57.4600, -5.7700], [57.4900, -5.7000], [57.5170, -5.6450],
        [57.5500, -5.5500], [57.5700, -5.5000], [57.6080, -5.3050],
        [57.6300, -5.4500], [57.6600, -5.5500], [57.6900, -5.6200],
        [57.7080, -5.8210], [57.7200, -5.7700], [57.7310, -5.6930],
        [57.7600, -5.6200], [57.7780, -5.5990]
      ],
      tips: 'The Bealach na Ba has a warning sign at the bottom for good reason. Low gear, smooth clutch control, wide lines on the hairpins. Heavily loaded bikes will feel it. The coast road from Applecross north to Shieldaig adds about 25 miles but is beautiful. Fill up at Lochcarron before attempting the Bealach — there\'s no fuel at Applecross.'
    },

    // =====================================================
    // DAY 3 — Gairloch to Ullapool
    // =====================================================
    {
      day: 3,
      title: 'Gairloch to Ullapool',
      distance: '~55 miles',
      duration: '~2-3 hrs riding',
      summary: 'A shorter day to savour the stunning Wester Ross coastline. Ride north through Poolewe past the turquoise waters of Gruinard Bay, around Little Loch Broom, and past the mighty An Teallach mountain before arriving at the charming harbour town of Ullapool. Take in the Summer Isles viewpoints and enjoy a relaxed afternoon exploring the town.',
      center: [57.83, -5.40],
      zoom: 9,
      region: 'wester-ross',
      mergeable: true,
      stops: [
        {
          name: 'Loch Ewe WWII Memorial',
          lat: 57.7900, lng: -5.6200,
          type: 'landmark',
          rating: 3,
          description: 'During WWII, Loch Ewe was a major assembly point for Arctic convoys carrying supplies to Russia. The memorial honours the thousands of sailors who made the perilous journey. A quiet, moving spot overlooking the loch where the ships once gathered.'
        },
        {
          name: 'Gruinard Bay',
          lat: 57.8500, lng: -5.5500,
          type: 'beach',
          rating: 5,
          description: 'Stunning bay with turquoise water and white sand beaches backed by mountains. Looks more like the Caribbean than the Scottish Highlands. Gruinard Island offshore was used for anthrax testing in WWII — it\'s now been decontaminated. The beach is gorgeous and usually empty.'
        },
        {
          name: 'Gruinard Bay Viewpoint',
          lat: 57.8550, lng: -5.5300,
          type: 'viewpoint',
          rating: 4,
          description: 'Layby on the A832 with sweeping views over the bay. On a sunny day the water is an improbable shade of turquoise. The contrast with the dark heather moorland and the mountain backdrop is extraordinary. Classic Highland scene.'
        },
        {
          name: 'Little Loch Broom',
          lat: 57.8300, lng: -5.3000,
          type: 'viewpoint',
          rating: 4,
          description: 'Beautiful sea loch with the mountains of the Dundonnell Forest rising on the far side. The road winds along its southern shore with several laybys offering reflective views on calm days.'
        },
        {
          name: 'An Teallach Viewpoint',
          lat: 57.8100, lng: -5.2200,
          type: 'viewpoint',
          rating: 5,
          description: 'An Teallach (\'The Forge\') is one of Scotland\'s finest mountains — a dramatic ridge of Torridonian sandstone pinnacles rising to 3,484ft. The roadside view from the A832 near Dundonnell shows the mountain in all its jagged glory. You don\'t need to climb it to appreciate the magnificence — the view from the layby is enough.'
        },
        {
          name: 'Dundonnell',
          lat: 57.8430, lng: -5.2600,
          type: 'landmark',
          rating: 3,
          description: 'Small settlement at the head of Little Loch Broom, in the shadow of An Teallach. The Dundonnell Hotel does a good bar lunch. A peaceful spot with a strong sense of remoteness.'
        },
        {
          name: 'Summer Isles Viewpoint',
          lat: 57.9200, lng: -5.3500,
          type: 'viewpoint',
          rating: 4,
          description: 'Several laybys along the coast road offer views across to the Summer Isles — a scatter of small islands in the mouth of Loch Broom. On a clear day they shimmer in the afternoon light. Seals and sea eagles frequent the waters around them.'
        },
        {
          name: 'Ardmair Bay',
          lat: 57.9100, lng: -5.2200,
          type: 'beach',
          rating: 3,
          description: 'Sheltered pebbly bay a few miles north of Ullapool with views across to the Summer Isles. The caravan park here is a popular camping spot. The bay is good for sea kayaking if you fancy getting off the bike for a bit.'
        },
        {
          name: 'Ullapool Harbour',
          lat: 57.8960, lng: -5.1600,
          type: 'landmark',
          rating: 4,
          description: 'Charming wee fishing town and the gateway to the far north-west. Good fuel stop, excellent seafood restaurants, and a lively pub scene. The Ceilidh Place does great food and live music. The Arch Inn is another favourite. Stock up on supplies — shops get scarce further north.'
        },
        {
          name: 'Ullapool Fuel Station',
          lat: 57.8950, lng: -5.1580,
          type: 'fuel',
          rating: 3,
          description: 'Essential fuel stop. Fill to the brim here — the next reliable fuel heading north is Lochinver or Durness, and both are a long way away through empty country. Don\'t gamble with your tank in the Highlands.'
        },
        {
          name: 'Broomfield Holiday Park, Ullapool',
          lat: 57.9050, lng: -5.1700,
          type: 'camp',
          rating: 4,
          description: 'Well-equipped campsite on the shore of Loch Broom just north of Ullapool. Stunning views across the loch to the mountains. Hot showers, laundry, and a 10-minute walk into town for pubs and restaurants. A comfortable base after the day\'s riding.',
          park4night: 'https://park4night.com/en/search?lat=57.91&lng=-5.17'
        }
      ],
      roads: [
        {
          name: 'A832 Poolewe to Dundonnell',
          rating: 4,
          description: 'Coastal road winding through remote Wester Ross. Turquoise bays, mountain backdrops, and virtually no traffic. Single-track in places with passing places. Beautiful riding at any pace.'
        },
        {
          name: 'A835 Braemore to Ullapool',
          rating: 3,
          description: 'Well-surfaced road descending to Ullapool alongside Loch Broom. Good views of the Summer Isles and the town appearing below.'
        }
      ],
      route: [
        [57.7780, -5.5990], [57.7900, -5.6200], [57.8100, -5.5900],
        [57.8300, -5.5700], [57.8500, -5.5500], [57.8550, -5.5300],
        [57.8400, -5.4500], [57.8300, -5.3000], [57.8100, -5.2200],
        [57.8430, -5.2600], [57.8200, -5.1800], [57.7800, -5.0800],
        [57.7529, -5.0350], [57.7800, -5.0800], [57.8200, -5.1200],
        [57.8600, -5.1400], [57.8960, -5.1600]
      ],
      tips: 'Short day, so take your time. Gruinard Bay deserves at least 20 minutes — the beach is stunning. The An Teallach viewpoint layby is easy to miss — it\'s on a sweeping bend near Dundonnell. Ullapool has everything you need: fuel, food, supplies, and a great atmosphere. Spend the afternoon exploring the town or take the boat trip to the Summer Isles.'
    },

    // =====================================================
    // DAY 4 — Ullapool to Durness
    // =====================================================
    {
      day: 4,
      title: 'Ullapool to Durness',
      distance: '~100 miles',
      duration: '~4-5 hrs riding',
      summary: 'Into the wild Sutherland wilderness on the NC500 northern section. Pass Knockan Crag\'s ancient geology, the haunting ruins of Ardvreck Castle on Loch Assynt, cross the iconic Kylesku Bridge, and arrive at Durness to explore the mysterious Smoo Cave. This is some of the emptiest, most beautiful landscape in Europe.',
      center: [58.30, -5.00],
      zoom: 8,
      region: 'sutherland',
      mergeable: false,
      stops: [
        {
          name: 'Knockan Crag Geological Trail',
          lat: 58.1000, lng: -5.0400,
          type: 'landmark',
          rating: 4,
          description: 'One of the most important geological sites on Earth. Here, the Moine Thrust was discovered — proving that older rocks could be pushed on top of younger ones, rewriting geology forever. The exposed rock face shows 3-billion-year-old Lewisian Gneiss sitting on top of 500-million-year-old limestone. A short walking trail with sculptures and interpretation boards. Free to visit, right on the A835. You\'re literally touching rocks older than almost anything else on Earth.',
          url: 'https://www.nature.scot/enjoying-outdoors/scotlands-national-nature-reserves/knockan-crag'
        },
        {
          name: 'Ardvreck Castle',
          lat: 58.1564, lng: -4.9887,
          type: 'castle',
          rating: 4,
          description: 'Haunting 15th-century castle ruin on a rocky promontory jutting into Loch Assynt. Reportedly haunted by the ghost of a woman who threw herself from the tower. The reflections in the loch on a calm day are incredible. Free to visit — just walk across the grass. The backdrop of Quinag mountain makes this one of the most atmospheric castle ruins in Scotland.'
        },
        {
          name: 'Loch Assynt Viewpoint',
          lat: 58.1600, lng: -5.0200,
          type: 'viewpoint',
          rating: 4,
          description: 'Several laybys along Loch Assynt offer stunning views of the loch with Ardvreck Castle in the distance and the dramatic Assynt mountains — Quinag, Canisp, and Suilven — rising all around. The landscape here is raw, ancient, and sparse.'
        },
        {
          name: 'Bone Caves (Allt nan Uamh)',
          lat: 58.1600, lng: -4.9300,
          type: 'landmark',
          rating: 3,
          description: 'Ancient caves where the bones of lynx, brown bears, and polar bears have been found — dating back 47,000 years. Short uphill walk from the road. The limestone landscape around here is some of the oldest rock on Earth, over 3 billion years old.'
        },
        {
          name: 'Kylesku Bridge',
          lat: 58.2550, lng: -5.0210,
          type: 'bridge',
          rating: 5,
          description: 'One of the most photographed bridges on the NC500. A graceful curved concrete bridge sweeping over Loch a\' Chairn Bhain with mountains dropping straight into the sea loch on both sides. The views from the bridge are extraordinary — look down into crystal-clear water where seals often swim below. Pull into the layby on the north side for the classic postcard shot.',
          url: 'https://www.northcoast500.com'
        },
        {
          name: 'Kylesku Boat Trips',
          lat: 58.2530, lng: -5.0200,
          type: 'wildlife',
          rating: 4,
          description: 'Boat trips from the old Kylesku ferry slip take you to see the highest waterfall in Britain — Eas a\' Chual Aluinn (658ft). Also seals, porpoises, and sea eagles on the crossing. Book in advance.',
          url: 'https://www.kyleskuboattrips.com'
        },
        {
          name: 'Scourie Bay',
          lat: 58.3530, lng: -5.1590,
          type: 'beach',
          rating: 3,
          description: 'Sheltered bay with a sandy beach and views out to the island of Handa. Good fuel stop at the small garage. The Scourie Hotel does bar meals.'
        },
        {
          name: 'Handa Island Viewpoint',
          lat: 58.3800, lng: -5.1800,
          type: 'wildlife',
          rating: 4,
          description: 'Handa Island, visible offshore from the road north of Scourie, is a wildlife reserve home to 200,000+ seabirds including puffins, guillemots, and razorbills. Boat trips run from Tarbet in summer. The cliffs on the far side of the island are 400ft high and seething with birdlife.'
        },
        {
          name: 'Rhiconich',
          lat: 58.4100, lng: -5.0500,
          type: 'fuel',
          rating: 2,
          description: 'Small settlement with a hotel and the last fuel before Durness. The Rhiconich Hotel has a bar that serves food. Fill up here if needed — the run to Durness is empty and wild.'
        },
        {
          name: 'Loch Eriboll',
          lat: 58.5000, lng: -4.7500,
          type: 'viewpoint',
          rating: 4,
          description: 'Enormous sea loch that the road follows for miles. During WWII it was used as a practice area for battleship gunners — locals called it \'Loch Horrible\' for the noise. The road around its eastern shore is beautifully desolate with views to the rugged hills beyond.'
        },
        {
          name: 'Smoo Cave',
          lat: 58.5614, lng: -4.7268,
          type: 'cave',
          rating: 5,
          description: 'Massive sea cave with an inner freshwater waterfall — the largest cave entrance in mainland Britain. The outer chamber is 200ft long and 130ft wide. Walkable into the first chamber freely. Boat trips go deeper to see the waterfall plunging through a sinkhole in the ceiling. An eerie and unforgettable spot.',
          url: 'https://www.smoocave.org'
        },
        {
          name: 'Durness Village',
          lat: 58.5670, lng: -4.7480,
          type: 'landmark',
          rating: 3,
          description: 'Remote village on the north coast and the most north-westerly settlement on the British mainland. John Lennon spent childhood holidays here — there\'s a memorial. The Cocoa Mountain chocolate shop and cafe is surprisingly excellent.'
        },
        {
          name: 'Sango Sands Campsite, Durness',
          lat: 58.5600, lng: -4.7300,
          type: 'camp',
          rating: 5,
          description: 'Spectacular clifftop campsite overlooking Sango Bay — widely considered one of the best campsite locations in Britain. Fall asleep to the sound of Atlantic waves crashing on the rocks below. Hot showers and a small shop. The view from your tent will blow your mind.',
          park4night: 'https://park4night.com/en/search?lat=58.56&lng=-4.73'
        }
      ],
      roads: [
        {
          name: 'A837/A894 Assynt Road',
          rating: 4,
          description: 'Remote road through the Assynt region. Empty, winding, with views over Loch Assynt and the mountains. The kind of road where you don\'t see another vehicle for 20 minutes.'
        },
        {
          name: 'A838 Kylesku to Durness',
          rating: 4,
          description: 'Wild, remote coastal road along the very north-west. Single-track in places with spectacular sea loch and mountain views. Empty moorland, deserted beaches, and vast Atlantic panoramas.'
        }
      ],
      route: [
        [57.8960, -5.1600], [57.9500, -5.1000], [58.0000, -5.0500],
        [58.0500, -5.0400], [58.1000, -5.0400], [58.1564, -4.9887],
        [58.1600, -5.0200], [58.2000, -5.0200], [58.2550, -5.0210],
        [58.3000, -5.0800], [58.3530, -5.1590], [58.3800, -5.1800],
        [58.4100, -5.0500], [58.4500, -4.9500], [58.5000, -4.8500],
        [58.5000, -4.7500], [58.5300, -4.7400], [58.5614, -4.7268],
        [58.5600, -4.7300]
      ],
      tips: 'Fuel up in Ullapool — the next reliable fuel is Lochinver, Scourie, or Durness and they can have limited hours. The Assynt landscape is otherworldly — take your time and stop often. Kylesku Bridge is a must-stop photo spot. Smoo Cave is free to enter the first chamber. The Sango Sands campsite is exposed to Atlantic gales — stake your tent properly.'
    },

    // =====================================================
    // DAY 5 — Durness to John O'Groats
    // =====================================================
    {
      day: 5,
      title: 'Durness to John O\'Groats',
      distance: '~110 miles',
      duration: '~4-5 hrs riding',
      summary: 'Ride the wild north coast from Durness to John O\'Groats — mainland Britain\'s top edge. Pass deserted beaches, the village of Tongue with its ruined castle, and the actual northernmost point at Dunnet Head. Finish at the famous signpost with the dramatic Duncansby sea stacks nearby.',
      center: [58.55, -4.00],
      zoom: 8,
      region: 'north-coast',
      mergeable: false,
      stops: [
        {
          name: 'Balnakeil Beach',
          lat: 58.5770, lng: -4.7650,
          type: 'beach',
          rating: 4,
          description: 'Stunning white sand beach with turquoise water just west of Durness. The old Balnakeil Church dates from the 8th century. The beach stretches for nearly a mile and you\'ll likely have it to yourself. The Balnakeil Craft Village occupies a former Cold War early warning station — quirky and worth a browse.'
        },
        {
          name: 'Tongue Village & Castle Varrich',
          lat: 58.4750, lng: -4.4250,
          type: 'landmark',
          rating: 3,
          description: 'Tiny village overlooking the Kyle of Tongue with the ruins of Castle Varrich on the hill above. A 20-minute walk up to the castle ruins gives panoramic views over the Kyle. The causeway across the Kyle is a scenic route. Good place for a tea stop at the hotel.'
        },
        {
          name: 'Ben Hope Viewpoint',
          lat: 58.3917, lng: -4.6000,
          type: 'viewpoint',
          rating: 3,
          description: 'Scotland\'s most northerly Munro at 3,041ft. You don\'t need to climb it — the roadside views of this isolated mountain rising from the moorland are impressive enough from the saddle. It\'s a lonely, dramatic peak against vast open skies.'
        },
        {
          name: 'Bettyhill & Strathnaver Museum',
          lat: 58.5276, lng: -4.2195,
          type: 'landmark',
          rating: 4,
          description: 'Small village with a powerful museum telling the story of the Highland Clearances — the forced eviction of thousands of families from their homes in the 19th century. Heavy but important history. The village sits on a beautiful stretch of coast with a lovely beach.',
          url: 'https://www.strathnavermuseum.org.uk'
        },
        {
          name: 'Strathy Point',
          lat: 58.5900, lng: -3.9800,
          type: 'viewpoint',
          rating: 3,
          description: 'Headland jutting out into the Atlantic with a lighthouse at the tip. A short detour off the main road with dramatic cliff views. Puffins nest here in summer. Wild, exposed, and beautifully bleak.'
        },
        {
          name: 'Thurso',
          lat: 58.5930, lng: -3.5270,
          type: 'fuel',
          rating: 2,
          description: 'The largest town on the north coast and a vital fuel and supplies stop. The harbour area has character and there are several cafes and shops. The surf break at Thurso East is one of the best cold-water waves in Europe.'
        },
        {
          name: 'Dunnet Head',
          lat: 58.6712, lng: -3.3724,
          type: 'viewpoint',
          rating: 5,
          description: 'The ACTUAL most northerly point of mainland Britain — NOT John O\'Groats (that\'s a common myth). The lighthouse-capped headland has dramatic clifftop views to Orkney, just 8 miles across the Pentland Firth. Puffins nest on the cliffs in summer. Ride out to the end of the peninsula and stand at the very top of Britain.'
        },
        {
          name: 'Castle of Mey',
          lat: 58.6380, lng: -3.2250,
          type: 'castle',
          rating: 4,
          description: 'The Queen Mother\'s beloved Scottish retreat. Beautiful walled gardens and a surprisingly modest castle. She spent summers here from the 1950s until her death in 2002. The gardens shelter from the fierce Caithness winds. Open to visitors in season.',
          url: 'https://www.castleofmey.org.uk'
        },
        {
          name: 'John O\'Groats Signpost',
          lat: 58.6439, lng: -3.0687,
          type: 'landmark',
          rating: 3,
          description: 'The famous signpost marking the north-east tip of mainland Britain. Get your photo showing 874 miles to Land\'s End. The town itself is a bit touristy but the signpost moment matters on a motorcycle trip. You can get a personalised signpost photo for a few pounds.'
        },
        {
          name: 'Duncansby Head & Sea Stacks',
          lat: 58.6436, lng: -3.0256,
          type: 'viewpoint',
          rating: 5,
          description: 'Just east of John O\'Groats and FAR more dramatic. Towering sea stacks rising from the ocean — the Duncansby Stacks are some of Scotland\'s most spectacular coastal formations. Massive cliff formations and puffin colonies in summer. A short walk from the car park. This is the real highlight — don\'t skip it for the signpost.'
        },
        {
          name: 'John O\'Groats Campsite',
          lat: 58.6430, lng: -3.0700,
          type: 'camp',
          rating: 3,
          description: 'Simple campsite within walking distance of the famous signpost. Decent facilities, exposed to the wind — it\'s the top of Britain after all. The pub in the hotel does reasonable food. Wake up knowing you\'ve reached the furthest point north.',
          park4night: 'https://park4night.com/en/search?lat=58.64&lng=-3.07'
        }
      ],
      roads: [
        {
          name: 'A838 Durness to Tongue',
          rating: 4,
          description: 'Wild, remote coastal road along the very top of Britain. Empty moorland, deserted beaches, and vast Atlantic views. Single-track in places with proper Highland character. Crosswinds can be fierce.'
        },
        {
          name: 'A836 Tongue to Thurso',
          rating: 3,
          description: 'Undulating road across the Caithness Flow Country. Flatter and straighter than the west coast but still remote. Peat bogs stretch to the horizon.'
        },
        {
          name: 'A836 Thurso to John O\'Groats',
          rating: 3,
          description: 'Straightforward road along the north coast. The detour out to Dunnet Head is the highlight.'
        }
      ],
      route: [
        [58.5600, -4.7300], [58.5770, -4.7650], [58.5600, -4.7300],
        [58.5400, -4.6000], [58.5000, -4.5000], [58.4750, -4.4250],
        [58.5000, -4.3000], [58.5276, -4.2195], [58.5500, -4.0500],
        [58.5900, -3.9800], [58.5800, -3.8000], [58.5930, -3.5270],
        [58.6200, -3.4500], [58.6500, -3.4000], [58.6712, -3.3724],
        [58.6380, -3.2250], [58.6400, -3.1500], [58.6439, -3.0687],
        [58.6436, -3.0256], [58.6430, -3.0700]
      ],
      tips: 'The north coast is exposed to fierce winds — crosswinds on a motorbike can be brutal, especially on the open moorland. Fuel up at Tongue or Thurso. Dunnet Head is the true most northerly point — make sure you ride out there. The Duncansby sea stacks are a short walk and far more impressive than the John O\'Groats signpost. Allow 30 minutes for the Duncansby walk.'
    },

    // =====================================================
    // DAY 6 — John O'Groats to Dingwall
    // =====================================================
    {
      day: 6,
      title: 'John O\'Groats to Dingwall',
      distance: '~130 miles',
      duration: '~4-5 hrs riding',
      summary: 'South along the east coast towards Dingwall. A day of contrasts — dramatic cliffs, fairy-tale castles, whisky distilleries, and charming coastal towns. Dunrobin Castle looks like a French château transplanted to the Scottish coast, and the historic towns of Dornoch and Tain are well worth a stop.',
      center: [58.00, -3.80],
      zoom: 8,
      region: 'east-coast',
      mergeable: false,
      stops: [
        {
          name: 'Whaligoe Steps',
          lat: 58.3222, lng: -3.1200,
          type: 'viewpoint',
          rating: 4,
          description: '365 flagstone steps carved into a sheer cliff face down to a tiny harbour. Built by herring fishermen in the 18th century. The descent is steep and slightly terrifying — 365 hand-cut steps down a near-vertical cliff. The cafe at the top does great soup. Don\'t look down if you\'re not good with heights.'
        },
        {
          name: 'Wick Heritage Centre',
          lat: 58.4400, lng: -3.0900,
          type: 'landmark',
          rating: 3,
          description: 'Fascinating museum in the old herring town of Wick. At its peak, Wick was the herring capital of Europe — 1,000 boats would cram into the harbour. The Johnston Collection of photographs shows the boom years. A quick 30-minute stop with good context for the east coast fishing heritage.'
        },
        {
          name: 'Helmsdale Village',
          lat: 58.1150, lng: -3.6500,
          type: 'landmark',
          rating: 3,
          description: 'Pretty fishing village at the mouth of the River Helmsdale — one of Scotland\'s finest salmon rivers. The village has links to the Kildonan Gold Rush of 1869. La Mirage fish and chip shop (Michelin recommended) is decorated with outrageous kitsch — a must-stop for fish and chips.'
        },
        {
          name: 'Timespan Museum, Helmsdale',
          lat: 58.1170, lng: -3.6520,
          type: 'landmark',
          rating: 3,
          description: 'Award-winning museum telling the story of the east coast Highlands — from Pictish stones to the Clearances to the gold rush. Excellent interactive displays. The herb garden overlooking the river is a peaceful spot.'
        },
        {
          name: 'Clynelish Distillery',
          lat: 58.0150, lng: -3.8730,
          type: 'distillery',
          rating: 4,
          description: 'Coastal Highland single malt distillery near Brora, producing a waxy, honeyed whisky that\'s a favourite among connoisseurs. Tours and tastings available — the distillery-only bottlings are special. Buy a bottle for camp tonight. Just remember you\'re riding.',
          url: 'https://www.malts.com/en-gb/distilleries/clynelish'
        },
        {
          name: 'Dunrobin Castle',
          lat: 57.9802, lng: -3.9465,
          type: 'castle',
          rating: 5,
          description: 'Fairy-tale French château transported to the Scottish coast — 189 rooms, conical turrets, and magnificent formal gardens dropping to the sea. The falconry display in the gardens is excellent — eagles and falcons swooping overhead against the castle backdrop. One of the most visually stunning buildings in Scotland.',
          url: 'https://www.dunrobincastle.co.uk'
        },
        {
          name: 'Golspie Beach',
          lat: 57.9810, lng: -3.9830,
          type: 'beach',
          rating: 3,
          description: 'Long golden beach below Dunrobin Castle. Often empty despite the castle crowds above. Good for a leg stretch with dramatic views up the east coast. The Duke of Sutherland monument stands controversially on the hill behind.'
        },
        {
          name: 'Dornoch Cathedral',
          lat: 57.8800, lng: -4.0269,
          type: 'landmark',
          rating: 4,
          description: 'Beautiful 13th-century cathedral in the charming town of Dornoch. Madonna chose to christen her son here. The town has an excellent golf course, good cafes, and a stunning beach to the south. Worth a wander — Dornoch is one of the most attractive small towns in the Highlands.'
        },
        {
          name: 'Tain Through Time Museum',
          lat: 57.8120, lng: -4.0540,
          type: 'landmark',
          rating: 3,
          description: 'Historic royal burgh of Tain — Scotland\'s oldest royal burgh. The museum tells the story of the town\'s importance as a medieval pilgrimage site. The Glenmorangie Distillery is just outside town if you fancy another whisky stop.',
          url: 'https://www.tainmuseum.org.uk'
        },
        {
          name: 'Glenmorangie Distillery',
          lat: 57.8200, lng: -4.0400,
          type: 'distillery',
          rating: 4,
          description: 'Home of one of Scotland\'s most popular Highland malts. The stills here are the tallest in Scotland, giving the whisky its delicate, elegant character. Excellent tours and tastings. The original 10-year-old is a classic dram.',
          url: 'https://www.glenmorangie.com/en/our-distillery'
        },
        {
          name: 'Struie Hill Viewpoint',
          lat: 57.7500, lng: -4.2000,
          type: 'viewpoint',
          rating: 4,
          description: 'Panoramic viewpoint on the B9176 over the Dornoch Firth. On a clear day you can see for miles across the firth and the farmland of Easter Ross. One of the finest viewpoints on the east coast route.'
        },
        {
          name: 'Dingwall',
          lat: 57.5960, lng: -4.4290,
          type: 'landmark',
          rating: 2,
          description: 'Historic market town at the head of the Cromarty Firth. Norse origins — the name comes from the Old Norse \'Þingvǫllr\' (parliament field). Good fuel, shops, and accommodation. A practical base for exploring the Black Isle tomorrow.'
        },
        {
          name: 'Black Rock Caravan Park, Dingwall',
          lat: 57.5900, lng: -4.4500,
          type: 'camp',
          rating: 3,
          description: 'Practical campsite near Dingwall with good facilities. Hot showers, sheltered pitches, and easy access to town for supplies and pubs. Not the most scenic campsite of the trip, but a comfortable base for the last night.',
          park4night: 'https://park4night.com/en/search?lat=57.59&lng=-4.45'
        }
      ],
      roads: [
        {
          name: 'A99/A9 East Coast',
          rating: 3,
          description: 'Main road south along the east coast. Well-surfaced and fairly fast. Not the twistiest riding but the coastal views, castle stops, and whisky distilleries make it a rewarding day.'
        },
        {
          name: 'B9176 Struie Hill Road',
          rating: 4,
          description: 'Scenic alternative to the A9 across the hills above the Dornoch Firth. Sweeping bends through moorland with stunning panoramic views. A much better ride than the main road.'
        }
      ],
      route: [
        [58.6430, -3.0700], [58.5500, -3.1000], [58.4400, -3.0900],
        [58.3222, -3.1200], [58.2000, -3.3000], [58.1150, -3.6500],
        [58.0150, -3.8730], [57.9802, -3.9465], [57.9810, -3.9830],
        [57.8800, -4.0269], [57.8200, -4.0400], [57.8120, -4.0540],
        [57.7500, -4.2000], [57.6800, -4.3500], [57.5960, -4.4290]
      ],
      tips: 'The east coast is less dramatic than the west but has its own quieter charm and fascinating history. Dunrobin Castle is an absolute must-stop — time your visit for the falconry display. The Clynelish or Glenmorangie distilleries offer great tours but remember you\'re riding. La Mirage in Helmsdale does superb fish and chips — don\'t miss it.'
    },

    // =====================================================
    // DAY 7 — Dingwall to Inverness via Glen Affric
    // =====================================================
    {
      day: 7,
      title: 'Dingwall to Inverness via Glen Affric',
      distance: '~85 miles',
      duration: '~3-4 hrs riding',
      summary: 'The final day — a relaxed loop through the Black Isle and then inland to one of Scotland\'s most beautiful glens. Explore Fortrose and Chanonry Point for dolphin watching, cross to Beauly, then ride deep into Glen Affric to see ancient Caledonian pine forest, dramatic waterfalls, and mirror-still lochs. Return to Inverness having completed the full Highland loop.',
      center: [57.45, -4.50],
      zoom: 9,
      region: 'black-isle-affric',
      mergeable: false,
      stops: [
        {
          name: 'Fortrose Cathedral',
          lat: 57.5805, lng: -4.1300,
          type: 'landmark',
          rating: 3,
          description: 'Red sandstone ruins of a medieval cathedral on the Black Isle. The chapter house and sacristy survive intact. The town of Fortrose is pleasant with good cafes. The Brahan Seer — Scotland\'s Nostradamus — was allegedly burned here in the 17th century.'
        },
        {
          name: 'Chanonry Point Dolphins',
          lat: 57.5728, lng: -4.0939,
          type: 'wildlife',
          rating: 5,
          description: 'THE best dolphin watching spot in Britain. At certain tides, bottlenose dolphins come within metres of the shore to hunt salmon. Mid-tide on a rising tide is the magic time. The Moray Firth has the most northerly population of bottlenose dolphins in the world. You might wait 30 minutes or see them immediately. Bring binoculars if you have them.',
          url: 'https://www.dolphinspace.org'
        },
        {
          name: 'Rosemarkie Beach & Fairy Glen',
          lat: 57.5900, lng: -4.1150,
          type: 'viewpoint',
          rating: 3,
          description: 'Sandy beach at Rosemarkie with views across the Moray Firth. Behind the village, the Fairy Glen is a magical wooded gorge with waterfalls — a 30-minute circular walk. The Groam House Museum has an excellent collection of Pictish stones.'
        },
        {
          name: 'Beauly Priory',
          lat: 57.4770, lng: -4.4720,
          type: 'landmark',
          rating: 3,
          description: 'Atmospheric 13th-century priory ruins in the centre of the pretty village of Beauly. Mary Queen of Scots visited in 1564 and reportedly said \'C\'est un beau lieu\' (what a beautiful place) — giving the village its name. Free entry. The village square has good coffee shops.'
        },
        {
          name: 'Beauly Fuel Stop',
          lat: 57.4780, lng: -4.4700,
          type: 'fuel',
          rating: 2,
          description: 'Fill up before heading into Glen Affric — there are no fuel stations in the glen and it\'s an out-and-back ride of about 40 miles. The glen road has no services at all.'
        },
        {
          name: 'Dog Falls, Glen Affric',
          lat: 57.3030, lng: -4.9520,
          type: 'waterfall',
          rating: 4,
          description: 'Beautiful woodland waterfall in the heart of Glen Affric. A short circular walk (30 minutes) through ancient Caledonian pine forest leads to viewing platforms above the falls crashing through a rocky gorge. Red squirrels are often spotted in the pines. The air smells of pine resin and peat — intoxicating.'
        },
        {
          name: 'Glen Affric Viewpoint',
          lat: 57.2830, lng: -5.0250,
          type: 'viewpoint',
          rating: 5,
          description: 'Often called the most beautiful glen in Scotland. The viewpoint car park at the end of the public road gives a jaw-dropping panorama of Loch Affric surrounded by ancient Caledonian pines with mountains rising all around. On a calm day the reflections in the loch are extraordinary — the kind of view that makes you turn the engine off and just sit there.'
        },
        {
          name: 'Plodda Falls',
          lat: 57.2600, lng: -4.9890,
          type: 'waterfall',
          rating: 5,
          description: 'Spectacular 151ft waterfall plunging into a deep gorge. A short walk through Douglas fir forest leads to a viewing platform that juts out directly over the falls — vertigo sufferers beware. One of Scotland\'s most impressive waterfalls, yet surprisingly unknown. The surrounding forest of massive Douglas firs is atmospheric — some trees are over 150 years old.',
          url: 'https://www.forestryandland.gov.scot/visit/plodda-falls'
        },
        {
          name: 'Red Squirrels in Glen Affric',
          lat: 57.2900, lng: -4.9700,
          type: 'wildlife',
          rating: 3,
          description: 'Glen Affric\'s ancient Caledonian pine forest is a stronghold for red squirrels. Walk quietly through the pines and you\'ll almost certainly spot them. The Dog Falls trail is particularly good for sightings. Also look for Scottish crossbills and crested tits — both specialities of the native pinewoods.'
        },
        {
          name: 'Cannich Village',
          lat: 57.3500, lng: -4.7850,
          type: 'landmark',
          rating: 2,
          description: 'Small village and the gateway to Glen Affric. The Glen Affric Bar does simple food and has a relaxed atmosphere. This is your turning point before heading back east to Inverness.'
        },
        {
          name: 'Clootie Well',
          lat: 57.5533, lng: -4.4594,
          type: 'landmark',
          rating: 4,
          description: 'One of Scotland\'s eeriest sites — an ancient healing well surrounded by thousands of rags and cloth strips tied to the trees by visitors seeking cures. The atmosphere is genuinely unsettling. Pagan tradition meets Highland superstition. A quick roadside stop on the A832. Don\'t remove any of the cloths — bad luck supposedly follows.'
        },
        {
          name: 'Inverness — Journey\'s End',
          lat: 57.4778, lng: -4.2247,
          type: 'landmark',
          rating: 3,
          description: 'Back where you started — 650 miles of Highland roads behind you. Celebrate at the Hootananny pub on the high street (live music, great atmosphere) or the Mustard Seed restaurant overlooking the River Ness. The loop is complete. You\'ve ridden some of the best roads in Britain.'
        },
        {
          name: 'Bught Park Campsite, Inverness',
          lat: 57.4672, lng: -4.2394,
          type: 'camp',
          rating: 3,
          description: 'Urban campsite right by the River Ness, within walking distance of Inverness city centre. Hot showers, laundry facilities, and close to shops, restaurants, and pubs. A comfortable final night or a practical base if you\'re heading home tomorrow.',
          park4night: 'https://park4night.com/en/search?lat=57.47&lng=-4.24'
        }
      ],
      roads: [
        {
          name: 'A832 Black Isle',
          rating: 3,
          description: 'Pleasant road through the Black Isle peninsula. Rolling farmland with Moray Firth views. A gentle start to the final day before the glen roads.'
        },
        {
          name: 'Glen Affric Road',
          rating: 4,
          description: 'Single-track road winding deep into one of Scotland\'s finest glens. Ancient pine forest, mirror lochs, and mountain views. Not fast, but extraordinarily beautiful. An unforgettable final ride.'
        }
      ],
      route: [
        [57.5960, -4.4290], [57.5800, -4.3500], [57.5805, -4.1300],
        [57.5728, -4.0939], [57.5900, -4.1150], [57.5700, -4.2000],
        [57.5533, -4.4594], [57.5200, -4.4600], [57.4770, -4.4720],
        [57.4500, -4.5500], [57.4000, -4.6500], [57.3500, -4.7850],
        [57.3200, -4.8500], [57.3030, -4.9520], [57.2830, -5.0250],
        [57.2600, -4.9890], [57.3030, -4.9520], [57.3500, -4.7850],
        [57.4000, -4.6500], [57.4500, -4.5000], [57.4672, -4.2394],
        [57.4778, -4.2247]
      ],
      tips: 'Time your Chanonry Point visit for a rising mid-tide for the best dolphin watching — check local tide times. Fill up at Beauly before Glen Affric — there\'s nothing in the glen. The glen road is an out-and-back, so you\'ll ride it twice — it\'s just as beautiful in both directions. Plodda Falls is slightly off the main glen road near Tomich — follow signs from Cannich. Take your time on this final day — it\'s a fitting end to an epic loop.'
    }
  ],

  topRoads: [
    { name: 'Bealach na Ba', day: 2, rating: 5, region: 'Wester Ross' },
    { name: 'A832 Achnasheen to Kinlochewe', day: 1, rating: 4, region: 'Wester Ross' },
    { name: 'A832 Poolewe to Dundonnell', day: 3, rating: 4, region: 'Wester Ross' },
    { name: 'A837/A894 Assynt Road', day: 4, rating: 4, region: 'Sutherland' },
    { name: 'A838 Kylesku to Durness', day: 4, rating: 4, region: 'Sutherland' },
    { name: 'A838 Durness to Tongue', day: 5, rating: 4, region: 'North Coast' },
    { name: 'Applecross Coast Road', day: 2, rating: 4, region: 'Wester Ross' },
    { name: 'A896 Shieldaig to Kinlochewe', day: 2, rating: 4, region: 'Wester Ross' },
    { name: 'B9176 Struie Hill Road', day: 6, rating: 4, region: 'Easter Ross' },
    { name: 'Glen Affric Road', day: 7, rating: 4, region: 'Glen Affric' },
    { name: 'A835 Inverness to Braemore', day: 1, rating: 3, region: 'Highlands' },
    { name: 'A835 Braemore to Ullapool', day: 3, rating: 3, region: 'Wester Ross' },
    { name: 'A836 Tongue to Thurso', day: 5, rating: 3, region: 'North Coast' },
    { name: 'A99/A9 East Coast', day: 6, rating: 3, region: 'East Coast' },
    { name: 'A832 Black Isle', day: 7, rating: 3, region: 'Black Isle' }
  ]
};
