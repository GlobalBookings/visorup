const WELSH_MOUNTAIN_PASSES = {
  slug: 'welsh-mountain-passes',
  name: 'Welsh Mountain Passes',
  tagline: 'Five days threading through the dragon\'s spine — Snowdonia to the Beacons on Wales\'s finest tarmac',
  duration: '5 days',
  distance: '~480 miles',
  startLocation: 'Chester',
  endLocation: 'Abergavenny',
  difficulty: 'Moderate-Challenging',
  bestTime: 'April to October',
  description: 'Wales packs more world-class motorcycle roads per square mile than almost anywhere in Europe. This five-day route stitches together the legendary passes of Snowdonia, the remote mountain roads around Cader Idris, the haunting reservoirs of the Elan Valley, and the sweeping ridgelines of the Brecon Beacons. Expect tight hairpins, open moorland blasts, single-track adventures, and views that\'ll have you pulling over every ten minutes. The roads are quiet midweek, the scenery is relentless, and the cafés serve proper tea.',
  highlights: [
    'Llanberis Pass — the most dramatic mountain road in Wales',
    'A5 through Snowdonia — Telford\'s masterpiece of road engineering',
    'Ogwen Valley and Tryfan — raw volcanic landscape at its finest',
    'Devil\'s Bridge waterfalls and the Rheidol Gorge',
    'Elan Valley — the lakeland of Wales with deserted dam roads',
    'Abergwesyn mountain road — the wildest single-track in Britain',
    'Gospel Pass — highest road in the Black Mountains',
    'Pen-y-Pass — the roof of Snowdonia',
    'Cader Idris — ancient mountain with mythical legends',
    'Black Mountain passes through the western Brecon Beacons'
  ],

  dayColors: [
    '#FF6B6B', // Day 1 - coral
    '#4D96FF', // Day 2 - blue
    '#6BCB77', // Day 3 - green
    '#FFA502', // Day 4 - orange
    '#9B59B6'  // Day 5 - purple
  ],

  markerColors: {
    landmark: '#9b59b6',
    viewpoint: '#e8713a',
    waterfall: '#00cec9',
    road: '#e74c3c',
    camp: '#27ae60',
    fuel: '#fdcb6e',
    castle: '#6c5ce7',
    pub: '#c0392b',
    village: '#2d98da',
    lake: '#0984e3',
    bridge: '#2d98da'
  },

  days: [
    // =====================================================
    // DAY 1 — Chester to Snowdonia
    // =====================================================
    {
      day: 1,
      title: 'Chester to Snowdonia',
      distance: '~95 miles',
      duration: '~3-4 hrs riding',
      summary: 'Ease into Wales along the historic A5 — Telford\'s great road into the mountains. From Chester\'s Roman walls you\'ll ride through the Dee Valley, past Llangollen, and deep into Snowdonia via Betws-y-Coed. The road climbs steadily and the scenery ramps up with every mile. Finish high at Pen-y-Pass with the mountains closing in around you.',
      center: [53.05, -3.50],
      zoom: 10,
      region: 'wales-north',
      waypoints: [
        [53.190, -2.891], [53.140, -2.960], [53.080, -3.050],
        [53.010, -3.140], [52.970, -3.170], [52.980, -3.380],
        [53.020, -3.560], [53.060, -3.700], [53.092, -3.801],
        [53.080, -3.825], [53.088, -3.920], [53.063, -4.024]
      ],
      stops: [
        {
          name: 'Chester City Walls',
          type: 'landmark',
          lat: 53.190,
          lng: -2.891,
          description: 'The most complete Roman city walls in Britain and your starting point. Grab a coffee in the Rows — medieval two-tiered shopping galleries — and fill up before hitting the A5 west. Chester is the last big town for a while.',
          rating: 4
        },
        {
          name: 'Pontcysyllte Aqueduct',
          type: 'landmark',
          lat: 52.970,
          lng: -3.088,
          description: 'UNESCO World Heritage Site. Telford\'s 1,007ft canal aqueduct soars 126ft above the Dee Valley. You can walk across the towpath — it\'s barely 3ft wide with a sheer drop on one side. Not for the faint-hearted. The view from the road below is equally staggering.',
          rating: 5
        },
        {
          name: 'Llangollen',
          type: 'village',
          lat: 52.969,
          lng: -3.170,
          description: 'Pretty riverside town in the Dee Valley. Grab a bacon roll at the Corn Mill on the river, or stretch your legs along the canal towpath. Good fuel stop before the mountains.',
          rating: 4
        },
        {
          name: 'Horseshoe Pass (A542)',
          type: 'road',
          lat: 53.020,
          lng: -3.200,
          description: 'A cracking detour if you have time — tight hairpins climbing 1,367ft with panoramic views across the Vale of Clwyd. One of the most popular biker roads in North Wales. The surface is generally good but watch for gravel on the bends.',
          rating: 5
        },
        {
          name: 'Betws-y-Coed',
          type: 'village',
          lat: 53.092,
          lng: -3.801,
          description: 'The gateway to Snowdonia. A charming stone village at the confluence of three rivers, surrounded by ancient Gwydyr Forest. Packed with outdoor shops, cafés, and bikers on any decent weekend. Top up fuel here — it\'s the last reliable station before the high passes.',
          rating: 4
        },
        {
          name: 'Swallow Falls (Rhaeadr Ewynnol)',
          type: 'waterfall',
          lat: 53.078,
          lng: -3.825,
          description: 'Wales\'s most visited waterfall, and for good reason. The River Llugwy thunders through a rocky gorge in a series of cascades. A short walk from the roadside car park — you\'ll hear it before you see it. Small entry fee. Best after rain when the falls are in full roar.',
          rating: 4
        },
        {
          name: 'Capel Curig',
          type: 'viewpoint',
          lat: 53.088,
          lng: -3.920,
          description: 'Tiny hamlet at the junction of the A5 and A4086. The view of the Snowdon Horseshoe from Plas y Brenin is one of the finest mountain panoramas in Britain. Cafés and a climbing shop if you need supplies.',
          rating: 4
        },
        {
          name: 'Pen-y-Pass',
          type: 'viewpoint',
          lat: 53.063,
          lng: -4.024,
          description: 'The highest point on the A4086 at 1,170ft, sitting in the col between Snowdon and the Glyderau. The car park here is the main starting point for the Pyg Track and Miners\' Track up Snowdon. Arrive early or late to avoid the crowds. The views down Nant Gwynant from here are extraordinary.',
          rating: 5
        },
        {
          name: 'Llyn Gwynant Campsite',
          type: 'camp',
          lat: 53.028,
          lng: -4.012,
          description: 'Idyllic lakeside campsite in Nant Gwynant valley with Snowdon looming above. Basic but beautiful — flat grassy pitches right by the water. Hot showers, small shop. Book ahead in summer. One of the best wild-feeling campsites in Wales.',
          rating: 5
        }
      ],
      roads: [
        {
          name: 'A5 Chester to Betws-y-Coed',
          rating: 4,
          description: 'Thomas Telford\'s masterwork — a beautifully engineered road that follows the Dee Valley and climbs gently into the mountains. Sweeping bends, good surface, and increasingly dramatic scenery. The stretch past Capel Curig is world-class.'
        },
        {
          name: 'A4086 Capel Curig to Pen-y-Pass',
          rating: 5,
          description: 'A short but stunning mountain road that climbs into the heart of Snowdonia. Tight bends with sheer drops and mountain views that\'ll stop you mid-corner. Watch for walkers crossing to the trailheads.'
        }
      ],
      tips: 'Fill up in Chester or Betws-y-Coed. Fuel is scarce in the high passes. The A5 can be busy with caravans in summer — be patient and pick your overtakes carefully. Pen-y-Pass car park fills by 8am in peak season; arrive early or late.'
    },

    // =====================================================
    // DAY 2 — Snowdonia Loop
    // =====================================================
    {
      day: 2,
      title: 'Snowdonia Loop',
      distance: '~75 miles',
      duration: '~3-4 hrs riding',
      summary: 'A day to savour every mile. Loop through the greatest concentration of mountain passes in Wales — Llanberis Pass, the Ogwen Valley, Nant Gwynant, and Beddgelert. These are short roads but every one is a masterpiece. Take your time, stop often, and let the mountains sink in.',
      center: [53.07, -4.05],
      zoom: 11,
      region: 'wales-north',
      waypoints: [
        [53.028, -4.012], [53.063, -4.024], [53.080, -4.070],
        [53.117, -4.130], [53.120, -4.020], [53.113, -3.992],
        [53.092, -3.960], [53.063, -4.024], [53.030, -4.020],
        [53.011, -4.100], [52.990, -4.095], [53.011, -4.100],
        [53.028, -4.012]
      ],
      stops: [
        {
          name: 'Llanberis Pass (A4086)',
          type: 'road',
          lat: 53.080,
          lng: -4.070,
          description: 'The most spectacular mountain pass in Wales. The road clings to the side of the valley with sheer rock walls on both sides and the old slate quarries above. Tight, technical, and utterly breathtaking. Take it slow — there are walkers, sheep, and oncoming traffic to contend with. Every biker in Britain should ride this at least once.',
          rating: 5
        },
        {
          name: 'Llanberis',
          type: 'village',
          lat: 53.117,
          lng: -4.130,
          description: 'Former slate-quarrying town at the foot of Snowdon. The Electric Mountain visitor centre hides a massive underground power station inside the mountain. Pete\'s Eats is a legendary bikers\' and climbers\' café — massive portions, proper mugs of tea, and walls covered in mountaineering photos.',
          rating: 4
        },
        {
          name: 'Dolbadarn Castle',
          type: 'castle',
          lat: 53.119,
          lng: -4.115,
          description: 'Brooding 13th-century Welsh castle perched on a rocky knoll between two lakes. Built by Llywelyn the Great to guard the pass into Snowdonia. The round tower is remarkably well-preserved and the setting between Llyn Padarn and Llyn Peris is dramatic. Free entry, 10-minute walk from the road.',
          rating: 4
        },
        {
          name: 'Ogwen Valley & Tryfan',
          type: 'viewpoint',
          lat: 53.120,
          lng: -4.020,
          description: 'The A5 through the Ogwen Valley is raw, volcanic Snowdonia at its most dramatic. Tryfan\'s jagged summit rises straight from the road like a broken tooth. Llyn Ogwen sits dark and moody at the head of the valley. Pull over at the layby near Tryfan for the classic view — this is one of the most photographed spots in Wales.',
          rating: 5
        },
        {
          name: 'Ogwen Falls (Rhaeadr Ogwen)',
          type: 'waterfall',
          lat: 53.113,
          lng: -3.992,
          description: 'Where Llyn Ogwen overflows into Nant Ffrancon in a wide curtain of white water. A 5-minute walk from the car park at Ogwen Cottage. The falls are modest in height but the setting — surrounded by the dark cwms of the Glyderau and Carneddau — is magnificent.',
          rating: 4
        },
        {
          name: 'Nant Gwynant Valley',
          type: 'viewpoint',
          lat: 53.030,
          lng: -4.020,
          description: 'Often called the most beautiful valley in Wales. The A498 winds along the shore of Llyn Gwynant and Llyn Dinas with Snowdon towering above. Tolkien supposedly drew inspiration from this valley for Middle-earth. The light here on a clear evening is something else entirely.',
          rating: 5
        },
        {
          name: 'Beddgelert',
          type: 'village',
          lat: 53.011,
          lng: -4.100,
          description: 'A picture-postcard village at the meeting of two rivers and three valleys. Named after Gelert, the faithful hound of Prince Llewelyn — the grave is a short walk from the village. Stone bridges, cosy pubs, and a cracking ice cream shop. The Saracens Head does decent pub grub.',
          rating: 5
        },
        {
          name: 'Aberglaslyn Pass',
          type: 'viewpoint',
          lat: 52.990,
          lng: -4.095,
          description: 'Just south of Beddgelert, the river Glaslyn squeezes through a narrow wooded gorge. The Fisherman\'s Path along the riverbank is one of the finest short walks in Snowdonia. Salmon leap up the rapids in autumn. The A498 gives you a taste from the saddle but the walk is worth stopping for.',
          rating: 4
        },
        {
          name: 'Llyn Gwynant Campsite',
          type: 'camp',
          lat: 53.028,
          lng: -4.012,
          description: 'Back at this stunning lakeside spot for night two if you want. Alternatively, Beddgelert has several campsites and a few B&Bs. The Royal Goat Hotel is a classic walkers\' and bikers\' inn if you fancy a proper bed.',
          rating: 5
        }
      ],
      roads: [
        {
          name: 'Llanberis Pass (A4086)',
          rating: 5,
          description: 'The crown jewel of Welsh passes. Steep, tight, and hemmed in by massive rock walls. Single-carriageway with passing places in the narrowest sections. Best ridden early morning before the tourist traffic builds.'
        },
        {
          name: 'A5 Ogwen Valley',
          rating: 5,
          description: 'Epic mountain road through a glacial valley with Tryfan and the Glyderau looming either side. Good surface, flowing bends, and layby after layby begging you to stop for photos.'
        },
        {
          name: 'A498 Nant Gwynant',
          rating: 4,
          description: 'A gentler valley road winding past two lakes with Snowdon as a backdrop. Beautiful rather than thrilling, but the setting is unmatched. Watch for walkers crossing to the Watkin Path.'
        }
      ],
      tips: 'This is a short day on miles but long on stops. Don\'t rush it. Llanberis Pass is best ridden early before the coach parties arrive. Fuel up in Llanberis or Beddgelert. Sheep are everywhere and they have zero road sense — approach blind bends with caution.'
    },

    // =====================================================
    // DAY 3 — Snowdonia to Aberystwyth via Cader Idris
    // =====================================================
    {
      day: 3,
      title: 'Snowdonia to Aberystwyth',
      distance: '~110 miles',
      duration: '~4-5 hrs riding',
      summary: 'Head south through the quieter, wilder side of Snowdonia. The roads around Cader Idris are among the most underrated in Wales — empty sweepers with massive views. Devil\'s Bridge is a must-stop, and you\'ll finish at Aberystwyth where the mountains meet the sea.',
      center: [52.55, -3.90],
      zoom: 9,
      region: 'wales-mid',
      waypoints: [
        [53.028, -4.012], [52.950, -4.050], [52.880, -3.980],
        [52.810, -3.930], [52.742, -3.884], [52.700, -3.910],
        [52.640, -3.870], [52.593, -3.854], [52.520, -3.860],
        [52.376, -3.848], [52.415, -4.082]
      ],
      stops: [
        {
          name: 'Blaenau Ffestiniog',
          type: 'landmark',
          lat: 52.993,
          lng: -3.939,
          description: 'The slate capital of Wales, surrounded by vast quarry landscapes. It\'s atmospheric and slightly eerie — mountains of grey slate tailings tower above the town. The Llechwedd Slate Caverns offer underground tours. A fascinating stop that shows the industrial grit behind Snowdonia\'s pretty face.',
          rating: 3
        },
        {
          name: 'Dolgellau',
          type: 'village',
          lat: 52.742,
          lng: -3.884,
          description: 'Handsome stone market town at the foot of Cader Idris. Good cafés along the main square and a proper old-fashioned feel. The TH Roberts ironmonger has been trading since 1868 and still sells everything from nails to camping gas. Fill up fuel here.',
          rating: 4
        },
        {
          name: 'Cader Idris Viewpoint',
          type: 'viewpoint',
          lat: 52.700,
          lng: -3.910,
          description: 'Cader Idris (Chair of Idris) is the great mountain of southern Snowdonia — 2,930ft of volcanic rock with a dark lake in its summit crater. Legend says anyone who sleeps on the summit wakes as a poet or a madman. The Minffordd Path starts nearby if you fancy the climb (6-7 hours return). From the road, the mountain dominates the southern skyline for miles.',
          rating: 5
        },
        {
          name: 'Corris',
          type: 'village',
          lat: 52.658,
          lng: -3.846,
          description: 'Tiny former slate village in the Dulas Valley. King Arthur\'s Labyrinth is a quirky underground boat ride through caverns retelling Welsh legends. The Corris Craft Centre has a good café. The road south from here through the valley is a hidden gem — empty tarmac, forest either side.',
          rating: 3
        },
        {
          name: 'Machynlleth',
          type: 'village',
          lat: 52.593,
          lng: -3.854,
          description: 'Ancient capital of Wales — Owain Glyndŵr was crowned Prince of Wales here in 1404. The Parliament House is now a small museum. A pleasant market town with a landmark clock tower, independent shops, and the Centre for Alternative Technology on the edge of town. Good fuel and food stop.',
          rating: 4
        },
        {
          name: 'Devil\'s Bridge (Pontarfynach)',
          type: 'waterfall',
          lat: 52.376,
          lng: -3.848,
          description: 'Three bridges stacked on top of each other spanning 800 years, with the River Mynach plunging 300ft through a narrow ravine below. The falls are genuinely spectacular — a series of cascades through ancient woodland in a deep gorge. The walk down the Jacob\'s Ladder steps to the bottom is steep but unforgettable. Entry fee for the falls. The narrow-gauge Vale of Rheidol Railway terminates here if you fancy arriving by steam.',
          rating: 5
        },
        {
          name: 'Aberystwyth Seafront',
          type: 'landmark',
          lat: 52.415,
          lng: -4.082,
          description: 'A Victorian seaside town with a long promenade, ruined castle, and the cliff railway up Constitution Hill. Kick the bar on the prom (it\'s tradition), get fish and chips, and watch the sunset over Cardigan Bay. The National Library of Wales sits on the hill above town. A proper end to the riding day.',
          rating: 4
        },
        {
          name: 'Aberystwyth Holiday Village',
          type: 'camp',
          lat: 52.430,
          lng: -4.060,
          description: 'Several camping and caravan options on the edges of Aberystwyth. Midfield Holiday Park and Morfa Bychan are both solid choices with showers and close to town. Alternatively, plenty of B&Bs and pubs with rooms in town.',
          rating: 3
        }
      ],
      roads: [
        {
          name: 'A470 through southern Snowdonia',
          rating: 4,
          description: 'The backbone of Wales. Through this section it winds through forested valleys and past Cader Idris with big open views. Good surface, flowing bends, and far less traffic than the northern passes.'
        },
        {
          name: 'A44 to Devil\'s Bridge',
          rating: 4,
          description: 'A cracking road that sweeps through the Cambrian Mountains. Fast, open moorland riding with long sight lines and barely any traffic midweek. The approach to Devil\'s Bridge drops through dense woodland.'
        }
      ],
      tips: 'The roads south of Dolgellau are significantly quieter than Snowdonia\'s northern passes. Fuel up in Dolgellau or Machynlleth — there\'s very little between them and Devil\'s Bridge. The Devil\'s Bridge falls are worth the entry fee and the steep walk down. Allow at least an hour.'
    },

    // =====================================================
    // DAY 4 — Aberystwyth to Brecon Beacons
    // =====================================================
    {
      day: 4,
      title: 'Aberystwyth to Brecon Beacons',
      distance: '~105 miles',
      duration: '~4-5 hrs riding',
      summary: 'The wildest day of the trip. The Elan Valley reservoirs are hauntingly beautiful, and the mountain road over to Abergwesyn is one of the most remote and thrilling single-track roads in Britain. You\'ll cross the Black Mountain passes before dropping into the Brecon Beacons for the night.',
      center: [52.10, -3.60],
      zoom: 9,
      region: 'wales-mid',
      waypoints: [
        [52.415, -4.082], [52.370, -3.900], [52.310, -3.680],
        [52.270, -3.570], [52.220, -3.580], [52.160, -3.670],
        [52.100, -3.730], [51.990, -3.800], [51.950, -3.710],
        [51.880, -3.690], [51.950, -3.390]
      ],
      stops: [
        {
          name: 'Elan Valley Visitor Centre',
          type: 'landmark',
          lat: 52.270,
          lng: -3.570,
          description: 'The gateway to the Elan Valley — a chain of six massive Victorian reservoirs that supply water to Birmingham, 73 miles away. The scale is staggering. The dams are built from hand-dressed stone and look like something from a fantasy film. Free entry to the visitor centre with café and exhibitions. The road along the reservoirs is one of the great hidden motorcycle roads in Wales.',
          rating: 5
        },
        {
          name: 'Caban Coch Dam',
          type: 'viewpoint',
          lat: 52.265,
          lng: -3.568,
          description: 'The first and most dramatic of the Elan Valley dams. When the reservoir overflows, water cascades over the curved dam wall in a 122ft curtain — genuinely jaw-dropping after heavy rain. Even dry, the engineering is magnificent. Pull over on the road across the top for the full effect.',
          rating: 5
        },
        {
          name: 'Craig Goch Dam',
          type: 'viewpoint',
          lat: 52.310,
          lng: -3.680,
          description: 'The highest and most remote of the Elan dams, sitting at the head of the valley surrounded by open moorland. The road here follows the reservoir edge with sweeping bends and not another vehicle in sight. Utterly peaceful. Red kites soar overhead — this valley is one of their strongholds.',
          rating: 4
        },
        {
          name: 'Abergwesyn Mountain Road',
          type: 'road',
          lat: 52.160,
          lng: -3.670,
          description: 'The legendary mountain road from Tregaron to Abergwesyn. A narrow, unfenced single-track that climbs over the Cambrian Mountains through some of the most remote terrain in Wales. Cattle grids, blind summits, sheep in the road, and views that stretch to eternity. This is proper adventure riding — not fast, but utterly exhilarating. Allow extra time and check conditions in advance.',
          rating: 5
        },
        {
          name: 'Llyn Brianne Reservoir',
          type: 'lake',
          lat: 52.100,
          lng: -3.730,
          description: 'A wild, remote reservoir hidden in the Tywi Forest. The dam is the tallest in the UK at 300ft and the access road swoops through dense forestry with brilliant flowing bends. Red kites are almost guaranteed — this area was the last refuge of the species in Britain before the reintroduction programme.',
          rating: 4
        },
        {
          name: 'Llandovery',
          type: 'village',
          lat: 51.990,
          lng: -3.800,
          description: 'A small, friendly market town on the edge of the Brecon Beacons. The castle ruins overlook the town and there\'s a statue of Llywelyn ap Gruffydd Fychan — a Welsh hero executed for misleading English troops. Good fuel stop and the West End Café does a solid full Welsh breakfast.',
          rating: 3
        },
        {
          name: 'Black Mountain Pass (A4069)',
          type: 'road',
          lat: 51.880,
          lng: -3.690,
          description: 'One of the most famous motorcycle roads in Wales. The A4069 climbs from the Tywi Valley over the western edge of the Brecon Beacons in a series of open sweeping bends across wild moorland. This is Top Gear territory — they\'ve filmed here multiple times. The descent into the Amman Valley is technical and fast. Surface can be patchy after winter — watch for loose gravel.',
          rating: 5
        },
        {
          name: 'Brecon',
          type: 'village',
          lat: 51.950,
          lng: -3.390,
          description: 'The largest town in the Brecon Beacons and a natural overnight stop. Brecon Cathedral dates from the 12th century, and the town has plenty of pubs, restaurants, and accommodation. The Usk and Honddu rivers meet here. The Beacons Beacon Brewing Co. taproom is worth seeking out.',
          rating: 4
        },
        {
          name: 'Pencelli Castle Campsite',
          type: 'camp',
          lat: 51.930,
          lng: -3.340,
          description: 'A peaceful campsite on the banks of the Monmouthshire & Brecon Canal, 4 miles from Brecon. Flat pitches, hot showers, canal-side walks, and a pub within stumbling distance. The Royal Oak in Pencelli does excellent food. Well-placed for tomorrow\'s Beacons loop.',
          rating: 4
        }
      ],
      roads: [
        {
          name: 'Elan Valley Road',
          rating: 5,
          description: 'A winding single-carriageway that follows the chain of reservoirs through a remote, treeless valley. Smooth surface, sweeping bends around the lake edges, and barely any traffic. One of Britain\'s best-kept road secrets.'
        },
        {
          name: 'Abergwesyn Mountain Road',
          rating: 5,
          description: 'Wild single-track across open mountain. Not a fast road but an unforgettable one. Cattle grids, blind crests, and free-roaming livestock. Ride it for the experience, not the speed.'
        },
        {
          name: 'Black Mountain Pass (A4069)',
          rating: 5,
          description: 'Open, fast, and breathtaking. Long sweeping curves across the top of the western Beacons with massive views. The descent is tighter and more technical. One of the great British bike roads.'
        }
      ],
      tips: 'This is the wildest day. Carry water and snacks — there are NO services between Elan Valley and Llandovery. The Abergwesyn road is not suitable for large or heavily loaded bikes in wet conditions. Fuel up in Rhayader or Llandovery. Check weather before committing to the mountain road — it can be foggy and brutal in poor visibility.'
    },

    // =====================================================
    // DAY 5 — Brecon Beacons Loop and South
    // =====================================================
    {
      day: 5,
      title: 'Brecon Beacons Loop & South',
      distance: '~95 miles',
      duration: '~3-4 hrs riding',
      summary: 'The grand finale. Gospel Pass is the highest road pass in the Black Mountains — a narrow single-track that feels like riding through Tolkien country. Loop through Hay-on-Wye (the town of books), ride the Pontsticill reservoir road, and finish in Abergavenny with the whole trip behind you and a grin that won\'t wash off.',
      center: [51.92, -3.15],
      zoom: 10,
      region: 'wales-south',
      waypoints: [
        [51.950, -3.390], [51.970, -3.250], [52.000, -3.160],
        [51.960, -3.110], [51.940, -3.090], [51.920, -3.060],
        [52.070, -3.124], [52.000, -3.200], [51.960, -3.300],
        [51.830, -3.380], [51.780, -3.370], [51.830, -3.190],
        [51.822, -3.017]
      ],
      stops: [
        {
          name: 'Pen y Fan Viewpoint',
          type: 'viewpoint',
          lat: 51.884,
          lng: -3.436,
          description: 'The highest peak in southern Britain at 2,907ft. You can see it from the A470 and several laybys. The classic walk up from Pont ar Daf car park takes about 2 hours return — a fitting start to the final day if you\'re feeling energetic. The flat-topped summit with its dramatic northern escarpment is unmistakable.',
          rating: 5
        },
        {
          name: 'Llanthony Priory',
          type: 'landmark',
          lat: 51.940,
          lng: -3.090,
          description: 'A hauntingly beautiful Augustinian priory ruin deep in the Vale of Ewyas. Founded around 1100, the soaring Gothic arches stand open to the sky in a narrow valley backed by the Black Mountains. There\'s a pub and hotel built into the priory ruins — possibly the most atmospheric pint in Wales. The road here along the vale is narrow and empty.',
          rating: 5
        },
        {
          name: 'Gospel Pass',
          type: 'road',
          lat: 51.960,
          lng: -3.110,
          description: 'At 1,778ft, the highest road pass in the Black Mountains. A narrow, unfenced single-track climbing from the Vale of Ewyas over the ridge with colossal views west across the Beacons and east into Herefordshire. The name comes from medieval monks who preached here. The descent to Hay-on-Wye is fast and flowing with big exposure on both sides. Absolutely unmissable.',
          rating: 5
        },
        {
          name: 'Hay-on-Wye',
          type: 'village',
          lat: 52.070,
          lng: -3.124,
          description: 'The world-famous town of books. Over 20 bookshops crammed into a tiny border town, including Richard Booth\'s original bookshop and the legendary castle bookshop. Even if you\'re not a reader, it\'s a fascinating place to wander. Good cafés and the castle has great views. Home of the Hay Literary Festival.',
          rating: 4
        },
        {
          name: 'Black Mountains Ridge Road',
          type: 'viewpoint',
          lat: 51.920,
          lng: -3.060,
          description: 'The narrow ridge road between the Grwyne Fawr and Grwyne Fechan valleys offers some of the most exposed riding in Wales. Open moorland, wild ponies, and views that stretch from the Bristol Channel to the Malvern Hills on a clear day. This is proper edge-of-the-world stuff.',
          rating: 4
        },
        {
          name: 'Pontsticill Reservoir',
          type: 'lake',
          lat: 51.780,
          lng: -3.370,
          description: 'A beautiful reservoir nestled in the Taf Fechan valley, fed by streams running off the Beacons. The Brecon Mountain Railway runs along the eastern shore — you might hear the steam whistle echoing across the water. The road along the reservoir is quiet and scenic with gentle bends.',
          rating: 4
        },
        {
          name: 'Talybont Reservoir',
          type: 'lake',
          lat: 51.830,
          lng: -3.380,
          description: 'Another peaceful Beacons reservoir surrounded by forest. The road along the western shore is single-track and rarely used — proper back-road riding. Good picnic spot at the dam with views south along the valley.',
          rating: 3
        },
        {
          name: 'Sugar Loaf Mountain Viewpoint',
          type: 'viewpoint',
          lat: 51.845,
          lng: -3.060,
          description: 'The distinctive cone-shaped peak above Abergavenny. A layby on the approach road gives a superb panorama of the mountain with the Usk Valley below. The walk to the summit (1,955ft) takes about an hour and gives a 360-degree panorama of the entire Brecon Beacons, Black Mountains, and across to the Severn Estuary.',
          rating: 4
        },
        {
          name: 'Abergavenny',
          type: 'village',
          lat: 51.822,
          lng: -3.017,
          description: 'The Gateway to Wales and a fitting end to the trip. A handsome market town famous for its food festival and surrounded by mountains — the Sugar Loaf, Blorenge, and Skirrid. The castle ruins overlook the town, and the Usk runs through the centre. Plenty of pubs to toast the ride — the Hen & Chickens on Flannel Street is a solid locals\' choice.',
          rating: 4
        }
      ],
      roads: [
        {
          name: 'Gospel Pass',
          rating: 5,
          description: 'The highest road in the Black Mountains. Narrow single-track over a high col with vertiginous views and a thrilling descent. Technical, exposed, and unforgettable.'
        },
        {
          name: 'Vale of Ewyas road to Llanthony',
          rating: 4,
          description: 'A hidden valley road that narrows as it penetrates deeper into the Black Mountains. Virtually no traffic, canopy of trees, and a real sense of remoteness. The priory at the end is a stunning reward.'
        },
        {
          name: 'Pontsticill reservoir road',
          rating: 3,
          description: 'Quiet, scenic single-track around the reservoir. Not a thrill ride but a beautiful cooldown as you head south towards Abergavenny.'
        }
      ],
      tips: 'Gospel Pass can be icy even in late spring — check conditions if riding early in the season. The road through the Vale of Ewyas is narrow and has passing places — don\'t rush it. Hay-on-Wye is worth an extended stop even if you\'re not a bookworm. Fill up before the Black Mountains — there\'s nothing on the mountain roads.'
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WELSH_MOUNTAIN_PASSES };
}
