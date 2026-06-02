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

    // Listen for hash changes
    window.addEventListener('hashchange', () => this.route(location.hash));

    // Initial route
    this.route(location.hash || '#/');
  }

  // ── Routing ──────────────────────────────────────────────────

  route(hash) {
    // Normalise
    // Close mobile menu on navigation
    var mobileMenu = document.getElementById('navMobileMenu');
    if (mobileMenu) mobileMenu.classList.remove('open');
    var menuIcon = document.querySelector('#navMenuBtn i');
    if (menuIcon) menuIcon.className = 'fas fa-bars';

    if (!hash || hash === '#' || hash === '#/') {
      this.showSiteView();
      this.pageContent.innerHTML = this.renderHome() + this.renderFooter();
      this.setActiveNav('home');
      this.setTitle('Motorcycle Adventures Across Britain');
      this.scrollToTop();
      return;
    }

    const path = hash.replace(/^#\/?/, '').replace(/\/$/, '');
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
          this.scrollToTop();
        }
        break;

      case 'planning':
        this.showSiteView();
        this.pageContent.innerHTML = this.renderPlanning() + this.renderFooter();
        this.setActiveNav('planning');
        this.setTitle('Trip Planning Tools');
        this.scrollToTop();
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
        this.pageContent.innerHTML = this.renderComingSoon('Community', 'Connect with fellow riders, share routes, plan group tours, and swap stories from the tarmac.', 'fa-users') + this.renderFooter();
        this.setActiveNav('community');
        this.setTitle('Community — Coming Soon');
        this.scrollToTop();
        break;

      case 'build-route':
        this.showSiteView();
        this.pageContent.innerHTML = '<div id="routeBuilderContainer" style="height:calc(100vh - 60px);width:100%;"></div>';
        this.setActiveNav('planning');
        this.setTitle('Build Your Own Route');
        if (typeof RouteBuilder !== 'undefined') {
          setTimeout(function() {
            var rb = new RouteBuilder('routeBuilderContainer');
            var stored = sessionStorage.getItem('tp_waypoints');
            if (stored) {
              sessionStorage.removeItem('tp_waypoints');
              try {
                var wps = JSON.parse(stored);
                if (Array.isArray(wps) && wps.length >= 2 && rb._addWaypoint) {
                  for (var wi = 0; wi < wps.length; wi++) {
                    rb._addWaypoint(wps[wi].lat, wps[wi].lng);
                  }
                  rb._buildRoute();
                }
              } catch (e) { /* ignore */ }
            }
          }, 50);
        }
        break;

      case 'plan-trip':
        this.showSiteView();
        this.pageContent.innerHTML = '<div id="tripPlannerContainer" style="height:calc(100vh - 60px);width:100%;"></div>';
        this.setActiveNav('planning');
        this.setTitle('AI Trip Planner');
        if (typeof AITripPlanner !== 'undefined') {
          setTimeout(function() { new AITripPlanner('tripPlannerContainer'); }, 50);
        }
        break;

      case 'about':
        this.showSiteView();
        this.pageContent.innerHTML = this.renderAbout() + this.renderFooter();
        this.setTitle('About VisorUp');
        this.scrollToTop();
        break;

      case 'contact':
        this.showSiteView();
        this.pageContent.innerHTML = this.renderContact() + this.renderFooter();
        this.setTitle('Contact Us');
        this.scrollToTop();
        break;

      case 'privacy':
        this.showSiteView();
        this.pageContent.innerHTML = this.renderPrivacy() + this.renderFooter();
        this.setTitle('Privacy Policy');
        this.scrollToTop();
        break;

      case 'terms':
        this.showSiteView();
        this.pageContent.innerHTML = this.renderTerms() + this.renderFooter();
        this.setTitle('Terms of Service');
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
    location.hash = '#/' + path.replace(/^\//, '');
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
    var destCards = DESTINATIONS.slice(0, 6).map(function(d) {
      return '<a href="#/destinations/' + d.slug + '" class="dest-card">' +
        '<div class="dest-card-img" style="background-image:url(' + d.image + ')"></div>' +
        '<div class="dest-card-body">' +
          '<span class="dest-card-region">' + d.region + '</span>' +
          '<h3 class="dest-card-title">' + d.name + '</h3>' +
          '<p class="dest-card-tagline">' + d.tagline + '</p>' +
        '</div>' +
      '</a>';
    }).join('');

    var ferryCards = FERRIES.slice(0, 4).map(function(f) {
      return '<a href="#/ferries/' + f.slug + '" class="ferry-guide-card">' +
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
        '<a href="#/routes/island-to-highlands" class="hero-cta">Explore Our Flagship Route <i class="fas fa-arrow-right"></i></a>' +
        '<div class="hero-stats">' +
          '<div class="hero-stat"><span class="hero-stat-value">7</span><span class="hero-stat-label">Curated Routes</span></div>' +
          '<div class="hero-stat"><span class="hero-stat-value">4,000+</span><span class="hero-stat-label">Miles Mapped</span></div>' +
          '<div class="hero-stat"><span class="hero-stat-value">300+</span><span class="hero-stat-label">Points of Interest</span></div>' +
          '<div class="hero-stat"><span class="hero-stat-value">Free</span><span class="hero-stat-label">GPX Downloads</span></div>' +
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
            '<a href="#/routes/island-to-highlands" class="hero-cta" style="margin-top:20px">Plan This Route <i class="fas fa-arrow-right"></i></a>' +
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
          '<a href="#/destinations" class="btn-outline">View All Destinations <i class="fas fa-arrow-right"></i></a>' +
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
          '<a href="#/ferries" class="btn-outline">All Ferry Guides <i class="fas fa-arrow-right"></i></a>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<!-- PLANNING TOOLS -->' +
    '<section class="home-section home-section-alt">' +
      '<div class="container">' +
        '<span class="section-eyebrow"><i class="fas fa-tools"></i> Planning</span>' +
        '<h2 class="section-heading">Trip Planning Tools</h2>' +
        '<p class="section-desc">Packing lists, fuel strategy, weather guidance, and route planning tools to prepare you for the road.</p>' +
        '<div class="tools-grid">' +
          '<a href="#/planning" class="tool-card">' +
            '<div class="tool-card-icon"><i class="fas fa-suitcase"></i></div>' +
            '<h3>Packing Lists</h3>' +
            '<p>Everything you need to bring on a multi-day British motorcycle tour</p>' +
          '</a>' +
          '<a href="#/planning" class="tool-card">' +
            '<div class="tool-card-icon"><i class="fas fa-cloud-sun"></i></div>' +
            '<h3>Weather Guide</h3>' +
            '<p>Best times to ride each region and how to prepare for British weather</p>' +
          '</a>' +
          '<a href="#/planning" class="tool-card">' +
            '<div class="tool-card-icon"><i class="fas fa-route"></i></div>' +
            '<h3>Route Planning</h3>' +
            '<p>Interactive maps, GPX downloads, and day-by-day itineraries</p>' +
          '</a>' +
          '<a href="#/planning" class="tool-card">' +
            '<div class="tool-card-icon"><i class="fas fa-gas-pump"></i></div>' +
            '<h3>Fuel Calculator</h3>' +
            '<p>Know where to fill up — rural fuel stations mapped for every route</p>' +
          '</a>' +
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
      var href = r.isLive ? '#/routes/' + r.slug : '#/routes';
      var badge = r.hasPlanner
        ? '<span class="route-badge route-badge-planner"><i class="fas fa-play-circle"></i> Interactive Planner</span>'
        : r.isLive
          ? '<span class="route-badge route-badge-guide"><i class="fas fa-map-marked-alt"></i> Route Guide</span>'
          : '<span class="route-badge route-badge-soon"><i class="fas fa-clock"></i> Coming Soon</span>';

      return '<a href="' + href + '" class="route-card ' + liveClass + '">' +
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
      '</a>';
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
          '<a href="#/">Home</a> <i class="fas fa-chevron-right"></i> ' +
          '<a href="#/routes">Routes</a> <i class="fas fa-chevron-right"></i> ' +
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
                ? '<a href="#/routes/' + r.slug + '" class="btn-primary"><i class="fas fa-map-marked-alt"></i> Open Interactive Planner</a>'
                : '<a href="#/build-route" class="btn-primary" style="margin-right:12px;"><i class="fas fa-pencil-ruler"></i> Build Your Own Route</a>' +
                  '<a href="#/routes" class="btn-outline"><i class="fas fa-arrow-left"></i> Back to All Routes</a>') +
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
      return '<a href="#/destinations/' + d.slug + '" class="dest-card" data-region="' + d.region + '">' +
        '<div class="dest-card-img" style="background-image:url(' + d.image + ')"></div>' +
        '<div class="dest-card-body">' +
          '<span class="dest-card-region">' + d.region + '</span>' +
          '<h3 class="dest-card-title">' + d.name + '</h3>' +
          '<p class="dest-card-tagline">' + d.tagline + '</p>' +
        '</div>' +
      '</a>';
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
        '<nav class="breadcrumb"><a href="#/">Home</a> <i class="fas fa-chevron-right"></i> <a href="#/destinations">Destinations</a> <i class="fas fa-chevron-right"></i> <span>' + d.name + '</span></nav>' +

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

        '<div class="detail-cta">' +
          '<a href="#/build-route?dest=' + d.slug + '" class="hero-cta"><i class="fas fa-pencil-ruler"></i> Plan a Route to ' + d.name + ' <i class="fas fa-arrow-right"></i></a>' +
        '</div>' +
      '</div>' +
    '</section>';
  }

  renderFerries() {
    var cards = FERRIES.map(function(f) {
      var routesList = f.routes.map(function(r) { return '<li><i class="fas fa-anchor"></i> ' + r + '</li>'; }).join('');

      return '<a href="#/ferries/' + f.slug + '" class="ferry-full-card">' +
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
        '<nav class="breadcrumb"><a href="#/">Home</a> <i class="fas fa-chevron-right"></i> <a href="#/ferries">Ferries</a> <i class="fas fa-chevron-right"></i> <span>' + f.name + '</span></nav>' +

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

        '<div class="tips-callout" style="margin-bottom:40px;border-left:4px solid var(--accent);cursor:pointer;" onclick="location.hash=\'#/plan-trip\'">' +
          '<div class="tips-callout-icon" style="font-size:28px;"><i class="fas fa-wand-magic-sparkles"></i></div>' +
          '<div class="tips-callout-body">' +
            '<h4 style="font-size:18px;margin-bottom:4px;">AI Trip Planner</h4>' +
            '<p>Tell us where you\'re starting, how many days you\'ve got, and what you want to see — we\'ll build the perfect route for you. Includes overnight stops, OSRM routing, and GPX export.</p>' +
            '<span style="color:var(--accent);font-weight:600;font-size:13px;margin-top:8px;display:inline-block;">Plan My Trip <i class="fas fa-arrow-right"></i></span>' +
          '</div>' +
        '</div>' +

        '<div class="tools-grid" style="margin-bottom:48px">' +
          '<a href="#/plan-trip" class="tool-card" style="text-decoration:none;color:inherit;">' +
            '<div class="tool-card-icon" style="color:var(--accent)"><i class="fas fa-wand-magic-sparkles"></i></div>' +
            '<h3>Trip Planner</h3>' +
            '<p>Tell us your start, duration and interests — we build the route for you</p>' +
          '</a>' +
          '<a href="#/build-route" class="tool-card" style="text-decoration:none;color:inherit;">' +
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
        '<a href="#/" class="btn-outline" style="margin-top:24px"><i class="fas fa-arrow-left"></i> Back to Home</a>' +
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
        '<a href="#/" class="hero-cta"><i class="fas fa-home"></i> Back to Home</a>' +
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
            '<p class="detail-text">We\'re always adding new routes, new POIs, and new features. If you\'ve got a suggestion, a correction, or a road we absolutely must ride, <a href="#/contact" style="color:var(--accent)">get in touch</a>.</p>' +
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
        '<p>The Platform contains links to third-party websites (campsites, ferry operators, gear shops, etc.). Some of these are affiliate links — see our <a href="#/privacy" style="color:var(--accent)">Privacy Policy</a> for details.</p>' +
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
            '<a href="#/routes">Routes</a>' +
            '<a href="#/destinations">Destinations</a>' +
            '<a href="#/ferries">Ferries</a>' +
            '<a href="#/planning">Trip Planning</a>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Destinations</h4>' +
            '<a href="#/destinations/isle-of-skye">Isle of Skye</a>' +
            '<a href="#/destinations/nc500">NC500</a>' +
            '<a href="#/destinations/glencoe">Glencoe</a>' +
            '<a href="#/destinations/lake-district">Lake District</a>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Company</h4>' +
            '<a href="#/about">About</a>' +
            '<a href="#/contact">Contact</a>' +
            '<a href="#/privacy">Privacy Policy</a>' +
            '<a href="#/terms">Terms of Service</a>' +
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
    document.querySelectorAll('.nav-links a[data-nav]').forEach(function(a) {
      a.classList.remove('active');
      if (a.dataset.nav === name) a.classList.add('active');
    });
    // Also set mobile nav links
    document.querySelectorAll('#navMobileMenu a').forEach(function(a) {
      a.classList.remove('active');
      var href = a.getAttribute('href') || '';
      if (name === 'home' && (href === '#/' || href === '#')) {
        a.classList.add('active');
      } else if (href.indexOf('#/' + name) === 0) {
        a.classList.add('active');
      }
    });
  }

  setTitle(page) {
    document.title = page ? page + ' | VisorUp' : 'VisorUp — Motorcycle Adventures Across Britain';
  }

  scrollToTop() {
    if (this.siteView) this.siteView.scrollTop = 0;
    window.scrollTo(0, 0);
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
        if (mobileMenu.classList.contains('open')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
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
}


// ── Initialise ──────────────────────────────────────────────────

const site = new VisorUpSite();
document.addEventListener('DOMContentLoaded', function() { site.init(); });
