/**
 * VisorUp Road Ratings
 * Curated database of the best motorcycle roads in the UK, rated and categorised.
 * Interactive filtering by region, rating, difficulty, and sorting.
 */

const UK_BIKER_ROADS = [
  {
    name: 'A82 Glencoe',
    region: 'Scotland',
    rating: 5,
    distance: '28 miles',
    type: 'A-road',
    scenery: 5,
    bends: 4,
    surface: 4,
    traffic: 3,
    description: 'One of Britain\'s most dramatic road corridors, threading through the volcanic peaks of Glencoe. The sweeping bends and jaw-dropping mountain scenery make this an absolute must-ride. Best experienced early morning before tourist traffic builds.',
    startPoint: 'Tyndrum',
    endPoint: 'Fort William',
    difficulty: 'moderate',
    bestSeason: 'May–September',
    nearbyStops: ['Green Welly Stop', 'Clachaig Inn', 'Glencoe Visitor Centre']
  },
  {
    name: 'Cat & Fiddle (A537)',
    region: 'Peak District',
    rating: 5,
    distance: '7 miles',
    type: 'A-road',
    scenery: 4,
    bends: 5,
    surface: 4,
    traffic: 3,
    description: 'England\'s most famous biking road, climbing from Macclesfield to Buxton across exposed moorland. A relentless series of bends that demands respect — average speed cameras now monitor the route. Still thrilling at legal speeds.',
    startPoint: 'Macclesfield',
    endPoint: 'Buxton',
    difficulty: 'challenging',
    bestSeason: 'April–October',
    nearbyStops: ['Cat & Fiddle pub (closed but landmark)', 'Buxton town', 'Goyt Valley']
  },
  {
    name: 'Snake Pass (A57)',
    region: 'Peak District',
    rating: 5,
    distance: '14 miles',
    type: 'A-road',
    scenery: 4,
    bends: 5,
    surface: 3,
    traffic: 3,
    description: 'The legendary Snake Pass connecting Sheffield to Manchester over the Pennines. Tight, technical bends through wild moorland with stunning views of Ladybower Reservoir. Surface can be treacherous in wet weather.',
    startPoint: 'Ladybower Reservoir',
    endPoint: 'Glossop',
    difficulty: 'challenging',
    bestSeason: 'April–October',
    nearbyStops: ['Snake Pass Inn', 'Ladybower Dam', 'Derwent Dam']
  },
  {
    name: 'Bealach na Bà',
    region: 'Scotland',
    rating: 5,
    distance: '6 miles',
    type: 'pass',
    scenery: 5,
    bends: 5,
    surface: 3,
    traffic: 5,
    description: 'Britain\'s most extreme road — an Alpine-style mountain pass reaching 2,053ft with hairpin bends and 20% gradients. The views from the summit across to Skye are worth every white-knuckle moment. Not for the faint-hearted.',
    startPoint: 'Kishorn',
    endPoint: 'Applecross',
    difficulty: 'challenging',
    bestSeason: 'May–September',
    nearbyStops: ['Applecross Inn', 'Applecross Walled Garden', 'Lochcarron']
  },
  {
    name: 'Hardknott Pass',
    region: 'Lake District',
    rating: 5,
    distance: '3 miles',
    type: 'pass',
    scenery: 5,
    bends: 5,
    surface: 2,
    traffic: 4,
    description: 'England\'s steepest road with gradients of 33% and savage hairpin bends. A genuine white-knuckle experience that demands first gear and nerves of steel. The Roman fort at the summit adds historical drama to an already unforgettable ride.',
    startPoint: 'Eskdale',
    endPoint: 'Cockley Beck',
    difficulty: 'challenging',
    bestSeason: 'June–September',
    nearbyStops: ['Hardknott Roman Fort', 'Woolpack Inn Eskdale', 'Boot village']
  },
  {
    name: 'Wrynose Pass',
    region: 'Lake District',
    rating: 4,
    distance: '4 miles',
    type: 'pass',
    scenery: 5,
    bends: 4,
    surface: 3,
    traffic: 4,
    description: 'Hardknott\'s slightly tamer neighbour, but still one of England\'s toughest roads. Steep gradients and tight hairpins through stunning Lakeland scenery. Often ridden as a pair with Hardknott for the ultimate challenge.',
    startPoint: 'Little Langdale',
    endPoint: 'Cockley Beck',
    difficulty: 'challenging',
    bestSeason: 'June–September',
    nearbyStops: ['Three Shires Inn', 'Little Langdale Tarn', 'Cockley Beck Farm']
  },
  {
    name: 'A4069 Black Mountain',
    region: 'Wales',
    rating: 5,
    distance: '12 miles',
    type: 'A-road',
    scenery: 5,
    bends: 5,
    surface: 4,
    traffic: 4,
    description: 'Wales\' answer to an Alpine pass, climbing over the Black Mountain with sweeping bends and vast open views. Featured on Top Gear multiple times. The descent into the Towy Valley is particularly spectacular.',
    startPoint: 'Brynamman',
    endPoint: 'Llangadog',
    difficulty: 'moderate',
    bestSeason: 'April–October',
    nearbyStops: ['Llyn y Fan Fach', 'Carreg Cennen Castle', 'Black Mountain visitor area']
  },
  {
    name: 'Devil\'s Staircase (A896)',
    region: 'Scotland',
    rating: 4,
    distance: '10 miles',
    type: 'A-road',
    scenery: 5,
    bends: 4,
    surface: 3,
    traffic: 5,
    description: 'A dramatic single-track road winding through the Torridon mountains with breathtaking Highland scenery. The tight switchbacks demand concentration while the views demand you stop. Remote and magical.',
    startPoint: 'Kinlochewe',
    endPoint: 'Torridon',
    difficulty: 'moderate',
    bestSeason: 'May–September',
    nearbyStops: ['Torridon Inn', 'Beinn Eighe Visitor Centre', 'Kinlochewe Hotel']
  },
  {
    name: 'A838 Durness',
    region: 'Scotland',
    rating: 5,
    distance: '45 miles',
    type: 'A-road',
    scenery: 5,
    bends: 3,
    surface: 3,
    traffic: 5,
    description: 'The far north-west of mainland Scotland — remote, wild, and utterly beautiful. Part of the NC500, this stretch passes pristine beaches, dramatic cliffs, and empty moorland. You\'ll feel like the last person on earth.',
    startPoint: 'Durness',
    endPoint: 'Laxford Bridge',
    difficulty: 'moderate',
    bestSeason: 'May–September',
    nearbyStops: ['Smoo Cave', 'Cocoa Mountain', 'Balnakeil Beach']
  },
  {
    name: 'A87 to Skye',
    region: 'Scotland',
    rating: 5,
    distance: '35 miles',
    type: 'A-road',
    scenery: 5,
    bends: 3,
    surface: 4,
    traffic: 3,
    description: 'The classic approach to the Isle of Skye, passing the iconic Eilean Donan Castle and skirting Loch Duich. The mountains of Kintail frame every bend. Crossing the Skye Bridge at the end is the cherry on top.',
    startPoint: 'Invergarry',
    endPoint: 'Skye Bridge',
    difficulty: 'easy',
    bestSeason: 'May–September',
    nearbyStops: ['Eilean Donan Castle', 'Shiel Bridge', 'Dornie village']
  },
  {
    name: 'Buttertubs Pass',
    region: 'Yorkshire',
    rating: 5,
    distance: '6 miles',
    type: 'pass',
    scenery: 5,
    bends: 4,
    surface: 3,
    traffic: 4,
    description: 'A spectacular climb between Hawes and Thwaite in the Yorkshire Dales, with dramatic limestone sinkholes (the "buttertubs") beside the road. Featured in the Tour de France 2014. Exposed and exhilarating.',
    startPoint: 'Hawes',
    endPoint: 'Thwaite',
    difficulty: 'moderate',
    bestSeason: 'April–October',
    nearbyStops: ['Wensleydale Creamery', 'Muker village', 'Hawes market town']
  },
  {
    name: 'Fleet Moss',
    region: 'Yorkshire',
    rating: 4,
    distance: '5 miles',
    type: 'pass',
    scenery: 4,
    bends: 3,
    surface: 3,
    traffic: 5,
    description: 'Yorkshire\'s highest road at 1,934ft, climbing steeply from Hawes with gradients up to 25%. Bleak and beautiful moorland with far-reaching views across the Dales. Often forgotten but hugely rewarding.',
    startPoint: 'Hawes',
    endPoint: 'Buckden',
    difficulty: 'challenging',
    bestSeason: 'May–October',
    nearbyStops: ['Hawes Creamery', 'Gayle village', 'Buckden Pike']
  },
  {
    name: 'A470 through Snowdonia',
    region: 'Wales',
    rating: 5,
    distance: '32 miles',
    type: 'A-road',
    scenery: 5,
    bends: 4,
    surface: 4,
    traffic: 3,
    description: 'Wales\' spine road cutting through the heart of Snowdonia National Park. From the Crimea Pass above Blaenau Ffestiniog to the Dolgellau valley, every mile delivers mountain drama. A true touring classic.',
    startPoint: 'Betws-y-Coed',
    endPoint: 'Dolgellau',
    difficulty: 'moderate',
    bestSeason: 'April–October',
    nearbyStops: ['Swallow Falls', 'Blaenau Ffestiniog', 'Coed-y-Brenin forest']
  },
  {
    name: 'Horseshoe Pass (A542)',
    region: 'Wales',
    rating: 4,
    distance: '5 miles',
    type: 'A-road',
    scenery: 4,
    bends: 4,
    surface: 4,
    traffic: 3,
    description: 'A classic sweeping Welsh pass above Llangollen with perfectly cambered bends and panoramic views. Popular with bikers year-round thanks to good surface and manageable difficulty. The Ponderosa Café at the top is a legendary biker meet.',
    startPoint: 'Llangollen',
    endPoint: 'Ruthin',
    difficulty: 'easy',
    bestSeason: 'Year-round',
    nearbyStops: ['Ponderosa Café', 'Valle Crucis Abbey', 'Llangollen town']
  },
  {
    name: 'B3212 Dartmoor',
    region: 'South West',
    rating: 4,
    distance: '18 miles',
    type: 'B-road',
    scenery: 4,
    bends: 3,
    surface: 3,
    traffic: 3,
    description: 'A hauntingly beautiful cross-moor route between Exeter and Yelverton. Wild ponies graze beside the road as you pass granite tors and ancient landscapes. Atmospheric in mist but watch for livestock.',
    startPoint: 'Moretonhampstead',
    endPoint: 'Yelverton',
    difficulty: 'moderate',
    bestSeason: 'April–October',
    nearbyStops: ['Postbridge Clapper Bridge', 'Two Bridges', 'Princetown']
  },
  {
    name: 'A39 Atlantic Highway',
    region: 'South West',
    rating: 4,
    distance: '52 miles',
    type: 'A-road',
    scenery: 4,
    bends: 3,
    surface: 4,
    traffic: 3,
    description: 'The stunning north Devon and Cornwall coastal road linking Barnstaple to Bude and beyond. Ocean views, rolling hills, and access to some of Britain\'s finest surfing beaches. A perfect relaxed touring road.',
    startPoint: 'Barnstaple',
    endPoint: 'Bude',
    difficulty: 'easy',
    bestSeason: 'April–October',
    nearbyStops: ['Clovelly village', 'Hartland Point', 'Bude sea pool']
  },
  {
    name: 'A30 Bodmin Moor',
    region: 'South West',
    rating: 3,
    distance: '15 miles',
    type: 'A-road',
    scenery: 3,
    bends: 2,
    surface: 4,
    traffic: 2,
    description: 'A fast, flowing dual carriageway crossing Bodmin Moor with atmospheric views of tors and open moorland. Not technical, but atmospheric and a useful connector between Devon and deeper Cornwall. Best in winter mist.',
    startPoint: 'Launceston',
    endPoint: 'Bodmin',
    difficulty: 'easy',
    bestSeason: 'Year-round',
    nearbyStops: ['Jamaica Inn', 'Rough Tor', 'Colliford Lake']
  },
  {
    name: 'Military Road (Isle of Wight)',
    region: 'South East',
    rating: 4,
    distance: '8 miles',
    type: 'A-road',
    scenery: 4,
    bends: 3,
    surface: 4,
    traffic: 4,
    description: 'A uniquely atmospheric coastal road along the Isle of Wight\'s south-west coast, built for Victorian military access. Dramatic cliff views, fast sweepers, and crumbling coastal sections add to the adventure. Take the ferry for a cracking day out.',
    startPoint: 'Freshwater Bay',
    endPoint: 'Chale',
    difficulty: 'easy',
    bestSeason: 'Year-round',
    nearbyStops: ['The Needles', 'Freshwater Bay café', 'Compton Beach']
  },
  {
    name: 'A683 Kirkby Stephen to Sedbergh',
    region: 'Yorkshire',
    rating: 4,
    distance: '13 miles',
    type: 'A-road',
    scenery: 4,
    bends: 4,
    surface: 4,
    traffic: 4,
    description: 'A cracking undulating road through the Howgill Fells, linking the Eden Valley to Sedbergh. Fast sweeping bends with excellent visibility and quiet traffic. Often overlooked but a hidden gem for touring riders.',
    startPoint: 'Kirkby Stephen',
    endPoint: 'Sedbergh',
    difficulty: 'moderate',
    bestSeason: 'April–October',
    nearbyStops: ['Kirkby Stephen town', 'Howgill Fells walks', 'Sedbergh booktown']
  },
  {
    name: 'A686 Hartside',
    region: 'North East',
    rating: 5,
    distance: '12 miles',
    type: 'A-road',
    scenery: 5,
    bends: 4,
    surface: 4,
    traffic: 4,
    description: 'England\'s highest A-road, climbing to 1,904ft at Hartside Summit. A magnificent sweeping ascent from the Eden Valley with panoramic views across to the Lake District and Scotland. The café at the top is a biker institution.',
    startPoint: 'Langwathby',
    endPoint: 'Alston',
    difficulty: 'moderate',
    bestSeason: 'April–October',
    nearbyStops: ['Hartside Café', 'Alston town', 'South Tynedale Railway']
  },
  {
    name: 'A689 Weardale',
    region: 'North East',
    rating: 4,
    distance: '22 miles',
    type: 'A-road',
    scenery: 4,
    bends: 3,
    surface: 4,
    traffic: 4,
    description: 'A beautiful valley road following the River Wear through the North Pennines AONB. Rolling, flowing bends with pretty stone villages and wide moorland views. Excellent surface and reliably quiet traffic.',
    startPoint: 'Stanhope',
    endPoint: 'Nenthead',
    difficulty: 'easy',
    bestSeason: 'Year-round',
    nearbyStops: ['Killhope Lead Mining Museum', 'Stanhope town', 'Weardale Railway']
  },
  {
    name: 'B6270 Tan Hill',
    region: 'Yorkshire',
    rating: 4,
    distance: '16 miles',
    type: 'B-road',
    scenery: 4,
    bends: 3,
    surface: 3,
    traffic: 5,
    description: 'A remote moorland road climbing to the Tan Hill Inn — Britain\'s highest pub at 1,732ft. Bleak, exposed, and wonderfully empty. The pub alone is worth the ride; pair with Buttertubs for an epic loop.',
    startPoint: 'Reeth',
    endPoint: 'Brough',
    difficulty: 'moderate',
    bestSeason: 'May–October',
    nearbyStops: ['Tan Hill Inn', 'Reeth village green', 'Arkengarthdale']
  },
  {
    name: 'A93 Glenshee',
    region: 'Scotland',
    rating: 4,
    distance: '20 miles',
    type: 'A-road',
    scenery: 5,
    bends: 3,
    surface: 4,
    traffic: 4,
    description: 'Scotland\'s highest public road, climbing to the Cairnwell Pass at 2,199ft. A magnificent high-altitude ride through the Cairngorms with ski centre and vast mountain panoramas. Can be snowbound until May.',
    startPoint: 'Blairgowrie',
    endPoint: 'Braemar',
    difficulty: 'moderate',
    bestSeason: 'May–October',
    nearbyStops: ['Glenshee Ski Centre', 'Spittal of Glenshee', 'Braemar Castle']
  },
  {
    name: 'A85 Glen Ogle',
    region: 'Scotland',
    rating: 4,
    distance: '8 miles',
    type: 'A-road',
    scenery: 4,
    bends: 3,
    surface: 4,
    traffic: 3,
    description: 'Known as Scotland\'s Khyber Pass, this dramatic climb through a steep-sided glen north of Lochearnhead is truly impressive. Fast and flowing with excellent surface and epic mountain walls either side.',
    startPoint: 'Lochearnhead',
    endPoint: 'Killin',
    difficulty: 'easy',
    bestSeason: 'April–October',
    nearbyStops: ['Falls of Dochart Killin', 'Lochearnhead Watersports', 'Glen Ogle viaduct trail']
  },
  {
    name: 'A708 Grey Mare\'s Tail',
    region: 'Scotland',
    rating: 4,
    distance: '22 miles',
    type: 'A-road',
    scenery: 5,
    bends: 3,
    surface: 4,
    traffic: 5,
    description: 'A gloriously remote road through the Scottish Borders, passing the spectacular Grey Mare\'s Tail waterfall and St Mary\'s Loch. Peaceful, flowing, and achingly beautiful. One of Scotland\'s best-kept secrets.',
    startPoint: 'Moffat',
    endPoint: 'Selkirk',
    difficulty: 'easy',
    bestSeason: 'April–October',
    nearbyStops: ['Grey Mare\'s Tail waterfall', 'St Mary\'s Loch', 'Tibbie Shiels Inn']
  },
  {
    name: 'A5 Snowdonia (Ogwen Valley)',
    region: 'Wales',
    rating: 4,
    distance: '10 miles',
    type: 'A-road',
    scenery: 5,
    bends: 3,
    surface: 4,
    traffic: 3,
    description: 'Thomas Telford\'s masterpiece threading between the Carneddau and Glyderau mountain ranges. The road follows the valley floor with sheer rock faces towering above. Lake Ogwen and Tryfan make jaw-dropping backdrops.',
    startPoint: 'Bethesda',
    endPoint: 'Capel Curig',
    difficulty: 'easy',
    bestSeason: 'Year-round',
    nearbyStops: ['Ogwen Cottage', 'Tryfan viewpoint', 'Capel Curig village']
  },
  {
    name: 'B4391 Bala to Llangynog',
    region: 'Wales',
    rating: 4,
    distance: '14 miles',
    type: 'B-road',
    scenery: 4,
    bends: 4,
    surface: 3,
    traffic: 5,
    description: 'A hidden gem crossing the Berwyn Mountains between Bala and Llangynog. Remote, technical, and with views that stretch forever. The Milltir Cerrig pass section is genuinely wild and exhilarating.',
    startPoint: 'Bala',
    endPoint: 'Llangynog',
    difficulty: 'moderate',
    bestSeason: 'May–October',
    nearbyStops: ['Bala Lake', 'Pistyll Rhaeadr waterfall', 'Llangynog village']
  },
  {
    name: 'A4086 Llanberis Pass',
    region: 'Wales',
    rating: 5,
    distance: '6 miles',
    type: 'A-road',
    scenery: 5,
    bends: 4,
    surface: 4,
    traffic: 3,
    description: 'Snowdonia\'s most dramatic mountain pass, squeezed between the flanks of Snowdon and the Glyders. Tight, steep, and absolutely spectacular. Climbers cling to the rock faces above as you navigate the narrow road.',
    startPoint: 'Llanberis',
    endPoint: 'Pen-y-Pass',
    difficulty: 'moderate',
    bestSeason: 'April–October',
    nearbyStops: ['Pete\'s Eats Llanberis', 'Pen-y-Pass car park', 'Electric Mountain']
  },
  {
    name: 'A44 Elan Valley',
    region: 'Wales',
    rating: 4,
    distance: '18 miles',
    type: 'A-road',
    scenery: 4,
    bends: 3,
    surface: 4,
    traffic: 5,
    description: 'The road to the spectacular Elan Valley reservoirs — Wales\' Lake District. Flowing bends through open moorland with detours to the chain of dams. Quiet, beautiful, and perfect for relaxed touring.',
    startPoint: 'Rhayader',
    endPoint: 'Devil\'s Bridge',
    difficulty: 'easy',
    bestSeason: 'Year-round',
    nearbyStops: ['Elan Valley Visitor Centre', 'Craig Goch Dam', 'Rhayader town']
  },
  {
    name: 'B3135 Cheddar Gorge',
    region: 'South West',
    rating: 4,
    distance: '3 miles',
    type: 'B-road',
    scenery: 4,
    bends: 5,
    surface: 4,
    traffic: 2,
    description: 'England\'s mini-canyon — towering limestone cliffs rising 450ft either side of a sinuous road. Short but intense, with tight bends that demand attention. Can be busy with tourists but worth it for the spectacle.',
    startPoint: 'Cheddar village',
    endPoint: 'Gorge summit',
    difficulty: 'moderate',
    bestSeason: 'Year-round',
    nearbyStops: ['Cheddar Caves', 'Jacob\'s Ladder', 'Gorge-side cafés']
  },
  {
    name: 'A39 Porlock Hill',
    region: 'South West',
    rating: 4,
    distance: '4 miles',
    type: 'A-road',
    scenery: 4,
    bends: 4,
    surface: 3,
    traffic: 3,
    description: 'A fearsome 25% gradient climb from Porlock up onto Exmoor with hairpin bends and dramatic coastal views. The toll road alternative is gentler, but the main road is the proper challenge. Watch your brakes on the descent.',
    startPoint: 'Porlock',
    endPoint: 'Countisbury',
    difficulty: 'challenging',
    bestSeason: 'April–October',
    nearbyStops: ['Porlock village', 'Culbone Church', 'Exmoor National Park']
  },
  {
    name: 'A272 (Hampshire/Sussex)',
    region: 'South East',
    rating: 3,
    distance: '60 miles',
    type: 'A-road',
    scenery: 3,
    bends: 3,
    surface: 4,
    traffic: 3,
    description: 'A quintessentially English cross-country road through the South Downs, winding through pretty villages and rolling countryside. Not extreme, but deeply pleasurable touring with excellent country pubs en route.',
    startPoint: 'Winchester',
    endPoint: 'Haywards Heath',
    difficulty: 'easy',
    bestSeason: 'Year-round',
    nearbyStops: ['Petersfield town', 'South Downs Way crossings', 'Cowdray Park']
  },
  {
    name: 'B2116/A281 South Downs',
    region: 'South East',
    rating: 3,
    distance: '25 miles',
    type: 'B-road',
    scenery: 3,
    bends: 3,
    surface: 4,
    traffic: 3,
    description: 'A pleasant route threading through the Sussex Weald below the South Downs escarpment. Rolling countryside, quiet villages, and green lanes make this ideal for a relaxed Sunday ride from London.',
    startPoint: 'Henfield',
    endPoint: 'Horsham',
    difficulty: 'easy',
    bestSeason: 'Year-round',
    nearbyStops: ['Devil\'s Dyke viewpoint', 'Bramber Castle', 'Shipley windmill']
  },
  {
    name: 'B1149 North Norfolk',
    region: 'East Anglia',
    rating: 3,
    distance: '20 miles',
    type: 'B-road',
    scenery: 3,
    bends: 2,
    surface: 4,
    traffic: 4,
    description: 'Norfolk\'s best biking road — fast and flowing through the wooded Holt Ridge and out to the coast. No mountains, but an honest road with good surface and a cracking fish and chips at the end.',
    startPoint: 'Norwich',
    endPoint: 'Holt',
    difficulty: 'easy',
    bestSeason: 'Year-round',
    nearbyStops: ['Blickling Hall', 'Holt town', 'Sheringham seafront']
  },
  {
    name: 'A153 Lincolnshire Wolds',
    region: 'East Anglia',
    rating: 3,
    distance: '22 miles',
    type: 'A-road',
    scenery: 3,
    bends: 3,
    surface: 4,
    traffic: 5,
    description: 'Surprising hills in otherwise flat Lincolnshire — the Wolds offer rolling, deserted roads through England\'s least-visited AONB. No drama, but wonderfully empty and peaceful riding.',
    startPoint: 'Horncastle',
    endPoint: 'Louth',
    difficulty: 'easy',
    bestSeason: 'Year-round',
    nearbyStops: ['Louth market town', 'Cadwell Park circuit', 'Hubbard\'s Hills']
  },
  {
    name: 'A6 Matlock to Buxton',
    region: 'Peak District',
    rating: 4,
    distance: '16 miles',
    type: 'A-road',
    scenery: 4,
    bends: 4,
    surface: 4,
    traffic: 2,
    description: 'A classic Peak District corridor following the Derwent Valley through dramatic limestone dales. Good flowing bends, reliable surface, and easy access from the M1. The gorge section through Matlock Bath is iconic.',
    startPoint: 'Matlock',
    endPoint: 'Buxton',
    difficulty: 'easy',
    bestSeason: 'Year-round',
    nearbyStops: ['Matlock Bath', 'Heights of Abraham', 'Buxton Opera House']
  },
  {
    name: 'A53 Leek to Buxton',
    region: 'Peak District',
    rating: 4,
    distance: '12 miles',
    type: 'A-road',
    scenery: 4,
    bends: 4,
    surface: 4,
    traffic: 3,
    description: 'A fast, sweeping moorland road connecting two Peak District market towns. Open and exposed with excellent sight lines and flowing bends. Part of the classic Staffordshire Moorlands biking circuit.',
    startPoint: 'Leek',
    endPoint: 'Buxton',
    difficulty: 'moderate',
    bestSeason: 'April–October',
    nearbyStops: ['The Roaches', 'Tittesworth Reservoir', 'Flash village (England\'s highest)']
  },
  {
    name: 'A628 Woodhead Pass',
    region: 'Peak District',
    rating: 3,
    distance: '14 miles',
    type: 'A-road',
    scenery: 3,
    bends: 3,
    surface: 4,
    traffic: 2,
    description: 'A dramatic trans-Pennine crossing through wild moorland between Manchester and Sheffield. Fast and open with impressive reservoirs. Can be bleak and windswept — that\'s part of the charm.',
    startPoint: 'Holmfirth',
    endPoint: 'Tintwistle',
    difficulty: 'moderate',
    bestSeason: 'April–October',
    nearbyStops: ['Woodhead Reservoir', 'Holme Moss transmitter', 'Holmfirth (Last of the Summer Wine)']
  },
  {
    name: 'Kirkstone Pass (A592)',
    region: 'Lake District',
    rating: 4,
    distance: '5 miles',
    type: 'A-road',
    scenery: 5,
    bends: 4,
    surface: 4,
    traffic: 3,
    description: 'The Lake District\'s highest road pass, linking Windermere to Ullswater. Steep and dramatic with the Kirkstone Pass Inn at the summit — England\'s third-highest pub. Stunning views of Brothers Water on the descent.',
    startPoint: 'Ambleside',
    endPoint: 'Patterdale',
    difficulty: 'moderate',
    bestSeason: 'Year-round',
    nearbyStops: ['Kirkstone Pass Inn', 'Brothers Water', 'Aira Force waterfall']
  },
  {
    name: 'Honister Pass (B5289)',
    region: 'Lake District',
    rating: 4,
    distance: '4 miles',
    type: 'B-road',
    scenery: 5,
    bends: 4,
    surface: 3,
    traffic: 4,
    description: 'A steep, narrow pass climbing to the Honister Slate Mine with 25% gradients and tight bends. The approach from Borrowdale is exceptionally beautiful. Best combined with Newlands Pass for a circular ride.',
    startPoint: 'Seatoller (Borrowdale)',
    endPoint: 'Buttermere',
    difficulty: 'challenging',
    bestSeason: 'May–October',
    nearbyStops: ['Honister Slate Mine', 'Buttermere village', 'Borrowdale valley']
  },
  {
    name: 'A5012 Via Gellia',
    region: 'Midlands',
    rating: 3,
    distance: '5 miles',
    type: 'A-road',
    scenery: 3,
    bends: 4,
    surface: 3,
    traffic: 3,
    description: 'A hidden valley road between Cromford and Newhaven in Derbyshire, tree-lined and twisting. Named after a local lead-mining family, it offers surprisingly tight bends and a woodland atmosphere unusual for the Peak District.',
    startPoint: 'Cromford',
    endPoint: 'Newhaven',
    difficulty: 'moderate',
    bestSeason: 'Year-round',
    nearbyStops: ['Cromford Mill', 'Arkwright\'s Masson Mills', 'High Peak Trail']
  },
  {
    name: 'A44 Long Mynd',
    region: 'Midlands',
    rating: 4,
    distance: '10 miles',
    type: 'A-road',
    scenery: 4,
    bends: 3,
    surface: 4,
    traffic: 4,
    description: 'The Shropshire Hills at their finest — sweeping views over the Welsh borders from the ancient Long Mynd ridge. Flowing bends through Church Stretton and up onto open hilltops. Underrated and beautiful.',
    startPoint: 'Church Stretton',
    endPoint: 'Bishops Castle',
    difficulty: 'easy',
    bestSeason: 'Year-round',
    nearbyStops: ['Long Mynd gliding club', 'Church Stretton town', 'Stiperstones']
  },
  {
    name: 'Isle of Man Mountain Road',
    region: 'Isle of Man',
    rating: 5,
    distance: '12 miles',
    type: 'A-road',
    scenery: 4,
    bends: 5,
    surface: 4,
    traffic: 4,
    description: 'Part of the legendary TT course, with no speed limit during open road periods. The Snaefell Mountain section is exhilarating with fast sweepers and dramatic elevation changes. A pilgrimage for any serious biker.',
    startPoint: 'Ramsey',
    endPoint: 'Douglas (via Snaefell)',
    difficulty: 'challenging',
    bestSeason: 'May–September (TT period)',
    nearbyStops: ['Snaefell summit café', 'Creg-ny-Baa pub', 'TT Grandstand']
  },
  {
    name: 'A836 Tongue to Thurso',
    region: 'Scotland',
    rating: 4,
    distance: '40 miles',
    type: 'A-road',
    scenery: 4,
    bends: 2,
    surface: 3,
    traffic: 5,
    description: 'The wild north coast of Scotland — remote, empty, and endlessly atmospheric. Not about bends but about space, light, and the feeling of being at the edge of the world. Part of the NC500.',
    startPoint: 'Tongue',
    endPoint: 'Thurso',
    difficulty: 'easy',
    bestSeason: 'May–September',
    nearbyStops: ['Castle of Mey', 'Tongue village', 'Strathy Point lighthouse']
  },
  {
    name: 'A832 Dundonnell Road',
    region: 'Scotland',
    rating: 4,
    distance: '25 miles',
    type: 'A-road',
    scenery: 5,
    bends: 3,
    surface: 3,
    traffic: 5,
    description: 'A stunning Highland road through Wester Ross, passing the Corrieshalloch Gorge and Destitution Road with views of An Teallach. Remote, unspoilt, and with some of Scotland\'s most dramatic mountain scenery.',
    startPoint: 'Braemore Junction',
    endPoint: 'Dundonnell',
    difficulty: 'moderate',
    bestSeason: 'May–September',
    nearbyStops: ['Corrieshalloch Gorge', 'Dundonnell Hotel', 'An Teallach viewpoint']
  },
  {
    name: 'B3357 Dartmoor (Two Bridges)',
    region: 'South West',
    rating: 3,
    distance: '10 miles',
    type: 'B-road',
    scenery: 4,
    bends: 3,
    surface: 3,
    traffic: 4,
    description: 'The atmospheric cross-moor route linking Tavistock to Ashburton via Two Bridges. Wild ponies, granite tors, and open moorland create a landscape unlike anywhere else in England. Foggy days add mystery.',
    startPoint: 'Tavistock',
    endPoint: 'Two Bridges',
    difficulty: 'easy',
    bestSeason: 'Year-round',
    nearbyStops: ['Two Bridges Hotel', 'Wistman\'s Wood', 'Dartmoor Inn']
  },
  {
    name: 'A5 Betws-y-Coed to Bangor',
    region: 'Wales',
    rating: 4,
    distance: '18 miles',
    type: 'A-road',
    scenery: 4,
    bends: 3,
    surface: 5,
    traffic: 3,
    description: 'Telford\'s historic coaching road through the beautiful Ogwen Valley and over Nant Ffrancon pass. Excellent surface, well-engineered bends, and stunning mountain scenery on both sides. A road built for smooth progress.',
    startPoint: 'Betws-y-Coed',
    endPoint: 'Bangor',
    difficulty: 'easy',
    bestSeason: 'Year-round',
    nearbyStops: ['Swallow Falls', 'Ogwen Cottage', 'Penrhyn Castle']
  },
  {
    name: 'A595 Cumbrian Coast',
    region: 'Lake District',
    rating: 3,
    distance: '40 miles',
    type: 'A-road',
    scenery: 3,
    bends: 3,
    surface: 4,
    traffic: 4,
    description: 'An underrated coastal road skirting the western Lake District with views across to the Isle of Man. Not technical, but quiet and atmospheric with access to empty beaches. Perfect for a relaxed touring day.',
    startPoint: 'Barrow-in-Furness',
    endPoint: 'Whitehaven',
    difficulty: 'easy',
    bestSeason: 'Year-round',
    nearbyStops: ['Ravenglass & Eskdale Railway', 'St Bees Head', 'Muncaster Castle']
  }
];

const roadRatings = {
  filters: {
    region: 'all',
    minRating: 1,
    difficulty: 'all',
    sort: 'rating'
  },

  setFilter(key, value) {
    this.filters[key] = value;
    this.renderCards();
  },

  getFilteredRoads() {
    var self = this;
    var filtered = UK_BIKER_ROADS.filter(function(road) {
      if (self.filters.region !== 'all' && road.region !== self.filters.region) return false;
      if (road.rating < self.filters.minRating) return false;
      if (self.filters.difficulty !== 'all' && road.difficulty !== self.filters.difficulty) return false;
      return true;
    });

    // Sort
    filtered.sort(function(a, b) {
      switch (self.filters.sort) {
        case 'rating': return b.rating - a.rating;
        case 'distance': return parseFloat(b.distance) - parseFloat(a.distance);
        case 'scenery': return b.scenery - a.scenery;
        case 'bends': return b.bends - a.bends;
        default: return b.rating - a.rating;
      }
    });

    return filtered;
  },

  renderStars(rating) {
    var html = '';
    for (var i = 1; i <= 5; i++) {
      html += i <= rating
        ? '<i class="fas fa-star" style="color:var(--accent)"></i>'
        : '<i class="far fa-star" style="color:var(--border)"></i>';
    }
    return html;
  },

  renderStatBar(value, label, icon) {
    return '<div class="rr-stat">' +
      '<i class="fas ' + icon + '"></i>' +
      '<div class="rr-stat-bar"><div class="rr-stat-fill" style="width:' + (value * 20) + '%"></div></div>' +
      '<span class="rr-stat-label">' + label + '</span>' +
      '</div>';
  },

  renderCard(road) {
    var difficultyColors = { easy: '#27ae60', moderate: '#f39c12', challenging: '#e74c3c' };
    var difficultyColor = difficultyColors[road.difficulty] || 'var(--accent)';

    return '<div class="rr-card">' +
      '<div class="rr-card-header">' +
        '<div class="rr-card-title">' +
          '<h3>' + road.name + '</h3>' +
          '<span class="rr-region-badge">' + road.region + '</span>' +
        '</div>' +
        '<div class="rr-card-rating">' + this.renderStars(road.rating) + '</div>' +
      '</div>' +
      '<div class="rr-card-body">' +
        '<p class="rr-card-desc">' + road.description + '</p>' +
        '<div class="rr-card-stats">' +
          '<div class="rr-card-meta">' +
            '<span><i class="fas fa-road"></i> ' + road.distance + '</span>' +
            '<span><i class="fas fa-route"></i> ' + road.type + '</span>' +
            '<span style="color:' + difficultyColor + '"><i class="fas fa-gauge-high"></i> ' + road.difficulty + '</span>' +
            '<span><i class="fas fa-calendar"></i> ' + road.bestSeason + '</span>' +
          '</div>' +
          '<div class="rr-card-bars">' +
            this.renderStatBar(road.scenery, 'Scenery', 'fa-mountain-sun') +
            this.renderStatBar(road.bends, 'Bends', 'fa-bezier-curve') +
            this.renderStatBar(road.surface, 'Surface', 'fa-road') +
            this.renderStatBar(road.traffic, 'Quiet', 'fa-volume-xmark') +
          '</div>' +
        '</div>' +
        '<div class="rr-card-footer">' +
          '<span class="rr-card-route"><i class="fas fa-map-pin"></i> ' + road.startPoint + ' → ' + road.endPoint + '</span>' +
          '<span class="rr-card-stops"><i class="fas fa-mug-hot"></i> ' + road.nearbyStops.join(', ') + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  },

  renderCards() {
    var container = document.getElementById('rrCardsGrid');
    if (!container) return;

    var roads = this.getFilteredRoads();
    var html = '';

    if (roads.length === 0) {
      html = '<div class="rr-no-results"><i class="fas fa-road-circle-xmark"></i><p>No roads match your filters. Try adjusting your criteria.</p></div>';
    } else {
      var self = this;
      roads.forEach(function(road) {
        html += self.renderCard(road);
      });
    }

    container.innerHTML = html;

    // Update summary
    var totalMiles = roads.reduce(function(sum, r) { return sum + parseFloat(r.distance); }, 0);
    var regions = [];
    roads.forEach(function(r) { if (regions.indexOf(r.region) === -1) regions.push(r.region); });
    var summary = document.getElementById('rrSummary');
    if (summary) {
      summary.innerHTML = '<i class="fas fa-chart-simple"></i> <strong>' + roads.length + '</strong> roads rated, covering <strong>' + Math.round(totalMiles) + ' miles</strong> across <strong>' + regions.length + ' regions</strong>';
    }
  }
};

function renderRoadRatings() {
  var regions = [];
  UK_BIKER_ROADS.forEach(function(r) {
    if (regions.indexOf(r.region) === -1) regions.push(r.region);
  });
  regions.sort();

  var totalMiles = UK_BIKER_ROADS.reduce(function(sum, r) { return sum + parseFloat(r.distance); }, 0);

  return `
    <div class="road-ratings">
      <div class="content-hero" style="background:linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))">
        <div class="hero-content">
          <span class="hero-badge"><i class="fas fa-road"></i> Road Ratings</span>
          <h1>UK's Best Motorcycle Roads — Rated</h1>
          <p class="hero-subtitle">Our curated database of ${UK_BIKER_ROADS.length} outstanding motorcycle roads across Britain, rated for scenery, bends, surface quality, and traffic levels.</p>
        </div>
      </div>

      <div class="rr-container" style="max-width:1200px;margin:0 auto;padding:24px">
        <!-- Filter Bar -->
        <div class="rr-filter-bar">
          <div class="rr-filter-group">
            <label for="rrFilterRegion"><i class="fas fa-map-location-dot"></i> Region</label>
            <select id="rrFilterRegion" onchange="roadRatings.setFilter('region', this.value)">
              <option value="all">All Regions</option>
              ${regions.map(function(r) { return '<option value="' + r + '">' + r + '</option>'; }).join('')}
            </select>
          </div>

          <div class="rr-filter-group">
            <label for="rrFilterRating"><i class="fas fa-star"></i> Min Rating</label>
            <div class="rr-slider-group">
              <input type="range" id="rrFilterRating" min="1" max="5" value="1" oninput="roadRatings.setFilter('minRating', parseInt(this.value)); document.getElementById('rrRatingVal').textContent = this.value + '+'">
              <span id="rrRatingVal">1+</span>
            </div>
          </div>

          <div class="rr-filter-group">
            <label for="rrFilterDifficulty"><i class="fas fa-gauge-high"></i> Difficulty</label>
            <select id="rrFilterDifficulty" onchange="roadRatings.setFilter('difficulty', this.value)">
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
            </select>
          </div>

          <div class="rr-filter-group">
            <label for="rrFilterSort"><i class="fas fa-arrow-down-wide-short"></i> Sort By</label>
            <select id="rrFilterSort" onchange="roadRatings.setFilter('sort', this.value)">
              <option value="rating">Rating (highest)</option>
              <option value="distance">Distance (longest)</option>
              <option value="scenery">Scenery (best)</option>
              <option value="bends">Bends (most)</option>
            </select>
          </div>
        </div>

        <!-- Summary Stats -->
        <div class="rr-summary" id="rrSummary">
          <i class="fas fa-chart-simple"></i> <strong>${UK_BIKER_ROADS.length}</strong> roads rated, covering <strong>${Math.round(totalMiles)} miles</strong> across <strong>${regions.length} regions</strong>
        </div>

        <!-- Road Cards Grid -->
        <div class="rr-cards-grid" id="rrCardsGrid"></div>
      </div>
    </div>

    <style>
      .road-ratings { color: var(--text); }
      .rr-container { font-family: inherit; }

      .rr-filter-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        padding: 20px;
        background: var(--bg-card, #1a1a2e);
        border: 1px solid var(--border, #2a2a4a);
        border-radius: var(--radius, 12px);
        margin-bottom: 20px;
      }
      .rr-filter-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex: 1;
        min-width: 160px;
      }
      .rr-filter-group label {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--text-muted, #888);
      }
      .rr-filter-group select,
      .rr-filter-group input[type="range"] {
        padding: 8px 12px;
        background: var(--bg-primary, #0f0f1a);
        border: 1px solid var(--border, #2a2a4a);
        border-radius: 8px;
        color: var(--text, #eee);
        font-size: 14px;
        cursor: pointer;
      }
      .rr-filter-group select:focus {
        outline: none;
        border-color: var(--accent, #6c63ff);
      }
      .rr-slider-group {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .rr-slider-group input[type="range"] {
        flex: 1;
        accent-color: var(--accent, #6c63ff);
      }
      .rr-slider-group span {
        font-weight: 600;
        font-size: 14px;
        min-width: 24px;
      }

      .rr-summary {
        padding: 14px 20px;
        background: var(--bg-card, #1a1a2e);
        border: 1px solid var(--border, #2a2a4a);
        border-radius: var(--radius, 12px);
        margin-bottom: 20px;
        font-size: 15px;
        color: var(--text-muted, #aaa);
      }

      .rr-cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
        gap: 20px;
      }

      .rr-card {
        background: var(--bg-card, #1a1a2e);
        border: 1px solid var(--border, #2a2a4a);
        border-radius: var(--radius, 12px);
        overflow: hidden;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .rr-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      }
      .rr-card-header {
        padding: 16px 20px 12px;
        border-bottom: 1px solid var(--border, #2a2a4a);
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
      }
      .rr-card-title h3 {
        margin: 0 0 6px;
        font-size: 17px;
        color: var(--text, #fff);
      }
      .rr-region-badge {
        display: inline-block;
        padding: 2px 10px;
        background: var(--accent, #6c63ff);
        color: #fff;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
      .rr-card-rating {
        font-size: 14px;
        white-space: nowrap;
      }
      .rr-card-body {
        padding: 16px 20px;
      }
      .rr-card-desc {
        margin: 0 0 14px;
        font-size: 13.5px;
        line-height: 1.6;
        color: var(--text-muted, #bbb);
      }
      .rr-card-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 14px;
        font-size: 12.5px;
        color: var(--text-muted, #aaa);
      }
      .rr-card-meta span {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .rr-card-bars {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      .rr-stat {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: var(--text-muted, #999);
      }
      .rr-stat i {
        width: 14px;
        text-align: center;
        color: var(--accent, #6c63ff);
      }
      .rr-stat-bar {
        flex: 1;
        height: 6px;
        background: var(--bg-primary, #0f0f1a);
        border-radius: 3px;
        overflow: hidden;
      }
      .rr-stat-fill {
        height: 100%;
        background: var(--accent, #6c63ff);
        border-radius: 3px;
        transition: width 0.3s;
      }
      .rr-stat-label {
        min-width: 48px;
        font-size: 11px;
      }
      .rr-card-footer {
        padding-top: 12px;
        border-top: 1px solid var(--border, #2a2a4a);
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 12px;
        color: var(--text-muted, #888);
      }
      .rr-card-footer span {
        display: flex;
        align-items: flex-start;
        gap: 6px;
      }
      .rr-card-footer i {
        margin-top: 2px;
        color: var(--accent, #6c63ff);
      }

      .rr-no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        color: var(--text-muted, #888);
      }
      .rr-no-results i {
        font-size: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      @media (max-width: 768px) {
        .rr-filter-bar { flex-direction: column; }
        .rr-cards-grid { grid-template-columns: 1fr; }
        .rr-card-bars { grid-template-columns: 1fr; }
      }
    </style>

    <script>
      // Initial render of road cards
      (function() {
        setTimeout(function() { roadRatings.renderCards(); }, 0);
      })();
    </script>
  `;
}
