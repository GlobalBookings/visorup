/* ═══════════════════════════════════════════════════════════════════
   VisorUp — site.js
   SPA Router & Page Renderer
   Motorcycle Adventures Across Britain
   ═══════════════════════════════════════════════════════════════════ */

// ── Embedded Data ────────────────────────────────────────────────

const DESTINATIONS = [
  {
    slug: "isle-of-skye",
    name: "Isle of Skye",
    center: [57.35, -6.30],
    waypoints: [[57.28,-5.74],[57.24,-5.92],[57.15,-5.92],[57.29,-6.17],[57.41,-6.20],[57.51,-6.18],[57.64,-6.26],[57.59,-6.21],[57.58,-6.37],[57.45,-6.59],[57.30,-6.36],[57.29,-6.17]],
    tagline: "Otherworldly landscapes and Britain's most dramatic roads",
    region: "Scotland",
    image: "public/images/destinations/isle-of-skye.jpg",
    bestTime: "May to September",
    overview: "Skye is the crown jewel of Scottish motorcycling. The Trotternish Peninsula alone offers more jaw-dropping riding than most countries — from the alien pinnacles of the Quiraing to the towering Old Man of Storr, every corner reveals something extraordinary. The roads are narrow, winding, and utterly addictive. Single-track sections with passing places demand patience and respect, but the reward is some of the most dramatic scenery you'll ever ride through. Portree, the island's colourful capital, makes a good base with fuel, food, and accommodation. The Cuillin mountain range dominates the south of the island and provides a constantly changing backdrop that shifts from menacing to magical depending on the light.",
    topRoads: ["Quiraing Road (5-star)", "Trotternish Loop", "Elgol Road", "A87 Skye Bridge approach"],
    highlights: ["Old Man of Storr", "Fairy Pools", "Talisker Distillery", "Neist Point Lighthouse", "Dunvegan Castle", "Kilt Rock & Mealt Falls"],
    tips: "Fuel up in Portree — it's the only reliable fuel on the island. Single-track roads are everywhere; use passing places properly. Midges are brutal June–September, bring Smidge repellent and a head net. Book CalMac ferries early in summer — bike spaces fill fast."
  },
  {
    slug: "glencoe",
    name: "Glencoe",
    center: [56.68, -5.10],
    waypoints: [[56.43,-4.71],[56.52,-4.75],[56.58,-4.87],[56.65,-4.97],[56.67,-5.03],[56.68,-5.10],[56.63,-5.05],[56.68,-5.19],[56.69,-5.06],[56.68,-5.10]],
    tagline: "Scotland's most dramatic valley and the gateway to the Highlands",
    region: "Scotland",
    image: "public/images/destinations/glencoe.jpg",
    bestTime: "April to October",
    overview: "Glencoe is where Scotland gets properly wild. The A82 sweeps across the desolate emptiness of Rannoch Moor before plunging into the valley between the towering Three Sisters and the knife-edge ridge of Aonach Eagach. The descent into the glen is one of motorcycling's great moments — the sheer scale of the mountains on either side makes you feel wonderfully insignificant. Glen Etive, the single-track road made famous by the Skyfall film, branches off into 12 miles of remote Highland perfection. Red deer graze beside the road, golden eagles soar overhead, and the history of the 1692 massacre adds a haunting weight to the landscape.",
    topRoads: ["A82 Rannoch Moor to Glencoe (5-star)", "Glen Etive single-track", "A82 through the glen"],
    highlights: ["Three Sisters viewpoint", "Glencoe Village & Folk Museum", "Glen Etive (Skyfall road)", "Rannoch Moor", "Ballachulish Bridge"],
    tips: "The A82 carries heavy tourist traffic in summer, including slow campervans. Be patient with overtaking — blind crests are frequent. Fill up at Tyndrum, the last fuel before Glencoe. Midges at camp are ferocious in summer — repellent is not optional."
  },
  {
    slug: "nc500",
    name: "North Coast 500",
    center: [57.80, -4.80],
    waypoints: [[57.48,-4.22],[57.60,-4.43],[57.54,-5.51],[57.43,-5.81],[57.51,-5.65],[57.73,-5.69],[57.90,-5.16],[58.15,-5.25],[58.25,-5.02],[58.40,-4.75],[58.48,-4.42],[58.59,-3.53],[58.64,-3.07],[58.12,-3.65],[57.88,-4.03],[57.48,-4.22]],
    tagline: "Scotland's answer to Route 66 — 516 miles of wild Highland coastline",
    region: "Scotland",
    image: "public/images/destinations/nc500.jpg",
    bestTime: "May to September",
    overview: "The NC500 is a 516-mile loop starting and ending in Inverness that takes in the most spectacular coastline in Britain. From the towering mountains of Torridon to the white-sand beaches of the north coast, from the Bealach na Ba — Britain's highest road pass — to the eerie ruins of Ardvreck Castle on Loch Assynt, every day delivers something unforgettable. The west coast is wild, rugged, and deeply remote, while the east coast offers fairy-tale castles and dolphin-watching. Many riders consider this the greatest motorcycle route in Europe, and it's hard to argue. Allow at least five days to do it justice.",
    topRoads: ["Bealach na Ba (5-star)", "A896 Torridon coast road", "A838 north coast", "A894 Kylesku road"],
    highlights: ["Bealach na Ba pass", "Applecross Bay", "Smoo Cave", "Dunnet Head (true most northerly point)", "Dunrobin Castle", "Torridon mountains"],
    tips: "Fuel is scarce on the west coast — fill up at every opportunity. The route is very popular in summer; campervans can slow progress. Clockwise or anti-clockwise is debated, but anti-clockwise keeps you on the sea side. Wind and rain can appear from nowhere. The Bealach na Ba has a warning sign for good reason."
  },
  {
    slug: "lake-district",
    name: "Lake District",
    center: [54.45, -3.05],
    waypoints: [[54.60,-3.14],[54.51,-3.20],[54.54,-3.28],[54.57,-3.32],[54.66,-3.36],[54.67,-3.22],[54.60,-3.14],[54.43,-2.96],[54.45,-2.92],[54.38,-2.91],[54.37,-3.07],[54.42,-3.11],[54.40,-3.20],[54.38,-3.25],[54.45,-3.28],[54.60,-3.14]],
    tagline: "England's steepest passes and most beautiful lakes in one compact package",
    region: "England",
    image: "public/images/destinations/lake-district.jpg",
    bestTime: "April to October",
    overview: "The Lake District packs an extraordinary amount of dramatic riding into a compact area. Hardknott Pass — at 33% gradient with hairpin bends — is the steepest paved road in England and a genuine challenge on a loaded sportbike. Combined with its sister pass Wrynose, it makes for one of the most intense short rides in Britain. Kirkstone Pass offers a more flowing experience with the famous Struggle climb from Ambleside, while the road along Ullswater to Aira Force waterfall is simply beautiful. The lakes themselves provide a constantly changing backdrop of reflections, and the ancient fell peaks create a landscape that inspired Wordsworth, Beatrix Potter, and countless bikers.",
    topRoads: ["Hardknott Pass (5-star)", "Wrynose Pass", "Kirkstone Pass (The Struggle)", "A592 along Ullswater"],
    highlights: ["Hardknott Pass", "Aira Force waterfall", "Kirkstone Pass Inn", "Great Langdale valley", "Stock Ghyll Force", "Windermere"],
    tips: "Hardknott is no joke on a sportbike — first gear, careful clutch control. Tourist traffic can block the hairpins in summer; go early. There's a section of M6 motorway to reach the Lakes that's unavoidable. Herdwick sheep own the roads and will not move for anyone."
  },
  {
    slug: "yorkshire-dales",
    name: "Yorkshire Dales",
    center: [54.20, -2.15],
    waypoints: [[53.96,-2.02],[54.07,-1.99],[54.17,-2.01],[54.36,-2.18],[54.31,-2.20],[54.21,-2.37],[54.15,-2.46],[54.07,-2.28],[54.10,-2.15],[53.96,-2.02]],
    tagline: "Rolling green valleys, stone walls, and the magnificent Ribblehead Viaduct",
    region: "England",
    image: "public/images/destinations/yorkshire-dales.jpg",
    bestTime: "April to October",
    overview: "The Yorkshire Dales are quintessentially English — dry stone walls running across rolling green fells, ancient market towns, and some surprisingly good biking roads. The Buttertubs Pass between Hawes and Thwaite is a classic motorcycle route with fast flowing bends across open moorland, while the road from Ribblehead over to Ingleton offers spectacular views of the famous 24-arch Victorian viaduct. Fleet Moss is one of England's highest and steepest roads. The Dales make an excellent long weekend trip or a worthy stop en route to the Lakes or Scotland.",
    topRoads: ["Buttertubs Pass", "Fleet Moss", "B6255 past Ribblehead Viaduct", "A684 Hawes to Sedbergh"],
    highlights: ["Ribblehead Viaduct", "Malham Cove", "Aysgarth Falls", "Buttertubs Pass", "Hawes Wensleydale Creamery"],
    tips: "Sheep are a constant hazard — they have right of way and zero road sense. Fuel up in market towns like Hawes, Leyburn, or Settle. The Buttertubs can be damp and exposed. Farm traffic and tractors are common on narrow lanes. Yorkshire tea stops are excellent."
  },
  {
    slug: "snowdonia",
    name: "Snowdonia",
    center: [53.05, -3.95],
    waypoints: [[53.09,-3.80],[53.10,-3.93],[53.07,-4.02],[53.12,-4.13],[53.14,-4.28],[53.01,-4.10],[52.91,-4.07],[52.86,-4.11],[52.74,-3.89],[52.91,-3.60],[53.09,-3.80]],
    tagline: "Wales' highest peaks and most thrilling mountain passes",
    region: "Wales",
    image: "public/images/destinations/snowdonia.jpg",
    bestTime: "May to September",
    overview: "Snowdonia National Park contains some of the finest motorcycling roads in Wales. The Llanberis Pass (A4086) cuts through a dramatic mountain corridor beneath the flanks of Snowdon, while the road over Pen-y-Pass connects to the Ogwen Valley with its waterfalls and towering cliffs. The A5 through the park is a flowing A-road with sweeping bends and mountain views, and quieter B-roads lead to hidden valleys and remote lakes. The Horseshoe Pass near Llangollen and the roads around Bala Lake add variety. Combined with the Brecon Beacons to the south, Wales offers a complete motorcycle touring experience.",
    topRoads: ["Llanberis Pass (A4086)", "A5 through Ogwen Valley", "A498 Beddgelert", "Horseshoe Pass"],
    highlights: ["Snowdon summit views", "Llanberis Pass", "Swallow Falls", "Beddgelert village", "Portmeirion", "Harlech Castle"],
    tips: "Snowdon area gets very busy on sunny weekends — car parks fill early. The Llanberis Pass can be slow behind tourist traffic. Fuel up in Betws-y-Coed or Caernarfon. Rain is frequent — waterproofs are essential. Watch for cyclists on mountain passes."
  },
  {
    slug: "brecon-beacons",
    name: "Brecon Beacons",
    center: [51.88, -3.45],
    waypoints: [[51.95,-3.40],[51.89,-3.47],[51.88,-3.44],[51.75,-3.38],[51.77,-3.57],[51.80,-3.80],[51.86,-3.73],[51.99,-3.80],[51.89,-3.72],[51.95,-3.40]],
    tagline: "Home of the legendary Black Mountain Pass and Wales' waterfall country",
    region: "Wales",
    image: "public/images/destinations/brecon-beacons.jpg",
    bestTime: "April to October",
    overview: "The Brecon Beacons (now Bannau Brycheiniog) are home to one of the UK's all-time great motorcycle roads: the A4069 Black Mountain Pass. This sweeping ribbon of tarmac climbs over the Black Mountain with long, flowing bends and panoramic views that have graced countless bike magazine covers. Below the mountains, Waterfall Country hides a string of spectacular falls including Sgwd yr Eira — a waterfall you can walk behind. The market town of Brecon makes an excellent base with good pubs, independent shops, and the canal for evening walks. The surrounding B-roads through the valleys are empty and addictive.",
    topRoads: ["A4069 Black Mountain Pass (5-star)", "A470 Storey Arms", "B4560 Gospel Pass", "A4059 through the valleys"],
    highlights: ["Black Mountain Pass", "Sgwd yr Eira waterfall", "Llyn y Fan Fach", "Brecon town", "Pen y Fan summit views"],
    tips: "The A4069 can be closed in winter or severe weather. Sheep on the road are a constant hazard in Wales. Fuel stations are sparse past Merthyr Tydfil — fill up before entering the valleys. The waterfall walks require waterproof boots."
  },
  {
    slug: "outer-hebrides",
    name: "Outer Hebrides",
    center: [57.80, -6.90],
    waypoints: [[57.90,-6.80],[57.88,-6.92],[57.82,-7.02],[57.77,-7.02],[57.73,-7.05],[57.60,-7.16],[57.45,-7.33],[57.25,-7.35],[57.07,-7.30],[57.90,-6.80]],
    tagline: "The edge of the world — remote islands of white sand and Atlantic wildness",
    region: "Islands",
    image: "public/images/destinations/outer-hebrides.jpg",
    bestTime: "May to August",
    overview: "The Outer Hebrides are as remote as British motorcycling gets. A chain of islands stretching 130 miles from Lewis in the north to Barra in the south, connected by causeways and short ferry hops. The riding is exposed and windswept, with single-track roads running through landscapes of extraordinary beauty — white shell-sand beaches, ancient standing stones, and vast empty moorland. Harris has some of the most stunning beaches in Europe, while Lewis holds the mysterious Callanish Standing Stones and the blackhouse villages of Arnol. The sense of isolation and remoteness is intoxicating.",
    topRoads: ["Golden Road (east Harris)", "A859 along Harris beaches", "West coast Lewis", "Sound of Harris causeway"],
    highlights: ["Callanish Standing Stones", "Luskentyre Beach", "Scarista Beach", "Arnol Blackhouse", "St Kilda views", "Barra airport beach runway"],
    tips: "Ferry from Uig (Skye) to Tarbert or Lochmaddy — book well ahead for bikes. Wind is constant and often severe. Fuel stations are scarce — fill up at every opportunity. Sunday closures are still observed on some islands. Midges can be apocalyptic in still weather."
  },
  {
    slug: "isle-of-man",
    name: "Isle of Man",
    center: [54.23, -4.55],
    waypoints: [[54.15,-4.48],[54.17,-4.47],[54.16,-4.48],[54.32,-4.38],[54.28,-4.44],[54.27,-4.46],[54.20,-4.42],[54.22,-4.69],[54.09,-4.77],[54.07,-4.65],[54.15,-4.48]],
    tagline: "The legendary TT course and no national speed limit on open roads",
    region: "Islands",
    image: "public/images/destinations/isle-of-man.jpg",
    bestTime: "May to September (TT fortnight late May/early June)",
    overview: "The Isle of Man is hallowed ground for motorcyclists. The 37.73-mile Mountain Course — used for the TT races since 1907 — is one of the most famous road circuits in the world, and you can ride every inch of it on public roads. The island has no national speed limit on many open roads (derestricted means exactly that), though this requires mature judgment. Beyond the TT course, the island offers beautiful coastal roads, the dramatic Snaefell Mountain Railway road, quiet glens, and medieval castles. During TT fortnight, the island becomes the motorcycle capital of the world.",
    topRoads: ["TT Mountain Course", "Marine Drive", "A18 coast road", "Snaefell Mountain Road"],
    highlights: ["TT Mountain Course", "Snaefell summit", "Peel Castle", "Calf of Man", "Laxey Wheel", "Port Erin Bay"],
    tips: "Derestricted roads do not mean unlimited skill. Ride within your limits — the TT course is demanding with blind crests and stone walls. Ferry from Heysham or Liverpool via Isle of Man Steam Packet — book bike spaces early for TT. The Mountain Road closes in bad weather."
  },
  {
    slug: "scottish-borders",
    name: "Scottish Borders",
    center: [55.55, -2.75],
    waypoints: [[55.95,-3.19],[55.38,-2.42],[55.48,-2.55],[55.60,-2.43],[55.60,-2.73],[55.58,-2.65],[55.65,-3.19],[55.95,-3.19]],
    tagline: "Rolling hills, ruined abbeys, and empty roads through Walter Scott country",
    region: "Scotland",
    image: "public/images/destinations/scottish-borders.jpg",
    bestTime: "April to October",
    overview: "The Scottish Borders are criminally underrated for motorcycling. The A68 from Carter Bar to Edinburgh is a fast, flowing road with long straights and sweeping bends through rolling hills. The smaller B-roads through the Tweed Valley are even better — empty, well-surfaced, and winding through beautiful countryside dotted with ruined abbeys and fortified tower houses. Scott's View, overlooking the Eildon Hills and the Tweed, is one of the finest viewpoints in Scotland. The region's four great abbeys — Melrose, Jedburgh, Dryburgh, and Kelso — are all worth a stop. Fewer tourists than the Highlands means more road to yourself.",
    topRoads: ["A68 Carter Bar to Edinburgh", "A7 through Hawick", "B6357 Langholm", "B6399 over Craik"],
    highlights: ["Scott's View", "Melrose Abbey", "Jedburgh Abbey", "Floors Castle", "Smailholm Tower", "Tweed Valley"],
    tips: "The A68 has occasional speed cameras — watch for them. Farm traffic and tractors are common on B-roads. Fuel up in the market towns. The Borders are excellent in autumn colours. The region is much quieter than the Highlands but equally beautiful."
  },
  {
    slug: "northumberland",
    name: "Northumberland",
    center: [55.20, -2.10],
    waypoints: [[54.97,-2.10],[55.01,-2.37],[54.97,-2.46],[54.76,-2.46],[54.81,-2.44],[54.97,-2.10],[55.41,-1.71],[55.61,-1.71],[55.67,-1.80],[54.97,-2.10]],
    tagline: "Hadrian's Wall, empty moorland roads, and England's dark sky country",
    region: "England",
    image: "public/images/destinations/northumberland.jpg",
    bestTime: "April to October",
    overview: "Northumberland is England's most sparsely populated county, and that translates directly into empty roads and spectacular riding. The A686 Hartside Pass is a 12-mile sweeping climb over the North Pennines to 1,904 feet — one of England's finest motorcycle roads. Hadrian's Wall runs through the county, and the military road (B6318) that follows it offers flowing bends with views across the wall and the crags. Kielder Forest is a designated Dark Sky Park, and the coast has dramatic castles at Bamburgh, Dunstanburgh, and Holy Island. The entire region has a wonderful sense of space and emptiness.",
    topRoads: ["A686 Hartside Pass (5-star)", "B6318 Military Road (Hadrian's Wall)", "A68 through Redesdale", "Coast road to Bamburgh"],
    highlights: ["Hadrian's Wall at Steel Rigg", "Bamburgh Castle", "Kielder Water & Forest", "Holy Island (Lindisfarne)", "Alnwick Castle", "Dunstanburgh Castle"],
    tips: "The A686 Hartside is stunning — save energy for it. Fuel up at Penrith or Hexham before heading into the hills. Holy Island is only accessible at low tide via a causeway — check tide times. Kielder is genuinely remote with no phone signal."
  },
  {
    slug: "jersey",
    name: "Jersey",
    center: [49.21, -2.13],
    waypoints: [[49.19,-2.11],[49.20,-2.01],[49.23,-2.02],[49.25,-2.13],[49.24,-2.20],[49.22,-2.25],[49.18,-2.25],[49.18,-2.19],[49.19,-2.11]],
    tagline: "Compact Channel Island with dramatic cliffs, hidden bays, and WWII history",
    region: "Islands",
    image: "public/images/destinations/jersey.jpg",
    bestTime: "May to September",
    overview: "Jersey is the largest Channel Island and packs a surprising amount of riding variety into its 45 square miles. The north coast road hugs dramatic granite cliffs with views across to France, while the south coast has sheltered sandy bays and the imposing Elizabeth Castle. The island's Green Lanes — a network of quiet rural roads with a 15mph speed limit — are perfect for gentle exploration through lush countryside. WWII bunkers and fortifications are scattered across the island, reminders of the German occupation. St Helier is a lively town with excellent seafood restaurants. The pace of life here is wonderfully relaxed.",
    topRoads: ["North coast cliff road", "Five Mile Road", "La Route du Nord", "West coast loop"],
    highlights: ["St Brelade's Bay", "La Corbière lighthouse", "Jersey War Tunnels", "Mont Orgueil Castle", "Elizabeth Castle", "Devil's Hole"],
    tips: "Speed limits are strictly enforced — 40mph maximum on main roads, 15mph in Green Lanes. Condor Ferries from Poole or Portsmouth, or Manche Iles Express from Guernsey. Fuel is cheaper than the UK. The island is small enough to ride every road in a day. French influence means excellent food."
  },
  {
    slug: "guernsey",
    name: "Guernsey",
    center: [49.46, -2.58],
    waypoints: [[49.46,-2.54],[49.48,-2.53],[49.49,-2.55],[49.48,-2.60],[49.47,-2.62],[49.43,-2.66],[49.44,-2.59],[49.45,-2.55],[49.46,-2.54]],
    tagline: "The starting line — cliff-top lanes, harbour charm, and a slower pace of island life",
    region: "Islands",
    image: "public/images/destinations/guernsey.jpg",
    bestTime: "May to September",
    overview: "Guernsey is where the VisorUp flagship route begins — and it's a destination worth exploring in its own right. The island's south coast cliffs are dramatic and rugged, with narrow lanes winding between granite farmhouses and hidden bays. St Peter Port, the capital, is one of the most attractive harbour towns in the British Isles, with a castle guarding the entrance and excellent waterfront restaurants. The Ruettes Tranquilles (quiet lanes) network encourages slow exploration, and the island's compact size means you can ride every road in a leisurely day. Victor Hugo lived here in exile and wrote Les Misérables — the views clearly inspired him.",
    topRoads: ["South coast cliff road", "Ruettes Tranquilles network", "West coast loop via Vazon Bay", "Pleinmont headland"],
    highlights: ["St Peter Port harbour", "Castle Cornet", "Little Chapel", "German Occupation Museum", "Sausmarez Manor", "Fermain Bay"],
    tips: "Maximum speed limit is 35mph, and most roads are much slower. Condor Ferries to Poole (~3hrs fast ferry) or Portsmouth (~7hrs). The island is only 10 miles by 5 miles — every road can be ridden in half a day. Excellent seafood at the harbour."
  }
];

const FERRIES = [
  {
    slug: "guernsey-to-uk",
    name: "Guernsey to UK Mainland",
    operator: "Condor Ferries",
    routes: ["St Peter Port → Poole (~3hrs high-speed)", "St Peter Port → Portsmouth (~7hrs conventional)"],
    frequency: "Daily in summer, reduced winter schedule",
    bikeCost: "From £80 return (bike + rider)",
    tips: "Book bike spaces early — limited slots, especially in peak season. Arrive 90 minutes before departure. Tie-down straps are provided but bring your own if you prefer. The high-speed ferry to Poole is the faster option but can be rough in bad weather. Check-in is at the White Rock terminal. Leave panniers on but remove loose items.",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    url: "https://www.condorferries.co.uk"
  },
  {
    slug: "jersey-to-uk",
    name: "Jersey to UK Mainland",
    operator: "Condor Ferries",
    routes: ["St Helier → Poole (~4.5hrs high-speed)", "St Helier → Portsmouth (~10hrs overnight)"],
    frequency: "Daily in summer, reduced winter",
    bikeCost: "From £85 return (bike + rider)",
    tips: "Similar setup to Guernsey. Bike spaces are limited and fill quickly in summer. The overnight sailing to Portsmouth is comfortable with cabin options. Jersey to Guernsey inter-island sailings are also available via Condor or Manche Iles Express. Arrive at Elizabeth Terminal 90 minutes before departure.",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    url: "https://www.condorferries.co.uk"
  },
  {
    slug: "isle-of-man",
    name: "Isle of Man Ferries",
    operator: "Isle of Man Steam Packet",
    routes: ["Heysham → Douglas (~3.5hrs)", "Liverpool → Douglas (~2.75hrs fast craft)", "Dublin → Douglas (seasonal)"],
    frequency: "Multiple daily sailings, increased during TT",
    bikeCost: "From £60 return (bike + rider)",
    tips: "Book months ahead for TT fortnight — spaces sell out fast. The fast craft from Liverpool is quickest but doesn't run in rough weather. Heysham is the more reliable year-round option. Bikes are loaded first and unloaded last. Bring tie-downs if you want peace of mind. The crossing can be rough in the Irish Sea.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80",
    url: "https://www.steam-packet.com"
  },
  {
    slug: "skye-ferry",
    name: "Mallaig to Skye Ferry",
    operator: "CalMac Ferries",
    routes: ["Mallaig → Armadale, Skye (~30 mins)"],
    frequency: "Multiple daily sailings (summer), reduced winter",
    bikeCost: "From £25 return (bike + rider)",
    tips: "Book online in advance during summer — walk-up spaces for bikes can be unavailable by mid-morning. The crossing is short and scenic. You can also reach Skye via the toll-free Skye Bridge from Kyle of Lochalsh (no ferry needed). The Mallaig ferry is worth taking for the experience and to explore Skye's quieter Sleat peninsula. Grab fish and chips at Mallaig harbour while you wait.",
    image: "https://images.unsplash.com/photo-1500930287596-c1ecaa210c52?auto=format&fit=crop&w=800&q=80",
    url: "https://www.calmac.co.uk/mallaig-armadale-skye-ferry-timetable"
  },
  {
    slug: "outer-hebrides",
    name: "Outer Hebrides Ferries",
    operator: "CalMac Ferries",
    routes: ["Uig (Skye) → Tarbert, Harris (~1hr 40min)", "Uig → Lochmaddy, North Uist (~1hr 50min)", "Ullapool → Stornoway, Lewis (~2hrs 45min)", "Oban → Castlebay, Barra (~5hrs)"],
    frequency: "1–3 daily sailings depending on route and season",
    bikeCost: "From £30 return (bike + rider, varies by route)",
    tips: "Book well in advance — summer sailings fill up fast, especially for bikes. CalMac operates a 'flexible fares' system — cheaper if booked early. The Uig-Tarbert crossing is the most popular for riders coming from Skye. Rough crossings are common — the Minch can be wild. Check Sunday sailing schedules as some routes don't operate.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
    url: "https://www.calmac.co.uk"
  },
  {
    slug: "orkney",
    name: "Orkney Ferries",
    operator: "NorthLink Ferries / Pentland Ferries / John O'Groats Ferries",
    routes: ["Scrabster → Stromness (~1hr 30min, NorthLink)", "Gills Bay → St Margaret's Hope (~1hr, Pentland)", "Aberdeen → Kirkwall (~6hrs overnight, NorthLink)"],
    frequency: "Multiple daily on short crossings; daily overnight from Aberdeen",
    bikeCost: "From £40 return (Pentland, bike + rider)",
    tips: "Pentland Ferries from Gills Bay is the shortest and cheapest crossing. NorthLink from Scrabster is larger and more comfortable but pricier. The overnight ferry from Aberdeen includes cabin accommodation and is a good option from further south. Orkney itself is flat but fascinating — Skara Brae, the Ring of Brodgar, and Italian Chapel are must-sees. Wind is constant and fierce.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80",
    url: "https://www.northlinkferries.co.uk"
  }
];

const ROUTES = [
  {
    slug: "island-to-highlands",
    name: "Island To Highlands",
    tagline: "The signature VisorUp route — Guernsey to Scotland via the best of Britain",
    days: 14,
    miles: 1880,
    difficulty: "Intermediate",
    region: "UK-Wide",
    image: "public/images/routes/island-to-highlands.jpg",
    highlights: ["NC500", "Isle of Skye", "Bealach na Ba", "Cat and Fiddle", "Hardknott Pass"],
    description: "Our flagship route from Guernsey to the Scottish Highlands, taking in the best motorcycle roads in Britain. 14 days of waterfalls, mountain passes, coastal roads, and wild camping across England, Wales, and Scotland.",
    isLive: true,
    hasPlanner: true
  },
  {
    slug: "scottish-highlands-loop",
    name: "Scottish Highlands Loop",
    tagline: "A 7-day circular tour through Scotland's wildest and most dramatic landscapes",
    days: 7,
    miles: 650,
    difficulty: "Moderate",
    region: "Scotland",
    image: "public/images/routes/scottish-highlands-loop.jpg",
    highlights: ["Bealach na Ba", "Torridon", "Ullapool", "Kylesku Bridge", "Glen Affric"],
    description: "Starting and ending in Inverness, this 7-day loop takes in the finest Highland scenery. From the jaw-dropping Bealach na Ba to the remote beauty of Wester Ross, the wild north coast past Durness, and the tranquil Glen Affric on the return — this is Scotland at its most magnificent.",
    isLive: true,
    hasPlanner: false
  },
  {
    slug: "nc500-complete",
    name: "NC500 Complete",
    tagline: "Scotland's answer to Route 66 — the full 516-mile Highland circuit",
    days: 6,
    miles: 516,
    difficulty: "Moderate",
    region: "Scotland",
    image: "public/images/routes/nc500-complete.jpg",
    highlights: ["Bealach na Ba", "Applecross", "Smoo Cave", "Dunnet Head", "Duncansby Stacks"],
    description: "The North Coast 500 is one of the world's great coastal road trips. This 6-day itinerary covers every mile of the circuit from Inverness, taking in Applecross, the wild north coast, John O'Groats, and the scenic east coast return. Single-track roads, empty beaches, and endless horizons.",
    isLive: true,
    hasPlanner: false
  },
  {
    slug: "welsh-mountain-passes",
    name: "Welsh Mountain Passes",
    tagline: "5 days through Wales' finest mountain passes and waterfall country",
    days: 5,
    miles: 480,
    difficulty: "Moderate-Challenging",
    region: "Wales",
    image: "public/images/routes/welsh-mountain-passes.jpg",
    highlights: ["Llanberis Pass", "Gospel Pass", "Elan Valley", "Devil's Bridge", "Black Mountain"],
    description: "From the slate valleys of Snowdonia to the rolling Brecon Beacons, this 5-day route links Wales' greatest mountain passes with hidden reservoirs, historic bridges, and some of the most rewarding motorcycle roads in Britain.",
    isLive: true,
    hasPlanner: false
  },
  {
    slug: "lake-district-ultimate",
    name: "Lake District Ultimate",
    tagline: "England's steepest passes and most stunning lakes in 4 unforgettable days",
    days: 4,
    miles: 280,
    difficulty: "Challenging",
    region: "England",
    image: "public/images/routes/lake-district-ultimate.jpg",
    highlights: ["Hardknott Pass", "Wrynose Pass", "Kirkstone Pass", "Honister Pass", "Wastwater"],
    description: "Four days in England's most dramatic national park. Tackle Britain's steepest road over Hardknott Pass, cruise alongside deep glacial lakes, and wind through passes that'll have you grinning inside your helmet. Compact but intense — every mile counts.",
    isLive: true,
    hasPlanner: false
  },
  {
    slug: "channel-islands-explorer",
    name: "Channel Islands Explorer",
    tagline: "Jersey and Guernsey by motorcycle — island life at its finest",
    days: 5,
    miles: 120,
    difficulty: "Easy",
    region: "Channel Islands",
    image: "public/images/routes/channel-islands-explorer.jpg",
    highlights: ["Castle Cornet", "La Corbière", "Bouley Bay", "Little Chapel", "Mont Orgueil"],
    description: "A relaxed 5-day island-hopping adventure across Guernsey and Jersey. Tiny lanes, stunning coastal fortifications, WWII history, and some of the best seafood in the British Isles. The perfect warm-up tour or a standalone escape from the mainland.",
    isLive: true,
    hasPlanner: false
  },
  {
    slug: "coastal-cornwall",
    name: "Coastal Cornwall",
    tagline: "Atlantic Highway to Land's End and back along England's rugged south-west",
    days: 4,
    miles: 350,
    difficulty: "Easy",
    region: "England",
    image: "public/images/routes/coastal-cornwall.jpg",
    highlights: ["Atlantic Highway", "Land's End", "St Ives", "Tintagel Castle", "Lizard Point", "Minack Theatre"],
    description: "The Atlantic Highway sweeps along Cornwall's dramatic north coast before turning south to Land's End and around the Lizard Peninsula. Pasties, surf beaches, ancient castles, cliff-edge roads, and hidden fishing villages — this is England's sun-soaked south-west at its finest.",
    isLive: true,
    hasPlanner: false
  }
];


// ── Route Trip Data Lookup ────────────────────────────────────────
const ROUTE_TRIPS = {};
if (typeof SCOTTISH_HIGHLANDS_LOOP !== 'undefined') ROUTE_TRIPS['scottish-highlands-loop'] = SCOTTISH_HIGHLANDS_LOOP;
if (typeof NC500_COMPLETE !== 'undefined') ROUTE_TRIPS['nc500-complete'] = NC500_COMPLETE;
if (typeof WELSH_MOUNTAIN_PASSES !== 'undefined') ROUTE_TRIPS['welsh-mountain-passes'] = WELSH_MOUNTAIN_PASSES;
if (typeof LAKE_DISTRICT_ULTIMATE !== 'undefined') ROUTE_TRIPS['lake-district-ultimate'] = LAKE_DISTRICT_ULTIMATE;
if (typeof CHANNEL_ISLANDS_EXPLORER !== 'undefined') ROUTE_TRIPS['channel-islands-explorer'] = CHANNEL_ISLANDS_EXPLORER;
if (typeof COASTAL_CORNWALL !== 'undefined') ROUTE_TRIPS['coastal-cornwall'] = COASTAL_CORNWALL;

// ── VisorUpSite Class ────────────────────────────────────────────

class VisorUpSite {
  constructor() {
    this.siteView = null;
    this.plannerView = null;
    this.pageContent = null;
    this.currentPath = '';
  }

  init() {
    this.siteView = document.getElementById('siteView');
    this.plannerView = document.getElementById('plannerView');
    this.pageContent = document.getElementById('pageContent');

    // Ensure site view is scrollable
    if (this.siteView) {
      this.siteView.style.overflowY = 'auto';
    }

    // Bind events
    this.bindThemeToggle();
    this.bindMobileNav();
    this.bindPlannerBack();
    this.bindNavLinks();
    this.bindAuth();
    this.bindNotifications();

    // History API routing
    window.addEventListener('popstate', () => this.route(location.pathname));

    // Intercept internal link clicks for SPA navigation
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
      if (href.startsWith('/')) {
        e.preventDefault();
        if (href !== location.pathname) {
          history.pushState(null, '', href);
        }
        this.route(href);
      }
    });

    // Initial route
    this.route(location.pathname);
  }

  // ── Routing ──────────────────────────────────────────────────

  route(pathname) {
    // Close mobile menu and mega panels on navigation
    var mobileMenu = document.getElementById('navMobileMenu');
    if (mobileMenu) mobileMenu.classList.remove('open');
    var menuIcon = document.querySelector('#navMenuBtn i');
    if (menuIcon) menuIcon.className = 'fas fa-bars';
    document.querySelectorAll('.mob-sub, .mob-heading').forEach(function(el) { el.classList.remove('open'); });

    if (!pathname || pathname === '/') {
      this.showSiteView();
      this.pageContent.innerHTML = this.renderHome() + this.renderFooter();
      this.setActiveNav('home');
      this.setTitle('Motorcycle Adventures Across Britain');
      this._setMeta({ description: 'Plan epic motorcycle tours across Britain and the Channel Islands. Scenic roads, stunning viewpoints, GPX downloads, ferry guides.', image: 'public/images/heroes/homepage.jpg' });
      this.scrollToTop();
      return;
    }

    const path = pathname.replace(/^\//, '').replace(/\/$/, '');
    const parts = path.split('/');
    this.currentPath = path;

    switch (parts[0]) {
      case 'routes':
        if (parts[1] === 'island-to-highlands') {
          this.showPlannerView();
          this.setActiveNav('routes');
          this.setTitle('Island To Highlands — Route Planner');
        } else if (parts[1]) {
          var route = ROUTES.find(function(r) { return r.slug === parts[1] && r.isLive; });
          if (route) {
            this.showSiteView();
            this.pageContent.innerHTML = this.renderRouteDetail(route) + this.renderFooter();
            this.setActiveNav('routes');
            this.setTitle(route.name + ' — Motorcycle Route');
            this._setMeta({ description: route.tagline + ' — ' + route.days + ' days, ' + route.miles + ' miles.', image: route.image, type: 'article' });
            this.scrollToTop();
            var self = this;
            setTimeout(function() { self.initRouteGuideMap(route.slug); }, 100);
          } else {
            this.showSiteView();
            this.pageContent.innerHTML = this.render404();
            this.setTitle('Page Not Found');
            this.scrollToTop();
          }
        } else {
          this.showSiteView();
          this.pageContent.innerHTML = this.renderRoutes() + this.renderFooter();
          this.setActiveNav('routes');
          this.setTitle('Motorcycle Touring Routes');
          this._setMeta({ description: 'Curated motorcycle touring routes across Britain with interactive planners, GPX downloads, and day-by-day guides.', image: 'public/images/heroes/routes.jpg' });
          this.scrollToTop();
        }
        break;

      case 'destinations':
        if (parts[1]) {
          this.showSiteView();
          const dest = DESTINATIONS.find(function(d) { return d.slug === parts[1]; });
          if (dest) {
            this.pageContent.innerHTML = this.renderDestination(parts[1]) + this.renderFooter();
            this.setTitle(dest.name + ' — Motorcycle Destination Guide');
            this._setMeta({ description: dest.tagline, image: dest.image, type: 'article' });
            var self2 = this;
            setTimeout(function() { self2.initDestinationMap(dest); }, 100);
          } else {
            this.pageContent.innerHTML = this.render404();
            this.setTitle('Page Not Found');
          }
          this.setActiveNav('destinations');
          this.scrollToTop();
        } else {
          this.showSiteView();
          this.pageContent.innerHTML = this.renderDestinations() + this.renderFooter();
          this.setActiveNav('destinations');
          this.setTitle('Motorcycle Destinations — UK & Islands');
          this._setMeta({ description: 'Explore Britain by bike — detailed destination guides from the Highlands to the coast, with riding tips, POIs, and route suggestions.' });
          this.scrollToTop();
        }
        break;

      case 'ferries':
        if (parts[1]) {
          this.showSiteView();
          var ferry = FERRIES.find(function(f) { return f.slug === parts[1]; });
          if (ferry) {
            this.pageContent.innerHTML = this.renderFerryGuide(parts[1]) + this.renderFooter();
            this.setTitle(ferry.name + ' — Motorcycle Ferry Guide');
            this._setMeta({ description: ferry.name + ' — ' + ferry.operator + '. Motorcycle ferry guide with costs, booking tips, and what to expect. ' + ferry.bikeCost + '.', type: 'article' });
          } else {
            this.pageContent.innerHTML = this.render404();
            this.setTitle('Page Not Found');
          }
          this.setActiveNav('ferries');
          this.scrollToTop();
        } else {
          this.showSiteView();
          this.pageContent.innerHTML = this.renderFerries() + this.renderFooter();
          this.setActiveNav('ferries');
          this.setTitle('Motorcycle Ferry Guides');
          this._setMeta({ description: 'Everything you need to know about getting your motorcycle on a ferry in the UK — routes, costs, booking tips, and what to expect.' });
          this.scrollToTop();
        }
        break;

      case 'planning':
        this.showSiteView();
        this.pageContent.innerHTML = this.renderPlanning() + this.renderFooter();
        this.setActiveNav('planning');
        this.setTitle('Trip Planning Tools');
        this._setMeta({ description: 'Free motorcycle trip planning tools — packing lists, fuel strategy, weather guidance, and route planning for UK touring.' });
        this.scrollToTop();
        break;

      case 'bikes':
        if (parts[1]) {
          var bike = BIKES.find(function(b) { return b.slug === parts[1]; });
          if (bike) {
            this.showSiteView();
            this.pageContent.innerHTML = this.renderBikeDetail(bike) + this.renderFooter();
            this.setActiveNav('bikes');
            this.setTitle(bike.name + ' — Touring Setup Guide');
            this._setMeta({ description: bike.name + ' touring setup guide — specs, luggage options, and rider verdict for UK motorcycle touring.', image: bike.image, type: 'article' });
            this.scrollToTop();
          } else {
            this.showSiteView();
            this.pageContent.innerHTML = this.render404();
            this.setTitle('Page Not Found');
            this.scrollToTop();
          }
        } else {
          this.showSiteView();
          this.pageContent.innerHTML = this.renderBikes() + this.renderFooter();
          this.setActiveNav('bikes');
          this.setTitle('Motorcycle Touring Setup — Bike Guides');
          this._setMeta({ description: 'Touring bike guides with specs, luggage options, and rider verdicts — find the right motorcycle for your UK adventure.' });
          this.scrollToTop();
        }
        break;

      case 'gear':
        this.showSiteView();
        this.pageContent.innerHTML = this.renderComingSoon('Gear Reviews', 'In-depth reviews of motorcycle touring gear, luggage systems, and riding kit — tested on real British roads.', 'fa-helmet-safety') + this.renderFooter();
        this.setActiveNav('gear');
        this.setTitle('Gear Reviews — Coming Soon');
        this.scrollToTop();
        break;

      case 'reports':
        this.showSiteView();
        this.pageContent.innerHTML = this.renderComingSoon('Ride Reports', 'Real trip reports from riders who\'ve completed our routes — photos, tips, and stories from the road.', 'fa-pen-fancy') + this.renderFooter();
        this.setActiveNav('reports');
        this.setTitle('Ride Reports — Coming Soon');
        this.scrollToTop();
        break;

      case 'community':
        this.showSiteView();
        this.setActiveNav('community');
        this.setTitle('Community');
        this._setMeta({ description: 'VisorUp rider community — ride reports, activity feed, and shared adventures from motorcyclists across Britain.' });
        this.renderCommunity();
        this.scrollToTop();
        break;

      case 'build-route':
        this.showSiteView();
        this.pageContent.innerHTML = '<div id="routeBuilderContainer" style="height:calc(100vh - 60px);width:100%;"></div>';
        this.setActiveNav('planning');
        this.setTitle('Build Your Own Route');
        this._setMeta({ description: 'Free interactive motorcycle route builder — drag-and-drop waypoints, road-accurate routing, elevation profiles, fuel stations, and GPX export.' });
        if (typeof RouteBuilder !== 'undefined') {
          setTimeout(async function() {
            var rb = new RouteBuilder('routeBuilderContainer');

            // Load cloud trip if requested from profile
            var cloudTripId = sessionStorage.getItem('vu_load_trip');
            if (cloudTripId && typeof VisorUpTrips !== 'undefined') {
              sessionStorage.removeItem('vu_load_trip');
              try {
                var trip = await VisorUpTrips.get(cloudTripId);
                if (trip && trip.waypoints && trip.waypoints.length >= 2) {
                  rb._cloudTripId = trip.id;
                  var nameInput = rb.container.querySelector('#rb-routeName');
                  if (nameInput) nameInput.value = trip.name;
                  trip.waypoints.forEach(function(wp) { rb._addWaypoint(wp.lat, wp.lng); });
                  rb._buildRoute();
                  return;
                }
              } catch (e) { console.error('Failed to load cloud trip:', e); }
            }

            // Load shared trip waypoints
            var sharedWps = sessionStorage.getItem('vu_shared_waypoints');
            if (sharedWps) {
              sessionStorage.removeItem('vu_shared_waypoints');
              try {
                var wps = JSON.parse(sharedWps);
                if (Array.isArray(wps) && wps.length >= 2) {
                  wps.forEach(function(wp) { rb._addWaypoint(wp.lat, wp.lng); });
                  rb._buildRoute();
                  return;
                }
              } catch (e) { /* ignore */ }
            }

            // Load from trip planner
            var stored = sessionStorage.getItem('tp_waypoints');
            if (stored) {
              sessionStorage.removeItem('tp_waypoints');
              try {
                var wps2 = JSON.parse(stored);
                if (Array.isArray(wps2) && wps2.length >= 2 && rb._addWaypoint) {
                  for (var wi = 0; wi < wps2.length; wi++) {
                    rb._addWaypoint(wps2[wi].lat, wps2[wi].lng);
                  }
                  rb._buildRoute();
                  return;
                }
              } catch (e) { /* ignore */ }
            }

            // Load destination waypoints from ?dest= parameter
            var destParam = new URLSearchParams(window.location.search).get('dest');
            if (destParam && typeof DESTINATIONS !== 'undefined') {
              var dest = DESTINATIONS.find(function(d) { return d.slug === destParam; });
              if (dest && dest.waypoints && dest.waypoints.length >= 2) {
                var nameInput = rb.container.querySelector('#rb-routeName');
                if (nameInput) nameInput.value = 'Route to ' + dest.name;
                for (var di = 0; di < dest.waypoints.length; di++) {
                  var wp = dest.waypoints[di];
                  rb._addWaypoint(wp[0], wp[1], di === 0 ? dest.name + ' (start)' : null);
                }
                rb.map.setView(dest.center, 9);
              }
            }
          }, 50);
        }
        break;

      case 'guides':
        this.showSiteView();
        if (parts[1] && parts[2]) {
          var article = typeof ARTICLES !== 'undefined' && ARTICLES.find(function(a) { return a.category === parts[1] && a.slug === parts[2]; });
          if (article) {
            this.pageContent.innerHTML = this.renderArticle(article) + this.renderFooter();
            this.setActiveNav('guides');
            this.setTitle(article.title);
            this._setMeta({ description: article.metaDescription, image: article.heroImage, type: 'article' });
            this._injectJsonLd(article);
            this.scrollToTop();
          } else {
            this.pageContent.innerHTML = this.render404();
            this.setTitle('Page Not Found');
            this.scrollToTop();
          }
        } else if (parts[1]) {
          this.showSiteView();
          this.pageContent.innerHTML = this.renderGuideCategory(parts[1]) + this.renderFooter();
          this.setActiveNav('guides');
          var catName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
          this.setTitle(catName + ' Guides — Motorcycle Touring');
          this._setMeta({ description: catName + ' guides for UK motorcycle touring — expert tips, reviews, and advice.' });
          this.scrollToTop();
        } else {
          this.showSiteView();
          this.pageContent.innerHTML = this.renderGuides() + this.renderFooter();
          this.setActiveNav('guides');
          this.setTitle('Motorcycle Touring Guides — Tips, Gear, Routes & More');
          this._setMeta('In-depth motorcycle touring guides: gear reviews, route planning, scenic stops, bike setup, and seasonal riding tips for UK riders.');
          this.scrollToTop();
        }
        break;

      case 'plan-trip':
        this.showSiteView();
        this.pageContent.innerHTML = '<div id="tripPlannerContainer" style="height:calc(100vh - 60px);width:100%;"></div>';
        this.setActiveNav('planning');
        this.setTitle('AI Trip Planner');
        this._setMeta({ description: 'Plan your motorcycle trip with our AI-powered trip planner — personalised itineraries, accommodation, and POI suggestions.' });
        if (typeof AITripPlanner !== 'undefined') {
          setTimeout(function() { new AITripPlanner('tripPlannerContainer'); }, 50);
        }
        break;

      case 'login':
        this.showAuthModal('login');
        break;

      case 'signup':
        this.showAuthModal('signup');
        break;

      case 'profile':
        this.showSiteView();
        this.renderProfile();
        this.scrollToTop();
        break;

      case 'shared':
        if (parts[1]) {
          this.showSiteView();
          this.renderSharedTrip(parts[1]);
          this.scrollToTop();
        }
        break;

      case 'about':
        this.showSiteView();
        this.pageContent.innerHTML = this.renderAbout() + this.renderFooter();
        this.setTitle('About VisorUp');
        this._setMeta({ description: 'VisorUp is the definitive motorcycle touring resource for Britain — built by riders, for riders.' });
        this.scrollToTop();
        break;

      case 'contact':
        this.showSiteView();
        this.pageContent.innerHTML = this.renderContact() + this.renderFooter();
        this.setTitle('Contact Us');
        this._setMeta({ description: 'Get in touch with the VisorUp team — feedback, route suggestions, partnership enquiries.' });
        this.scrollToTop();
        break;

      case 'privacy':
        this.showSiteView();
        this.pageContent.innerHTML = this.renderPrivacy() + this.renderFooter();
        this.setTitle('Privacy Policy');
        this._setMeta({ description: 'VisorUp privacy policy — how we handle your data, cookies, and account information.' });
        this.scrollToTop();
        break;

      case 'terms':
        this.showSiteView();
        this.pageContent.innerHTML = this.renderTerms() + this.renderFooter();
        this.setTitle('Terms of Service');
        this._setMeta({ description: 'VisorUp terms of service — usage terms for our motorcycle touring tools and content.' });
        this.scrollToTop();
        break;

      default:
        this.showSiteView();
        this.pageContent.innerHTML = this.render404();
        this.setTitle('Page Not Found');
        this.scrollToTop();
        break;
    }
  }

  navigate(path) {
    var cleanPath = '/' + path.replace(/^\//, '');
    history.pushState(null, '', cleanPath);
    this.route(cleanPath);
  }

  // ── View Switching ────────────────────────────────────────────

  showSiteView() {
    document.body.classList.remove('planner-active');
    if (this.siteView) this.siteView.style.display = '';
    if (this.plannerView) this.plannerView.style.display = 'none';

    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  showPlannerView() {
    document.body.classList.add('planner-active');
    if (this.siteView) this.siteView.style.display = 'none';
    if (this.plannerView) this.plannerView.style.display = '';

    // Lock scroll for planner
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Init planner
    if (typeof initPlanner === 'function') {
      initPlanner();
    } else if (typeof planner !== 'undefined' && planner) {
      if (!planner.map) {
        planner.init();
      } else {
        planner.map.invalidateSize();
      }
    }
  }

  // ── Page Renderers ────────────────────────────────────────────

  renderHome() {
    var guideCards = '';
    if (typeof ARTICLES !== 'undefined' && ARTICLES.length) {
      var cats = ['gear','bikes','routes','destinations','planning','scenic','seasonal'];
      var picked = [];
      cats.forEach(function(c) { var a = ARTICLES.find(function(x) { return x.category === c && picked.indexOf(x.slug) === -1; }); if (a) picked.push(a.slug); });
      var featured = picked.map(function(s) { return ARTICLES.find(function(x) { return x.slug === s; }); }).filter(Boolean).slice(0, 6);
      guideCards = '<div class="home-guides-grid">' + featured.map(function(a) {
        return '<a href="/guides/' + a.category + '/' + a.slug + '" class="home-guide-card">' +
          '<div class="home-guide-card-img" style="background-image:url(' + a.heroImage + ')"></div>' +
          '<div class="home-guide-card-body">' +
            '<span class="home-guide-card-cat">' + a.category + '</span>' +
            '<h4>' + a.title + '</h4>' +
            '<span class="home-guide-card-meta">' + a.readTime + '</span>' +
          '</div>' +
        '</a>';
      }).join('') + '</div>';
    }

    var destCards = DESTINATIONS.slice(0, 6).map(function(d) {
      return '<div class="dest-card-wrapper">' +
        '<a href="/destinations/' + d.slug + '" class="dest-card">' +
          '<div class="dest-card-img" style="background-image:url(' + d.image + ')"></div>' +
          '<div class="dest-card-body">' +
            '<span class="dest-card-region">' + d.region + '</span>' +
            '<h3 class="dest-card-title">' + d.name + '</h3>' +
            '<p class="dest-card-tagline">' + d.tagline + '</p>' +
          '</div>' +
        '</a>' +
        '<button class="fav-btn card-fav-btn" data-fav-type="destination" data-fav-slug="' + d.slug + '" title="Favourite"><i class="fas fa-heart"></i></button>' +
      '</div>';
    }).join('');

    var ferryCards = FERRIES.slice(0, 4).map(function(f) {
      return '<a href="/ferries/' + f.slug + '" class="ferry-guide-card">' +
        '<div class="ferry-guide-card-icon"><i class="fas fa-ship"></i></div>' +
        '<div class="ferry-guide-card-body">' +
          '<h3>' + f.name + '</h3>' +
          '<p class="ferry-guide-operator">' + f.operator + '</p>' +
          '<p class="ferry-guide-cost">' + f.bikeCost + '</p>' +
        '</div>' +
        '<i class="fas fa-chevron-right ferry-guide-card-arrow"></i>' +
      '</a>';
    }).join('');

    return '' +
    '<!-- HERO -->' +
    '<section class="hero" style="background-image:url(public/images/heroes/homepage.jpg">' +
      '<div class="hero-overlay"></div>' +
      '<div class="hero-content">' +
        '<h1 class="hero-title">Motorcycle Adventures<br>Across Britain</h1>' +
        '<p class="hero-sub">From Island Roads To Highland Horizons</p>' +
        '<div class="hero-cta-group">' +
          '<a href="/routes/island-to-highlands" class="hero-cta">Explore Our Flagship Route <i class="fas fa-arrow-right"></i></a>' +
          '<a href="/build-route" class="hero-cta hero-cta-secondary">Build Your Own Route <i class="fas fa-pencil-ruler"></i></a>' +
        '</div>' +
        '<div class="hero-stats">' +
          '<div class="hero-stat"><span class="hero-stat-value">7</span><span class="hero-stat-label">Curated Routes</span></div>' +
          '<div class="hero-stat"><span class="hero-stat-value">9,900+</span><span class="hero-stat-label">Fuel Stations</span></div>' +
          '<div class="hero-stat"><span class="hero-stat-value">500+</span><span class="hero-stat-label">Points of Interest</span></div>' +
          '<div class="hero-stat"><span class="hero-stat-value">250</span><span class="hero-stat-label">Riding Guides</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="hero-scroll"><i class="fas fa-chevron-down"></i></div>' +
    '</section>' +

    '<!-- FEATURED ROUTE -->' +
    '<section class="home-section">' +
      '<div class="container">' +
        '<span class="section-eyebrow"><i class="fas fa-route"></i> Featured Route</span>' +
        '<h2 class="section-heading">Island To Highlands</h2>' +
        '<p class="section-desc">Our signature 14-day route from Guernsey to the Scottish Highlands — 1,880 miles of Britain\'s best motorcycle roads, with GPX downloads, curated stops, and ferry guides.</p>' +
        '<div class="featured-route-card" style="background-image:url(public/images/heroes/homepage.jpg">' +
          '<div class="featured-route-overlay"></div>' +
          '<div class="featured-route-content">' +
            '<div class="featured-route-stats">' +
              '<div class="featured-route-stat"><i class="fas fa-calendar"></i> 14 Days</div>' +
              '<div class="featured-route-stat"><i class="fas fa-road"></i> 1,880 Miles</div>' +
              '<div class="featured-route-stat"><i class="fas fa-map-pin"></i> 150+ Stops</div>' +
              '<div class="featured-route-stat"><i class="fas fa-star"></i> 7 Five-Star Roads</div>' +
            '</div>' +
            '<div class="featured-route-highlights">' +
              '<span>NC500</span><span>Isle of Skye</span><span>Bealach na Ba</span><span>Hardknott Pass</span><span>Cat and Fiddle</span>' +
            '</div>' +
            '<a href="/routes/island-to-highlands" class="hero-cta" style="margin-top:20px">Plan This Route <i class="fas fa-arrow-right"></i></a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<!-- DESTINATIONS -->' +
    '<section class="home-section home-section-alt">' +
      '<div class="container">' +
        '<span class="section-eyebrow"><i class="fas fa-map-marked-alt"></i> Destinations</span>' +
        '<h2 class="section-heading">Explore Britain by Bike</h2>' +
        '<p class="section-desc">From the otherworldly landscapes of Skye to the steep passes of the Lake District — detailed guides for every rider.</p>' +
        '<div class="dest-grid">' + destCards + '</div>' +
        '<div style="text-align:center;margin-top:32px">' +
          '<a href="/destinations" class="btn-outline">View All Destinations <i class="fas fa-arrow-right"></i></a>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<!-- FERRY GUIDES -->' +
    '<section class="home-section">' +
      '<div class="container">' +
        '<span class="section-eyebrow"><i class="fas fa-ship"></i> Ferry Guides</span>' +
        '<h2 class="section-heading">Motorcycle Ferry Travel</h2>' +
        '<p class="section-desc">Everything you need to know about getting your bike on a ferry — routes, costs, booking tips, and what to expect.</p>' +
        '<div class="ferry-guides-grid">' + ferryCards + '</div>' +
        '<div style="text-align:center;margin-top:32px">' +
          '<a href="/ferries" class="btn-outline">All Ferry Guides <i class="fas fa-arrow-right"></i></a>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<!-- ROUTE BUILDER -->' +
    '<section class="home-section home-section-alt">' +
      '<div class="container">' +
        '<div class="home-split">' +
          '<div class="home-split-text">' +
            '<span class="section-eyebrow"><i class="fas fa-pencil-ruler"></i> Route Builder</span>' +
            '<h2 class="section-heading">Build Your Perfect Ride</h2>' +
            '<p class="section-desc" style="text-align:left">Drop waypoints on an interactive map, get road-accurate routing, elevation profiles, fuel range warnings, and export GPX files — all free. Start from a destination or build from scratch.</p>' +
            '<ul class="home-feature-list">' +
              '<li><i class="fas fa-check"></i> Road-accurate routing via OSRM</li>' +
              '<li><i class="fas fa-check"></i> 9,900+ real UK fuel stations mapped</li>' +
              '<li><i class="fas fa-check"></i> Elevation profiles and ride time estimates</li>' +
              '<li><i class="fas fa-check"></i> One-click GPX export for your sat nav</li>' +
              '<li><i class="fas fa-check"></i> Save routes to your profile</li>' +
            '</ul>' +
            '<a href="/build-route" class="hero-cta" style="margin-top:20px;font-size:14px;">Open Route Builder <i class="fas fa-arrow-right"></i></a>' +
          '</div>' +
          '<div class="home-split-visual">' +
            '<div class="home-builder-preview">' +
              '<div class="builder-preview-bar"><span class="builder-dot"></span><span class="builder-dot"></span><span class="builder-dot"></span></div>' +
              '<div class="builder-preview-body">' +
                '<div class="builder-preview-map"><i class="fas fa-map-marked-alt"></i></div>' +
                '<div class="builder-preview-sidebar">' +
                  '<div class="builder-preview-wp"><span class="wp-dot wp-dot-start"></span> Start Point</div>' +
                  '<div class="builder-preview-wp"><span class="wp-dot wp-dot-mid"></span> Waypoint 1</div>' +
                  '<div class="builder-preview-wp"><span class="wp-dot wp-dot-mid"></span> Waypoint 2</div>' +
                  '<div class="builder-preview-wp"><span class="wp-dot wp-dot-end"></span> End Point</div>' +
                  '<div class="builder-preview-stats"><i class="fas fa-road"></i> 142 mi &nbsp; <i class="fas fa-clock"></i> 3h 20m</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<!-- GUIDES -->' +
    '<section class="home-section">' +
      '<div class="container">' +
        '<span class="section-eyebrow"><i class="fas fa-book-open"></i> Riding Guides</span>' +
        '<h2 class="section-heading">250 Guides for Every Rider</h2>' +
        '<p class="section-desc">Gear reviews, bike comparisons, route breakdowns, and seasonal tips — written by riders, for riders.</p>' +
        '<div class="home-guides-cats">' +
          '<a href="/guides/gear" class="home-guide-cat"><i class="fas fa-hard-hat"></i><span>Gear</span></a>' +
          '<a href="/guides/bikes" class="home-guide-cat"><i class="fas fa-motorcycle"></i><span>Bikes</span></a>' +
          '<a href="/guides/routes" class="home-guide-cat"><i class="fas fa-route"></i><span>Routes</span></a>' +
          '<a href="/guides/destinations" class="home-guide-cat"><i class="fas fa-map-pin"></i><span>Destinations</span></a>' +
          '<a href="/guides/planning" class="home-guide-cat"><i class="fas fa-clipboard-list"></i><span>Planning</span></a>' +
          '<a href="/guides/scenic" class="home-guide-cat"><i class="fas fa-mountain"></i><span>Scenic</span></a>' +
          '<a href="/guides/seasonal" class="home-guide-cat"><i class="fas fa-snowflake"></i><span>Seasonal</span></a>' +
        '</div>' +
        guideCards +
        '<div style="text-align:center;margin-top:32px">' +
          '<a href="/guides" class="btn-outline">Browse All Guides <i class="fas fa-arrow-right"></i></a>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<!-- FREE TOOLS -->' +
    '<section class="home-section home-section-alt">' +
      '<div class="container">' +
        '<span class="section-eyebrow"><i class="fas fa-tools"></i> Free Tools</span>' +
        '<h2 class="section-heading">Everything You Need to Plan a Tour</h2>' +
        '<p class="section-desc">Professional planning tools — completely free. Sign up to save your routes, trips, and favourites.</p>' +
        '<div class="tools-grid tools-grid-6">' +
          '<a href="/build-route" class="tool-card">' +
            '<div class="tool-card-icon"><i class="fas fa-pencil-ruler"></i></div>' +
            '<h3>Route Builder</h3>' +
            '<p>Interactive drag-and-drop route planner with road-accurate mapping</p>' +
          '</a>' +
          '<a href="/plan-trip" class="tool-card">' +
            '<div class="tool-card-icon"><i class="fas fa-calendar-alt"></i></div>' +
            '<h3>Trip Planner</h3>' +
            '<p>Multi-day itinerary builder with accommodation and POI suggestions</p>' +
          '</a>' +
          '<a href="/planning" class="tool-card">' +
            '<div class="tool-card-icon"><i class="fas fa-gas-pump"></i></div>' +
            '<h3>Fuel Finder</h3>' +
            '<p>9,900+ verified UK fuel stations with fuel range calculations</p>' +
          '</a>' +
          '<a href="/planning" class="tool-card">' +
            '<div class="tool-card-icon"><i class="fas fa-cloud-sun"></i></div>' +
            '<h3>Weather Guide</h3>' +
            '<p>Regional forecasts and best riding windows for every season</p>' +
          '</a>' +
          '<a href="/planning" class="tool-card">' +
            '<div class="tool-card-icon"><i class="fas fa-suitcase"></i></div>' +
            '<h3>Packing Lists</h3>' +
            '<p>Customisable checklists for weekends, week-long, and camping tours</p>' +
          '</a>' +
          '<a href="/bikes" class="tool-card">' +
            '<div class="tool-card-icon"><i class="fas fa-motorcycle"></i></div>' +
            '<h3>Bike Guide</h3>' +
            '<p>' + (typeof BIKES !== 'undefined' ? BIKES.length : 20) + ' touring bikes reviewed with spec comparisons and rider verdicts</p>' +
          '</a>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<!-- COMMUNITY -->' +
    '<section class="home-section">' +
      '<div class="container">' +
        '<div class="home-split home-split-reverse">' +
          '<div class="home-split-text">' +
            '<span class="section-eyebrow"><i class="fas fa-users"></i> Community</span>' +
            '<h2 class="section-heading">Your Garage. Your Profile. Your Rides.</h2>' +
            '<p class="section-desc" style="text-align:left">Create a free account to unlock the full VisorUp experience. Save routes, build your motorcycle garage, share trips with the community, and get personalised recommendations.</p>' +
            '<ul class="home-feature-list">' +
              '<li><i class="fas fa-check"></i> Build your motorcycle garage with photos</li>' +
              '<li><i class="fas fa-check"></i> Save unlimited routes and trips</li>' +
              '<li><i class="fas fa-check"></i> Share routes with a public link</li>' +
              '<li><i class="fas fa-check"></i> Favourite destinations and routes</li>' +
              '<li><i class="fas fa-check"></i> Connect with riders near you <span class="coming-soon-tag">Coming Soon</span></li>' +
            '</ul>' +
            '<a href="/signup" class="hero-cta" style="margin-top:20px;font-size:14px;">Create Free Account <i class="fas fa-user-plus"></i></a>' +
          '</div>' +
          '<div class="home-split-visual">' +
            '<div class="home-garage-preview">' +
              '<div class="garage-preview-header"><i class="fas fa-warehouse"></i> My Garage</div>' +
              '<div class="garage-preview-bikes">' +
                '<div class="garage-preview-bike"><div class="garage-preview-img"><i class="fas fa-motorcycle"></i></div><div class="garage-preview-name">BMW R 1250 GS<br><small>The Beast</small></div></div>' +
                '<div class="garage-preview-bike"><div class="garage-preview-img"><i class="fas fa-motorcycle"></i></div><div class="garage-preview-name">Triumph Tiger 900<br><small>Rally Pro</small></div></div>' +
              '</div>' +
              '<div class="garage-preview-stats"><span><i class="fas fa-route"></i> 12 routes</span><span><i class="fas fa-heart"></i> 8 favs</span><span><i class="fas fa-share-alt"></i> 3 shared</span></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<!-- NEWSLETTER -->' +
    '<section class="home-section newsletter-section">' +
      '<div class="container">' +
        '<div class="newsletter-inner">' +
          '<i class="fas fa-motorcycle newsletter-icon"></i>' +
          '<h2 class="section-heading">Join the Ride</h2>' +
          '<p class="section-desc">Get new routes, destination guides, and riding tips delivered to your inbox. No spam, just good roads.</p>' +
          '<form class="newsletter-form" onsubmit="event.preventDefault();this.querySelector(\'.newsletter-btn\').textContent=\'Subscribed!\'">' +
            '<input type="email" class="newsletter-input" placeholder="your@email.com" required>' +
            '<button type="submit" class="newsletter-btn">Subscribe</button>' +
          '</form>' +
        '</div>' +
      '</div>' +
    '</section>';
  }

  renderRoutes() {
    var cards = ROUTES.map(function(r) {
      var liveClass = r.isLive ? 'route-card-live' : 'route-card-soon';
      var href = r.isLive ? '/routes/' + r.slug : '/routes';
      var badge = r.hasPlanner
        ? '<span class="route-badge route-badge-planner"><i class="fas fa-play-circle"></i> Interactive Planner</span>'
        : r.isLive
          ? '<span class="route-badge route-badge-guide"><i class="fas fa-map-marked-alt"></i> Route Guide</span>'
          : '<span class="route-badge route-badge-soon"><i class="fas fa-clock"></i> Coming Soon</span>';

      return '<div class="route-card-wrapper">' +
        '<a href="' + href + '" class="route-card ' + liveClass + '">' +
          '<div class="route-card-bg" style="background-image:url(' + r.image + ')"></div>' +
          '<div class="route-card-overlay"></div>' +
          '<div class="route-card-content">' +
            badge +
            '<h3 class="route-card-title">' + r.name + '</h3>' +
            '<p class="route-card-tagline">' + r.tagline + '</p>' +
            '<div class="route-card-stats">' +
              '<span><i class="fas fa-calendar-day"></i> ' + r.days + ' days</span>' +
              '<span><i class="fas fa-road"></i> ' + r.miles + ' mi</span>' +
              '<span><i class="fas fa-signal"></i> ' + r.difficulty + '</span>' +
            '</div>' +
          '</div>' +
        '</a>' +
        '<button class="fav-btn card-fav-btn" data-fav-type="route" data-fav-slug="' + r.slug + '" title="Favourite"><i class="fas fa-heart"></i></button>' +
      '</div>';
    }).join('');

    return '' +
    '<section class="page-hero" style="background-image:url(public/images/heroes/routes.jpg">' +
      '<div class="hero-overlay"></div>' +
      '<div class="page-hero-content">' +
        '<h1 class="page-hero-title">Routes</h1>' +
        '<p class="page-hero-sub">Curated motorcycle touring routes across Britain — with interactive planners, GPX downloads, and day-by-day guides.</p>' +
      '</div>' +
    '</section>' +
    '<section class="page-section">' +
      '<div class="container">' +
        '<div class="routes-grid">' + cards + '</div>' +
      '</div>' +
    '</section>';
  }

  renderRouteDetail(r) {
    var highlightTags = r.highlights.map(function(h) {
      return '<li><i class="fas fa-star"></i> ' + h + '</li>';
    }).join('');

    return '' +
    '<section class="page-hero" style="background-image:url(' + r.image + ')">' +
      '<div class="hero-overlay"></div>' +
      '<div class="page-hero-content">' +
        '<h1 class="page-hero-title">' + r.name + '</h1>' +
        '<p class="page-hero-sub">' + r.tagline + '</p>' +
      '</div>' +
    '</section>' +
    '<section class="page-section">' +
      '<div class="container">' +
        '<nav class="breadcrumb">' +
          '<a href="/">Home</a> <i class="fas fa-chevron-right"></i> ' +
          '<a href="/routes">Routes</a> <i class="fas fa-chevron-right"></i> ' +
          '<span>' + r.name + '</span>' +
        '</nav>' +
        '<div class="detail-grid">' +
          '<div class="detail-main">' +
            '<h2 class="detail-heading">About This Route</h2>' +
            '<p class="detail-text">' + r.description + '</p>' +
            '<div class="tips-callout">' +
              '<div class="tips-callout-icon"><i class="fas fa-route"></i></div>' +
              '<div class="tips-callout-body">' +
                '<h4>Route Highlights</h4>' +
                '<ul class="info-list">' + highlightTags + '</ul>' +
              '</div>' +
            '</div>' +
            (ROUTE_TRIPS[r.slug] ? '<div id="routeGuideMap" style="width:100%;height:500px;border-radius:12px;margin-top:32px;border:1px solid var(--border);"></div>' +
              '<div class="route-map-legend" style="display:flex;gap:16px;flex-wrap:wrap;margin-top:12px;font-size:12px;color:var(--text-muted);">' +
                '<span><i class="fas fa-info-circle" style="color:var(--accent)"></i> Day-coloured route with POI markers. Click markers for details.</span>' +
              '</div>' : '') +
            '<div class="detail-cta" style="margin-top:32px;">' +
              (r.hasPlanner
                ? '<a href="/routes/' + r.slug + '" class="btn-primary"><i class="fas fa-map-marked-alt"></i> Open Interactive Planner</a>'
                : '<a href="/build-route" class="btn-primary" style="margin-right:12px;"><i class="fas fa-pencil-ruler"></i> Build Your Own Route</a>' +
                  '<a href="/routes" class="btn-outline"><i class="fas fa-arrow-left"></i> Back to All Routes</a>') +
            '</div>' +
          '</div>' +
          '<div class="detail-sidebar">' +
            '<div class="info-card"><h4><i class="fas fa-calendar"></i> Duration</h4><p>' + r.days + ' days</p></div>' +
            '<div class="info-card"><h4><i class="fas fa-road"></i> Distance</h4><p>~' + r.miles + ' miles</p></div>' +
            '<div class="info-card"><h4><i class="fas fa-signal"></i> Difficulty</h4><p>' + r.difficulty + '</p></div>' +
            '<div class="info-card"><h4><i class="fas fa-map-pin"></i> Region</h4><p>' + (r.region || 'UK') + '</p></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>';
  }

  initRouteGuideMap(slug) {
    var trip = ROUTE_TRIPS[slug];
    if (!trip || !trip.days || !document.getElementById('routeGuideMap')) return;

    var map = L.map('routeGuideMap', { scrollWheelZoom: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OSM &copy; CARTO',
      maxZoom: 19
    }).addTo(map);

    var dayColors = ['#FF6B6B','#FFA502','#FFD93D','#6BCB77','#4D96FF',
                     '#9B59B6','#FF6348','#00B894','#E17055','#0984E3',
                     '#FDCB6E','#A29BFE','#55EFC4','#D63031'];
    var markerColors = {
      ferry:'#3498db', landmark:'#9b59b6', viewpoint:'#e8713a', waterfall:'#00cec9',
      road:'#e74c3c', camp:'#27ae60', camping:'#27ae60', wildlife:'#f39c12', fuel:'#fdcb6e',
      beach:'#e17055', castle:'#6c5ce7', distillery:'#d35400', pub:'#c0392b',
      bridge:'#2d98da', fossil:'#cd853f', lighthouse:'#e8713a', museum:'#9b59b6',
      harbour:'#3498db', church:'#9b59b6', fort:'#6c5ce7', historical:'#9b59b6',
      cave:'#cd853f', 'road':'#e74c3c'
    };
    var markerFA = {
      ferry:'fa-ship', landmark:'fa-monument', viewpoint:'fa-binoculars', waterfall:'fa-water',
      road:'fa-road', camp:'fa-campground', camping:'fa-campground', wildlife:'fa-paw', fuel:'fa-gas-pump',
      beach:'fa-umbrella-beach', castle:'fa-chess-rook', distillery:'fa-flask', pub:'fa-beer-mug-empty',
      bridge:'fa-bridge', fossil:'fa-bone', lighthouse:'fa-tower-observation', museum:'fa-landmark',
      harbour:'fa-anchor', church:'fa-church', fort:'fa-chess-rook', historical:'fa-scroll',
      cave:'fa-mountain'
    };
    var markerSizes = {
      ferry:32, landmark:28, viewpoint:28, waterfall:28, road:28, camp:30, camping:30,
      wildlife:26, fuel:24, beach:28, castle:28, distillery:26, pub:26, bridge:30,
      fossil:28, lighthouse:28, museum:28, harbour:28, church:26, fort:28, historical:26, cave:26
    };
    var allBounds = [];

    function makeIcon(type) {
      var color = markerColors[type] || '#e8713a';
      var fa = markerFA[type] || 'fa-map-pin';
      var sz = markerSizes[type] || 28;
      return L.divIcon({
        className: '',
        html: '<div class="custom-marker" style="width:' + sz + 'px;height:' + sz + 'px;background:' + color + '"><i class="fas ' + fa + '" style="font-size:' + Math.round(sz * 0.4) + 'px"></i></div>',
        iconSize: [sz, sz],
        iconAnchor: [sz / 2, sz / 2],
        popupAnchor: [0, -(sz / 2) - 4]
      });
    }

    // OSRM road routing per day (async)
    var osrmQueue = [];
    trip.days.forEach(function(day, i) {
      var color = dayColors[i % dayColors.length];
      var points = day.route || day.waypoints;
      if (points && points.length > 1) {
        osrmQueue.push({ points: points, color: color, dayIndex: i, title: day.title || day.name || '' });
        points.forEach(function(p) { allBounds.push([p[0], p[1]]); });
      }

      // Render stop markers immediately (no waiting for OSRM)
      if (day.stops) {
        day.stops.forEach(function(stop) {
          var stars = '';
          if (stop.rating) { for (var s = 0; s < stop.rating; s++) stars += '★'; }
          var m = L.marker([stop.lat, stop.lng], { icon: makeIcon(stop.type) }).addTo(map);
          m.bindPopup(
            '<div style="font-size:13px;max-width:220px;">' +
              '<b>' + stop.name + '</b>' +
              (stars ? '<br><span style="color:#f39c12">' + stars + '</span>' : '') +
              '<div style="color:' + (markerColors[stop.type] || '#e8713a') + ';font-size:11px;font-weight:600;margin:2px 0;">' + (stop.type || '') + ' · Day ' + (i + 1) + '</div>' +
              (stop.description ? '<span style="color:#aaa;font-size:11px;">' + stop.description.substring(0, 140) + '</span>' : '') +
            '</div>'
          );
          allBounds.push([stop.lat, stop.lng]);
        });
      }
    });

    // Fit bounds to all data immediately (straight-line extent)
    if (allBounds.length > 0) {
      map.fitBounds(allBounds, { padding: [30, 30] });
    }

    // Fetch OSRM routes one by one with delay to avoid rate limiting
    var self = this;
    (function processQueue(idx) {
      if (idx >= osrmQueue.length) return;
      var item = osrmQueue[idx];
      var pts = item.points;
      // OSRM limit: max ~100 coords per request — sample if needed
      var sampled = pts;
      if (pts.length > 80) {
        sampled = [];
        var step = Math.ceil(pts.length / 70);
        for (var k = 0; k < pts.length; k += step) sampled.push(pts[k]);
        if (sampled[sampled.length - 1] !== pts[pts.length - 1]) sampled.push(pts[pts.length - 1]);
      }
      var coords = sampled.map(function(p) { return p[1].toFixed(6) + ',' + p[0].toFixed(6); }).join(';');
      fetch('https://router.project-osrm.org/route/v1/driving/' + coords + '?overview=full&geometries=geojson')
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (data.code === 'Ok' && data.routes && data.routes[0]) {
            var geom = data.routes[0].geometry.coordinates.map(function(c) { return [c[1], c[0]]; });
            L.polyline(geom, { color: item.color, weight: 4, opacity: 0.85 }).addTo(map)
              .bindPopup('<b>Day ' + (item.dayIndex + 1) + '</b><br>' + item.title);
          } else {
            // Fallback: straight lines
            var ll = pts.map(function(p) { return [p[0], p[1]]; });
            L.polyline(ll, { color: item.color, weight: 3, opacity: 0.6, dashArray: '6,4' }).addTo(map)
              .bindPopup('<b>Day ' + (item.dayIndex + 1) + '</b><br>' + item.title);
          }
        })
        .catch(function() {
          var ll = pts.map(function(p) { return [p[0], p[1]]; });
          L.polyline(ll, { color: item.color, weight: 3, opacity: 0.6, dashArray: '6,4' }).addTo(map);
        })
        .finally(function() {
          setTimeout(function() { processQueue(idx + 1); }, 600);
        });
    })(0);
  }

  initDestinationMap(dest) {
    var mapEl = document.getElementById('destMap');
    if (!mapEl || !dest.waypoints || dest.waypoints.length < 2) return;

    var map = L.map('destMap', { scrollWheelZoom: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OSM &copy; CARTO', maxZoom: 19
    }).addTo(map);

    var wps = dest.waypoints;
    var bounds = L.latLngBounds(wps.map(function(w) { return [w[0], w[1]]; }));
    map.fitBounds(bounds, { padding: [40, 40] });

    // Add numbered waypoint markers
    for (var i = 0; i < wps.length; i++) {
      var isStart = (i === 0);
      var isEnd = (i === wps.length - 1 && wps[0][0] === wps[wps.length - 1][0] && wps[0][1] === wps[wps.length - 1][1]);
      if (isEnd && wps.length > 2) continue;
      var color = isStart ? '#27ae60' : '#D68A2D';
      var label = isStart ? 'S' : String(i);
      var icon = L.divIcon({
        className: '',
        html: '<div class="custom-marker" style="width:26px;height:26px;background:' + color + ';font-size:11px;font-weight:700;color:#fff;">' + label + '</div>',
        iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -17]
      });
      L.marker([wps[i][0], wps[i][1]], { icon: icon }).addTo(map)
        .bindPopup('<b>' + (isStart ? 'Start / Finish' : 'Waypoint ' + i) + '</b>');
    }

    // Also show relevant POIs from external data near this destination
    var poiSources = [];
    if (typeof POI_SCOTLAND !== 'undefined') poiSources.push(POI_SCOTLAND);
    if (typeof POI_ENGLAND !== 'undefined') poiSources.push(POI_ENGLAND);
    if (typeof POI_WALES_ISLANDS !== 'undefined') poiSources.push(POI_WALES_ISLANDS);

    var markerColors = {
      campsites:'#27ae60', bridges:'#2d98da', wildlife:'#f39c12', roads:'#e74c3c',
      fuel:'#fdcb6e', viewpoints:'#e8713a', pubs:'#c0392b', castles:'#6c5ce7',
      waterfalls:'#00cec9', beaches:'#e17055', distilleries:'#d35400',
      landmarks:'#9b59b6', fossils:'#cd853f', ferries:'#3498db'
    };
    var markerFA = {
      campsites:'fa-campground', bridges:'fa-bridge', wildlife:'fa-paw', roads:'fa-road',
      fuel:'fa-gas-pump', viewpoints:'fa-binoculars', pubs:'fa-beer-mug-empty',
      castles:'fa-chess-rook', waterfalls:'fa-water', beaches:'fa-umbrella-beach',
      distilleries:'fa-flask', landmarks:'fa-monument', fossils:'fa-bone', ferries:'fa-ship'
    };

    var poiRange = 0.5;
    var latMin = dest.center[0] - poiRange, latMax = dest.center[0] + poiRange;
    var lngMin = dest.center[1] - poiRange, lngMax = dest.center[1] + poiRange;

    for (var s = 0; s < poiSources.length; s++) {
      var src = poiSources[s];
      for (var cat in src) {
        if (!Array.isArray(src[cat])) continue;
        var color2 = markerColors[cat] || '#e8713a';
        var fa = markerFA[cat] || 'fa-map-pin';
        for (var p = 0; p < src[cat].length; p++) {
          var poi = src[cat][p];
          if (poi.lat >= latMin && poi.lat <= latMax && poi.lng >= lngMin && poi.lng <= lngMax) {
            var pIcon = L.divIcon({
              className: '',
              html: '<div class="custom-marker" style="width:22px;height:22px;background:' + color2 + '"><i class="fas ' + fa + '" style="font-size:9px"></i></div>',
              iconSize: [22, 22], iconAnchor: [11, 11], popupAnchor: [0, -15]
            });
            L.marker([poi.lat, poi.lng], { icon: pIcon }).addTo(map)
              .bindPopup('<div style="font-size:12px;"><b>' + poi.name + '</b><br><span style="color:' + color2 + ';font-size:11px;font-weight:600;">' + cat + '</span>' +
                (poi.desc ? '<br><span style="color:#aaa;font-size:11px;">' + poi.desc.substring(0, 120) + '</span>' : '') + '</div>');
          }
        }
      }
    }

    // OSRM route through waypoints
    var coords = wps.map(function(w) { return w[1].toFixed(6) + ',' + w[0].toFixed(6); }).join(';');
    fetch('https://router.project-osrm.org/route/v1/driving/' + coords + '?overview=full&geometries=geojson')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.code === 'Ok' && data.routes && data.routes[0]) {
          var geom = data.routes[0].geometry.coordinates.map(function(c) { return [c[1], c[0]]; });
          L.polyline(geom, { color: '#D68A2D', weight: 4, opacity: 0.85 }).addTo(map);
          var distMiles = Math.round(data.routes[0].distance / 1609.34);
          var durHrs = Math.round(data.routes[0].duration / 3600 * 10) / 10;
          var statsEl = document.querySelector('#destMap + div');
          if (statsEl) {
            statsEl.innerHTML = '<span><i class="fas fa-route" style="color:var(--accent)"></i> ~' + distMiles + ' miles · ~' + durHrs + 'h ride time</span>' +
              '<span><i class="fas fa-map-pin" style="color:var(--accent)"></i> Click markers for details</span>';
          }
        } else {
          L.polyline(wps.map(function(w) { return [w[0], w[1]]; }), { color: '#D68A2D', weight: 3, opacity: 0.6, dashArray: '6,4' }).addTo(map);
        }
      })
      .catch(function() {
        L.polyline(wps.map(function(w) { return [w[0], w[1]]; }), { color: '#D68A2D', weight: 3, opacity: 0.6, dashArray: '6,4' }).addTo(map);
      });
  }

  renderDestinations() {
    var regions = ['All', 'Scotland', 'England', 'Wales', 'Islands'];
    var pills = regions.map(function(r) {
      var active = r === 'All' ? 'filter-pill-active' : '';
      return '<button class="filter-pill ' + active + '" data-filter="' + r + '">' + r + '</button>';
    }).join('');

    var cards = DESTINATIONS.map(function(d) {
      return '<div class="dest-card-wrapper">' +
        '<a href="/destinations/' + d.slug + '" class="dest-card" data-region="' + d.region + '">' +
          '<div class="dest-card-img" style="background-image:url(' + d.image + ')"></div>' +
          '<div class="dest-card-body">' +
            '<span class="dest-card-region">' + d.region + '</span>' +
            '<h3 class="dest-card-title">' + d.name + '</h3>' +
            '<p class="dest-card-tagline">' + d.tagline + '</p>' +
          '</div>' +
        '</a>' +
        '<button class="fav-btn card-fav-btn" data-fav-type="destination" data-fav-slug="' + d.slug + '" title="Favourite"><i class="fas fa-heart"></i></button>' +
      '</div>';
    }).join('');

    return '' +
    '<section class="page-hero" style="background-image:url(public/images/heroes/destinations.jpg">' +
      '<div class="hero-overlay"></div>' +
      '<div class="page-hero-content">' +
        '<h1 class="page-hero-title">Destinations</h1>' +
        '<p class="page-hero-sub">In-depth guides to Britain\'s greatest motorcycle destinations — real roads, real places, real advice from riders.</p>' +
      '</div>' +
    '</section>' +
    '<section class="page-section">' +
      '<div class="container">' +
        '<div class="filter-pills">' + pills + '</div>' +
        '<div class="dest-grid" id="destGrid">' + cards + '</div>' +
      '</div>' +
    '</section>';
  }

  renderDestination(slug) {
    var d = DESTINATIONS.find(function(dest) { return dest.slug === slug; });
    if (!d) return this.render404();

    var roads = d.topRoads.map(function(r) { return '<li><i class="fas fa-road"></i> ' + r + '</li>'; }).join('');
    var highlights = d.highlights.map(function(h) { return '<li><i class="fas fa-map-pin"></i> ' + h + '</li>'; }).join('');

    return '' +
    '<section class="page-hero" style="background-image:url(' + d.image + ')">' +
      '<div class="hero-overlay"></div>' +
      '<div class="page-hero-content">' +
        '<h1 class="page-hero-title">' + d.name + '</h1>' +
        '<p class="page-hero-sub">' + d.tagline + '</p>' +
      '</div>' +
    '</section>' +
    '<section class="page-section">' +
      '<div class="container">' +
        '<nav class="breadcrumb"><a href="/">Home</a> <i class="fas fa-chevron-right"></i> <a href="/destinations">Destinations</a> <i class="fas fa-chevron-right"></i> <span>' + d.name + '</span></nav>' +

        '<div class="detail-grid">' +
          '<div class="detail-main">' +
            '<h2 class="detail-heading">Overview</h2>' +
            '<p class="detail-text">' + d.overview + '</p>' +
            (d.waypoints && d.waypoints.length > 1 ?
              '<h3 class="detail-heading" style="margin-top:32px;"><i class="fas fa-map-marked-alt" style="color:var(--accent);margin-right:6px;"></i>Destination Route Map</h3>' +
              '<div id="destMap" style="width:100%;height:450px;border-radius:12px;margin-top:12px;border:1px solid var(--border);"></div>' +
              '<div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:10px;font-size:12px;color:var(--text-muted);">' +
                '<span><i class="fas fa-route" style="color:var(--accent)"></i> ' + d.waypoints.length + ' waypoints · OSRM road-accurate route</span>' +
                '<span><i class="fas fa-map-pin" style="color:var(--accent)"></i> Click markers for details</span>' +
              '</div>'
            : '') +
          '</div>' +
          '<div class="detail-sidebar">' +
            '<div class="info-card">' +
              '<h4><i class="fas fa-calendar-alt"></i> Best Time to Visit</h4>' +
              '<p>' + d.bestTime + '</p>' +
            '</div>' +
            '<div class="info-card">' +
              '<h4><i class="fas fa-road"></i> Top Roads</h4>' +
              '<ul class="info-list">' + roads + '</ul>' +
            '</div>' +
            '<div class="info-card">' +
              '<h4><i class="fas fa-star"></i> Key Highlights</h4>' +
              '<ul class="info-list">' + highlights + '</ul>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="tips-callout">' +
          '<div class="tips-callout-icon"><i class="fas fa-lightbulb"></i></div>' +
          '<div class="tips-callout-body">' +
            '<h4>Rider\'s Tips</h4>' +
            '<p>' + d.tips + '</p>' +
          '</div>' +
        '</div>' +

        '<div class="detail-cta" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">' +
          '<a href="/build-route?dest=' + d.slug + '" class="hero-cta"><i class="fas fa-pencil-ruler"></i> Plan a Route to ' + d.name + ' <i class="fas fa-arrow-right"></i></a>' +
          '<button class="fav-btn" data-fav-type="destination" data-fav-slug="' + d.slug + '" title="Favourite"><i class="fas fa-heart"></i></button>' +
        '</div>' +
      '</div>' +
    '</section>';
  }

  renderFerries() {
    var cards = FERRIES.map(function(f) {
      var routesList = f.routes.map(function(r) { return '<li><i class="fas fa-anchor"></i> ' + r + '</li>'; }).join('');

      return '<a href="/ferries/' + f.slug + '" class="ferry-full-card">' +
        '<div class="ferry-full-card-header">' +
          '<div class="ferry-full-card-icon"><i class="fas fa-ship"></i></div>' +
          '<div>' +
            '<h3>' + f.name + '</h3>' +
            '<span class="ferry-operator">' + f.operator + '</span>' +
          '</div>' +
        '</div>' +
        '<ul class="ferry-routes-list">' + routesList + '</ul>' +
        '<div class="ferry-full-card-meta">' +
          '<span><i class="fas fa-motorcycle"></i> ' + f.bikeCost + '</span>' +
          '<span><i class="fas fa-calendar"></i> ' + f.frequency + '</span>' +
        '</div>' +
      '</a>';
    }).join('');

    return '' +
    '<section class="page-hero" style="background-image:url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1920&q=80)">' +
      '<div class="hero-overlay"></div>' +
      '<div class="page-hero-content">' +
        '<h1 class="page-hero-title">Motorcycle Ferry Guides</h1>' +
        '<p class="page-hero-sub">Everything riders need to know about getting your bike on a ferry — routes, costs, tips, and booking advice.</p>' +
      '</div>' +
    '</section>' +
    '<section class="page-section">' +
      '<div class="container">' +
        '<div class="ferry-intro">' +
          '<p>Ferry travel opens up Britain\'s most spectacular riding destinations — from the Channel Islands to the Isle of Skye, the Outer Hebrides to Orkney. Booking bike spaces early is essential, especially in summer, as motorcycle slots are limited on most services. Here are the key ferry routes for British motorcycle touring.</p>' +
        '</div>' +
        '<div class="ferry-grid">' + cards + '</div>' +
      '</div>' +
    '</section>';
  }

  renderFerryGuide(slug) {
    var f = FERRIES.find(function(ferry) { return ferry.slug === slug; });
    if (!f) return this.render404();

    var routesList = f.routes.map(function(r) {
      return '<div class="ferry-route-item"><i class="fas fa-anchor"></i> ' + r + '</div>';
    }).join('');

    return '' +
    '<section class="page-hero" style="background-image:url(' + f.image + ')">' +
      '<div class="hero-overlay"></div>' +
      '<div class="page-hero-content">' +
        '<h1 class="page-hero-title">' + f.name + '</h1>' +
        '<p class="page-hero-sub">' + f.operator + '</p>' +
      '</div>' +
    '</section>' +
    '<section class="page-section">' +
      '<div class="container">' +
        '<nav class="breadcrumb"><a href="/">Home</a> <i class="fas fa-chevron-right"></i> <a href="/ferries">Ferries</a> <i class="fas fa-chevron-right"></i> <span>' + f.name + '</span></nav>' +

        '<div class="detail-grid">' +
          '<div class="detail-main">' +
            '<h2 class="detail-heading">Routes</h2>' +
            '<div class="ferry-routes-detail">' + routesList + '</div>' +

            '<h2 class="detail-heading" style="margin-top:32px">Tips for Motorcycle Ferry Travel</h2>' +
            '<p class="detail-text">' + f.tips + '</p>' +
          '</div>' +
          '<div class="detail-sidebar">' +
            '<div class="info-card">' +
              '<h4><i class="fas fa-building"></i> Operator</h4>' +
              '<p>' + f.operator + '</p>' +
            '</div>' +
            '<div class="info-card">' +
              '<h4><i class="fas fa-motorcycle"></i> Bike Cost</h4>' +
              '<p>' + f.bikeCost + '</p>' +
            '</div>' +
            '<div class="info-card">' +
              '<h4><i class="fas fa-calendar"></i> Frequency</h4>' +
              '<p>' + f.frequency + '</p>' +
            '</div>' +
            '<div class="info-card">' +
              '<a href="' + f.url + '" target="_blank" rel="noopener" class="ferry-book-btn"><i class="fas fa-external-link-alt"></i> Book on ' + f.operator + '</a>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="tips-callout">' +
          '<div class="tips-callout-icon"><i class="fas fa-lightbulb"></i></div>' +
          '<div class="tips-callout-body">' +
            '<h4>General Ferry Tips for Bikers</h4>' +
            '<p>Always arrive at least 90 minutes before departure. Tie-down straps are usually provided but bring your own for peace of mind. Remove loose items from the bike. Leave panniers on but take valuables with you. Check weather conditions — rough crossings are common, especially in the Irish Sea and Minch. Book bike spaces as early as possible.</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>';
  }

  renderPlanning() {
    var packingItems = [
      'Waterproofs — jacket, trousers, overboots (it\'s the UK, expect rain any day)',
      'Tank bag or tail pack with dry bags / roll-top bags',
      'Chain lube + basic toolkit (spanners, Allen keys, pliers)',
      'Tyre repair kit + mini 12V compressor',
      'Phone mount + USB charger / powerbank',
      'Offline OS Maps downloaded (no signal in Highlands/rural Wales)',
      'First aid kit (compact motorcycle-specific)',
      'Cable lock for helmets at stops',
      'Bungee cords / ROK straps for securing gear',
      'Earplugs (long motorway stretches and wind noise)',
      'Visor cleaner + microfibre cloth',
      'Spare key in a separate bag',
      'Camping: tent, sleeping bag, mat, compact stove, pot, lighter',
      'Midge head net + Smidge repellent (essential June–September in Scotland)',
      'Disc lock with reminder cable',
      'High-vis vest (for breakdowns and ferries)'
    ];

    var packingList = packingItems.map(function(item) {
      return '<li><i class="fas fa-check-circle"></i> ' + item + '</li>';
    }).join('');

    return '' +
    '<section class="page-hero" style="background-image:url(public/images/heroes/homepage.jpg">' +
      '<div class="hero-overlay"></div>' +
      '<div class="page-hero-content">' +
        '<h1 class="page-hero-title">Trip Planning Tools</h1>' +
        '<p class="page-hero-sub">Everything you need to prepare for a multi-day motorcycle tour across Britain.</p>' +
      '</div>' +
    '</section>' +
    '<section class="page-section">' +
      '<div class="container">' +

        '<div class="tips-callout" style="margin-bottom:40px;border-left:4px solid var(--accent);cursor:pointer;" onclick="history.pushState(null,\'\',\'/plan-trip\');site.route(\'/plan-trip\')">' +
          '<div class="tips-callout-icon" style="font-size:28px;"><i class="fas fa-wand-magic-sparkles"></i></div>' +
          '<div class="tips-callout-body">' +
            '<h4 style="font-size:18px;margin-bottom:4px;">AI Trip Planner</h4>' +
            '<p>Tell us where you\'re starting, how many days you\'ve got, and what you want to see — we\'ll build the perfect route for you. Includes overnight stops, OSRM routing, and GPX export.</p>' +
            '<span style="color:var(--accent);font-weight:600;font-size:13px;margin-top:8px;display:inline-block;">Plan My Trip <i class="fas fa-arrow-right"></i></span>' +
          '</div>' +
        '</div>' +

        '<div class="tools-grid" style="margin-bottom:48px">' +
          '<a href="/plan-trip" class="tool-card" style="text-decoration:none;color:inherit;">' +
            '<div class="tool-card-icon" style="color:var(--accent)"><i class="fas fa-wand-magic-sparkles"></i></div>' +
            '<h3>Trip Planner</h3>' +
            '<p>Tell us your start, duration and interests — we build the route for you</p>' +
          '</a>' +
          '<a href="/build-route" class="tool-card" style="text-decoration:none;color:inherit;">' +
            '<div class="tool-card-icon"><i class="fas fa-pencil-ruler"></i></div>' +
            '<h3>Route Builder</h3>' +
            '<p>Full custom route planner with elevation, weather, fuel and cost tools</p>' +
          '</a>' +
          '<div class="tool-card">' +
            '<div class="tool-card-icon"><i class="fas fa-cloud-sun"></i></div>' +
            '<h3>Weather Guide</h3>' +
            '<p>Best months for each region and how to ride safely in the rain</p>' +
          '</div>' +
          '<div class="tool-card">' +
            '<div class="tool-card-icon"><i class="fas fa-gas-pump"></i></div>' +
            '<h3>Fuel Strategy</h3>' +
            '<p>Know where to fill up in remote areas — never run dry in the Highlands</p>' +
          '</div>' +
        '</div>' +

        '<h2 class="section-heading">Motorcycle Touring Packing List</h2>' +
        '<p class="section-desc" style="margin-bottom:24px">A comprehensive packing list for multi-day British motorcycle tours. Adjust based on whether you\'re camping or using accommodation.</p>' +
        '<div class="packing-checklist">' +
          '<ul class="packing-list-site">' + packingList + '</ul>' +
        '</div>' +

        '<h2 class="section-heading" style="margin-top:48px">Fuel Strategy</h2>' +
        '<p class="section-desc" style="margin-bottom:24px">Rural Britain has sparse fuel stations. Here\'s how to avoid running dry.</p>' +
        '<div class="planning-tips-grid">' +
          '<div class="planning-tip-card">' +
            '<h4><i class="fas fa-gas-pump"></i> The Golden Rule</h4>' +
            '<p>Fill up every 100 miles. In the Scottish Highlands and rural Wales, never pass a fuel station below half tank. Plan your fills around the towns — Ullapool, Durness, Tongue, and Portree are key stops on the NC500.</p>' +
          '</div>' +
          '<div class="planning-tip-card">' +
            '<h4><i class="fas fa-exclamation-triangle"></i> Known Fuel Gaps</h4>' +
            '<p>Tyndrum to Fort William (30 miles — fine). Ullapool to Durness (60 miles — watch it). Applecross has NO fuel. Skye only has reliable fuel in Portree. Mid-Wales between Rhayader and the coast is sparse.</p>' +
          '</div>' +
          '<div class="planning-tip-card">' +
            '<h4><i class="fas fa-motorcycle"></i> Tank Ranges</h4>' +
            '<p>Know your bike\'s real touring range — it\'s less than you think with luggage and headwinds. A GSX-R1000 with a 17L tank gets around 150 miles touring. A Ninja 650 with 15L gets around 220 miles. Always carry a reserve margin.</p>' +
          '</div>' +
          '<div class="planning-tip-card">' +
            '<h4><i class="fas fa-map-marked-alt"></i> Opening Hours</h4>' +
            '<p>Rural petrol stations often close at 6pm or earlier. Some don\'t open Sundays, especially on Scottish islands. Pay-at-pump stations are your friend for late arrivals. Download the Waze or Google Maps offline fuel station layer.</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>';
  }

  renderCommunity() {
    if (typeof VisorUpCommunity === 'undefined') {
      this.pageContent.innerHTML = this.renderComingSoon('Community', 'Coming soon.', 'fa-users') + this.renderFooter();
      return;
    }

    var feed = VisorUpCommunity.generateActivityFeed();
    var feedHTML = '';
    if (feed.length === 0) {
      feedHTML = '<div class="feed-empty"><i class="fas fa-motorcycle"></i><p>No activity yet. Log a ride, visit a destination, or post a ride report to get started!</p></div>';
    } else {
      feedHTML = feed.map(function(item) { return VisorUpCommunity.renderPostCard(item); }).join('');
    }

    this.pageContent.innerHTML = '' +
    '<section class="page-hero" style="background-image:url(public/images/heroes/homepage.jpg)">' +
      '<div class="hero-overlay"></div>' +
      '<div class="page-hero-content">' +
        '<h1 class="page-hero-title">Community</h1>' +
        '<p class="page-hero-sub">Ride reports, shared adventures, and activity from riders across Britain.</p>' +
      '</div>' +
    '</section>' +
    '<section class="page-section">' +
      '<div class="container">' +
        '<div class="feed-layout">' +
          '<div class="feed-main">' +
            '<div class="feed-compose">' +
              '<div class="feed-compose-header"><i class="fas fa-pen"></i> Share a Ride Report</div>' +
              '<input type="text" id="feedPostTitle" class="feed-compose-title" placeholder="Give your ride a title...">' +
              '<textarea id="feedPostBody" class="feed-compose-body" placeholder="Tell us about your ride — the roads, the weather, the highlights..." rows="3"></textarea>' +
              '<div class="feed-compose-meta">' +
                '<input type="number" id="feedPostMiles" placeholder="Miles" style="width:80px">' +
                '<input type="text" id="feedPostBike" placeholder="Bike">' +
                '<select id="feedPostRating" class="garage-select" style="width:100px"><option value="">Rating</option><option value="5">★★★★★</option><option value="4">★★★★</option><option value="3">★★★</option><option value="2">★★</option><option value="1">★</option></select>' +
                '<input type="text" id="feedPostTags" placeholder="Tags (comma separated)">' +
              '</div>' +
              '<div class="feed-compose-photos">' +
                '<div class="photo-upload-area" id="photoUploadArea">' +
                  '<i class="fas fa-camera"></i>' +
                  '<span>Add photos (max 4, jpg/png/webp, 5MB each)</span>' +
                  '<input type="file" id="feedPostPhotos" multiple accept="image/jpeg,image/png,image/webp" style="display:none">' +
                '</div>' +
                '<div class="photo-preview-grid" id="photoPreviewGrid"></div>' +
              '</div>' +
              '<div class="feed-compose-actions">' +
                '<button class="btn-primary" id="feedPostSubmit" style="font-size:13px;padding:10px 20px;"><i class="fas fa-paper-plane"></i> Post</button>' +
              '</div>' +
            '</div>' +
            '<div class="feed-filter-bar">' +
              '<button class="feed-filter-btn feed-filter-active" data-feed-filter="all"><i class="fas fa-stream"></i> All</button>' +
              '<button class="feed-filter-btn" data-feed-filter="ride-report"><i class="fas fa-pen"></i> Reports</button>' +
              '<button class="feed-filter-btn" data-feed-filter="activity"><i class="fas fa-bolt"></i> Activity</button>' +
              '<button class="feed-filter-btn" data-feed-filter="following"><i class="fas fa-user-friends"></i> Following</button>' +
            '</div>' +
            '<div id="feedList">' + feedHTML + '</div>' +
          '</div>' +
          '<div class="feed-sidebar">' +
            (typeof VisorUpGamification !== 'undefined' ? '' +
              '<div class="feed-sidebar-card">' +
                '<h4><i class="fas fa-chart-line"></i> Your Stats</h4>' +
                VisorUpGamification.renderLevelBadge() +
              '</div>' : '') +
            '<div class="feed-sidebar-card">' +
              '<h4><i class="fas fa-fire"></i> Quick Actions</h4>' +
              '<a href="/build-route" class="feed-quick-link"><i class="fas fa-pencil-ruler"></i> Build a Route</a>' +
              '<a href="/guides" class="feed-quick-link"><i class="fas fa-book-open"></i> Browse Guides</a>' +
              '<a href="/destinations" class="feed-quick-link"><i class="fas fa-map-pin"></i> Explore Destinations</a>' +
              '<a href="/profile" class="feed-quick-link"><i class="fas fa-user"></i> My Profile</a>' +
            '</div>' +
            '<div class="feed-sidebar-card">' +
              '<h4><i class="fas fa-medal"></i> Recent Badges</h4>' +
              (typeof VisorUpGamification !== 'undefined' ? (function() {
                var badges = VisorUpGamification.getEarnedBadges().slice(-5).reverse();
                if (badges.length === 0) return '<p style="font-size:12px;color:var(--text-muted)">No badges yet. Start riding!</p>';
                return badges.map(function(b) {
                  var badge = BADGES.find(function(bd) { return bd.id === b.id; });
                  if (!badge) return '';
                  return '<div class="feed-badge-mini"><i class="fas ' + badge.icon + '"></i> ' + badge.name + '</div>';
                }).join('');
              })() : '') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>' + this.renderFooter();

    var self = this;
    var pendingPhotos = [];

    var uploadArea = document.getElementById('photoUploadArea');
    var photoInput = document.getElementById('feedPostPhotos');
    var previewGrid = document.getElementById('photoPreviewGrid');

    function updatePhotoPreview() {
      previewGrid.innerHTML = '';
      pendingPhotos.forEach(function(file, idx) {
        var thumb = document.createElement('div');
        thumb.className = 'photo-preview-thumb';
        var img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        var removeBtn = document.createElement('button');
        removeBtn.className = 'photo-preview-remove';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.addEventListener('click', function() {
          pendingPhotos.splice(idx, 1);
          updatePhotoPreview();
        });
        thumb.appendChild(img);
        thumb.appendChild(removeBtn);
        previewGrid.appendChild(thumb);
      });
      if (pendingPhotos.length >= 4) uploadArea.style.display = 'none';
      else uploadArea.style.display = '';
    }

    function addPhotoFiles(files) {
      var validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      var maxSize = 5 * 1024 * 1024;
      for (var i = 0; i < files.length && pendingPhotos.length < 4; i++) {
        if (validTypes.indexOf(files[i].type) === -1) continue;
        if (files[i].size > maxSize) continue;
        pendingPhotos.push(files[i]);
      }
      updatePhotoPreview();
    }

    uploadArea.addEventListener('click', function(e) {
      if (e.target.closest('.photo-preview-remove')) return;
      photoInput.click();
    });
    photoInput.addEventListener('change', function() {
      if (this.files.length > 0) addPhotoFiles(this.files);
      this.value = '';
    });
    uploadArea.addEventListener('dragover', function(e) { e.preventDefault(); uploadArea.classList.add('photo-drag-over'); });
    uploadArea.addEventListener('dragleave', function() { uploadArea.classList.remove('photo-drag-over'); });
    uploadArea.addEventListener('drop', function(e) {
      e.preventDefault();
      uploadArea.classList.remove('photo-drag-over');
      if (e.dataTransfer.files.length > 0) addPhotoFiles(e.dataTransfer.files);
    });

    // Post submission
    document.getElementById('feedPostSubmit').addEventListener('click', async function() {
      var title = document.getElementById('feedPostTitle').value.trim();
      var body = document.getElementById('feedPostBody').value.trim();
      if (!title && !body) { alert('Write something to share!'); return; }
      var submitBtn = document.getElementById('feedPostSubmit');
      var photos = [];
      if (pendingPhotos.length > 0) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        photos = await VisorUpCommunity.uploadPostPhotos(pendingPhotos);
      }
      var tags = document.getElementById('feedPostTags').value.trim();
      await VisorUpCommunity.createPost({
        type: 'ride-report',
        title: title,
        body: body,
        photos: photos,
        miles: parseInt(document.getElementById('feedPostMiles').value) || 0,
        bike: document.getElementById('feedPostBike').value.trim(),
        rating: parseInt(document.getElementById('feedPostRating').value) || 0,
        tags: tags ? tags.split(',').map(function(t) { return t.trim(); }).filter(Boolean) : []
      });
      self.renderCommunity();
      self.scrollToTop();
    });

    // Feed filters
    document.querySelectorAll('.feed-filter-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.feed-filter-btn').forEach(function(b) { b.classList.remove('feed-filter-active'); });
        btn.classList.add('feed-filter-active');
        var filter = btn.dataset.feedFilter;
        document.querySelectorAll('#feedList > *').forEach(function(el) {
          if (filter === 'all') { el.style.display = ''; return; }
          var isPost = el.classList.contains('feed-post');
          var isActivity = el.classList.contains('feed-activity-item');
          if (filter === 'ride-report') el.style.display = isPost ? '' : 'none';
          else if (filter === 'activity') el.style.display = isActivity ? '' : 'none';
          else if (filter === 'following') {
            var following = VisorUpCommunity.getFollowing();
            var uid = el.dataset.userId || '';
            el.style.display = (isPost && following.indexOf(uid) !== -1) ? '' : 'none';
          }
        });
      });
    });

    // Likes
    document.querySelectorAll('.feed-like-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var postId = btn.dataset.postId;
        var nowLiked = VisorUpCommunity.toggleLike(postId);
        btn.classList.toggle('feed-liked', nowLiked);
        var count = parseInt(btn.textContent.trim().split(' ').pop()) || 0;
        btn.innerHTML = '<i class="fas fa-heart"></i> ' + (nowLiked ? count + 1 : Math.max(0, count - 1));
      });
    });

    // Comment toggles
    document.querySelectorAll('.feed-comment-toggle').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var postId = btn.dataset.postId;
        var section = document.getElementById('comments-' + postId);
        if (!section) return;
        var isOpen = section.style.display !== 'none';
        section.style.display = isOpen ? 'none' : '';
        if (!isOpen) {
          section.innerHTML = VisorUpCommunity.renderCommentSection(postId);
          self._bindCommentForm(section, postId);
        }
      });
    });

    // Follow buttons
    document.querySelectorAll('.feed-follow-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var userId = btn.dataset.followUser;
        if (!userId) return;
        var isFollowing = btn.classList.contains('feed-following');
        if (isFollowing) {
          VisorUpCommunity.unfollowUser(userId);
        } else {
          VisorUpCommunity.followUser(userId);
        }
        document.querySelectorAll('.feed-follow-btn[data-follow-user="' + userId + '"]').forEach(function(b) {
          if (isFollowing) {
            b.classList.remove('feed-following');
            b.textContent = 'Follow';
          } else {
            b.classList.add('feed-following');
            b.textContent = 'Following';
          }
        });
      });
    });

    this._initLazyImages();
  }

  _bindCommentForm(section, postId) {
    var self = this;
    var input = section.querySelector('.feed-comment-input');
    var sendBtn = section.querySelector('.feed-comment-send');
    if (!input || !sendBtn) return;

    function submitComment() {
      var text = input.value.trim();
      if (!text) return;
      VisorUpCommunity.addComment(postId, text).then(function() {
        section.innerHTML = VisorUpCommunity.renderCommentSection(postId);
        self._bindCommentForm(section, postId);
        // Update comment count on button
        var btn = document.querySelector('.feed-comment-toggle[data-post-id="' + postId + '"]');
        if (btn) {
          var comments = VisorUpCommunity.getComments(postId);
          btn.innerHTML = '<i class="fas fa-comment"></i> ' + comments.length;
        }
      });
    }

    sendBtn.addEventListener('click', submitComment);
    input.addEventListener('keydown', function(e) { if (e.key === 'Enter') submitComment(); });
  }

  renderComingSoon(title, desc, icon) {
    return '' +
    '<section class="coming-soon-page">' +
      '<div class="coming-soon-inner">' +
        '<div class="coming-soon-icon"><i class="fas ' + icon + '"></i></div>' +
        '<h1 class="coming-soon-title">' + title + '</h1>' +
        '<div class="coming-soon-badge">Coming Soon</div>' +
        '<p class="coming-soon-desc">' + desc + '</p>' +
        '<p class="coming-soon-note">We\'re working on <strong>' + title.toLowerCase() + '</strong> content. Check back soon or subscribe to get notified.</p>' +
        '<form class="newsletter-form" onsubmit="event.preventDefault();this.querySelector(\'.newsletter-btn\').textContent=\'Subscribed!\'">' +
          '<input type="email" class="newsletter-input" placeholder="your@email.com" required>' +
          '<button type="submit" class="newsletter-btn">Notify Me</button>' +
        '</form>' +
        '<a href="/" class="btn-outline" style="margin-top:24px"><i class="fas fa-arrow-left"></i> Back to Home</a>' +
      '</div>' +
    '</section>';
  }

  render404() {
    return '' +
    '<section class="coming-soon-page">' +
      '<div class="coming-soon-inner">' +
        '<div class="coming-soon-icon" style="font-size:64px">🏍️</div>' +
        '<h1 class="coming-soon-title">Wrong Turn</h1>' +
        '<p class="coming-soon-desc">Looks like you\'ve taken a wrong turn — this page doesn\'t exist. Even the best riders miss a junction sometimes.</p>' +
        '<a href="/" class="hero-cta"><i class="fas fa-home"></i> Back to Home</a>' +
      '</div>' +
    '</section>';
  }

  renderAbout() {
    return '' +
    '<section class="page-hero" style="background-image:url(public/images/heroes/homepage.jpg">' +
      '<div class="hero-overlay"></div>' +
      '<div class="page-hero-content">' +
        '<h1 class="page-hero-title">About VisorUp</h1>' +
        '<p class="page-hero-sub">Built by riders, for riders. The UK\'s most comprehensive motorcycle touring platform.</p>' +
      '</div>' +
    '</section>' +
    '<section class="page-section">' +
      '<div class="container">' +
        '<div class="detail-grid">' +
          '<div class="detail-main">' +
            '<h2 class="detail-heading">Our Story</h2>' +
            '<p class="detail-text">VisorUp was born from a simple frustration: there was no single place that brought together everything a UK motorcycle tourer needs. Route planners existed, but they didn\'t know which roads were actually fun on two wheels. Travel sites had accommodation, but didn\'t understand that bikers need secure parking and drying rooms. Ferry guides existed, but didn\'t tell you how to book bike spaces or where the tie-downs were.</p>' +
            '<p class="detail-text">So we built it. VisorUp combines curated routes tested by real riders, 500+ points of interest across 14 categories, interactive route planning with OSRM road-accurate mapping, ferry guides with biker-specific tips, elevation profiles, weather forecasts, fuel range calculations, and destination guides that tell you everything from road surface quality to where the sheep are worst.</p>' +
            '<h3 class="detail-heading" style="margin-top:32px">What We Do</h3>' +
            '<p class="detail-text">We cover every corner of the UK and its islands: from the Bealach na Ba in the Scottish Highlands to the lanes of Guernsey, from the TT course on the Isle of Man to the waterfalls of Brecon Beacons. Our routes are ridden, not generated. Our POI data is curated, not scraped. Every campsite has been checked, every fuel station verified, every twisty road rated.</p>' +
            '<div class="tips-callout" style="margin-top:24px">' +
              '<div class="tips-callout-icon"><i class="fas fa-motorcycle"></i></div>' +
              '<div class="tips-callout-body">' +
                '<h4>Our Mission</h4>' +
                '<p>To make motorcycle touring in Britain as accessible, enjoyable, and well-planned as possible. Whether you\'re a seasoned tourer or planning your first big trip, VisorUp gives you the tools and knowledge to make it unforgettable.</p>' +
              '</div>' +
            '</div>' +
            '<h3 class="detail-heading" style="margin-top:32px">The Team</h3>' +
            '<p class="detail-text">VisorUp is run by a small team of motorcycle enthusiasts based in the UK. Between us we\'ve ridden tens of thousands of miles across Britain on everything from sportbikes to adventure bikes. We know which roads make you grin, which campsites have the best views, and which pubs serve the best pint after a long day in the saddle.</p>' +
            '<p class="detail-text">We\'re always adding new routes, new POIs, and new features. If you\'ve got a suggestion, a correction, or a road we absolutely must ride, <a href="/contact" style="color:var(--accent)">get in touch</a>.</p>' +
          '</div>' +
          '<div class="detail-sidebar">' +
            '<div class="info-card"><h4><i class="fas fa-route"></i> Routes</h4><p>7 curated routes with interactive planners and GPX downloads</p></div>' +
            '<div class="info-card"><h4><i class="fas fa-map-marker-alt"></i> POIs</h4><p>500+ points of interest across 14 categories, UK-wide</p></div>' +
            '<div class="info-card"><h4><i class="fas fa-map"></i> Destinations</h4><p>13 in-depth destination guides with maps and rider tips</p></div>' +
            '<div class="info-card"><h4><i class="fas fa-ship"></i> Ferry Guides</h4><p>6 comprehensive ferry guides with biker-specific booking advice</p></div>' +
            '<div class="info-card"><h4><i class="fas fa-pencil-ruler"></i> Route Builder</h4><p>Full custom route planner with elevation, weather, fuel range, and cost tools</p></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>';
  }

  renderContact() {
    return '' +
    '<section class="page-hero" style="background-image:url(public/images/heroes/routes.jpg">' +
      '<div class="hero-overlay"></div>' +
      '<div class="page-hero-content">' +
        '<h1 class="page-hero-title">Contact Us</h1>' +
        '<p class="page-hero-sub">Got a question, suggestion, or just want to say hello? We\'d love to hear from you.</p>' +
      '</div>' +
    '</section>' +
    '<section class="page-section">' +
      '<div class="container">' +
        '<div class="detail-grid">' +
          '<div class="detail-main">' +
            '<h2 class="detail-heading">Get In Touch</h2>' +
            '<p class="detail-text">Whether you\'ve found a road we need to add, spotted an error in our data, want to suggest a feature, or just want to share your ride photos, we\'re all ears.</p>' +
            '<form id="contactForm" style="margin-top:24px;">' +
              '<div style="margin-bottom:16px;">' +
                '<label style="display:block;font-size:13px;font-weight:600;color:var(--text);margin-bottom:6px;">Your Name</label>' +
                '<input type="text" name="name" required placeholder="Full name" style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid var(--border);background:var(--bg-card);color:var(--text);font-size:14px;">' +
              '</div>' +
              '<div style="margin-bottom:16px;">' +
                '<label style="display:block;font-size:13px;font-weight:600;color:var(--text);margin-bottom:6px;">Email Address</label>' +
                '<input type="email" name="email" required placeholder="you@example.com" style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid var(--border);background:var(--bg-card);color:var(--text);font-size:14px;">' +
              '</div>' +
              '<div style="margin-bottom:16px;">' +
                '<label style="display:block;font-size:13px;font-weight:600;color:var(--text);margin-bottom:6px;">Subject</label>' +
                '<select name="subject" style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid var(--border);background:var(--bg-card);color:var(--text);font-size:14px;">' +
                  '<option>General Enquiry</option>' +
                  '<option>Route Suggestion</option>' +
                  '<option>Data Correction</option>' +
                  '<option>Feature Request</option>' +
                  '<option>Partnership / Advertising</option>' +
                  '<option>Press / Media</option>' +
                  '<option>Bug Report</option>' +
                '</select>' +
              '</div>' +
              '<div style="margin-bottom:16px;">' +
                '<label style="display:block;font-size:13px;font-weight:600;color:var(--text);margin-bottom:6px;">Message</label>' +
                '<textarea name="message" required rows="6" placeholder="Tell us what\'s on your mind..." style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid var(--border);background:var(--bg-card);color:var(--text);font-size:14px;resize:vertical;"></textarea>' +
              '</div>' +
              '<div style="margin-bottom:16px;">' +
                '<label style="font-size:12px;color:var(--text-muted);display:flex;align-items:flex-start;gap:8px;">' +
                  '<input type="checkbox" name="newsletter" style="margin-top:3px;"> I\'d like to receive occasional emails about new routes, destination guides, and VisorUp updates. You can unsubscribe at any time.' +
                '</label>' +
              '</div>' +
              '<button type="submit" class="btn-primary" style="width:100%;"><i class="fas fa-paper-plane"></i> Send Message</button>' +
            '</form>' +
          '</div>' +
          '<div class="detail-sidebar">' +
            '<div class="info-card">' +
              '<h4><i class="fas fa-envelope"></i> Email</h4>' +
              '<p><a href="mailto:hello@visorup.co.uk" style="color:var(--accent)">hello@visorup.co.uk</a></p>' +
            '</div>' +
            '<div class="info-card">' +
              '<h4><i class="fas fa-clock"></i> Response Time</h4>' +
              '<p>We aim to reply within 48 hours. Route suggestions and data corrections are prioritised.</p>' +
            '</div>' +
            '<div class="info-card">' +
              '<h4><i class="fab fa-instagram"></i> Social</h4>' +
              '<p>Follow us for ride photos, route tips, and community updates.</p>' +
              '<p style="margin-top:8px;">' +
                '<a href="#" style="color:var(--accent);margin-right:12px;font-size:18px;"><i class="fab fa-instagram"></i></a>' +
                '<a href="#" style="color:var(--accent);margin-right:12px;font-size:18px;"><i class="fab fa-facebook"></i></a>' +
                '<a href="#" style="color:var(--accent);margin-right:12px;font-size:18px;"><i class="fab fa-youtube"></i></a>' +
                '<a href="#" style="color:var(--accent);font-size:18px;"><i class="fab fa-x-twitter"></i></a>' +
              '</p>' +
            '</div>' +
            '<div class="info-card">' +
              '<h4><i class="fas fa-handshake"></i> Partnerships</h4>' +
              '<p>Interested in partnering with VisorUp? We work with campsite operators, motorcycle gear brands, ferry companies, and tourism boards. Email us at <a href="mailto:partners@visorup.co.uk" style="color:var(--accent)">partners@visorup.co.uk</a></p>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>';
  }

  renderPrivacy() {
    var updated = '1 June 2026';
    return '' +
    '<section class="page-hero" style="background:var(--bg-dark);min-height:200px;">' +
      '<div class="page-hero-content">' +
        '<h1 class="page-hero-title">Privacy Policy</h1>' +
        '<p class="page-hero-sub">Last updated: ' + updated + '</p>' +
      '</div>' +
    '</section>' +
    '<section class="page-section">' +
      '<div class="container" style="max-width:800px;">' +
        '<div class="legal-content">' +

        '<h2>1. Who We Are</h2>' +
        '<p>VisorUp ("we", "us", "our") operates the website visorup.co.uk and the VisorUp motorcycle touring platform. We are a UK-based company committed to protecting your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>' +
        '<p><b>Data Controller:</b> VisorUp<br><b>Contact:</b> <a href="mailto:privacy@visorup.co.uk" style="color:var(--accent)">privacy@visorup.co.uk</a></p>' +

        '<h2>2. What Data We Collect</h2>' +
        '<p>We collect the following categories of personal data:</p>' +
        '<h3>2.1 Data You Provide</h3>' +
        '<ul>' +
          '<li><b>Account information:</b> Name, email address, and password when you create an account</li>' +
          '<li><b>Contact form submissions:</b> Name, email, and message content when you contact us</li>' +
          '<li><b>Newsletter sign-up:</b> Email address when you subscribe to our mailing list</li>' +
          '<li><b>Route data:</b> Custom routes you create and save using our route builder</li>' +
        '</ul>' +
        '<h3>2.2 Data Collected Automatically</h3>' +
        '<ul>' +
          '<li><b>Usage data:</b> Pages visited, features used, time spent on site, referral source</li>' +
          '<li><b>Device data:</b> Browser type, operating system, screen resolution, device type</li>' +
          '<li><b>Location data:</b> Approximate location derived from IP address (not precise GPS)</li>' +
          '<li><b>Cookies and similar technologies:</b> See Section 5 for full details</li>' +
        '</ul>' +
        '<h3>2.3 Data From Third Parties</h3>' +
        '<ul>' +
          '<li><b>Affiliate partners:</b> If you click an affiliate link and make a purchase, our partners may share transaction confirmation data (not payment details) with us for commission tracking</li>' +
          '<li><b>Analytics providers:</b> Aggregated and pseudonymised usage data from analytics services</li>' +
        '</ul>' +

        '<h2>3. How We Use Your Data</h2>' +
        '<p>We use your personal data for the following purposes and legal bases:</p>' +
        '<table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">' +
          '<tr style="border-bottom:1px solid var(--border);">' +
            '<th style="text-align:left;padding:10px;color:var(--accent);">Purpose</th>' +
            '<th style="text-align:left;padding:10px;color:var(--accent);">Legal Basis</th>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid var(--border);">' +
            '<td style="padding:10px;">Providing and improving the platform</td>' +
            '<td style="padding:10px;">Legitimate interest</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid var(--border);">' +
            '<td style="padding:10px;">Sending marketing emails (routes, guides, updates)</td>' +
            '<td style="padding:10px;">Consent (opt-in)</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid var(--border);">' +
            '<td style="padding:10px;">Tracking affiliate referrals and commissions</td>' +
            '<td style="padding:10px;">Legitimate interest</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid var(--border);">' +
            '<td style="padding:10px;">Responding to contact form enquiries</td>' +
            '<td style="padding:10px;">Contractual necessity / Consent</td>' +
          '</tr>' +
          '<tr style="border-bottom:1px solid var(--border);">' +
            '<td style="padding:10px;">Analytics and site performance</td>' +
            '<td style="padding:10px;">Legitimate interest</td>' +
          '</tr>' +
          '<tr>' +
            '<td style="padding:10px;">Personalising content and recommendations</td>' +
            '<td style="padding:10px;">Consent</td>' +
          '</tr>' +
        '</table>' +

        '<h2>4. Email Marketing</h2>' +
        '<p>We will only send you marketing emails if you have explicitly opted in (e.g. by checking the newsletter box on our contact or sign-up forms). Marketing emails may include:</p>' +
        '<ul>' +
          '<li>New route announcements and destination guides</li>' +
          '<li>Platform feature updates</li>' +
          '<li>Curated partner offers (gear, accommodation, ferries)</li>' +
          '<li>Seasonal riding tips and event information</li>' +
        '</ul>' +
        '<p>Every marketing email includes a one-click unsubscribe link. You can also manage your email preferences from your account settings or by emailing <a href="mailto:privacy@visorup.co.uk" style="color:var(--accent)">privacy@visorup.co.uk</a>.</p>' +

        '<h2>5. Cookies &amp; Tracking Technologies</h2>' +
        '<p>We use cookies and similar technologies to operate and improve VisorUp. When you first visit, a cookie consent banner allows you to accept or reject non-essential cookies.</p>' +
        '<h3>5.1 Essential Cookies</h3>' +
        '<p>Required for the site to function. These cannot be disabled.</p>' +
        '<ul>' +
          '<li><b>Session cookie:</b> Maintains your login state</li>' +
          '<li><b>Theme preference:</b> Remembers your dark/light mode choice</li>' +
          '<li><b>Cookie consent:</b> Records your cookie preferences</li>' +
          '<li><b>Route builder state:</b> Saves your in-progress routes locally</li>' +
        '</ul>' +
        '<h3>5.2 Analytics Cookies</h3>' +
        '<p>Help us understand how visitors use the site. Set only with your consent.</p>' +
        '<ul>' +
          '<li><b>Google Analytics / Plausible:</b> Anonymous usage statistics (pages visited, session duration, referral source)</li>' +
        '</ul>' +
        '<h3>5.3 Affiliate &amp; Advertising Cookies</h3>' +
        '<p>Used to track referrals to our partner websites. Set only with your consent.</p>' +
        '<ul>' +
          '<li><b>Affiliate tracking cookies:</b> When you click a link to a partner (e.g. a campsite booking site, gear shop, or ferry company), a cookie may be placed to attribute any resulting purchase to VisorUp for commission purposes. These cookies are set by the partner\'s domain, not VisorUp.</li>' +
          '<li><b>Duration:</b> Typically 30-90 days depending on the partner programme</li>' +
          '<li><b>Data shared:</b> Click ID, timestamp, and referral source. We do not receive your payment details.</li>' +
        '</ul>' +
        '<h3>5.4 Managing Cookies</h3>' +
        '<p>You can change your cookie preferences at any time by clicking the cookie settings link in the footer, or by clearing cookies in your browser settings.</p>' +

        '<h2>6. Affiliate Links &amp; Partnerships</h2>' +
        '<p>VisorUp participates in affiliate programmes with selected partners. This means:</p>' +
        '<ul>' +
          '<li>Some links on our site (to campsites, ferry booking, gear shops, etc.) are affiliate links</li>' +
          '<li>If you click an affiliate link and make a purchase, we may earn a small commission at no extra cost to you</li>' +
          '<li>Affiliate relationships never influence our editorial content, route ratings, or POI data</li>' +
          '<li>Affiliate links are identified where required by advertising standards</li>' +
        '</ul>' +

        '<h2>7. Data Sharing</h2>' +
        '<p>We do not sell your personal data. We may share data with:</p>' +
        '<ul>' +
          '<li><b>Service providers:</b> Hosting (Cloudflare), email delivery, analytics — under data processing agreements</li>' +
          '<li><b>Affiliate partners:</b> Limited click/referral data as described in Section 6</li>' +
          '<li><b>Legal requirements:</b> If required by law, court order, or to protect our rights</li>' +
        '</ul>' +

        '<h2>8. Data Retention</h2>' +
        '<ul>' +
          '<li><b>Account data:</b> Retained until you delete your account</li>' +
          '<li><b>Contact form data:</b> 2 years from submission</li>' +
          '<li><b>Email marketing data:</b> Until you unsubscribe</li>' +
          '<li><b>Analytics data:</b> 26 months (anonymised)</li>' +
          '<li><b>Affiliate tracking data:</b> 90 days from click</li>' +
        '</ul>' +

        '<h2>9. Your Rights (UK GDPR)</h2>' +
        '<p>You have the right to:</p>' +
        '<ul>' +
          '<li><b>Access</b> your personal data (Subject Access Request)</li>' +
          '<li><b>Rectify</b> inaccurate data</li>' +
          '<li><b>Erase</b> your data ("right to be forgotten")</li>' +
          '<li><b>Restrict</b> processing of your data</li>' +
          '<li><b>Data portability</b> — receive your data in a machine-readable format</li>' +
          '<li><b>Object</b> to processing based on legitimate interest</li>' +
          '<li><b>Withdraw consent</b> at any time where processing is based on consent</li>' +
        '</ul>' +
        '<p>To exercise any of these rights, email <a href="mailto:privacy@visorup.co.uk" style="color:var(--accent)">privacy@visorup.co.uk</a>. We will respond within 30 days.</p>' +
        '<p>If you are not satisfied with our response, you have the right to lodge a complaint with the <a href="https://ico.org.uk" target="_blank" style="color:var(--accent)">Information Commissioner\'s Office (ICO)</a>.</p>' +

        '<h2>10. International Transfers</h2>' +
        '<p>Your data is primarily stored within the UK/EEA. Where data is transferred outside the UK (e.g. to cloud service providers), we ensure appropriate safeguards are in place, including Standard Contractual Clauses or adequacy decisions.</p>' +

        '<h2>11. Children</h2>' +
        '<p>VisorUp is not directed at children under 16. We do not knowingly collect personal data from children. If you believe we have collected data from a child, please contact us immediately.</p>' +

        '<h2>12. Changes to This Policy</h2>' +
        '<p>We may update this policy from time to time. Material changes will be communicated via email (if you have an account) and a notice on the website. The "last updated" date at the top of this page will always reflect the current version.</p>' +

        '</div>' +
      '</div>' +
    '</section>';
  }

  renderTerms() {
    var updated = '1 June 2026';
    return '' +
    '<section class="page-hero" style="background:var(--bg-dark);min-height:200px;">' +
      '<div class="page-hero-content">' +
        '<h1 class="page-hero-title">Terms of Service</h1>' +
        '<p class="page-hero-sub">Last updated: ' + updated + '</p>' +
      '</div>' +
    '</section>' +
    '<section class="page-section">' +
      '<div class="container" style="max-width:800px;">' +
        '<div class="legal-content">' +

        '<h2>1. Acceptance of Terms</h2>' +
        '<p>By accessing or using the VisorUp website (visorup.co.uk) and its services ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, you must not use the Platform.</p>' +

        '<h2>2. About the Service</h2>' +
        '<p>VisorUp provides motorcycle touring information, route planning tools, destination guides, ferry information, and points of interest data for the United Kingdom and its surrounding islands. The Platform includes:</p>' +
        '<ul>' +
          '<li>Curated route guides and interactive planners</li>' +
          '<li>A custom route builder with mapping, elevation, weather, and cost tools</li>' +
          '<li>Destination and ferry guides</li>' +
          '<li>Points of interest data across 14 categories</li>' +
          '<li>GPX file generation and download</li>' +
        '</ul>' +

        '<h2>3. User Accounts</h2>' +
        '<p>Some features may require you to create an account. You agree to:</p>' +
        '<ul>' +
          '<li>Provide accurate and complete registration information</li>' +
          '<li>Keep your password secure and confidential</li>' +
          '<li>Notify us immediately of any unauthorised use of your account</li>' +
          '<li>Accept responsibility for all activity under your account</li>' +
        '</ul>' +
        '<p>We reserve the right to suspend or terminate accounts that violate these Terms.</p>' +

        '<h2>4. Acceptable Use</h2>' +
        '<p>You agree not to:</p>' +
        '<ul>' +
          '<li>Use the Platform for any unlawful purpose</li>' +
          '<li>Scrape, crawl, or bulk-download data from the Platform without permission</li>' +
          '<li>Attempt to interfere with the Platform\'s infrastructure or security</li>' +
          '<li>Impersonate another person or misrepresent your affiliation</li>' +
          '<li>Upload malicious content, spam, or unsolicited advertising</li>' +
          '<li>Reverse-engineer or decompile any part of the Platform</li>' +
        '</ul>' +

        '<h2>5. Route Information &amp; Safety Disclaimer</h2>' +
        '<p><b>IMPORTANT: VisorUp provides route information for planning purposes only. You ride at your own risk.</b></p>' +
        '<ul>' +
          '<li>Route data, road surface ratings, and hazard warnings are provided as guidance and may not reflect current conditions</li>' +
          '<li>Roads may be closed, diverted, or deteriorated since our last assessment</li>' +
          '<li>Weather, road works, livestock, and other hazards can change without notice</li>' +
          '<li>Elevation profiles, distances, and ride times are estimates based on routing algorithms and may vary in practice</li>' +
          '<li>Speed limits, parking restrictions, and access rights may change. Always follow local signage</li>' +
          '<li>You are solely responsible for assessing road conditions, your riding ability, and the suitability of any route for your motorcycle</li>' +
        '</ul>' +
        '<p>We strongly recommend carrying physical maps, checking road reports before departure, and never relying solely on digital tools for navigation in remote areas.</p>' +

        '<h2>6. Third-Party Services &amp; Affiliate Links</h2>' +
        '<p>The Platform contains links to third-party websites (campsites, ferry operators, gear shops, etc.). Some of these are affiliate links — see our <a href="/privacy" style="color:var(--accent)">Privacy Policy</a> for details.</p>' +
        '<ul>' +
          '<li>We are not responsible for the content, availability, or accuracy of third-party websites</li>' +
          '<li>Your use of third-party services is governed by their own terms and privacy policies</li>' +
          '<li>Affiliate relationships do not influence our editorial content or recommendations</li>' +
        '</ul>' +

        '<h2>7. Intellectual Property</h2>' +
        '<p>All content on the Platform — including text, route data, POI data, maps, design, logos, and code — is owned by VisorUp or its licensors and protected by copyright and intellectual property laws.</p>' +
        '<ul>' +
          '<li>You may download GPX files for personal, non-commercial use</li>' +
          '<li>You may not reproduce, distribute, or commercially exploit Platform content without written permission</li>' +
          '<li>Map data is provided by OpenStreetMap contributors under the ODbL licence</li>' +
          '<li>Routing data is provided by OSRM (Open Source Routing Machine)</li>' +
          '<li>Weather data is provided by Open-Meteo</li>' +
          '<li>Elevation data is provided by Open-Meteo Elevation API</li>' +
        '</ul>' +

        '<h2>8. User-Generated Content</h2>' +
        '<p>If you submit content to the Platform (routes, reviews, suggestions, photos), you:</p>' +
        '<ul>' +
          '<li>Retain ownership of your original content</li>' +
          '<li>Grant VisorUp a non-exclusive, worldwide, royalty-free licence to use, display, and distribute your content on the Platform</li>' +
          '<li>Warrant that your content does not infringe any third party\'s rights</li>' +
        '</ul>' +

        '<h2>9. Limitation of Liability</h2>' +
        '<p>To the maximum extent permitted by law:</p>' +
        '<ul>' +
          '<li>The Platform is provided "as is" without warranties of any kind</li>' +
          '<li>We do not guarantee the accuracy, completeness, or reliability of route data, POI information, or any other content</li>' +
          '<li>We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Platform or reliance on its content</li>' +
          '<li>Our total liability to you shall not exceed the amount you have paid to VisorUp (if any) in the 12 months preceding the claim</li>' +
        '</ul>' +
        '<p>Nothing in these Terms excludes or limits liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded by law.</p>' +

        '<h2>10. Indemnification</h2>' +
        '<p>You agree to indemnify and hold VisorUp harmless from any claims, damages, or expenses arising from your use of the Platform or violation of these Terms.</p>' +

        '<h2>11. Modifications</h2>' +
        '<p>We may modify these Terms at any time. Material changes will be notified via the Platform. Continued use after changes constitutes acceptance of the updated Terms.</p>' +

        '<h2>12. Governing Law</h2>' +
        '<p>These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>' +

        '<h2>13. Contact</h2>' +
        '<p>For questions about these Terms, contact us at <a href="mailto:legal@visorup.co.uk" style="color:var(--accent)">legal@visorup.co.uk</a>.</p>' +

        '</div>' +
      '</div>' +
    '</section>';
  }

  // ── Bikes Section ───────────────────────────────────────────

  renderBikes() {
    var categories = ['All', 'Adventure', 'Sport Touring', 'Touring', 'Naked', 'Sport', 'Versatile'];
    var pills = categories.map(function(c) {
      var active = c === 'All' ? 'filter-pill-active' : '';
      return '<button class="filter-pill ' + active + '" data-filter="' + c + '">' + c + '</button>';
    }).join('');

    var cards = BIKES.map(function(b) {
      var scoreBar = function(label, val) {
        return '<div class="bike-score-row"><span class="bike-score-label">' + label + '</span><div class="bike-score-bar"><div class="bike-score-fill" style="width:' + val + '%"></div></div><span class="bike-score-val">' + val + '</span></div>';
      };
      return '<a href="/bikes/' + b.slug + '" class="bike-card" data-category="' + b.category + '">' +
        '<div class="bike-card-img" style="background-image:url(' + b.image + ')">' +
          '<span class="bike-card-category">' + b.category + '</span>' +
        '</div>' +
        '<div class="bike-card-body">' +
          '<h3 class="bike-card-title">' + b.name + '</h3>' +
          '<p class="bike-card-price">' + b.price + '</p>' +
          '<div class="bike-card-specs">' +
            '<span><i class="fas fa-bolt"></i> ' + b.specs.power + '</span>' +
            '<span><i class="fas fa-weight-hanging"></i> ' + b.specs.weight + '</span>' +
            '<span><i class="fas fa-gas-pump"></i> ' + b.specs.mpg + '</span>' +
          '</div>' +
          '<div class="bike-card-scores">' +
            scoreBar('Touring', b.scores.touring) +
            scoreBar('Comfort', b.scores.comfort) +
          '</div>' +
        '</div>' +
      '</a>';
    }).join('');

    var self = this;
    setTimeout(function() {
      document.addEventListener('click', function handler(e) {
        if (!e.target.classList.contains('filter-pill')) return;
        var section = e.target.closest('.page-section');
        if (!section || !section.querySelector('#bikeGrid')) return;
        var filter = e.target.dataset.filter;
        section.querySelectorAll('.filter-pill').forEach(function(p) { p.classList.remove('filter-pill-active'); });
        e.target.classList.add('filter-pill-active');
        section.querySelectorAll('#bikeGrid .bike-card').forEach(function(card) {
          if (filter === 'All') { card.style.display = ''; }
          else { card.style.display = card.getAttribute('data-category') === filter ? '' : 'none'; }
        });
      });
    }, 50);

    return '' +
    '<section class="page-hero" style="background-image:url(public/images/heroes/homepage.jpg)">' +
      '<div class="hero-overlay"></div>' +
      '<div class="page-hero-content">' +
        '<h1 class="page-hero-title">Motorcycle Touring Setup</h1>' +
        '<p class="page-hero-sub">Choose your machine. Every bike reviewed for real-world UK touring — specs, strengths, gear recommendations, and the routes they\'re built for.</p>' +
      '</div>' +
    '</section>' +
    '<section class="page-section">' +
      '<div class="container">' +
        '<div class="filter-pills">' + pills + '</div>' +
        '<div class="bike-grid" id="bikeGrid">' + cards + '</div>' +
      '</div>' +
    '</section>';
  }

  renderBikeDetail(b) {
    var scoreBar = function(label, val) {
      return '<div class="bike-score-row"><span class="bike-score-label">' + label + '</span><div class="bike-score-bar"><div class="bike-score-fill" style="width:' + val + '%"></div></div><span class="bike-score-val">' + val + '</span></div>';
    };

    var specsHTML = '' +
      '<tr><td><i class="fas fa-cog"></i> Engine</td><td>' + b.specs.engine + '</td></tr>' +
      '<tr><td><i class="fas fa-bolt"></i> Power</td><td>' + b.specs.power + '</td></tr>' +
      '<tr><td><i class="fas fa-arrows-rotate"></i> Torque</td><td>' + b.specs.torque + '</td></tr>' +
      '<tr><td><i class="fas fa-weight-hanging"></i> Weight</td><td>' + b.specs.weight + '</td></tr>' +
      '<tr><td><i class="fas fa-arrows-up-down"></i> Seat Height</td><td>' + b.specs.seatHeight + '</td></tr>' +
      '<tr><td><i class="fas fa-gas-pump"></i> Tank</td><td>' + b.specs.tankCapacity + '</td></tr>' +
      '<tr><td><i class="fas fa-gauge-high"></i> Economy</td><td>' + b.specs.mpg + '</td></tr>' +
      '<tr><td><i class="fas fa-road"></i> Range</td><td>' + b.specs.fuelRange + '</td></tr>';

    var strengths = b.strengths.map(function(s) { return '<li><i class="fas fa-check"></i> ' + s + '</li>'; }).join('');
    var weaknesses = b.weaknesses.map(function(w) { return '<li><i class="fas fa-times"></i> ' + w + '</li>'; }).join('');

    var routeLinks = b.bestRoutes.map(function(slug) {
      var r = ROUTES.find(function(route) { return route.slug === slug; });
      if (!r) return '';
      return '<a href="/routes/' + slug + '" class="bike-route-link"><i class="fas fa-route"></i> ' + r.name + ' <span>' + r.days + ' days · ' + r.miles + ' mi</span></a>';
    }).join('');

    var gearSections = b.gearRecommendations.map(function(cat) {
      var items = cat.items.map(function(item) {
        return '<a href="' + item.url + '" target="_blank" rel="noopener sponsored" class="gear-item">' +
          '<div class="gear-item-info">' +
            '<strong>' + item.name + '</strong>' +
            '<span class="gear-item-note">' + item.note + '</span>' +
          '</div>' +
          '<span class="gear-item-price">' + item.price + ' <i class="fas fa-external-link-alt" style="font-size:9px;opacity:0.5"></i></span>' +
        '</a>';
      }).join('');
      return '<div class="gear-category">' +
        '<h4 class="gear-category-title"><i class="fas fa-' +
          (cat.category === 'Luggage' ? 'suitcase-rolling' :
           cat.category === 'Protection' ? 'shield-halved' :
           cat.category === 'Comfort' ? 'couch' : 'microchip') +
        '"></i> ' + cat.category + '</h4>' + items + '</div>';
    }).join('');

    var tips = b.touringTips.map(function(t) { return '<li><i class="fas fa-lightbulb"></i> ' + t + '</li>'; }).join('');

    return '' +
    '<section class="page-hero" style="background-image:url(' + b.heroImage + ')">' +
      '<div class="hero-overlay"></div>' +
      '<div class="page-hero-content">' +
        '<span class="bike-hero-category">' + b.category + ' · ' + b.year + '</span>' +
        '<h1 class="page-hero-title">' + b.name + '</h1>' +
        '<p class="page-hero-sub">' + b.price + '</p>' +
      '</div>' +
    '</section>' +
    '<section class="page-section">' +
      '<div class="container">' +
        '<nav class="breadcrumb"><a href="/">Home</a> <i class="fas fa-chevron-right"></i> <a href="/bikes">Bikes</a> <i class="fas fa-chevron-right"></i> <span>' + b.name + '</span></nav>' +

        '<div class="detail-grid">' +
          '<div class="detail-main">' +
            '<h2 class="detail-heading">Overview</h2>' +
            '<p class="detail-text">' + b.overview + '</p>' +

            '<h2 class="detail-heading" style="margin-top:36px;">UK Touring Review</h2>' +
            '<p class="detail-text">' + b.touringReview + '</p>' +

            '<div class="bike-scores-panel">' +
              '<h3 class="detail-heading"><i class="fas fa-chart-bar" style="color:var(--accent);margin-right:6px;"></i> Touring Scores</h3>' +
              scoreBar('Touring', b.scores.touring) +
              scoreBar('Comfort', b.scores.comfort) +
              scoreBar('Handling', b.scores.handling) +
              scoreBar('Value', b.scores.value) +
              scoreBar('Off-road', b.scores.offroad) +
              scoreBar('Pillion', b.scores.pillion) +
            '</div>' +

            '<div class="bike-strengths-weaknesses">' +
              '<div class="bike-sw-col">' +
                '<h3 class="detail-heading" style="color:#27ae60"><i class="fas fa-thumbs-up"></i> Touring Strengths</h3>' +
                '<ul class="bike-sw-list bike-sw-strengths">' + strengths + '</ul>' +
              '</div>' +
              '<div class="bike-sw-col">' +
                '<h3 class="detail-heading" style="color:#e74c3c"><i class="fas fa-thumbs-down"></i> Limitations</h3>' +
                '<ul class="bike-sw-list bike-sw-weaknesses">' + weaknesses + '</ul>' +
              '</div>' +
            '</div>' +

            (routeLinks ? '<h3 class="detail-heading" style="margin-top:36px;"><i class="fas fa-map-marked-alt" style="color:var(--accent);margin-right:6px;"></i> Best Routes For This Bike</h3>' +
              '<div class="bike-route-links">' + routeLinks + '</div>' : '') +

            '<h3 class="detail-heading" style="margin-top:36px;"><i class="fas fa-toolbox" style="color:var(--accent);margin-right:6px;"></i> Recommended Touring Gear</h3>' +
            '<div class="gear-grid">' + gearSections + '</div>' +

            '<div class="tips-callout" style="margin-top:36px;">' +
              '<div class="tips-callout-icon"><i class="fas fa-lightbulb"></i></div>' +
              '<div class="tips-callout-body">' +
                '<h4>Touring Tips for the ' + b.name + '</h4>' +
                '<ul class="bike-tips-list">' + tips + '</ul>' +
              '</div>' +
            '</div>' +

          '</div>' +

          '<div class="detail-sidebar">' +
            '<div class="info-card">' +
              '<h4><i class="fas fa-motorcycle"></i> Specifications</h4>' +
              '<table class="bike-specs-table">' + specsHTML + '</table>' +
            '</div>' +
            '<div class="info-card">' +
              '<h4><i class="fas fa-chart-simple"></i> Quick Scores</h4>' +
              scoreBar('Touring', b.scores.touring) +
              scoreBar('Comfort', b.scores.comfort) +
              scoreBar('Handling', b.scores.handling) +
            '</div>' +
            '<div class="info-card">' +
              '<a href="/build-route" class="hero-cta" style="width:100%;text-align:center;font-size:14px;"><i class="fas fa-pencil-ruler"></i> Plan a Route</a>' +
            '</div>' +
          '</div>' +
        '</div>' +

      '</div>' +
    '</section>';
  }

  // ── Guides / Articles ───────────────────────────────────────

  renderGuides() {
    if (typeof ARTICLES === 'undefined' || !ARTICLES.length) return this.renderComingSoon('Guides', 'Content coming soon.', 'fa-book');
    var cats = ['All', 'gear', 'bikes', 'routes', 'destinations', 'planning', 'scenic', 'seasonal'];
    var pills = cats.map(function(c) {
      var label = c === 'All' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1);
      var active = c === 'All' ? 'filter-pill-active' : '';
      return '<button class="filter-pill ' + active + '" data-filter="' + c + '">' + label + '</button>';
    }).join('');

    var cards = ARTICLES.map(function(a) {
      return '<a href="/guides/' + a.category + '/' + a.slug + '" class="guide-card" data-category="' + a.category + '">' +
        '<div class="guide-card-img" data-bg="' + a.heroImage + '">' +
          '<span class="guide-card-cat">' + a.category + '</span>' +
        '</div>' +
        '<div class="guide-card-body">' +
          '<h3>' + a.title + '</h3>' +
          '<p>' + a.metaDescription + '</p>' +
          '<div class="guide-card-meta"><span><i class="fas fa-clock"></i> ' + a.readTime + '</span><span><i class="fas fa-calendar"></i> ' + a.publishDate + '</span></div>' +
        '</div>' +
      '</a>';
    }).join('');

    setTimeout(function() {
      document.addEventListener('click', function handler(e) {
        if (!e.target.classList.contains('filter-pill')) return;
        var section = e.target.closest('.page-section');
        if (!section || !section.querySelector('#guideGrid')) return;
        var filter = e.target.dataset.filter;
        section.querySelectorAll('.filter-pill').forEach(function(p) { p.classList.remove('filter-pill-active'); });
        e.target.classList.add('filter-pill-active');
        section.querySelectorAll('#guideGrid .guide-card').forEach(function(card) {
          card.style.display = (filter === 'All' || card.dataset.category === filter) ? '' : 'none';
        });
      });
    }, 50);

    return '' +
    '<section class="page-hero" style="background-image:url(public/images/heroes/routes.jpg)">' +
      '<div class="hero-overlay"></div>' +
      '<div class="page-hero-content">' +
        '<h1 class="page-hero-title">Touring Guides</h1>' +
        '<p class="page-hero-sub">Gear reviews, route tips, bike setup, and everything you need to plan the perfect UK motorcycle tour.</p>' +
      '</div>' +
    '</section>' +
    '<section class="page-section">' +
      '<div class="container">' +
        '<div class="filter-pills">' + pills + '</div>' +
        '<div class="guide-grid" id="guideGrid">' + cards + '</div>' +
      '</div>' +
    '</section>';
  }

  renderGuideCategory(category) {
    if (typeof ARTICLES === 'undefined') return this.renderComingSoon('Guides', 'Content coming soon.', 'fa-book');
    var catArticles = ARTICLES.filter(function(a) { return a.category === category; });
    if (catArticles.length === 0) return this.render404();
    var catName = category.charAt(0).toUpperCase() + category.slice(1);

    var cards = catArticles.map(function(a) {
      return '<a href="/guides/' + a.category + '/' + a.slug + '" class="guide-card">' +
        '<div class="guide-card-img" data-bg="' + a.heroImage + '">' +
          '<span class="guide-card-cat">' + a.category + '</span>' +
        '</div>' +
        '<div class="guide-card-body">' +
          '<h3>' + a.title + '</h3>' +
          '<p>' + a.metaDescription + '</p>' +
          '<div class="guide-card-meta"><span><i class="fas fa-clock"></i> ' + a.readTime + '</span><span><i class="fas fa-calendar"></i> ' + a.publishDate + '</span></div>' +
        '</div>' +
      '</a>';
    }).join('');

    return '' +
    '<section class="page-hero" style="background-image:url(public/images/heroes/routes.jpg)">' +
      '<div class="hero-overlay"></div>' +
      '<div class="page-hero-content">' +
        '<h1 class="page-hero-title">' + catName + ' Guides</h1>' +
      '</div>' +
    '</section>' +
    '<section class="page-section">' +
      '<div class="container">' +
        '<div class="guide-grid">' + cards + '</div>' +
      '</div>' +
    '</section>';
  }

  renderArticle(a) {
    var tags = a.tags.map(function(t) { return '<span class="article-tag">' + t + '</span>'; }).join('');

    var related = '';
    if (a.relatedSlugs && a.relatedSlugs.length > 0 && typeof ARTICLES !== 'undefined') {
      var relCards = a.relatedSlugs.map(function(slug) {
        var r = ARTICLES.find(function(ar) { return ar.slug === slug; });
        if (!r) return '';
        return '<a href="/guides/' + r.category + '/' + r.slug + '" class="related-card">' +
          '<div class="related-card-img" data-bg="' + r.heroImage + '"></div>' +
          '<div class="related-card-body"><h4>' + r.title + '</h4><span>' + r.readTime + '</span></div>' +
        '</a>';
      }).filter(Boolean).join('');
      if (relCards) {
        related = '<div class="article-related"><h3><i class="fas fa-book-open" style="color:var(--accent);margin-right:6px;"></i>Related Guides</h3><div class="related-grid">' + relCards + '</div></div>';
      }
    }

    var affiliates = '';
    if (a.affiliateLinks && a.affiliateLinks.length > 0) {
      var items = a.affiliateLinks.map(function(link) {
        return '<a href="' + link.url + '" target="_blank" rel="noopener sponsored" class="article-affiliate">' +
          '<span class="article-affiliate-name">' + link.name + '</span>' +
          '<span class="article-affiliate-price">' + link.price + ' <i class="fas fa-external-link-alt" style="font-size:9px;opacity:0.5;"></i></span>' +
        '</a>';
      }).join('');
      affiliates = '<div class="article-affiliate-box"><h4><i class="fas fa-shopping-bag" style="color:var(--accent);margin-right:6px;"></i>Products Mentioned</h4>' + items + '</div>';
    }

    var catLabel = a.category.charAt(0).toUpperCase() + a.category.slice(1);

    return '' +
    '<section class="page-hero" style="background-image:url(' + a.heroImage + ')">' +
      '<div class="hero-overlay"></div>' +
      '<div class="page-hero-content">' +
        '<span class="article-hero-cat">' + catLabel + '</span>' +
        '<h1 class="page-hero-title">' + a.title + '</h1>' +
        '<div class="article-hero-meta"><span><i class="fas fa-user"></i> ' + a.author + '</span><span><i class="fas fa-calendar"></i> ' + a.publishDate + '</span><span><i class="fas fa-clock"></i> ' + a.readTime + '</span></div>' +
      '</div>' +
    '</section>' +
    '<section class="page-section">' +
      '<div class="container">' +
        '<nav class="breadcrumb"><a href="/">Home</a> <i class="fas fa-chevron-right"></i> <a href="/guides">Guides</a> <i class="fas fa-chevron-right"></i> <a href="/guides/' + a.category + '">' + catLabel + '</a> <i class="fas fa-chevron-right"></i> <span>' + a.title + '</span></nav>' +
        '<div class="article-layout">' +
          '<article class="article-body">' +
            a.content +
          '</article>' +
          '<aside class="article-sidebar">' +
            affiliates +
            '<div class="article-tags"><h4>Tags</h4>' + tags + '</div>' +
          '</aside>' +
        '</div>' +
        related +
      '</div>' +
    '</section>';
  }

  _setMeta(opts) {
    if (typeof opts === 'string') opts = { description: opts };
    var title = opts.title || document.title;
    var desc = opts.description || '';
    var image = opts.image || '';
    var url = opts.url || (window.location.origin + window.location.pathname);
    var type = opts.type || 'website';

    function setTag(sel, attr, val) {
      var el = document.querySelector(sel);
      if (el) { el.setAttribute(attr, val); }
      else {
        el = document.createElement('meta');
        if (sel.indexOf('property=') !== -1) el.setAttribute('property', sel.match(/property="([^"]+)"/)[1]);
        else if (sel.indexOf('name=') !== -1) el.setAttribute('name', sel.match(/name="([^"]+)"/)[1]);
        el.setAttribute(attr, val);
        document.head.appendChild(el);
      }
    }

    if (desc) {
      setTag('meta[name="description"]', 'content', desc);
      setTag('meta[property="og:description"]', 'content', desc);
      setTag('meta[name="twitter:description"]', 'content', desc);
    }
    setTag('meta[property="og:title"]', 'content', title);
    setTag('meta[name="twitter:title"]', 'content', title);
    setTag('meta[property="og:url"]', 'content', url);
    setTag('meta[property="og:type"]', 'content', type);
    setTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    if (image) {
      var absImage = image.startsWith('http') ? image : (window.location.origin + '/' + image);
      setTag('meta[property="og:image"]', 'content', absImage);
      setTag('meta[name="twitter:image"]', 'content', absImage);
    }
    setTag('meta[property="og:site_name"]', 'content', 'VisorUp');

    var canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }

  _injectJsonLd(article) {
    var existing = document.getElementById('visorup-jsonld');
    if (existing) existing.remove();
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'visorup-jsonld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': article.title,
      'description': article.metaDescription,
      'image': window.location.origin + '/' + article.heroImage,
      'author': { '@type': 'Organization', 'name': 'VisorUp', 'url': 'https://visorup.co.uk' },
      'publisher': { '@type': 'Organization', 'name': 'VisorUp', 'url': 'https://visorup.co.uk', 'logo': { '@type': 'ImageObject', 'url': 'https://visorup.co.uk/public/images/heroes/homepage.jpg' } },
      'datePublished': article.publishDate,
      'dateModified': article.publishDate,
      'mainEntityOfPage': { '@type': 'WebPage', '@id': window.location.origin + '/guides/' + article.category + '/' + article.slug },
      'keywords': article.tags.join(', ')
    });
    document.head.appendChild(script);
  }

  renderFooter() {
    return '' +
    '<footer class="site-footer">' +
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<div class="footer-logo"><i class="fas fa-motorcycle"></i> VISOR<strong>UP</strong></div>' +
            '<p>Motorcycle Adventures Across Britain</p>' +
            '<p class="footer-tagline">From Island Roads To Highland Horizons</p>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Explore</h4>' +
            '<a href="/routes">Routes</a>' +
            '<a href="/destinations">Destinations</a>' +
            '<a href="/ferries">Ferries</a>' +
            '<a href="/bikes">Bike Guides</a>' +
            '<a href="/planning">Trip Planning</a>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Destinations</h4>' +
            '<a href="/destinations/isle-of-skye">Isle of Skye</a>' +
            '<a href="/destinations/nc500">NC500</a>' +
            '<a href="/destinations/glencoe">Glencoe</a>' +
            '<a href="/destinations/lake-district">Lake District</a>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Company</h4>' +
            '<a href="/about">About</a>' +
            '<a href="/contact">Contact</a>' +
            '<a href="/privacy">Privacy Policy</a>' +
            '<a href="/terms">Terms of Service</a>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<p>&copy; 2026 VisorUp. All rights reserved. Ride safe.</p>' +
        '</div>' +
      '</div>' +
    '</footer>';
  }

  // ── Utilities ─────────────────────────────────────────────────

  setActiveNav(name) {
    // Mega trigger active states
    var explorePages = ['routes','destinations','ferries','bikes'];
    var guidesPages = ['guides'];
    var toolsPages = ['planning','build-route','plan-trip'];
    document.querySelectorAll('.mega-trigger').forEach(function(t) {
      t.classList.remove('active');
    });
    document.querySelectorAll('.nav-links > a[data-nav]').forEach(function(a) {
      a.classList.remove('active');
      if (a.dataset.nav === name) a.classList.add('active');
    });
    if (explorePages.indexOf(name) >= 0) {
      var et = document.querySelector('.mega-trigger[data-nav="explore"]');
      if (et) et.classList.add('active');
    }
    if (guidesPages.indexOf(name) >= 0) {
      var gt = document.querySelector('.mega-trigger[data-nav="guides"]');
      if (gt) gt.classList.add('active');
    }
    if (toolsPages.indexOf(name) >= 0) {
      var tt = document.querySelector('.mega-trigger[data-nav="tools"]');
      if (tt) tt.classList.add('active');
    }
  }

  setTitle(page) {
    document.title = page ? page + ' | VisorUp' : 'VisorUp — Motorcycle Adventures Across Britain';
  }

  scrollToTop() {
    if (this.siteView) this.siteView.scrollTop = 0;
    window.scrollTo(0, 0);
    this._initLazyImages();
    this._syncFavourites();
  }

  _initLazyImages() {
    var els = document.querySelectorAll('[data-bg]:not([data-bg-loaded])');
    if (els.length === 0) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function(el) { el.style.backgroundImage = 'url(' + el.dataset.bg + ')'; el.setAttribute('data-bg-loaded', '1'); });
      return;
    }
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.style.backgroundImage = 'url(' + el.dataset.bg + ')';
          el.setAttribute('data-bg-loaded', '1');
          observer.unobserve(el);
        }
      });
    }, { rootMargin: '200px' });
    els.forEach(function(el) { observer.observe(el); });
  }

  async _syncFavourites() {
    if (typeof VisorUpAuth === 'undefined' || typeof VisorUpFavourites === 'undefined') return;
    var user = await VisorUpAuth.getUser();
    if (!user) return;
    var favs = await VisorUpFavourites.list();
    document.querySelectorAll('.fav-btn[data-fav-type]').forEach(function(btn) {
      var type = btn.dataset.favType;
      var slug = btn.dataset.favSlug;
      var isFav = favs.some(function(f) { return f.item_type === type && f.item_slug === slug; });
      btn.classList.toggle('fav-active', isFav);
    });
  }

  bindThemeToggle() {
    var toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    // Read saved theme
    var saved = localStorage.getItem('visorup-theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
      this._updateThemeIcon(toggle, saved);
    }

    var self = this;
    toggle.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('visorup-theme', next);
      self._updateThemeIcon(toggle, next);
    });
  }

  _updateThemeIcon(btn, theme) {
    var icon = btn.querySelector('i');
    if (!icon) return;
    if (theme === 'dark') {
      icon.className = 'fas fa-sun';
    } else {
      icon.className = 'fas fa-moon';
    }
  }

  bindMobileNav() {
    var menuBtn = document.getElementById('navMenuBtn');
    var mobileMenu = document.getElementById('navMobileMenu');
    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('open');
      var icon = menuBtn.querySelector('i');
      if (icon) {
        icon.className = mobileMenu.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
      }
    });

    // Accordion toggles
    mobileMenu.querySelectorAll('.mob-heading').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var targetId = btn.dataset.mobToggle;
        var sub = document.getElementById(targetId);
        if (!sub) return;
        var isOpen = sub.classList.contains('open');
        // Close all
        mobileMenu.querySelectorAll('.mob-sub').forEach(function(s) { s.classList.remove('open'); });
        mobileMenu.querySelectorAll('.mob-heading').forEach(function(b) { b.classList.remove('open'); });
        if (!isOpen) {
          sub.classList.add('open');
          btn.classList.add('open');
        }
      });
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('open');
        var icon = menuBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }

  bindPlannerBack() {
    var backBtn = document.getElementById('plannerBack');
    if (!backBtn) return;
    var self = this;
    backBtn.addEventListener('click', function() {
      self.navigate('/routes');
    });
  }

  bindNavLinks() {
    var self = this;

    // Desktop nav links
    document.querySelectorAll('.nav-links a[data-nav]').forEach(function(link) {
      link.addEventListener('click', function() {
        // Close mobile menu if open
        var mobileMenu = document.getElementById('navMobileMenu');
        if (mobileMenu) mobileMenu.classList.remove('open');
        var menuBtn = document.getElementById('navMenuBtn');
        if (menuBtn) {
          var icon = menuBtn.querySelector('i');
          if (icon) icon.className = 'fas fa-bars';
        }
      });
    });

    // Delegate clicks for filter pills (destinations page)
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('filter-pill')) {
        var filter = e.target.dataset.filter;
        document.querySelectorAll('.filter-pill').forEach(function(p) { p.classList.remove('filter-pill-active'); });
        e.target.classList.add('filter-pill-active');

        document.querySelectorAll('#destGrid .dest-card').forEach(function(card) {
          if (filter === 'All') {
            card.style.display = '';
          } else {
            var region = card.getAttribute('data-region') || '';
            card.style.display = region === filter ? '' : 'none';
          }
        });
      }
    });

    // Delegate click for favourite buttons
    document.addEventListener('click', function(e) {
      var favBtn = e.target.closest('.fav-btn');
      if (!favBtn) return;
      e.preventDefault();
      if (typeof VisorUpAuth === 'undefined' || typeof VisorUpFavourites === 'undefined') return;
      VisorUpAuth.getUser().then(function(user) {
        if (!user) { self.showAuthModal('login'); return; }
        var type = favBtn.dataset.favType;
        var slug = favBtn.dataset.favSlug;
        VisorUpFavourites.toggle(type, slug).then(function(isFav) {
          favBtn.classList.toggle('fav-active', isFav);
        });
      });
    });

    // Delegate click for hero scroll indicator
    document.addEventListener('click', function(e) {
      if (e.target.closest('.hero-scroll')) {
        var hero = e.target.closest('.hero');
        if (hero && hero.nextElementSibling) {
          hero.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  // ── Auth ────────────────────────────────────────────────────

  bindAuth() {
    var self = this;
    var modal = document.getElementById('authModal');
    var closeBtn = document.getElementById('authModalClose');
    var googleBtn = document.getElementById('authGoogleBtn');
    var form = document.getElementById('authEmailForm');
    var toggleLink = document.getElementById('authToggleLink');
    var forgotLink = document.getElementById('authForgotLink');
    this._authMode = 'login';

    if (closeBtn) closeBtn.addEventListener('click', function() { self.hideAuthModal(); });
    if (modal) modal.addEventListener('click', function(e) { if (e.target === modal) self.hideAuthModal(); });

    if (googleBtn) googleBtn.addEventListener('click', function() {
      if (typeof VisorUpAuth !== 'undefined') VisorUpAuth.signInGoogle();
    });

    if (toggleLink) toggleLink.addEventListener('click', function(e) {
      e.preventDefault();
      self._authMode = self._authMode === 'login' ? 'signup' : 'login';
      self._updateAuthModal();
    });

    if (forgotLink) forgotLink.addEventListener('click', function(e) {
      e.preventDefault();
      var email = document.getElementById('authEmail').value;
      if (!email) { self._showAuthError('Enter your email address first'); return; }
      VisorUpAuth.resetPassword(email).then(function() {
        document.getElementById('authModalBody').style.display = 'none';
        document.getElementById('authSuccessBody').style.display = '';
        document.getElementById('authSuccessMsg').textContent = 'Password reset link sent to ' + email;
      }).catch(function(err) { self._showAuthError(err.message); });
    });

    if (form) form.addEventListener('submit', function(e) {
      e.preventDefault();
      var email = document.getElementById('authEmail').value;
      var password = document.getElementById('authPassword').value;
      var submitBtn = document.getElementById('authSubmitBtn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Please wait...';
      self._hideAuthError();

      if (self._authMode === 'signup') {
        var name = document.getElementById('authName').value || email.split('@')[0];
        VisorUpAuth.signUpEmail(email, password, name).then(function(data) {
          if (data.user && !data.session) {
            document.getElementById('authModalBody').style.display = 'none';
            document.getElementById('authSuccessBody').style.display = '';
            document.getElementById('authSuccessMsg').textContent = 'Check your email to confirm your account.';
          } else {
            self.hideAuthModal();
            self._updateNavAuth();
          }
        }).catch(function(err) {
          self._showAuthError(err.message);
          submitBtn.disabled = false;
          submitBtn.textContent = 'Sign Up';
        });
      } else {
        VisorUpAuth.signInEmail(email, password).then(function() {
          self.hideAuthModal();
          self._updateNavAuth();
          self.navigate('/profile');
        }).catch(function(err) {
          self._showAuthError(err.message);
          submitBtn.disabled = false;
          submitBtn.textContent = 'Log In';
        });
      }
    });

    if (typeof VisorUpAuth !== 'undefined') {
      VisorUpAuth.onAuthChange(function(event) {
        self._updateNavAuth();
      });
      self._updateNavAuth();
    }
  }

  showAuthModal(mode) {
    this._authMode = mode || 'login';
    this._updateAuthModal();
    document.getElementById('authModalBody').style.display = '';
    document.getElementById('authSuccessBody').style.display = 'none';
    document.getElementById('authModal').style.display = '';
    this._hideAuthError();
    document.getElementById('authEmail').value = '';
    document.getElementById('authPassword').value = '';
    document.getElementById('authName').value = '';
  }

  hideAuthModal() {
    document.getElementById('authModal').style.display = 'none';
  }

  _updateAuthModal() {
    var isSignup = this._authMode === 'signup';
    document.getElementById('authModalTitle').textContent = isSignup ? 'Create Account' : 'Log In';
    document.getElementById('authModalSub').textContent = isSignup ? 'Join VisorUp to save trips and share routes.' : 'Save trips, favourite routes, and share adventures.';
    document.getElementById('authSubmitBtn').textContent = isSignup ? 'Sign Up' : 'Log In';
    document.getElementById('authSubmitBtn').disabled = false;
    document.getElementById('authName').style.display = isSignup ? '' : 'none';
    document.getElementById('authToggle').innerHTML = isSignup
      ? 'Already have an account? <a href="#" id="authToggleLink">Log in</a>'
      : 'Don\'t have an account? <a href="#" id="authToggleLink">Sign up</a>';
    var self = this;
    document.getElementById('authToggleLink').addEventListener('click', function(e) {
      e.preventDefault();
      self._authMode = self._authMode === 'login' ? 'signup' : 'login';
      self._updateAuthModal();
    });
  }

  _showAuthError(msg) {
    var el = document.getElementById('authError');
    el.textContent = msg;
    el.style.display = '';
  }

  _hideAuthError() {
    document.getElementById('authError').style.display = 'none';
  }

  async _updateNavAuth() {
    var loginBtn = document.getElementById('navLoginBtn');
    var profileBtn = document.getElementById('navProfileBtn');
    if (typeof VisorUpAuth === 'undefined') return;

    var user = await VisorUpAuth.getUser();
    if (user) {
      loginBtn.style.display = 'none';
      profileBtn.style.display = '';
      var profile = await VisorUpAuth.getProfile();
      if (profile) {
        document.getElementById('navUserName').textContent = profile.display_name || 'Profile';
        var avatar = document.getElementById('navAvatar');
        if (profile.avatar_url) {
          avatar.src = profile.avatar_url;
          avatar.style.display = '';
        } else {
          avatar.style.display = 'none';
        }
      }
    } else {
      loginBtn.style.display = '';
      profileBtn.style.display = 'none';
    }
  }

  // ── Profile Page ────────────────────────────────────────────

  async renderProfile() {
    if (typeof VisorUpAuth === 'undefined') { this.navigate('/login'); return; }
    var user = await VisorUpAuth.getUser();
    if (!user) { this.showAuthModal('login'); return; }

    this.setTitle('My Profile');
    this._setMeta({ description: 'Your VisorUp profile — saved routes, favourites, and motorcycle garage.' });
    this.pageContent.innerHTML = '<section class="page-section"><div class="container"><p style="color:var(--text-muted)">Loading profile...</p></div></section>' + this.renderFooter();

    var profile = null, trips = [], favs = [], garageBikes = [];
    try {
      var results = await Promise.all([
        VisorUpAuth.getProfile().catch(function() { return null; }),
        (typeof VisorUpTrips !== 'undefined') ? VisorUpTrips.list().catch(function() { return []; }) : [],
        (typeof VisorUpFavourites !== 'undefined') ? VisorUpFavourites.list().catch(function() { return []; }) : [],
        (typeof VisorUpGarage !== 'undefined') ? VisorUpGarage.list().catch(function() { return []; }) : []
      ]);
      profile = results[0];
      trips = results[1] || [];
      favs = results[2] || [];
      garageBikes = results[3] || [];
    } catch (e) {
      console.error('Profile data load error:', e);
    }

    var avatarInner = profile && profile.avatar_url
      ? '<img src="' + profile.avatar_url + '" class="profile-avatar" alt="">'
      : '<div class="profile-avatar-placeholder">' + ((profile && profile.display_name) || 'U').charAt(0).toUpperCase() + '</div>';
    var avatarHTML = '<label class="profile-avatar-upload" title="Click to change photo">' +
      avatarInner +
      '<input type="file" id="avatarUpload" accept="image/jpeg,image/png,image/webp" style="display:none">' +
      '<span class="profile-avatar-edit"><i class="fas fa-camera"></i></span>' +
    '</label>';

    var tripsHTML = '';
    if (trips.length === 0) {
      tripsHTML = '<div class="profile-empty"><i class="fas fa-route"></i><p>No saved trips yet. Build a route and save it!</p><a href="/build-route" class="hero-cta" style="display:inline-flex;margin-top:12px;font-size:13px;"><i class="fas fa-pencil-ruler"></i> Build a Route</a></div>';
    } else {
      tripsHTML = trips.map(function(t) {
        var stats = t.route_stats || {};
        var date = new Date(t.updated_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
        return '<div class="saved-trip-card" data-trip-id="' + t.id + '">' +
          '<div class="saved-trip-info">' +
            '<h4>' + t.name + '</h4>' +
            '<p>' + (stats.distance || '?') + ' miles · ' + (stats.waypoints || '?') + ' stops · Updated ' + date + '</p>' +
          '</div>' +
          '<div class="saved-trip-actions">' +
            '<button class="trip-load-btn" data-id="' + t.id + '" title="Open in Route Builder"><i class="fas fa-map"></i></button>' +
            '<button class="trip-share-btn" data-id="' + t.id + '" data-public="' + (t.is_public ? '1' : '0') + '" title="' + (t.is_public ? 'Shared' : 'Share') + '"><i class="fas fa-' + (t.is_public ? 'link' : 'share-alt') + '"></i></button>' +
            '<button class="trip-delete-btn" data-id="' + t.id + '" title="Delete"><i class="fas fa-trash"></i></button>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    var favsHTML = '';
    if (favs.length === 0) {
      favsHTML = '<div class="profile-empty"><i class="fas fa-heart"></i><p>No favourites yet. Tap the heart on any destination or route.</p></div>';
    } else {
      favsHTML = favs.map(function(f) {
        var icon = f.item_type === 'destination' ? 'fa-map-pin' : f.item_type === 'route' ? 'fa-route' : 'fa-motorcycle';
        var href = '/' + f.item_type + 's/' + f.item_slug;
        var label = f.item_slug.replace(/-/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
        return '<a href="' + href + '" class="fav-item"><i class="fas ' + icon + '"></i><span>' + label + '</span><span class="fav-type">' + f.item_type + '</span></a>';
      }).join('');
    }

    // Garage HTML
    var garageHTML = '';
    if (garageBikes.length === 0) {
      garageHTML = '<div class="profile-empty"><i class="fas fa-motorcycle"></i><p>No bikes in your garage yet. Add your first ride!</p></div>';
    } else {
      garageHTML = '<div class="garage-grid">' + garageBikes.map(function(b) {
        var photoHTML = b.photo_url
          ? '<img src="' + b.photo_url + '" class="garage-card-img" alt="' + b.make + ' ' + b.model + '">'
          : '<div class="garage-card-placeholder"><i class="fas fa-motorcycle"></i></div>';
        return '<div class="garage-card" data-bike-id="' + b.id + '">' +
          '<div class="garage-card-media">' +
            photoHTML +
            (b.is_primary ? '<span class="garage-primary-badge"><i class="fas fa-star"></i> Primary</span>' : '') +
            '<label class="garage-photo-upload" title="Upload photo"><input type="file" class="garage-photo-input" data-bike-id="' + b.id + '" accept="image/jpeg,image/png,image/webp" style="display:none"><span class="garage-photo-btn"><i class="fas fa-camera"></i></span></label>' +
          '</div>' +
          '<div class="garage-card-body">' +
            (b.nickname ? '<div class="garage-nickname">' + b.nickname + '</div>' : '') +
            '<div class="garage-make-model">' + b.make + ' ' + b.model + (b.year ? ' <span class="garage-year">' + b.year + '</span>' : '') + '</div>' +
            (b.tank_litres && b.mpg ? (function() {
              var r = (typeof calculateBikeRange !== 'undefined') ? calculateBikeRange(b.tank_litres, b.mpg) : null;
              return '<div class="garage-bike-range"><span><i class="fas fa-gas-pump"></i> ' + b.tank_litres + 'L</span><span><i class="fas fa-tachometer-alt"></i> ' + b.mpg + ' mpg</span>' + (r ? '<span><i class="fas fa-road"></i> ~' + r.safeRange + ' mi range</span>' : '') + '</div>';
            })() : '') +
            (b.notes ? '<div class="garage-notes">' + b.notes + '</div>' : '') +
          '</div>' +
          '<div class="garage-card-actions">' +
            (!b.is_primary ? '<button class="garage-action-btn garage-set-primary" data-bike-id="' + b.id + '" title="Set as primary"><i class="fas fa-star"></i></button>' : '') +
            '<button class="garage-action-btn garage-delete-btn" data-bike-id="' + b.id + '" title="Remove"><i class="fas fa-trash"></i></button>' +
          '</div>' +
        '</div>';
      }).join('') + '</div>';
    }

    var makeOptions = '<option value="">Select make...</option>';
    if (typeof BIKE_CATALOGUE !== 'undefined') {
      Object.keys(BIKE_CATALOGUE).sort().forEach(function(m) {
        makeOptions += '<option value="' + m + '">' + m + '</option>';
      });
    }
    makeOptions += '<option value="__other">Other</option>';

    var addBikeFormHTML = '' +
      '<div class="garage-add-form" id="garageAddForm" style="display:none">' +
        '<div class="garage-form-grid">' +
          '<div><label>Make *</label><select id="garageMake" class="garage-select">' + makeOptions + '</select><input type="text" id="garageMakeCustom" class="garage-custom-input" placeholder="Enter make..." style="display:none"></div>' +
          '<div><label>Model *</label><select id="garageModel" class="garage-select" disabled><option value="">Select make first...</option></select><input type="text" id="garageModelCustom" class="garage-custom-input" placeholder="Enter model..." style="display:none"></div>' +
          '<div><label>Year</label><input type="number" id="garageYear" placeholder="e.g. 2024" min="1950" max="2030"></div>' +
          '<div><label>Nickname</label><div class="garage-nickname-wrap"><input type="text" id="garageNickname" placeholder="e.g. The Beast"><button type="button" class="garage-nickname-gen" id="garageNicknameGen" title="Generate nickname"><i class="fas fa-dice"></i></button></div></div>' +
        '</div>' +
        '<div id="garageBikeSpecs" class="garage-bike-specs" style="display:none"></div>' +
        '<div style="margin-top:8px"><label>Notes</label><input type="text" id="garageNotes" placeholder="Mods, spec, stories..." style="width:100%"></div>' +
        '<div class="garage-form-actions">' +
          '<button class="btn-primary" id="garageSaveBtn" style="font-size:13px;padding:10px 20px;"><i class="fas fa-plus"></i> Add to Garage</button>' +
          '<button class="btn-outline" id="garageCancelBtn" style="font-size:13px;padding:10px 20px;">Cancel</button>' +
        '</div>' +
      '</div>';

    this.pageContent.innerHTML = '' +
    '<section class="page-section">' +
      '<div class="container">' +
        '<div class="profile-header">' +
          avatarHTML +
          '<div class="profile-info">' +
            '<h2>' + ((profile && profile.display_name) || 'Rider') + '</h2>' +
            '<p>' + (user.email || '') + '</p>' +
          '</div>' +
          '<div class="profile-actions">' +
            '<button class="auth-submit-btn" id="profileLogout" style="padding:8px 16px;font-size:12px;width:auto;"><i class="fas fa-sign-out-alt"></i> Log Out</button>' +
          '</div>' +
        '</div>' +

        (typeof VisorUpGamification !== 'undefined' ? (function() {
          VisorUpGamification.checkActivityBadges(trips, favs, garageBikes);
          var stats = VisorUpGamification.getStats();
          return '<div class="profile-section">' +
            VisorUpGamification.renderLevelBadge() +
            '<div class="profile-stats-row">' +
              '<div class="profile-stat-card"><span class="profile-stat-val">' + stats.rideCount + '</span><span class="profile-stat-label">Rides</span></div>' +
              '<div class="profile-stat-card"><span class="profile-stat-val">' + stats.totalMiles.toLocaleString() + '</span><span class="profile-stat-label">Miles</span></div>' +
              '<div class="profile-stat-card"><span class="profile-stat-val">' + stats.badgeCount + '/' + stats.totalBadges + '</span><span class="profile-stat-label">Badges</span></div>' +
              '<div class="profile-stat-card"><span class="profile-stat-val">' + stats.destinationsVisited + '/' + stats.totalDestinations + '</span><span class="profile-stat-label">Destinations</span></div>' +
            '</div>' +
          '</div>';
        })() : '') +

        '<div class="profile-section">' +
          '<h3><i class="fas fa-warehouse"></i> My Garage (' + garageBikes.length + ') <button class="garage-add-trigger" id="garageAddTrigger"><i class="fas fa-plus"></i> Add Bike</button></h3>' +
          garageHTML +
          addBikeFormHTML +
        '</div>' +

        '<div class="profile-section">' +
          '<h3><i class="fas fa-route"></i> Saved Trips (' + trips.length + ')</h3>' +
          tripsHTML +
        '</div>' +

        '<div class="profile-section">' +
          '<h3><i class="fas fa-heart"></i> Favourites (' + favs.length + ')</h3>' +
          favsHTML +
        '</div>' +

        (typeof VisorUpGamification !== 'undefined' ? '' +
        '<div class="profile-section">' +
          '<h3><i class="fas fa-motorcycle"></i> Ride Log <button class="garage-add-trigger" id="rideLogAddTrigger"><i class="fas fa-plus"></i> Log a Ride</button></h3>' +
          '<div class="ride-log-form" id="rideLogForm" style="display:none">' +
            '<div class="garage-form-grid">' +
              '<div><label>Ride Name *</label><input type="text" id="rideLogName" placeholder="e.g. NC500 Day 1"></div>' +
              '<div><label>Date *</label><input type="date" id="rideLogDate" value="' + new Date().toISOString().split('T')[0] + '"></div>' +
              '<div><label>Miles</label><input type="number" id="rideLogMiles" placeholder="e.g. 180"></div>' +
              '<div><label>Rating</label><select id="rideLogRating" class="garage-select"><option value="">Rate...</option><option value="5">★★★★★</option><option value="4">★★★★</option><option value="3">★★★</option><option value="2">★★</option><option value="1">★</option></select></div>' +
            '</div>' +
            '<div style="margin-top:8px"><label>Notes</label><input type="text" id="rideLogNotes" placeholder="Weather, highlights, memories..." style="width:100%"></div>' +
            '<div class="garage-form-actions"><button class="btn-primary" id="rideLogSaveBtn" style="font-size:13px;padding:10px 20px;"><i class="fas fa-plus"></i> Log Ride</button><button class="btn-outline" id="rideLogCancelBtn" style="font-size:13px;padding:10px 20px;">Cancel</button></div>' +
          '</div>' +
          VisorUpGamification.renderRideLog() +
        '</div>' +

        '<div class="profile-section">' +
          '<h3><i class="fas fa-map"></i> Scratch Map</h3>' +
          '<p class="section-desc" style="text-align:left;margin:0 0 16px;font-size:13px;color:var(--text-muted)">Tick off destinations as you ride them. Complete all regions to earn badges.</p>' +
          VisorUpGamification.renderScratchMap() +
        '</div>' +

        '<div class="profile-section">' +
          '<h3><i class="fas fa-medal"></i> Badges (' + VisorUpGamification.getEarnedBadges().length + '/' + BADGES.length + ')</h3>' +
          VisorUpGamification.renderBadgeGrid() +
        '</div>' : '') +

      '</div>' +
    '</section>' + this.renderFooter();

    var self = this;

    document.getElementById('profileLogout').addEventListener('click', function() {
      VisorUpAuth.signOut().then(function() {
        self._updateNavAuth();
        self.navigate('/');
      });
    });

    var avatarInput = document.getElementById('avatarUpload');
    if (avatarInput) {
      avatarInput.addEventListener('change', function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var label = avatarInput.closest('.profile-avatar-upload');
        var editIcon = label.querySelector('.profile-avatar-edit');
        if (editIcon) editIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        VisorUpAuth.uploadAvatar(file).then(function(newUrl) {
          var img = label.querySelector('img');
          var placeholder = label.querySelector('.profile-avatar-placeholder');
          if (img) {
            img.src = newUrl;
          } else if (placeholder) {
            var newImg = document.createElement('img');
            newImg.src = newUrl;
            newImg.className = 'profile-avatar';
            newImg.alt = '';
            placeholder.replaceWith(newImg);
          }
          if (editIcon) editIcon.innerHTML = '<i class="fas fa-camera"></i>';
          self._updateNavAuth();
        }).catch(function(err) {
          alert('Upload failed: ' + err.message);
          if (editIcon) editIcon.innerHTML = '<i class="fas fa-camera"></i>';
        });
      });
    }

    document.querySelectorAll('.trip-load-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var tripId = btn.dataset.id;
        sessionStorage.setItem('vu_load_trip', tripId);
        self.navigate('/build-route');
      });
    });

    document.querySelectorAll('.trip-share-btn').forEach(function(btn) {
      btn.addEventListener('click', async function() {
        var tripId = btn.dataset.id;
        try {
          var trip = await VisorUpTrips.togglePublic(tripId);
          if (trip.is_public) {
            var url = window.location.origin + '/shared/' + trip.share_slug;
            await navigator.clipboard.writeText(url);
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.title = 'Link copied!';
            setTimeout(function() {
              btn.innerHTML = '<i class="fas fa-link"></i>';
              btn.dataset.public = '1';
            }, 2000);
          } else {
            btn.innerHTML = '<i class="fas fa-share-alt"></i>';
            btn.dataset.public = '0';
          }
        } catch (err) { console.error(err); }
      });
    });

    document.querySelectorAll('.trip-delete-btn').forEach(function(btn) {
      btn.addEventListener('click', async function() {
        if (!confirm('Delete this trip?')) return;
        var tripId = btn.dataset.id;
        await VisorUpTrips.delete(tripId);
        btn.closest('.saved-trip-card').remove();
      });
    });

    // Garage: Add bike toggle
    var addTrigger = document.getElementById('garageAddTrigger');
    var addForm = document.getElementById('garageAddForm');
    var _selectedBikeSpec = null;
    if (addTrigger && addForm) {
      addTrigger.addEventListener('click', function() {
        addForm.style.display = addForm.style.display === 'none' ? '' : 'none';
      });
      document.getElementById('garageCancelBtn').addEventListener('click', function() {
        addForm.style.display = 'none';
      });

      // Make dropdown -> populate models
      var makeSelect = document.getElementById('garageMake');
      var modelSelect = document.getElementById('garageModel');
      var makeCustom = document.getElementById('garageMakeCustom');
      var modelCustom = document.getElementById('garageModelCustom');
      var specsDiv = document.getElementById('garageBikeSpecs');

      makeSelect.addEventListener('change', function() {
        var make = makeSelect.value;
        _selectedBikeSpec = null;
        specsDiv.style.display = 'none';
        if (make === '__other') {
          makeCustom.style.display = '';
          modelCustom.style.display = '';
          modelSelect.style.display = 'none';
          modelSelect.disabled = true;
          makeCustom.focus();
          return;
        }
        makeCustom.style.display = 'none';
        modelCustom.style.display = 'none';
        modelSelect.style.display = '';
        if (!make || typeof BIKE_CATALOGUE === 'undefined' || !BIKE_CATALOGUE[make]) {
          modelSelect.innerHTML = '<option value="">Select make first...</option>';
          modelSelect.disabled = true;
          return;
        }
        var models = BIKE_CATALOGUE[make];
        var opts = '<option value="">Select model...</option>';
        models.forEach(function(m) {
          opts += '<option value="' + m.model + '">' + m.model + ' (' + m.category + ')</option>';
        });
        opts += '<option value="__other">Other</option>';
        modelSelect.innerHTML = opts;
        modelSelect.disabled = false;
      });

      // Model dropdown -> show specs
      modelSelect.addEventListener('change', function() {
        var make = makeSelect.value;
        var model = modelSelect.value;
        _selectedBikeSpec = null;
        if (model === '__other') {
          modelCustom.style.display = '';
          modelCustom.focus();
          specsDiv.style.display = 'none';
          return;
        }
        modelCustom.style.display = 'none';
        if (!make || !model || typeof BIKE_CATALOGUE === 'undefined') { specsDiv.style.display = 'none'; return; }
        var entry = BIKE_CATALOGUE[make] && BIKE_CATALOGUE[make].find(function(m) { return m.model === model; });
        if (entry) {
          _selectedBikeSpec = entry;
          var range = (typeof calculateBikeRange !== 'undefined') ? calculateBikeRange(entry.tank, entry.mpg) : null;
          specsDiv.innerHTML = '<div class="garage-specs-row">' +
            '<span><i class="fas fa-gas-pump"></i> ' + entry.tank + 'L tank</span>' +
            '<span><i class="fas fa-tachometer-alt"></i> ' + entry.mpg + ' mpg</span>' +
            (range ? '<span><i class="fas fa-road"></i> ~' + range.safeRange + ' mi safe range</span>' : '') +
            '<span><i class="fas fa-tag"></i> ' + entry.category + '</span>' +
          '</div>';
          specsDiv.style.display = '';
        } else {
          specsDiv.style.display = 'none';
        }
      });

      // Nickname generator
      document.getElementById('garageNicknameGen').addEventListener('click', function() {
        var make = makeSelect.value === '__other' ? makeCustom.value.trim() : makeSelect.value;
        var model = modelSelect.value === '__other' ? modelCustom.value.trim() : (modelSelect.disabled ? modelCustom.value.trim() : modelSelect.value);
        if (!make || !model) { alert('Select a make and model first'); return; }
        if (typeof generateBikeNickname !== 'undefined') {
          var suggestions = generateBikeNickname(make, model);
          var nicknameInput = document.getElementById('garageNickname');
          var current = nicknameInput.value.trim();
          var idx = current ? suggestions.indexOf(current) : -1;
          nicknameInput.value = suggestions[(idx + 1) % suggestions.length];
        }
      });

      // Save bike
      document.getElementById('garageSaveBtn').addEventListener('click', async function() {
        var make = makeSelect.value === '__other' ? makeCustom.value.trim() : makeSelect.value;
        var model = modelSelect.value === '__other' || modelSelect.disabled ? modelCustom.value.trim() : modelSelect.value;
        if (!make || !model) { alert('Make and model are required'); return; }
        try {
          await VisorUpGarage.add({
            make: make,
            model: model,
            year: parseInt(document.getElementById('garageYear').value) || null,
            nickname: document.getElementById('garageNickname').value.trim() || null,
            notes: document.getElementById('garageNotes').value.trim() || null,
            isPrimary: garageBikes.length === 0,
            tankLitres: _selectedBikeSpec ? _selectedBikeSpec.tank : null,
            mpg: _selectedBikeSpec ? _selectedBikeSpec.mpg : null
          });
          self.renderProfile();
        } catch (e) { alert('Failed to add bike: ' + e.message); }
      });
    }

    // Garage: Photo upload
    document.querySelectorAll('.garage-photo-input').forEach(function(input) {
      input.addEventListener('change', async function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var bikeId = input.dataset.bikeId;
        var card = input.closest('.garage-card');
        var btn = card.querySelector('.garage-photo-btn');
        if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        try {
          await VisorUpGarage.uploadPhoto(bikeId, file);
          self.renderProfile();
        } catch (err) {
          alert('Upload failed: ' + err.message);
          if (btn) btn.innerHTML = '<i class="fas fa-camera"></i>';
        }
      });
    });

    // Garage: Set primary
    document.querySelectorAll('.garage-set-primary').forEach(function(btn) {
      btn.addEventListener('click', async function() {
        try {
          await VisorUpGarage.setPrimary(btn.dataset.bikeId);
          self.renderProfile();
        } catch (e) { console.error(e); }
      });
    });

    // Garage: Delete
    document.querySelectorAll('.garage-delete-btn').forEach(function(btn) {
      btn.addEventListener('click', async function() {
        if (!confirm('Remove this bike from your garage?')) return;
        try {
          await VisorUpGarage.remove(btn.dataset.bikeId);
          btn.closest('.garage-card').remove();
        } catch (e) { console.error(e); }
      });
    });

    // Ride log
    var rideLogTrigger = document.getElementById('rideLogAddTrigger');
    var rideLogForm = document.getElementById('rideLogForm');
    if (rideLogTrigger && rideLogForm) {
      rideLogTrigger.addEventListener('click', function() {
        rideLogForm.style.display = rideLogForm.style.display === 'none' ? '' : 'none';
      });
      document.getElementById('rideLogCancelBtn').addEventListener('click', function() {
        rideLogForm.style.display = 'none';
      });
      document.getElementById('rideLogSaveBtn').addEventListener('click', function() {
        var name = document.getElementById('rideLogName').value.trim();
        var date = document.getElementById('rideLogDate').value;
        if (!name || !date) { alert('Name and date are required'); return; }
        VisorUpGamification.logRide({
          name: name,
          date: date,
          miles: parseInt(document.getElementById('rideLogMiles').value) || 0,
          rating: parseInt(document.getElementById('rideLogRating').value) || 0,
          notes: document.getElementById('rideLogNotes').value.trim() || ''
        });
        self.renderProfile();
      });
    }
    document.querySelectorAll('.ride-log-delete').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (!confirm('Delete this ride?')) return;
        VisorUpGamification.deleteRide(btn.dataset.rideId);
        btn.closest('.ride-log-item').remove();
      });
    });

    // Scratch map
    document.querySelectorAll('.scratch-dest').forEach(function(card) {
      card.addEventListener('click', function() {
        var slug = card.dataset.destSlug;
        var visited = VisorUpGamification.getVisitedDestinations();
        if (visited.indexOf(slug) !== -1) {
          VisorUpGamification.unvisitDestination(slug);
          card.classList.remove('scratch-visited');
          card.querySelector('.scratch-check, .scratch-unvisited').outerHTML = '<div class="scratch-unvisited"><i class="fas fa-map-pin"></i></div>';
        } else {
          VisorUpGamification.visitDestination(slug);
          card.classList.add('scratch-visited');
          card.querySelector('.scratch-check, .scratch-unvisited').outerHTML = '<div class="scratch-check"><i class="fas fa-check-circle"></i></div>';
        }
        // Update progress bar
        var allVisited = VisorUpGamification.getVisitedDestinations();
        var total = typeof DESTINATIONS !== 'undefined' ? DESTINATIONS.length : 13;
        var pct = Math.round((allVisited.length / total) * 100);
        var progText = document.querySelector('.scratch-progress-text');
        var progFill = document.querySelector('.scratch-progress-fill');
        if (progText) progText.textContent = allVisited.length + ' / ' + total + ' destinations visited (' + pct + '%)';
        if (progFill) progFill.style.width = pct + '%';
      });
    });
  }

  // ── Notifications ─────────────────────────────────────────

  bindNotifications() {
    var self = this;
    var bellBtn = document.getElementById('navNotifBtn');
    if (!bellBtn) return;

    // Update badge on load
    if (typeof VisorUpNotifications !== 'undefined') {
      VisorUpNotifications._updateBadge();
    }

    bellBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var existing = document.getElementById('notifPanel');
      if (existing) { existing.remove(); return; }
      self._showNotifPanel();
    });

    document.addEventListener('click', function(e) {
      if (!e.target.closest('#notifPanel') && !e.target.closest('#navNotifBtn')) {
        var panel = document.getElementById('notifPanel');
        if (panel) panel.remove();
      }
    });
  }

  _showNotifPanel() {
    var self = this;
    var existing = document.getElementById('notifPanel');
    if (existing) existing.remove();

    var notifications = typeof VisorUpNotifications !== 'undefined' ? VisorUpNotifications.getAll() : [];

    var itemsHTML = '';
    if (notifications.length === 0) {
      itemsHTML = '<div class="notif-empty"><i class="fas fa-bell-slash"></i><p>No notifications yet</p></div>';
    } else {
      itemsHTML = notifications.map(function(n) {
        var readClass = n.read ? 'notif-item-read' : '';
        var timeAgo = self._notifTimeAgo(n.createdAt);
        return '<div class="notif-item ' + readClass + '" data-notif-id="' + n.id + '"' + (n.link ? ' data-notif-link="' + n.link + '"' : '') + '>' +
          '<div class="notif-item-icon"><i class="fas ' + (n.icon || 'fa-bell') + '"></i></div>' +
          '<div class="notif-item-body">' +
            '<div class="notif-item-msg">' + n.message + '</div>' +
            '<div class="notif-item-time">' + timeAgo + '</div>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    var panel = document.createElement('div');
    panel.id = 'notifPanel';
    panel.className = 'notif-panel';
    panel.innerHTML = '<div class="notif-panel-header">' +
      '<span class="notif-panel-title">Notifications</span>' +
      '<div class="notif-panel-actions">' +
        '<button class="notif-mark-all" id="notifMarkAll">Mark all read</button>' +
        '<button class="notif-clear-all" id="notifClearAll">Clear</button>' +
      '</div>' +
    '</div>' +
    '<div class="notif-panel-list">' + itemsHTML + '</div>';

    var bellBtn = document.getElementById('navNotifBtn');
    bellBtn.parentElement.appendChild(panel);

    // Mark all read
    var markAllBtn = document.getElementById('notifMarkAll');
    if (markAllBtn) {
      markAllBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (typeof VisorUpNotifications !== 'undefined') {
          VisorUpNotifications.markAllRead();
          panel.querySelectorAll('.notif-item').forEach(function(el) { el.classList.add('notif-item-read'); });
        }
      });
    }

    // Clear all
    var clearBtn = document.getElementById('notifClearAll');
    if (clearBtn) {
      clearBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (typeof VisorUpNotifications !== 'undefined') {
          VisorUpNotifications.clear();
          panel.querySelector('.notif-panel-list').innerHTML = '<div class="notif-empty"><i class="fas fa-bell-slash"></i><p>No notifications yet</p></div>';
        }
      });
    }

    // Click on item — mark read and navigate
    panel.querySelectorAll('.notif-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var id = item.dataset.notifId;
        var link = item.dataset.notifLink;
        if (typeof VisorUpNotifications !== 'undefined') VisorUpNotifications.markRead(id);
        item.classList.add('notif-item-read');
        if (link) {
          panel.remove();
          self.navigate(link);
        }
      });
    });
  }

  _notifTimeAgo(dateStr) {
    var now = Date.now();
    var then = new Date(dateStr).getTime();
    var diff = now - then;
    var mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + 'm ago';
    var hours = Math.floor(mins / 60);
    if (hours < 24) return hours + 'h ago';
    var days = Math.floor(hours / 24);
    if (days < 7) return days + 'd ago';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  // ── Shared Trip Page ────────────────────────────────────────

  async renderSharedTrip(slug) {
    this.setTitle('Shared Trip');
    this.pageContent.innerHTML = '<section class="page-section"><div class="container"><p style="color:var(--text-muted)">Loading shared trip...</p></div></section>' + this.renderFooter();

    try {
      var trip = await VisorUpTrips.getByShareSlug(slug);
      if (!trip) { this.pageContent.innerHTML = this.render404(); return; }

      var stats = trip.route_stats || {};
      this.setTitle(trip.name + ' — Shared Trip');
      this.pageContent.innerHTML = '' +
      '<section class="page-hero" style="background-image:url(public/images/heroes/routes.jpg)">' +
        '<div class="hero-overlay"></div>' +
        '<div class="page-hero-content">' +
          '<span style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--accent);font-weight:700;display:block;margin-bottom:8px;">Shared Trip</span>' +
          '<h1 class="page-hero-title">' + trip.name + '</h1>' +
          '<p class="page-hero-sub">' + (stats.distance || '?') + ' miles · ' + (stats.waypoints || '?') + ' stops</p>' +
        '</div>' +
      '</section>' +
      '<section class="page-section">' +
        '<div class="container">' +
          (trip.description ? '<p class="detail-text" style="margin-bottom:24px;">' + trip.description + '</p>' : '') +
          '<div id="sharedTripMap" style="width:100%;height:500px;border-radius:12px;border:1px solid var(--border);"></div>' +
          '<div style="margin-top:16px;display:flex;gap:12px;">' +
            '<button class="hero-cta" id="sharedTripCopy" style="font-size:13px;"><i class="fas fa-pencil-ruler"></i> Open in Route Builder</button>' +
          '</div>' +
        '</div>' +
      '</section>' + this.renderFooter();

      var self = this;
      document.getElementById('sharedTripCopy').addEventListener('click', function() {
        sessionStorage.setItem('vu_shared_waypoints', JSON.stringify(trip.waypoints));
        self.navigate('/build-route');
      });
    } catch (err) {
      this.pageContent.innerHTML = this.render404();
    }
  }
}


// ── Initialise ──────────────────────────────────────────────────

const site = new VisorUpSite();
document.addEventListener('DOMContentLoaded', function() { site.init(); });
