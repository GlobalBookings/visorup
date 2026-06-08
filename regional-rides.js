/**
 * VisorUp Regional Riding Guides
 * Best motorcycle rides within 1-2 hours of major UK cities.
 * Each city has curated routes with distance, duration, difficulty, and highlights.
 */

const REGIONAL_RIDES = {
  london: {
    city: 'London',
    subtitle: 'Escape the M25 — epic roads within 90 minutes',
    rides: [
      { name: 'Box Hill & Surrey Hills Loop', distance: 65, duration: 2, difficulty: 'easy', highlights: 'Iconic biker meetup at Box Hill, sweeping Surrey lanes, Leith Hill views', startPoint: 'Cobham Services, M25 J10', keyRoads: 'A24, A25, B2126', description: 'The classic London biker run. Start at the Cobham end of the A3, wind through Dorking to Box Hill, then loop back via Leith Hill and the quiet Surrey lanes. Busy on sunny Sundays but always worth it.', bestFor: 'Sunday blast' },
      { name: 'South Downs Coastal Run', distance: 85, duration: 2.5, difficulty: 'easy', highlights: 'Rolling chalk downs, Devil\'s Dyke, Brighton seafront, Beachy Head', startPoint: 'M23 J11, Pease Pottage', keyRoads: 'A23, A27, A259, B2116', description: 'Head south through the Downs to Brighton, then east along the coast to Beachy Head. The A259 coastal stretch is glorious on a clear day with white cliffs and endless sea views.', bestFor: 'Scenic cruise' },
      { name: 'Kent Lanes & Garden of England', distance: 72, duration: 2.5, difficulty: 'easy', highlights: 'Brands Hatch approach, Kentish orchards, medieval villages, oast houses', startPoint: 'M25 J3, Swanley', keyRoads: 'A20, B2042, B2027, A228', description: 'Weave through the quiet lanes of the Kentish Weald past hop gardens and oast houses. Stop at Brands Hatch for a coffee with a view of the circuit, then explore Ightham and Penshurst.', bestFor: 'Relaxed afternoon ride' },
      { name: 'Chilterns Ridge Run', distance: 58, duration: 1.5, difficulty: 'moderate', highlights: 'Steep Chiltern escarpment, Red Kites overhead, The Lee, Great Missenden', startPoint: 'M40 J4, High Wycombe', keyRoads: 'A4010, B485, B4009', description: 'Tackle the steep climbs and plunging descents of the Chiltern Hills. Narrow lanes twist through beech woods with sudden views across the Vale of Aylesbury. Watch for Red Kites diving overhead.', bestFor: 'Twisty technical' },
      { name: 'New Forest Explorer', distance: 95, duration: 3, difficulty: 'easy', highlights: 'Wild ponies, ancient woodland, Beaulieu, Lymington harbour', startPoint: 'M3 J14, Winchester', keyRoads: 'A337, B3054, B3078', description: 'Cruise through the New Forest at 40mph speed limit, dodging wild ponies and cattle. The roads are smooth and scenic — perfect for a relaxed day out with stops at Beaulieu motor museum and Lymington for fish and chips.', bestFor: 'Scenic cruise' },
      { name: 'North Downs & Pilgrims Way', distance: 55, duration: 1.5, difficulty: 'easy', highlights: 'Ancient Pilgrims Way, Wye Crown viewpoint, Canterbury approach, chalk downs', startPoint: 'M20 J8, Maidstone', keyRoads: 'A252, B2068, Pilgrims Way', description: 'Follow the ancient Pilgrims Way along the chalk ridge of the North Downs. Smooth flowing roads with big views south over the Weald. Quiet midweek, with great café stops in Chilham and Wye.', bestFor: 'Relaxed afternoon ride' }
    ]
  },

  manchester: {
    city: 'Manchester',
    subtitle: 'Peak District classics and Pennine passes on your doorstep',
    rides: [
      { name: 'Cat & Fiddle (A537)', distance: 45, duration: 1.5, difficulty: 'challenging', highlights: 'England\'s most famous biking road, sweeping bends, moorland views, 1,690ft summit', startPoint: 'Macclesfield town centre', keyRoads: 'A537', description: 'The legendary Cat & Fiddle road between Macclesfield and Buxton. Sweeping bends climb through open moorland to the pub at 1,690ft. Respect this road — it demands skill and awareness. Best ridden midweek.', bestFor: 'Sunday blast' },
      { name: 'Snake Pass (A57)', distance: 52, duration: 1.5, difficulty: 'challenging', highlights: 'Dramatic Pennine crossing, Ladybower Reservoir, tight hairpins, wild moorland', startPoint: 'Glossop, A57', keyRoads: 'A57, A6013', description: 'Cross the Pennines via the infamous Snake Pass. Tight bends, steep gradients, and unpredictable weather make this a proper test of skill. Reward yourself with views over Ladybower Reservoir on the descent.', bestFor: 'Twisty technical' },
      { name: 'Peak District Southern Loop', distance: 68, duration: 2.5, difficulty: 'moderate', highlights: 'Bakewell, Chatsworth House, Monsal Dale, Tideswell, dry stone walls', startPoint: 'Chapel-en-le-Frith', keyRoads: 'A6, A619, B6001, B6049', description: 'A grand tour of the White Peak via Bakewell and Chatsworth. Rolling limestone dales with excellent road surfaces and plenty of café stops. Less intense than Snake Pass but hugely rewarding.', bestFor: 'Scenic cruise' },
      { name: 'Ribblehead & Yorkshire Dales', distance: 88, duration: 3, difficulty: 'moderate', highlights: 'Ribblehead Viaduct, Ingleborough views, Settle, sweeping moorland roads', startPoint: 'Skipton, A65', keyRoads: 'A65, B6255, B6479', description: 'Head north-west to the spectacular Ribblehead Viaduct, then loop through the western Dales. Big open moorland roads with dramatic geology — limestone pavements, potholes, and the Three Peaks looming above.', bestFor: 'Scenic cruise' },
      { name: 'Holme Moss & Woodhead', distance: 42, duration: 1.5, difficulty: 'challenging', highlights: 'Tour de France climb, wild moorland, reservoirs, technical descents', startPoint: 'Holmfirth', keyRoads: 'A6024, A628, B6105', description: 'Tackle the infamous Holme Moss climb used in the Tour de France, then cross the wild Woodhead Pass. Exposed moorland with fast sweepers and technical sections. Not for the faint-hearted in poor weather.', bestFor: 'Twisty technical' },
      { name: 'Goyt Valley & Axe Edge', distance: 38, duration: 1.5, difficulty: 'moderate', highlights: 'Errwood Reservoir, quiet valley road, Axe Edge summit, Flash village', startPoint: 'Whaley Bridge', keyRoads: 'Goyt Valley Road, A54, A53', description: 'A hidden gem close to Manchester. Drop into the peaceful Goyt Valley, then climb to Axe Edge — the highest point on the A53. The road from Flash to Buxton is superb flowing tarmac.', bestFor: 'Relaxed afternoon ride' },
      { name: 'Longdendale & Glossop Moors', distance: 35, duration: 1, difficulty: 'moderate', highlights: 'Chain of reservoirs, dramatic Pennine scenery, quiet moorland roads', startPoint: 'Tintwistle, A628', keyRoads: 'A628, B6105, minor roads', description: 'A quick escape into wild Pennine moorland. Follow the chain of reservoirs through Longdendale, then climb onto the moors above Glossop. Short but exhilarating with constantly changing views.', bestFor: 'Quick evening blast' }
    ]
  },

  birmingham: {
    city: 'Birmingham',
    subtitle: 'Welsh borders, rolling hills, and Cotswold honey-stone villages',
    rides: [
      { name: 'Long Mynd & Shropshire Hills', distance: 72, duration: 2.5, difficulty: 'moderate', highlights: 'Long Mynd summit road, Church Stretton valley, Stiperstones, wild ponies', startPoint: 'Church Stretton, A49', keyRoads: 'A49, Burway Road, minor lanes', description: 'The Long Mynd summit road (Burway) is one of England\'s steepest and most dramatic roads — 1-in-4 gradients with cattle grids and wild ponies. The surrounding Shropshire Hills offer quiet lanes with zero traffic.', bestFor: 'Twisty technical' },
      { name: 'Welsh Borders & Ludlow Loop', distance: 85, duration: 3, difficulty: 'moderate', highlights: 'Ludlow castle town, Clun Valley, Offa\'s Dyke, Mortimer Forest', startPoint: 'Ludlow, A49', keyRoads: 'A49, B4368, B4385, A488', description: 'Loop through the quiet Welsh Marches via Clun and Bishop\'s Castle. Some of England\'s emptiest roads wind through valleys barely changed since medieval times. Ludlow itself is a brilliant food stop.', bestFor: 'Scenic cruise' },
      { name: 'Cotswolds Golden Loop', distance: 78, duration: 2.5, difficulty: 'easy', highlights: 'Broadway Tower, Stow-on-the-Wold, Bourton, honey-stone villages, rolling wolds', startPoint: 'Evesham, A44', keyRoads: 'A44, B4077, A429, B4068', description: 'Cruise through the Cotswolds\' most photogenic villages — Broadway, Stow, and the Slaughters. Rolling wold roads with excellent surfaces and stunning views from Broadway Tower. Busy in summer but gorgeous.', bestFor: 'Scenic cruise' },
      { name: 'Elan Valley Reservoirs', distance: 110, duration: 3.5, difficulty: 'moderate', highlights: 'Spectacular dams, mountain road over Elan Valley, red kites, total isolation', startPoint: 'Rhayader, A470', keyRoads: 'B4518, mountain road, A470', description: 'Ride into the remote heart of mid-Wales via the spectacular Elan Valley dams. The mountain road over the top is single-track with passing places — utterly deserted and wildly beautiful. A proper adventure.', bestFor: 'All-day adventure' },
      { name: 'Malvern Hills & Ledbury', distance: 52, duration: 1.5, difficulty: 'easy', highlights: 'Malvern Hills ridgeline views, Ledbury black-and-white village, orchards', startPoint: 'Great Malvern, A449', keyRoads: 'A449, B4218, B4220, A438', description: 'Short but sweet — ride along the base of the Malvern Hills with panoramic views, then loop through Ledbury\'s medieval streets and Herefordshire orchards. Perfect for a sunny afternoon.', bestFor: 'Relaxed afternoon ride' },
      { name: 'Black Mountains & Gospel Pass', distance: 95, duration: 3, difficulty: 'challenging', highlights: 'Highest road in South Wales, Hay-on-Wye, Llanthony Priory, dramatic mountain pass', startPoint: 'Hay-on-Wye, B4350', keyRoads: 'Gospel Pass road, A465, B4423', description: 'The Gospel Pass is the highest road in South Wales — a single-track climb over the Black Mountains with vertiginous drops. Combine with Llanthony Priory and the book town of Hay-on-Wye for a memorable day.', bestFor: 'Twisty technical' },
      { name: 'Ironbridge & Severn Valley', distance: 48, duration: 1.5, difficulty: 'easy', highlights: 'Ironbridge Gorge, River Severn, Bridgnorth cliff railway, quiet lanes', startPoint: 'Ironbridge, B4373', keyRoads: 'B4373, B4555, A442', description: 'Follow the River Severn through its dramatic gorge at Ironbridge, then south to Bridgnorth. Easy flowing roads through wooded valleys — a gentle midweek ride with good café stops.', bestFor: 'Relaxed afternoon ride' }
    ]
  },

  'leeds-sheffield': {
    city: 'Leeds / Sheffield',
    subtitle: 'Yorkshire Dales and North York Moors — biking paradise',
    rides: [
      { name: 'Buttertubs Pass', distance: 55, duration: 2, difficulty: 'challenging', highlights: 'Tour de France stage, limestone sinkholes, 1-in-4 gradients, Swaledale views', startPoint: 'Hawes, A684', keyRoads: 'Buttertubs Pass road, B6270', description: 'Made famous by the Tour de France, Buttertubs is a brutal climb from Hawes to Thwaite with 1-in-4 gradients and the eerie limestone sinkholes (the "buttertubs") beside the road. Stunning and demanding.', bestFor: 'Twisty technical' },
      { name: 'Fleet Moss', distance: 48, duration: 1.5, difficulty: 'challenging', highlights: 'Yorkshire\'s highest road, remote moorland, Wharfedale descent, sheep on road', startPoint: 'Hawes, B6160', keyRoads: 'B6160, Fleet Moss road', description: 'Yorkshire\'s highest road climbs to nearly 2,000ft with gradients that\'ll test your clutch control. The descent into Wharfedale is magnificent — sweeping turns with huge views. Watch for sheep!', bestFor: 'Twisty technical' },
      { name: 'North York Moors Coastal Loop', distance: 92, duration: 3, difficulty: 'moderate', highlights: 'Whitby Abbey, Robin Hood\'s Bay, Blakey Ridge, moorland roads, fish & chips', startPoint: 'Pickering, A169', keyRoads: 'A169, A171, Blakey Ridge road', description: 'Cross the moors to Whitby, loop along the coast to Robin Hood\'s Bay, then return via the spectacular Blakey Ridge. Open moorland roads with sweeping views and the reward of Whitby fish and chips.', bestFor: 'All-day adventure' },
      { name: 'Swaledale & Tan Hill', distance: 65, duration: 2.5, difficulty: 'moderate', highlights: 'Britain\'s highest pub (Tan Hill Inn), remote Swaledale, stone barns, waterfalls', startPoint: 'Richmond, B6270', keyRoads: 'B6270, Tan Hill road, A685', description: 'Ride up beautiful Swaledale past Muker and Keld to Britain\'s highest pub at Tan Hill (1,732ft). The road is narrow and wild with switchbacks and cattle grids. A real sense of remoteness.', bestFor: 'Scenic cruise' },
      { name: 'Nidderdale & Pateley Bridge', distance: 55, duration: 2, difficulty: 'moderate', highlights: 'Brimham Rocks, How Stean Gorge, Pateley Bridge, Yorke Arms, quiet dales', startPoint: 'Harrogate, B6165', keyRoads: 'B6165, B6265, minor lanes', description: 'The "forgotten dale" — less visited than Wharfedale but equally beautiful. Winding roads through Nidderdale to Pateley Bridge, with a detour to the bizarre Brimham Rocks balanced on the moor above.', bestFor: 'Relaxed afternoon ride' },
      { name: 'Pennine Ridgeway (Snake to Holme Moss)', distance: 60, duration: 2, difficulty: 'challenging', highlights: 'Wild Pennine moorland, Snake Pass, Holme Moss, Tour de France climbs', startPoint: 'Sheffield, A57', keyRoads: 'A57, A6024, B6105', description: 'Link up the infamous Snake Pass with the brutal Holme Moss climb. Exposed high moorland riding at its best — dramatic, demanding, and deserted midweek. True Pennine grit required.', bestFor: 'Sunday blast' },
      { name: 'Wharfedale & Grassington', distance: 50, duration: 1.5, difficulty: 'easy', highlights: 'Bolton Abbey, Burnsall bridge, Grassington cobbles, River Wharfe, limestone scenery', startPoint: 'Ilkley, A65', keyRoads: 'B6160, B6265', description: 'A gentle cruise up Wharfedale via Bolton Abbey and Burnsall to the charming village of Grassington. Smooth flowing roads beside the river with limestone scenery and great tea rooms.', bestFor: 'Scenic cruise' }
    ]
  },

  bristol: {
    city: 'Bristol',
    subtitle: 'Cheddar Gorge, Exmoor, and the Black Mountains within reach',
    rides: [
      { name: 'Cheddar Gorge & Mendips', distance: 45, duration: 1.5, difficulty: 'moderate', highlights: 'Cheddar Gorge hairpins, Mendip plateau, Wookey Hole, dramatic limestone cliffs', startPoint: 'Cheddar village, B3135', keyRoads: 'B3135, B3134, A371', description: 'The Cheddar Gorge road is a proper thrill — tight hairpins climbing between 450ft limestone cliffs. Then cruise across the Mendip plateau on smooth, flowing roads with big views towards Glastonbury Tor.', bestFor: 'Twisty technical' },
      { name: 'Exmoor Coastal Run', distance: 95, duration: 3, difficulty: 'moderate', highlights: 'Porlock Hill (1-in-4), Lynmouth, Valley of Rocks, wild ponies, coastal views', startPoint: 'Minehead, A39', keyRoads: 'A39, A396, B3223', description: 'Tackle the infamous Porlock Hill with its 1-in-4 gradient, then ride along the dramatic Exmoor coast to Lynmouth. Wild, exposed, and exhilarating. The Valley of Rocks is a must-stop for photos.', bestFor: 'All-day adventure' },
      { name: 'Black Mountains via Abergavenny', distance: 105, duration: 3.5, difficulty: 'challenging', highlights: 'Gospel Pass summit, Llanthony Priory, Sugar Loaf mountain, Brecon Beacons edge', startPoint: 'Abergavenny, A465', keyRoads: 'Gospel Pass road, A465, B4521', description: 'Cross into Wales and climb the spectacular Gospel Pass — the highest road in South Wales. Single track with cattle grids and massive drops. Llanthony Priory ruins midway are hauntingly beautiful.', bestFor: 'Twisty technical' },
      { name: 'Wye Valley & Forest of Dean', distance: 68, duration: 2, difficulty: 'easy', highlights: 'Tintern Abbey, Wye Valley views, Forest of Dean, Symonds Yat viewpoint', startPoint: 'Chepstow, A466', keyRoads: 'A466, B4228, B4226', description: 'Follow the beautiful River Wye north from Chepstow past Tintern Abbey into the Forest of Dean. Easy flowing roads through ancient woodland with spectacular viewpoints at Symonds Yat.', bestFor: 'Scenic cruise' },
      { name: 'Quantock Hills Circuit', distance: 52, duration: 1.5, difficulty: 'moderate', highlights: 'England\'s first AONB, heather-covered combes, wild deer, quiet lanes', startPoint: 'Bridgwater, A39', keyRoads: 'A39, minor lanes, Quantock ridge roads', description: 'Explore the compact but beautiful Quantock Hills — England\'s first Area of Outstanding Natural Beauty. Narrow lanes wind through deep combes and across heather-covered ridges. Surprisingly quiet.', bestFor: 'Relaxed afternoon ride' },
      { name: 'Cotswolds Southern Edge', distance: 72, duration: 2, difficulty: 'easy', highlights: 'Castle Combe circuit village, Tetbury, Westonbirt Arboretum, golden stone villages', startPoint: 'Castle Combe, B4039', keyRoads: 'B4039, A433, B4014', description: 'Start at the picturesque Castle Combe (home to the racing circuit) and cruise through the southern Cotswolds. Honey-stone villages, rolling wolds, and smooth A-roads make this an easy, beautiful ride.', bestFor: 'Scenic cruise' }
    ]
  },

  edinburgh: {
    city: 'Edinburgh',
    subtitle: 'Borders, coast, and Highland edges — Scotland\'s riding heartland',
    rides: [
      { name: 'Borders Loop via Kelso', distance: 95, duration: 3, difficulty: 'moderate', highlights: 'Lauder moors, Kelso abbey town, Tweed Valley, sweeping A-roads, low traffic', startPoint: 'Edinburgh, A68', keyRoads: 'A68, A698, A7, B6374', description: 'Head south over the Lammermuirs to Lauder and Kelso, returning via the Tweed Valley. Classic Scottish Borders riding — fast sweeping A-roads through rolling farmland with barely any traffic.', bestFor: 'Sunday blast' },
      { name: 'East Lothian Coast', distance: 65, duration: 2, difficulty: 'easy', highlights: 'North Berwick Law, Bass Rock views, Dunbar coast, links golf courses, seafood', startPoint: 'Musselburgh, A199', keyRoads: 'A199, B1347, A1087', description: 'Cruise along the stunning East Lothian coast past golf links and sandy beaches to North Berwick and Dunbar. Easy riding with sea views, great seafood stops, and the iconic Bass Rock gannet colony offshore.', bestFor: 'Scenic cruise' },
      { name: 'Trossachs & Loch Katrine', distance: 88, duration: 2.5, difficulty: 'moderate', highlights: 'Duke\'s Pass, Loch Katrine, Aberfoyle, Highland boundary, stunning lochs', startPoint: 'Stirling, A84', keyRoads: 'A84, A821 (Duke\'s Pass), B829', description: 'Cross the Highland Boundary Fault into the Trossachs via the spectacular Duke\'s Pass (A821). Tight, technical bends climb through forest to stunning loch views. Rob Roy country at its finest.', bestFor: 'Twisty technical' },
      { name: 'Perthshire Big Tree Country', distance: 105, duration: 3, difficulty: 'moderate', highlights: 'Sma\' Glen, Crieff, Loch Earn, Kenmore, stunning Highland Perthshire', startPoint: 'Perth, A85', keyRoads: 'A85, A822, A827, A826', description: 'Loop through Highland Perthshire via the Sma\' Glen and Loch Earn. Big sweeping roads through proper mountain scenery with lochs, forests, and the stunning Tay valley. Excellent road surfaces.', bestFor: 'All-day adventure' },
      { name: 'Lammermuir Hills', distance: 55, duration: 1.5, difficulty: 'moderate', highlights: 'Wild moorland, remote single-track, Whiteadder Reservoir, minimal traffic', startPoint: 'Gifford, B6355', keyRoads: 'B6355, B6456, minor roads', description: 'Escape onto the Lammermuir Hills — wild moorland with barely a soul around. The single-track roads crossing from north to south are exhilarating: blind crests, sheep, and massive views. Raw riding.', bestFor: 'Quick evening blast' },
      { name: 'Fife Coastal Trail', distance: 75, duration: 2.5, difficulty: 'easy', highlights: 'St Andrews, Anstruther fish bar, East Neuk villages, Forth bridges views', startPoint: 'Forth Road Bridge, A921', keyRoads: 'A921, A917, A91', description: 'Cross the Forth to Fife and follow the coast through the charming East Neuk fishing villages to St Andrews. Easy riding, stunning coastal scenery, and the famous Anstruther Fish Bar for lunch.', bestFor: 'Scenic cruise' }
    ]
  },

  glasgow: {
    city: 'Glasgow',
    subtitle: 'Loch Lomond, Argyll, and the West Highland roads',
    rides: [
      { name: 'Loch Lomond & The Trossachs', distance: 75, duration: 2.5, difficulty: 'moderate', highlights: 'Bonnie banks, Luss village, Tarbet, stunning loch views, Highland edge', startPoint: 'Balloch, A82', keyRoads: 'A82, A83, A815', description: 'Follow the famous A82 along Loch Lomond\'s western shore. Stunning water views, the pretty village of Luss, and the dramatic narrows at Tarbet. The gateway to the Highlands from Glasgow.', bestFor: 'Scenic cruise' },
      { name: 'Rest and Be Thankful (A83)', distance: 85, duration: 2.5, difficulty: 'challenging', highlights: 'Iconic Highland pass, Arrochar Alps, Glen Croe, dramatic mountain scenery', startPoint: 'Tarbet, A83', keyRoads: 'A83, A815, A814', description: 'The legendary Rest and Be Thankful pass climbs through Glen Croe with the Arrochar Alps towering above. Tight bends, steep gradients, and raw Highland drama. One of Scotland\'s most iconic motorcycle roads.', bestFor: 'Sunday blast' },
      { name: 'Trossachs via Aberfoyle', distance: 70, duration: 2, difficulty: 'moderate', highlights: 'Duke\'s Pass, Lake of Menteith, Queen Elizabeth Forest, stunning viewpoints', startPoint: 'Aberfoyle, A821', keyRoads: 'A821, A81, B829', description: 'The Duke\'s Pass from Aberfoyle is one of Scotland\'s best biking roads — tight technical bends climbing through forest with sudden loch views. Combine with the quiet B829 along Loch Ard.', bestFor: 'Twisty technical' },
      { name: 'Ayrshire Coast & Burns Country', distance: 82, duration: 2.5, difficulty: 'easy', highlights: 'Ailsa Craig views, Culzean Castle, Burns Cottage, coastal sweepers', startPoint: 'Ayr, A77', keyRoads: 'A77, A719, B7024', description: 'Cruise south along the Ayrshire coast with views of Ailsa Craig and Arran. Visit Culzean Castle perched on the cliffs, then loop inland through Burns\' country. Easy flowing coast roads.', bestFor: 'Scenic cruise' },
      { name: 'Campsie Fells & Fintry', distance: 45, duration: 1.5, difficulty: 'moderate', highlights: 'Crow Road (B822), Campsie Glen, Fintry Hills, Carron Valley, tight bends', startPoint: 'Lennoxtown, B822', keyRoads: 'B822 (Crow Road), B818, A811', description: 'The Crow Road (B822) over the Campsie Fells is Glasgow\'s local favourite — tight technical bends climbing from Lennoxtown with Glasgow views behind. Short but sweet, perfect after work.', bestFor: 'Quick evening blast' },
      { name: 'Arran Island Circuit', distance: 56, duration: 3, difficulty: 'easy', highlights: 'Ferry crossing, Scotland in miniature, Goatfell views, coastal road, quiet', startPoint: 'Ardrossan ferry terminal', keyRoads: 'A841 (coastal circuit), B880 (String Road)', description: 'Take the ferry to Arran — "Scotland in miniature". The coastal A841 circles the island with mountains, beaches, and castles. The String Road crosses the interior with Highland-like scenery. Magic.', bestFor: 'All-day adventure' }
    ]
  },

  newcastle: {
    city: 'Newcastle',
    subtitle: 'Northumberland coast, Kielder wilds, and Pennine passes',
    rides: [
      { name: 'Northumberland Coastal Run', distance: 80, duration: 2.5, difficulty: 'easy', highlights: 'Bamburgh Castle, Holy Island causeway, Dunstanburgh, empty golden beaches', startPoint: 'Alnwick, A1', keyRoads: 'A1, B1340, B1339, A1 coastal', description: 'Ride north along England\'s most spectacular coastline. Bamburgh Castle dominates the skyline, Holy Island appears across the causeway, and golden beaches stretch endlessly. Barely any traffic outside summer.', bestFor: 'Scenic cruise' },
      { name: 'Kielder Forest & Border Ridge', distance: 95, duration: 3, difficulty: 'moderate', highlights: 'Kielder Water, darkest skies in England, Redesdale, Scottish border, total isolation', startPoint: 'Bellingham, B6320', keyRoads: 'B6320, C200, forest roads', description: 'Venture into Kielder — England\'s most remote area. Dense forest, the vast reservoir, and roads where you won\'t see another vehicle for miles. The border ridge road is exhilarating and wild.', bestFor: 'All-day adventure' },
      { name: 'Hartside Pass (A686)', distance: 65, duration: 2, difficulty: 'challenging', highlights: 'Famous Pennine climb to 1,904ft, Alston (highest market town), Eden Valley views', startPoint: 'Alston, A686', keyRoads: 'A686, A689', description: 'The A686 over Hartside is a motorcycling classic — climbing to 1,904ft with sweeping bends and massive views over the Eden Valley. Alston, England\'s highest market town, is the perfect start/end point.', bestFor: 'Sunday blast' },
      { name: 'Pennines via Killhope', distance: 72, duration: 2.5, difficulty: 'moderate', highlights: 'Weardale, Killhope lead mine, high moorland, reservoirs, quiet valleys', startPoint: 'Stanhope, A689', keyRoads: 'A689, B6295, A686', description: 'Cross the high Pennines via Weardale and Killhope — England\'s highest lead mine. Remote moorland roads with sweeping views, dramatic weather, and barely any other vehicles. True North Pennine riding.', bestFor: 'Twisty technical' },
      { name: 'Hadrian\'s Wall Route', distance: 58, duration: 2, difficulty: 'easy', highlights: 'Roman wall, Housesteads Fort, Sycamore Gap, dramatic crags, 2000-year history', startPoint: 'Hexham, B6318', keyRoads: 'B6318 (Military Road), B6321', description: 'Follow the B6318 Military Road along Hadrian\'s Wall. The road rolls over dramatic whinstone crags with the Roman wall visible alongside. Stop at Housesteads Fort and the famous Sycamore Gap.', bestFor: 'Scenic cruise' },
      { name: 'Cheviot Foothills', distance: 68, duration: 2, difficulty: 'moderate', highlights: 'Cheviot Hills, College Valley, Wooler, wild border country, raptors overhead', startPoint: 'Wooler, A697', keyRoads: 'A697, B6351, minor roads', description: 'Explore the rolling foothills of the Cheviots — wild border country with empty roads and massive skies. The minor roads around College Valley are amongst the quietest in England. Bring waterproofs.', bestFor: 'Relaxed afternoon ride' }
    ]
  },

  cardiff: {
    city: 'Cardiff',
    subtitle: 'Brecon Beacons, Black Mountain, and the wild Welsh interior',
    rides: [
      { name: 'Black Mountain Road (A4069)', distance: 55, duration: 2, difficulty: 'challenging', highlights: 'Wales\' most famous biking road, sweeping high-altitude bends, Carmarthen Fans views', startPoint: 'Llandovery, A4069', keyRoads: 'A4069', description: 'The A4069 Black Mountain road is Wales\' answer to the Stelvio — sweeping high-altitude bends with sheer drops and panoramic mountain views. Smooth tarmac, minimal traffic, and pure motorcycling joy.', bestFor: 'Sunday blast' },
      { name: 'Brecon Beacons Loop', distance: 78, duration: 2.5, difficulty: 'moderate', highlights: 'Pen y Fan views, Storey Arms, waterfall country, Brecon town, reservoirs', startPoint: 'Merthyr Tydfil, A470', keyRoads: 'A470, A4059, A4067', description: 'Circuit the Brecon Beacons via the A470 past Pen y Fan and through waterfall country. Mountain roads with big views, good surfaces, and plenty of café stops. The heart of South Wales riding.', bestFor: 'Scenic cruise' },
      { name: 'Elan Valley & Devil\'s Staircase', distance: 105, duration: 3.5, difficulty: 'moderate', highlights: 'Victorian dams, mountain road, total isolation, Red Kites, Devil\'s Staircase descent', startPoint: 'Rhayader, B4518', keyRoads: 'B4518, mountain road, A44', description: 'Ride into the remote Elan Valley with its spectacular chain of Victorian dams. The mountain road over the top is single-track with hairpins — wild, isolated, and breathtaking. Red Kites wheel overhead.', bestFor: 'All-day adventure' },
      { name: 'Cambrian Mountains (Desert of Wales)', distance: 120, duration: 4, difficulty: 'challenging', highlights: 'Britain\'s emptiest roads, Cwmystwyth ghost mines, Devil\'s Bridge, mountain passes', startPoint: 'Tregaron, B4343', keyRoads: 'B4343, mountain road to Cwmystwyth, A4120', description: 'Cross the "Desert of Wales" — the Cambrian Mountains are Britain\'s emptiest landscape. Ghost mine workings, single-track mountain passes, and roads where you genuinely won\'t see another soul. Fuel up first.', bestFor: 'All-day adventure' },
      { name: 'Vale of Glamorgan & Gower', distance: 72, duration: 2, difficulty: 'easy', highlights: 'Gower Peninsula, Rhossili Bay, coastal cliffs, Nash Point lighthouse', startPoint: 'Cowbridge, A48', keyRoads: 'A48, A4118, B4247', description: 'Escape to the Gower — Britain\'s first AONB with stunning beaches and coastal cliffs. The ride out through the Vale of Glamorgan is gentle and pretty, then Gower rewards with Rhossili Bay\'s epic views.', bestFor: 'Scenic cruise' },
      { name: 'Heads of the Valleys & Pontsticill', distance: 48, duration: 1.5, difficulty: 'moderate', highlights: 'Pontsticill Reservoir, mountain road, Taf Fechan forest, Brecon Beacons edge', startPoint: 'Merthyr Tydfil, A465', keyRoads: 'A465, A470, minor mountain roads', description: 'Quick escape to the Beacons edge — climb from Merthyr to Pontsticill Reservoir then onto the mountain roads above. Short, punchy riding with excellent views and minimal traffic.', bestFor: 'Quick evening blast' }
    ]
  },

  inverness: {
    city: 'Inverness',
    subtitle: 'NC500 gateways, Cairngorms, and Scotland\'s wildest roads',
    rides: [
      { name: 'Applecross & Bealach na Bà', distance: 90, duration: 3, difficulty: 'challenging', highlights: 'Scotland\'s most dramatic road, Alpine-style switchbacks, 2,054ft summit, sea views', startPoint: 'Lochcarron, A896', keyRoads: 'Bealach na Bà road, A896', description: 'The Bealach na Bà is Scotland\'s most dramatic road — Alpine switchbacks climbing to 2,054ft with sheer drops and views to Skye. The descent to Applecross village is heart-stopping. Not for the nervous.', bestFor: 'Twisty technical' },
      { name: 'NC500 East Coast Section', distance: 110, duration: 3.5, difficulty: 'moderate', highlights: 'Dunrobin Castle, Brora, Helmsdale harbour, gold rush country, coastal stacks', startPoint: 'Dornoch, A9', keyRoads: 'A9, A897, A99', description: 'Ride the east coast section of the NC500 from Dornoch to Dunbeath. Fishing villages, dramatic coastal scenery, Dunrobin Castle, and the gold rush heritage of the Strath of Kildonan. Classic touring.', bestFor: 'Scenic cruise' },
      { name: 'Cairngorms Loop', distance: 95, duration: 3, difficulty: 'moderate', highlights: 'Britain\'s highest road (Cairngorm ski road), Aviemore, Speyside whisky trail, ancient forest', startPoint: 'Aviemore, B970', keyRoads: 'B970, A95, A939, Cairngorm road', description: 'Explore the Cairngorms National Park via Britain\'s highest public road to the ski centre. Loop through ancient Caledonian pine forest and Speyside whisky country. Mountain grandeur at every turn.', bestFor: 'Scenic cruise' },
      { name: 'Glen Affric & Cannich', distance: 65, duration: 2, difficulty: 'moderate', highlights: 'Scotland\'s most beautiful glen, native pine forest, wild rivers, remote single-track', startPoint: 'Drumnadrochit, A831', keyRoads: 'A831, Glen Affric road', description: 'Glen Affric is often called Scotland\'s most beautiful glen — and the ride in on the single-track road confirms it. Ancient Caledonian pines, turquoise lochs, and not a soul around. Pure Highland magic.', bestFor: 'Relaxed afternoon ride' },
      { name: 'Black Isle & Cromarty', distance: 55, duration: 1.5, difficulty: 'easy', highlights: 'Dolphins at Chanonry Point, Cromarty fishing village, fertile farmland, Moray Firth views', startPoint: 'Inverness, A9/Kessock Bridge', keyRoads: 'A9, B9169, A832', description: 'Nip over the Kessock Bridge to the Black Isle — surprisingly gentle rolling farmland with dolphins at Chanonry Point and the charming village of Cromarty. Short, easy, and perfect for an evening spin.', bestFor: 'Quick evening blast' },
      { name: 'Loch Ness & Fort Augustus', distance: 70, duration: 2, difficulty: 'easy', highlights: 'Loch Ness, Urquhart Castle, Caledonian Canal locks, Great Glen views', startPoint: 'Inverness, A82', keyRoads: 'A82, B862 (south side)', description: 'Ride the full length of Loch Ness on the quieter south side (B862) for proper Highland atmosphere, then return on the A82 past Urquhart Castle. The B862 is a hidden gem — single track with loch views.', bestFor: 'Scenic cruise' },
      { name: 'NC500 North Coast Taster', distance: 130, duration: 4, difficulty: 'challenging', highlights: 'Tongue, Durness, Smoo Cave, Kyle of Tongue causeway, raw north coast wilderness', startPoint: 'Lairg, A838', keyRoads: 'A838, A836', description: 'Sample the wildest stretch of the NC500 — the north coast from Tongue to Durness. Single-track roads, wild Atlantic views, deserted beaches, and a genuine feeling of the edge of the world. Epic.', bestFor: 'All-day adventure' }
    ]
  }
};

// ── Regional Rides Controller ───────────────────────────────

const regionalRides = {
  selectedCity: 'london',

  init() {
    this.selectedCity = 'london';
  },

  selectCity(slug) {
    this.selectedCity = slug;
    var container = document.getElementById('regional-rides');
    if (container) {
      container.innerHTML = this.render();
      this._bindEvents();
    }
  },

  getCityData(slug) {
    return REGIONAL_RIDES[slug] || null;
  },

  getAllCities() {
    return Object.keys(REGIONAL_RIDES).map(function(slug) {
      return { slug: slug, city: REGIONAL_RIDES[slug].city };
    });
  },

  _getDifficultyBadge(difficulty) {
    var colours = {
      easy: '#6BCB77',
      moderate: '#FFB347',
      challenging: '#FF6B6B'
    };
    var colour = colours[difficulty] || colours.moderate;
    return '<span style="display:inline-block;padding:2px 10px;border-radius:20px;font-size:0.75rem;font-weight:600;background:' + colour + '22;color:' + colour + ';border:1px solid ' + colour + '44;text-transform:capitalize;">' + difficulty + '</span>';
  },

  _renderCityTabs() {
    var self = this;
    var cities = this.getAllCities();
    var html = '<div class="rr-city-tabs" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;">';
    cities.forEach(function(c) {
      var active = c.slug === self.selectedCity;
      html += '<button class="rr-city-tab" data-city="' + c.slug + '" style="' +
        'padding:8px 16px;border-radius:var(--radius, 8px);border:1px solid ' + (active ? 'var(--accent, #4D96FF)' : 'var(--border, #ddd)') + ';' +
        'background:' + (active ? 'var(--accent, #4D96FF)' : 'var(--bg-card, #fff)') + ';' +
        'color:' + (active ? '#fff' : 'var(--text, #333)') + ';' +
        'font-weight:' + (active ? '600' : '400') + ';font-size:0.9rem;cursor:pointer;transition:all 0.2s;">' +
        c.city + '</button>';
    });
    html += '</div>';
    return html;
  },

  _renderRideCards(rides) {
    var html = '<div class="rr-rides-grid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(340px, 1fr));gap:16px;">';
    rides.forEach(function(ride) {
      html += '<div class="rr-ride-card" style="background:var(--bg-card, #fff);border:1px solid var(--border, #e0e0e0);border-radius:var(--radius, 8px);padding:20px;transition:box-shadow 0.2s,transform 0.2s;">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">' +
          '<h3 style="margin:0;font-size:1.1rem;color:var(--text, #222);flex:1;">' + ride.name + '</h3>' +
          regionalRides._getDifficultyBadge(ride.difficulty) +
        '</div>' +
        '<p style="margin:0 0 12px;font-size:0.9rem;color:var(--text, #555);line-height:1.5;">' + ride.description + '</p>' +
        '<div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:12px;font-size:0.85rem;color:var(--text, #666);">' +
          '<span><i class="fas fa-road" style="margin-right:4px;color:var(--accent, #4D96FF);"></i>' + ride.distance + ' miles</span>' +
          '<span><i class="fas fa-clock" style="margin-right:4px;color:var(--accent, #4D96FF);"></i>' + ride.duration + ' hrs</span>' +
          '<span><i class="fas fa-map-pin" style="margin-right:4px;color:var(--accent, #4D96FF);"></i>' + ride.startPoint + '</span>' +
        '</div>' +
        '<div style="margin-bottom:12px;font-size:0.85rem;">' +
          '<span style="font-weight:600;color:var(--text, #333);">Key roads:</span> <span style="color:var(--text, #555);">' + ride.keyRoads + '</span>' +
        '</div>' +
        '<div style="margin-bottom:12px;font-size:0.85rem;">' +
          '<span style="font-weight:600;color:var(--text, #333);">Highlights:</span> <span style="color:var(--text, #555);">' + ride.highlights + '</span>' +
        '</div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding-top:12px;border-top:1px solid var(--border, #eee);">' +
          '<span style="font-size:0.8rem;padding:4px 10px;background:var(--accent, #4D96FF)11;color:var(--accent, #4D96FF);border-radius:20px;font-weight:500;">' + ride.bestFor + '</span>' +
          '<a href="/build-route?name=' + encodeURIComponent(ride.name) + '&start=' + encodeURIComponent(ride.startPoint) + '" style="font-size:0.85rem;color:var(--accent, #4D96FF);text-decoration:none;font-weight:600;">' +
            'Plan This Route <i class="fas fa-arrow-right" style="margin-left:4px;font-size:0.75rem;"></i></a>' +
        '</div>' +
      '</div>';
    });
    html += '</div>';
    return html;
  },

  render() {
    var cityData = this.getCityData(this.selectedCity);
    if (!cityData) {
      this.selectedCity = 'london';
      cityData = this.getCityData('london');
    }

    var html = '';

    // Hero section
    html += '<div class="rr-hero" style="text-align:center;padding:40px 20px 30px;margin-bottom:24px;">' +
      '<span style="display:inline-block;padding:4px 14px;border-radius:20px;font-size:0.75rem;font-weight:600;background:var(--accent, #4D96FF)15;color:var(--accent, #4D96FF);border:1px solid var(--accent, #4D96FF)33;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px;">Regional Guides</span>' +
      '<h1 style="margin:0 0 8px;font-size:2rem;color:var(--text, #222);">Best Rides Near You</h1>' +
      '<p style="margin:0;font-size:1.1rem;color:var(--text, #666);">Find your next ride — epic roads within 1-2 hours of major UK cities</p>' +
    '</div>';

    // City tabs
    html += this._renderCityTabs();

    // City header
    html += '<div style="margin-bottom:20px;">' +
      '<h2 style="margin:0 0 4px;font-size:1.4rem;color:var(--text, #222);"><i class="fas fa-map-marker-alt" style="color:var(--accent, #4D96FF);margin-right:8px;"></i>' + cityData.city + '</h2>' +
      '<p style="margin:0;font-size:0.95rem;color:var(--text, #666);">' + cityData.subtitle + '</p>' +
    '</div>';

    // Ride cards
    html += this._renderRideCards(cityData.rides);

    return html;
  },

  _bindEvents() {
    var self = this;
    var tabs = document.querySelectorAll('.rr-city-tab');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        self.selectCity(this.getAttribute('data-city'));
      });
    });

    // Hover effects for cards
    var cards = document.querySelectorAll('.rr-ride-card');
    cards.forEach(function(card) {
      card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
        this.style.transform = 'translateY(-2px)';
      });
      card.addEventListener('mouseleave', function() {
        this.style.boxShadow = 'none';
        this.style.transform = 'none';
      });
    });
  }
};

// ── Public render function ──────────────────────────────────

function renderRegionalRides() {
  regionalRides.init();
  var html = '<div id="regional-rides" class="regional-rides" style="max-width:1100px;margin:0 auto;padding:20px;">';
  html += regionalRides.render();
  html += '</div>';

  // Attach events after render (setTimeout allows DOM insertion first)
  setTimeout(function() {
    regionalRides._bindEvents();
  }, 0);

  return html;
}
