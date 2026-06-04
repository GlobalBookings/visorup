/* ═══════════════════════════════════════════════════════════════
   RouteBuilder — Build Your Own Motorcycle Route Planner
   Standalone custom route planner with POI layers, day splitting,
   geocoding, per-segment routing, drag-reorder, GPX import/export,
   route sharing, and localStorage persistence.
   ═══════════════════════════════════════════════════════════════ */

class RouteBuilder {

  // ── Static POI Data ──────────────────────────────────────────

  static CAMPSITES = [
    { name: 'Sango Sands Oasis', lat: 58.40, lng: -4.73, desc: 'Stunning clifftop campsite overlooking Sango Bay, Durness. Wild Atlantic views.' , url: 'https://www.sangosands.com' },
    { name: 'Applecross Campsite', lat: 57.43, lng: -5.80, desc: 'At the end of Bealach na Bà — rewarding after the best road in Scotland.' , url: 'https://www.applecross.uk.com/campsite' },
    { name: 'Camusdarach Campsite', lat: 56.92, lng: -5.84, desc: 'White-sand beach campsite near Arisaig. Rum and Eigg on the horizon.' , url: 'https://www.camusdarach.com' },
    { name: 'Shell Island', lat: 52.82, lng: -4.14, desc: 'Huge private peninsula campsite in Gwynedd. Ride across the tidal causeway.' , url: 'https://www.shellisland.co.uk' },
    { name: 'Wasdale Head NT Campsite', lat: 54.48, lng: -3.19, desc: 'At the foot of Scafell Pike in the Lake District. Epic mountain backdrop.' , url: 'https://www.nationaltrust.org.uk/wasdale' },
    { name: 'Hooks House Farm', lat: 54.41, lng: -0.45, desc: 'Clifftop camping near Robin Hood\'s Bay. Walk to the pub.' , url: 'https://www.hookshousefarm.co.uk' },
    { name: 'Ace Hideaway', lat: 57.86, lng: -5.03, desc: 'Biker-friendly campsite on the NC500 route near Achmelvich.' },
    { name: 'Comrie Croft', lat: 56.37, lng: -3.99, desc: 'Eco campsite in Perthshire. Great access to Highland Perthshire roads.' , url: 'https://www.comriecroft.com' },
    { name: 'Glen Nevis Caravan & Camping', lat: 56.80, lng: -5.07, desc: 'Under Ben Nevis, near Fort William. Gateway to the Great Glen.' , url: 'https://www.glen-nevis.co.uk' },
    { name: 'Cashel Campsite', lat: 56.13, lng: -4.58, desc: 'Forestry & Land Scotland site on Loch Lomond shore.' },
    { name: 'Red Squirrel Campsite', lat: 56.76, lng: -5.47, desc: 'Small woodland campsite near Glencoe. Peaceful setting.' , url: 'https://www.redsquirrelcampsite.com' },
    { name: 'Sligachan Campsite', lat: 57.29, lng: -6.17, desc: 'At the foot of the Black Cuillin on Skye. Iconic pub next door.' , url: 'https://www.sligachan.co.uk' },
    { name: 'Lazy Duck', lat: 57.16, lng: -3.73, desc: 'Tiny eco campsite near Aviemore in the Cairngorms.' , url: 'https://www.lazyduck.co.uk' },
    { name: 'Eweleaze Farm', lat: 50.65, lng: -2.33, desc: 'Clifftop farm campsite on the Jurassic Coast, Dorset.' },
    { name: 'Treen Farm', lat: 50.07, lng: -5.64, desc: 'Walk to Logan Rock and Porthcurno beach from the tent. Cornwall.' },
    { name: 'YHA Borrowdale', lat: 54.52, lng: -3.16, desc: 'Camping in Borrowdale valley, Lake District. Roads through Honister Pass.' },
    { name: 'Beinglas Farm', lat: 56.34, lng: -4.72, desc: 'Campsite at the head of Loch Lomond near Inverarnan.' },
    { name: 'Machrihanish Camping', lat: 55.43, lng: -5.74, desc: 'Wild Atlantic beach on the Kintyre peninsula.' },
    { name: 'Clachtoll Beach Campsite', lat: 58.19, lng: -5.34, desc: 'Coastal Assynt campsite with split rock beach. NC500 essential.' },
    { name: 'Trwyn yr Wylfa', lat: 53.34, lng: -4.63, desc: 'Remote headland campsite near Cemaes, Anglesey.' },
    { name: 'Britchcombe Farm', lat: 51.58, lng: -1.59, desc: 'Hillside campsite on the Ridgeway near Uffington White Horse.' },
    { name: 'Catgill Farm', lat: 54.07, lng: -2.02, desc: 'Small farm campsite in the Yorkshire Dales near Bolton Abbey.' },
    { name: 'Lickisto Blackhouse', lat: 57.87, lng: -6.78, desc: 'Wild camping on Harris with views to the Shiant Isles.' },
    { name: 'Rosedale Abbey', lat: 54.36, lng: -0.93, desc: 'Campsite in the North York Moors surrounded by moorland roads.' },
    { name: 'Eskdale Campsite', lat: 54.40, lng: -3.27, desc: 'Gateway to Hardknott Pass — the steepest road in England.' },
    { name: 'Badrallach', lat: 57.84, lng: -5.39, desc: 'Remote bothy & campsite on Little Loch Broom, Wester Ross.' },
    { name: 'Pen-y-Bont Touring Park', lat: 52.17, lng: -3.47, desc: 'Mid-Wales campsite with access to Elan Valley roads.' },
    { name: 'Tresseck Campsite', lat: 51.92, lng: -2.59, desc: 'Riverside campsite in the Wye Valley near Hoarwithy.' },
    { name: 'Fisherground Campsite', lat: 54.38, lng: -3.25, desc: 'Eskdale valley campsite, next to the miniature railway.' },
    { name: 'Ardnamurchan Campsite', lat: 56.73, lng: -6.08, desc: 'Most westerly point on mainland Britain. End-of-the-road feel.' }
  ];

  static BRIDGES = [
    { name: 'Kylesku Bridge', lat: 58.25, lng: -5.02, desc: 'Elegant curved concrete bridge over Loch a\' Chàirn Bhàin. NC500 highlight.' },
    { name: 'Forth Bridge', lat: 56.00, lng: -3.39, desc: 'Victorian cantilever railway masterpiece. UNESCO World Heritage Site.' },
    { name: 'Humber Bridge', lat: 53.71, lng: -0.45, desc: 'Was the world\'s longest single-span suspension bridge. Iconic Humberside landmark.' },
    { name: 'Severn Bridge (M48)', lat: 51.61, lng: -2.64, desc: 'Gateway between England and Wales. Free to cross since 2018.' },
    { name: 'Menai Suspension Bridge', lat: 53.22, lng: -4.17, desc: 'Telford\'s 1826 masterpiece connecting Anglesey to the mainland.' },
    { name: 'Clifton Suspension Bridge', lat: 51.45, lng: -2.63, desc: 'Brunel\'s iconic bridge spanning the Avon Gorge in Bristol.' },
    { name: 'Ribblehead Viaduct', lat: 54.21, lng: -2.37, desc: '24 arches carrying the Settle–Carlisle railway across Batty Moss.' },
    { name: 'Skye Bridge', lat: 57.28, lng: -5.74, desc: 'Links Kyle of Lochalsh to the Isle of Skye. Beautiful crossing.' },
    { name: 'Tay Bridge', lat: 56.44, lng: -2.99, desc: 'Longest railway bridge in Scotland spanning the Firth of Tay.' },
    { name: 'Iron Bridge', lat: 52.63, lng: -2.49, desc: 'World\'s first iron bridge (1781). Birthplace of the Industrial Revolution.' },
    { name: 'Pontcysyllte Aqueduct', lat: 52.97, lng: -3.09, desc: 'Telford\'s "stream in the sky" — canal aqueduct 38m above the Dee Valley.' },
    { name: 'Glenfinnan Viaduct', lat: 56.87, lng: -5.43, desc: '21-arch concrete viaduct. Made famous by the Hogwarts Express.' },
    { name: 'Millennium Bridge', lat: 54.97, lng: -1.60, desc: 'Tilting bridge over the Tyne in Newcastle. Opens for ships.' },
    { name: 'Tower Bridge', lat: 51.51, lng: -0.08, desc: 'London\'s bascule bridge. Victorian Gothic over the Thames.' },
    { name: 'Conwy Suspension Bridge', lat: 53.28, lng: -3.83, desc: 'Telford bridge beside the medieval castle. Pairs beautifully.' }
  ];

  static WILDLIFE = [
    { name: 'Cairngorms Red Deer', lat: 57.07, lng: -3.64, desc: 'Britain\'s largest national park. Red deer herds on the high plateaux.' },
    { name: 'Mull Sea Eagles', lat: 56.45, lng: -5.95, desc: 'White-tailed eagles reintroduced on Mull. Boat trips from Tobermory.' },
    { name: 'Pembrokeshire Puffins', lat: 51.74, lng: -5.30, desc: 'Skomer Island puffin colony. Boat from Martin\'s Haven, May-July.' },
    { name: 'Norfolk Seals', lat: 52.96, lng: 0.70, desc: 'Grey seal colony at Blakeney Point. Thousands of pups in winter.' },
    { name: 'Dartmoor Ponies', lat: 50.57, lng: -3.92, desc: 'Semi-feral ponies roaming Dartmoor\'s open moorland since medieval times.' },
    { name: 'Highland Cows — Kyloe', lat: 57.52, lng: -5.60, desc: 'Photogenic Highland cows along single-track roads. Watch for them!' },
    { name: 'New Forest Ponies', lat: 50.87, lng: -1.57, desc: 'Ancient common grazing ponies. Ride carefully — they wander onto roads.' },
    { name: 'Farne Islands Seabirds', lat: 55.63, lng: -1.65, desc: 'Puffins, terns, guillemots. Boat trips from Seahouses harbour.' },
    { name: 'Chanonry Point Dolphins', lat: 57.57, lng: -4.09, desc: 'Best place in Europe to see bottlenose dolphins from shore.' },
    { name: 'Islay Barnacle Geese', lat: 55.77, lng: -6.25, desc: 'Tens of thousands of barnacle geese winter on Islay, Oct-Apr.' },
    { name: 'Donna Nook Seals', lat: 53.47, lng: 0.15, desc: 'Grey seal pupping beach in Lincolnshire. November is peak season.' },
    { name: 'Osprey Centre Loch Garten', lat: 57.23, lng: -3.65, desc: 'RSPB hide watching nesting ospreys. April-August.' },
    { name: 'Bass Rock Gannets', lat: 56.08, lng: -2.64, desc: 'World\'s largest gannet colony on a volcanic plug in the Firth of Forth.' },
    { name: 'Exmoor Red Deer', lat: 51.13, lng: -3.62, desc: 'England\'s largest wild red deer herd roams Exmoor\'s combes.' },
    { name: 'Rutland Ospreys', lat: 52.66, lng: -0.72, desc: 'Reintroduced ospreys nest at Rutland Water. Live cameras and hides.' }
  ];

  static ROADS = [
    { name: 'Cat and Fiddle (A537)', lat: 53.26, lng: -1.97, sLat: 53.26, sLng: -1.91, eLat: 53.27, eLng: -2.12, desc: 'Buxton to Macclesfield. Sweeping moorland bends — legendary UK biking road.' , surface: 'excellent', season: 'Exposed and icy in winter. Speed cameras active. High winds common.' },
    { name: 'Snake Pass (A57)', lat: 53.43, lng: -1.85, sLat: 53.39, sLng: -1.75, eLat: 53.45, eLng: -1.95, desc: 'Sheffield to Glossop through the Dark Peak. Technical and atmospheric.' , surface: 'good', season: 'Frequently closed in winter. Fog common year-round. Accident blackspot.' },
    { name: 'Bealach na Bà', lat: 57.42, lng: -5.73, sLat: 57.40, sLng: -5.66, eLat: 57.43, eLng: -5.80, desc: 'Applecross pass — the hardest climb in Britain. Alpine-grade hairpins.' , surface: 'fair', season: 'Closed in severe winter weather. Snow gates at base. Steep 1-in-5 gradient.', hazard: 'Steep 1-in-5 gradient. Hairpin bends. Loose gravel near summit.' },
    { name: 'Hardknott Pass', lat: 54.40, lng: -3.20, sLat: 54.39, sLng: -3.25, eLat: 54.41, eLng: -3.13, desc: 'England\'s steepest road at 33%. Lake District single-track challenge.' , surface: 'poor', season: 'Often closed Nov-Mar. Ice and snow risk Oct-Apr. Not recommended in wet.', hazard: 'Single track with passing places. 1-in-3 gradient.' },
    { name: 'Black Mountain Road (A4069)', lat: 51.86, lng: -3.73, sLat: 51.82, sLng: -3.78, eLat: 51.90, eLng: -3.68, desc: 'Sweeping Welsh road over the Black Mountain. Wide open and fast.' , surface: 'good' },
    { name: 'Horseshoe Pass', lat: 53.04, lng: -3.22, sLat: 53.01, sLng: -3.18, eLat: 53.07, eLng: -3.25, desc: 'Llangollen climb with panoramic views across the Dee Valley.' , surface: 'good' },
    { name: 'A82 Glencoe', lat: 56.68, lng: -5.05, sLat: 56.65, sLng: -5.03, eLat: 56.73, eLng: -5.10, desc: 'Through the jaw-dropping Glen Coe valley. Scotland\'s most dramatic road.' , surface: 'good', season: 'Can close in severe winter. Landslides possible after heavy rain.' },
    { name: 'A93 Devil\'s Elbow', lat: 56.88, lng: -3.38, sLat: 56.97, sLng: -3.40, eLat: 56.81, eLng: -3.35, desc: 'Cairngorms mountain road. Braemar to Glenshee ski area.' , surface: 'good', season: 'Frequently closed in winter snow. Highest main road in the UK.' },
    { name: 'B3212 Dartmoor', lat: 50.60, lng: -3.82, sLat: 50.66, sLng: -3.76, eLat: 50.55, eLng: -3.93, desc: 'Moretonhampstead to Two Bridges across open Dartmoor. Ponies on road!' , surface: 'good', hazard: 'Ponies and cattle on road. Fog in hollows. Cattle grids.' },
    { name: 'A4086 Llanberis Pass', lat: 53.07, lng: -4.05, sLat: 53.12, sLng: -4.13, eLat: 53.06, eLng: -4.00, desc: 'Steep, narrow pass beneath Snowdon. Raw mountain riding.' , surface: 'good', season: 'Can close in winter snow. Ice forms in shadowed sections.' },
    { name: 'A684 Buttertubs Pass', lat: 54.36, lng: -2.18, sLat: 54.31, sLng: -2.20, eLat: 54.39, eLng: -2.15, desc: 'Yorkshire Dales classic. Named after the limestone sinkholes.' , surface: 'fair', hazard: 'Sheep on road common Mar-Oct' },
    { name: 'B4560 Gospel Pass', lat: 51.97, lng: -3.12, sLat: 52.07, sLng: -3.12, eLat: 51.93, eLng: -3.04, desc: 'Highest road in South Wales through the Black Mountains. Remote & quiet.' , surface: 'fair', season: 'Ice risk Nov-Mar. Single-track with limited visibility.', hazard: 'Wild ponies on road. Single track in places.' },
    { name: 'Military Road (B3399)', lat: 50.66, lng: -1.46, sLat: 50.68, sLng: -1.50, eLat: 50.65, eLng: -1.42, desc: 'Isle of Wight coast road with Channel views. Short but sweet.' , surface: 'excellent' },
    { name: 'A838 North Coast', lat: 58.50, lng: -4.90, sLat: 58.47, sLng: -4.85, eLat: 58.52, eLng: -5.00, desc: 'NC500 north coast section. Single track with passing places.' , surface: 'fair', hazard: 'Single track with passing places' },
    { name: 'A87 to Skye', lat: 57.24, lng: -5.50, sLat: 57.18, sLng: -5.42, eLat: 57.28, eLng: -5.74, desc: 'Glen Shiel approach to Skye Bridge. Mountains towering both sides.' , surface: 'good' },
    { name: 'B4391 Bala to Llangynog', lat: 52.82, lng: -3.48, sLat: 52.91, sLng: -3.60, eLat: 52.79, eLng: -3.43, desc: 'Hidden Welsh gem through the Berwyn Mountains. Tight & twisty.' , surface: 'fair', season: 'Remote moorland. Snow possible Nov-Mar. No mobile signal.', hazard: 'Sheep on road common Mar-Oct. No mobile signal.' },
    { name: 'A39 Porlock Hill', lat: 51.22, lng: -3.60, sLat: 51.22, sLng: -3.58, eLat: 51.21, eLng: -3.63, desc: 'Exmoor hairpins with 1-in-4 gradients. Toll road alternative available.' , surface: 'good' },
    { name: 'A5 Ogwen Valley', lat: 53.12, lng: -4.00, sLat: 53.17, sLng: -4.06, eLat: 53.09, eLng: -3.93, desc: 'Telford\'s coach road through Snowdonia. Tryfan looming above.' , surface: 'excellent' },
    { name: 'B4343 Tregaron Mountain', lat: 52.22, lng: -3.80, sLat: 52.22, sLng: -3.93, eLat: 52.22, eLng: -3.68, desc: 'Remote mid-Wales mountain road. "Don\'t drive this road" signs.' , surface: 'single-track', hazard: 'Single track. Remote. No mobile signal.' },
    { name: 'A686 Hartside Pass', lat: 54.76, lng: -2.45, sLat: 54.70, sLng: -2.63, eLat: 54.81, eLng: -2.43, desc: 'Cross Pennine climb to 580m summit. Café at the top.' , surface: 'good', season: 'Snow common Nov-Mar. Exposed summit at 580m. High winds.' }
  ];

  static FUEL = [
    { name: 'Tongue Fuel Station', lat: 58.48, lng: -4.42, desc: 'Last fuel before the north coast emptiness.' },
    { name: 'Kinlochbervie Fuel', lat: 58.46, lng: -5.05, desc: 'Remote northwest Highland fuel stop.' },
    { name: 'Lochinver Fuel', lat: 58.15, lng: -5.25, desc: 'Assynt fuel. Next stop: a long way.' },
    { name: 'Ullapool Co-op Fuel', lat: 57.90, lng: -5.16, desc: 'Last reliable fuel heading north on NC500.' },
    { name: 'Gairloch Fuel', lat: 57.73, lng: -5.69, desc: 'Wester Ross fuel stop.' },
    { name: 'Torridon Stores', lat: 57.54, lng: -5.51, desc: 'Small fuel pump in Glen Torridon. Check opening hours.' },
    { name: 'Broadford, Skye', lat: 57.24, lng: -5.92, desc: 'Main fuel stop on southern Skye.' },
    { name: 'Portree Fuel', lat: 57.41, lng: -6.20, desc: 'Only reliable fuel on northern Skye.' },
    { name: 'Mallaig Fuel', lat: 57.01, lng: -5.83, desc: 'Ferry port fuel. Fill up before or after CalMac crossing.' },
    { name: 'Fort William Shell', lat: 56.82, lng: -5.11, desc: 'Major fuel stop. Last big town before the remote west.' },
    { name: 'Crianlarich Fuel', lat: 56.39, lng: -4.62, desc: 'Junction town fuel — A82/A85 crossroads.' },
    { name: 'Tyndrum Green Welly', lat: 56.43, lng: -4.71, desc: 'Famous biker stop with fuel, food, and coffee.' },
    { name: 'Llanberis Fuel', lat: 53.12, lng: -4.13, desc: 'Snowdonia fuel at the foot of the mountain.' },
    { name: 'Dolgellau Fuel', lat: 52.74, lng: -3.89, desc: 'Southern Snowdonia fuel stop.' },
    { name: 'Machynlleth Fuel', lat: 52.59, lng: -3.85, desc: 'Mid-Wales market town fuel.' },
    { name: 'Devil\'s Bridge Fuel', lat: 52.38, lng: -3.85, desc: 'Remote mid-Wales fuel near the waterfalls.' },
    { name: 'Builth Wells Fuel', lat: 52.15, lng: -3.40, desc: 'Royal Welsh showground area fuel.' },
    { name: 'Hawes Fuel', lat: 54.31, lng: -2.20, desc: 'Wensleydale town fuel. Dales riding base.' },
    { name: 'Kirkby Stephen Fuel', lat: 54.47, lng: -2.35, desc: 'Eden Valley fuel between Dales and Lakes.' },
    { name: 'Keswick Fuel', lat: 54.60, lng: -3.14, desc: 'Lake District hub fuel.' },
    { name: 'Ambleside Fuel', lat: 54.43, lng: -2.96, desc: 'Central Lakes fuel stop.' },
    { name: 'Bettyhill Fuel', lat: 58.53, lng: -4.24, desc: 'North coast Highland fuel between Tongue and Thurso.' },
    { name: 'Lairg Fuel', lat: 58.00, lng: -4.40, desc: 'Central Sutherland fuel — useful NC500 shortcut.' },
    { name: 'Durness Fuel', lat: 58.40, lng: -4.75, desc: 'Northwest corner of Scotland fuel.' },
    { name: 'Scourie Fuel', lat: 58.35, lng: -5.15, desc: 'Small pump between Kylesku and Durness.' },
    { name: 'Dingwall Fuel', lat: 57.60, lng: -4.43, desc: 'Easter Ross town with multiple fuel options.' },
    { name: 'Brora Fuel', lat: 58.01, lng: -3.86, desc: 'East coast Sutherland fuel stop.' },
    { name: 'Helmsdale Fuel', lat: 58.12, lng: -3.65, desc: 'Fishing village fuel on the A9 coast road.' },
    { name: 'Ballater Fuel', lat: 57.05, lng: -3.04, desc: 'Royal Deeside fuel near Balmoral.' },
    { name: 'Pitlochry Fuel', lat: 56.70, lng: -3.73, desc: 'Highland Perthshire fuel — A9 corridor.' }
  ];

  static VIEWPOINTS = [
    { name: 'Rest and Be Thankful', lat: 56.23, lng: -4.88, desc: 'Famous viewpoint on the A83. Watch for landslide closures.' },
    { name: 'Bealach na Ba Summit', lat: 57.42, lng: -5.69, desc: '626m summit viewpoint. On clear days you can see the Outer Hebrides.' },
    { name: 'Quiraing Viewpoint', lat: 57.64, lng: -6.26, desc: 'Alien landscape viewpoint on the Trotternish Ridge, Skye.' },
    { name: 'Old Man of Storr', lat: 57.51, lng: -6.18, desc: 'Iconic pinnacle viewpoint. Short walk from car park.' },
    { name: 'Struie Viewpoint', lat: 57.78, lng: -4.27, desc: 'Panoramic view over the Dornoch Firth from the B9176.' },
    { name: 'Dunnet Head', lat: 58.67, lng: -3.37, desc: 'Mainland Britain\'s most northerly point. Wild Atlantic views.' },
    { name: 'Duncansby Stacks', lat: 58.64, lng: -3.03, desc: 'Sea stacks near John O\'Groats. Short walk from car park.' },
    { name: 'Stac Pollaidh', lat: 58.04, lng: -5.20, desc: 'Mountain viewpoint in Assynt with views of Suilven and the coast.' },
    { name: 'Loch Lomond Viewpoint', lat: 56.24, lng: -4.60, desc: 'Classic view of Scotland\'s largest loch from the A82.' },
    { name: 'Devil\'s Staircase', lat: 56.67, lng: -5.10, desc: 'West Highland Way viewpoint near the Glencoe summit.' },
    { name: 'Hartside Summit', lat: 54.76, lng: -2.46, desc: 'Cross-Pennine summit at 580m. Views across the Eden Valley.' },
    { name: 'Honister Summit', lat: 54.51, lng: -3.19, desc: 'Lake District pass summit. Slate mine and café.' , hazard: 'Working slate quarry. Heavy vehicles. Steep descent both sides.' },
    { name: 'Wrynose Summit', lat: 54.42, lng: -3.11, desc: 'Three Shire Stone marking old county boundaries. Bleak and beautiful.' , hazard: 'Exposed summit. Steep road both sides. Ice risk Oct-Apr.' },
    { name: 'Cat Bells View', lat: 54.57, lng: -3.17, desc: 'Classic Derwentwater panorama from above Keswick.' },
    { name: 'Pen-y-Pass', lat: 53.07, lng: -4.02, desc: 'Snowdon trailhead with mountain pass views.' },
    { name: 'Gospel Pass Summit', lat: 51.98, lng: -3.10, desc: 'Highest road in South Wales. Black Mountains all around.' },
    { name: 'Ribblehead View', lat: 54.21, lng: -2.37, desc: 'Iconic view of the 24-arch viaduct with Ingleborough behind.' },
    { name: 'Bamburgh Castle View', lat: 55.61, lng: -1.71, desc: 'Coastal viewpoint with the castle rising from the dunes.' },
    { name: 'Eilean Donan View', lat: 57.27, lng: -5.52, desc: 'Scotland\'s most photographed castle at the meeting of three lochs.' },
    { name: 'Fairy Pools View', lat: 57.25, lng: -6.27, desc: 'Crystal-clear pools beneath the Black Cuillin, Skye.' }
  ];

  static PUBS = [
    { name: 'Ace Cafe London', lat: 51.54, lng: -0.22, desc: 'Iconic biker café on the North Circular. Pilgrimage site.' , url: 'https://www.acecafe.com' },
    { name: 'Sligachan Hotel', lat: 57.29, lng: -6.17, desc: 'Historic Skye pub at the foot of the Cuillin. Real ales and views.' , url: 'https://www.sligachan.co.uk' },
    { name: 'Cat and Fiddle Inn', lat: 53.25, lng: -1.98, desc: 'Britain\'s second-highest pub. On the legendary A537.' },
    { name: 'Tan Hill Inn', lat: 54.38, lng: -2.14, desc: 'Britain\'s highest pub at 528m. Yorkshire Dales moorland.' , url: 'https://www.tanhillinn.co.uk' },
    { name: 'Applecross Inn', lat: 57.43, lng: -5.81, desc: 'Reward after Bealach na Ba. Famous seafood and beer.' , url: 'https://www.applecrossinn.co.uk' },
    { name: 'Tyndrum Green Welly Stop', lat: 56.43, lng: -4.71, desc: 'Famous Highland pit stop. Every biker stops here.' },
    { name: 'Devil\'s Bridge Tea Room', lat: 52.38, lng: -3.85, desc: 'Welsh tea room by the waterfalls. Proper cakes.' },
    { name: 'Pen-y-Gwryd Hotel', lat: 53.07, lng: -4.00, desc: 'Snowdonia mountaineers\' pub. Everest team base camp.' , url: 'https://www.pyg.co.uk' },
    { name: 'Kylesku Hotel', lat: 58.25, lng: -5.02, desc: 'Seafood restaurant beside the bridge. NC500 essential stop.' },
    { name: 'Clachaig Inn', lat: 56.66, lng: -5.06, desc: 'Legendary Glencoe pub. Live music, real ales, muddy boots welcome.' , url: 'https://www.clachaig.com' },
    { name: 'Drover\'s Inn', lat: 56.34, lng: -4.72, desc: 'Atmospheric Loch Lomond pub. Stuffed animals and ghost stories.' },
    { name: 'Kirkstone Pass Inn', lat: 54.44, lng: -2.92, desc: 'Lake District pass pub — third highest in England.' , url: 'https://www.kirkstonepassinn.com' },
    { name: 'Old Forge, Knoydart', lat: 57.04, lng: -5.67, desc: 'Britain\'s most remote mainland pub. Accessible by boat.' },
    { name: 'Rannoch Station Tearoom', lat: 56.69, lng: -4.58, desc: 'Remote Rannoch Moor station café. End-of-the-world feel.' },
    { name: 'Hartside Café', lat: 54.76, lng: -2.45, desc: 'Summit café on the A686 Cross-Pennine route. Biker favourite.' }
  ];

  static DAY_COLORS = [
    '#FF6B6B', '#FFA502', '#FFD93D', '#6BCB77', '#4D96FF',
    '#9B59B6', '#FF6348', '#00B894', '#E17055', '#0984E3',
    '#FDCB6E', '#A29BFE', '#55EFC4', '#D63031', '#1ABC9C'
  ];

  static POI_CONFIG = {
    campsites:    { dataKey: 'CAMPSITES',    color: '#27ae60', faIcon: 'fa-campground',      size: 30, label: 'Campsites' },
    bridges:      { dataKey: 'BRIDGES',      color: '#2d98da', faIcon: 'fa-bridge',          size: 30, label: 'Bridges' },
    wildlife:     { dataKey: 'WILDLIFE',     color: '#f39c12', faIcon: 'fa-paw',             size: 26, label: 'Wildlife' },
    roads:        { dataKey: 'ROADS',        color: '#e74c3c', faIcon: 'fa-road',            size: 28, label: 'Roads' },
    fuel:         { dataKey: 'FUEL',         color: '#fdcb6e', faIcon: 'fa-gas-pump',        size: 24, label: 'Fuel Stations' },
    viewpoints:   { dataKey: 'VIEWPOINTS',   color: '#e8713a', faIcon: 'fa-binoculars',      size: 28, label: 'Viewpoints' },
    pubs:         { dataKey: 'PUBS',         color: '#c0392b', faIcon: 'fa-beer-mug-empty',  size: 26, label: 'Pubs & Cafés' },
    castles:      { dataKey: 'CASTLES',      color: '#6c5ce7', faIcon: 'fa-chess-rook',      size: 28, label: 'Castles' },
    waterfalls:   { dataKey: 'WATERFALLS',   color: '#00cec9', faIcon: 'fa-water',           size: 28, label: 'Waterfalls' },
    beaches:      { dataKey: 'BEACHES',      color: '#e17055', faIcon: 'fa-umbrella-beach',  size: 28, label: 'Beaches' },
    distilleries: { dataKey: 'DISTILLERIES', color: '#d35400', faIcon: 'fa-flask',           size: 26, label: 'Distilleries' },
    landmarks:    { dataKey: 'LANDMARKS',    color: '#9b59b6', faIcon: 'fa-monument',        size: 28, label: 'Landmarks' },
    fossils:      { dataKey: 'FOSSILS',      color: '#cd853f', faIcon: 'fa-bone',            size: 28, label: 'Fossils' },
    ferries:      { dataKey: 'FERRIES',      color: '#3498db', faIcon: 'fa-ship',            size: 32, label: 'Ferries' },
    ev_charging:  { dataKey: 'EV_CHARGING',  color: '#27ae60', faIcon: 'fa-bolt',            size: 24, label: 'EV Charging' },
    motorcycle_parking: { dataKey: 'MOTORCYCLE_PARKING', color: '#2d98da', faIcon: 'fa-parking', size: 24, label: 'Bike Parking' },
    repair_shops: { dataKey: 'REPAIR_SHOPS', color: '#e74c3c', faIcon: 'fa-wrench',          size: 24, label: 'Repair Shops' },
    hotels:       { dataKey: 'HOTELS',       color: '#9b59b6', faIcon: 'fa-bed',             size: 26, label: 'Hotels & B&Bs' },
    mountain_passes: { dataKey: 'MOUNTAIN_PASSES', color: '#e74c3c', faIcon: 'fa-mountain',  size: 28, label: 'Mountain Passes' }
  };

  // Categories populated from external POI files
  static CASTLES = [];
  static WATERFALLS = [];
  static BEACHES = [];
  static DISTILLERIES = [];
  static LANDMARKS = [];
  static FOSSILS = [];
  static FERRIES = [];
  static EV_CHARGING = [];
  static MOTORCYCLE_PARKING = [];
  static REPAIR_SHOPS = [];
  static HOTELS = [];
  static MOUNTAIN_PASSES = [];

  static _poiMerged = false;
  static _mergeExternalPOI() {
    if (RouteBuilder._poiMerged) return;
    RouteBuilder._poiMerged = true;
    var sources = [];
    if (typeof POI_SCOTLAND !== 'undefined') sources.push(POI_SCOTLAND);
    if (typeof POI_ENGLAND !== 'undefined') sources.push(POI_ENGLAND);
    if (typeof POI_WALES_ISLANDS !== 'undefined') sources.push(POI_WALES_ISLANDS);
    var keyMap = {
      campsites:'CAMPSITES', bridges:'BRIDGES', wildlife:'WILDLIFE', roads:'ROADS',
      fuel:'FUEL', viewpoints:'VIEWPOINTS', pubs:'PUBS', castles:'CASTLES',
      waterfalls:'WATERFALLS', beaches:'BEACHES', distilleries:'DISTILLERIES',
      landmarks:'LANDMARKS', fossils:'FOSSILS', ferries:'FERRIES',
      ev_charging:'EV_CHARGING', motorcycle_parking:'MOTORCYCLE_PARKING',
      repair_shops:'REPAIR_SHOPS', hotels:'HOTELS', mountain_passes:'MOUNTAIN_PASSES'
    };
    for (var s = 0; s < sources.length; s++) {
      var src = sources[s];
      for (var cat in keyMap) {
        if (src[cat] && Array.isArray(src[cat])) {
          var target = RouteBuilder[keyMap[cat]];
          if (!target) { RouteBuilder[keyMap[cat]] = []; target = RouteBuilder[keyMap[cat]]; }
          var existingNames = {};
          for (var e = 0; e < target.length; e++) existingNames[target[e].name] = true;
          for (var n = 0; n < src[cat].length; n++) {
            if (!existingNames[src[cat][n].name]) {
              target.push(src[cat][n]);
            }
          }
        }
      }
    }
  }

  // ── Constructor ──────────────────────────────────────────────

  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    if (!this.container) throw new Error('RouteBuilder: container #' + containerId + ' not found');

    this.map = null;
    this.waypoints = [];
    this.waypointMarkers = [];
    this.waypointNames = [];
    this.routeCoords = [];
    this.routeDistance = 0;
    this.routeDuration = 0;
    this.daySegments = [];
    this.dayMarkers = [];

    this.segmentModes = {};
    this._segmentResults = [];
    this._legDistances = [];
    this._legDurations = [];
    this._dayLines = [];

    this.poiLayers = {};
    this.poiVisible = {};
    this._poiPanelOpen = false;
    for (var k in RouteBuilder.POI_CONFIG) {
      this.poiLayers[k] = null;
      this.poiVisible[k] = false;
    }

    this.startLocation = null;
    this.endLocation = null;
    this.startMarker = null;
    this.endMarker = null;
    this.ghostMarkers = [];

    this._routeDebounce = null;
    this._osrmLastCall = 0;
    this._isFetching = false;

    this._weatherCache = null;
    this._weatherCacheTime = 0;
    this._fuelGapLines = [];
    this._recommendedFuelStops = [];

    // Merge external POI data files into static arrays
    RouteBuilder._mergeExternalPOI();

    this._injectStyles();
    this._buildDOM();
    this._initMap();
    this._bindEvents();
    this._initPOILayers();
    this._loadSavedList();
    this._loadFromHash();
  }

  // ── CSS Injection ────────────────────────────────────────────

  _injectStyles() {
    if (document.getElementById('rb-styles')) return;
    var style = document.createElement('style');
    style.id = 'rb-styles';
    style.textContent = `
      .rb-wrap{position:relative;width:100%;height:100%;display:flex;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#F4F4F4;overflow:hidden}
      .rb-sidebar{width:370px;min-width:370px;background:#0f1614;border-right:1px solid #1e2e2a;display:flex;flex-direction:column;overflow-y:auto;z-index:600;transition:transform .3s ease}
      .rb-sidebar h3{margin:0 0 8px;font-size:14px;color:#D68A2D;text-transform:uppercase;letter-spacing:1px}
      .rb-sidebar label{display:flex;align-items:center;gap:8px;font-size:13px;color:#c0c8c5;cursor:pointer;padding:4px 0}
      .rb-sidebar input[type=text],.rb-sidebar input[type=number]{width:100%;padding:8px 10px;background:#152220;border:1px solid #2a3e38;border-radius:6px;color:#F4F4F4;font-size:13px;outline:none;box-sizing:border-box}
      .rb-sidebar input[type=text]:focus,.rb-sidebar input[type=number]:focus{border-color:#D68A2D}
      .rb-sidebar input[type=checkbox]{accent-color:#D68A2D;width:16px;height:16px}
      .rb-section{padding:14px 16px;border-bottom:1px solid #1e2e2a}
      .rb-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 14px;border:none;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;transition:background .2s,transform .1s}
      .rb-btn:active{transform:scale(0.97)}
      .rb-btn-primary{background:#D68A2D;color:#080c0b}.rb-btn-primary:hover{background:#e09a3d}
      .rb-btn-secondary{background:#1e2e2a;color:#c0c8c5}.rb-btn-secondary:hover{background:#2a3e38}
      .rb-btn-danger{background:#4a1a1a;color:#ff7675}.rb-btn-danger:hover{background:#6b2424}
      .rb-btn-sm{padding:5px 10px;font-size:11px}
      .rb-btn-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
      .rb-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
      .rb-stat{background:#152220;border-radius:8px;padding:10px 12px;text-align:center}
      .rb-stat-value{font-size:20px;font-weight:700;color:#D68A2D}
      .rb-stat-label{font-size:11px;color:#7a8a85;margin-top:2px}
      .rb-day-card{background:#152220;border-radius:8px;padding:12px;margin-top:8px;border-left:3px solid #4D96FF}
      .rb-day-card h4{margin:0 0 4px;font-size:14px}
      .rb-day-card p{margin:0;font-size:12px;color:#7a8a85}
      .rb-saved-item{display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:#152220;border-radius:6px;margin-top:6px;font-size:13px}
      .rb-saved-item span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}
      .rb-saved-btns{display:flex;gap:4px}
      .rb-saved-btns button{background:none;border:none;color:#7a8a85;cursor:pointer;font-size:14px;padding:2px 6px;border-radius:4px}
      .rb-saved-btns button:hover{color:#F4F4F4;background:#2a3e38}
      .rb-map-area{flex:1;position:relative;display:flex;flex-direction:column;min-width:0;overflow:hidden}
      .rb-map-area .leaflet-container{width:100%;height:100%;background:#080c0b}
      .rb-elevation{background:#0e1a17;border-top:1px solid #1e2e2a;padding:8px;display:none}
      .rb-elevation canvas{display:block;cursor:crosshair}
      .rb-elevation-stats{display:flex;gap:16px;padding:4px 8px 0;font-size:11px;color:#7a8a85}
      .rb-elevation-stats b{font-weight:600}
      .rb-elevation-tooltip{position:absolute;pointer-events:none;background:rgba(15,22,20,0.92);color:#c0c8c5;padding:4px 8px;border-radius:4px;font-size:11px;white-space:nowrap;z-index:10;border:1px solid #2a3e38}
      .rb-overlay{position:absolute;top:16px;left:50%;transform:translateX(-50%);background:rgba(15,22,20,0.92);color:#c0c8c5;padding:10px 20px;border-radius:8px;font-size:14px;z-index:500;pointer-events:none;transition:opacity .3s}
      .rb-overlay.hidden{opacity:0}
      .rb-toggle-sidebar{display:none;position:absolute;top:12px;left:12px;z-index:700;background:#0f1614;border:1px solid #2a3e38;color:#D68A2D;width:40px;height:40px;border-radius:8px;font-size:18px;cursor:pointer;align-items:center;justify-content:center}
      .rb-wp-marker{width:28px;height:28px;background:#D68A2D;border-radius:50%;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#080c0b;box-shadow:0 2px 8px rgba(0,0,0,0.4);cursor:grab}
      .rb-wp-marker:hover{transform:scale(1.1)}
      .rb-wp-marker-start{background:#27ae60}
      .rb-wp-marker-end{background:#e74c3c}
      .rb-day-marker{width:24px;height:24px;border-radius:50%;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)}
      .rb-poi-marker{border-radius:50%;border:2px solid rgba(255,255,255,0.9);display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.4);cursor:pointer;transition:transform .2s}
      .rb-poi-marker:hover{transform:scale(1.25);z-index:9999!important}
      .rb-poi-ghost{opacity:0.5}
      .rb-pref-toggle{display:flex;background:#152220;border-radius:6px;overflow:hidden;margin-top:6px}
      .rb-pref-toggle button{flex:1;padding:6px;font-size:12px;font-weight:600;border:none;cursor:pointer;transition:background .2s;color:#7a8a85;background:transparent}
      .rb-pref-toggle button.active{background:#D68A2D;color:#080c0b}
      .rb-geo-row{display:flex;gap:6px;margin-bottom:6px}
      .rb-geo-row input{flex:1}
      .rb-geo-row button{flex-shrink:0;width:36px;height:36px;padding:0}
      .rb-geo-results{max-height:120px;overflow-y:auto;background:#152220;border-radius:6px;display:none}
      .rb-geo-results.open{display:block}
      .rb-geo-item{padding:8px 10px;font-size:12px;color:#c0c8c5;cursor:pointer;border-bottom:1px solid #1e2e2a}
      .rb-geo-item:hover{background:#2a3e38;color:#F4F4F4}
      .rb-geo-item:last-child{border-bottom:none}
      .rb-wp-list-item{display:flex;align-items:center;gap:6px;padding:7px 8px;background:#152220;border-radius:6px;margin-top:5px;font-size:12px;cursor:grab;transition:background .15s}
      .rb-wp-list-item:hover{background:#1a2e2a}
      .rb-wp-list-item.rb-drag-over{border-top:2px solid #D68A2D}
      .rb-wp-drag-handle{cursor:grab;color:#7a8a85;font-size:14px;flex-shrink:0;user-select:none}
      .rb-wp-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#c0c8c5}
      .rb-seg-mode-row{display:flex;align-items:center;gap:0;padding:0 8px;cursor:pointer;margin:2px 0}
      .rb-seg-line{flex:1;height:2px;background:#2a3e38}
      .rb-seg-line-fast{background:#666;background:repeating-linear-gradient(90deg,#666 0,#666 6px,transparent 6px,transparent 10px)}
      .rb-seg-mode-btn{flex-shrink:0;background:#1a2e2a;border:1px solid #2a3e38;color:#7a8a85;cursor:pointer;font-size:10px;font-weight:600;padding:3px 10px;border-radius:12px;display:flex;align-items:center;gap:4px;transition:all .15s;text-transform:uppercase;letter-spacing:0.3px}
      .rb-seg-mode-btn i{font-size:9px}
      .rb-seg-mode-btn:hover{border-color:#D68A2D;color:#D68A2D}
      .rb-seg-mode-fast{background:rgba(102,102,102,0.2);border-color:#666;color:#aaa}
      .rb-seg-mode-fast:hover{border-color:#fff;color:#fff}
      .rb-wp-del-btn{background:none;border:none;cursor:pointer;font-size:12px;color:#ff7675;padding:2px 6px;border-radius:4px;flex-shrink:0}
      .rb-wp-del-btn:hover{background:#4a1a1a}
      .rb-suggest-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#152220;border:1px solid #2a3e38;border-radius:6px;font-size:12px;color:#D68A2D;margin-top:8px}
      .rb-loading{position:absolute;top:16px;left:50%;transform:translateX(-50%);background:rgba(15,22,20,0.92);color:#D68A2D;padding:8px 18px;border-radius:8px;font-size:13px;z-index:500;display:none}
      .rb-loading.active{display:block}
      .rb-fuel-marker{width:32px;height:32px;border-radius:50%;background:#fdcb6e;border:2px solid #fff;display:flex;align-items:center;justify-content:center;color:#080c0b;font-size:13px;box-shadow:0 2px 10px rgba(253,203,110,0.5);animation:rb-fuel-pop .3s ease}
      @keyframes rb-fuel-pop{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}
      .rb-fuel-inline{display:flex;align-items:center;gap:8px;padding:4px 8px;margin:2px 0;font-size:11px;color:#fdcb6e;opacity:0.7}
      .rb-fuel-inline i{font-size:10px}
      .rb-fuel-inline span{color:#7a8a85;margin-left:auto;font-size:10px}
      .rb-poi-popup-btn{display:inline-block;margin-top:6px;padding:4px 10px;background:#D68A2D;color:#080c0b;border:none;border-radius:4px;font-size:11px;font-weight:600;cursor:pointer}
      .rb-poi-popup-btn:hover{background:#e09a3d}
      .rb-poi-toggle{position:absolute;top:80px;right:12px;z-index:450;background:rgba(15,22,20,0.92);border:1px solid #2a3e38;color:#D68A2D;padding:8px 12px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;font-family:inherit;transition:all .2s}
      .rb-poi-toggle:hover{background:#1a2e2a;border-color:#D68A2D}
      .rb-poi-toggle.active{background:#D68A2D;color:#080c0b;border-color:#D68A2D}
      .rb-poi-toggle span{font-size:11px}
      @keyframes rb-poi-pulse{0%,100%{box-shadow:0 0 0 0 rgba(214,138,45,0.4)}50%{box-shadow:0 0 0 10px rgba(214,138,45,0)}}
      .rb-poi-toggle.pulse{animation:rb-poi-pulse 1.5s ease 3}
      .rb-poi-panel{position:absolute;top:80px;right:12px;z-index:440;background:rgba(15,22,20,0.95);border:1px solid #2a3e38;border-radius:10px;width:220px;max-height:calc(100% - 140px);display:none;flex-direction:column;backdrop-filter:blur(8px);box-shadow:0 8px 32px rgba(0,0,0,0.4)}
      .rb-poi-panel.open{display:flex}
      .rb-poi-panel-header{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid #1e2e2a}
      .rb-poi-panel-header h4{margin:0;font-size:13px;color:#c0c8c5;display:flex;align-items:center;gap:6px}
      .rb-poi-panel-header h4 i{color:#D68A2D}
      .rb-poi-panel-close{background:none;border:none;color:#7a8a85;cursor:pointer;font-size:14px;padding:4px}
      .rb-poi-panel-close:hover{color:#fff}
      .rb-poi-panel-body{padding:8px 14px;overflow-y:auto;flex:1}
      .rb-poi-panel-body label{display:flex;align-items:center;gap:8px;font-size:12px;color:#c0c8c5;cursor:pointer;padding:5px 0}
      .rb-poi-panel-body label:hover{color:#fff}
      .rb-poi-panel-footer{display:flex;gap:6px;padding:10px 14px;border-top:1px solid #1e2e2a}
      .rb-poi-panel-all,.rb-poi-panel-none{flex:1;padding:6px;font-size:11px;font-weight:600;border:none;border-radius:5px;cursor:pointer;font-family:inherit}
      .rb-poi-panel-all{background:#D68A2D;color:#080c0b}
      .rb-poi-panel-all:hover{background:#e09a3d}
      .rb-poi-panel-none{background:#1e2e2a;color:#7a8a85}
      .rb-poi-panel-none:hover{background:#2a3e38;color:#c0c8c5}
      .rb-weather-bar{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
      .rb-weather-day{background:#152220;border-radius:6px;padding:6px 8px;text-align:center;min-width:42px;flex:1}
      .rb-weather-label{font-size:10px;color:#7a8a85;margin-bottom:2px}
      .rb-weather-icon{font-size:18px;line-height:1.2}
      .rb-weather-temp{font-size:11px;color:#c8d6d0;margin-top:2px}
      .rb-wind-warn{display:block;font-size:10px;color:#ff7675;margin-top:2px}
      .rb-fuel-warnings{padding:8px 16px}
      .rb-fuel-warn-item{background:#4a1a1a;color:#ff7675;padding:8px 12px;border-radius:6px;font-size:12px;margin-bottom:4px;border-left:3px solid #ff4444}
      .rb-fuel-range{border-top:1px solid #1e2e2a;padding-top:8px}
      .rb-cost-display{background:#152220;border-radius:8px;padding:12px}
      .rb-cost-title{font-size:13px;font-weight:700;color:#D68A2D;margin-bottom:4px}
      .rb-cost-divider{font-size:10px;color:#2a3e38;margin-bottom:8px;letter-spacing:-1px}
      .rb-cost-row{display:flex;justify-content:space-between;font-size:13px;color:#c8d6d0;padding:3px 0}
      .rb-cost-row span:last-child{font-weight:700;color:#D68A2D}
      .rb-cost-detail{font-size:11px;color:#7a8a85;padding:0 0 4px}
      .rb-cost-days{margin-top:8px;border-top:1px solid #1e2e2a;padding-top:8px}
      .rb-cost-day-row{display:flex;justify-content:space-between;font-size:12px;color:#c8d6d0;padding:2px 0}
      .rb-cost-day-row span:last-child{color:#D68A2D}
      .rb-nav-apps{display:grid;grid-template-columns:1fr 1fr;gap:6px}
      .rb-nav-btn{display:flex;align-items:center;gap:8px;padding:10px 12px;background:#1a1f1e;border:1px solid #2a302e;border-radius:8px;color:#c5ccc9;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.15s}
      .rb-nav-btn:hover{border-color:#D68A2D;color:#D68A2D;background:#1e2422}
      .rb-nav-btn i{font-size:16px;width:20px;text-align:center}
      @media(max-width:768px){
        .rb-sidebar{position:absolute;top:0;left:0;height:100%;transform:translateX(-100%);box-shadow:4px 0 20px rgba(0,0,0,.5)}
        .rb-sidebar.open{transform:translateX(0)}
        .rb-toggle-sidebar{display:flex}
      }
    `;
    document.head.appendChild(style);
  }

  // ── DOM Construction ─────────────────────────────────────────

  _buildDOM() {
    var poiChecks = '';
    var poiTypes = Object.keys(RouteBuilder.POI_CONFIG);
    for (var i = 0; i < poiTypes.length; i++) {
      var type = poiTypes[i];
      var cfg = RouteBuilder.POI_CONFIG[type];
      var data = RouteBuilder[cfg.dataKey];
      var count = data ? data.length : 0;
      poiChecks += '<label><input type="checkbox" data-poi-type="' + type + '"> ' +
        '<span style="display:inline-flex;width:18px;height:18px;border-radius:50%;background:' + cfg.color + ';align-items:center;justify-content:center;margin-right:4px"><i class="fas ' + cfg.faIcon + '" style="font-size:9px;color:#fff"></i></span>' +
        cfg.label + ' (' + count + ')</label>';
    }

    this.container.innerHTML =
      '<div class="rb-wrap">' +
        '<button class="rb-toggle-sidebar" id="rb-toggleBtn">\u2630</button>' +
        '<div class="rb-sidebar" id="rb-sidebar">' +

          '<div id="rb-fuelWarnings"></div>' +

          '<div class="rb-section">' +
            '<h3>\uD83D\uDCCD Start / End</h3>' +
            '<div class="rb-geo-row">' +
              '<input type="text" id="rb-startInput" placeholder="Start location...">' +
              '<button class="rb-btn rb-btn-secondary" id="rb-startSearch">\uD83D\uDD0D</button>' +
            '</div>' +
            '<div class="rb-geo-results" id="rb-startResults"></div>' +
            '<div class="rb-geo-row">' +
              '<input type="text" id="rb-endInput" placeholder="End location (optional)...">' +
              '<button class="rb-btn rb-btn-secondary" id="rb-endSearch">\uD83D\uDD0D</button>' +
            '</div>' +
            '<div class="rb-geo-results" id="rb-endResults"></div>' +
          '</div>' +

          '<div class="rb-section">' +
            '<h3>\uD83D\uDEE3\uFE0F Route Name</h3>' +
            '<input type="text" id="rb-routeName" placeholder="My Custom Route" value="My Custom Route">' +
          '</div>' +

          '<div class="rb-section">' +
            '<h3>\uD83D\uDCCA Route Stats</h3>' +
            '<div class="rb-stats">' +
              '<div class="rb-stat"><div class="rb-stat-value" id="rb-totalDist">0</div><div class="rb-stat-label">Miles</div></div>' +
              '<div class="rb-stat"><div class="rb-stat-value" id="rb-totalTime">0h</div><div class="rb-stat-label">Ride Time</div></div>' +
              '<div class="rb-stat"><div class="rb-stat-value" id="rb-wpCount">0</div><div class="rb-stat-label">Waypoints</div></div>' +
              '<div class="rb-stat"><div class="rb-stat-value" id="rb-dayCount">1</div><div class="rb-stat-label">Days</div></div>' +
            '</div>' +
          '</div>' +

          '<div class="rb-section">' +
            '<h3>\uD83D\uDCB0 Cost Estimate</h3>' +
            '<div style="display:flex;gap:8px;margin-bottom:8px">' +
              '<label style="flex:1">MPG<input type="number" id="rbMPG" value="45" min="10" max="100" step="1" style="width:100%;margin-top:4px"></label>' +
              '<label style="flex:1">\u00A3/Litre<input type="number" id="rbFuelPrice" value="1.45" min="0.50" max="3.00" step="0.01" style="width:100%;margin-top:4px"></label>' +
            '</div>' +
            '<div id="rb-costPanel"><p style="font-size:12px;color:#7a8a85">Add a route to see costs</p></div>' +
          '</div>' +

          '<div class="rb-section">' +
            '<h3>\u23F1\uFE0F Daily Limits</h3>' +
            '<div style="display:none" id="rb-prefToggle"><button class="active" data-mode="miles">Miles</button></div>' +
            '<label>Max miles per day' +
              '<input type="number" id="rb-maxMiles" value="150" min="20" max="600" style="width:70px;margin-left:auto">' +
            '</label>' +
            '<label style="margin-top:6px">Max hours per day' +
              '<input type="number" id="rb-maxHours" value="4" min="1" max="12" step="0.5" style="width:70px;margin-left:auto">' +
            '</label>' +
            '<div class="rb-fuel-range" style="margin-top:10px">' +
              '<label>\u26FD Tank Range (miles)' +
                '<input type="number" id="rbFuelRange" value="120" min="50" max="400" step="10" style="width:70px;margin-left:auto">' +
              '</label>' +
            '</div>' +
            '<button class="rb-btn rb-btn-secondary" id="rb-fastTrackBtn" style="margin-top:10px;width:100%;"><i class="fas fa-forward"></i> Fast Track (Motorways)</button>' +
          '</div>' +

          '<div class="rb-section">' +
            '<h3>\uD83D\uDCCC Waypoints</h3>' +
            '<div class="rb-geo-row" style="margin-bottom:8px">' +
              '<input type="text" id="rb-wpSearchInput" placeholder="Search location to add...">' +
              '<button class="rb-btn rb-btn-secondary" id="rb-wpSearchBtn" title="Search"><i class="fas fa-plus"></i></button>' +
            '</div>' +
            '<div class="rb-geo-results" id="rb-wpSearchResults"></div>' +
            '<div id="rb-waypointList"><p style="font-size:12px;color:#7a8a85">Click map, search above, or click POIs to add waypoints</p></div>' +
          '</div>' +

          '<div class="rb-section">' +
            '<h3>\uD83D\uDCC5 Day Breakdown</h3>' +
            '<div id="rb-dayCards"><p style="font-size:12px;color:#7a8a85">Add waypoints to see day breakdown</p></div>' +
          '</div>' +

          '<div class="rb-section">' +
            '<h3>\uD83C\uDF24\uFE0F Weather Forecast</h3>' +
            '<div id="rb-weatherBar" class="rb-weather-bar"><p style="font-size:12px;color:#7a8a85">Add waypoints to see forecast</p></div>' +
          '</div>' +

          '<div class="rb-section">' +
            '<h3>\uD83D\uDCBE Actions</h3>' +
            '<div class="rb-btn-row">' +
              '<button class="rb-btn rb-btn-primary" id="rb-saveBtn">\uD83D\uDCBE Save</button>' +
              '<button class="rb-btn rb-btn-secondary" id="rb-exportBtn">\uD83D\uDCE5 Export GPX</button>' +
              '<button class="rb-btn rb-btn-secondary" id="rb-importBtn">\uD83D\uDCC2 Import GPX</button>' +
              '<button class="rb-btn rb-btn-secondary" id="rb-shareBtn">\uD83D\uDD17 Share</button>' +
            '</div>' +
            '<div class="rb-btn-row">' +
              '<button class="rb-btn rb-btn-secondary" id="rb-reverseBtn">\uD83D\uDD04 Reverse</button>' +
              '<button class="rb-btn rb-btn-secondary" id="rb-suggestBtn">\uD83D\uDD0D Suggest Stops</button>' +
              '<button class="rb-btn rb-btn-danger" id="rb-clearBtn">\uD83D\uDDD1\uFE0F Clear</button>' +
            '</div>' +
            '<div id="rb-suggestBadge"></div>' +
            '<input type="file" id="rb-gpxFile" accept=".gpx" style="display:none">' +
          '</div>' +

          '<div class="rb-section">' +
            '<h3>\uD83D\uDCF1 Send to Nav App</h3>' +
            '<div class="rb-nav-apps" id="rb-navApps">' +
              '<button class="rb-nav-btn" id="rb-googleMaps" title="Open in Google Maps"><i class="fas fa-map-location-dot" style="color:#4285F4"></i> Google Maps</button>' +
              '<button class="rb-nav-btn" id="rb-appleMaps" title="Open in Apple Maps"><i class="fas fa-map" style="color:currentColor"></i> Apple Maps</button>' +
              '<button class="rb-nav-btn" id="rb-waze" title="Open in Waze"><i class="fas fa-location-arrow" style="color:#33ccff"></i> Waze</button>' +
              '<button class="rb-nav-btn" id="rb-kurviger" title="Open in Kurviger"><i class="fas fa-route" style="color:#ff6600"></i> Kurviger</button>' +
              '<button class="rb-nav-btn" id="rb-qrCode" title="QR Code for phone"><i class="fas fa-qrcode"></i> QR Code</button>' +
            '</div>' +
            '<div id="rb-qrDisplay" style="display:none;text-align:center;margin-top:12px"></div>' +
            '<p style="font-size:11px;color:#7a8a85;margin-top:8px">GPX export works with Garmin Zumo, Calimoto, and any GPX-compatible device.</p>' +
          '</div>' +

          '<div class="rb-section">' +
            '<h3>\uD83D\uDCC2 Saved Routes</h3>' +
            '<div id="rb-savedList"><p style="font-size:12px;color:#7a8a85">No saved routes</p></div>' +
          '</div>' +

        '</div>' +
        '<div class="rb-map-area">' +
          '<div id="rb-map" style="width:100%;flex:1;min-height:0"></div>' +
          '<div class="rb-overlay" id="rb-overlay">Click on the map to add waypoints</div>' +
          '<div class="rb-loading" id="rb-loading">Calculating route\u2026</div>' +
          '<button class="rb-poi-toggle" id="rb-poiToggle" title="Show/hide points of interest"><i class="fas fa-map-marker-alt"></i><span>POI</span></button>' +
          '<div class="rb-poi-panel" id="rb-poiPanel">' +
            '<div class="rb-poi-panel-header"><h4><i class="fas fa-map-marker-alt"></i> Points of Interest</h4><button class="rb-poi-panel-close" id="rb-poiPanelClose"><i class="fas fa-times"></i></button></div>' +
            '<div class="rb-poi-panel-body">' + poiChecks + '</div>' +
            '<div class="rb-poi-panel-footer">' +
              '<button class="rb-poi-panel-all" id="rb-poiAll">Show All</button><button class="rb-poi-panel-none" id="rb-poiNone">Hide All</button>' +
              '<div style="display:flex;align-items:center;gap:6px;margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.1);width:100%;">' +
                '<span style="font-size:10px;font-weight:700;color:#D68A2D;white-space:nowrap;">MIN RATING</span>' +
                '<input id="rb-ratingSlider" type="range" min="1" max="5" value="4" step="1" style="flex:1;accent-color:#D68A2D;cursor:pointer;">' +
                '<span id="rb-ratingLabel" style="font-size:11px;font-weight:700;min-width:28px;text-align:center;">4\u2605+</span>' +
                '<button id="rb-ratingAuto" style="padding:2px 8px;background:rgba(214,138,45,0.15);border:1px solid rgba(214,138,45,0.2);border-radius:8px;color:#D68A2D;font-size:9px;font-weight:700;cursor:pointer;">Auto</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="rb-elevation" id="rb-elevation">' +
            '<canvas id="rb-elevCanvas"></canvas>' +
            '<div class="rb-elevation-stats" id="rb-elevStats"></div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  // ── Map Initialization ───────────────────────────────────────

  _initMap() {
    var self = this;
    this.map = L.map('rb-map', {
      center: [54.5, -3.5],
      zoom: 6,
      zoomControl: false,
      attributionControl: true
    });

    this.map.createPane('editorPickPane');
    this.map.getPane('editorPickPane').style.zIndex = 650;

    L.control.zoom({ position: 'topright' }).addTo(this.map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);

    this._poiMinRating = 4;
    this._poiUserOverride = false;

    this.map.on('zoomend', function() {
      if (self._poiUserOverride) return;
      var z = self.map.getZoom();
      var autoMin = z >= 13 ? 1 : z >= 11 ? 2 : z >= 10 ? 3 : 4;
      if (autoMin !== self._poiMinRating) {
        self._poiMinRating = autoMin;
        self._applyPoiRatingFilter();
        var slider = self.container.querySelector('#rb-ratingSlider');
        if (slider) slider.value = autoMin;
        var label = self.container.querySelector('#rb-ratingLabel');
        if (label) label.textContent = autoMin === 1 ? 'All' : autoMin + '\u2605+';
      }
    });
  }

  // ── Event Binding ────────────────────────────────────────────

  _bindEvents() {
    var self = this;

    // Map click — add waypoint
    this.map.on('click', function (e) { self._addWaypoint(e.latlng.lat, e.latlng.lng); });

    // Sidebar toggle (mobile)
    var toggleBtn = this.container.querySelector('#rb-toggleBtn');
    var sidebar = this.container.querySelector('#rb-sidebar');
    toggleBtn.addEventListener('click', function () { sidebar.classList.toggle('open'); });
    this.map.on('click', function () {
      if (window.innerWidth <= 768) sidebar.classList.remove('open');
    });

    // Daily preference toggle
    var prefToggle = this.container.querySelector('#rb-prefToggle');
    prefToggle.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      prefToggle.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var mode = btn.dataset.mode;
      self.container.querySelector('#rb-milesLabel').style.display = mode === 'miles' ? '' : 'none';
      self.container.querySelector('#rb-hoursLabel').style.display = mode === 'hours' ? '' : 'none';
      self._splitDays();
    });

    // Max miles/hours change
    this.container.querySelector('#rb-maxMiles').addEventListener('change', function () { self._splitDays(); });
    this.container.querySelector('#rb-maxHours').addEventListener('change', function () { self._splitDays(); });

    // Fuel range change
    this.container.querySelector('#rbFuelRange').addEventListener('change', function () { self._checkFuelRange(); });

    // Cost inputs change
    this.container.querySelector('#rbMPG').addEventListener('change', function () { self._calculateCosts(); });
    this.container.querySelector('#rbFuelPrice').addEventListener('change', function () { self._calculateCosts(); });

    // POI panel toggle
    var poiToggleBtn = this.container.querySelector('#rb-poiToggle');
    var poiPanel = this.container.querySelector('#rb-poiPanel');
    poiToggleBtn.addEventListener('click', function() {
      self._poiPanelOpen = !self._poiPanelOpen;
      poiPanel.classList.toggle('open', self._poiPanelOpen);
      poiToggleBtn.classList.toggle('active', self._poiPanelOpen);
    });
    this.container.querySelector('#rb-poiPanelClose').addEventListener('click', function() {
      self._poiPanelOpen = false;
      poiPanel.classList.remove('open');
      poiToggleBtn.classList.remove('active');
    });
    this.container.querySelector('#rb-poiAll').addEventListener('click', function() {
      self.container.querySelectorAll('input[data-poi-type]').forEach(function(cb) {
        cb.checked = true;
        self._togglePOI(cb.dataset.poiType, true);
      });
    });
    this.container.querySelector('#rb-poiNone').addEventListener('click', function() {
      self.container.querySelectorAll('input[data-poi-type]').forEach(function(cb) {
        cb.checked = false;
        self._togglePOI(cb.dataset.poiType, false);
      });
    });
    // Flash the POI button on first load
    setTimeout(function() { poiToggleBtn.classList.add('pulse'); }, 1500);

    // POI filter toggles
    this.container.querySelectorAll('input[data-poi-type]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        self._togglePOI(cb.dataset.poiType, cb.checked);
      });
    });

    // Rating slider
    var ratingSlider = this.container.querySelector('#rb-ratingSlider');
    var ratingLabel = this.container.querySelector('#rb-ratingLabel');
    if (ratingSlider) {
      ratingSlider.addEventListener('input', function() {
        self._poiUserOverride = true;
        self._poiMinRating = parseInt(ratingSlider.value);
        if (ratingLabel) ratingLabel.textContent = self._poiMinRating === 1 ? 'All' : self._poiMinRating + '\u2605+';
        self._applyPoiRatingFilter();
      });
    }
    var ratingAuto = this.container.querySelector('#rb-ratingAuto');
    if (ratingAuto) {
      ratingAuto.addEventListener('click', function() {
        self._poiUserOverride = false;
        var z = self.map.getZoom();
        self._poiMinRating = z >= 13 ? 1 : z >= 11 ? 2 : z >= 10 ? 3 : 4;
        if (ratingSlider) ratingSlider.value = self._poiMinRating;
        if (ratingLabel) ratingLabel.textContent = self._poiMinRating === 1 ? 'All' : self._poiMinRating + '\u2605+';
        self._applyPoiRatingFilter();
      });
    }

    // Geocoding — Start
    var startInput = this.container.querySelector('#rb-startInput');
    var startSearch = this.container.querySelector('#rb-startSearch');
    startInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') self._searchLocation('start');
    });
    startSearch.addEventListener('click', function () { self._searchLocation('start'); });

    // Geocoding — End
    var endInput = this.container.querySelector('#rb-endInput');
    var endSearch = this.container.querySelector('#rb-endSearch');
    endInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') self._searchLocation('end');
    });
    endSearch.addEventListener('click', function () { self._searchLocation('end'); });

    // Waypoint search
    var wpSearchInput = this.container.querySelector('#rb-wpSearchInput');
    var wpSearchBtn = this.container.querySelector('#rb-wpSearchBtn');
    wpSearchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') self._searchWaypoint();
    });
    wpSearchBtn.addEventListener('click', function () { self._searchWaypoint(); });

    // Action buttons
    this.container.querySelector('#rb-saveBtn').addEventListener('click', function () { self._saveRoute(); });
    this.container.querySelector('#rb-exportBtn').addEventListener('click', function () { self._exportGPX(); });
    this.container.querySelector('#rb-clearBtn').addEventListener('click', function () { self._clearRoute(); });
    this.container.querySelector('#rb-reverseBtn').addEventListener('click', function () { self._reverseRoute(); });
    this.container.querySelector('#rb-suggestBtn').addEventListener('click', function () { self._suggestStops(); });
    this.container.querySelector('#rb-shareBtn').addEventListener('click', function () { self._shareRoute(); });
    this.container.querySelector('#rb-fastTrackBtn').addEventListener('click', function () { self._setAllFastTrack(); });

    // Nav app buttons
    this.container.querySelector('#rb-googleMaps').addEventListener('click', function () { self._openGoogleMaps(); });
    this.container.querySelector('#rb-appleMaps').addEventListener('click', function () { self._openAppleMaps(); });
    this.container.querySelector('#rb-waze').addEventListener('click', function () { self._openWaze(); });
    this.container.querySelector('#rb-kurviger').addEventListener('click', function () { self._openKurviger(); });
    this.container.querySelector('#rb-qrCode').addEventListener('click', function () { self._showQRCode(); });

    // Import GPX
    var gpxFileInput = this.container.querySelector('#rb-gpxFile');
    this.container.querySelector('#rb-importBtn').addEventListener('click', function () { gpxFileInput.click(); });
    gpxFileInput.addEventListener('change', function (e) {
      if (e.target.files && e.target.files[0]) {
        self._importGPX(e.target.files[0]);
        e.target.value = '';
      }
    });

    // Delegate POI popup "Add to Route" clicks
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.rb-poi-popup-btn');
      if (!btn) return;
      var lat = parseFloat(btn.dataset.lat);
      var lng = parseFloat(btn.dataset.lng);
      var name = btn.dataset.name || '';
      var poiType = btn.dataset.poitype || '';
      if (poiType === 'roads') {
        var roadIdx = parseInt(btn.dataset.roadidx);
        if (!isNaN(roadIdx)) self._addRoadToRoute(roadIdx);
      } else {
        self._addPOIWaypoint(lat, lng, name);
      }
      self.map.closePopup();
    });
  }

  // ── POI Layer Initialization (all visible by default) ───────

  _initPOILayers() {
    var self = this;
    var types = Object.keys(RouteBuilder.POI_CONFIG);

    for (var t = 0; t < types.length; t++) {
      var type = types[t];
      this._createPOILayer(type);
    }
  }

  _createPOILayer(type) {
    var self = this;
    var cfg = RouteBuilder.POI_CONFIG[type];
    var data = RouteBuilder[cfg.dataKey];
    if (!data) return;

    var group = L.layerGroup();

    for (var i = 0; i < data.length; i++) {
      var poi = data[i];
      var r = poi.rating || 1;
      var isTop = poi.top === true;
      var sz, markerHtml, pane;

      if (isTop) {
        sz = 34;
        var eName = (poi.name || '').replace(/</g, '&lt;').replace(/"/g, '&quot;');
        markerHtml =
          '<div class="editor-pick-wrap">' +
            '<div class="editor-pick-badge"><i class="fas fa-star"></i></div>' +
            '<div class="rb-poi-marker" style="width:' + sz + 'px;height:' + sz + 'px;background:' + cfg.color + '"><i class="fas ' + cfg.faIcon + '" style="font-size:' + Math.round(sz * 0.4) + 'px"></i></div>' +
            '<div class="editor-pick-ribbon">Editor\'s Pick</div>' +
            '<div class="editor-pick-name">' + eName + '</div>' +
          '</div>';
        pane = 'editorPickPane';
      } else {
        sz = r >= 4 ? (cfg.size || 28) : r >= 3 ? 22 : 18;
        var opacity = r >= 4 ? 1 : r >= 3 ? 0.85 : 0.6;
        markerHtml = '<div class="rb-poi-marker" style="width:' + sz + 'px;height:' + sz + 'px;background:' + cfg.color + ';opacity:' + opacity + '"><i class="fas ' + cfg.faIcon + '" style="font-size:' + Math.round(sz * 0.4) + 'px"></i></div>';
        pane = 'markerPane';
      }

      var poiIcon = L.divIcon({
        className: '',
        html: markerHtml,
        iconSize: [sz, sz],
        iconAnchor: [sz / 2, sz / 2],
        popupAnchor: [0, -(sz / 2) - 4]
      });

      var marker = L.marker([poi.lat, poi.lng], { icon: poiIcon, pane: pane });
      marker._poiRating = r;
      marker._isEditorPick = isTop;
      var popupHtml = this._buildPOIPopup(type, poi, i);
      marker.bindPopup(popupHtml, { maxWidth: 280, closeButton: true });
      group.addLayer(marker);
    }

    this.poiLayers[type] = group;
    if (this.poiVisible[type]) {
      group.addTo(this.map);
    }
  }

  _buildPOIPopup(type, poi, idx) {
    var cfg = RouteBuilder.POI_CONFIG[type] || {};
    var r = poi.rating || 1;
    var stars = '';
    for (var si = 0; si < 5; si++) stars += '<span style="color:' + (si < r ? '#D68A2D' : '#444') + ';font-size:10px;">&#9733;</span>';
    var epBadge = poi.top ? ' <span style="color:#D68A2D;font-size:10px;font-weight:700;">Editor\'s Pick</span>' : '';
    var html = '<div style="font-size:13px;max-width:260px;">';
    html += '<b>' + this._esc(poi.name) + '</b>' + epBadge;
    html += '<div style="margin:2px 0;">' + stars + ' <span style="color:' + (cfg.color || '#D68A2D') + ';font-size:11px;font-weight:600;">' + (cfg.label || type) + '</span></div>';
    html += '<span style="color:#aaa;font-size:11px;">' + this._esc(poi.desc) + '</span>';

    if (poi.surface) {
      var surfColors = { excellent:'#27ae60', good:'#6BCB77', fair:'#f39c12', poor:'#e74c3c', 'single-track':'#e74c3c' };
      html += '<div style="margin-top:4px;font-size:11px;"><i class="fas fa-road" style="color:' + (surfColors[poi.surface] || '#aaa') + '"></i> Surface: <b style="color:' + (surfColors[poi.surface] || '#aaa') + '">' + poi.surface + '</b></div>';
    }
    if (poi.season) {
      html += '<div style="margin-top:4px;font-size:11px;color:#f39c12;"><i class="fas fa-exclamation-triangle"></i> ' + this._esc(poi.season) + '</div>';
    }
    if (poi.hazard) {
      html += '<div style="margin-top:3px;font-size:11px;color:#e74c3c;"><i class="fas fa-skull-crossbones"></i> ' + this._esc(poi.hazard) + '</div>';
    }
    if (poi.url) {
      html += '<div style="margin-top:4px;"><a href="' + poi.url + '" target="_blank" style="font-size:11px;color:#3498db;text-decoration:none;"><i class="fas fa-external-link-alt"></i> Website / Booking</a></div>';
    }

    html += '<div style="margin-top:6px;">';
    if (type === 'roads') {
      html += '<button class="rb-poi-popup-btn" data-poitype="roads" data-roadidx="' + idx +
        '" data-lat="' + poi.lat + '" data-lng="' + poi.lng +
        '" data-name="' + this._escAttr(poi.name) + '">Add Road to Route</button>';
    } else {
      html += '<button class="rb-poi-popup-btn" data-poitype="' + type +
        '" data-lat="' + poi.lat + '" data-lng="' + poi.lng +
        '" data-name="' + this._escAttr(poi.name) + '">Add to Route</button>';
    }
    html += '</div></div>';

    return html;
  }

  // ── POI Filter Toggles ──────────────────────────────────────

  _togglePOI(type, show) {
    this.poiVisible[type] = show;
    if (show) {
      if (this.poiLayers[type]) {
        this.poiLayers[type].addTo(this.map);
        this._applyPoiRatingFilter();
      }
    } else {
      if (this.poiLayers[type]) {
        this.map.removeLayer(this.poiLayers[type]);
      }
    }
  }

  _applyPoiRatingFilter() {
    var min = this._poiMinRating || 1;
    var types = Object.keys(RouteBuilder.POI_CONFIG);
    for (var t = 0; t < types.length; t++) {
      var type = types[t];
      var layer = this.poiLayers[type];
      if (!layer || !this.poiVisible[type]) continue;
      layer.eachLayer(function(marker) {
        var el = marker.getElement();
        if (!el) return;
        if (marker._isEditorPick || marker._poiRating >= min) {
          el.style.display = '';
        } else {
          el.style.display = 'none';
        }
      });
    }
  }

  // ── POI Click → Add to Route ────────────────────────────────

  _addPOIWaypoint(lat, lng, name) {
    var insertIdx = this._findInsertIndex(lat, lng);
    this._addWaypoint(lat, lng, name, insertIdx);
  }

  _addRoadToRoute(roadIdx) {
    var road = RouteBuilder.ROADS[roadIdx];
    if (!road) return;
    if (!confirm('Add ' + road.name + ' to your route?')) return;

    var insertIdx = this._findInsertIndex(road.lat, road.lng);
    this._addWaypoint(road.sLat, road.sLng, road.name + ' (start)', insertIdx);
    this._addWaypoint(road.eLat, road.eLng, road.name + ' (end)', insertIdx + 1);
  }

  _findInsertIndex(lat, lng) {
    if (this.waypoints.length < 2) return this.waypoints.length;

    var minDist = Infinity;
    var bestIdx = this.waypoints.length;

    for (var i = 0; i < this.waypoints.length - 1; i++) {
      var a = this.waypoints[i];
      var b = this.waypoints[i + 1];
      var midLat = (a.lat + b.lat) / 2;
      var midLng = (a.lng + b.lng) / 2;
      var d = this._haversine([lat, lng], [midLat, midLng]);
      if (d < minDist) {
        minDist = d;
        bestIdx = i + 1;
      }
    }

    return bestIdx;
  }

  // ── Geocoding (Nominatim) ───────────────────────────────────

  async _searchLocation(which) {
    var inputId = which === 'start' ? '#rb-startInput' : '#rb-endInput';
    var resultsId = which === 'start' ? '#rb-startResults' : '#rb-endResults';
    var query = this.container.querySelector(inputId).value.trim();
    if (!query) return;

    var results;
    try {
      results = await this._geocode(query);
    } catch (err) {
      console.warn('RouteBuilder: Geocode error', err);
      return;
    }

    var container = this.container.querySelector(resultsId);
    if (!results || results.length === 0) {
      container.innerHTML = '<div class="rb-geo-item" style="color:#ff7675">No results found</div>';
      container.classList.add('open');
      return;
    }

    var self = this;
    var html = '';
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      var display = r.display_name.length > 60 ? r.display_name.substring(0, 60) + '\u2026' : r.display_name;
      html += '<div class="rb-geo-item" data-idx="' + i + '">' + this._esc(display) + '</div>';
    }
    container.innerHTML = html;
    container.classList.add('open');

    container.querySelectorAll('.rb-geo-item').forEach(function (item) {
      item.addEventListener('click', function () {
        var idx = parseInt(item.dataset.idx);
        var result = results[idx];
        if (which === 'start') {
          self._setStartLocation(result);
        } else {
          self._setEndLocation(result);
        }
        container.classList.remove('open');
      });
    });
  }

  async _geocode(query) {
    var url = 'https://nominatim.openstreetmap.org/search?format=json&q=' +
      encodeURIComponent(query) + '&countrycodes=gb,je,gg,im&limit=5';
    var resp = await fetch(url, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'VisorUpRouteBuilder/1.0' }
    });
    if (!resp.ok) throw new Error('Geocode request failed: ' + resp.status);
    return await resp.json();
  }

  async _searchWaypoint() {
    var input = this.container.querySelector('#rb-wpSearchInput');
    var resultsDiv = this.container.querySelector('#rb-wpSearchResults');
    var query = input.value.trim();
    if (!query) return;

    var results;
    try {
      results = await this._geocode(query);
    } catch (err) {
      console.warn('RouteBuilder: Waypoint geocode error', err);
      return;
    }

    if (!results || results.length === 0) {
      resultsDiv.innerHTML = '<div class="rb-geo-item" style="color:#ff6b6b">No results found</div>';
      resultsDiv.classList.add('open');
      return;
    }

    var self = this;
    var html = '';
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      var label = r.display_name.length > 60 ? r.display_name.substring(0, 57) + '...' : r.display_name;
      html += '<div class="rb-geo-item" data-lat="' + r.lat + '" data-lon="' + r.lon + '" data-name="' + this._escAttr(r.display_name.split(',')[0].trim()) + '">' + this._esc(label) + '</div>';
    }
    resultsDiv.innerHTML = html;
    resultsDiv.classList.add('open');

    resultsDiv.querySelectorAll('.rb-geo-item').forEach(function (item) {
      item.addEventListener('click', function () {
        var lat = parseFloat(item.dataset.lat);
        var lon = parseFloat(item.dataset.lon);
        var name = item.dataset.name || '';
        self._addWaypoint(lat, lon, name);
        input.value = '';
        resultsDiv.classList.remove('open');
        resultsDiv.innerHTML = '';
        self.map.setView([lat, lon], 12);
      });
    });
  }

  _setStartLocation(result) {
    var lat = parseFloat(result.lat);
    var lng = parseFloat(result.lon);
    var name = result.display_name.split(',')[0].trim();

    this.container.querySelector('#rb-startInput').value = name;
    this.container.querySelector('#rb-startResults').classList.remove('open');

    // Remove old start marker
    if (this.startMarker) this.map.removeLayer(this.startMarker);

    // Place start marker
    var icon = L.divIcon({
      className: '',
      html: '<div class="rb-wp-marker rb-wp-marker-start" style="font-size:16px">\uD83D\uDFE2</div>',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    this.startMarker = L.marker([lat, lng], { icon: icon }).addTo(this.map);
    this.startMarker.bindPopup('<b>Start: ' + this._esc(name) + '</b>');

    // Update waypoints
    if (this.startLocation) {
      // Replace existing start waypoint (index 0)
      this.waypoints[0] = { lat: lat, lng: lng };
      this.waypointNames[0] = name;
      if (this.waypointMarkers[0]) this.map.removeLayer(this.waypointMarkers[0]);
      this.waypointMarkers[0] = this._createWaypointMarker(lat, lng, 0, true);
    } else {
      // Insert at beginning
      this.waypoints.unshift({ lat: lat, lng: lng });
      this.waypointNames.unshift(name);
      var m = this._createWaypointMarker(lat, lng, 0, true);
      this.waypointMarkers.unshift(m);
    }

    this.startLocation = { lat: lat, lng: lng, name: name };
    this._renumberMarkers();
    this._recalcRoute();

    // Hide overlay
    this.container.querySelector('#rb-overlay').classList.add('hidden');
  }

  _setEndLocation(result) {
    var lat = parseFloat(result.lat);
    var lng = parseFloat(result.lon);
    var name = result.display_name.split(',')[0].trim();

    this.container.querySelector('#rb-endInput').value = name;
    this.container.querySelector('#rb-endResults').classList.remove('open');

    // Remove old end marker
    if (this.endMarker) this.map.removeLayer(this.endMarker);

    // Place end marker
    var icon = L.divIcon({
      className: '',
      html: '<div class="rb-wp-marker rb-wp-marker-end" style="font-size:16px">\uD83D\uDD34</div>',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    this.endMarker = L.marker([lat, lng], { icon: icon }).addTo(this.map);
    this.endMarker.bindPopup('<b>End: ' + this._esc(name) + '</b>');

    // Update waypoints
    if (this.endLocation) {
      // Replace existing end waypoint (last index)
      var lastIdx = this.waypoints.length - 1;
      this.waypoints[lastIdx] = { lat: lat, lng: lng };
      this.waypointNames[lastIdx] = name;
      if (this.waypointMarkers[lastIdx]) this.map.removeLayer(this.waypointMarkers[lastIdx]);
      this.waypointMarkers[lastIdx] = this._createWaypointMarker(lat, lng, lastIdx, true);
    } else {
      // Append at end
      this.waypoints.push({ lat: lat, lng: lng });
      this.waypointNames.push(name);
      var m = this._createWaypointMarker(lat, lng, this.waypoints.length - 1, true);
      this.waypointMarkers.push(m);
    }

    this.endLocation = { lat: lat, lng: lng, name: name };
    this._renumberMarkers();
    this._recalcRoute();

    this.container.querySelector('#rb-overlay').classList.add('hidden');
  }

  // ── Waypoint Management ─────────────────────────────────────

  _addWaypoint(lat, lng, name, insertIdx) {
    name = name || null;
    if (typeof insertIdx === 'undefined' || insertIdx === null || insertIdx < 0) {
      // Default: insert before end location if set, otherwise append
      if (this.endLocation && this.waypoints.length > 0) {
        insertIdx = this.waypoints.length - 1;
      } else {
        insertIdx = this.waypoints.length;
      }
    }

    // Clamp to valid range
    if (insertIdx > this.waypoints.length) insertIdx = this.waypoints.length;

    this.waypoints.splice(insertIdx, 0, { lat: lat, lng: lng });
    this.waypointNames.splice(insertIdx, 0, name);

    var marker = this._createWaypointMarker(lat, lng, insertIdx, true);
    this.waypointMarkers.splice(insertIdx, 0, marker);

    // Shift segment modes for indices at or after insertIdx
    var newModes = {};
    var keys = Object.keys(this.segmentModes);
    for (var k = 0; k < keys.length; k++) {
      var idx = parseInt(keys[k]);
      if (idx >= insertIdx) {
        newModes[idx + 1] = this.segmentModes[idx];
      } else {
        newModes[idx] = this.segmentModes[idx];
      }
    }
    this.segmentModes = newModes;

    this._renumberMarkers();
    this._updateWaypointList();

    // Hide overlay after first waypoint
    if (this.waypoints.length >= 1) {
      this.container.querySelector('#rb-overlay').classList.add('hidden');
    }

    this._clearSuggestions();
    this._recalcRoute();
  }

  _createWaypointMarker(lat, lng, idx, addToMap) {
    var self = this;
    var icon = L.divIcon({
      className: '',
      html: '<div class="rb-wp-marker">' + (idx + 1) + '</div>',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    var marker = L.marker([lat, lng], { icon: icon, draggable: true });
    if (addToMap) marker.addTo(this.map);

    var wpName = this.waypointNames[idx];
    var label = wpName ? this._esc(wpName) : 'Waypoint ' + (idx + 1);
    marker.bindPopup('<b>' + label + '</b><br><span style="font-size:11px;color:#999">Drag to move \u00b7 Right-click to delete</span>', { closeButton: true });

    marker.on('dragend', function () {
      var pos = marker.getLatLng();
      var mi = self.waypointMarkers.indexOf(marker);
      if (mi >= 0) {
        self.waypoints[mi] = { lat: pos.lat, lng: pos.lng };
        self._clearSuggestions();
        self._recalcRoute();
      }
    });

    marker.on('contextmenu', function (e) {
      L.DomEvent.stopPropagation(e);
      self._removeWaypoint(self.waypointMarkers.indexOf(marker));
    });

    // Long press for mobile delete
    var pressTimer = null;
    marker.on('mousedown touchstart', function () {
      pressTimer = setTimeout(function () {
        self._removeWaypoint(self.waypointMarkers.indexOf(marker));
      }, 700);
    });
    marker.on('mouseup touchend mousemove dragstart', function () {
      clearTimeout(pressTimer);
    });

    return marker;
  }

  _removeWaypoint(idx) {
    if (idx < 0 || idx >= this.waypoints.length) return;

    this.map.removeLayer(this.waypointMarkers[idx]);
    this.waypoints.splice(idx, 1);
    this.waypointMarkers.splice(idx, 1);
    this.waypointNames.splice(idx, 1);

    // Check if we removed start or end location
    if (idx === 0 && this.startLocation) {
      if (this.startMarker) this.map.removeLayer(this.startMarker);
      this.startMarker = null;
      this.startLocation = null;
      this.container.querySelector('#rb-startInput').value = '';
    }
    if (this.endLocation && idx === this.waypoints.length) {
      if (this.endMarker) this.map.removeLayer(this.endMarker);
      this.endMarker = null;
      this.endLocation = null;
      this.container.querySelector('#rb-endInput').value = '';
    }

    // Shift segment modes
    var newModes = {};
    var keys = Object.keys(this.segmentModes);
    for (var k = 0; k < keys.length; k++) {
      var ki = parseInt(keys[k]);
      if (ki === idx) continue;
      if (ki > idx) {
        newModes[ki - 1] = this.segmentModes[ki];
      } else {
        newModes[ki] = this.segmentModes[ki];
      }
    }
    this.segmentModes = newModes;

    this._renumberMarkers();
    this._updateWaypointList();

    if (this.waypoints.length === 0) {
      this.container.querySelector('#rb-overlay').classList.remove('hidden');
    }

    this._clearSuggestions();
    this._recalcRoute();
  }

  _renumberMarkers() {
    var self = this;
    this.waypointMarkers.forEach(function (marker, i) {
      var html;
      if (i === 0 && self.startLocation) {
        html = '<div class="rb-wp-marker rb-wp-marker-start" style="font-size:16px">\uD83D\uDFE2</div>';
      } else if (i === self.waypoints.length - 1 && self.endLocation) {
        html = '<div class="rb-wp-marker rb-wp-marker-end" style="font-size:16px">\uD83D\uDD34</div>';
      } else {
        html = '<div class="rb-wp-marker">' + (i + 1) + '</div>';
      }
      var icon = L.divIcon({
        className: '',
        html: html,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      marker.setIcon(icon);
      var wpName = self.waypointNames[i];
      var label = wpName ? self._esc(wpName) : 'Waypoint ' + (i + 1);
      marker.setPopupContent('<b>' + label + '</b><br><span style="font-size:11px;color:#999">Drag to move \u00b7 Right-click to delete</span>');
    });
  }

  // ── Waypoint List UI (sidebar with drag-and-drop) ───────────

  _updateWaypointList() {
    var container = this.container.querySelector('#rb-waypointList');
    if (this.waypoints.length === 0) {
      container.innerHTML = '<p style="font-size:12px;color:#7a8a85">Click map, search above, or click POIs to add waypoints</p>';
      return;
    }

    var self = this;
    var html = '';

    for (var i = 0; i < this.waypoints.length; i++) {
      var name = this.waypointNames[i] || ('Waypoint ' + (i + 1));
      var showModeBtn = i < this.waypoints.length - 1;

      html += '<div class="rb-wp-list-item" draggable="true" data-wp-idx="' + i + '">' +
        '<span class="rb-wp-drag-handle" title="Drag to reorder">\u2630</span>' +
        '<span class="rb-wp-name" title="' + this._escAttr(name) + '">' +
          '<strong style="color:#D68A2D;margin-right:4px">' + (i + 1) + '.</strong>' + this._esc(name) +
        '</span>' +
        '<button class="rb-wp-del-btn" data-del-idx="' + i + '" title="Remove">\u2715</button>' +
      '</div>';

      if (showModeBtn) {
        var mode = this.segmentModes[i] || 'scenic';
        var isFast = mode === 'fast';
        html += '<div class="rb-seg-mode-row" data-mode-idx="' + i + '" title="Click to switch between scenic and fast routing for this segment">' +
          '<span class="rb-seg-line' + (isFast ? ' rb-seg-line-fast' : '') + '"></span>' +
          '<button class="rb-seg-mode-btn' + (isFast ? ' rb-seg-mode-fast' : '') + '" data-mode-idx="' + i + '">' +
            (isFast ? '<i class="fas fa-road"></i> Fast' : '<i class="fas fa-mountain"></i> Scenic') +
          '</button>' +
          '<span class="rb-seg-line' + (isFast ? ' rb-seg-line-fast' : '') + '"></span>' +
        '</div>';

        // Show fuel stops that fall between this waypoint and the next
        if (this._recommendedFuelStops && this._segmentResults && this._segmentResults[i]) {
          var segStartMile = 0;
          for (var si = 0; si < i; si++) {
            segStartMile += (this._legDistances[si] || 0) / 1609.34;
          }
          var segEndMile = segStartMile + (this._legDistances[i] || 0) / 1609.34;
          for (var fi = 0; fi < this._recommendedFuelStops.length; fi++) {
            var fs = this._recommendedFuelStops[fi];
            if (fs.routeMiles >= segStartMile && fs.routeMiles <= segEndMile) {
              html += '<div class="rb-fuel-inline"><i class="fas fa-gas-pump"></i> ' + this._esc(fs.name) + '<span>' + Math.round(fs.routeMiles) + ' mi</span></div>';
            }
          }
        }
      }
    }

    container.innerHTML = html;

    // Bind mode toggle buttons (row and button)
    container.querySelectorAll('.rb-seg-mode-row').forEach(function (row) {
      row.addEventListener('click', function (e) {
        e.stopPropagation();
        var idx = parseInt(row.dataset.modeIdx);
        self._toggleSegmentMode(idx);
      });
    });

    // Bind delete buttons
    container.querySelectorAll('.rb-wp-del-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var idx = parseInt(btn.dataset.delIdx);
        self._removeWaypoint(idx);
      });
    });

    // Drag-and-drop reorder
    this._bindWaypointDragDrop(container);
  }

  _bindWaypointDragDrop(container) {
    var self = this;
    var dragSrcIdx = null;

    container.querySelectorAll('.rb-wp-list-item').forEach(function (item) {
      item.addEventListener('dragstart', function (e) {
        dragSrcIdx = parseInt(item.dataset.wpIdx);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', dragSrcIdx.toString());
        item.style.opacity = '0.4';
      });

      item.addEventListener('dragend', function () {
        item.style.opacity = '1';
        container.querySelectorAll('.rb-wp-list-item').forEach(function (el) {
          el.classList.remove('rb-drag-over');
        });
      });

      item.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        container.querySelectorAll('.rb-wp-list-item').forEach(function (el) {
          el.classList.remove('rb-drag-over');
        });
        item.classList.add('rb-drag-over');
      });

      item.addEventListener('dragleave', function () {
        item.classList.remove('rb-drag-over');
      });

      item.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        item.classList.remove('rb-drag-over');

        var destIdx = parseInt(item.dataset.wpIdx);
        if (dragSrcIdx === null || dragSrcIdx === destIdx) return;

        // Reorder waypoints
        var wp = self.waypoints.splice(dragSrcIdx, 1)[0];
        var mk = self.waypointMarkers.splice(dragSrcIdx, 1)[0];
        var nm = self.waypointNames.splice(dragSrcIdx, 1)[0];

        self.waypoints.splice(destIdx, 0, wp);
        self.waypointMarkers.splice(destIdx, 0, mk);
        self.waypointNames.splice(destIdx, 0, nm);

        // Reset segment modes (simplest approach)
        self.segmentModes = {};

        // Update start/end location references
        if (self.startLocation) {
          var foundStart = false;
          for (var si = 0; si < self.waypoints.length; si++) {
            if (self.waypoints[si].lat === self.startLocation.lat &&
                self.waypoints[si].lng === self.startLocation.lng) {
              if (si !== 0) {
                // Start is no longer at index 0, clear it
                self.startLocation = null;
                if (self.startMarker) { self.map.removeLayer(self.startMarker); self.startMarker = null; }
                self.container.querySelector('#rb-startInput').value = '';
              }
              foundStart = true;
              break;
            }
          }
          if (!foundStart) {
            self.startLocation = null;
            if (self.startMarker) { self.map.removeLayer(self.startMarker); self.startMarker = null; }
            self.container.querySelector('#rb-startInput').value = '';
          }
        }

        if (self.endLocation) {
          var foundEnd = false;
          for (var ei = 0; ei < self.waypoints.length; ei++) {
            if (self.waypoints[ei].lat === self.endLocation.lat &&
                self.waypoints[ei].lng === self.endLocation.lng) {
              if (ei !== self.waypoints.length - 1) {
                self.endLocation = null;
                if (self.endMarker) { self.map.removeLayer(self.endMarker); self.endMarker = null; }
                self.container.querySelector('#rb-endInput').value = '';
              }
              foundEnd = true;
              break;
            }
          }
          if (!foundEnd) {
            self.endLocation = null;
            if (self.endMarker) { self.map.removeLayer(self.endMarker); self.endMarker = null; }
            self.container.querySelector('#rb-endInput').value = '';
          }
        }

        self._renumberMarkers();
        self._updateWaypointList();
        self._clearSuggestions();
        self._recalcRoute();

        dragSrcIdx = null;
      });
    });
  }

  // ── Segment Mode Toggle ─────────────────────────────────────

  _toggleSegmentMode(idx) {
    var current = this.segmentModes[idx] || 'scenic';
    this.segmentModes[idx] = current === 'scenic' ? 'fast' : 'scenic';
    this._updateWaypointList();
    this._clearSuggestions();
    this._recalcRoute();
  }

  // ── OSRM Routing (per-segment) ──────────────────────────────

  _recalcRoute() {
    this._updateStats();
    if (this._routeDebounce) clearTimeout(this._routeDebounce);
    var self = this;
    this._routeDebounce = setTimeout(function () { self._fetchRoute(); }, 400);
  }

  async _fetchRoute() {
    if (this.waypoints.length < 2) {
      this._clearRouteLine();
      this.routeCoords = [];
      this._segmentResults = [];
      this.routeDistance = 0;
      this.routeDuration = 0;
      this._legDistances = [];
      this._legDurations = [];
      this._updateStats();
      this._splitDays();
      this._updateWaypointList();
      return;
    }

    if (this._isFetching) return;
    this._isFetching = true;

    var loading = this.container.querySelector('#rb-loading');
    loading.classList.add('active');

    var segResults = [];
    var totalDist = 0;
    var totalDur = 0;
    var legDistances = [];
    var legDurations = [];

    try {
      for (var i = 0; i < this.waypoints.length - 1; i++) {
        var from = this.waypoints[i];
        var to = this.waypoints[i + 1];
        var mode = this.segmentModes[i] || 'scenic';

        // Rate limiting
        await this._rateLimitOSRM();

        var coordsStr = from.lng.toFixed(6) + ',' + from.lat.toFixed(6) + ';' +
          to.lng.toFixed(6) + ',' + to.lat.toFixed(6);
        var url = 'https://router.project-osrm.org/route/v1/driving/' + coordsStr +
          '?overview=full&geometries=geojson&steps=true&alternatives=true';

        try {
          var resp = await fetch(url);
          if (!resp.ok) throw new Error('OSRM returned ' + resp.status);
          var data = await resp.json();

          if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            var route;
            if (mode === 'fast') {
              // Pick the shortest duration route (fastest / motorway-biased)
              route = data.routes.reduce(function(best, r) {
                return r.duration < best.duration ? r : best;
              }, data.routes[0]);
            } else {
              // Scenic: pick the longest distance route (more likely B-roads)
              // but cap at 1.5x the shortest to avoid absurd detours
              var shortest = data.routes[0];
              var maxDist = shortest.distance * 1.5;
              var scenic = data.routes.filter(function(r) { return r.distance <= maxDist; });
              route = scenic.reduce(function(best, r) {
                return r.distance > best.distance ? r : best;
              }, scenic[0] || shortest);
            }
            var coords = route.geometry.coordinates.map(function (c) { return [c[1], c[0]]; });
            segResults.push({
              coords: coords,
              mode: mode,
              distance: route.distance,
              duration: route.duration
            });
            totalDist += route.distance;
            totalDur += route.duration;
            legDistances.push(route.distance);
            legDurations.push(route.duration);
          } else {
            console.warn('RouteBuilder: OSRM no route for segment ' + i, data);
            // Add a straight line fallback
            segResults.push({
              coords: [[from.lat, from.lng], [to.lat, to.lng]],
              mode: mode,
              distance: this._haversine([from.lat, from.lng], [to.lat, to.lng]),
              duration: 0
            });
            var fallbackDist = this._haversine([from.lat, from.lng], [to.lat, to.lng]);
            totalDist += fallbackDist;
            legDistances.push(fallbackDist);
            legDurations.push(0);
          }
        } catch (err) {
          console.warn('RouteBuilder: OSRM error segment ' + i, err);
          segResults.push({
            coords: [[from.lat, from.lng], [to.lat, to.lng]],
            mode: mode,
            distance: this._haversine([from.lat, from.lng], [to.lat, to.lng]),
            duration: 0
          });
          var fbDist = this._haversine([from.lat, from.lng], [to.lat, to.lng]);
          totalDist += fbDist;
          legDistances.push(fbDist);
          legDurations.push(0);
        }
      }

      this._segmentResults = segResults;
      this.routeCoords = [];
      for (var s = 0; s < segResults.length; s++) {
        if (s === 0) {
          this.routeCoords = this.routeCoords.concat(segResults[s].coords);
        } else {
          // Skip first coord to avoid duplicate at junction
          this.routeCoords = this.routeCoords.concat(segResults[s].coords.slice(1));
        }
      }
      this.routeDistance = totalDist;
      this.routeDuration = totalDur;
      this._legDistances = legDistances;
      this._legDurations = legDurations;

      this._drawRoute();
      this._updateStats();
      this._splitDays();
      this._updateWaypointList();
      this._renderElevation();
    } catch (err) {
      console.warn('RouteBuilder: routing error', err);
    } finally {
      this._isFetching = false;
      loading.classList.remove('active');
    }
  }

  async _rateLimitOSRM() {
    var now = Date.now();
    var elapsed = now - this._osrmLastCall;
    if (elapsed < 500) {
      await new Promise(function (resolve) { setTimeout(resolve, 500 - elapsed); });
    }
    this._osrmLastCall = Date.now();
  }

  // ── Draw Route (per-segment styling) ────────────────────────

  _drawRoute() {
    this._clearRouteLine();
    if (!this._segmentResults || this._segmentResults.length === 0) return;

    // If we have day segments, draw with day colours
    if (this.daySegments.length > 1) {
      this._drawDaySegments();
      return;
    }

    // Draw per-segment with mode styling
    this._dayLines = [];
    for (var i = 0; i < this._segmentResults.length; i++) {
      var seg = this._segmentResults[i];
      var lineOpts;

      if (seg.mode === 'fast') {
        lineOpts = {
          color: '#666',
          weight: 4,
          opacity: 0.8,
          dashArray: '8,6'
        };
      } else {
        lineOpts = {
          color: '#D68A2D',
          weight: 4,
          opacity: 0.85
        };
      }

      var line = L.polyline(seg.coords, lineOpts).addTo(this.map);
      this._dayLines.push(line);
    }
  }

  _clearRouteLine() {
    if (this._dayLines) {
      for (var i = 0; i < this._dayLines.length; i++) {
        this.map.removeLayer(this._dayLines[i]);
      }
      this._dayLines = [];
    }
    this.dayMarkers.forEach(function (m) { this.map.removeLayer(m); }.bind(this));
    this.dayMarkers = [];
  }

  _drawDaySegments() {
    this._clearRouteLine();
    this._dayLines = [];
    var self = this;

    this.daySegments.forEach(function (seg, i) {
      var color = RouteBuilder.DAY_COLORS[i % RouteBuilder.DAY_COLORS.length];

      // Each day segment may span multiple routing segments with different modes
      // We need to draw each sub-segment with appropriate style
      for (var s = 0; s < seg.subSegments.length; s++) {
        var sub = seg.subSegments[s];
        var lineOpts;
        if (sub.mode === 'fast') {
          lineOpts = { color: '#666', weight: 4, opacity: 0.8, dashArray: '8,6' };
        } else {
          lineOpts = { color: color, weight: 4, opacity: 0.85 };
        }
        var line = L.polyline(sub.coords, lineOpts).addTo(self.map);
        self._dayLines.push(line);
      }

      // Day start marker
      if (seg.subSegments.length > 0 && seg.subSegments[0].coords.length > 0) {
        var start = seg.subSegments[0].coords[0];
        var dayIcon = L.divIcon({
          className: '',
          html: '<div class="rb-day-marker" style="background:' + color + '">' + (i + 1) + '</div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        var dm = L.marker(start, { icon: dayIcon, interactive: false }).addTo(self.map);
        self.dayMarkers.push(dm);
      }
    });
  }

  // ── Elevation Profile ────────────────────────────────────────

  async _renderElevation() {
    if (!this.routeCoords || this.routeCoords.length < 2) {
      this._clearElevation();
      return;
    }

    var container = this.container.querySelector('#rb-elevation');
    if (!container) return;

    // Sample up to 100 evenly-spaced points from routeCoords
    var coords = this.routeCoords;
    var maxSamples = 100;
    var step = Math.max(1, Math.floor(coords.length / maxSamples));
    var sampled = [];
    for (var i = 0; i < coords.length; i += step) {
      sampled.push(coords[i]);
    }
    // Always include last point
    var last = coords[coords.length - 1];
    var sampledLast = sampled[sampled.length - 1];
    if (sampledLast[0] !== last[0] || sampledLast[1] !== last[1]) {
      sampled.push(last);
    }
    if (sampled.length > 100) sampled = sampled.slice(0, 100);

    // Build lat/lng lists for API
    var lats = [];
    var lngs = [];
    for (var i = 0; i < sampled.length; i++) {
      lats.push(sampled[i][0].toFixed(4));
      lngs.push(sampled[i][1].toFixed(4));
    }

    try {
      var resp = await fetch('https://api.open-meteo.com/v1/elevation?latitude=' + lats.join(',') + '&longitude=' + lngs.join(','));
      var data = await resp.json();
      if (!data.elevation || data.elevation.length === 0) return;

      // Calculate cumulative distances along sampled points
      var distances = [0];
      var totalDist = 0;
      for (var i = 1; i < sampled.length; i++) {
        totalDist += this._haversine(sampled[i - 1], sampled[i]);
        distances.push(totalDist);
      }

      this._elevationData = {
        elevations: data.elevation,
        distances: distances,
        sampled: sampled,
        totalDist: totalDist
      };

      container.style.display = '';
      this._drawElevationCanvas();

      // Tell Leaflet the map container changed size
      if (this.map) {
        var self = this;
        setTimeout(function () { self.map.invalidateSize(); }, 50);
      }
    } catch (err) {
      console.warn('RouteBuilder: elevation API error', err);
    }
  }

  _drawElevationCanvas() {
    if (!this._elevationData) return;

    var canvas = this.container.querySelector('#rb-elevCanvas');
    var statsEl = this.container.querySelector('#rb-elevStats');
    if (!canvas) return;

    var data = this._elevationData;
    var elevations = data.elevations;
    var distances = data.distances;
    var totalDist = data.totalDist;
    if (totalDist === 0) return;

    // Size canvas to container
    var parentW = canvas.parentElement.clientWidth - 16;
    if (parentW < 100) parentW = 400;
    var dpr = window.devicePixelRatio || 1;
    var w = parentW;
    var h = 120;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Compute stats
    var minElev = elevations[0];
    var maxElev = elevations[0];
    var totalAscent = 0;
    for (var i = 0; i < elevations.length; i++) {
      if (elevations[i] < minElev) minElev = elevations[i];
      if (elevations[i] > maxElev) maxElev = elevations[i];
      if (i > 0 && elevations[i] > elevations[i - 1]) {
        totalAscent += elevations[i] - elevations[i - 1];
      }
    }
    var range = maxElev - minElev;
    if (range < 1) range = 1;

    // Chart area with padding
    var padLeft = 44;
    var padRight = 10;
    var padTop = 14;
    var padBottom = 22;
    var chartW = w - padLeft - padRight;
    var chartH = h - padTop - padBottom;

    ctx.clearRect(0, 0, w, h);

    // Y axis labels and grid lines
    ctx.fillStyle = '#7a8a85';
    ctx.font = '10px -apple-system,BlinkMacSystemFont,sans-serif';
    ctx.textAlign = 'right';
    var ySteps = 4;
    for (var i = 0; i <= ySteps; i++) {
      var val = minElev + (range * i / ySteps);
      var y = padTop + chartH - (chartH * i / ySteps);
      ctx.fillText(Math.round(val) + 'm', padLeft - 4, y + 3);
      ctx.strokeStyle = 'rgba(122,138,133,0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(padLeft + chartW, y);
      ctx.stroke();
    }

    // X axis labels (miles)
    ctx.textAlign = 'center';
    var totalMiles = totalDist / 1609.34;
    var xSteps = Math.min(5, Math.max(1, Math.floor(totalMiles / 20) || 1));
    for (var i = 0; i <= xSteps; i++) {
      var miles = totalMiles * i / xSteps;
      var x = padLeft + (chartW * i / xSteps);
      ctx.fillStyle = '#7a8a85';
      ctx.fillText(Math.round(miles) + ' mi', x, h - 4);
    }

    // Build pixel coordinates for each elevation point
    var points = [];
    for (var i = 0; i < elevations.length; i++) {
      var x = padLeft + (distances[i] / totalDist) * chartW;
      var y = padTop + chartH - ((elevations[i] - minElev) / range) * chartH;
      points.push([x, y]);
    }

    // Gradient fill under line (green at bottom to red at top)
    var gradient = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
    gradient.addColorStop(0, 'rgba(231,76,60,0.35)');
    gradient.addColorStop(0.5, 'rgba(214,138,45,0.25)');
    gradient.addColorStop(1, 'rgba(39,174,96,0.1)');

    ctx.beginPath();
    ctx.moveTo(points[0][0], padTop + chartH);
    for (var i = 0; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.lineTo(points[points.length - 1][0], padTop + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Elevation profile line
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (var i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.strokeStyle = '#D68A2D';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.stroke();

    // Day boundary vertical dotted lines
    if (this.daySegments && this.daySegments.length > 1) {
      var cumDist = 0;
      for (var d = 0; d < this.daySegments.length - 1; d++) {
        cumDist += this.daySegments[d].distance;
        var bx = padLeft + (cumDist / (this.routeDistance || totalDist)) * chartW;
        var color = RouteBuilder.DAY_COLORS[d % RouteBuilder.DAY_COLORS.length];
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bx, padTop);
        ctx.lineTo(bx, padTop + chartH);
        ctx.stroke();
        ctx.setLineDash([]);
        // Day label above boundary
        ctx.fillStyle = color;
        ctx.font = 'bold 9px -apple-system,BlinkMacSystemFont,sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('D' + (d + 1), bx, padTop - 2);
      }
    }

    // Update stats bar below canvas
    if (statsEl) {
      statsEl.innerHTML =
        '<span>\u2191 Max: <b style="color:#D68A2D">' + Math.round(maxElev) + 'm</b> (' + Math.round(maxElev * 3.281) + 'ft)</span>' +
        '<span>\u2193 Min: <b style="color:#D68A2D">' + Math.round(minElev) + 'm</b> (' + Math.round(minElev * 3.281) + 'ft)</span>' +
        '<span>\u2B06 Ascent: <b style="color:#D68A2D">' + Math.round(totalAscent) + 'm</b> (' + Math.round(totalAscent * 3.281) + 'ft)</span>';
    }

    // Store chart geometry for hover interaction
    this._elevChartInfo = {
      padLeft: padLeft, padTop: padTop,
      chartW: chartW, chartH: chartH,
      w: w, h: h,
      points: points, minElev: minElev,
      range: range, totalDist: totalDist
    };

    // Bind hover events once
    if (!this._elevHoverBound) {
      this._elevHoverBound = true;
      var self = this;
      canvas.addEventListener('mousemove', function (e) { self._onElevationHover(e); });
      canvas.addEventListener('mouseleave', function () { self._onElevationLeave(); });
    }
  }

  _onElevationHover(e) {
    var info = this._elevChartInfo;
    if (!info || !this._elevationData) return;

    var canvas = this.container.querySelector('#rb-elevCanvas');
    if (!canvas) return;
    var rect = canvas.getBoundingClientRect();
    var mx = (e.clientX - rect.left) * (info.w / rect.width);

    // Only show crosshair within chart bounds
    if (mx < info.padLeft || mx > info.padLeft + info.chartW) {
      this._onElevationLeave();
      return;
    }

    // Calculate position along route
    var frac = (mx - info.padLeft) / info.chartW;
    var distAtMouse = frac * info.totalDist;

    // Interpolate elevation at this distance
    var data = this._elevationData;
    var elev = data.elevations[data.elevations.length - 1];
    for (var i = 1; i < data.distances.length; i++) {
      if (data.distances[i] >= distAtMouse) {
        var segLen = data.distances[i] - data.distances[i - 1];
        var segFrac = segLen > 0 ? (distAtMouse - data.distances[i - 1]) / segLen : 0;
        elev = data.elevations[i - 1] + segFrac * (data.elevations[i] - data.elevations[i - 1]);
        break;
      }
    }
    var cy = info.padTop + info.chartH - ((elev - info.minElev) / info.range) * info.chartH;
    var miles = distAtMouse / 1609.34;

    // Redraw base canvas then overlay crosshair
    this._drawElevationCanvas();
    var dpr = window.devicePixelRatio || 1;
    var ctx = canvas.getContext('2d');
    ctx.save();
    ctx.scale(dpr, dpr);

    // Vertical crosshair
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = 'rgba(244,244,244,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mx, info.padTop);
    ctx.lineTo(mx, info.padTop + info.chartH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Dot at elevation point
    ctx.beginPath();
    ctx.arc(mx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#D68A2D';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Tooltip
    var tooltip = this.container.querySelector('#rb-elevTooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'rb-elevTooltip';
      tooltip.className = 'rb-elevation-tooltip';
      canvas.parentElement.style.position = 'relative';
      canvas.parentElement.appendChild(tooltip);
    }
    tooltip.style.display = '';
    tooltip.innerHTML = '<b>' + Math.round(elev) + 'm</b> (' + Math.round(elev * 3.281) + 'ft) \u00B7 ' + miles.toFixed(1) + ' mi';
    var tipLeft = mx + 12;
    if (tipLeft + 150 > info.w) tipLeft = mx - 150;
    tooltip.style.left = tipLeft + 'px';
    tooltip.style.top = (cy - 20) + 'px';
  }

  _onElevationLeave() {
    var tooltip = this.container.querySelector('#rb-elevTooltip');
    if (tooltip) tooltip.style.display = 'none';
    // Redraw clean canvas without crosshair
    if (this._elevationData) this._drawElevationCanvas();
  }

  _clearElevation() {
    var container = this.container.querySelector('#rb-elevation');
    if (container) container.style.display = 'none';
    this._elevationData = null;
    this._elevChartInfo = null;
    var tooltip = this.container.querySelector('#rb-elevTooltip');
    if (tooltip) tooltip.style.display = 'none';
    // Restore map size
    if (this.map) {
      var self = this;
      setTimeout(function () { self.map.invalidateSize(); }, 50);
    }
  }

  // ── Day Splitting ───────────────────────────────────────────

  _splitDays() {
    if (!this._segmentResults || this._segmentResults.length === 0 || this.routeDistance === 0) {
      this.daySegments = [];
      this._updateDayCards();
      this._checkFuelRange();
      this._calculateCosts();
      this._fetchWeather();
      return;
    }

    var maxMiles = (parseFloat(this.container.querySelector('#rb-maxMiles').value) || 150) * 1609.34;
    var maxHours = (parseFloat(this.container.querySelector('#rb-maxHours').value) || 4) * 3600;

    // Build flat list of coords with cumulative distance/duration from all segments
    var flatCoords = [];
    var cumDist = 0;
    var cumDur = 0;
    for (var i = 0; i < this._segmentResults.length; i++) {
      var seg = this._segmentResults[i];
      var segCoords = seg.coords || [];
      if (segCoords.length === 0) continue;
      var distPerCoord = segCoords.length > 1 ? seg.distance / (segCoords.length - 1) : 0;
      var durPerCoord = segCoords.length > 1 ? seg.duration / (segCoords.length - 1) : 0;
      for (var c = 0; c < segCoords.length; c++) {
        if (c > 0) { cumDist += distPerCoord; cumDur += durPerCoord; }
        flatCoords.push({ coord: segCoords[c], dist: cumDist, dur: cumDur, mode: seg.mode });
      }
    }

    // Split into days enforcing BOTH mile and hour limits,
    // preserving per-segment mode boundaries within each day
    var segments = [];
    var dayStart = 0;
    var dayStartDist = 0;
    var dayStartDur = 0;

    function buildDaySubSegments(from, to) {
      var subs = [];
      var currentMode = flatCoords[from].mode;
      var currentCoords = [flatCoords[from].coord];
      var hasFast = currentMode === 'fast';

      for (var k = from + 1; k < to; k++) {
        if (flatCoords[k].mode !== currentMode) {
          subs.push({ coords: currentCoords, mode: currentMode });
          currentMode = flatCoords[k].mode;
          currentCoords = [currentCoords[currentCoords.length - 1]];
          if (currentMode === 'fast') hasFast = true;
        }
        currentCoords.push(flatCoords[k].coord);
      }
      if (currentCoords.length > 0) subs.push({ coords: currentCoords, mode: currentMode });
      return { subs: subs, hasFast: hasFast };
    }

    for (var j = 1; j < flatCoords.length; j++) {
      var dayDist = flatCoords[j].dist - dayStartDist;
      var dayDur = flatCoords[j].dur - dayStartDur;

      if ((dayDist > maxMiles || dayDur > maxHours) && j > dayStart + 1) {
        var built = buildDaySubSegments(dayStart, j);
        segments.push({
          subSegments: built.subs,
          distance: flatCoords[j - 1].dist - dayStartDist,
          duration: flatCoords[j - 1].dur - dayStartDur,
          hasFast: built.hasFast
        });
        dayStart = j - 1;
        dayStartDist = flatCoords[j - 1].dist;
        dayStartDur = flatCoords[j - 1].dur;
      }
    }

    // Final day
    if (dayStart < flatCoords.length - 1) {
      var lastBuilt = buildDaySubSegments(dayStart, flatCoords.length);
      segments.push({
        subSegments: lastBuilt.subs,
        distance: flatCoords[flatCoords.length - 1].dist - dayStartDist,
        duration: flatCoords[flatCoords.length - 1].dur - dayStartDur,
        hasFast: lastBuilt.hasFast
      });
    }

    this.daySegments = segments;
    this._drawRoute();
    this._updateDayCards();
    this._updateStats();
    this._checkFuelRange();
    this._calculateCosts();
    this._fetchWeather();
    // Redraw elevation canvas to update day boundary lines
    if (this._elevationData) this._drawElevationCanvas();
  }

  // ── Stats & UI Updates ──────────────────────────────────────

  _updateStats() {
    this.container.querySelector('#rb-totalDist').textContent = this._fmtMiles(this.routeDistance);
    this.container.querySelector('#rb-totalTime').textContent = this._fmtTime(this.routeDuration);
    this.container.querySelector('#rb-wpCount').textContent = this.waypoints.length;
    this.container.querySelector('#rb-dayCount').textContent = Math.max(1, this.daySegments.length);
  }

  _updateDayCards() {
    var container = this.container.querySelector('#rb-dayCards');
    if (this.daySegments.length === 0) {
      container.innerHTML = '<p style="font-size:12px;color:#7a8a85">Add waypoints to see day breakdown</p>';
      return;
    }

    var html = '';
    for (var i = 0; i < this.daySegments.length; i++) {
      var seg = this.daySegments[i];
      var color = RouteBuilder.DAY_COLORS[i % RouteBuilder.DAY_COLORS.length];
      var miles = this._fmtMiles(seg.distance);
      var time = this._fmtTime(seg.duration);
      var motorwayNote = seg.hasFast ? ' <span style="color:#999;font-style:italic">(includes motorway)</span>' : '';

      html += '<div class="rb-day-card" style="border-left-color:' + color + '">' +
        '<h4 style="color:' + color + '">Day ' + (i + 1) + '</h4>' +
        '<p>\uD83D\uDCCF ' + miles + ' miles \u00b7 \u23F1\uFE0F ' + time + motorwayNote + '</p>' +
      '</div>';
    }
    container.innerHTML = html;
  }

  _fmtMiles(meters) { return Math.round(meters / 1609.34); }

  _fmtTime(seconds) {
    if (!seconds || seconds <= 0) return '0h';
    var h = Math.floor(seconds / 3600);
    var m = Math.round((seconds % 3600) / 60);
    return h > 0 ? h + 'h ' + m + 'm' : m + 'm';
  }

  // ── Suggest Stops Along Route ───────────────────────────────

  _suggestStops() {
    if (this.routeCoords.length < 2) {
      alert('Add a route first to find nearby stops.');
      return;
    }

    this._clearSuggestions();

    var RANGE_M = 8 * 1609.34; // 8 miles in meters
    var allPOIs = [];
    var types = Object.keys(RouteBuilder.POI_CONFIG);

    for (var t = 0; t < types.length; t++) {
      var type = types[t];
      var cfg = RouteBuilder.POI_CONFIG[type];
      var data = RouteBuilder[cfg.dataKey];
      if (!data) continue;
      for (var p = 0; p < data.length; p++) {
        allPOIs.push({
          lat: data[p].lat,
          lng: data[p].lng,
          name: data[p].name,
          desc: data[p].desc,
          type: type
        });
      }
    }

    // Filter to POIs not already waypoints
    var wpSet = {};
    for (var w = 0; w < this.waypoints.length; w++) {
      wpSet[this.waypoints[w].lat.toFixed(4) + ',' + this.waypoints[w].lng.toFixed(4)] = true;
    }

    var self = this;
    var nearby = [];

    for (var n = 0; n < allPOIs.length; n++) {
      var poi = allPOIs[n];
      var key = poi.lat.toFixed(4) + ',' + poi.lng.toFixed(4);
      if (wpSet[key]) continue;
      var dist = this._distToRoute(poi.lat, poi.lng);
      if (dist <= RANGE_M) {
        nearby.push(poi);
      }
    }

    // Create ghost markers
    for (var g = 0; g < nearby.length; g++) {
      var np = nearby[g];
      var cfg2 = RouteBuilder.POI_CONFIG[np.type];
      var gsz = cfg2.size || 28;
      var ghostIcon = L.divIcon({
        className: '',
        html: '<div class="rb-poi-marker rb-poi-ghost" style="width:' + gsz + 'px;height:' + gsz + 'px;background:' + cfg2.color + '"><i class="fas ' + cfg2.faIcon + '" style="font-size:' + Math.round(gsz * 0.4) + 'px"></i></div>',
        iconSize: [gsz, gsz],
        iconAnchor: [gsz / 2, gsz / 2],
        popupAnchor: [0, -(gsz / 2) - 4]
      });
      var marker = L.marker([np.lat, np.lng], { icon: ghostIcon }).addTo(this.map);
      var popupHtml = '<b>' + this._esc(np.name) + '</b>' +
        '<br><span style="font-size:12px;color:#555">' + this._esc(np.desc) + '</span><br>' +
        '<button class="rb-poi-popup-btn" data-poitype="' + np.type +
        '" data-lat="' + np.lat + '" data-lng="' + np.lng +
        '" data-name="' + this._escAttr(np.name) + '">Add to Route</button>';
      marker.bindPopup(popupHtml, { maxWidth: 280 });
      this.ghostMarkers.push(marker);
    }

    // Update badge
    var badge = this.container.querySelector('#rb-suggestBadge');
    if (nearby.length > 0) {
      badge.innerHTML = '<div class="rb-suggest-badge">\uD83D\uDD0D ' + nearby.length + ' stops found nearby</div>';
    } else {
      badge.innerHTML = '<div class="rb-suggest-badge">No stops found within 8 miles of route</div>';
    }
  }

  _clearSuggestions() {
    for (var i = 0; i < this.ghostMarkers.length; i++) {
      this.map.removeLayer(this.ghostMarkers[i]);
    }
    this.ghostMarkers = [];
    var badge = this.container.querySelector('#rb-suggestBadge');
    if (badge) badge.innerHTML = '';
  }

  _distToRoute(lat, lng) {
    var minDist = Infinity;
    // Sample route coords for performance (max ~500 checks)
    var step = Math.max(1, Math.floor(this.routeCoords.length / 500));
    for (var i = 0; i < this.routeCoords.length; i += step) {
      var d = this._haversine([lat, lng], this.routeCoords[i]);
      if (d < minDist) minDist = d;
    }
    return minDist;
  }

  // ── Reverse Route ───────────────────────────────────────────

  _reverseRoute() {
    if (this.waypoints.length < 2) return;

    this.waypoints.reverse();
    this.waypointMarkers.reverse();
    this.waypointNames.reverse();

    // Swap start and end locations
    var tmpLoc = this.startLocation;
    this.startLocation = this.endLocation;
    this.endLocation = tmpLoc;

    var tmpMarker = this.startMarker;
    this.startMarker = this.endMarker;
    this.endMarker = tmpMarker;

    var tmpInput = this.container.querySelector('#rb-startInput').value;
    this.container.querySelector('#rb-startInput').value = this.container.querySelector('#rb-endInput').value;
    this.container.querySelector('#rb-endInput').value = tmpInput;

    // Reset segment modes
    this.segmentModes = {};

    this._renumberMarkers();
    this._updateWaypointList();
    this._clearSuggestions();
    this._recalcRoute();
  }

  _setAllFastTrack() {
    if (this.waypoints.length < 2) { alert('Add at least 2 waypoints first'); return; }
    var btn = this.container.querySelector('#rb-fastTrackBtn');
    var allFast = true;
    for (var key in this.segmentModes) {
      if (this.segmentModes[key] !== 'fast') { allFast = false; break; }
    }
    if (allFast && Object.keys(this.segmentModes).length > 0) {
      // Toggle back to scenic
      this.segmentModes = {};
      btn.innerHTML = '<i class="fas fa-forward"></i> Fast Track (Motorways)';
      btn.style.background = '';
    } else {
      // Set all segments to fast (motorway routing)
      for (var i = 0; i < this.waypoints.length - 1; i++) {
        this.segmentModes[i] = 'fast';
      }
      btn.innerHTML = '<i class="fas fa-forward"></i> Fast Track ON';
      btn.style.background = 'var(--accent)';
      btn.style.color = '#080c0b';
    }
    this._buildRoute();
  }

  _reverseRoute() {
    if (this.waypoints.length < 2) return;

    this.waypoints.reverse();
    this.waypointNames.reverse();
    this.waypointMarkers.reverse();

    // Swap start and end locations
    var tmpLoc = this.startLocation;
    var tmpMarker = this.startMarker;
    this.startLocation = this.endLocation;
    this.startMarker = this.endMarker;
    this.endLocation = tmpLoc;
    this.endMarker = tmpMarker;

    // Swap input values
    var startInput = this.container.querySelector('#rb-startInput');
    var endInput = this.container.querySelector('#rb-endInput');
    var tmpVal = startInput.value;
    startInput.value = endInput.value;
    endInput.value = tmpVal;

    // Reverse segment modes
    var newModes = {};
    var numSegs = this.waypoints.length - 1;
    var keys = Object.keys(this.segmentModes);
    for (var k = 0; k < keys.length; k++) {
      var oldIdx = parseInt(keys[k]);
      var newIdx = numSegs - 1 - oldIdx;
      if (newIdx >= 0 && newIdx < numSegs) {
        newModes[newIdx] = this.segmentModes[oldIdx];
      }
    }
    this.segmentModes = newModes;

    this._renumberMarkers();
    this._updateWaypointList();
    this._clearSuggestions();
    this._recalcRoute();
  }

  // ── Import GPX ──────────────────────────────────────────────

  _importGPX(file) {
    var self = this;
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var parser = new DOMParser();
        var doc = parser.parseFromString(e.target.result, 'application/xml');

        // Check for parsing errors
        var parseError = doc.querySelector('parsererror');
        if (parseError) {
          alert('Invalid GPX file format.');
          return;
        }

        // Try <wpt> elements first
        var wpts = doc.querySelectorAll('wpt');
        if (wpts.length > 0) {
          self._clearRoute();
          for (var i = 0; i < wpts.length; i++) {
            var lat = parseFloat(wpts[i].getAttribute('lat'));
            var lon = parseFloat(wpts[i].getAttribute('lon'));
            var nameEl = wpts[i].querySelector('name');
            var name = nameEl ? nameEl.textContent.trim() : null;
            if (!isNaN(lat) && !isNaN(lon)) {
              self._addWaypoint(lat, lon, name);
            }
          }
          self._fitToWaypoints();
          return;
        }

        // Try <trkpt> elements
        var trkpts = doc.querySelectorAll('trkpt');
        if (trkpts.length > 0) {
          self._clearRoute();
          // Sample track points — take ~20 evenly spaced
          var maxWpts = 20;
          var step = Math.max(1, Math.floor(trkpts.length / maxWpts));
          for (var j = 0; j < trkpts.length; j += step) {
            var tlat = parseFloat(trkpts[j].getAttribute('lat'));
            var tlon = parseFloat(trkpts[j].getAttribute('lon'));
            if (!isNaN(tlat) && !isNaN(tlon)) {
              self._addWaypoint(tlat, tlon);
            }
          }
          // Always add last point
          var last = trkpts[trkpts.length - 1];
          var llat = parseFloat(last.getAttribute('lat'));
          var llon = parseFloat(last.getAttribute('lon'));
          if (!isNaN(llat) && !isNaN(llon)) {
            var lastKey = llat.toFixed(5) + ',' + llon.toFixed(5);
            var alreadyAdded = false;
            if (self.waypoints.length > 0) {
              var lw = self.waypoints[self.waypoints.length - 1];
              if (lw.lat.toFixed(5) + ',' + lw.lng.toFixed(5) === lastKey) alreadyAdded = true;
            }
            if (!alreadyAdded) self._addWaypoint(llat, llon);
          }
          self._fitToWaypoints();
          return;
        }

        // Try <rtept> elements
        var rtepts = doc.querySelectorAll('rtept');
        if (rtepts.length > 0) {
          self._clearRoute();
          for (var r = 0; r < rtepts.length; r++) {
            var rlat = parseFloat(rtepts[r].getAttribute('lat'));
            var rlon = parseFloat(rtepts[r].getAttribute('lon'));
            var rnameEl = rtepts[r].querySelector('name');
            var rname = rnameEl ? rnameEl.textContent.trim() : null;
            if (!isNaN(rlat) && !isNaN(rlon)) {
              self._addWaypoint(rlat, rlon, rname);
            }
          }
          self._fitToWaypoints();
          return;
        }

        alert('No waypoints or track points found in GPX file.');
      } catch (err) {
        console.warn('RouteBuilder: GPX import error', err);
        alert('Error reading GPX file.');
      }
    };
    reader.readAsText(file);
  }

  _fitToWaypoints() {
    if (this.waypoints.length > 0) {
      var bounds = L.latLngBounds(this.waypoints.map(function (w) { return [w.lat, w.lng]; }));
      this.map.fitBounds(bounds, { padding: [40, 40] });
    }
  }

  // ── Share Route ─────────────────────────────────────────────

  _shareRoute() {
    if (this.waypoints.length === 0) {
      alert('Add waypoints first!');
      return;
    }

    var data = {
      n: this.container.querySelector('#rb-routeName').value.trim() || 'My Route',
      w: this.waypoints.map(function (wp) {
        return [parseFloat(wp.lat.toFixed(5)), parseFloat(wp.lng.toFixed(5))];
      }),
      wn: this.waypointNames,
      sm: this.segmentModes,
      pm: this.container.querySelector('#rb-prefToggle .active').dataset.mode,
      mm: parseFloat(this.container.querySelector('#rb-maxMiles').value) || 150,
      mh: parseFloat(this.container.querySelector('#rb-maxHours').value) || 4
    };

    if (this.startLocation) data.sl = this.startLocation;
    if (this.endLocation) data.el = this.endLocation;

    try {
      var json = JSON.stringify(data);
      var hash = btoa(unescape(encodeURIComponent(json)));
      var url = window.location.href.split('#')[0] + '#route=' + hash;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          alert('Route URL copied to clipboard!');
        }).catch(function () {
          prompt('Copy this route URL:', url);
        });
      } else {
        prompt('Copy this route URL:', url);
      }
    } catch (err) {
      console.warn('RouteBuilder: share error', err);
      alert('Could not generate share URL.');
    }
  }

  _loadFromHash() {
    try {
      var hash = window.location.hash;
      if (!hash || !hash.startsWith('#route=')) return;

      var b64 = hash.substring(7);
      var json = decodeURIComponent(escape(atob(b64)));
      var data = JSON.parse(json);

      if (!data.w || !Array.isArray(data.w) || data.w.length === 0) return;

      // Set route name
      if (data.n) {
        this.container.querySelector('#rb-routeName').value = data.n;
      }

      // Set preferences
      if (data.pm) {
        var self = this;
        this.container.querySelectorAll('#rb-prefToggle button').forEach(function (b) {
          b.classList.toggle('active', b.dataset.mode === data.pm);
        });
        this.container.querySelector('#rb-milesLabel').style.display = data.pm === 'miles' ? '' : 'none';
        this.container.querySelector('#rb-hoursLabel').style.display = data.pm === 'hours' ? '' : 'none';
      }
      if (data.mm) this.container.querySelector('#rb-maxMiles').value = data.mm;
      if (data.mh) this.container.querySelector('#rb-maxHours').value = data.mh;

      // Set segment modes
      if (data.sm) this.segmentModes = data.sm;

      // Set start/end locations
      if (data.sl) {
        this.startLocation = data.sl;
        this.container.querySelector('#rb-startInput').value = data.sl.name || '';
      }
      if (data.el) {
        this.endLocation = data.el;
        this.container.querySelector('#rb-endInput').value = data.el.name || '';
      }

      // Add waypoints
      var waypointNames = data.wn || [];
      for (var i = 0; i < data.w.length; i++) {
        var wp = data.w[i];
        var name = waypointNames[i] || null;
        this._addWaypoint(wp[0], wp[1], name, this.waypoints.length);
      }

      // Place start/end markers
      if (this.startLocation && this.waypoints.length > 0) {
        var sIcon = L.divIcon({
          className: '',
          html: '<div class="rb-wp-marker rb-wp-marker-start" style="font-size:16px">\uD83D\uDFE2</div>',
          iconSize: [28, 28], iconAnchor: [14, 14]
        });
        this.startMarker = L.marker([this.startLocation.lat, this.startLocation.lng], { icon: sIcon }).addTo(this.map);
      }
      if (this.endLocation && this.waypoints.length > 0) {
        var eIcon = L.divIcon({
          className: '',
          html: '<div class="rb-wp-marker rb-wp-marker-end" style="font-size:16px">\uD83D\uDD34</div>',
          iconSize: [28, 28], iconAnchor: [14, 14]
        });
        this.endMarker = L.marker([this.endLocation.lat, this.endLocation.lng], { icon: eIcon }).addTo(this.map);
      }

      this._fitToWaypoints();
      this._renumberMarkers();

      // Clear hash to avoid re-loading
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.href.split('#')[0] + window.location.hash.replace(/^#route=.*/, ''));
      }
    } catch (err) {
      console.warn('RouteBuilder: failed to load from hash', err);
    }
  }

  // ── Route Persistence (localStorage) ────────────────────────

  _saveRoute() {
    var name = this.container.querySelector('#rb-routeName').value.trim() || 'Untitled Route';
    if (this.waypoints.length === 0) { alert('Add some waypoints first!'); return; }

    var prefMode = this.container.querySelector('#rb-prefToggle .active').dataset.mode;
    var route = {
      name: name,
      waypoints: this.waypoints.slice(),
      waypointNames: this.waypointNames.slice(),
      segmentModes: Object.assign({}, this.segmentModes),
      startLocation: this.startLocation,
      endLocation: this.endLocation,
      prefMode: prefMode,
      maxMiles: parseFloat(this.container.querySelector('#rb-maxMiles').value) || 150,
      maxHours: parseFloat(this.container.querySelector('#rb-maxHours').value) || 4,
      savedAt: new Date().toISOString()
    };

    var saved = this._getSavedRoutes();
    var existing = saved.findIndex(function (r) { return r.name === name; });
    if (existing >= 0) saved[existing] = route;
    else saved.push(route);

    localStorage.setItem('rb_routes', JSON.stringify(saved));
    this._loadSavedList();

    // Cloud save if logged in
    var self = this;
    if (typeof VisorUpAuth !== 'undefined' && typeof VisorUpTrips !== 'undefined') {
      VisorUpAuth.getUser().then(function(user) {
        if (!user) { alert('Route "' + name + '" saved locally. Log in to save to your profile!'); return; }
        var totalDist = 0;
        if (self.routeSegments) {
          self.routeSegments.forEach(function(s) { if (s && s.distance) totalDist += s.distance; });
        }
        VisorUpTrips.save({
          id: self._cloudTripId || null,
          name: name,
          waypoints: route.waypoints.map(function(wp, i) {
            return { lat: wp[0], lng: wp[1], name: route.waypointNames[i] || '' };
          }),
          settings: {
            segmentModes: route.segmentModes,
            startLocation: route.startLocation,
            endLocation: route.endLocation,
            prefMode: route.prefMode,
            maxMiles: route.maxMiles,
            maxHours: route.maxHours
          },
          routeStats: {
            distance: Math.round(totalDist),
            waypoints: route.waypoints.length
          }
        }).then(function(saved) {
          self._cloudTripId = saved.id;
          alert('Route "' + name + '" saved to your profile!');
        }).catch(function(err) {
          console.error('Cloud save failed:', err);
          alert('Route saved locally. Cloud save failed: ' + err.message);
        });
      });
    } else {
      alert('Route "' + name + '" saved!');
    }
  }

  _loadRoute(idx) {
    var saved = this._getSavedRoutes();
    if (idx < 0 || idx >= saved.length) return;
    var route = saved[idx];

    this._clearRoute();
    this.container.querySelector('#rb-routeName').value = route.name;

    // Set preferences
    if (route.prefMode) {
      this.container.querySelectorAll('#rb-prefToggle button').forEach(function (b) {
        b.classList.toggle('active', b.dataset.mode === route.prefMode);
      });
      this.container.querySelector('#rb-milesLabel').style.display = route.prefMode === 'miles' ? '' : 'none';
      this.container.querySelector('#rb-hoursLabel').style.display = route.prefMode === 'hours' ? '' : 'none';
    }
    if (route.maxMiles) this.container.querySelector('#rb-maxMiles').value = route.maxMiles;
    if (route.maxHours) this.container.querySelector('#rb-maxHours').value = route.maxHours;

    // Set segment modes
    if (route.segmentModes) this.segmentModes = Object.assign({}, route.segmentModes);

    // Set start/end locations
    if (route.startLocation) {
      this.startLocation = route.startLocation;
      this.container.querySelector('#rb-startInput').value = route.startLocation.name || '';
    }
    if (route.endLocation) {
      this.endLocation = route.endLocation;
      this.container.querySelector('#rb-endInput').value = route.endLocation.name || '';
    }

    // Add waypoints
    var names = route.waypointNames || [];
    for (var i = 0; i < route.waypoints.length; i++) {
      var wp = route.waypoints[i];
      var nm = names[i] || null;
      this._addWaypoint(wp.lat, wp.lng, nm, this.waypoints.length);
    }

    // Place start/end markers
    if (this.startLocation && this.waypoints.length > 0) {
      var sIcon = L.divIcon({
        className: '',
        html: '<div class="rb-wp-marker rb-wp-marker-start" style="font-size:16px">\uD83D\uDFE2</div>',
        iconSize: [28, 28], iconAnchor: [14, 14]
      });
      this.startMarker = L.marker([this.startLocation.lat, this.startLocation.lng], { icon: sIcon }).addTo(this.map);
    }
    if (this.endLocation && this.waypoints.length > 0) {
      var eIcon = L.divIcon({
        className: '',
        html: '<div class="rb-wp-marker rb-wp-marker-end" style="font-size:16px">\uD83D\uDD34</div>',
        iconSize: [28, 28], iconAnchor: [14, 14]
      });
      this.endMarker = L.marker([this.endLocation.lat, this.endLocation.lng], { icon: eIcon }).addTo(this.map);
    }

    this._renumberMarkers();

    // Fit map
    this._fitToWaypoints();
  }

  _deleteRoute(idx) {
    var saved = this._getSavedRoutes();
    if (idx < 0 || idx >= saved.length) return;
    saved.splice(idx, 1);
    localStorage.setItem('rb_routes', JSON.stringify(saved));
    this._loadSavedList();
  }

  _getSavedRoutes() {
    try { return JSON.parse(localStorage.getItem('rb_routes') || '[]'); }
    catch (e) { return []; }
  }

  _loadSavedList() {
    var container = this.container.querySelector('#rb-savedList');
    var saved = this._getSavedRoutes();
    if (saved.length === 0) {
      container.innerHTML = '<p style="font-size:12px;color:#7a8a85">No saved routes</p>';
      return;
    }

    var self = this;
    var html = '';
    for (var i = 0; i < saved.length; i++) {
      var route = saved[i];
      var date = route.savedAt ? new Date(route.savedAt).toLocaleDateString() : '';
      var wpCount = route.waypoints ? route.waypoints.length : 0;
      html += '<div class="rb-saved-item">' +
        '<span>' + this._esc(route.name) + ' <small style="color:#7a8a85">(' + wpCount + ' pts' + (date ? ', ' + date : '') + ')</small></span>' +
        '<div class="rb-saved-btns">' +
          '<button title="Load" data-action="load" data-idx="' + i + '">\uD83D\uDCC2</button>' +
          '<button title="Delete" data-action="del" data-idx="' + i + '">\uD83D\uDDD1\uFE0F</button>' +
        '</div>' +
      '</div>';
    }
    container.innerHTML = html;

    container.querySelectorAll('button[data-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.dataset.action;
        var idx = parseInt(btn.dataset.idx);
        if (action === 'load') self._loadRoute(idx);
        else if (action === 'del') self._deleteRoute(idx);
      });
    });
  }

  // ── Clear Route ─────────────────────────────────────────────

  _clearRoute() {
    for (var i = 0; i < this.waypointMarkers.length; i++) {
      this.map.removeLayer(this.waypointMarkers[i]);
    }
    this.waypointMarkers = [];
    this.waypoints = [];
    this.waypointNames = [];
    this.segmentModes = {};

    this._clearRouteLine();
    this._clearSuggestions();

    // Clear fuel gap lines
    for (var fg = 0; fg < this._fuelGapLines.length; fg++) {
      this.map.removeLayer(this._fuelGapLines[fg]);
    }
    this._fuelGapLines = [];

    this.routeCoords = [];
    this._segmentResults = [];
    this.routeDistance = 0;
    this.routeDuration = 0;
    this._legDistances = [];
    this._legDurations = [];
    this.daySegments = [];

    // Clear start/end
    if (this.startMarker) { this.map.removeLayer(this.startMarker); this.startMarker = null; }
    if (this.endMarker) { this.map.removeLayer(this.endMarker); this.endMarker = null; }
    this.startLocation = null;
    this.endLocation = null;
    this.container.querySelector('#rb-startInput').value = '';
    this.container.querySelector('#rb-endInput').value = '';

    this._updateStats();
    this._updateDayCards();
    this._updateWaypointList();
    this._clearElevation();
    this.container.querySelector('#rb-overlay').classList.remove('hidden');

    // Clear weather, fuel warnings, and cost panels
    var fuelWarn = this.container.querySelector('#rb-fuelWarnings');
    if (fuelWarn) fuelWarn.innerHTML = '';
    var weatherBar = this.container.querySelector('#rb-weatherBar');
    if (weatherBar) weatherBar.innerHTML = '<p style="font-size:12px;color:#7a8a85">Add waypoints to see forecast</p>';
    var costPanel = this.container.querySelector('#rb-costPanel');
    if (costPanel) costPanel.innerHTML = '<p style="font-size:12px;color:#7a8a85">Add a route to see costs</p>';
    this._weatherCache = null;
    this._weatherCacheTime = 0;
  }

  // ── Nav App Export ─────────────────────────────────────────

  _openGoogleMaps() {
    if (this.waypoints.length < 2) { alert('Add at least 2 waypoints first.'); return; }
    var origin = this.waypoints[0].lat + ',' + this.waypoints[0].lng;
    var dest = this.waypoints[this.waypoints.length - 1].lat + ',' + this.waypoints[this.waypoints.length - 1].lng;
    var mid = this.waypoints.slice(1, -1);
    if (mid.length > 23) mid = mid.slice(0, 23);
    var waypoints = mid.map(function(w) { return w.lat + ',' + w.lng; }).join('|');
    var url = 'https://www.google.com/maps/dir/?api=1&origin=' + origin + '&destination=' + dest;
    if (waypoints) url += '&waypoints=' + waypoints;
    url += '&travelmode=driving';
    window.open(url, '_blank');
  }

  _openAppleMaps() {
    if (this.waypoints.length < 2) { alert('Add at least 2 waypoints first.'); return; }
    var coords = this.waypoints.map(function(w) { return w.lat + ',' + w.lng; });
    var url = 'https://maps.apple.com/?dirflg=d&saddr=' + coords[0] + '&daddr=' + coords.slice(1).join('+to:');
    window.open(url, '_blank');
  }

  _openWaze() {
    if (this.waypoints.length < 1) { alert('Add at least 1 waypoint first.'); return; }
    var dest = this.waypoints[this.waypoints.length - 1];
    var url = 'https://waze.com/ul?ll=' + dest.lat + ',' + dest.lng + '&navigate=yes';
    window.open(url, '_blank');
  }

  _openKurviger() {
    if (this.waypoints.length < 2) { alert('Add at least 2 waypoints first.'); return; }
    var params = this.waypoints.map(function(w) { return 'point=' + w.lat + ',' + w.lng; }).join('&');
    var url = 'https://kurviger.de/en?plan=route&' + params + '&vehicle=motorcycle';
    window.open(url, '_blank');
  }

  _showQRCode() {
    if (this.waypoints.length < 2) { alert('Add at least 2 waypoints first.'); return; }
    var display = this.container.querySelector('#rb-qrDisplay');
    if (display.style.display !== 'none') { display.style.display = 'none'; return; }

    var origin = this.waypoints[0].lat + ',' + this.waypoints[0].lng;
    var dest = this.waypoints[this.waypoints.length - 1].lat + ',' + this.waypoints[this.waypoints.length - 1].lng;
    var mid = this.waypoints.slice(1, -1).slice(0, 23);
    var waypoints = mid.map(function(w) { return w.lat + ',' + w.lng; }).join('|');
    var url = 'https://www.google.com/maps/dir/?api=1&origin=' + origin + '&destination=' + dest;
    if (waypoints) url += '&waypoints=' + waypoints;
    url += '&travelmode=driving';

    var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(url);
    display.innerHTML = '<img src="' + qrUrl + '" alt="QR Code" style="border-radius:8px;border:2px solid #333">' +
      '<p style="font-size:11px;color:#7a8a85;margin-top:8px">Scan with your phone to open in Google Maps</p>';
    display.style.display = '';
  }

  // ── GPX Export ──────────────────────────────────────────────

  _exportGPX() {
    if (this.routeCoords.length < 2) {
      alert('No route to export \u2014 add at least 2 waypoints.');
      return;
    }

    var name = this.container.querySelector('#rb-routeName').value.trim() || 'Custom Route';
    var totalMiles = this._fmtMiles(this.routeDistance);

    var gpx = '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<gpx version="1.1" creator="VisorUp RouteBuilder"\n' +
      '  xmlns="http://www.topografix.com/GPX/1/1"\n' +
      '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
      '  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n' +
      '  <metadata>\n' +
      '    <name>' + this._esc(name) + '</name>\n' +
      '    <desc>Custom motorcycle route \u2014 ' + totalMiles + ' miles</desc>\n' +
      '    <time>' + new Date().toISOString() + '</time>\n' +
      '  </metadata>\n';

    // Waypoints with names
    for (var i = 0; i < this.waypoints.length; i++) {
      var wp = this.waypoints[i];
      var wpName = this.waypointNames[i] || ('Waypoint ' + (i + 1));
      gpx += '  <wpt lat="' + wp.lat.toFixed(7) + '" lon="' + wp.lng.toFixed(7) + '">\n' +
        '    <name>' + this._esc(wpName) + '</name>\n' +
        '    <type>waypoint</type>\n' +
        '  </wpt>\n';
    }

    // Tracks — one per day segment or single track
    if (this.daySegments.length > 1) {
      for (var d = 0; d < this.daySegments.length; d++) {
        var seg = this.daySegments[d];
        gpx += '  <trk>\n    <name>' + this._esc('Day ' + (d + 1)) + '</name>\n    <trkseg>\n';
        for (var s = 0; s < seg.subSegments.length; s++) {
          var sub = seg.subSegments[s];
          for (var c = 0; c < sub.coords.length; c++) {
            gpx += '      <trkpt lat="' + sub.coords[c][0].toFixed(7) + '" lon="' + sub.coords[c][1].toFixed(7) + '"></trkpt>\n';
          }
        }
        gpx += '    </trkseg>\n  </trk>\n';
      }
    } else {
      gpx += '  <trk>\n    <name>' + this._esc(name) + '</name>\n    <trkseg>\n';
      for (var ci = 0; ci < this.routeCoords.length; ci++) {
        gpx += '      <trkpt lat="' + this.routeCoords[ci][0].toFixed(7) + '" lon="' + this.routeCoords[ci][1].toFixed(7) + '"></trkpt>\n';
      }
      gpx += '    </trkseg>\n  </trk>\n';
    }

    gpx += '</gpx>';

    // Download
    var blob = new Blob([gpx], { type: 'application/gpx+xml' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.gpx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── Weather Overlay ─────────────────────────────────────────

  async _fetchWeather() {
    var weatherBar = this.container.querySelector('#rb-weatherBar');
    if (!weatherBar) return;

    if (this.waypoints.length === 0 || this.routeCoords.length < 2) {
      weatherBar.innerHTML = '<p style="font-size:12px;color:#7a8a85">Add waypoints to see forecast</p>';
      return;
    }

    // Cache: reuse if less than 30 minutes old
    var now = Date.now();
    if (this._weatherCache && (now - this._weatherCacheTime) < 30 * 60 * 1000) {
      this._renderWeather(this._weatherCache);
      return;
    }

    // Use midpoint of waypoints for forecast location
    var midIdx = Math.floor(this.waypoints.length / 2);
    var wp = this.waypoints[midIdx];
    var lat = wp.lat.toFixed(2);
    var lng = wp.lng.toFixed(2);

    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat +
      '&longitude=' + lng +
      '&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max' +
      '&timezone=Europe/London&forecast_days=7';

    try {
      weatherBar.innerHTML = '<p style="font-size:12px;color:#D68A2D">Loading forecast\u2026</p>';
      var resp = await fetch(url);
      if (!resp.ok) throw new Error('Weather API returned ' + resp.status);
      var data = await resp.json();

      if (data.daily) {
        this._weatherCache = data.daily;
        this._weatherCacheTime = Date.now();
        this._renderWeather(data.daily);
      }
    } catch (err) {
      console.warn('RouteBuilder: weather fetch error', err);
      weatherBar.innerHTML = '<p style="font-size:12px;color:#ff7675">Weather unavailable</p>';
    }
  }

  _renderWeather(daily) {
    var weatherBar = this.container.querySelector('#rb-weatherBar');
    if (!weatherBar || !daily || !daily.time) return;

    var html = '';
    for (var i = 0; i < daily.time.length; i++) {
      var date = daily.time[i];
      var dayLabel = new Date(date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short' });
      var code = daily.weathercode[i];
      var icon = this._weatherIcon(code);
      var hi = Math.round(daily.temperature_2m_max[i]);
      var lo = Math.round(daily.temperature_2m_min[i]);
      var wind = Math.round(daily.windspeed_10m_max[i] * 0.621371);
      var windWarn = wind > 30 ? '<span class="rb-wind-warn">\uD83D\uDCA8 ' + wind + 'mph</span>' : '';

      html += '<div class="rb-weather-day">' +
        '<div class="rb-weather-label">' + dayLabel + '</div>' +
        '<div class="rb-weather-icon">' + icon + '</div>' +
        '<div class="rb-weather-temp">' + hi + '\u00B0/' + lo + '\u00B0</div>' +
        windWarn +
      '</div>';
    }
    weatherBar.innerHTML = html;
  }

  _weatherIcon(code) {
    if (code <= 1) return '\u2600\uFE0F';
    if (code <= 3) return '\u26C5';
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return '\uD83C\uDF27\uFE0F';
    if (code >= 95 && code <= 99) return '\u26C8\uFE0F';
    if (code >= 71 && code <= 77) return '\uD83C\uDF28\uFE0F';
    return '\u26C5';
  }

  // ── Fuel Range Warnings ─────────────────────────────────────

  _checkFuelRange() {
    var warningsDiv = this.container.querySelector('#rb-fuelWarnings');
    if (!warningsDiv) return;

    // Clear old fuel gap markers
    for (var f = 0; f < this._fuelGapLines.length; f++) {
      this.map.removeLayer(this._fuelGapLines[f]);
    }
    this._fuelGapLines = [];

    if (this.waypoints.length < 2 || this.routeCoords.length < 2 || this.routeDistance === 0) {
      warningsDiv.innerHTML = '';
      return;
    }

    var tankRange = parseFloat(this.container.querySelector('#rbFuelRange').value) || 120;
    var fuelStations = (typeof UK_FUEL_STATIONS !== 'undefined' && UK_FUEL_STATIONS.length > 0)
      ? UK_FUEL_STATIONS
      : RouteBuilder.FUEL;
    if (!fuelStations || fuelStations.length === 0) {
      warningsDiv.innerHTML = '';
      return;
    }

    // Find fuel stations near the route (within 5 miles)
    var NEAR_RANGE = 5 * 1609.34;
    var routeStations = [];

    for (var s = 0; s < fuelStations.length; s++) {
      var station = fuelStations[s];
      var minDist = Infinity;
      var bestRouteIdx = 0;

      var step = Math.max(1, Math.floor(this.routeCoords.length / 300));
      for (var r = 0; r < this.routeCoords.length; r += step) {
        var d = this._haversine([station.lat, station.lng], this.routeCoords[r]);
        if (d < minDist) {
          minDist = d;
          bestRouteIdx = r;
        }
      }

      if (minDist <= NEAR_RANGE) {
        routeStations.push({
          name: station.name,
          lat: station.lat,
          lng: station.lng,
          routeIdx: bestRouteIdx,
          routeMiles: this._routeDistBetween(0, bestRouteIdx) / 1609.34
        });
      }
    }

    routeStations.sort(function (a, b) { return a.routeIdx - b.routeIdx; });

    // Greedy selection: pick the recommended fuel stops based on tank range
    var recommended = [];
    var lastFuelMile = 0;
    for (var i = 0; i < routeStations.length; i++) {
      var distSinceFuel = routeStations[i].routeMiles - lastFuelMile;
      // Pick this station if we'd run out before the next one (or it's the last near one)
      var nextStationMiles = (i + 1 < routeStations.length) ? routeStations[i + 1].routeMiles : this.routeDistance / 1609.34;
      var distToNext = nextStationMiles - lastFuelMile;
      if (distToNext > tankRange || distSinceFuel > tankRange * 0.6) {
        recommended.push(routeStations[i]);
        lastFuelMile = routeStations[i].routeMiles;
      }
    }

    // Check for any gaps that still exceed tank range
    var warnings = [];
    var checkLast = 0;
    for (var r2 = 0; r2 < recommended.length; r2++) {
      var gap = recommended[r2].routeMiles - checkLast;
      if (gap > tankRange) {
        warnings.push({ miles: Math.round(gap), station: recommended[r2].name });
      }
      checkLast = recommended[r2].routeMiles;
    }
    var finalGap = (this.routeDistance / 1609.34) - checkLast;
    if (finalGap > tankRange) {
      warnings.push({ miles: Math.round(finalGap), station: 'route end' });
    }

    // Store recommended stops for display in waypoint list
    this._recommendedFuelStops = recommended;

    // Build HTML
    var html = '';
    if (recommended.length > 0) {
      html += '<div class="rb-fuel-stops" style="padding:10px 14px;background:#152220;border:1px solid rgba(253,203,110,0.2);border-radius:8px;margin-bottom:8px;font-size:12px;">';
      html += '<div style="font-weight:700;color:#fdcb6e;margin-bottom:8px;font-size:13px;"><i class="fas fa-gas-pump"></i> Recommended Fuel Stops</div>';
      for (var rs = 0; rs < recommended.length; rs++) {
        var st = recommended[rs];
        html += '<div style="padding:4px 0;color:#c8d6d0;display:flex;justify-content:space-between;align-items:center;">' +
          '<span><i class="fas fa-gas-pump" style="color:#fdcb6e;margin-right:6px;font-size:10px;"></i>' + this._esc(st.name) + '</span>' +
          '<span style="color:#7a8a85;white-space:nowrap;margin-left:8px;">' + Math.round(st.routeMiles) + ' mi</span></div>';

        // Add prominent fuel stop marker on map
        var fuelIcon = L.divIcon({
          className: '',
          html: '<div class="rb-fuel-marker"><i class="fas fa-gas-pump"></i></div>',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -20]
        });
        var fuelMarker = L.marker([st.lat, st.lng], { icon: fuelIcon, zIndexOffset: 500 }).addTo(this.map);
        fuelMarker.bindPopup(
          '<div style="font-size:13px;"><b><i class="fas fa-gas-pump" style="color:#fdcb6e"></i> ' + this._esc(st.name) + '</b>' +
          '<div style="color:#aaa;font-size:11px;margin-top:4px;">Recommended fuel stop at ~' + Math.round(st.routeMiles) + ' miles along your route</div></div>'
        );
        this._fuelGapLines.push(fuelMarker);
      }
      html += '</div>';
    }

    if (warnings.length > 0) {
      html += '<div style="padding:8px 12px;background:#2d1a1a;border:1px solid rgba(255,75,75,0.2);border-radius:6px;margin-bottom:8px;font-size:11px;color:#ff6b6b;">';
      for (var w = 0; w < warnings.length; w++) {
        html += '<div style="padding:2px 0;"><i class="fas fa-exclamation-triangle"></i> ' + warnings[w].miles + ' mile gap before ' + this._esc(warnings[w].station) + ' — consider extra fuel</div>';
      }
      html += '</div>';
    }

    warningsDiv.innerHTML = html;
  }

  _routeDistBetween(startIdx, endIdx) {
    var dist = 0;
    for (var i = startIdx; i < endIdx && i < this.routeCoords.length - 1; i++) {
      dist += this._haversine(this.routeCoords[i], this.routeCoords[i + 1]);
    }
    return dist;
  }

  // ── Cost Estimator ──────────────────────────────────────────

  _calculateCosts() {
    var panel = this.container.querySelector('#rb-costPanel');
    if (!panel) return;

    if (this.routeDistance === 0) {
      panel.innerHTML = '<p style="font-size:12px;color:#7a8a85">Add a route to see costs</p>';
      return;
    }

    var mpg = parseFloat(this.container.querySelector('#rbMPG').value) || 45;
    var pricePerLitre = parseFloat(this.container.querySelector('#rbFuelPrice').value) || 1.45;
    var totalMiles = this.routeDistance / 1609.34;
    var gallons = totalMiles / mpg;
    var litres = gallons * 4.546;
    var totalCost = litres * pricePerLitre;
    var numDays = Math.max(1, this.daySegments.length);
    var avgPerDay = totalCost / numDays;

    var html = '<div class="rb-cost-display">' +
      '<div class="rb-cost-title">Route Cost Estimate</div>' +
      '<div class="rb-cost-divider">\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501</div>' +
      '<div class="rb-cost-row"><span>Fuel</span><span>\u00A3' + totalCost.toFixed(2) + '</span></div>' +
      '<div class="rb-cost-detail">(' + gallons.toFixed(1) + ' gal @ \u00A3' + pricePerLitre.toFixed(2) + '/L)</div>' +
      '<div class="rb-cost-row"><span>Avg per day</span><span>\u00A3' + avgPerDay.toFixed(2) + '</span></div>';

    if (this.daySegments.length > 1) {
      html += '<div class="rb-cost-days">';
      for (var i = 0; i < this.daySegments.length; i++) {
        var dayMiles = this.daySegments[i].distance / 1609.34;
        var dayGallons = dayMiles / mpg;
        var dayLitres = dayGallons * 4.546;
        var dayCost = dayLitres * pricePerLitre;
        var color = RouteBuilder.DAY_COLORS[i % RouteBuilder.DAY_COLORS.length];
        html += '<div class="rb-cost-day-row"><span style="color:' + color + '">Day ' + (i + 1) + '</span><span>\u00A3' + dayCost.toFixed(2) + '</span></div>';
      }
      html += '</div>';
    }

    html += '</div>';
    panel.innerHTML = html;
  }

  // ── Utility Helpers ─────────────────────────────────────────

  _haversine(a, b) {
    var R = 6371000;
    var dLat = (b[0] - a[0]) * Math.PI / 180;
    var dLng = (b[1] - a[1]) * Math.PI / 180;
    var sLat = Math.sin(dLat / 2);
    var sLng = Math.sin(dLng / 2);
    var h = sLat * sLat + Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) * sLng * sLng;
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }

  _esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  _escAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
}

// ── Global Export ──
window.RouteBuilder = RouteBuilder;
