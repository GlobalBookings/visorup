const JC_SCOTLAND_TRIP = {
  id: 'jc-scotland',
  label: 'JC Scotland',
  meta: {
    title: "Guernsey to Scotland",
    subtitle: "1,880 Miles of Britain's Best Biking Roads — Guernsey to the NC500 and Back",
    bikes: [
      { name: "Suzuki GSX-R1000", icon: "🏍", range: "~150 miles", tank: "17L" },
      { name: "Kawasaki Ninja 650", icon: "🏍", range: "~220 miles", tank: "15L" }
    ],
    totalDays: 14,
    totalDistance: "~1,880 miles / ~3,025 km",
    ferry: {
      operator: "Condor Ferries",
      route: "St Peter Port → Poole",
      duration: "~3 hours (high-speed)",
      url: "https://www.condorferries.co.uk",
      note: "Book bike spaces early — limited slots in peak season. Arrive 90 mins before departure."
    },
    fuelStrategy: "Fill up every 100 miles. The GSX-R1000 has a smaller effective range (~150mi touring). Rural Wales and Scottish Highlands have sparse fuel stations — never pass one below half tank.",
    packingEssentials: [
      "Waterproofs (it's the UK — expect rain any day)",
      "Tank bag or tail pack with dry bags",
      "Chain lube + basic toolkit",
      "Tyre repair kit + mini compressor",
      "Phone mount + USB charger",
      "Offline OS Maps (no signal in Highlands/Wales)",
      "First aid kit",
      "Cable lock for helmets at stops",
      "Camping: tent, sleeping bag, mat, stove, pot, lighter",
      "Midge head net + Smidge repellent (essential June-Sept)",
      "Bungee cords for securing gear"
    ]
  },

  dayColors: [
    "#FF6B6B", // Day 1  - coral
    "#FFA502", // Day 2  - orange
    "#FFD93D", // Day 3  - yellow
    "#6BCB77", // Day 4  - green
    "#4D96FF", // Day 5  - blue
    "#9B59B6", // Day 6  - purple
    "#FF6348", // Day 7  - red-orange
    "#00B894", // Day 8  - mint
    "#E17055", // Day 9  - salmon
    "#0984E3", // Day 10 - royal blue
    "#FDCB6E", // Day 11 - gold
    "#A29BFE", // Day 12 - lavender
    "#55EFC4", // Day 13 - aquamarine
    "#D63031"  // Day 14 - crimson
  ],

  markerColors: {
    ferry: "#3498db",
    landmark: "#9b59b6",
    viewpoint: "#e8713a",
    waterfall: "#00cec9",
    road: "#e74c3c",
    camp: "#27ae60",
    wildlife: "#f39c12",
    fuel: "#fdcb6e",
    beach: "#e17055",
    castle: "#6c5ce7",
    distillery: "#d35400",
    pub: "#c0392b",
    bridge: "#2d98da",
    fossil: "#cd853f"
  },

  days: [
    // =====================================================
    // DAY 1 — Guernsey to Dorset Coast
    // =====================================================
    {
      day: 1,
      title: "Guernsey to Dorset Coast",
      distance: "~60 miles",
      duration: "~2 hrs riding + ferry",
      summary: "Short settling-in day after the ferry crossing. Cruise through Dorset's Jurassic Coast and camp in the ancient New Forest. The A351 through the Purbeck Hills is a cracking warm-up.",
      center: [50.72, -2.05],
      zoom: 10,
      region: "england-south",
      mergeable: false,
      stops: [
        {
          name: "St Peter Port Ferry Terminal",
          lat: 49.4566, lng: -2.5356,
          type: "ferry",
          description: "Condor Ferries high-speed to Poole. Book bike spaces well in advance — peak season fills fast. Get a brew on the upper deck and watch Guernsey shrink behind you.",
          url: "https://www.condorferries.co.uk"
        },
        {
          name: "Poole Ferry Terminal",
          lat: 50.7109, lng: -1.9882,
          type: "ferry",
          description: "Arrival point. Fill up at the Tesco fuel station nearby before heading west. Check tyre pressures after the crossing — they can drop in the hold."
        },
        {
          name: "Corfe Castle",
          lat: 50.6395, lng: -2.0566,
          type: "castle",
          description: "Dramatic ruined castle on a hilltop, dating back to the 11th century. The A351 approach through the Purbeck Hills has great sweeping bends. Worth a 30-min stop for photos — the castle looks incredible from the village below.",
          url: "https://www.nationaltrust.org.uk/corfe-castle"
        },
        {
          name: "Kimmeridge Bay Fossil Ledges",
          lat: 50.6100, lng: -2.1200,
          type: "fossil",
          description: "One of the richest fossil-hunting sites on the Jurassic Coast. The wave-cut rock platforms are packed with 150-million-year-old ammonites, belemnites, and bivalves — many visible without even bending down. Walk out onto the ledges at low tide and you're literally standing on a Jurassic seabed. The Etches Collection museum nearby houses one of the finest private fossil collections in the world. Only 3 miles off the main route via a short detour from Corfe Castle.",
          url: "https://www.theetchescollection.org"
        },
        {
          name: "Lulworth Cove",
          lat: 50.6200, lng: -2.2500,
          type: "viewpoint",
          description: "Perfect horseshoe-shaped cove carved into the Jurassic Coast. Park up and walk 10 minutes to the beach. The geology here is 185 million years old — makes your bike feel brand new."
        },
        {
          name: "Durdle Door",
          lat: 50.6214, lng: -2.2766,
          type: "viewpoint",
          description: "Iconic natural limestone arch jutting into turquoise sea. 15-min walk from Lulworth car park. One of England's most photographed landmarks. Sunset here is unreal."
        },
        {
          name: "The Fossil Forest",
          lat: 50.6190, lng: -2.2330,
          type: "fossil",
          description: "Petrified tree stumps from 150 million years ago, preserved in the clifftop limestone east of Lulworth Cove. These are the actual fossilised remains of a Late Jurassic forest — you can see the tree trunks and algal growths that encrusted them before they turned to stone. A 20-min walk along the coast path from Lulworth car park. Access sometimes restricted by Lulworth military range — check firing times before visiting.",
          url: "https://jurassiccoast.org/visit/fossil-forest/"
        },
        {
          name: "New Forest Ponies",
          lat: 50.8500, lng: -1.6000,
          type: "wildlife",
          description: "Wild ponies, donkeys, and cattle roam freely across the roads. Ride carefully through the forest — they have right of way and will stand in the road. Seriously, they do not care about your sportbike."
        },
        {
          name: "Hollands Wood Campsite",
          lat: 50.8176, lng: -1.5464,
          type: "camp",
          description: "Forestry England site in the heart of the New Forest. Hot showers, flat pitches under ancient oaks. Ponies wander through the site at dawn. A peaceful first night before the big miles begin.",
          url: "https://www.forestryengland.uk/hollands-wood",
          park4night: "https://park4night.com/en/search?lat=50.82&lng=-1.55"
        }
      ],
      roads: [
        {
          name: "A351 through Purbeck",
          rating: 3,
          description: "Sweeping bends through the Purbeck Hills to Corfe Castle. Good warm-up road after the ferry — nothing too scary, just lovely flowing turns with castle views."
        }
      ],
      route: [
        [50.7109, -1.9882], [50.6900, -2.0100], [50.6600, -2.0300],
        [50.6395, -2.0566], [50.6300, -2.1200], [50.6200, -2.2000],
        [50.6214, -2.2766], [50.6500, -2.2000], [50.6800, -2.0500],
        [50.7200, -1.9200], [50.7500, -1.7500], [50.7900, -1.6500],
        [50.8176, -1.5464]
      ],
      ferryRoute: [
        [49.4566, -2.5356], [49.6000, -2.4000], [49.8000, -2.3000],
        [50.0000, -2.2000], [50.2000, -2.1000], [50.4000, -2.0500],
        [50.5500, -2.0000], [50.6500, -1.9900], [50.7109, -1.9882]
      ],
      tips: "Take it easy today — you've just come off a ferry and the roads may feel different. Check tyre pressures at Poole. The B3070 to Lulworth is narrow but scenic. Top up fuel before entering the New Forest — stations are scarce inside."
    },

    // =====================================================
    // DAY 2 — Dorset to Brecon Beacons
    // =====================================================
    {
      day: 2,
      title: "Dorset to Brecon Beacons",
      distance: "~180 miles",
      duration: "~5-6 hrs riding",
      summary: "A big day that takes you from England's green lowlands into the wild Welsh mountains. Cheddar Gorge is a jaw-dropping canyon road, and the Black Mountain Pass is one of the UK's all-time great biker roads.",
      center: [51.45, -3.00],
      zoom: 8,
      region: "wales",
      mergeable: true,
      stops: [
        {
          name: "Cheddar Gorge",
          lat: 51.2862, lng: -2.7577,
          type: "road",
          description: "Britain's biggest gorge — towering 450ft limestone cliffs either side of a twisting road. The B3135 through the gorge is a must-ride. Watch for tourist traffic and 30mph limits, but the views are incredible even at walking pace.",
          url: "https://www.cheddargorge.co.uk"
        },
        {
          name: "Clifton Suspension Bridge",
          lat: 51.4545, lng: -2.6278,
          type: "bridge",
          description: "Brunel's masterpiece and one of the most iconic bridges in the world. A 1,352ft suspension bridge soaring 245ft above the Avon Gorge. Riding across it on a sportbike is a proper moment. The views down into the gorge from both sides are vertigo-inducing. Free to cross on two wheels — stop at the visitor centre layby for the best photo angle.",
          url: "https://www.cliftonbridge.org.uk"
        },
        {
          name: "Old Severn Bridge",
          lat: 51.6092, lng: -2.6406,
          type: "bridge",
          description: "Welcome to Wales. The original Severn Bridge is free to cross and more scenic than the M4 crossing. Stop at the services for fuel before heading into the valleys — you'll need a full tank for what's coming."
        },
        {
          name: "Sgwd yr Eira (Waterfall You Walk Behind)",
          lat: 51.7706, lng: -3.5567,
          type: "waterfall",
          description: "Spectacular waterfall where you can walk behind the curtain of water. 30-min walk from the car park at Pontneddfechan. Bring waterproof boots — you will get wet, and it's totally worth it.",
          url: "https://www.breconbeacons.org/waterfall-country"
        },
        {
          name: "Sgwd Clun-Gwyn",
          lat: 51.7750, lng: -3.5620,
          type: "waterfall",
          description: "The widest waterfall in Wales, a short walk from Sgwd yr Eira. The whole Waterfall Country trail has four major falls along it. The kind of place that makes you forget you need to get back on the bike."
        },
        {
          name: "Red Kites over Waterfall Country",
          lat: 51.7800, lng: -3.5400,
          type: "wildlife",
          description: "Look up — red kites soar above the valleys here. Once nearly extinct in the UK, Wales brought them back from the brink. Their forked tails are unmistakable against the sky."
        },
        {
          name: "A4069 Black Mountain Pass",
          lat: 51.8300, lng: -3.8800,
          type: "road",
          description: "THE iconic Welsh biker road. Sweeping curves climbing over the Black Mountain with stunning views of the Brecon Beacons. Featured in countless bike magazines. Pure riding bliss on a clear day — the kind of road you fantasise about on the commute."
        },
        {
          name: "Llyn y Fan Fach",
          lat: 51.8700, lng: -3.7500,
          type: "viewpoint",
          description: "Glacial lake nestled beneath the Black Mountain escarpment. A 45-min walk from the road but worth it for the dramatic scenery. Legendary in Welsh folklore — said to be home to a fairy lady of the lake."
        },
        {
          name: "Priory Mill Farm Campsite",
          lat: 51.9465, lng: -3.3996,
          type: "camp",
          description: "Relaxed farm campsite near Brecon town. Hot showers, peaceful setting by the river. Walk into Brecon for pub grub and a well-earned pint after the Black Mountain.",
          park4night: "https://park4night.com/en/search?lat=51.95&lng=-3.40"
        }
      ],
      roads: [
        {
          name: "B3135 Cheddar Gorge",
          rating: 4,
          description: "Twisting through 450ft limestone cliffs. Tourist traffic can slow you down, but the scenery is incredible. Best ridden early morning before the coaches arrive."
        },
        {
          name: "A4069 Black Mountain Pass",
          rating: 5,
          description: "The jewel of Welsh biking. Long sweeping bends, open mountain views, perfect tarmac. This alone is worth the trip. Surface can be damp — respect the conditions and you'll have the ride of your life."
        }
      ],
      route: [
        [50.8176, -1.5464], [50.8500, -1.6500], [50.9000, -1.8500],
        [50.9500, -2.0500], [51.0000, -2.2000], [51.0500, -2.3500],
        [51.1000, -2.5000], [51.2000, -2.6500], [51.2862, -2.7577],
        [51.3500, -2.7500], [51.4500, -2.7000], [51.5500, -2.6800],
        [51.6092, -2.6406], [51.6500, -2.8000], [51.7000, -3.1000],
        [51.7300, -3.3500], [51.7600, -3.5300], [51.7706, -3.5567],
        [51.7800, -3.6500], [51.7900, -3.7500], [51.8100, -3.8200],
        [51.8300, -3.8800], [51.8600, -3.7500], [51.8800, -3.6000],
        [51.9200, -3.4500], [51.9465, -3.3996]
      ],
      tips: "Fill up before entering the Welsh valleys — fuel stations are sparse past Merthyr Tydfil. The A4069 can be closed in winter or severe weather. Sheep on the road are a constant hazard in Wales — they're fearless and they're everywhere."
    },

    // =====================================================
    // DAY 3 — Brecon Beacons to Peak District
    // =====================================================
    {
      day: 3,
      title: "Brecon Beacons to Peak District",
      distance: "~190 miles",
      duration: "~5-6 hrs riding",
      summary: "The longest day but packed with variety. Cross the wild heart of Wales through Elan Valley's dam country, then finish on the legendary Cat and Fiddle — the highest A-road in England.",
      center: [52.50, -2.80],
      zoom: 8,
      region: "england-mid",
      mergeable: true,
      stops: [
        {
          name: "Elan Valley Dams",
          lat: 52.3025, lng: -3.5644,
          type: "viewpoint",
          description: "A chain of massive Victorian dams in a remote valley. The B4518 along the reservoirs is a stunning ride with virtually no traffic. Red kites circle overhead constantly. It's like riding through a Welsh Lake District.",
          url: "https://www.elanvalley.org.uk"
        },
        {
          name: "Red Kite Feeding Station, Elan Valley",
          lat: 52.2800, lng: -3.5300,
          type: "wildlife",
          description: "Dozens of red kites gather for feeding time (usually 2-3pm). An incredible wildlife spectacle — these birds have 5ft wingspans and they'll dive bomb right over your head."
        },
        {
          name: "Devil's Bridge Falls",
          lat: 52.3769, lng: -3.8489,
          type: "waterfall",
          description: "Three bridges stacked on top of each other spanning a dramatic gorge with a 300ft waterfall. The narrow road to get here is a bonus twisty ride through dense woodland.",
          url: "https://www.devilsbridgefalls.co.uk"
        },
        {
          name: "A537 Cat and Fiddle Road",
          lat: 53.2600, lng: -1.9900,
          type: "road",
          description: "The highest A-road in England at 1,690ft. Fast, flowing bends between Macclesfield and Buxton. Once Britain's most dangerous road — now has average speed cameras. Ride it properly, not recklessly. The views from the top are worth more than any speed thrill."
        },
        {
          name: "Cat and Fiddle Inn",
          lat: 53.2590, lng: -1.9850,
          type: "landmark",
          description: "The second-highest pub in England, right at the summit of the pass. Stop for a brew and soak in the panoramic views across Cheshire and the Peak District. Classic biker meeting spot."
        },
        {
          name: "North Lees Campsite",
          lat: 53.3367, lng: -1.6333,
          type: "camp",
          description: "Small, peaceful Peak District campsite beneath Stanage Edge. Popular with climbers and bikers. Basic but well-kept. Book ahead in summer — it fills fast.",
          park4night: "https://park4night.com/en/search?lat=53.34&lng=-1.63"
        }
      ],
      roads: [
        {
          name: "B4518 Elan Valley",
          rating: 4,
          description: "Smooth, empty road along the chain of reservoirs. Sweeping bends with incredible views. Almost zero traffic midweek — just you, the dams, and the kites."
        },
        {
          name: "A537 Cat and Fiddle",
          rating: 5,
          description: "England's most famous biker road. Fast, flowing bends climbing to 1,690ft. Average speed cameras now enforce the limit — ride within it and still enjoy every single bend."
        }
      ],
      route: [
        [51.9465, -3.3996], [52.0000, -3.4000], [52.1000, -3.4500],
        [52.2000, -3.5000], [52.3025, -3.5644], [52.3500, -3.7000],
        [52.3769, -3.8489], [52.4500, -3.7000], [52.5000, -3.5000],
        [52.5500, -3.3000], [52.6000, -3.0000], [52.7000, -2.7000],
        [52.8000, -2.4000], [52.9000, -2.2000], [53.0000, -2.1000],
        [53.1000, -2.0500], [53.2000, -2.0000], [53.2600, -1.9900],
        [53.3000, -1.8000], [53.3200, -1.7000], [53.3367, -1.6333]
      ],
      tips: "This is the longest day — start early. Mid-Wales has very few fuel stations; fill up at Rhayader or Aberystwyth. The A44 across central Wales can be surprisingly fast and fun. Watch for speed cameras on the Cat and Fiddle — they're average speed, so no point sprinting between them."
    },

    // =====================================================
    // DAY 4 — Peak District to Lake District
    // =====================================================
    {
      day: 4,
      title: "Peak District to Lake District",
      distance: "~160 miles",
      duration: "~5 hrs riding",
      summary: "Pass-bagging day through England's most dramatic mountain roads. Snake Pass, Winnats Pass, Kirkstone Pass, then the big ones — Hardknott and Wrynose. The Hardknott is the steepest paved road in England at 33% gradient.",
      center: [53.90, -2.50],
      zoom: 8,
      region: "england-north",
      mergeable: false,
      stops: [
        {
          name: "Mam Tor",
          lat: 53.3489, lng: -1.8096,
          type: "viewpoint",
          description: "The 'Shivering Mountain' — a huge ridge with panoramic views over the Hope Valley. Park at the bottom and walk 20 mins to the summit for 360-degree views. The old collapsed road below is an eerie sight."
        },
        {
          name: "Winnats Pass",
          lat: 53.3431, lng: -1.8113,
          type: "road",
          description: "Steep, narrow limestone gorge with towering walls either side. Short but dramatic — like riding through a dinosaur's ribcage. One-way-ish traffic so take it steady."
        },
        {
          name: "A57 Snake Pass",
          lat: 53.4300, lng: -1.8700,
          type: "road",
          description: "Classic Peak District pass winding through moorland at 1,680ft. Flowing bends across the Pennine backbone. Can be foggy and wet — the name is earned. A proper biker's road in any weather."
        },
        {
          name: "Ribblehead Viaduct",
          lat: 54.2091, lng: -2.3604,
          type: "bridge",
          description: "Jaw-dropping 24-arch Victorian railway viaduct striding across Batty Moss in the Yorkshire Dales. 440 yards long, 104ft high, built in the 1870s for the Settle-Carlisle line. A short detour off the M6 via the B6255 but absolutely worth it. The viaduct framed by Ingleborough mountain behind it is one of northern England's most spectacular sights. Trains still cross it — time it right and watch one thunder across.",
          url: "https://www.settle-carlisle.co.uk/ribblehead-viaduct/"
        },
        {
          name: "Kirkstone Pass (A592)",
          lat: 54.4350, lng: -2.9350,
          type: "road",
          description: "The highest pass in the Lake District open to motor traffic at 1,489ft. The Struggle — the steep southern approach from Ambleside — is the best bit. First gear on the GSX-R, second on the Ninja."
        },
        {
          name: "Kirkstone Pass Inn",
          lat: 54.4400, lng: -2.9300,
          type: "pub",
          description: "One of the highest pubs in England. A traditional Lakeland inn at the summit — good for a coffee and cake stop before tackling the next pass. Bikers welcome, muddy boots and all."
        },
        {
          name: "Aira Force Waterfall",
          lat: 54.5735, lng: -2.9275,
          type: "waterfall",
          description: "65ft waterfall in a stunning gorge near Ullswater. 20-min walk from the car park through ancient woodland. Wordsworth wrote about the daffodils growing here — it's that kind of beautiful.",
          url: "https://www.nationaltrust.org.uk/aira-force"
        },
        {
          name: "Hardknott Pass",
          lat: 54.4000, lng: -3.2000,
          type: "road",
          description: "England's steepest road at 33% gradient with hairpin bends. Not for the faint-hearted on a loaded bike. The GSX-R will want first gear and careful clutch control. The Ninja's lower weight is a genuine advantage here. Roman fort at the top as a reward."
        },
        {
          name: "Wrynose Pass",
          lat: 54.4100, lng: -3.1100,
          type: "road",
          description: "Hardknott's sister pass, slightly less severe but still properly steep. Run them together for the full Lake District mountain road experience. The Three Shire Stone at the summit marks where three old counties meet."
        },
        {
          name: "Stock Ghyll Force",
          lat: 54.4318, lng: -2.9606,
          type: "waterfall",
          description: "Beautiful 70ft waterfall hidden in the woods above Ambleside. Quick 10-min walk from the town centre. Easy to miss — look for the signed path behind the shops."
        },
        {
          name: "Red Deer on Hardknott",
          lat: 54.3950, lng: -3.2200,
          type: "wildlife",
          description: "Red deer roam the fells around Hardknott. Best spotted early morning or dusk. Also watch for Herdwick sheep — they own these roads and will not move for anything, especially not a sportbike."
        },
        {
          name: "Great Langdale NT Campsite",
          lat: 54.4350, lng: -3.0700,
          type: "camp",
          description: "National Trust campsite in one of the most spectacular valleys in England. Surrounded by dramatic fell peaks. Hot showers, well maintained. Very popular — book ahead or risk being turned away.",
          url: "https://www.nationaltrust.org.uk/great-langdale",
          park4night: "https://park4night.com/en/search?lat=54.44&lng=-3.07"
        }
      ],
      roads: [
        {
          name: "Winnats Pass",
          rating: 4,
          description: "Short dramatic gorge road. Steep and narrow with towering limestone cliffs either side."
        },
        {
          name: "A57 Snake Pass",
          rating: 4,
          description: "Classic Pennine pass. Flowing moorland bends at altitude. Can be foggy and properly atmospheric."
        },
        {
          name: "A592 Kirkstone Pass",
          rating: 4,
          description: "The Struggle is steep and technical. Great views from the summit and a pub waiting at the top."
        },
        {
          name: "Hardknott Pass",
          rating: 5,
          description: "33% gradient hairpins. England's steepest road. A serious challenge on a loaded sportbike. First gear mandatory. Clutch hand will ache afterwards."
        },
        {
          name: "Wrynose Pass",
          rating: 4,
          description: "Steep but slightly more forgiving than Hardknott. Run them back to back for bragging rights."
        }
      ],
      route: [
        [53.3367, -1.6333], [53.3431, -1.8113], [53.3489, -1.8096],
        [53.3800, -1.8500], [53.4300, -1.8700], [53.5000, -1.9500],
        [53.6000, -2.0000], [53.7000, -2.1000], [53.8000, -2.2500],
        [53.9000, -2.4000], [54.0000, -2.5500], [54.1000, -2.6500],
        [54.2000, -2.7500], [54.3000, -2.8500], [54.4000, -2.9000],
        [54.4350, -2.9350], [54.5000, -2.9300], [54.5735, -2.9275],
        [54.5000, -2.9500], [54.4500, -2.9700], [54.4350, -2.9900],
        [54.4100, -3.1100], [54.4000, -3.2000], [54.4200, -3.1000],
        [54.4350, -3.0700]
      ],
      tips: "Hardknott is no joke on a sportbike. Consider going early before tourist traffic blocks the hairpins. If your clutch hand is tired from Wales, do Wrynose first as a warm-up. There's a section of M6 motorway that's unavoidable between Peak District and Lakes — get it over with quickly."
    },

    // =====================================================
    // DAY 5 — Lake District to Scottish Borders
    // =====================================================
    {
      day: 5,
      title: "Lake District to Scottish Borders",
      distance: "~140 miles",
      duration: "~4-5 hrs riding",
      summary: "Cross the Pennines on the mighty Hartside Pass, touch Hadrian's Wall, then cross into Scotland on the A68. Scott's View at sunset is worth timing your arrival for.",
      center: [55.00, -2.50],
      zoom: 8,
      region: "scotland-borders",
      mergeable: true,
      stops: [
        {
          name: "A686 Hartside Pass",
          lat: 54.7500, lng: -2.5000,
          type: "road",
          description: "12 miles of sweeping bends climbing to 1,904ft over the North Pennines. Wide, well-surfaced, and fast. One of England's great motorcycle roads — the kind of road that makes you whoop inside your helmet."
        },
        {
          name: "Hartside Summit",
          lat: 54.7550, lng: -2.5050,
          type: "viewpoint",
          description: "The old cafe burned down but the views remain extraordinary. On a clear day you can see the Lake District fells, Cross Fell, and across to Scotland. Pull over and take it all in — you've earned this one."
        },
        {
          name: "Hadrian's Wall — Steel Rigg",
          lat: 55.0000, lng: -2.3500,
          type: "landmark",
          description: "The best-preserved section of Hadrian's Wall. Park at Steel Rigg and walk along the wall following the dramatic crags. 2,000 years old and still standing — built by Romans who never had to deal with potholes.",
          url: "https://www.english-heritage.org.uk/visit/places/hadrians-wall/"
        },
        {
          name: "Kielder Water & Forest",
          lat: 55.2000, lng: -2.5800,
          type: "viewpoint",
          description: "England's largest forest and most remote lake. The road around the reservoir is quiet and beautiful. Designated Dark Sky Park — if you camp here, the stargazing is world-class."
        },
        {
          name: "Red Squirrels at Kielder",
          lat: 55.2100, lng: -2.5700,
          type: "wildlife",
          description: "One of the best places in England to see red squirrels. The forest is a stronghold for them. Look in the pine woods near the visitor centre — they're curious little things and often come close."
        },
        {
          name: "Carter Bar — Scotland Border",
          lat: 55.3770, lng: -2.4500,
          type: "landmark",
          description: "The official England-Scotland border on the A68. A stone marks the boundary at 1,370ft. Stop for a photo — you've made it to Scotland! The views north into the Borders are spectacular. Cue Braveheart soundtrack."
        },
        {
          name: "Scott's View",
          lat: 55.5839, lng: -2.6491,
          type: "viewpoint",
          description: "Sir Walter Scott's favourite view — a sweeping panorama over the River Tweed and the Eildon Hills. Aim to arrive at golden hour for the best light. Easily one of the finest viewpoints in southern Scotland."
        },
        {
          name: "Gibson Park Campsite, Melrose",
          lat: 55.5989, lng: -2.7286,
          type: "camp",
          description: "Town campsite right next to the ruins of Melrose Abbey. Walk to excellent pubs and restaurants in Melrose — the Burt's Bar does a cracking steak pie. Hot showers, well-kept grounds.",
          park4night: "https://park4night.com/en/search?lat=55.60&lng=-2.73"
        }
      ],
      roads: [
        {
          name: "A686 Hartside Pass",
          rating: 5,
          description: "12 miles of sweeping Pennine pass. Wide, fast, well-surfaced. One of England's greatest motorcycle roads. The climb is relentless and brilliant."
        },
        {
          name: "A68 through the Borders",
          rating: 4,
          description: "Fast, undulating road through the Scottish Borders. Long straights and fast sweepers. Watch for tractors and the occasional speed camera."
        }
      ],
      route: [
        [54.4350, -3.0700], [54.4500, -2.9500], [54.5000, -2.8000],
        [54.5500, -2.7000], [54.6000, -2.6000], [54.6500, -2.5500],
        [54.7000, -2.5200], [54.7500, -2.5000], [54.8000, -2.4500],
        [54.8500, -2.4000], [54.9000, -2.3800], [55.0000, -2.3500],
        [55.1000, -2.4000], [55.2000, -2.4500], [55.3000, -2.4500],
        [55.3770, -2.4500], [55.4500, -2.5000], [55.5000, -2.5500],
        [55.5500, -2.6000], [55.5839, -2.6491], [55.5989, -2.7286]
      ],
      tips: "The A686 is an absolute belter — save some energy for it. Fuel up at Penrith before heading east over Hartside. The A68 is fast but watch for farm traffic and the odd camera. Melrose is a great wee town for a pub meal and a dram."
    },

    // =====================================================
    // DAY 6 — Scottish Borders to Glencoe
    // =====================================================
    {
      day: 6,
      title: "Borders to Glencoe",
      distance: "~170 miles",
      duration: "~5-6 hrs riding",
      summary: "Through the Trossachs and along the bonnie banks of Loch Lomond, then across the haunting emptiness of Rannoch Moor to the dramatic valley of Glencoe. This is where Scotland gets properly wild.",
      center: [56.30, -4.50],
      zoom: 8,
      region: "scotland-central",
      mergeable: false,
      stops: [
        {
          name: "Duke's Pass (A821)",
          lat: 56.2000, lng: -4.4000,
          type: "road",
          description: "Twisting road through the Trossachs National Park. Dense forest, lochs, and tight technical bends. It's like a mini-Highland road — a taste of what's to come. Great fun on a sportbike."
        },
        {
          name: "Loch Katrine",
          lat: 56.2500, lng: -4.5000,
          type: "viewpoint",
          description: "The loch that inspired Sir Walter Scott's 'The Lady of the Lake'. Crystal clear water surrounded by forested hills. Quiet, beautiful, and surprisingly Caribbean-looking when the sun hits it."
        },
        {
          name: "Falls of Dochart, Killin",
          lat: 56.4688, lng: -4.3194,
          type: "waterfall",
          description: "Wide, dramatic rapids crashing through the centre of Killin village. Viewed from the old stone bridge — one of Scotland's most iconic waterfall scenes. Free to view, right beside the road. The cafe does good coffee."
        },
        {
          name: "Bridge of Orchy",
          lat: 56.5165, lng: -4.7484,
          type: "bridge",
          description: "Beautiful old stone humpback bridge over the River Orchy on the A82. One of the most photographed bridges in the Highlands — the single arch reflected in the dark river water with mountains behind. Pull into the hotel car park for the best view. The bridge dates from the 1750s military road era."
        },
        {
          name: "Rannoch Moor",
          lat: 56.6000, lng: -4.8000,
          type: "viewpoint",
          description: "50 square miles of empty, boggy moorland at 1,000ft. The A82 crosses it in a long, dramatic sweep. Desolate and beautiful — feels like the end of the world. Featured in Trainspotting and James Bond. Wind can be brutal on a sportbike."
        },
        {
          name: "Red Deer in Glencoe",
          lat: 56.6600, lng: -5.0200,
          type: "wildlife",
          description: "Red deer are everywhere in Glencoe. Herds graze right beside the road, especially early morning. Stags with full antlers in autumn are an incredible sight — but keep your distance."
        },
        {
          name: "Ballachulish Bridge",
          lat: 56.6815, lng: -5.1965,
          type: "bridge",
          description: "Modern bridge spanning the narrow strait of Loch Leven at the entrance to Glencoe. You ride straight over it on the A82 — the views either side are stunning. Loch Leven stretching east into the mountains, and the open water of Loch Linnhe to the west. Quick crossing but a memorable one, especially in evening light."
        },
        {
          name: "Three Sisters of Glencoe",
          lat: 56.6700, lng: -5.0300,
          type: "viewpoint",
          description: "Three dramatic mountain ridges dropping into the valley. THE classic Glencoe viewpoint. Pull into the layby and take it all in — this is Scotland at its most dramatic. Every biker who comes here stops in the same spot."
        },
        {
          name: "Glencoe Village",
          lat: 56.6823, lng: -5.1000,
          type: "landmark",
          description: "Small Highland village at the foot of the glen. The Glencoe Inn does excellent food and has a great beer garden. The folk museum tells the story of the 1692 massacre — dark history in a stunning setting."
        },
        {
          name: "Golden Eagles in Glencoe",
          lat: 56.6750, lng: -5.0500,
          type: "wildlife",
          description: "Glencoe is golden eagle territory. Scan the ridgeline of the Three Sisters and Aonach Eagach ridge. Early morning thermals bring them out hunting. Massive wingspan — once you see one, you'll never forget it."
        },
        {
          name: "Invercoe Campsite",
          lat: 56.6869, lng: -5.1086,
          type: "camp",
          description: "Right on the shore of Loch Leven with views straight into Glencoe. Wake up to one of the greatest mountain panoramas in Britain. Basic but atmospheric — the midges add character.",
          park4night: "https://park4night.com/en/search?lat=56.69&lng=-5.11"
        }
      ],
      roads: [
        {
          name: "A821 Duke's Pass",
          rating: 4,
          description: "Technical, tight bends through dense Trossachs forest. Great warm-up for the Highlands. The surface is good and the trees create a green tunnel effect."
        },
        {
          name: "A82 Rannoch Moor to Glencoe",
          rating: 5,
          description: "Sweeping across empty moorland then plunging into the dramatic valley of Glencoe. One of the world's great motorcycle roads. The descent into the glen is genuinely breathtaking."
        }
      ],
      route: [
        [55.5989, -2.7286], [55.7000, -2.8000], [55.8000, -3.0000],
        [55.9000, -3.2000], [55.9500, -3.5000], [55.9800, -3.7000],
        [56.0500, -3.9000], [56.1000, -4.1000], [56.1500, -4.2500],
        [56.2000, -4.4000], [56.2500, -4.5000], [56.3000, -4.4500],
        [56.3500, -4.4000], [56.4000, -4.3500], [56.4688, -4.3194],
        [56.5000, -4.4000], [56.5500, -4.5500], [56.5800, -4.7000],
        [56.6000, -4.8000], [56.6300, -4.9000], [56.6500, -4.9800],
        [56.6700, -5.0300], [56.6823, -5.1000], [56.6869, -5.1086]
      ],
      tips: "The A82 is single carriageway and carries a lot of tourist traffic in summer, including campervans doing 35mph. Be patient with overtaking — the road has blind crests. Fill up at Tyndrum — it's the last fuel before Glencoe. Midges are brutal at camp in summer — repellent and a head net are not optional."
    },

    // =====================================================
    // DAY 7 — Glencoe to Isle of Skye
    // =====================================================
    {
      day: 7,
      title: "Glencoe to Isle of Skye",
      distance: "~130 miles",
      duration: "~4-5 hrs riding + ferry",
      summary: "The single-track Skyfall road down Glen Etive, the famous Glenfinnan Viaduct, then the Road to the Isles to Mallaig for the ferry crossing to Skye. Arrive on the mystical island and ride to the Cuillin mountain viewpoint at Elgol. A day of pure Highland magic.",
      center: [56.95, -5.60],
      zoom: 8,
      region: "skye",
      mergeable: false,
      stops: [
        {
          name: "Glen Etive Single-Track Road",
          lat: 56.6200, lng: -5.0700,
          type: "road",
          description: "12 miles of single-track road down to Loch Etive — the Skyfall road where Bond's childhood home was set. Wild, remote, and stunning. Use passing places properly and watch for oncoming traffic on blind bends. The river pools halfway down are crystal clear."
        },
        {
          name: "Glenfinnan Viaduct",
          lat: 56.8761, lng: -5.4319,
          type: "landmark",
          description: "The iconic 21-arch viaduct from Harry Potter. The Jacobite steam train crosses it daily — check times and watch it from the hillside viewpoint. 10-min walk from the car park. Even if you don't care about wizards, it's a genuinely impressive piece of engineering.",
          url: "https://www.nts.org.uk/visit/places/glenfinnan-monument"
        },
        {
          name: "Glenfinnan Monument",
          lat: 56.8700, lng: -5.4400,
          type: "landmark",
          description: "Tower at the head of Loch Shiel marking where Bonnie Prince Charlie raised his standard in 1745. The view down Loch Shiel stretching to the horizon is one of Scotland's most iconic vistas."
        },
        {
          name: "A830 Road to the Isles",
          lat: 56.8900, lng: -5.5500,
          type: "road",
          description: "Historic road from Fort William to Mallaig. Beautiful coastal and lochside riding through classic Highland scenery. White sandy beaches appear when you least expect them. The road flows beautifully — enjoy every mile."
        },
        {
          name: "Mallaig Harbour",
          lat: 57.0063, lng: -5.8288,
          type: "ferry",
          description: "Working fishing harbour and the departure point for the CalMac ferry to Skye. Grab fish and chips at the harbour while you wait — the seafood here is landed that morning. The crossing takes about 30 minutes.",
          url: "https://www.calmac.co.uk/mallaig-armadale-skye-ferry-timetable"
        },
        {
          name: "Armadale Castle & Gardens",
          lat: 57.0625, lng: -5.8996,
          type: "castle",
          description: "Ruined Gothic castle and beautiful gardens on the Sleat peninsula. The Museum of the Isles tells the Clan Donald story. A gentle first stop on Skye before the wild riding begins.",
          url: "https://www.armadalecastle.com"
        },
        {
          name: "Elgol — Cuillin Viewpoint",
          lat: 57.1490, lng: -6.0940,
          type: "viewpoint",
          description: "The most dramatic viewpoint on Skye — the entire Black Cuillin mountain range reflected in Loch Scavaig. The road to Elgol is narrow and twisty but rideable on a sportbike. When you see the view, you'll understand why people call Skye magical."
        },
        {
          name: "Sligachan Campsite",
          lat: 57.2900, lng: -6.1700,
          type: "camp",
          description: "Legendary campsite at the foot of the Cuillin mountains beside the old stone bridge. The Sligachan Hotel bar serves excellent whisky and does hot meals. Basic camping with incredible mountain views. The midges here are notorious — arm yourself.",
          park4night: "https://park4night.com/en/search?lat=57.29&lng=-6.17"
        }
      ],
      roads: [
        {
          name: "Glen Etive Single Track",
          rating: 3,
          description: "Narrow single-track with passing places. Not fast, but the scenery is world-class. The Skyfall road. Watch for oncoming traffic on blind bends."
        },
        {
          name: "A830 Road to the Isles",
          rating: 4,
          description: "Beautiful Highland road with views over lochs, mountains, and white sand beaches. Flowing bends, good surface. Historic and atmospheric."
        },
        {
          name: "Elgol Road",
          rating: 4,
          description: "Twisty single-track through the most remote part of Skye's south coast. The reward at the end — the Cuillin panorama — is the best view on the island."
        }
      ],
      route: [
        [56.6869, -5.1086], [56.6700, -5.0800], [56.6500, -5.0700],
        [56.6200, -5.0700], [56.5800, -5.1000], [56.6200, -5.0700],
        [56.6700, -5.0500], [56.7200, -5.1000], [56.7800, -5.1100],
        [56.8200, -5.1500], [56.8500, -5.2500], [56.8700, -5.4000],
        [56.8761, -5.4319], [56.8900, -5.5500], [56.9200, -5.6500],
        [56.9500, -5.7200], [57.0063, -5.8288], [57.0625, -5.8996],
        [57.1000, -5.9500], [57.1490, -6.0940], [57.1200, -5.9500],
        [57.1800, -5.8600], [57.2400, -5.9400], [57.2700, -6.1000],
        [57.2900, -6.1700]
      ],
      ferryRoute: [
        [57.0063, -5.8288], [57.0200, -5.8450], [57.0400, -5.8700],
        [57.0550, -5.8850], [57.0637, -5.8924]
      ],
      tips: "Book the CalMac ferry in advance during summer — bike spaces are limited and fill up. Glen Etive is single track — be prepared for oncoming traffic and use passing places (pull left). Check Jacobite steam train times for the viaduct photo op. The Elgol road is narrow but perfectly rideable on a sportbike — just take it steady."
    },

    // =====================================================
    // DAY 8 — Isle of Skye Full Day
    // =====================================================
    {
      day: 8,
      title: "Isle of Skye Full Day",
      distance: "~100 miles",
      duration: "~4-5 hrs riding",
      summary: "A full day exploring the otherworldly landscapes of Skye. The Quiraing is a 5-star biking road through Jurassic scenery, the Old Man of Storr is iconic, and Talisker Distillery provides a well-earned dram. Every single mile on Skye feels like a different planet.",
      center: [57.45, -6.35],
      zoom: 9,
      region: "skye",
      mergeable: false,
      stops: [
        {
          name: "Old Man of Storr",
          lat: 57.5074, lng: -6.1834,
          type: "viewpoint",
          description: "Skye's most famous landmark — a 50m-tall pinnacle of rock rising from a bizarre landscape of collapsed cliffs. The walk up takes 45 mins but the views over the Sound of Raasay are unreal. You'll see it from the road first and it's already jaw-dropping."
        },
        {
          name: "Kilt Rock & Mealt Falls",
          lat: 57.6117, lng: -6.1722,
          type: "waterfall",
          description: "200ft sea cliff with vertical basalt columns resembling a kilt's pleats, with a waterfall dropping straight into the sea beside it. Free viewing platform right by the road. The sound of the falls crashing into the ocean is something else."
        },
        {
          name: "Brother's Point (Rubha nam Brathairean)",
          lat: 57.5966, lng: -6.1480,
          type: "viewpoint",
          description: "Hidden headland with spectacular views of the Trotternish Ridge and across to the mainland. A 30-min walk from the road through crofting land. Fewer tourists than the Storr, twice the atmosphere. Dinosaur footprints have been found on these rocks."
        },
        {
          name: "An Corran Dinosaur Footprints, Staffin",
          lat: 57.6500, lng: -6.2030,
          type: "fossil",
          description: "Real 170-million-year-old dinosaur footprints stamped into the rock platform at Staffin Beach. These Middle Jurassic tracks were left by ornithopod dinosaurs walking across a coastal lagoon. Visible at low tide — look for three-toed prints up to 50cm across in the flat rock. One of the most significant dinosaur sites in Scotland. Check tide times — they're underwater at high tide.",
          url: "https://www.staffindinosaurmuseum.com"
        },
        {
          name: "Staffin Dinosaur Museum",
          lat: 57.6350, lng: -6.2100,
          type: "fossil",
          description: "Tiny but fascinating museum run by local fossil hunter Dugald Ross, who has spent decades finding and preserving Skye's dinosaur heritage. Houses genuine dinosaur bones, footprint casts, and Jurassic fossils found along the Trotternish coast. Dugald's passion and knowledge make this a highlight — he'll walk you through every find. A few pounds entry. Right on the Trotternish Loop road.",
          url: "https://www.staffindinosaurmuseum.com"
        },
        {
          name: "Quiraing Road",
          lat: 57.6440, lng: -6.2635,
          type: "road",
          description: "THE best road on Skye and one of the best in Britain. A narrow, twisting road through an alien landscape of pinnacles, plateaus, and sheer cliffs. Feels like riding on another planet. The hairpin bends with 500ft drops are properly exciting on a sportbike. Do not rush this — savour every corner."
        },
        {
          name: "Fairy Glen",
          lat: 57.5856, lng: -6.3380,
          type: "landmark",
          description: "A miniature landscape of grassy cone-shaped hills near Uig. Looks like something from a fantasy film. Small and easy to miss — follow signs from Uig village. Worth 20 minutes of wandering around feeling like you've shrunk."
        },
        {
          name: "Fairy Pools",
          lat: 57.2500, lng: -6.2700,
          type: "viewpoint",
          description: "Crystal-clear pools and waterfalls at the foot of the Cuillin mountains. The water is absurdly blue on a sunny day. Popular swimming spot for the brave — it's absolutely freezing, even in August. 20-min walk from the car park."
        },
        {
          name: "Neist Point Lighthouse",
          lat: 57.4233, lng: -6.7888,
          type: "viewpoint",
          description: "Skye's most westerly point with a dramatic clifftop lighthouse. The walk out along the cliff edge is spectacular. On a clear day you can see the Outer Hebrides. Dolphins and minke whales are sometimes spotted from here."
        },
        {
          name: "Talisker Distillery",
          lat: 57.3024, lng: -6.3562,
          type: "distillery",
          description: "Skye's only single malt whisky distillery, producing the famous peaty, peppery Talisker since 1830. Take the tour if you have time — the tasting at the end is excellent. Buy a bottle for the tent. Just remember you're riding.",
          url: "https://www.malts.com/en-gb/distilleries/talisker"
        },
        {
          name: "Sligachan Old Bridge",
          lat: 57.2900, lng: -6.1720,
          type: "bridge",
          description: "Historic stone bridge with the Black Cuillin mountains towering behind it. One of the most photographed spots in Scotland. Legend says washing your face in the river beneath grants eternal beauty. Worth a try."
        },
        {
          name: "Dunvegan Castle",
          lat: 57.4474, lng: -6.5871,
          type: "castle",
          description: "The oldest continuously inhabited castle in Scotland — 800 years of Clan MacLeod history. The gardens are beautiful and the castle cafe does great cake. Boat trips from the castle to see the seal colony are popular.",
          url: "https://www.dunvegancastle.com"
        },
        {
          name: "Sea Eagles on Skye",
          lat: 57.5000, lng: -6.3000,
          type: "wildlife",
          description: "Skye is one of the best places in Britain to see white-tailed sea eagles. These massive birds have 8ft wingspans and hunt along the coast. Look for them soaring over Portree Bay or the Trotternish Ridge. You'll know one when you see it."
        },
        {
          name: "Staffin Campsite",
          lat: 57.6400, lng: -6.2100,
          type: "camp",
          description: "Simple campsite near the Quiraing with views over Staffin Bay to the mainland mountains. Hot showers and a shop. Fall asleep listening to the sea. Wake up surrounded by Jurassic landscape. Perfect base for the Trotternish.",
          park4night: "https://park4night.com/en/search?lat=57.64&lng=-6.21"
        }
      ],
      roads: [
        {
          name: "Quiraing Road",
          rating: 5,
          description: "Narrow, twisting road through alien pinnacle landscape with sheer drops. One of Britain's most spectacular roads. Every corner reveals something more dramatic than the last."
        },
        {
          name: "Trotternish Loop",
          rating: 4,
          description: "Full loop of the Trotternish Peninsula taking in Storr, Kilt Rock, Quiraing, and Uig. Consistently stunning coastal and mountain scenery. A complete day's riding in itself."
        }
      ],
      route: [
        [57.2900, -6.1700], [57.2500, -6.2700], [57.2900, -6.1700],
        [57.3024, -6.3562], [57.3500, -6.4500], [57.4000, -6.5500],
        [57.4474, -6.5871], [57.4300, -6.7000], [57.4233, -6.7888],
        [57.4474, -6.5871], [57.5000, -6.4000], [57.5500, -6.3500],
        [57.5856, -6.3380], [57.6200, -6.3000], [57.6440, -6.2635],
        [57.6400, -6.2100], [57.6117, -6.1722], [57.5966, -6.1480],
        [57.5500, -6.1600], [57.5074, -6.1834], [57.4500, -6.1900],
        [57.5500, -6.1800], [57.6000, -6.2000], [57.6400, -6.2100]
      ],
      tips: "Skye roads are narrow and busy in summer. Campervans are your nemesis — be patient. The Quiraing road can be single-track in places with steep drops. Fuel up in Portree — it's the only town with reliable fuel on the island. Talisker distillery does tours but book online first. If the weather is clear, prioritise Neist Point and the Quiraing."
    },

    // =====================================================
    // DAY 9 — Skye to Applecross
    // =====================================================
    {
      day: 9,
      title: "Skye to Applecross",
      distance: "~110 miles",
      duration: "~4 hrs riding",
      summary: "Leave Skye via the bridge, pass the fairy-tale Eilean Donan Castle, then tackle the Bealach na Ba — the highest road pass in Britain and one of the most thrilling motorcycle roads anywhere. Alpine-style hairpins climbing to 2,053ft with views to die for. Finish at the remote Applecross Bay.",
      center: [57.35, -5.75],
      zoom: 9,
      region: "nc500-north",
      mergeable: false,
      stops: [
        {
          name: "Skye Bridge",
          lat: 57.2731, lng: -5.7459,
          type: "bridge",
          description: "Farewell to Skye. The bridge is free to cross and takes about 30 seconds, but the views of the Cuillin mountains behind you and the mainland ahead are worth a last glance. Stop at the viewpoint on the mainland side."
        },
        {
          name: "Eilean Donan Castle",
          lat: 57.2741, lng: -5.5160,
          type: "castle",
          description: "Scotland's most photographed castle, sitting on a tiny island where three sea lochs meet. Featured in Highlander and James Bond. The approach from Skye is stunning. Even if you don't go inside, the roadside view is a must-stop. Arrive early to beat the coach parties.",
          url: "https://www.eileandonancastle.com"
        },
        {
          name: "Loch Carron Viewpoint",
          lat: 57.3844, lng: -5.5080,
          type: "viewpoint",
          description: "Panoramic layby overlooking Loch Carron with mountains plunging into the sea loch. The colours change dramatically with the weather — moody greys to brilliant blues. Stop and breathe it in before the big climb."
        },
        {
          name: "Bealach na Ba (Pass of the Cattle)",
          lat: 57.4167, lng: -5.7250,
          type: "road",
          description: "THE hardest road in the UK. 2,053ft of Alpine-style hairpins with gradients hitting 20%. The steepest sections will have your clutch hand screaming. Views from the summit across to Skye and the Outer Hebrides are genuinely world-class. Not for the faint-hearted on a loaded sportbike — but absolutely unmissable."
        },
        {
          name: "Applecross Bay",
          lat: 57.4340, lng: -5.8130,
          type: "beach",
          description: "Stunning remote bay on the west coast. White sand, crystal clear water, views to Skye and Raasay. After the intensity of the Bealach, arriving here feels like reaching paradise. One of the most beautiful beaches on mainland Scotland."
        },
        {
          name: "Applecross Inn",
          lat: 57.4338, lng: -5.8120,
          type: "pub",
          description: "Famous wee pub right on the shore at Applecross. Legendary locally-caught seafood — the prawns and scallops are unbelievable. Bikers are warmly welcome. Book a table if you can or eat at the bar. This might be the best pub meal of the entire trip.",
          url: "https://www.applecross.uk.com/inn"
        },
        {
          name: "Sand Bay Beach",
          lat: 57.4600, lng: -5.7700,
          type: "beach",
          description: "Tiny hidden beach just north of Applecross village. White sand, turquoise water, often completely empty. Accessed via a short walk from the coast road. Feels more like Thailand than Scotland on a sunny day."
        },
        {
          name: "Applecross Campsite",
          lat: 57.4350, lng: -5.8100,
          type: "camp",
          description: "Beachside campsite at Applecross with views across to Skye. The sound of waves lapping the shore sends you to sleep. Basic facilities but the location is hard to beat anywhere in Britain. The Applecross Inn is a 2-minute walk.",
          park4night: "https://park4night.com/en/search?lat=57.44&lng=-5.81"
        }
      ],
      roads: [
        {
          name: "Bealach na Ba",
          rating: 5,
          description: "Britain's highest road pass at 2,053ft. Alpine hairpins, 20% gradients, single track in places. Absolutely thrilling on a sportbike. The summit views are among the best in Scotland. This is THE road of the NC500."
        },
        {
          name: "Coast Road Applecross to Shieldaig",
          rating: 4,
          description: "Narrow, winding coastal road with sea views the entire way. Less dramatic than the Bealach but beautifully remote. Single-track with passing places — ride it for the views, not the speed."
        }
      ],
      route: [
        [57.6400, -6.2100], [57.5500, -6.1800], [57.4500, -6.1900],
        [57.3500, -6.1800], [57.2900, -6.1700], [57.2731, -5.7459],
        [57.2741, -5.5160], [57.3000, -5.5000], [57.3500, -5.5000],
        [57.3844, -5.5080], [57.4000, -5.5500], [57.4100, -5.6500],
        [57.4167, -5.7250], [57.4250, -5.7800], [57.4340, -5.8130],
        [57.4600, -5.7700], [57.4350, -5.8100]
      ],
      tips: "The Bealach na Ba has a warning sign at the bottom — 'Road normally impassable in wintry conditions'. In summer it's rideable but intense. Low gear, smooth clutch control, wide lines on the hairpins. The GSX-R's weight will be felt. The coast road north from Applecross to Shieldaig is beautiful but adds miles — check fuel first."
    },

    // =====================================================
    // DAY 10 — Applecross to Durness
    // =====================================================
    {
      day: 10,
      title: "Applecross to Durness",
      distance: "~150 miles",
      duration: "~5-6 hrs riding",
      summary: "Epic NC500 day through some of Scotland's most dramatic coastal scenery. Torridon's massive mountains, turquoise Gruinard Bay, the charming harbour town of Ullapool, the haunting ruins of Ardvreck Castle, and the mysterious Smoo Cave. This is the wild north-west at its finest.",
      center: [57.90, -5.20],
      zoom: 8,
      region: "nc500-north",
      mergeable: true,
      stops: [
        {
          name: "Shieldaig Village",
          lat: 57.5170, lng: -5.6450,
          type: "landmark",
          description: "Tiny whitewashed village on the shore of Loch Torridon. Perfectly picturesque Highland scene — colourful houses reflected in the loch. The village shop sells good coffee and local produce. Quick photo stop."
        },
        {
          name: "Upper Loch Torridon Viewpoint",
          lat: 57.5500, lng: -5.5900,
          type: "viewpoint",
          description: "Jaw-dropping layby viewpoint overlooking the upper reaches of Loch Torridon with the massive Torridon mountains rising straight from the water. The scale of the landscape here is humbling — mountains over 3,000ft dropping to sea level."
        },
        {
          name: "Torridon Mountains",
          lat: 57.5500, lng: -5.5000,
          type: "viewpoint",
          description: "Liathach and Beinn Eighe are among Scotland's most dramatic mountains — ancient sandstone peaks with quartzite caps that look snow-covered even in summer. The road beneath them makes you feel very small on a motorbike."
        },
        {
          name: "Beinn Eighe Nature Reserve",
          lat: 57.6000, lng: -5.4000,
          type: "wildlife",
          description: "Britain's first National Nature Reserve. Ancient Caledonian pine forest that's home to pine martens, wildcats, and golden eagles. The pine martens are elusive but if you camp nearby, they sometimes visit at dusk. Keep food locked away.",
          url: "https://www.nature.scot/enjoying-outdoors/scotlands-national-nature-reserves/beinn-eighe-and-loch-maree-islands"
        },
        {
          name: "Knockan Crag Geological Trail",
          lat: 58.1000, lng: -5.0400,
          type: "fossil",
          description: "One of the most important geological sites on Earth. This is where the Moine Thrust was discovered in the 1850s — proving that older rocks could be pushed on top of younger ones, rewriting geology forever. The exposed rock face shows 3-billion-year-old Lewisian Gneiss (some of the oldest rock on the planet) sitting on top of 500-million-year-old limestone. A short walking trail with sculptures and interpretation boards. Free to visit, right on the A835. You're literally touching rocks older than almost anything else on Earth.",
          url: "https://www.nature.scot/enjoying-outdoors/scotlands-national-nature-reserves/knockan-crag"
        },
        {
          name: "Gruinard Bay",
          lat: 57.8500, lng: -5.5500,
          type: "beach",
          description: "Stunning bay with turquoise water and white sand beaches backed by mountains. Looks more like the Caribbean than the Scottish Highlands. Gruinard Island offshore was used for anthrax testing in WWII — it's now been decontaminated. The beach is gorgeous and usually empty."
        },
        {
          name: "Corrieshalloch Gorge",
          lat: 57.7529, lng: -5.0350,
          type: "waterfall",
          description: "150ft waterfall plunging into a deep box canyon. Viewed from a Victorian suspension bridge that sways over the gorge — vertigo sufferers beware. Quick stop right off the A835. The spray from below creates its own microclimate of ferns.",
          url: "https://www.nts.org.uk/visit/places/corrieshalloch-gorge"
        },
        {
          name: "Ullapool Harbour",
          lat: 57.8960, lng: -5.1600,
          type: "landmark",
          description: "Charming wee fishing town and the gateway to the far north-west. Good fuel stop, excellent seafood restaurants, and a lively pub scene. The Ceilidh Place is worth a visit. Stock up on supplies here — shops get very scarce further north."
        },
        {
          name: "Kylesku Bridge",
          lat: 58.2550, lng: -5.0210,
          type: "bridge",
          description: "One of the most photographed bridges on the NC500. A graceful curved concrete bridge sweeping over Loch a' Chairn Bhain with mountains dropping straight into the sea loch on both sides. The views from the bridge are extraordinary — look down into crystal-clear water where seals often swim below. Pull into the layby on the north side for the classic postcard shot. An engineering marvel in an impossibly beautiful setting.",
          url: "https://www.northcoast500.com"
        },
        {
          name: "Ardvreck Castle",
          lat: 58.1564, lng: -4.9887,
          type: "castle",
          description: "Haunting 15th-century castle ruin on a rocky promontory jutting into Loch Assynt. Reportedly haunted by the ghost of a woman who threw herself from the tower. The reflections in the loch on a calm day are incredible. Free to visit — just walk across the grass."
        },
        {
          name: "Bone Caves (Allt nan Uamh)",
          lat: 58.1600, lng: -4.9300,
          type: "landmark",
          description: "Ancient caves where the bones of lynx, brown bears, and polar bears have been found — dating back 47,000 years. Short uphill walk from the road. The limestone landscape around here is some of the oldest rock on Earth, over 3 billion years old."
        },
        {
          name: "Smoo Cave",
          lat: 58.5614, lng: -4.7268,
          type: "landmark",
          description: "Massive sea cave with an inner freshwater waterfall — the largest cave entrance in mainland Britain. Walkable into the first chamber freely. Boat trips go deeper into the cave to see the waterfall. An eerie and unforgettable spot.",
          url: "https://www.smoocave.org"
        },
        {
          name: "Sango Sands Campsite, Durness",
          lat: 58.5600, lng: -4.7300,
          type: "camp",
          description: "Spectacular clifftop campsite overlooking Sango Bay — widely considered one of the best campsite locations in Britain. Fall asleep to the sound of Atlantic waves crashing on the rocks below. Hot showers and a small shop. The view from your tent will blow your mind.",
          park4night: "https://park4night.com/en/search?lat=58.56&lng=-4.73"
        }
      ],
      roads: [
        {
          name: "A896 Torridon Coast Road",
          rating: 4,
          description: "Winding single-track road beneath the massive Torridon mountains with sea loch views. Dramatic, remote, and very Scottish. Take it steady and enjoy the scale."
        },
        {
          name: "A835 Ullapool Road",
          rating: 3,
          description: "Main road north to Ullapool. Well-surfaced and flowing. Not as twisty as the coast roads but good progress with mountain views."
        },
        {
          name: "A894 Kylesku Road",
          rating: 4,
          description: "Remote road through the Assynt region. Empty, winding, with views over Loch Assynt and the mountains. The kind of road where you don't see another vehicle for 20 minutes."
        }
      ],
      route: [
        [57.4350, -5.8100], [57.4700, -5.7200], [57.5000, -5.6700],
        [57.5170, -5.6450], [57.5500, -5.5900], [57.5500, -5.5000],
        [57.6000, -5.4000], [57.6500, -5.5000], [57.7200, -5.6000],
        [57.8000, -5.5800], [57.8500, -5.5500], [57.8300, -5.3000],
        [57.7529, -5.0350], [57.8000, -5.1000], [57.8960, -5.1600],
        [57.9500, -5.1000], [58.0500, -5.0000], [58.1000, -4.9900],
        [58.1564, -4.9887], [58.1600, -4.9300], [58.3000, -4.8500],
        [58.4500, -4.7800], [58.5614, -4.7268], [58.5600, -4.7300]
      ],
      tips: "Fuel up at Ullapool — the next reliable fuel is at Durness or Tongue. The north-west Highlands are genuinely remote; phone signal is patchy at best. If it rains (when it rains), the Torridon roads can be greasy. Smoo Cave is free to enter the first chamber. The Sango Sands campsite is exposed to Atlantic gales — stake your tent properly."
    },

    // =====================================================
    // DAY 11 — Durness to John O'Groats
    // =====================================================
    {
      day: 11,
      title: "Durness to John O'Groats",
      distance: "~120 miles",
      duration: "~4-5 hrs riding",
      summary: "Ride the wild north coast from Durness to John O'Groats — mainland Britain's top edge. Pass deserted beaches, the actual northernmost point at Dunnet Head (not John O'Groats!), and the Queen Mother's Castle of Mey. Finish at the famous signpost with the dramatic Duncansby sea stacks nearby.",
      center: [58.55, -4.10],
      zoom: 8,
      region: "nc500-north",
      mergeable: true,
      stops: [
        {
          name: "Durness Beach (Balnakeil Bay)",
          lat: 58.5770, lng: -4.7650,
          type: "beach",
          description: "Stunning white sand beach with turquoise water just west of Durness. The old Balnakeil Church is worth a look — 8th century origins. The beach stretches for nearly a mile and you'll likely have it to yourself. Scotland's answer to the Maldives, minus the temperature."
        },
        {
          name: "Cape Wrath Viewpoint",
          lat: 58.6255, lng: -4.9997,
          type: "viewpoint",
          description: "The most north-westerly point of mainland Britain. NOT accessible by motorbike — requires a ferry across the Kyle of Durness then a minibus. If you have time, it's a worthy half-day detour. The cliffs here are 900ft high. If you can't make it, Sandwood Bay (4-mile hike) offers similarly wild coastal scenery."
        },
        {
          name: "Tongue Village",
          lat: 58.4750, lng: -4.4250,
          type: "landmark",
          description: "Tiny village overlooking the Kyle of Tongue with the ruins of Castle Varrich above. The causeway across the Kyle is a scenic route. The tongue of land gives this quirky-named village its name. Good place for a tea stop."
        },
        {
          name: "Ben Hope Viewpoint",
          lat: 58.3917, lng: -4.6000,
          type: "viewpoint",
          description: "Scotland's most northerly Munro (3,041ft). You don't need to climb it — the roadside views of this isolated mountain rising from the moorland are impressive enough from the saddle. It's a lonely, dramatic peak."
        },
        {
          name: "Bettyhill & Strathnaver Museum",
          lat: 58.5276, lng: -4.2195,
          type: "landmark",
          description: "Small village with a powerful museum telling the story of the Highland Clearances. Heavy but important history. The village sits on a beautiful stretch of coast — the beach is lovely and usually deserted.",
          url: "https://www.strathnavermuseum.org.uk"
        },
        {
          name: "Dunnet Head",
          lat: 58.6712, lng: -3.3724,
          type: "viewpoint",
          description: "The ACTUAL most northerly point of mainland Britain — NOT John O'Groats (that's a common myth). The lighthouse-capped headland has dramatic clifftop views to Orkney. Puffins nest here in summer. Ride out to the end of the peninsula and stand at the very top of Britain."
        },
        {
          name: "Castle of Mey",
          lat: 58.6380, lng: -3.2250,
          type: "castle",
          description: "The Queen Mother's beloved Scottish retreat. Beautiful walled gardens and a surprisingly modest castle. She spent summers here from the 1950s until her death in 2002. The gardens shelter from the fierce Caithness winds. Open to visitors in season.",
          url: "https://www.castleofmey.org.uk"
        },
        {
          name: "John O'Groats",
          lat: 58.6439, lng: -3.0687,
          type: "landmark",
          description: "The famous signpost marking (almost) the north-east tip of Britain. Get your photo at the sign showing 874 miles to Land's End. The town itself is a bit touristy but the signpost moment matters. You've ridden here from Guernsey — that's an achievement to celebrate."
        },
        {
          name: "Duncansby Head & Sea Stacks",
          lat: 58.6436, lng: -3.0256,
          type: "viewpoint",
          description: "Just east of John O'Groats and FAR more dramatic. Towering sea stacks rising from the ocean, massive cliff formations, and puffin colonies in summer. A short walk from the car park. This is the real highlight — don't skip it for the signpost."
        },
        {
          name: "John O'Groats Campsite",
          lat: 58.6430, lng: -3.0700,
          type: "camp",
          description: "Simple campsite within walking distance of the famous signpost. Decent facilities, exposed to the wind (it's the top of Britain, after all). The pub in the hotel does reasonable food. Wake up knowing you've reached the furthest point.",
          park4night: "https://park4night.com/en/search?lat=58.64&lng=-3.07"
        }
      ],
      roads: [
        {
          name: "A838 North Coast",
          rating: 4,
          description: "Wild, remote coastal road along the very top of Britain. Empty moorland, deserted beaches, and vast Atlantic views. Single-track in places with proper Highland character."
        },
        {
          name: "A836 Tongue to Thurso",
          rating: 3,
          description: "Undulating road across the Caithness Flow Country. Flatter and straighter than the west coast but still remote. Peat bogs stretch to the horizon."
        }
      ],
      route: [
        [58.5600, -4.7300], [58.5770, -4.7650], [58.5600, -4.7300],
        [58.5400, -4.6000], [58.5000, -4.5000], [58.4750, -4.4250],
        [58.3917, -4.6000], [58.4750, -4.4250], [58.5276, -4.2195],
        [58.5500, -4.0000], [58.5800, -3.8000], [58.6000, -3.6000],
        [58.6200, -3.5000], [58.6500, -3.4000], [58.6712, -3.3724],
        [58.6380, -3.2250], [58.6439, -3.0687], [58.6436, -3.0256],
        [58.6430, -3.0700]
      ],
      tips: "The north coast road is exposed to fierce winds — crosswinds on a sportbike can be brutal, especially on the open moorland sections. Fuel up at Tongue or Bettyhill. Dunnet Head is the true most northerly point — make sure you ride out there. The Duncansby sea stacks are a short walk and far more impressive than the John O'Groats signpost."
    },

    // =====================================================
    // DAY 12 — John O'Groats to Inverness
    // =====================================================
    {
      day: 12,
      title: "John O'Groats to Inverness",
      distance: "~130 miles",
      duration: "~4-5 hrs riding",
      summary: "South along the east coast towards Inverness. The fairy-tale Dunrobin Castle, dolphin watching at Chanonry Point, the eerie Clootie Well, and the hallowed ground of Culloden Battlefield. A day of contrasts — beautiful coastline and powerful history.",
      center: [58.05, -3.70],
      zoom: 8,
      region: "nc500-east",
      mergeable: true,
      stops: [
        {
          name: "Whaligoe Steps",
          lat: 58.3222, lng: -3.1200,
          type: "viewpoint",
          description: "365 flagstone steps carved into a sheer cliff face down to a tiny harbour. Built by herring fishermen in the 18th century. The descent is steep and slightly terrifying. The cafe at the top does great soup. Don't look down if you're not good with heights."
        },
        {
          name: "Dunbeath Castle",
          lat: 58.2467, lng: -3.4267,
          type: "castle",
          description: "Dramatic clifftop castle overlooking the North Sea. Privately owned so can't go inside, but the roadside view of it perched on the cliff edge is striking. The heritage centre in Dunbeath village tells the local story."
        },
        {
          name: "Brora Beach",
          lat: 58.0096, lng: -3.8547,
          type: "beach",
          description: "Long sandy beach on the east coast. Less famous than the west coast beaches but equally beautiful on a good day. The golf course runs alongside — watch for stray balls. Good spot for a leg stretch after the ride from John O'Groats."
        },
        {
          name: "Dunrobin Castle",
          lat: 57.9802, lng: -3.9465,
          type: "castle",
          description: "Fairy-tale French château transported to the Scottish coast — 189 rooms, conical turrets, and magnificent formal gardens dropping to the sea. The falconry display in the gardens is excellent. One of the most visually stunning buildings in Scotland.",
          url: "https://www.dunrobincastle.co.uk"
        },
        {
          name: "Dornoch Town",
          lat: 57.8800, lng: -4.0269,
          type: "landmark",
          description: "Charming wee town with a beautiful 13th-century cathedral and a world-famous golf course. Madonna chose to christen her son here. Good cafe scene and craft shops. The beach south of town is gorgeous."
        },
        {
          name: "Tarbat Ness Lighthouse",
          lat: 57.8650, lng: -3.7767,
          type: "viewpoint",
          description: "Tall red-and-white striped lighthouse at the tip of the Tarbat Ness peninsula. Great views across the Moray Firth — dolphins are often spotted from here. The ride out along the peninsula is pleasant and quiet."
        },
        {
          name: "Cromarty Firth Dolphins",
          lat: 57.6900, lng: -4.0400,
          type: "wildlife",
          description: "The Moray Firth has the most northerly population of bottlenose dolphins in the world. The Cromarty Firth is a regular feeding ground. Watch from the roadside — you can sometimes see them from the bridge."
        },
        {
          name: "Hugh Miller Museum, Cromarty",
          lat: 57.6811, lng: -4.0362,
          type: "fossil",
          description: "Birthplace of Hugh Miller, the Victorian stonemason who became one of Scotland's greatest geologists. He discovered extraordinary 385-million-year-old Devonian fish fossils in the local sandstone — armoured fish, lungfish, and bizarre creatures that predate dinosaurs by 150 million years. The museum displays his original fossil collection and geological tools. The cottage is beautifully preserved. 10-minute detour off the A832 to the charming town of Cromarty on the Black Isle.",
          url: "https://www.nts.org.uk/visit/places/hugh-millers-birthplace"
        },
        {
          name: "Chanonry Point Dolphin Watching",
          lat: 57.5728, lng: -4.0939,
          type: "wildlife",
          description: "THE best dolphin watching spot in Britain. At certain tides, bottlenose dolphins come within metres of the shore to hunt salmon. Mid-tide on a rising tide is the magic time. You might wait 30 minutes or see them immediately. Bring binoculars.",
          url: "https://www.dolphinspace.org"
        },
        {
          name: "Clootie Well",
          lat: 57.5533, lng: -4.4594,
          type: "landmark",
          description: "One of Scotland's eeriest sites — an ancient healing well surrounded by thousands of rags and cloth strips tied to the trees by visitors seeking cures. The atmosphere is genuinely unsettling. Pagan tradition meets Highland superstition. Don't remove any of the cloths."
        },
        {
          name: "Kessock Bridge",
          lat: 57.5003, lng: -4.2422,
          type: "bridge",
          description: "Cable-stayed bridge spanning the Beauly Firth at the gateway to Inverness. 1,056m of sleek modern engineering with views across to the Black Isle and the Moray Firth. Dolphins are sometimes spotted from the bridge — keep one eye on the water. You ride straight over it on the A9 heading into the Highland capital."
        },
        {
          name: "Culloden Battlefield",
          lat: 57.4772, lng: -4.0937,
          type: "landmark",
          description: "Site of the last pitched battle on British soil in 1746. The moor is remarkably unchanged. Walk among the clan grave markers and feel the weight of history. The visitor centre is excellent and deeply moving. This place changed Scotland forever.",
          url: "https://www.nts.org.uk/visit/places/culloden"
        },
        {
          name: "Bught Park Campsite, Inverness",
          lat: 57.4672, lng: -4.2394,
          type: "camp",
          description: "Urban campsite right by the River Ness, within walking distance of Inverness city centre. Hot showers, laundry facilities, and close to shops and restaurants. The Hootananny pub on the high street does live music and great food.",
          park4night: "https://park4night.com/en/search?lat=57.47&lng=-4.24"
        }
      ],
      roads: [
        {
          name: "A9 East Coast Road",
          rating: 3,
          description: "Main road south along the coast. Well-surfaced and fairly fast. Not the most exciting road but the coastal views and castle stops make it worthwhile."
        },
        {
          name: "A862 Black Isle",
          rating: 3,
          description: "Pleasant road through the Black Isle peninsula. Rolling farmland with Moray Firth views. A gentle ride between the dramatic stuff."
        }
      ],
      route: [
        [58.6430, -3.0700], [58.5500, -3.1000], [58.4500, -3.1200],
        [58.3222, -3.1200], [58.2467, -3.4267], [58.1000, -3.6000],
        [58.0096, -3.8547], [57.9802, -3.9465], [57.8800, -4.0269],
        [57.8650, -3.7767], [57.8000, -4.0000], [57.6900, -4.0400],
        [57.5728, -4.0939], [57.5533, -4.4594], [57.5000, -4.2500],
        [57.4772, -4.0937], [57.4672, -4.2394]
      ],
      tips: "The east coast is less dramatic than the west but has its own quieter charm. Time your Chanonry Point visit to coincide with a rising mid-tide for the best dolphin chance. Culloden is free to walk the battlefield — the visitor centre charges but is excellent. Inverness has all the shops and supplies you might need — restock here for the Cairngorms."
    },

    // =====================================================
    // DAY 13 — Inverness to Cairngorms
    // =====================================================
    {
      day: 13,
      title: "Inverness to Cairngorms",
      distance: "~100 miles",
      duration: "~3-4 hrs riding",
      summary: "From the capital of the Highlands along the mysterious Loch Ness to the ancient Cairngorms. Visit Urquhart Castle, ride the B862 south Loch Ness road, meet Britain's only reindeer herd, and finish at a highland beach in the mountains. A day of lochs, legends, and wildlife.",
      center: [57.20, -4.20],
      zoom: 9,
      region: "scotland-return",
      mergeable: true,
      stops: [
        {
          name: "Loch Ness & Urquhart Castle",
          lat: 57.3225, lng: -4.4419,
          type: "castle",
          description: "The iconic castle ruin overlooking Loch Ness. Dramatically perched on a headland with 1,000 years of turbulent history. The views down the loch are incredible — keep one eye out for Nessie. The Grant Tower gives panoramic views across the water.",
          url: "https://www.historicenvironment.scot/visit-a-place/places/urquhart-castle/"
        },
        {
          name: "Invermoriston Bridge",
          lat: 57.2146, lng: -4.6172,
          type: "bridge",
          description: "Thomas Telford's elegant stone arch bridge from 1813, spanning the River Moriston in a lush wooded gorge. The old bridge sits beside the modern road bridge — park up and walk down to the original. The river crashes through a rocky gorge below with a dramatic waterfall visible from the bridge. One of the most atmospheric old bridges in the Highlands, often missed by tourists racing to Loch Ness."
        },
        {
          name: "Fort Augustus Locks",
          lat: 57.1440, lng: -4.6800,
          type: "landmark",
          description: "Flight of locks on the Caledonian Canal where boats climb between Loch Ness and Loch Oich. Watch the boats negotiate the locks while eating fish and chips from the canal-side cafe. A surprisingly relaxing spot in the heart of the Great Glen."
        },
        {
          name: "Cairngorm Mountain Viewpoint",
          lat: 57.1157, lng: -3.6401,
          type: "viewpoint",
          description: "At 4,085ft, Cairn Gorm is Britain's sixth highest mountain. The funicular railway takes you to the Ptarmigan restaurant near the summit, but the view from the car park at the base station is already spectacular. Arctic-alpine landscape that looks like Norway."
        },
        {
          name: "Cairngorm Reindeer Herd",
          lat: 57.1300, lng: -3.6700,
          type: "wildlife",
          description: "Britain's only free-ranging reindeer herd, introduced from Sweden in 1952. Daily guided hill visits let you walk among them — they're remarkably tame. A surreal experience seeing reindeer roaming a Scottish hillside. Book in advance.",
          url: "https://www.cairngormreindeer.co.uk"
        },
        {
          name: "Loch Morlich Beach",
          lat: 57.1600, lng: -3.6900,
          type: "beach",
          description: "A proper sandy beach at 1,000ft in the Cairngorm mountains. Backed by ancient pine forest with the Cairngorm plateau looming above. The water is crystal clear and absolutely freezing. Looks like it belongs in Canada. Perfect for a photo with the bike."
        },
        {
          name: "Rothiemurchus Forest Red Squirrels",
          lat: 57.1500, lng: -3.7800,
          type: "wildlife",
          description: "Ancient Caledonian pine forest that's a stronghold for red squirrels, Scottish crossbills, and crested tits. Walk the forest trails and you'll almost certainly see red squirrels — they're everywhere here, especially around the visitor centre feeders."
        },
        {
          name: "Highland Wildlife Park",
          lat: 57.0980, lng: -4.0110,
          type: "wildlife",
          description: "Drive-through wildlife park with polar bears, Scottish wildcats, red pandas, and Highland cattle. A great rainy-day option. The polar bear enclosure is impressive — the bears are surprisingly active in Scottish weather.",
          url: "https://www.highlandwildlifepark.org.uk"
        },
        {
          name: "Dalwhinnie Distillery",
          lat: 56.9331, lng: -4.2450,
          type: "distillery",
          description: "The highest distillery in Scotland at 1,164ft. Produces a gentle, honey-sweet Highland malt. The visitor centre tour is excellent and the tasting includes exclusive distillery-only bottlings. Buy a bottle — you'll want it at camp tonight.",
          url: "https://www.malts.com/en-gb/distilleries/dalwhinnie"
        },
        {
          name: "Falls of Truim",
          lat: 56.9500, lng: -4.2100,
          type: "waterfall",
          description: "Pretty waterfall on the River Truim, just off the A9. Short walk from a layby. Often missed by tourists heading to more famous falls, which means you'll likely have it to yourself. The gorge below is impressive after heavy rain."
        },
        {
          name: "Carrbridge Old Packhorse Bridge",
          lat: 57.2803, lng: -3.8293,
          type: "bridge",
          description: "The oldest stone bridge in the Highlands, built in 1717. The arch is partially collapsed and dramatically spans the River Dulnain like a stone rainbow. It was built to allow funeral processions to cross the river to Duthil churchyard. The crumbling arch reflected in the dark peaty water is one of the most photographed sights in the Cairngorms. Only a 10-minute detour off the A9 — don't skip it."
        },
        {
          name: "Laggan Dam",
          lat: 56.9800, lng: -4.5900,
          type: "viewpoint",
          description: "Huge dam on the River Spean surrounded by forested mountains. The road across the dam gives great views up and down the valley. Built in the 1930s for hydroelectric power — the engineering is impressive."
        },
        {
          name: "Glenmore Campsite, Cairngorms",
          lat: 57.1650, lng: -3.6700,
          type: "camp",
          description: "Forestry campsite in ancient pine forest near Loch Morlich. Red squirrels visit the pitches. Hot showers, sheltered by the trees, and the beach is a 5-minute walk. The closest you can camp to the Cairngorm plateau. Peaceful and atmospheric.",
          park4night: "https://park4night.com/en/search?lat=57.17&lng=-3.67"
        }
      ],
      roads: [
        {
          name: "B862 South Loch Ness Road",
          rating: 4,
          description: "The 'other' Loch Ness road. Narrower, twistier, and far more scenic than the busy A82 on the north side. Runs along the south shore through forest with occasional glimpses of the loch. A hidden gem."
        },
        {
          name: "A9 Cairngorm Approach",
          rating: 3,
          description: "The main road through the Cairngorms. Well-surfaced dual carriageway in places. Not the most exciting road but the mountain scenery is spectacular and it covers distance quickly."
        }
      ],
      route: [
        [57.4672, -4.2394], [57.4000, -4.3500], [57.3225, -4.4419],
        [57.2500, -4.5500], [57.1440, -4.6800], [57.0500, -4.5500],
        [56.9800, -4.5900], [56.9331, -4.2450], [56.9500, -4.2100],
        [57.0000, -4.1000], [57.0500, -3.9500], [57.0980, -4.0110],
        [57.1500, -3.7800], [57.1300, -3.6700], [57.1157, -3.6401],
        [57.1600, -3.6900], [57.1650, -3.6700]
      ],
      tips: "The B862 along south Loch Ness is far better than the A82 for biking — less traffic, more bends, better views. Take it instead of the main road. Book the reindeer hill visit online in advance — they limit numbers. Dalwhinnie distillery is right on the A9, easy stop. The Cairngorms can be cold even in summer — bring a warm layer for the mountain viewpoint."
    },

    // =====================================================
    // DAY 14 — Cairngorms to Fort William / Final Day
    // =====================================================
    {
      day: 14,
      title: "Cairngorms to Fort William",
      distance: "~80 miles",
      duration: "~2-3 hrs riding",
      summary: "The final day — a short but spectacular ride through the Cairngorms to Fort William at the foot of Ben Nevis. The A86 Laggan Road is a brilliant biking road through empty Highland glens. Visit the Commando Memorial, walk to Scotland's second-highest waterfall, and toast the end of an epic trip at the Ben Nevis Inn.",
      center: [56.90, -4.80],
      zoom: 9,
      region: "scotland-return",
      mergeable: true,
      stops: [
        {
          name: "Newtonmore",
          lat: 57.0630, lng: -4.1200,
          type: "landmark",
          description: "Pleasant Highland town with the excellent Highland Folk Museum — outdoor museum with reconstructed township buildings. Good cafe scene and a last chance for a cooked breakfast before hitting the road west."
        },
        {
          name: "Laggan Village",
          lat: 56.9800, lng: -4.3800,
          type: "landmark",
          description: "Tiny village that served as the setting for TV's Monarch of the Glen. The Laggan Stores cafe is a local institution — homemade cakes and strong coffee. Fill up on both before the A86."
        },
        {
          name: "Commando Memorial",
          lat: 56.8884, lng: -4.9866,
          type: "viewpoint",
          description: "Powerful bronze statue overlooking Ben Nevis and the Great Glen. Commemorates the Commandos who trained at nearby Achnacarry during WWII. The mountain panorama behind the statue is extraordinary. A place that combines stunning scenery with deep respect.",
          url: "https://www.undiscoveredscotland.co.uk/speanbridge/commandomemorial/"
        },
        {
          name: "Ben Nevis Viewpoint",
          lat: 57.7960, lng: -5.0100,
          type: "viewpoint",
          description: "Britain's highest mountain at 4,413ft. You don't need to climb it — the views from Glen Nevis below are spectacular. On a clear day the summit is visible from the car park. Most days it's hidden in cloud, which somehow makes it even more impressive."
        },
        {
          name: "Steall Falls",
          lat: 56.7890, lng: -5.0090,
          type: "waterfall",
          description: "Scotland's second-highest waterfall at 120m — a single white thread of water dropping down a dark cliff face. Reached by a 45-min walk through the dramatic Nevis Gorge. Cross the wire bridge if you dare — it sways alarmingly over the river. One of Britain's great short walks."
        },
        {
          name: "Neptune's Staircase",
          lat: 56.8403, lng: -5.0984,
          type: "landmark",
          description: "Flight of eight locks on the Caledonian Canal at Banavie — the longest staircase lock in Britain. Watch boats being lifted 64 feet. Ben Nevis looms behind. Thomas Telford's engineering masterpiece from the 1820s. Free to visit and surprisingly mesmerising."
        },
        {
          name: "Highland Cattle",
          lat: 56.8200, lng: -5.1000,
          type: "wildlife",
          description: "Shaggy Highland cattle graze in fields along the road near Fort William. They're docile, photogenic, and have been on more Instagram posts than any influencer. Don't approach calves — the mothers are protective despite their fluffy appearance."
        },
        {
          name: "Ben Nevis Inn",
          lat: 56.8050, lng: -5.0600,
          type: "pub",
          description: "Proper Highland pub at the foot of Ben Nevis with a beer garden overlooking the river. Great for a celebratory pint at the end of the trip. Real ales, hearty food, and a clientele of muddy hikers and bikers. The perfect final stop.",
          url: "https://www.ben-nevis-inn.co.uk"
        },
        {
          name: "Glen Nevis",
          lat: 56.7900, lng: -5.0500,
          type: "viewpoint",
          description: "One of Scotland's most beautiful glens. The road winds up through ancient woodland with Ben Nevis towering above. Used as a filming location for Braveheart, Harry Potter, and Rob Roy. The meadow at the end of the road is picture-perfect."
        },
        {
          name: "Glen Nevis Campsite",
          lat: 56.7950, lng: -5.0700,
          type: "camp",
          description: "Large, well-equipped campsite in the shadow of Ben Nevis. Hot showers, drying room (essential after 14 days in Scotland!), and close to Fort William for supplies and restaurants. The perfect final night under canvas with Britain's biggest mountain watching over you.",
          url: "https://www.glen-nevis.co.uk",
          park4night: "https://park4night.com/en/search?lat=56.80&lng=-5.07"
        }
      ],
      roads: [
        {
          name: "A86 Laggan Road",
          rating: 4,
          description: "Flowing Highland road through the Great Glen. Empty, well-surfaced, with mountain and loch views throughout. A brilliant final day's riding — fast sweepers through gorgeous scenery."
        },
        {
          name: "Glen Nevis Road",
          rating: 3,
          description: "Narrow road up into the glen beneath Ben Nevis. Not fast but incredibly scenic. Single-track at the top with blind bends — take it easy and enjoy the forest views."
        }
      ],
      route: [
        [57.1650, -3.6700], [57.1000, -3.8000], [57.0630, -4.1200],
        [56.9800, -4.3800], [56.9500, -4.5000], [56.9200, -4.6000],
        [56.9000, -4.7500], [56.8884, -4.9866], [56.8500, -5.0500],
        [56.8403, -5.0984], [56.8200, -5.1000], [56.8050, -5.0600],
        [56.7960, -5.0100], [56.7890, -5.0090], [56.7950, -5.0700]
      ],
      tips: "Short day so no rush — enjoy the last miles. The A86 is a cracking road that's often overlooked. Fort William has a Morrisons for restocking. Return options from here: 1) Ride south via A82/M6/M5 to Poole for the Guernsey ferry (~600mi, 2 days). 2) Put the bike on the Caledonian Sleeper train from Fort William to London. 3) Extend the trip with more Highland days — the Great Glen, Torridon, or the Outer Hebrides are all within reach."
    }
  ],

  topRoads: [
    // 5-star roads
    { name: "A4069 Black Mountain Pass", day: 2, rating: 5, region: "Wales" },
    { name: "A537 Cat and Fiddle", day: 3, rating: 5, region: "Peak District" },
    { name: "Hardknott Pass", day: 4, rating: 5, region: "Lake District" },
    { name: "A686 Hartside Pass", day: 5, rating: 5, region: "North Pennines" },
    { name: "A82 Rannoch Moor to Glencoe", day: 6, rating: 5, region: "Scottish Highlands" },
    { name: "Quiraing Road", day: 8, rating: 5, region: "Isle of Skye" },
    { name: "Bealach na Ba", day: 9, rating: 5, region: "NC500 North" },
    // 4-star roads
    { name: "B3135 Cheddar Gorge", day: 2, rating: 4, region: "Somerset" },
    { name: "B4518 Elan Valley", day: 3, rating: 4, region: "Mid-Wales" },
    { name: "Winnats Pass", day: 4, rating: 4, region: "Peak District" },
    { name: "A57 Snake Pass", day: 4, rating: 4, region: "Peak District" },
    { name: "A592 Kirkstone Pass", day: 4, rating: 4, region: "Lake District" },
    { name: "Wrynose Pass", day: 4, rating: 4, region: "Lake District" },
    { name: "A68 Scottish Borders", day: 5, rating: 4, region: "Scottish Borders" },
    { name: "A821 Duke's Pass", day: 6, rating: 4, region: "Trossachs" },
    { name: "A830 Road to the Isles", day: 7, rating: 4, region: "Western Highlands" },
    { name: "Elgol Road", day: 7, rating: 4, region: "Isle of Skye" },
    { name: "Trotternish Loop", day: 8, rating: 4, region: "Isle of Skye" },
    { name: "Coast Road Applecross to Shieldaig", day: 9, rating: 4, region: "NC500 North" },
    { name: "A896 Torridon Coast Road", day: 10, rating: 4, region: "NC500 North" },
    { name: "A894 Kylesku Road", day: 10, rating: 4, region: "NC500 North" },
    { name: "A838 North Coast", day: 11, rating: 4, region: "NC500 North" },
    { name: "B862 South Loch Ness Road", day: 13, rating: 4, region: "Scottish Highlands" },
    { name: "A86 Laggan Road", day: 14, rating: 4, region: "Scottish Highlands" }
  ]
};
