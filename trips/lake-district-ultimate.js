const LAKE_DISTRICT_ULTIMATE = {
  slug: 'lake-district-ultimate',
  name: 'Lake District Ultimate',
  tagline: "England's wildest mountain passes, glacial lakes, and the roads that bikers dream about",
  duration: '4 days',
  distance: '~280 miles',
  startLocation: 'Kendal',
  endLocation: 'Kendal',
  difficulty: 'Challenging',
  bestTime: 'May to October',
  description: "Four days threading through England's most dramatic landscape on two wheels. The Lake District packs more world-class motorcycle roads into a compact area than anywhere else in the country — from the infamous Hardknott Pass (30% gradients and hairpins that'll test your clutch control) to the soaring Kirkstone Pass and the dark volcanic walls of Honister. Between the passes, you'll ride alongside glacial lakes, under 3,000ft peaks, and through valleys that haven't changed since Wordsworth wandered them. This route links every essential Lake District road into a logical loop from Kendal, with wild camping spots, legendary viewpoints, and enough café stops to keep your energy up.",
  highlights: [
    "Kirkstone Pass — the Lake District's highest road pass",
    "Hardknott Pass — England's steepest road with 30% gradients",
    "Wrynose Pass — technical hairpins through volcanic scenery",
    "Honister Pass — dramatic slate quarry descent into Buttermere",
    "Wastwater — England's deepest lake and most dramatic scree slopes",
    "Ullswater — often called England's most beautiful lake",
    "Whinlatter Forest — sweeping forest road with osprey viewpoints",
    "Helvellyn viewpoints — third-highest peak in England"
  ],

  meta: {
    title: "Lake District Ultimate",
    subtitle: "4 Days of England's Best Mountain Passes and Glacial Lakes",
    totalDays: 4,
    totalDistance: "~280 miles / ~450 km",
    fuelStrategy: "Fill up in Kendal, Keswick, and Ambleside. Fuel stations are scarce in the western valleys — never ride past Eskdale or Buttermere without a full tank.",
    packingEssentials: [
      "Waterproofs — Lake District rain is frequent and sudden",
      "Warm base layers — mountain passes are cold even in summer",
      "Tank bag with clear map pocket",
      "Phone mount + USB charger (signal is patchy in valleys)",
      "Chain lube + basic toolkit",
      "Tyre repair kit (cattle grids and loose surfaces on some passes)",
      "Camping: tent, sleeping bag, mat, stove",
      "OS Explorer maps OL4, OL5, OL6, OL7 (offline essential)"
    ]
  },

  dayColors: [
    "#4D96FF", // Day 1 - blue
    "#6BCB77", // Day 2 - green
    "#FF6B6B", // Day 3 - coral
    "#FFA502"  // Day 4 - orange
  ],

  markerColors: {
    camp: "#27ae60",
    viewpoint: "#e8713a",
    waterfall: "#00cec9",
    pass: "#e74c3c",
    landmark: "#9b59b6",
    lake: "#3498db",
    pub: "#c0392b",
    fuel: "#fdcb6e",
    village: "#8e44ad"
  },

  days: [
    // =====================================================
    // DAY 1 — Kendal to Keswick via Kirkstone Pass
    // =====================================================
    {
      day: 1,
      title: "Kendal to Keswick",
      distance: "~65 miles",
      duration: "~3-4 hrs riding",
      summary: "An iconic introduction day climbing straight over Kirkstone Pass — the highest road in the Lake District — then cruising alongside Windermere and Thirlmere before dropping into Keswick. Every mile is a postcard.",
      center: [54.48, -2.95],
      zoom: 11,
      region: "lake-district-south",
      mergeable: false,

      waypoints: [
        [54.3268, -2.7461], [54.3450, -2.7700], [54.3600, -2.8200],
        [54.3807, -2.9073], [54.4050, -2.9300], [54.4200, -2.9400],
        [54.4336, -2.9394], [54.4400, -2.9500], [54.4313, -2.9632],
        [54.4500, -2.9800], [54.4700, -3.0000], [54.4900, -3.0200],
        [54.5100, -3.0400], [54.5319, -3.0619], [54.5500, -3.0800],
        [54.5700, -3.1000], [54.5850, -3.1200], [54.6003, -3.1358]
      ],

      stops: [
        {
          name: "Kendal",
          lat: 54.3268, lng: -2.7461,
          type: "landmark",
          description: "The 'Gateway to the Lakes' and your starting point. Stock up on Kendal Mint Cake — the original energy bar, invented here. Fill up with fuel and grab a coffee before heading into the hills.",
          rating: 3
        },
        {
          name: "Windermere Town",
          lat: 54.3807, lng: -2.9073,
          type: "village",
          description: "Busy tourist hub but worth a quick fuel stop. The A591 heading north from here towards Ambleside hugs the eastern shore of Windermere — England's longest lake at 10.5 miles. Great views across the water to the Langdale Pikes.",
          rating: 3
        },
        {
          name: "Ambleside",
          lat: 54.4313, lng: -2.9632,
          type: "village",
          description: "Charming lakeside town at the head of Windermere. Stock Bridge — a tiny 17th-century bridge house perched over Stock Ghyll — is one of the most photographed buildings in the Lakes. Good cafés and the last reliable fuel before Kirkstone.",
          rating: 4
        },
        {
          name: "Stock Ghyll Force",
          lat: 54.4350, lng: -2.9570,
          type: "waterfall",
          description: "A stunning 70ft waterfall hidden in woodland just a 15-minute walk from Ambleside centre. The falls crash down through a narrow ravine — spectacular after rain. Free to visit, signed from the main street.",
          rating: 4
        },
        {
          name: "Kirkstone Pass",
          lat: 54.4336, lng: -2.9394,
          type: "pass",
          description: "At 1,489ft, this is the highest road pass in the Lake District. The climb from Ambleside is relentless — a series of sweeping bends with sheer drops and stone walls. The Kirkstone Pass Inn at the summit is England's third-highest pub. The descent towards Patterdale is even more dramatic — tight hairpins with Ullswater glinting below.",
          rating: 5
        },
        {
          name: "Kirkstone Pass Inn",
          lat: 54.4380, lng: -2.9330,
          type: "pub",
          description: "England's third-highest pub, sitting at the summit of Kirkstone Pass since 1496. A proper stone-built Lakeland inn with log fires. Stop for a coffee or lunch — the views from the beer garden across to Red Screes are outstanding.",
          rating: 4
        },
        {
          name: "Thirlmere",
          lat: 54.5319, lng: -3.0619,
          type: "lake",
          description: "A dark, atmospheric reservoir flanked by dense conifer forest and the brooding bulk of Helvellyn. The A591 along the western shore is a flowing, well-surfaced road with dappled light through the trees. Several laybys for photos. The lake was controversially dammed in 1894 to supply Manchester with water.",
          rating: 4
        },
        {
          name: "Castlerigg Stone Circle",
          lat: 54.6025, lng: -3.0983,
          type: "landmark",
          description: "One of the oldest stone circles in Britain — roughly 5,000 years old, older than Stonehenge. Thirty-eight stones set on a raised plateau with a jaw-dropping 360° panorama of Skiddaw, Blencathra, and Helvellyn. Free access, 1.5 miles east of Keswick. Best at dawn or dusk when you'll have it to yourself.",
          rating: 5
        },
        {
          name: "Keswick Camping & Caravanning",
          lat: 54.5983, lng: -3.1225,
          type: "camp",
          description: "Well-run site on the edge of Keswick with hot showers, drying room (you'll need it), and a 5-minute walk into town for pubs and fish & chips. Flat grass pitches with views to Latrigg fell. Book ahead in summer.",
          rating: 4
        }
      ],

      roads: [
        {
          name: "A592 Kirkstone Pass",
          rating: 5,
          description: "The signature Lake District road. A relentless climb to 1,489ft with sweeping bends, stone-wall-lined straights, and heart-stopping drops. The descent to Patterdale is tighter and more technical. Surface generally good but watch for gravel after rain."
        },
        {
          name: "A591 Windermere to Keswick",
          rating: 4,
          description: "The main north-south artery through the Lakes. Fast-flowing with long straights along Thirlmere, but expect tourist traffic in summer. Best ridden early morning."
        }
      ],

      route: [
        [54.3268, -2.7461], [54.3450, -2.7700], [54.3600, -2.8200],
        [54.3807, -2.9073], [54.4050, -2.9300], [54.4313, -2.9632],
        [54.4336, -2.9394], [54.4500, -2.9500], [54.4700, -2.9800],
        [54.4900, -3.0000], [54.5100, -3.0400], [54.5319, -3.0619],
        [54.5500, -3.0800], [54.5700, -3.1000], [54.6003, -3.1358]
      ],

      tips: "Ride Kirkstone early to avoid tourist traffic — it gets busy by 10am in summer. The descent towards Patterdale has some blind bends — stay left. Fill up in Ambleside; there's no fuel on the pass itself."
    },

    // =====================================================
    // DAY 2 — Keswick Loop: Honister, Buttermere, Whinlatter
    // =====================================================
    {
      day: 2,
      title: "Keswick Loop — Honister & Buttermere",
      distance: "~55 miles",
      duration: "~3-4 hrs riding",
      summary: "A compact but spectacular loop from Keswick over the dramatic Honister Pass, through the picture-perfect Buttermere valley, past Crummock Water, and back via the sweeping Whinlatter Forest road. Short on miles, long on jaw-drops.",
      center: [54.55, -3.22],
      zoom: 12,
      region: "lake-district-north-west",
      mergeable: false,

      waypoints: [
        [54.6003, -3.1358], [54.5800, -3.1400], [54.5600, -3.1600],
        [54.5400, -3.1750], [54.5200, -3.1900], [54.5117, -3.1950],
        [54.5200, -3.2200], [54.5300, -3.2500], [54.5402, -3.2760],
        [54.5500, -3.2850], [54.5563, -3.2900], [54.5700, -3.2800],
        [54.5900, -3.2600], [54.6085, -3.2233], [54.6100, -3.2000],
        [54.6050, -3.1700], [54.6003, -3.1358]
      ],

      stops: [
        {
          name: "Keswick",
          lat: 54.6003, lng: -3.1358,
          type: "landmark",
          description: "Your base for Day 2. Grab breakfast at one of the many cafés in the market square before heading south on the B5289 towards Borrowdale. Fill up here — there's nothing until you're back.",
          rating: 4
        },
        {
          name: "Borrowdale Valley",
          lat: 54.5500, lng: -3.1650,
          type: "viewpoint",
          description: "Often called the most beautiful valley in England. The B5289 winds through ancient oak woodland and past the dramatic Bowder Stone — a 2,000-tonne boulder balanced on its edge. The valley narrows dramatically as you approach Honister.",
          rating: 5
        },
        {
          name: "Bowder Stone",
          lat: 54.5560, lng: -3.1590,
          type: "landmark",
          description: "A massive 2,000-tonne rock balanced improbably on one edge in the middle of Borrowdale. You can climb a wooden ladder to the top. Geologists still argue about how it got here — landslide or glacial erratic? Either way, it's surreal. Quick 5-minute detour from the road.",
          rating: 3
        },
        {
          name: "Honister Pass",
          lat: 54.5117, lng: -3.1950,
          type: "pass",
          description: "A savage climb to 1,176ft through Britain's last working slate mine. The road narrows to single-track in places with 25% gradients and sheer drops into Borrowdale. The summit has a café and you can take a Via Ferrata tour along the old miners' paths clinging to the cliff face. The descent into Buttermere is equally dramatic — tight hairpins with the lake spread below you.",
          rating: 5
        },
        {
          name: "Honister Slate Mine",
          lat: 54.5120, lng: -3.1970,
          type: "landmark",
          description: "England's last working slate mine, perched at the top of Honister Pass. The Via Ferrata (iron road) experience takes you along the original miners' route on a cliff face — terrifying and exhilarating. The café does proper Cumbrian food. Worth a 30-min stop even if you don't do the climb.",
          rating: 4
        },
        {
          name: "Buttermere",
          lat: 54.5402, lng: -3.2760,
          type: "lake",
          description: "A jewel of a lake ringed by towering fells — Haystacks, High Crag, and Fleetwith Pike. The water is crystal-clear and the 4.5-mile lakeside walk is one of the finest in the Lakes. The Bridge Hotel in the village does excellent pub grub. This is the view that Alfred Wainwright loved above all others — his ashes are scattered on Haystacks above.",
          rating: 5
        },
        {
          name: "Scale Force Waterfall",
          lat: 54.5486, lng: -3.3100,
          type: "waterfall",
          description: "At 172ft, this is the tallest waterfall in the Lake District. A 45-minute walk from Buttermere village through woodland to reach the falls, which plunge down a narrow ravine. Best after heavy rain when the volume is spectacular. Wear waterproofs — the spray reaches the path.",
          rating: 4
        },
        {
          name: "Crummock Water",
          lat: 54.5563, lng: -3.2900,
          type: "lake",
          description: "Buttermere's quieter neighbour, connected by a short stretch of river. Deeper and larger than Buttermere but far less visited. The road along the eastern shore has stunning views across to Mellbreak fell. Stop at the Rannerdale Bluebells viewpoint in May for a hillside carpeted in blue.",
          rating: 4
        },
        {
          name: "Whinlatter Forest Pass",
          lat: 54.6085, lng: -3.2233,
          type: "pass",
          description: "A fantastic flowing road through England's only true mountain forest. Wide, well-surfaced sweeping bends through dense Sitka spruce with occasional clearings giving views to Bassenthwaite Lake and Skiddaw. The Whinlatter Visitor Centre has an osprey viewpoint — these rare birds returned to breed here in 2001 after 150 years' absence.",
          rating: 4
        },
        {
          name: "Whinlatter Osprey Viewpoint",
          lat: 54.6100, lng: -3.2280,
          type: "viewpoint",
          description: "Live camera feeds of nesting ospreys at the Forestry England visitor centre. These magnificent fish-hunting raptors returned to Bassenthwaite Lake in 2001 — the first breeding pair in England for 150 years. Free to view. The café does decent coffee too.",
          rating: 3
        },
        {
          name: "Keswick Camping & Caravanning",
          lat: 54.5983, lng: -3.1225,
          type: "camp",
          description: "Back to base for a second night. After a short riding day, you've earned a proper evening in Keswick — try The Dog and Gun or the George Hotel for local ales. Tomorrow is the big one: Hardknott and Wrynose.",
          rating: 4
        }
      ],

      roads: [
        {
          name: "B5289 Borrowdale to Honister",
          rating: 5,
          description: "One of England's most dramatic road descents/climbs. Narrow, steep, and exhilarating through ancient Borrowdale woodland before the savage climb to Honister. Watch for oncoming traffic on the single-track sections."
        },
        {
          name: "B5289 Buttermere Valley",
          rating: 4,
          description: "Gentle flowing road between Buttermere and Crummock Water with fell views in every direction. Perfect after the intensity of Honister."
        },
        {
          name: "B5292 Whinlatter Pass",
          rating: 4,
          description: "Sweeping forest road climbing to 1,043ft. Wide enough for confident riding with excellent surface. One of the best 'fast' roads in the Lakes."
        }
      ],

      route: [
        [54.6003, -3.1358], [54.5800, -3.1400], [54.5600, -3.1600],
        [54.5560, -3.1590], [54.5400, -3.1750], [54.5200, -3.1900],
        [54.5117, -3.1950], [54.5200, -3.2200], [54.5300, -3.2500],
        [54.5402, -3.2760], [54.5500, -3.2850], [54.5563, -3.2900],
        [54.5700, -3.2800], [54.5900, -3.2600], [54.6085, -3.2233],
        [54.6100, -3.2000], [54.6050, -3.1700], [54.6003, -3.1358]
      ],

      tips: "Honister's single-track sections mean you'll meet oncoming traffic head-on — keep your speed down and be ready to pull into passing places. The descent into Buttermere is steep enough to overheat your brakes — use engine braking. Whinlatter is best in the afternoon light."
    },

    // =====================================================
    // DAY 3 — Hardknott & Wrynose Passes
    // =====================================================
    {
      day: 3,
      title: "Hardknott & Wrynose — England's Steepest Roads",
      distance: "~85 miles",
      duration: "~5-6 hrs riding",
      summary: "The day you've been building up to. Hardknott Pass is England's steepest road at 30% with brutal hairpins — it's a genuine test of bike and rider. Then Wrynose Pass continues the punishment before you descend to the wild western coast and England's deepest, darkest lake: Wastwater.",
      center: [54.42, -3.22],
      zoom: 11,
      region: "lake-district-west",
      mergeable: false,

      waypoints: [
        [54.6003, -3.1358], [54.5800, -3.1200], [54.5600, -3.1000],
        [54.5319, -3.0619], [54.5100, -3.0400], [54.4700, -3.0000],
        [54.4500, -2.9800], [54.4313, -2.9632], [54.4200, -2.9800],
        [54.4206, -3.1250], [54.4100, -3.1700], [54.4083, -3.2083],
        [54.3943, -3.2800], [54.3800, -3.3200], [54.4100, -3.3000],
        [54.4361, -3.2967], [54.4500, -3.2500], [54.4700, -3.2000],
        [54.4900, -3.1700], [54.5100, -3.1400], [54.5300, -3.1200],
        [54.5500, -3.1100], [54.5700, -3.1200], [54.6003, -3.1358]
      ],

      stops: [
        {
          name: "Keswick",
          lat: 54.6003, lng: -3.1358,
          type: "landmark",
          description: "Final morning in Keswick. Fuel up and eat a big breakfast — you'll need the energy. The ride south to Ambleside via the A591 is a warm-up for what's coming.",
          rating: 3
        },
        {
          name: "Ambleside",
          lat: 54.4313, lng: -2.9632,
          type: "fuel",
          description: "Last reliable fuel stop before the passes. Top up here without fail — there's nothing between Ambleside and Eskdale. Grab a sandwich too; options are non-existent on the passes.",
          rating: 3
        },
        {
          name: "Wrynose Pass",
          lat: 54.4206, lng: -3.1250,
          type: "pass",
          description: "The warm-up act for Hardknott — but don't underestimate it. Wrynose climbs to 1,281ft with 25% gradients and sharp hairpins through volcanic rock scenery. The Three Shire Stone at the summit marks the historic meeting point of Cumberland, Westmorland, and Lancashire. The surface deteriorates near the top — loose gravel in the bends.",
          rating: 5
        },
        {
          name: "Three Shire Stone",
          lat: 54.4210, lng: -3.1260,
          type: "landmark",
          description: "A weathered stone pillar at the summit of Wrynose Pass marking where three historic counties once met — Cumberland, Westmorland, and Lancashire. A symbolic spot and a good place to catch your breath before the descent to Cockley Beck and the climb up Hardknott.",
          rating: 3
        },
        {
          name: "Hardknott Pass",
          lat: 54.4083, lng: -3.2083,
          type: "pass",
          description: "England's steepest road. 30% gradients. Hairpin bends on a single-track road with no barriers and sheer drops. If you can ride Hardknott confidently, you can ride anything in the UK. First gear, steady throttle, and don't look down. The Roman fort at the top is the cherry on top — 2,000 years ago, Roman soldiers built a garrison up here. Absolute lunatics.",
          rating: 5
        },
        {
          name: "Hardknott Roman Fort",
          lat: 54.4020, lng: -3.2030,
          type: "landmark",
          description: "The remains of Mediobogdum — a Roman fort built around AD 120 on a plateau above Hardknott Pass. The bath house ruins are remarkably well preserved. The views from here across Eskdale to the coast are among the finest in England. Free access. The fact that Romans built and garrisoned this at 800ft on a mountainside tells you everything about their determination.",
          rating: 5
        },
        {
          name: "Eskdale Valley",
          lat: 54.3943, lng: -3.2800,
          type: "viewpoint",
          description: "A lush, peaceful valley stretching from the foot of Hardknott to the coast. After the pass, this feels like a different world — gentle farmland, stone bridges, and the miniature La'al Ratty railway (England's oldest narrow-gauge railway). The Woolpack Inn does great real ale.",
          rating: 4
        },
        {
          name: "Stanley Ghyll Force",
          lat: 54.3950, lng: -3.2650,
          type: "waterfall",
          description: "A magnificent 60ft waterfall hidden in a narrow ravine thick with ferns and moss. A short 20-minute walk from the road through ancient woodland. The gorge is so narrow that the falls echo off the walls. One of the Lake District's most atmospheric spots.",
          rating: 4
        },
        {
          name: "Wastwater",
          lat: 54.4361, lng: -3.2967,
          type: "lake",
          description: "England's deepest lake (258ft) and arguably its most dramatic. The Wastwater Screes — 2,000ft of loose rock plunging directly into the water — dominate the southern shore. The view from the western end towards Great Gable was voted 'Britain's Favourite View' in a 2007 ITV poll. This is the Lake District at its most raw and elemental.",
          rating: 5
        },
        {
          name: "Wasdale Head Inn",
          lat: 54.4600, lng: -3.3000,
          type: "pub",
          description: "England's remotest pub, sitting at the head of Wastwater beneath Great Gable and Scafell Pike. The inn claims to be the birthplace of British rock climbing. The World's Biggest Liar competition is held here every November. Real ales, roaring fire, and stories you won't believe.",
          rating: 5
        },
        {
          name: "Wasdale Head Campsite",
          lat: 54.4610, lng: -3.2970,
          type: "camp",
          description: "National Trust campsite at the head of Wastwater surrounded by England's highest peaks — Scafell Pike, Great Gable, Pillar. Basic but stunning. Flat grass pitches with stream running through. The night sky here is phenomenal — it's a Dark Sky Discovery site. Book ahead; it's popular with climbers.",
          rating: 5
        }
      ],

      roads: [
        {
          name: "Wrynose Pass",
          rating: 5,
          description: "25% gradients and sharp hairpins through volcanic scenery to 1,281ft. The road surface is rough in places with loose gravel near the summit. A proper test that prepares you for Hardknott."
        },
        {
          name: "Hardknott Pass",
          rating: 5,
          description: "England's steepest road. 30% gradients, single-track with passing places, blind hairpins and no barriers. Not for the faint-hearted — or heavy bikes on wet days. First gear only on the steepest sections."
        },
        {
          name: "Eskdale Road",
          rating: 3,
          description: "Gentle valley road that feels like a reward after the passes. Narrow in places but well-surfaced with lovely views of the Eskdale fells."
        }
      ],

      route: [
        [54.6003, -3.1358], [54.5700, -3.1100], [54.5319, -3.0619],
        [54.4900, -3.0000], [54.4313, -2.9632], [54.4206, -3.1250],
        [54.4083, -3.2083], [54.3943, -3.2800], [54.4100, -3.3000],
        [54.4361, -3.2967], [54.4610, -3.2970]
      ],

      tips: "Ride Hardknott west-to-east if possible — the climb from Eskdale is the most challenging direction but avoids the terrifying descent. In wet conditions, seriously consider skipping Hardknott — the 30% hairpins on wet tarmac with gravel are no joke. Start early to avoid campervans on the single-track sections."
    },

    // =====================================================
    // DAY 4 — Eastern Lakes: Ullswater, Helvellyn, Haweswater
    // =====================================================
    {
      day: 4,
      title: "Eastern Lakes — Ullswater & Haweswater",
      distance: "~75 miles",
      duration: "~4-5 hrs riding",
      summary: "The grand finale loops through the quieter eastern Lakes — serene Ullswater, Helvellyn's imposing flank, the lonely valley of Haweswater, and back to Kendal via Shap. A fitting farewell to England's finest riding country.",
      center: [54.52, -2.82],
      zoom: 11,
      region: "lake-district-east",
      mergeable: false,

      waypoints: [
        [54.4610, -3.2970], [54.4800, -3.2500], [54.5000, -3.2000],
        [54.5100, -3.1500], [54.5272, -3.0117], [54.5400, -2.9500],
        [54.5628, -2.8800], [54.5800, -2.8500], [54.5900, -2.8200],
        [54.5700, -2.8000], [54.5500, -2.7500], [54.5317, -2.6833],
        [54.5100, -2.7000], [54.5100, -2.7828], [54.4800, -2.7700],
        [54.4500, -2.7600], [54.4000, -2.7500], [54.3268, -2.7461]
      ],

      stops: [
        {
          name: "Wasdale Head",
          lat: 54.4610, lng: -3.2970,
          type: "camp",
          description: "Break camp and enjoy a final look at Wastwater before heading east. The morning light on the Screes is extraordinary. Ride east via the A595 and A66 corridor to reach the eastern Lakes.",
          rating: 4
        },
        {
          name: "Helvellyn Viewpoint (Dunmail Raise)",
          lat: 54.5050, lng: -3.0350,
          type: "viewpoint",
          description: "A layby on the A591 at Dunmail Raise gives dramatic views up to Helvellyn — at 3,117ft, it's the third-highest mountain in England. The sharp ridge of Striding Edge is visible from here, one of the most famous scrambles in British mountaineering.",
          rating: 4
        },
        {
          name: "Aira Force Waterfall",
          lat: 54.5756, lng: -2.9260,
          type: "waterfall",
          description: "A spectacular 65ft waterfall plunging through a stone bridge into a tree-lined gorge on the shores of Ullswater. National Trust site with a well-maintained path. Wordsworth was inspired to write 'The Somnambulist' here after seeing it in 1805. The arboretum around the falls has towering conifers planted in the 1780s. Free car park for bikes.",
          rating: 5
        },
        {
          name: "Ullswater",
          lat: 54.5628, lng: -2.8800,
          type: "lake",
          description: "Often called the most beautiful lake in England — and it's hard to argue. Seven miles of serpentine water winding through three distinct bends, each revealing a different character. Wordsworth saw the daffodils here that inspired his most famous poem. The A592 along the southern shore is one of the finest lakeside roads in Britain.",
          rating: 5
        },
        {
          name: "Pooley Bridge",
          lat: 54.6072, lng: -2.8200,
          type: "village",
          description: "A pretty village at the northern tip of Ullswater. The 16th-century stone bridge was tragically destroyed by Storm Desmond in 2015 and replaced with a modern stainless steel arch. Good cafés and a steamer pier if you fancy seeing the lake from the water.",
          rating: 3
        },
        {
          name: "Askham",
          lat: 54.5889, lng: -2.7500,
          type: "village",
          description: "A quintessential English village with stone cottages lining a long green. Askham Hall is now a restaurant and hotel worth a detour if you want a special lunch. The road from here south to Shap traverses wild open moorland — beautiful and exposed.",
          rating: 3
        },
        {
          name: "Shap",
          lat: 54.5317, lng: -2.6833,
          type: "landmark",
          description: "A small fell-top village on the A6, once a staging post on the main London-to-Glasgow road. The medieval Shap Abbey ruins are a mile west. Fill up with fuel here — it's the last stop before the run back to Kendal.",
          rating: 3
        },
        {
          name: "Haweswater",
          lat: 54.5100, lng: -2.7828,
          type: "lake",
          description: "The Lake District's loneliest lake — a reservoir created in the 1930s by flooding the village of Mardale Green. In drought years, the ruins of the old village emerge from the receding water like ghosts. Golden eagles bred here until recently — the last pair in England. The single-track road along the western shore is hauntingly beautiful and almost always empty.",
          rating: 5
        },
        {
          name: "Naddle Bridge Viewpoint",
          lat: 54.5200, lng: -2.7700,
          type: "viewpoint",
          description: "A stone bridge over Naddle Beck with a perfect framed view down Haweswater. One of the Lake District's most peaceful spots — you can sit here for 20 minutes and not see another soul. The surrounding fells are some of the quietest in the national park.",
          rating: 4
        },
        {
          name: "Kendal",
          lat: 54.3268, lng: -2.7461,
          type: "landmark",
          description: "Journey's end. Back where you started, with four days of England's finest riding behind you. Celebrate at The Brewery Arts Centre with a Hawkshead bitter, or grab a final slab of Kendal Mint Cake for the road home. You've earned it.",
          rating: 4
        }
      ],

      roads: [
        {
          name: "A592 Ullswater Shore Road",
          rating: 5,
          description: "One of England's finest lakeside roads. Flowing bends hugging the southern shore of Ullswater with the water glinting through the trees. Well-surfaced and wide enough for confident riding."
        },
        {
          name: "Haweswater Road",
          rating: 4,
          description: "A quiet single-track road along England's loneliest lake. No through traffic, no rush, just fell scenery and water. The surface is rough in places but rideable on any bike."
        },
        {
          name: "A6 Shap to Kendal",
          rating: 3,
          description: "Fast, straight road over Shap Fell with big open moorland views. A fitting high-speed finale before you drop back into Kendal."
        }
      ],

      route: [
        [54.4610, -3.2970], [54.4800, -3.2500], [54.5050, -3.0350],
        [54.5272, -3.0117], [54.5500, -2.9500], [54.5756, -2.9260],
        [54.5628, -2.8800], [54.6072, -2.8200], [54.5889, -2.7500],
        [54.5317, -2.6833], [54.5200, -2.7700], [54.5100, -2.7828],
        [54.4800, -2.7700], [54.4500, -2.7600], [54.3268, -2.7461]
      ],

      tips: "The A592 along Ullswater is gorgeous but narrow in places — watch for coaches. Haweswater has no services at all — take everything you need. The A6 over Shap Fell can be windy and exposed — tuck in. If time allows, the Struggle (old road up Kirkstone from Ambleside) is worth a farewell lap."
    }
  ]
};
