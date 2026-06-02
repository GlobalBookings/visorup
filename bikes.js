// ============================================================
// BIKES — Comprehensive UK Touring Motorcycle Database
// 20 of the most common touring motorcycles on British roads
// ============================================================

const BIKES = [

  // ──────────────────────────────────────────────────────────
  // ADVENTURE TOURING
  // ──────────────────────────────────────────────────────────

  {
    slug: "bmw-r-1250-gs",
    name: "BMW R 1250 GS",
    manufacturer: "BMW",
    category: "Adventure",
    year: "2024",
    image: "public/images/bikes/bmw-r-1250-gs.jpg",
    heroImage: "public/images/bikes/bmw-r-1250-gs-hero.jpg",
    specs: {
      engine: "1254cc Boxer Twin",
      power: "136 bhp",
      torque: "143 Nm",
      weight: "249 kg (wet)",
      seatHeight: "850/870 mm",
      tankCapacity: "20 litres",
      mpg: "48 mpg",
      fuelRange: "210 miles"
    },
    scores: {
      touring: 95,
      comfort: 90,
      handling: 82,
      value: 70,
      offroad: 60,
      pillion: 78
    },
    price: "From £16,090",
    overview: "The GS is the default answer to the question 'what touring bike should I buy?' and there's a reason for that. BMW has spent four decades refining this formula — a grunty boxer engine, shaft drive, upright ergonomics, and a chassis that devours miles like nothing else in the class. The ShiftCam variable valve timing gives it surprising top-end punch for a twin, and the electronics package is comprehensive without being overwhelming. It's the bike that created adventure touring as we know it, and it's still the benchmark.",
    touringReview: "On UK roads, the GS is devastatingly competent. The upright position gives you a commanding view of the road ahead — essential when you're threading through the Lake District passes or scanning for sheep on the NC500. Wind protection from the adjustable screen is class-leading, and the 20-litre tank means you can comfortably run Applecross to Durness without sweating about fuel. The boxer engine's torque delivery is perfectly suited to the UK's constant-speed-change riding — you'll short-shift through Welsh passes and barely touch the brakes. Where it falls down is weight: at 249kg wet before you've strapped on panniers and camping gear, technical single-track roads like Glen Etive or the Bealach na Ba demand respect. The wide boxer engine can also clip on narrow Cornish lanes. But for covering big miles in supreme comfort while still being genuinely fun on the good stuff, nothing else comes close.",
    strengths: [
      "Wind protection excellent for long motorway stints",
      "Huge aftermarket for touring accessories",
      "Shaft drive means no chain maintenance on tour",
      "20-litre tank gives 200+ mile range between fills"
    ],
    weaknesses: [
      "Heavy for technical single-track roads",
      "Expensive to buy and service",
      "Wide boxer engine can catch on narrow Welsh passes"
    ],
    bestRoutes: ["nc500-complete", "scottish-highlands-loop", "lake-district-ultimate"],
    gearRecommendations: [
      {
        category: "Luggage",
        items: [
          { name: "BMW Vario Panniers", price: "£850", url: "https://www.sportsbikeshop.co.uk/search/?search=BMW%20Vario%20Panniers", note: "OEM fit, expandable, weatherproof" },
          { name: "Givi Trekker Outback 48L", price: "£260 each", url: "https://www.sportsbikeshop.co.uk/search/?search=Givi%20Trekker%20Outback%2048L", note: "Rugged aluminium alternative" }
        ]
      },
      {
        category: "Protection",
        items: [
          { name: "SW-Motech Engine Guard", price: "£180", url: "https://www.sportsbikeshop.co.uk/search/?search=SW-Motech%20Engine%20Guard", note: "Essential for gravel tracks" },
          { name: "Touratech Skid Plate", price: "£220", url: "https://www.sportsbikeshop.co.uk/search/?search=Touratech%20Skid%20Plate", note: "Aluminium belly pan protection" }
        ]
      },
      {
        category: "Comfort",
        items: [
          { name: "Sargent World Sport Seat", price: "£450", url: "https://www.sportsbikeshop.co.uk/search/?search=Sargent%20World%20Sport%20Seat", note: "All-day comfort upgrade" },
          { name: "MRA Vario Touring Screen", price: "£120", url: "https://www.sportsbikeshop.co.uk/search/?search=MRA%20Vario%20Touring%20Screen", note: "Adjustable wind deflection" }
        ]
      },
      {
        category: "Electronics",
        items: [
          { name: "Quad Lock Motorcycle Mount", price: "£70", url: "https://www.sportsbikeshop.co.uk/search/?search=Quad%20Lock%20Motorcycle%20Mount", note: "Vibration-dampened phone mount" },
          { name: "Oxford USB Dual Charger", price: "£25", url: "https://www.sportsbikeshop.co.uk/search/?search=Oxford%20USB%20Dual%20Charger", note: "Keep devices charged on tour" }
        ]
      }
    ],
    touringTips: [
      "Run the bike in Road mode for touring — Dynamic is fun but burns fuel faster",
      "The standard screen is adequate but an aftermarket touring screen transforms motorway comfort",
      "Pack heavy items low in the panniers to keep the centre of gravity manageable"
    ]
  },

  {
    slug: "triumph-tiger-900",
    name: "Triumph Tiger 900 Rally Pro",
    manufacturer: "Triumph",
    category: "Adventure",
    year: "2024",
    image: "public/images/bikes/triumph-tiger-900.jpg",
    heroImage: "public/images/bikes/triumph-tiger-900-hero.jpg",
    specs: {
      engine: "888cc Inline Triple",
      power: "95 bhp",
      torque: "87 Nm",
      weight: "228 kg (wet)",
      seatHeight: "850/870 mm",
      tankCapacity: "20 litres",
      mpg: "52 mpg",
      fuelRange: "229 miles"
    },
    scores: {
      touring: 90,
      comfort: 86,
      handling: 88,
      value: 78,
      offroad: 72,
      pillion: 72
    },
    price: "From £13,795",
    overview: "Triumph's triple-cylinder adventure bike is the thinking rider's alternative to the GS. The 888cc T-plane crank triple delivers a character-rich power delivery that sits between the punchy low-down grunt of a twin and the screaming top end of a four — it's genuinely one of the best engine characters in motorcycling. Lighter and more nimble than the big BMW, the Tiger 900 is a bike that makes you feel like a better rider than you are. The Rally Pro spec adds Showa semi-active suspension, a TFT dash with turn-by-turn navigation, and heated grips as standard.",
    touringReview: "The Tiger 900 is arguably the best all-round UK touring bike you can buy at this price point. Its lighter weight compared to the GS makes an enormous difference on the tight, technical roads that define British touring — threading through the Trossachs, diving into Welsh valley roads, or tackling Hardknott Pass, you'll appreciate every kilogram it doesn't carry. The triple engine note is addictive through Highland glens, and the fuelling is impeccably smooth. The 20-litre tank gives proper touring range, and the ergonomics suit riders of all sizes. Where it gives ground to the BMW is outright wind protection at motorway speeds and the pillion experience on longer runs. The stock screen is adequate but not exceptional, and rear passenger comfort drops off after a couple of hours. For a solo rider exploring B-roads and mountain passes, though, the Tiger 900 is magnificent.",
    strengths: [
      "Lighter and more agile than the GS — brilliant on technical roads",
      "Triple engine character is addictive on twisty UK roads",
      "Excellent electronics package with semi-active suspension",
      "Strong fuel range from the 20-litre tank"
    ],
    weaknesses: [
      "Wind protection not quite GS-level on motorways",
      "Pillion comfort drops off on longer rides",
      "Triumph dealer network thinner in rural Scotland"
    ],
    bestRoutes: ["welsh-mountain-passes", "lake-district-ultimate", "scottish-highlands-loop"],
    gearRecommendations: [
      {
        category: "Luggage",
        items: [
          { name: "Triumph Expedition Panniers", price: "£780", url: "https://www.sportsbikeshop.co.uk/search/?search=Triumph%20Expedition%20Panniers", note: "OEM aluminium, quick-release" },
          { name: "Kriega OS-32 Soft Panniers", price: "£280 pair", url: "https://www.sportsbikeshop.co.uk/search/?search=Kriega%20OS-32%20Soft%20Panniers", note: "Waterproof, lightweight, versatile" }
        ]
      },
      {
        category: "Protection",
        items: [
          { name: "SW-Motech Crash Bars", price: "£195", url: "https://www.sportsbikeshop.co.uk/search/?search=SW-Motech%20Crash%20Bars", note: "Steel engine protection" },
          { name: "Triumph Sump Guard", price: "£160", url: "https://www.sportsbikeshop.co.uk/search/?search=Triumph%20Sump%20Guard", note: "OEM aluminium bash plate" }
        ]
      },
      {
        category: "Comfort",
        items: [
          { name: "Triumph Touring Seat", price: "£320", url: "https://www.sportsbikeshop.co.uk/search/?search=Triumph%20Touring%20Seat", note: "Lower profile, longer-range comfort" },
          { name: "Puig Touring Screen", price: "£95", url: "https://www.sportsbikeshop.co.uk/search/?search=Puig%20Touring%20Screen", note: "Taller, wider wind protection" }
        ]
      },
      {
        category: "Electronics",
        items: [
          { name: "Quad Lock Motorcycle Mount", price: "£70", url: "https://www.sportsbikeshop.co.uk/search/?search=Quad%20Lock%20Motorcycle%20Mount", note: "Vibration-dampened phone mount" },
          { name: "Optimate USB Charger", price: "£30", url: "https://www.sportsbikeshop.co.uk/search/?search=Optimate%20USB%20Charger", note: "Reliable SAE-connected charging" }
        ]
      }
    ],
    touringTips: [
      "The T-plane crank triple sounds best between 4,000–7,000 rpm — keep it there on the good roads",
      "Invest in a taller touring screen before any long trip — the standard screen buffets at speed",
      "Off-road mode with traction control dialled back is useful on the gravelly Highland single-track roads"
    ]
  },

  {
    slug: "honda-africa-twin",
    name: "Honda CRF1100L Africa Twin",
    manufacturer: "Honda",
    category: "Adventure",
    year: "2024",
    image: "public/images/bikes/honda-africa-twin.jpg",
    heroImage: "public/images/bikes/honda-africa-twin-hero.jpg",
    specs: {
      engine: "1084cc Parallel Twin",
      power: "102 bhp",
      torque: "105 Nm",
      weight: "226 kg (wet)",
      seatHeight: "850/870 mm",
      tankCapacity: "18.8 litres",
      mpg: "50 mpg",
      fuelRange: "207 miles"
    },
    scores: {
      touring: 92,
      comfort: 88,
      handling: 85,
      value: 82,
      offroad: 68,
      pillion: 75
    },
    price: "From £13,099",
    overview: "Honda's legendary adventure bike returned in 1100 form and immediately established itself as one of the most capable all-rounders on sale. The 1084cc parallel twin is a masterclass in usable power — strong low-down torque, silky smooth fuelling, and enough top-end to cruise motorways at 80mph without stress. The optional DCT automatic gearbox divides opinion but makes long-distance touring almost effortless. Honda reliability is the ace in the hole here: this bike will tour tens of thousands of miles without drama, which is exactly what you need on the road to Durness.",
    touringReview: "The Africa Twin is tailor-made for the kind of varied riding British touring demands. The engine pulls cleanly from 2,000rpm, which is a godsend when you're pottering through Lake District villages at 20mph before opening up on the A66. The chassis is confidence-inspiring without being bland, and it handles mid-corner bumps and patchy road surfaces — a constant on UK B-roads — better than most in the class. The 18.8-litre tank is the only slight weakness on range compared to the GS, but 200+ miles is still comfortable for most Highland legs. If you opt for DCT, long days on the NC500 become almost relaxing — your left hand does nothing but operate the clutch in your coffee cup. Wind protection is solid, the seat is comfortable for five-hour stints, and Honda's build quality means nothing rattles loose when Welsh cattle grids try to shake your bike apart.",
    strengths: [
      "Honda reliability — bulletproof on long tours",
      "Optional DCT makes long-distance touring effortless",
      "Smooth, tractable engine perfect for variable UK speeds",
      "Excellent value compared to European rivals"
    ],
    weaknesses: [
      "Slightly smaller tank than key rivals limits range",
      "Standard screen creates some turbulence at speed",
      "DCT version is heavier and limits engine-braking control"
    ],
    bestRoutes: ["nc500-complete", "lake-district-ultimate", "coastal-cornwall"],
    gearRecommendations: [
      {
        category: "Luggage",
        items: [
          { name: "Honda OEM Aluminium Panniers", price: "£720", url: "https://www.sportsbikeshop.co.uk/search/?search=Honda%20OEM%20Aluminium%20Panniers", note: "Perfect fit, 37L each side" },
          { name: "SW-Motech TRAX ADV 45L", price: "£310 each", url: "https://www.sportsbikeshop.co.uk/search/?search=SW-Motech%20TRAX%20ADV%2045L", note: "Premium aluminium, tool-free removal" }
        ]
      },
      {
        category: "Protection",
        items: [
          { name: "Hepco & Becker Engine Guard", price: "£175", url: "https://www.sportsbikeshop.co.uk/search/?search=Hepco%20%26%20Becker%20Engine%20Guard", note: "Full wrap-around engine protection" },
          { name: "Honda OEM Skid Plate", price: "£140", url: "https://www.sportsbikeshop.co.uk/search/?search=Honda%20OEM%20Skid%20Plate", note: "Aluminium underbody shield" }
        ]
      },
      {
        category: "Comfort",
        items: [
          { name: "Corbin Dual Touring Seat", price: "£480", url: "https://www.sportsbikeshop.co.uk/search/?search=Corbin%20Dual%20Touring%20Seat", note: "Shaped foam for all-day riding" },
          { name: "Givi Airflow Touring Screen", price: "£110", url: "https://www.sportsbikeshop.co.uk/search/?search=Givi%20Airflow%20Touring%20Screen", note: "Height-adjustable, reduces buffeting" }
        ]
      },
      {
        category: "Electronics",
        items: [
          { name: "TomTom Rider 550", price: "£350", url: "https://www.sportsbikeshop.co.uk/search/?search=TomTom%20Rider%20550", note: "Dedicated motorcycle sat-nav, rain-proof" },
          { name: "Oxford USB Dual Charger", price: "£25", url: "https://www.sportsbikeshop.co.uk/search/?search=Oxford%20USB%20Dual%20Charger", note: "Hardwired dual USB for phone and camera" }
        ]
      }
    ],
    touringTips: [
      "If you have DCT, use Sport mode on mountain passes for more aggressive downshift behaviour",
      "Fill up before entering the Highlands — the 18.8L tank is adequate but don't push it past remote fuel stops",
      "The standard windscreen works best when set fully upright — angled forward causes turbulence at the helmet"
    ]
  },

  {
    slug: "yamaha-tenere-700",
    name: "Yamaha Ténéré 700",
    manufacturer: "Yamaha",
    category: "Adventure",
    year: "2024",
    image: "public/images/bikes/yamaha-tenere-700.jpg",
    heroImage: "public/images/bikes/yamaha-tenere-700-hero.jpg",
    specs: {
      engine: "689cc CP2 Parallel Twin",
      power: "73 bhp",
      torque: "68 Nm",
      weight: "204 kg (wet)",
      seatHeight: "880 mm",
      tankCapacity: "16 litres",
      mpg: "58 mpg",
      fuelRange: "204 miles"
    },
    scores: {
      touring: 78,
      comfort: 70,
      handling: 90,
      value: 88,
      offroad: 88,
      pillion: 55
    },
    price: "From £9,700",
    overview: "The Ténéré 700 is the anti-GS — a stripped-back, lightweight adventure bike that prioritises riding fun over electronic complexity. The CP2 twin from the MT-07 is one of the great engines in motorcycling: punchy, responsive, characterful, and utterly reliable. There's no TFT screen, no semi-active suspension, no cornering ABS — just a brilliantly balanced chassis, great suspension travel, and an engine that makes every road feel like an adventure. It's the bike that reminds you why you started riding in the first place.",
    touringReview: "The T7 is a revelation on UK back roads. At 204kg wet it's light enough to throw around with confidence, and the long-travel suspension soaks up potholes and broken tarmac that would jar your fillings loose on a heavier bike. Welsh mountain passes, Scottish single-track, Cornish lanes — the Ténéré eats them all alive. The CP2 engine loves being revved and has enough low-down grunt for relaxed motorway cruising, though it does get buzzy above 75mph. The 16-litre tank is the big touring compromise: 200 miles is fine in England but gets tight in the fuel-station deserts of the Scottish Highlands. Wind protection is basic, so motorway stints are fatiguing, and the tall seat height will concern shorter riders. But load it up with soft luggage, point it at the NC500, and you'll have the time of your life. This is the adventure bike for people who actually ride, not just pose at cafés.",
    strengths: [
      "Lightweight and agile — superb on technical UK roads",
      "CP2 engine is fun, reliable, and fuel-efficient",
      "Long-travel suspension shrugs off British potholes",
      "Outstanding value for money"
    ],
    weaknesses: [
      "Small 16-litre tank limits range in remote areas",
      "Wind protection is minimal for motorway touring",
      "Tall 880mm seat height may exclude shorter riders"
    ],
    bestRoutes: ["welsh-mountain-passes", "coastal-cornwall", "lake-district-ultimate"],
    gearRecommendations: [
      {
        category: "Luggage",
        items: [
          { name: "Kriega OS-32 Soft Panniers", price: "£280 pair", url: "https://www.sportsbikeshop.co.uk/search/?search=Kriega%20OS-32%20Soft%20Panniers", note: "Waterproof, lightweight, flexible mounting" },
          { name: "SW-Motech TRAX ION 38L", price: "£250 each", url: "https://www.sportsbikeshop.co.uk/search/?search=SW-Motech%20TRAX%20ION%2038L", note: "Aluminium hard panniers" }
        ]
      },
      {
        category: "Protection",
        items: [
          { name: "AltRider Crash Bars", price: "£210", url: "https://www.sportsbikeshop.co.uk/search/?search=AltRider%20Crash%20Bars", note: "Heavy-duty steel engine guard" },
          { name: "Touratech Expedition Skid Plate", price: "£195", url: "https://www.sportsbikeshop.co.uk/search/?search=Touratech%20Expedition%20Skid%20Plate", note: "Full coverage aluminium" }
        ]
      },
      {
        category: "Comfort",
        items: [
          { name: "Seat Concepts Comfort Seat", price: "£280", url: "https://www.sportsbikeshop.co.uk/search/?search=Seat%20Concepts%20Comfort%20Seat", note: "Reshaped foam with grippy cover" },
          { name: "Rally Raid Tall Touring Screen", price: "£145", url: "https://www.sportsbikeshop.co.uk/search/?search=Rally%20Raid%20Tall%20Touring%20Screen", note: "Purpose-built wind protection" }
        ]
      },
      {
        category: "Electronics",
        items: [
          { name: "Quad Lock Motorcycle Mount", price: "£70", url: "https://www.sportsbikeshop.co.uk/search/?search=Quad%20Lock%20Motorcycle%20Mount", note: "Vibration-dampened phone mount" },
          { name: "Oxford EL114 USB Socket", price: "£22", url: "https://www.sportsbikeshop.co.uk/search/?search=Oxford%20EL114%20USB%20Socket", note: "Flush-mount USB charging" }
        ]
      }
    ],
    touringTips: [
      "Carry a 2-litre fuel bladder for Highland touring — the 16L tank gets tight between Ullapool and Durness",
      "Soft luggage suits this bike far better than hard panniers — keeps the weight down and the agility intact",
      "Drop the rear preload two clicks when loaded for touring — the stock setting is very firm"
    ]
  },

  {
    slug: "ktm-1290-super-adventure-s",
    name: "KTM 1290 Super Adventure S",
    manufacturer: "KTM",
    category: "Adventure",
    year: "2024",
    image: "public/images/bikes/ktm-1290-super-adventure-s.jpg",
    heroImage: "public/images/bikes/ktm-1290-super-adventure-s-hero.jpg",
    specs: {
      engine: "1301cc LC8 V-Twin",
      power: "160 bhp",
      torque: "138 Nm",
      weight: "249 kg (wet)",
      seatHeight: "860 mm",
      tankCapacity: "23 litres",
      mpg: "42 mpg",
      fuelRange: "213 miles"
    },
    scores: {
      touring: 91,
      comfort: 88,
      handling: 86,
      value: 65,
      offroad: 50,
      pillion: 80
    },
    price: "From £18,499",
    overview: "The 1290 Super Adventure S is the hooligan of the adventure touring class. KTM's 1301cc V-twin produces a staggering 160bhp — more than most sportsbikes — wrapped in an adventure-touring chassis with semi-active WP suspension, radar-assisted cruise control, and the most comprehensive electronics package in the segment. This is a bike that can blast down the A1 at illegal speeds, then hustle through Highland twisties with genuine sportsbike-like precision. It's excessive, exhilarating, and not remotely subtle.",
    touringReview: "On British roads, the Super Adventure's performance is almost comically overpowered — but that's rather the point. The enormous 23-litre tank gives the best range in the adventure class, which is a genuine practical advantage when you're threading the NC500 through fuel-station deserts. The semi-active suspension auto-adjusts beautifully to the UK's inconsistent road surfaces, and the radar cruise control is genuinely useful on the long M6 slog to Scotland. Where it becomes challenging is on tight, technical roads: the sheer power needs respect on greasy Welsh hairpins, and the weight is noticeable on steep Lake District passes. KTM dealer coverage in rural Britain is also patchier than BMW or Honda, which matters if something goes wrong in the Highlands. But if you want to cover ground faster than anything else while arriving fresh, the 1290 is peerless.",
    strengths: [
      "Enormous 23-litre tank — best-in-class fuel range",
      "Radar cruise control makes motorway miles effortless",
      "Semi-active suspension handles any road surface",
      "160bhp — outrageously fast for an adventure bike"
    ],
    weaknesses: [
      "Expensive to buy and maintain — KTM servicing costs sting",
      "Power is overkill for most UK road situations",
      "KTM dealer network thin in rural Scotland and Wales"
    ],
    bestRoutes: ["nc500-complete", "scottish-highlands-loop", "channel-islands-explorer"],
    gearRecommendations: [
      {
        category: "Luggage",
        items: [
          { name: "KTM Touring Aluminium Cases", price: "£920 pair", url: "https://www.sportsbikeshop.co.uk/search/?search=KTM%20Touring%20Aluminium%20Cases", note: "OEM fit, 37+45 litre capacity" },
          { name: "Givi Trekker Dolomiti 36L", price: "£280 each", url: "https://www.sportsbikeshop.co.uk/search/?search=Givi%20Trekker%20Dolomiti%2036L", note: "Aluminium with Monokey fitting" }
        ]
      },
      {
        category: "Protection",
        items: [
          { name: "Touratech Engine Guard", price: "£220", url: "https://www.sportsbikeshop.co.uk/search/?search=Touratech%20Engine%20Guard", note: "Stainless steel, full wrap" },
          { name: "SW-Motech Sump Guard", price: "£170", url: "https://www.sportsbikeshop.co.uk/search/?search=SW-Motech%20Sump%20Guard", note: "Aluminium underbody protection" }
        ]
      },
      {
        category: "Comfort",
        items: [
          { name: "KTM Ergo Heated Seat", price: "£520", url: "https://www.sportsbikeshop.co.uk/search/?search=KTM%20Ergo%20Heated%20Seat", note: "OEM heated touring seat" },
          { name: "WRS Touring Windscreen", price: "£130", url: "https://www.sportsbikeshop.co.uk/search/?search=WRS%20Touring%20Windscreen", note: "Extended height and width" }
        ]
      },
      {
        category: "Electronics",
        items: [
          { name: "Quad Lock Wireless Charger", price: "£100", url: "https://www.sportsbikeshop.co.uk/search/?search=Quad%20Lock%20Wireless%20Charger", note: "Vibration-dampened with Qi charging" },
          { name: "Garmin Zumo XT2", price: "£450", url: "https://www.sportsbikeshop.co.uk/search/?search=Garmin%20Zumo%20XT2", note: "Premium motorcycle GPS" }
        ]
      }
    ],
    touringTips: [
      "Use Street mode for UK touring — Sport mode with 160bhp on damp British roads is asking for trouble",
      "The radar cruise is brilliant on the M6 but disable it for single-carriageway Highland roads",
      "Budget for KTM service costs — the V-twin valve check intervals are shorter than Japanese rivals"
    ]
  },

  {
    slug: "ducati-multistrada-v4-s",
    name: "Ducati Multistrada V4 S",
    manufacturer: "Ducati",
    category: "Adventure",
    year: "2024",
    image: "public/images/bikes/ducati-multistrada-v4-s.jpg",
    heroImage: "public/images/bikes/ducati-multistrada-v4-s-hero.jpg",
    specs: {
      engine: "1158cc V4 Granturismo",
      power: "170 bhp",
      torque: "125 Nm",
      weight: "243 kg (wet)",
      seatHeight: "840/860 mm",
      tankCapacity: "22 litres",
      mpg: "44 mpg",
      fuelRange: "213 miles"
    },
    scores: {
      touring: 93,
      comfort: 90,
      handling: 90,
      value: 58,
      offroad: 45,
      pillion: 82
    },
    price: "From £21,350",
    overview: "The Multistrada V4 S is what happens when Ducati points its MotoGP engineering resources at the touring market. The Granturismo V4 engine is a technical marvel: 170bhp, 36,000-mile valve service intervals (unprecedented for Ducati), and a counter-rotating crankshaft that makes the bike change direction with supernatural agility. The Skyhook semi-active suspension, radar cruise control, and blind-spot detection push the technology envelope further than any rival. It's devastatingly competent and devastatingly expensive — the Italian thoroughbred of adventure touring.",
    touringReview: "Ride the Multistrada V4 S through the Scottish Highlands and you'll understand why Ducati charges what it charges. The V4 engine has a breadth of power delivery that makes it equally happy at 2,000rpm through Glencoe village and 10,000rpm blasting up the A82. The chassis is almost supernaturally good — it changes direction faster than any bike this size has a right to, making Welsh mountain passes and Lake District hairpins feel like a canyon carve rather than a touring slog. The Skyhook suspension reads road surfaces in real time and is worth every penny on Britain's pothole-ravaged B-roads. The 22-litre tank gives genuine touring range, and the heated grips and seats on the S spec make early-morning Highland starts bearable. The catch? It's eye-wateringly expensive, Ducati dealers are concentrated in southern England, and a dropped Multistrada at a Highland cattle grid is a very expensive mistake. For well-heeled riders who want the absolute best-handling touring bike on the market, nothing else comes close.",
    strengths: [
      "Best-in-class handling — changes direction like a bike half its weight",
      "V4 engine has enormous power range and 36,000-mile service intervals",
      "Radar cruise and blind-spot detection are genuinely useful",
      "22-litre tank gives strong touring range"
    ],
    weaknesses: [
      "Extremely expensive to buy — and catastrophic to crash",
      "Ducati dealer network sparse outside southern England",
      "Electronics complexity can be overwhelming to set up"
    ],
    bestRoutes: ["scottish-highlands-loop", "welsh-mountain-passes", "channel-islands-explorer"],
    gearRecommendations: [
      {
        category: "Luggage",
        items: [
          { name: "Ducati Aluminium Panniers", price: "£1,100 pair", url: "https://www.sportsbikeshop.co.uk/search/?search=Ducati%20Aluminium%20Panniers", note: "OEM fit, integrated design" },
          { name: "SW-Motech TRAX ADV 45L", price: "£310 each", url: "https://www.sportsbikeshop.co.uk/search/?search=SW-Motech%20TRAX%20ADV%2045L", note: "Aluminium, quick-release" }
        ]
      },
      {
        category: "Protection",
        items: [
          { name: "Ducati Tubular Engine Guard", price: "£250", url: "https://www.sportsbikeshop.co.uk/search/?search=Ducati%20Tubular%20Engine%20Guard", note: "OEM steel protection" },
          { name: "Evotech Performance Frame Sliders", price: "£80", url: "https://www.sportsbikeshop.co.uk/search/?search=Evotech%20Performance%20Frame%20Sliders", note: "Crash protection without bulk" }
        ]
      },
      {
        category: "Comfort",
        items: [
          { name: "Ducati Comfort Seat", price: "£280", url: "https://www.sportsbikeshop.co.uk/search/?search=Ducati%20Comfort%20Seat", note: "Wider, lower profile for long rides" },
          { name: "Ducati Touring Windscreen", price: "£170", url: "https://www.sportsbikeshop.co.uk/search/?search=Ducati%20Touring%20Windscreen", note: "Extended height OEM screen" }
        ]
      },
      {
        category: "Electronics",
        items: [
          { name: "Quad Lock Motorcycle Mount", price: "£70", url: "https://www.sportsbikeshop.co.uk/search/?search=Quad%20Lock%20Motorcycle%20Mount", note: "Vibration-dampened phone mount" },
          { name: "Interphone U-COM 4 Bluetooth", price: "£110", url: "https://www.sportsbikeshop.co.uk/search/?search=Interphone%20U-COM%204%20Bluetooth", note: "Helmet comms for rider-pillion" }
        ]
      }
    ],
    touringTips: [
      "Set the Skyhook to Touring mode and let the electronics do the work — it reads UK roads better than you can",
      "The V4 runs hot at low speeds in summer — keep moving through built-up areas or switch the fan on manually",
      "Use Enduro mode on wet Highland roads — it softens the throttle response and gives earlier traction control intervention"
    ]
  },

  {
    slug: "suzuki-v-strom-650",
    name: "Suzuki V-Strom 650",
    manufacturer: "Suzuki",
    category: "Adventure",
    year: "2024",
    image: "public/images/bikes/suzuki-v-strom-650.jpg",
    heroImage: "public/images/bikes/suzuki-v-strom-650-hero.jpg",
    specs: {
      engine: "645cc V-Twin",
      power: "71 bhp",
      torque: "62 Nm",
      weight: "216 kg (wet)",
      seatHeight: "835 mm",
      tankCapacity: "20 litres",
      mpg: "58 mpg",
      fuelRange: "255 miles"
    },
    scores: {
      touring: 86,
      comfort: 82,
      handling: 80,
      value: 95,
      offroad: 40,
      pillion: 72
    },
    price: "From £7,999",
    overview: "The V-Strom 650 is the unsung hero of UK touring. It doesn't have the cachet of a GS, the tech of a Multistrada, or the character of a Tiger — but it has something better: absolute bombproof reliability, staggering fuel economy, and a purchase price that leaves enough change from ten grand for panniers, a new screen, and a fortnight's camping. The 645cc V-twin is smooth, willing, and genuinely pleasant to ride all day. It's the bike that'll still be running perfectly at 80,000 miles when fancier machines are on their third set of electronics modules.",
    touringReview: "The Wee Strom is arguably the most sensible touring bike you can buy for UK roads, and that's not damning with faint praise. The 20-litre tank combined with 58mpg real-world economy gives you a theoretical 255-mile range — that means you can ride from Applecross to Inverness and back without refuelling, which is a genuine superpower on the NC500. The V-twin pulls cleanly from low revs and has enough grunt for confident overtakes on single-carriageway Highland roads. It's not exciting — there's no TFT screen, no semi-active suspension, no riding modes — but the simplicity means nothing goes wrong and nothing confuses you. Wind protection from the adjustable screen is decent, comfort is good for a full day in the saddle, and the narrow profile slips through Cornish lanes that wider bikes struggle with. The only real limitation is outright speed: 71bhp is comfortable at the legal limit but won't demolish motorway overtakes. For steady-pace touring on a budget, it's unbeatable.",
    strengths: [
      "Incredible 255-mile fuel range — best in class",
      "Outstanding value for money — leaves budget for gear and trips",
      "Bulletproof Suzuki reliability over huge mileages",
      "Narrow profile perfect for tight UK lanes"
    ],
    weaknesses: [
      "71bhp feels lacking for quick motorway overtakes",
      "Basic equipment — no TFT, no riding modes, no cruise control",
      "Suspension is soft and wallowy when fully loaded"
    ],
    bestRoutes: ["coastal-cornwall", "nc500-complete", "welsh-mountain-passes"],
    gearRecommendations: [
      {
        category: "Luggage",
        items: [
          { name: "Givi Trekker 46L Panniers", price: "£240 each", url: "https://www.sportsbikeshop.co.uk/search/?search=Givi%20Trekker%2046L%20Panniers", note: "Good value hard cases" },
          { name: "Kriega US-30 Drypack", price: "£100", url: "https://www.sportsbikeshop.co.uk/search/?search=Kriega%20US-30%20Drypack", note: "Waterproof tail bag, quick attach" }
        ]
      },
      {
        category: "Protection",
        items: [
          { name: "Suzuki OEM Engine Guard", price: "£120", url: "https://www.sportsbikeshop.co.uk/search/?search=Suzuki%20OEM%20Engine%20Guard", note: "Steel crash bars, direct fit" },
          { name: "Givi Sump Guard", price: "£85", url: "https://www.sportsbikeshop.co.uk/search/?search=Givi%20Sump%20Guard", note: "Aluminium lower protection" }
        ]
      },
      {
        category: "Comfort",
        items: [
          { name: "Airhawk Seat Cushion", price: "£90", url: "https://www.sportsbikeshop.co.uk/search/?search=Airhawk%20Seat%20Cushion", note: "Air cell comfort pad for long days" },
          { name: "Givi D3117ST Touring Screen", price: "£65", url: "https://www.sportsbikeshop.co.uk/search/?search=Givi%20D3117ST%20Touring%20Screen", note: "Taller replacement windscreen" }
        ]
      },
      {
        category: "Electronics",
        items: [
          { name: "Quad Lock Motorcycle Mount", price: "£70", url: "https://www.sportsbikeshop.co.uk/search/?search=Quad%20Lock%20Motorcycle%20Mount", note: "Vibration-dampened phone mount" },
          { name: "Oxford Heated Grips", price: "£45", url: "https://www.sportsbikeshop.co.uk/search/?search=Oxford%20Heated%20Grips", note: "Essential for Scottish touring — OEM grips won't cut it" }
        ]
      }
    ],
    touringTips: [
      "Add heated grips immediately — the V-Strom doesn't come with them and your hands will freeze north of Perth",
      "Preload the rear shock two full turns when touring loaded — the stock setting is too soft for panniers",
      "The fuel gauge is optimistic — treat the last bar as already empty and fill up immediately"
    ]
  },

  {
    slug: "royal-enfield-himalayan-450",
    name: "Royal Enfield Himalayan 450",
    manufacturer: "Royal Enfield",
    category: "Adventure",
    year: "2024",
    image: "public/images/bikes/royal-enfield-himalayan-450.jpg",
    heroImage: "public/images/bikes/royal-enfield-himalayan-450-hero.jpg",
    specs: {
      engine: "452cc Sherpa Single",
      power: "40 bhp",
      torque: "40 Nm",
      weight: "196 kg (wet)",
      seatHeight: "825 mm",
      tankCapacity: "17 litres",
      mpg: "65 mpg",
      fuelRange: "243 miles"
    },
    scores: {
      touring: 68,
      comfort: 65,
      handling: 82,
      value: 92,
      offroad: 78,
      pillion: 48
    },
    price: "From £5,299",
    overview: "The new Himalayan 450 represents a complete reinvention from Royal Enfield. Gone is the agricultural old thumper — replaced by a modern 452cc liquid-cooled single with a six-speed gearbox, ride-by-wire, switchable traction control, and a round TFT dash with navigation. At 196kg wet it's lighter than most 300cc bikes, and the Sherpa engine has a willing, punchy character that belies its modest power figures. At £5,299 it's the cheapest proper adventure bike you can buy, and it's a vastly better motorcycle than the price suggests.",
    touringReview: "The Himalayan 450 is a genuinely interesting touring proposition for UK riders willing to accept its limitations. The 40bhp single cylinder is perfectly adequate on A-roads and B-roads — you'll cruise at an indicated 70mph on dual carriageways without drama, and the engine is happiest between 50-60mph, which happens to be the perfect speed for enjoying British back roads. The light weight is transformative on narrow Welsh lanes, Cornish coast roads, and Scottish single-track — you can place the bike with fingertip precision where heavier machines demand effort. The 65mpg economy and 17-litre tank give nearly 250 miles of range, which is superb. Where it struggles is motorways: 40bhp feels anaemic above 70mph, overtaking on the M6 requires planning, and wind protection is token. Pillion touring is effectively off the menu. But as a budget solo adventure around Britain's best back roads, the Himalayan punches so far above its weight it's almost embarrassing for the competition.",
    strengths: [
      "Incredibly light at 196kg — goes where bigger bikes fear to tread",
      "Superb fuel economy gives 240+ mile range",
      "Unbeatable price — leaves budget for proper gear and trips",
      "Modern electronics belie the bargain price"
    ],
    weaknesses: [
      "40bhp is genuinely limiting on motorways and dual carriageways",
      "Wind protection is minimal for long-distance work",
      "Pillion touring is impractical — seat is tiny"
    ],
    bestRoutes: ["coastal-cornwall", "welsh-mountain-passes", "channel-islands-explorer"],
    gearRecommendations: [
      {
        category: "Luggage",
        items: [
          { name: "Royal Enfield Waterproof Panniers", price: "£380 pair", url: "https://www.sportsbikeshop.co.uk/search/?search=Royal%20Enfield%20Waterproof%20Panniers", note: "OEM soft luggage, easy remove" },
          { name: "Kriega OS-18 Adventure Packs", price: "£120 each", url: "https://www.sportsbikeshop.co.uk/search/?search=Kriega%20OS-18%20Adventure%20Packs", note: "Modular waterproof soft bags" }
        ]
      },
      {
        category: "Protection",
        items: [
          { name: "Royal Enfield OEM Crash Guard", price: "£95", url: "https://www.sportsbikeshop.co.uk/search/?search=Royal%20Enfield%20OEM%20Crash%20Guard", note: "Steel engine protection bars" },
          { name: "Royal Enfield Sump Guard", price: "£75", url: "https://www.sportsbikeshop.co.uk/search/?search=Royal%20Enfield%20Sump%20Guard", note: "OEM aluminium bash plate" }
        ]
      },
      {
        category: "Comfort",
        items: [
          { name: "Royal Enfield Touring Seat", price: "£180", url: "https://www.sportsbikeshop.co.uk/search/?search=Royal%20Enfield%20Touring%20Seat", note: "Wider, thicker padding OEM" },
          { name: "Puig Touring Windscreen", price: "£85", url: "https://www.sportsbikeshop.co.uk/search/?search=Puig%20Touring%20Windscreen", note: "Taller aftermarket screen" }
        ]
      },
      {
        category: "Electronics",
        items: [
          { name: "Quad Lock Motorcycle Mount", price: "£70", url: "https://www.sportsbikeshop.co.uk/search/?search=Quad%20Lock%20Motorcycle%20Mount", note: "Vibration-dampened phone mount" },
          { name: "Oxford Heated Grips", price: "£45", url: "https://www.sportsbikeshop.co.uk/search/?search=Oxford%20Heated%20Grips", note: "Essential upgrade for UK weather" }
        ]
      }
    ],
    touringTips: [
      "Stick to A-roads and B-roads — the Himalayan is at its best where speed limits are 50-60mph",
      "Pack ultralight — every kilogram matters more on a 40bhp bike than anything else on this list",
      "The TFT navigation is surprisingly good — use it instead of a phone to keep the bars clean"
    ]
  },

  // ──────────────────────────────────────────────────────────
  // SPORT TOURING
  // ──────────────────────────────────────────────────────────

  {
    slug: "kawasaki-ninja-1000sx",
    name: "Kawasaki Ninja 1000SX",
    manufacturer: "Kawasaki",
    category: "Sport Touring",
    year: "2024",
    image: "public/images/bikes/kawasaki-ninja-1000sx.jpg",
    heroImage: "public/images/bikes/kawasaki-ninja-1000sx-hero.jpg",
    specs: {
      engine: "1043cc Inline-4",
      power: "142 bhp",
      torque: "111 Nm",
      weight: "235 kg (wet)",
      seatHeight: "820 mm",
      tankCapacity: "19 litres",
      mpg: "45 mpg",
      fuelRange: "188 miles"
    },
    scores: {
      touring: 85,
      comfort: 80,
      handling: 88,
      value: 85,
      offroad: 10,
      pillion: 78
    },
    price: "From £12,300",
    overview: "The Ninja 1000SX is Kawasaki's masterclass in versatility: an inline-four sport tourer that can hustle through back roads like a sportsbike on Monday, then carry you and a pillion to Scotland in comfort on Friday. The 1043cc engine produces a broad, accessible 142bhp with a gorgeous top-end howl, and the chassis is sportier than it has any right to be for a bike with pannier mounts. Kawasaki's electronics include four riding modes, cruise control, a colour TFT dash, and smartphone connectivity. It's not the most fashionable choice, but it might be the most capable pound-for-pound.",
    touringReview: "The Ninja 1000SX is the dark horse of UK touring. That inline-four engine is sublime on British roads: tractable enough for the 30mph zones that litter the Lake District, explosive enough to make the A82 through Glencoe feel like a racetrack. The riding position is sportier than a pure tourer but still comfortable for four-hour motorway stints, and the screen is surprisingly effective for a sport-touring bike. Panniers are an optional extra but mount cleanly without spoiling the bike's looks or handling. The 19-litre tank gives just under 190 miles of range, which means careful fuel planning on the NC500 but is fine for most English and Welsh touring. Where it excels is sheer fun factor: the four-cylinder scream above 8,000rpm through the Quiraing on Skye is one of motorcycling's great pleasures. The trade-off is a lack of off-road capability — gravel tracks and farm roads are best avoided — and the sportier position means your wrists will complain after very long days.",
    strengths: [
      "Inline-four engine is thrilling on fast UK A-roads",
      "Clean pannier integration doesn't spoil handling",
      "Excellent value compared to BMW and Ducati sport tourers",
      "Cruise control and electronics are comprehensive"
    ],
    weaknesses: [
      "Sportier riding position fatigues wrists on very long days",
      "Zero off-road capability — gravel tracks are a no-go",
      "19-litre tank means Highland fuel planning is essential"
    ],
    bestRoutes: ["scottish-highlands-loop", "welsh-mountain-passes", "channel-islands-explorer"],
    gearRecommendations: [
      {
        category: "Luggage",
        items: [
          { name: "Kawasaki 28L Panniers", price: "£580 pair", url: "https://www.sportsbikeshop.co.uk/search/?search=Kawasaki%2028L%20Panniers", note: "OEM colour-matched, clean fit" },
          { name: "Givi V35 Monokey Side Cases", price: "£240 pair", url: "https://www.sportsbikeshop.co.uk/search/?search=Givi%20V35%20Monokey%20Side%20Cases", note: "Larger capacity alternative" }
        ]
      },
      {
        category: "Protection",
        items: [
          { name: "Evotech Frame Sliders", price: "£75", url: "https://www.sportsbikeshop.co.uk/search/?search=Evotech%20Frame%20Sliders", note: "Low-profile crash protection" },
          { name: "R&G Aero Crash Protectors", price: "£55", url: "https://www.sportsbikeshop.co.uk/search/?search=R%26G%20Aero%20Crash%20Protectors", note: "Lightweight frame bobbins" }
        ]
      },
      {
        category: "Comfort",
        items: [
          { name: "Kawasaki Comfort Seat", price: "£260", url: "https://www.sportsbikeshop.co.uk/search/?search=Kawasaki%20Comfort%20Seat", note: "Wider, lower profile OEM seat" },
          { name: "MRA Vario Touring Screen", price: "£120", url: "https://www.sportsbikeshop.co.uk/search/?search=MRA%20Vario%20Touring%20Screen", note: "Adjustable height wind deflection" }
        ]
      },
      {
        category: "Electronics",
        items: [
          { name: "Quad Lock Motorcycle Mount", price: "£70", url: "https://www.sportsbikeshop.co.uk/search/?search=Quad%20Lock%20Motorcycle%20Mount", note: "Vibration-dampened phone mount" },
          { name: "Cardo Packtalk Edge", price: "£290", url: "https://www.sportsbikeshop.co.uk/search/?search=Cardo%20Packtalk%20Edge", note: "Premium Bluetooth helmet comms" }
        ]
      }
    ],
    touringTips: [
      "Use the Sport riding mode on fast Highland A-roads — the sharper throttle response suits the flowing bends",
      "Fit the OEM panniers for touring — they're designed not to compromise the handling balance",
      "Pack a throttle lock or invest in a cruise control assist for the inevitable M6 slog to Scotland"
    ]
  },

  {
    slug: "yamaha-tracer-9-gt",
    name: "Yamaha Tracer 9 GT+",
    manufacturer: "Yamaha",
    category: "Sport Touring",
    year: "2024",
    image: "public/images/bikes/yamaha-tracer-9-gt.jpg",
    heroImage: "public/images/bikes/yamaha-tracer-9-gt-hero.jpg",
    specs: {
      engine: "890cc CP3 Inline Triple",
      power: "119 bhp",
      torque: "93 Nm",
      weight: "220 kg (wet)",
      seatHeight: "820/835 mm",
      tankCapacity: "18 litres",
      mpg: "50 mpg",
      fuelRange: "198 miles"
    },
    scores: {
      touring: 88,
      comfort: 85,
      handling: 87,
      value: 90,
      offroad: 15,
      pillion: 80
    },
    price: "From £12,500",
    overview: "Yamaha's Tracer 9 GT+ takes the addictive CP3 triple from the MT-09 and wraps it in a genuinely capable touring package. The GT+ spec adds semi-active KYB suspension, radar cruise control, heated grips and seat, colour TFT with smartphone connectivity, and hard panniers — all included in the price. The 890cc crossplane triple delivers a characterful 119bhp with a distinctive off-beat firing order that makes every ride feel more involving than a conventional twin or four. For the money, nothing else gives you this much touring equipment as standard.",
    touringReview: "The Tracer 9 GT+ is an absurdly capable UK touring bike for the money. The CP3 triple is perfectly suited to British road riding: there's strong torque from 3,000rpm for pulling out of village junctions, a thrilling mid-range surge for Welsh pass assaults, and enough top-end for comfortable motorway cruising. The radar cruise control — included in the price, not a £500 option — makes the M6 marathon bearable, and the semi-active suspension flattens potholed B-roads without wallowing in corners. The panniers are included too, which saves the usual £500+ aftermarket expense. Range from the 18-litre tank is around 200 miles, which needs awareness on remote Highland runs but is adequate for most British touring. The riding position hits the sweet spot between sporty and upright, and the heated seat is a genuine luxury on a frosty Highland morning. The only real criticism is that the suspension can feel a touch firm on really rough roads, and the screen generates some turbulence around the helmet at certain heights. But the value proposition is staggering.",
    strengths: [
      "Radar cruise, panniers, heated seat all included in the price",
      "CP3 triple engine character is superb on British roads",
      "Semi-active suspension handles everything from motorways to potholed lanes",
      "Outstanding value — under-cuts rivals by thousands"
    ],
    weaknesses: [
      "Screen can create turbulence at certain heights — fiddle with adjustment",
      "18-litre tank requires attention on remote Highland legs",
      "Suspension can feel firm on the roughest roads"
    ],
    bestRoutes: ["nc500-complete", "welsh-mountain-passes", "scottish-highlands-loop"],
    gearRecommendations: [
      {
        category: "Luggage",
        items: [
          { name: "Yamaha 30L Top Case", price: "£280", url: "https://www.sportsbikeshop.co.uk/search/?search=Yamaha%2030L%20Top%20Case", note: "Colour-matched OEM top box" },
          { name: "Kriega US-20 Drypack", price: "£75", url: "https://www.sportsbikeshop.co.uk/search/?search=Kriega%20US-20%20Drypack", note: "Waterproof tail bag for extras" }
        ]
      },
      {
        category: "Protection",
        items: [
          { name: "SW-Motech Crash Bars", price: "£160", url: "https://www.sportsbikeshop.co.uk/search/?search=SW-Motech%20Crash%20Bars", note: "Steel engine protection" },
          { name: "Evotech Radiator Guard", price: "£55", url: "https://www.sportsbikeshop.co.uk/search/?search=Evotech%20Radiator%20Guard", note: "Protect the radiator from road debris" }
        ]
      },
      {
        category: "Comfort",
        items: [
          { name: "Yamaha Comfort Seat", price: "£240", url: "https://www.sportsbikeshop.co.uk/search/?search=Yamaha%20Comfort%20Seat", note: "Wider padding, lower profile" },
          { name: "Puig Touring Screen", price: "£95", url: "https://www.sportsbikeshop.co.uk/search/?search=Puig%20Touring%20Screen", note: "Taller screen reduces turbulence" }
        ]
      },
      {
        category: "Electronics",
        items: [
          { name: "Quad Lock Motorcycle Mount", price: "£70", url: "https://www.sportsbikeshop.co.uk/search/?search=Quad%20Lock%20Motorcycle%20Mount", note: "Vibration-dampened phone mount" },
          { name: "Cardo Freecom 4x", price: "£150", url: "https://www.sportsbikeshop.co.uk/search/?search=Cardo%20Freecom%204x", note: "Bluetooth comms with JBL speakers" }
        ]
      }
    ],
    touringTips: [
      "Experiment with the screen height — there's a sweet spot that eliminates buffeting, but it's different for every rider",
      "The radar cruise control needs a firmware update for best performance — check with your Yamaha dealer before touring",
      "Use the D-Mode 2 (Standard) for touring — Mode 1 (Sport) is too aggressive for all-day riding"
    ]
  },

  {
    slug: "honda-nt1100",
    name: "Honda NT1100",
    manufacturer: "Honda",
    category: "Sport Touring",
    year: "2024",
    image: "public/images/bikes/honda-nt1100.jpg",
    heroImage: "public/images/bikes/honda-nt1100-hero.jpg",
    specs: {
      engine: "1084cc Parallel Twin",
      power: "102 bhp",
      torque: "104 Nm",
      weight: "238 kg (wet)",
      seatHeight: "820 mm",
      tankCapacity: "20.1 litres",
      mpg: "55 mpg",
      fuelRange: "243 miles"
    },
    scores: {
      touring: 90,
      comfort: 90,
      handling: 78,
      value: 88,
      offroad: 10,
      pillion: 85
    },
    price: "From £11,999",
    overview: "The NT1100 is Honda doing what Honda does best: building an immensely practical, well-thought-out motorcycle that does everything well and nothing badly. Sharing its engine with the Africa Twin, the NT1100 wraps the 1084cc parallel twin in a dedicated road-touring chassis with a full fairing, excellent wind protection, and an integrated pannier system that looks like it was designed with the bike from day one (because it was). The optional DCT gearbox turns it into an almost car-like touring experience. It's not glamorous, but it's brilliantly effective.",
    touringReview: "The NT1100 might be the most underrated touring bike in Britain. The combination of that smooth, torquey Africa Twin engine with a proper touring chassis creates something quietly brilliant. The 20-litre tank and frugal 55mpg economy deliver an astonishing 243-mile range — you could ride from Manchester to Inverness on two fuel stops. The fairing and screen combination provides the best wind protection in the sport-touring class, and the pillion experience is genuinely comfortable for long distances. The DCT option makes it the easiest touring bike to ride in heavy traffic and on steep Highland passes. Where it's less convincing is outright excitement: the parallel twin is smooth but lacks the fizz of Yamaha's triple or Kawasaki's four, and the chassis is stable rather than playful. On the twistiest Welsh passes you might wish for something sharper. But for racking up huge touring miles in effortless comfort, particularly two-up, the NT1100 is hard to beat. Honda reliability seals the deal.",
    strengths: [
      "Outstanding 243-mile fuel range — best in the sport-touring class",
      "Integrated panniers look factory-finished and hold plenty",
      "Excellent wind protection and pillion comfort",
      "Honda reliability and DCT option for effortless touring"
    ],
    weaknesses: [
      "Parallel twin engine lacks the excitement of triple or four-cylinder rivals",
      "Handling is stable but not inspiring on tight, technical roads",
      "Looks are divisive — function over form"
    ],
    bestRoutes: ["nc500-complete", "channel-islands-explorer", "scottish-highlands-loop"],
    gearRecommendations: [
      {
        category: "Luggage",
        items: [
          { name: "Honda 50L Top Box", price: "£350", url: "https://www.sportsbikeshop.co.uk/search/?search=Honda%2050L%20Top%20Box", note: "OEM colour-matched, fits two helmets" },
          { name: "Kriega US-30 Drypack", price: "£100", url: "https://www.sportsbikeshop.co.uk/search/?search=Kriega%20US-30%20Drypack", note: "Waterproof tail bag for overflow gear" }
        ]
      },
      {
        category: "Protection",
        items: [
          { name: "Honda OEM Engine Guard", price: "£130", url: "https://www.sportsbikeshop.co.uk/search/?search=Honda%20OEM%20Engine%20Guard", note: "Steel protection bars" },
          { name: "Evotech Radiator Guard", price: "£50", url: "https://www.sportsbikeshop.co.uk/search/?search=Evotech%20Radiator%20Guard", note: "Stainless steel mesh protection" }
        ]
      },
      {
        category: "Comfort",
        items: [
          { name: "Honda Heated Grips", price: "£180", url: "https://www.sportsbikeshop.co.uk/search/?search=Honda%20Heated%20Grips", note: "OEM integrated, switchable" },
          { name: "Givi Airflow Screen", price: "£100", url: "https://www.sportsbikeshop.co.uk/search/?search=Givi%20Airflow%20Screen", note: "Adjustable height touring screen" }
        ]
      },
      {
        category: "Electronics",
        items: [
          { name: "Quad Lock Motorcycle Mount", price: "£70", url: "https://www.sportsbikeshop.co.uk/search/?search=Quad%20Lock%20Motorcycle%20Mount", note: "Vibration-dampened phone mount" },
          { name: "Oxford USB Dual Charger", price: "£25", url: "https://www.sportsbikeshop.co.uk/search/?search=Oxford%20USB%20Dual%20Charger", note: "Keep devices charged all day" }
        ]
      }
    ],
    touringTips: [
      "The integrated panniers hold more than they look — pack soft bags inside them for easy hotel carry",
      "If you have DCT, use D mode (Drive) for touring and S mode (Sport) only on mountain passes",
      "The NT1100 loves a steady cruise — resist the urge to wring its neck and enjoy the fuel economy instead"
    ]
  },

  {
    slug: "bmw-s-1000-xr",
    name: "BMW S 1000 XR",
    manufacturer: "BMW",
    category: "Sport Touring",
    year: "2024",
    image: "public/images/bikes/bmw-s-1000-xr.jpg",
    heroImage: "public/images/bikes/bmw-s-1000-xr-hero.jpg",
    specs: {
      engine: "999cc Inline-4",
      power: "165 bhp",
      torque: "114 Nm",
      weight: "226 kg (wet)",
      seatHeight: "840 mm",
      tankCapacity: "20 litres",
      mpg: "43 mpg",
      fuelRange: "189 miles"
    },
    scores: {
      touring: 84,
      comfort: 80,
      handling: 92,
      value: 68,
      offroad: 15,
      pillion: 70
    },
    price: "From £16,335",
    overview: "The S 1000 XR is BMW's answer to riders who want sportsbike performance in an upright, tour-capable package. The 999cc inline-four is derived from the S 1000 RR superbike, detuned to 165bhp but retaining the manic top-end rush and howling soundtrack. The chassis is taut and precise, the semi-active Dynamic ESA suspension is excellent, and the electronics suite — including shift assistant, cruise control, and multiple riding modes — is comprehensive. It's a wolf in adventure-touring clothing, and it's utterly intoxicating on fast roads.",
    touringReview: "On British A-roads, the S 1000 XR is phenomenal. The inline-four sings above 6,000rpm in a way that no twin or triple can match, and blasting through Scottish Highland A-roads with 165bhp on tap is an experience that borders on the religious. The chassis changes direction with sportsbike precision, making Welsh mountain passes feel like a track day. The semi-active suspension auto-adjusts brilliantly to Britain's inconsistent road surfaces, and the 20-litre tank gives just under 190 miles of range. But there are compromises for touring. The sportier riding position loads your wrists more than the GS or NT1100, and all-day motorway runs are more fatiguing. The screen is effective but generates turbulence at certain heights. Pillion comfort is adequate rather than generous. And the 43mpg real-world economy means Highland fuel management is a genuine concern. If your touring style is 'ride fast, arrive early, rest later,' the XR is magnificent. If it's 'cover huge miles in relaxed comfort,' look elsewhere.",
    strengths: [
      "165bhp inline-four is transcendent on fast A-roads",
      "Chassis precision is sportsbike-sharp",
      "Semi-active suspension handles any surface",
      "Looks and sounds spectacular"
    ],
    weaknesses: [
      "Sportier position fatigues on all-day motorway runs",
      "43mpg economy needs careful Highland fuel planning",
      "Pillion comfort is an afterthought"
    ],
    bestRoutes: ["scottish-highlands-loop", "welsh-mountain-passes", "lake-district-ultimate"],
    gearRecommendations: [
      {
        category: "Luggage",
        items: [
          { name: "BMW Touring Panniers", price: "£750 pair", url: "https://www.sportsbikeshop.co.uk/search/?search=BMW%20Touring%20Panniers", note: "OEM integrated, quick-release" },
          { name: "SW-Motech BLAZE Panniers", price: "£340 pair", url: "https://www.sportsbikeshop.co.uk/search/?search=SW-Motech%20BLAZE%20Panniers", note: "Sport-fit semi-rigid soft bags" }
        ]
      },
      {
        category: "Protection",
        items: [
          { name: "Wunderlich Engine Guard", price: "£240", url: "https://www.sportsbikeshop.co.uk/search/?search=Wunderlich%20Engine%20Guard", note: "Steel tube protection" },
          { name: "Evotech Frame Sliders", price: "£70", url: "https://www.sportsbikeshop.co.uk/search/?search=Evotech%20Frame%20Sliders", note: "Low-profile crash protection" }
        ]
      },
      {
        category: "Comfort",
        items: [
          { name: "BMW Comfort Seat", price: "£350", url: "https://www.sportsbikeshop.co.uk/search/?search=BMW%20Comfort%20Seat", note: "Lower, wider OEM touring seat" },
          { name: "Wunderlich Ergo Screen", price: "£165", url: "https://www.sportsbikeshop.co.uk/search/?search=Wunderlich%20Ergo%20Screen", note: "Taller, wider wind deflection" }
        ]
      },
      {
        category: "Electronics",
        items: [
          { name: "Quad Lock Motorcycle Mount", price: "£70", url: "https://www.sportsbikeshop.co.uk/search/?search=Quad%20Lock%20Motorcycle%20Mount", note: "Vibration-dampened phone mount" },
          { name: "Sena 50S Mesh Intercom", price: "£300", url: "https://www.sportsbikeshop.co.uk/search/?search=Sena%2050S%20Mesh%20Intercom", note: "Premium mesh Bluetooth system" }
        ]
      }
    ],
    touringTips: [
      "Use Road mode for touring — Dynamic mode on damp British roads with 165bhp is genuinely dangerous",
      "The shift assistant (quickshifter) works brilliantly on fast Highland roads — upshift and downshift without the clutch",
      "Pack light to preserve the XR's handling advantage — it's at its best when it's nimble"
    ]
  },

  // ──────────────────────────────────────────────────────────
  // CLASSIC / NAKED TOURING
  // ──────────────────────────────────────────────────────────

  {
    slug: "triumph-bonneville-t120",
    name: "Triumph Bonneville T120",
    manufacturer: "Triumph",
    category: "Naked",
    year: "2024",
    image: "public/images/bikes/triumph-bonneville-t120.jpg",
    heroImage: "public/images/bikes/triumph-bonneville-t120-hero.jpg",
    specs: {
      engine: "1200cc Parallel Twin",
      power: "80 bhp",
      torque: "105 Nm",
      weight: "236 kg (wet)",
      seatHeight: "790 mm",
      tankCapacity: "14.5 litres",
      mpg: "52 mpg",
      fuelRange: "166 miles"
    },
    scores: {
      touring: 72,
      comfort: 75,
      handling: 76,
      value: 78,
      offroad: 8,
      pillion: 70
    },
    price: "From £12,295",
    overview: "The Bonneville T120 is motorcycling's finest exercise in modern-retro engineering. It looks like a 1960s classic — the peashooter exhausts, the wire wheels, the sculpted tank — but underneath it's a thoroughly modern motorcycle with liquid cooling, ride-by-wire, ABS, traction control, and torque-assist clutch. The 1200cc high-torque parallel twin delivers its 105Nm at just 3,100rpm, which means enormous pulling power from idle. It's a bike that makes you ride differently: slower, more relaxed, more in the moment. Every journey on the T120 feels like a Sunday afternoon, regardless of what day it is.",
    touringReview: "Touring on a Bonneville T120 is a completely different philosophy to touring on an adventure bike, and it's a philosophy that suits British roads beautifully. The massive low-down torque means you can surf through Cotswold villages, potter along Cornish lanes, and cruise through the Lake District at a relaxed pace without ever feeling like you're missing out. The low 790mm seat height and modest weight inspire confidence on twisty mountain roads, and the upright riding position is comfortable for medium-distance days. Where the T120 falls down for serious touring is range: the 14.5-litre tank and 166-mile range means frequent stops in the Scottish Highlands. Wind protection is non-existent, so motorways are exhausting. And the retro-style wire wheels and classic tyres aren't confidence-inspiring on greasy winter roads. But strap a pair of waxed canvas roll bags to the back, stick to B-roads, and tour Britain at the pace it deserves — the T120 will reward you with the purest riding experience on this list.",
    strengths: [
      "Gorgeous classic styling turns heads at every stop",
      "Massive low-end torque perfect for relaxed B-road cruising",
      "Low seat height inspires confidence on all roads",
      "The ride experience is uniquely satisfying and connected"
    ],
    weaknesses: [
      "Small 14.5L tank limits range to 166 miles — problematic in Highlands",
      "Zero wind protection makes motorways exhausting",
      "Wire wheels and classic tyres less grip in wet conditions"
    ],
    bestRoutes: ["coastal-cornwall", "channel-islands-explorer", "lake-district-ultimate"],
    gearRecommendations: [
      {
        category: "Luggage",
        items: [
          { name: "Longride Waxed Canvas Roll Bags", price: "£260 pair", url: "https://www.sportsbikeshop.co.uk/search/?search=Longride%20Waxed%20Canvas%20Roll%20Bags", note: "Heritage look, waterproof lined" },
          { name: "Triumph Heritage Leather Panniers", price: "£580 pair", url: "https://www.sportsbikeshop.co.uk/search/?search=Triumph%20Heritage%20Leather%20Panniers", note: "OEM classic styling, quick-release" }
        ]
      },
      {
        category: "Protection",
        items: [
          { name: "SW-Motech Engine Guard", price: "£145", url: "https://www.sportsbikeshop.co.uk/search/?search=SW-Motech%20Engine%20Guard", note: "Steel bar protection, subtle design" },
          { name: "R&G Bar End Sliders", price: "£35", url: "https://www.sportsbikeshop.co.uk/search/?search=R%26G%20Bar%20End%20Sliders", note: "Handlebar-end protection" }
        ]
      },
      {
        category: "Comfort",
        items: [
          { name: "Triumph Touring Seat", price: "£290", url: "https://www.sportsbikeshop.co.uk/search/?search=Triumph%20Touring%20Seat", note: "Thicker padding for longer rides" },
          { name: "Dart Classic Flyscreen", price: "£95", url: "https://www.sportsbikeshop.co.uk/search/?search=Dart%20Classic%20Flyscreen", note: "Period-look windshield, some protection" }
        ]
      },
      {
        category: "Electronics",
        items: [
          { name: "Beeline Moto Navigation", price: "£100", url: "https://www.sportsbikeshop.co.uk/search/?search=Beeline%20Moto%20Navigation", note: "Minimalist compass-style nav — suits the retro vibe" },
          { name: "Oxford USB Socket", price: "£22", url: "https://www.sportsbikeshop.co.uk/search/?search=Oxford%20USB%20Socket", note: "Discreet flush-mount USB charging" }
        ]
      }
    ],
    touringTips: [
      "Embrace the Bonneville pace — this bike rewards riders who slow down and enjoy the journey",
      "The wire wheels look amazing but check spoke tension before any long tour — they do loosen",
      "Carry a small USB tank bag for essentials — the T120 has zero storage otherwise"
    ]
  },

  {
    slug: "kawasaki-z650",
    name: "Kawasaki Z650",
    manufacturer: "Kawasaki",
    category: "Naked",
    year: "2024",
    image: "public/images/bikes/kawasaki-z650.jpg",
    heroImage: "public/images/bikes/kawasaki-z650-hero.jpg",
    specs: {
      engine: "649cc Parallel Twin",
      power: "68 bhp",
      torque: "64 Nm",
      weight: "187 kg (wet)",
      seatHeight: "790 mm",
      tankCapacity: "15 litres",
      mpg: "56 mpg",
      fuelRange: "185 miles"
    },
    scores: {
      touring: 62,
      comfort: 60,
      handling: 84,
      value: 90,
      offroad: 5,
      pillion: 55
    },
    price: "From £6,899",
    overview: "The Z650 is the A2-licence-friendly naked that punches well above its weight. At 187kg wet it's one of the lightest bikes on this list, and the 649cc parallel twin is smooth, eager, and perfectly fuelled. It's a bike that does the basics brilliantly — it steers, stops, and goes with effortless precision. There's no riding modes, no TFT, no electronic suspension — just a well-engineered naked bike at a sensible price. For new riders or experienced riders wanting something light and simple, the Z650 is an excellent foundation.",
    touringReview: "Nobody buys a Z650 as a touring bike, but plenty of people end up touring on one — and that says everything about how capable it is. At 187kg it's absurdly light, which transforms tight roads: the Bealach na Ba, Hardknott Pass, and narrow Welsh lanes become properly fun rather than daunting. The parallel twin has enough grunt for comfortable A-road cruising and the fuel economy is excellent. The problems are all the things a dedicated tourer handles better: wind protection is non-existent, comfort deteriorates after two hours, the 15-litre tank limits range, and there's nowhere to put luggage without aftermarket additions. Motorway touring is deeply unpleasant above 70mph. But as a budget touring tool for someone who sticks to B-roads, covers 150 miles a day maximum, and is willing to add a screen and some soft luggage, the Z650 works far better than it should. It's the proof that any bike can be a touring bike if you're stubborn enough.",
    strengths: [
      "Lightest bike on this list — brilliant on tight, technical roads",
      "Budget-friendly purchase price and running costs",
      "Simple, reliable, and easy to maintain on the road",
      "A2-licence compliant — accessible for newer riders"
    ],
    weaknesses: [
      "No wind protection — motorways are torture above 60mph",
      "Comfort drops off sharply after two hours",
      "15-litre tank and no luggage provisions limit touring range"
    ],
    bestRoutes: ["coastal-cornwall", "welsh-mountain-passes", "channel-islands-explorer"],
    gearRecommendations: [
      {
        category: "Luggage",
        items: [
          { name: "Kriega US-20 Drypack", price: "£75", url: "https://www.sportsbikeshop.co.uk/search/?search=Kriega%20US-20%20Drypack", note: "Waterproof tail bag, straps to seat" },
          { name: "Oxford T-40 Tail Pack", price: "£60", url: "https://www.sportsbikeshop.co.uk/search/?search=Oxford%20T-40%20Tail%20Pack", note: "Budget-friendly expandable bag" }
        ]
      },
      {
        category: "Protection",
        items: [
          { name: "R&G Crash Protectors", price: "£45", url: "https://www.sportsbikeshop.co.uk/search/?search=R%26G%20Crash%20Protectors", note: "Frame-mount bobbins" },
          { name: "Evotech Radiator Guard", price: "£45", url: "https://www.sportsbikeshop.co.uk/search/?search=Evotech%20Radiator%20Guard", note: "Stainless steel mesh protection" }
        ]
      },
      {
        category: "Comfort",
        items: [
          { name: "MRA Touring Screen", price: "£85", url: "https://www.sportsbikeshop.co.uk/search/?search=MRA%20Touring%20Screen", note: "Bolt-on screen — essential for touring" },
          { name: "Airhawk Seat Cushion", price: "£90", url: "https://www.sportsbikeshop.co.uk/search/?search=Airhawk%20Seat%20Cushion", note: "Air cell comfort pad for longer rides" }
        ]
      },
      {
        category: "Electronics",
        items: [
          { name: "Quad Lock Motorcycle Mount", price: "£70", url: "https://www.sportsbikeshop.co.uk/search/?search=Quad%20Lock%20Motorcycle%20Mount", note: "Vibration-dampened phone mount" },
          { name: "Oxford Heated Grips", price: "£45", url: "https://www.sportsbikeshop.co.uk/search/?search=Oxford%20Heated%20Grips", note: "Absolutely essential for UK touring" }
        ]
      }
    ],
    touringTips: [
      "Fit a screen before any touring — even a small MRA or Puig screen transforms motorway comfort",
      "Pack light and use soft luggage — the Z650's handling advantage disappears under heavy loads",
      "Plan 150-mile days maximum — your body will thank you for shorter stints on a naked bike"
    ]
  },

  // ──────────────────────────────────────────────────────────
  // PURE TOURING
  // ──────────────────────────────────────────────────────────

  {
    slug: "bmw-k-1600-gt",
    name: "BMW K 1600 GT",
    manufacturer: "BMW",
    category: "Touring",
    year: "2024",
    image: "public/images/bikes/bmw-k-1600-gt.jpg",
    heroImage: "public/images/bikes/bmw-k-1600-gt-hero.jpg",
    specs: {
      engine: "1649cc Inline-6",
      power: "160 bhp",
      torque: "180 Nm",
      weight: "334 kg (wet)",
      seatHeight: "810/830 mm",
      tankCapacity: "26.5 litres",
      mpg: "40 mpg",
      fuelRange: "233 miles"
    },
    scores: {
      touring: 98,
      comfort: 98,
      handling: 68,
      value: 55,
      offroad: 2,
      pillion: 95
    },
    price: "From £21,900",
    overview: "The K 1600 GT is the ultimate expression of the touring motorcycle concept. BMW's 1649cc inline-six engine is the smoothest powerplant in motorcycling — it makes a Rolls-Royce feel agricultural. The 160bhp and 180Nm of torque arrive with creamy, relentless urgency, and the shaft drive delivers it without chain snatch or maintenance demands. Full electronic suspension, a massive adjustable screen, heated everything (grips, seat, armrests for the pillion), a reverse gear, and a stereo system complete the luxury-liner specification. It's a two-wheeled GT car that happens to lean into corners.",
    touringReview: "If you're planning a two-week, two-up tour of Britain covering 300+ miles a day, the K 1600 GT is the only bike on this list that can do it without either rider needing a chiropractor at the end. The inline-six engine is so smooth that vibration simply doesn't exist, and the 26.5-litre tank gives a genuine 233-mile range — enough for most legs without detour planning. The fairing and electric screen provide cocoon-like wind protection, and the heated seats turn chilly Highland mornings into a minor inconvenience rather than a misery. Motorways are the GT's natural habitat: it eats M-roads for breakfast. But here's the thing — this is a 334kg motorcycle, and on the twisty stuff that makes British touring magical, that weight is a serious penalty. Hardknott Pass on a fully-loaded K1600 is an act of courage, tight Cornish lanes are a geometry problem, and Highland single-track demands careful passing-place management. If your tour is 70% motorways and A-roads, the K1600 is peerless. If it's 70% B-roads and mountain passes, you'll wish for something lighter.",
    strengths: [
      "Inline-six engine is the smoothest in motorcycling — zero vibration",
      "26.5-litre tank gives enormous touring range",
      "Best pillion comfort of any motorcycle, period",
      "Heated everything, electric screen, reverse gear — ultimate luxury"
    ],
    weaknesses: [
      "334kg wet — terrifyingly heavy on tight, steep roads",
      "Extremely expensive to buy, insure, and maintain",
      "Useless on single-track Highland roads and tight mountain passes"
    ],
    bestRoutes: ["nc500-complete", "channel-islands-explorer", "scottish-highlands-loop"],
    gearRecommendations: [
      {
        category: "Luggage",
        items: [
          { name: "BMW System Panniers", price: "£980 pair", url: "https://www.sportsbikeshop.co.uk/search/?search=BMW%20System%20Panniers", note: "OEM expanding cases, 37L each" },
          { name: "BMW Top Case 49L", price: "£520", url: "https://www.sportsbikeshop.co.uk/search/?search=BMW%20Top%20Case%2049L", note: "Integrated top box with backrest" }
        ]
      },
      {
        category: "Protection",
        items: [
          { name: "Wunderlich Engine Guard", price: "£280", url: "https://www.sportsbikeshop.co.uk/search/?search=Wunderlich%20Engine%20Guard", note: "Full wrap-around steel protection" },
          { name: "BMW Cylinder Head Covers", price: "£120", url: "https://www.sportsbikeshop.co.uk/search/?search=BMW%20Cylinder%20Head%20Covers", note: "Protect the inline-six heads from grounding" }
        ]
      },
      {
        category: "Comfort",
        items: [
          { name: "BMW Comfort Seat Low", price: "£380", url: "https://www.sportsbikeshop.co.uk/search/?search=BMW%20Comfort%20Seat%20Low", note: "Lowered seat option for shorter riders" },
          { name: "BMW Backrest for Pillion", price: "£260", url: "https://www.sportsbikeshop.co.uk/search/?search=BMW%20Backrest%20for%20Pillion", note: "Adjustable pillion backrest — luxury" }
        ]
      },
      {
        category: "Electronics",
        items: [
          { name: "Garmin Zumo XT2", price: "£450", url: "https://www.sportsbikeshop.co.uk/search/?search=Garmin%20Zumo%20XT2", note: "Premium motorcycle GPS" },
          { name: "Sena 50S Mesh Intercom", price: "£300", url: "https://www.sportsbikeshop.co.uk/search/?search=Sena%2050S%20Mesh%20Intercom", note: "Rider-pillion communication" }
        ]
      }
    ],
    touringTips: [
      "Use the reverse gear in tight Highland car parks — manoeuvring 334kg backwards on a slope is no joke",
      "Set the Dynamic ESA to Comfort mode and leave it — the suspension handles everything from motorways to B-roads",
      "Plan your route to minimise single-track roads — the GT is magnificent on A-roads but punishing on narrow lanes"
    ]
  },

  {
    slug: "honda-gold-wing",
    name: "Honda Gold Wing Tour",
    manufacturer: "Honda",
    category: "Touring",
    year: "2024",
    image: "public/images/bikes/honda-gold-wing.jpg",
    heroImage: "public/images/bikes/honda-gold-wing-hero.jpg",
    specs: {
      engine: "1833cc Flat-6",
      power: "126 bhp",
      torque: "170 Nm",
      weight: "367 kg (wet)",
      seatHeight: "745 mm",
      tankCapacity: "21.1 litres",
      mpg: "40 mpg",
      fuelRange: "186 miles"
    },
    scores: {
      touring: 96,
      comfort: 99,
      handling: 58,
      value: 52,
      offroad: 0,
      pillion: 98
    },
    price: "From £31,599",
    overview: "The Gold Wing is the undisputed king of touring motorcycles and has been for four decades. The latest generation pairs a 1833cc flat-six engine with Honda's DCT automatic gearbox, Apple CarPlay, a 7-inch TFT display, electric windscreen, heated grips and seat, airbag (Tour Airbag variant), and enough luggage capacity to move house. The flat-six engine is impossibly smooth and delivers its torque with a grace that no other motorcycle engine can match. At 367kg it's essentially a motorcycle-shaped luxury car, and that's precisely the point.",
    touringReview: "Touring Britain on a Gold Wing is an exercise in unapologetic luxury. Your pillion will arrive at John o'Groats fresher than they left London, the stereo will have played every album in your collection, and the heated seats will have fended off every Scottish downpour. The DCT gearbox makes stop-start Highland village traffic effortless, and the low centre of gravity from the flat-six engine gives the Gold Wing a stability that belies its 367kg mass — it genuinely feels lighter than the BMW K1600 in corners. The 186-mile range from the 21-litre tank is the Gold Wing's Achilles heel for touring: on a bike this big, you'd expect a bigger tank, and Highland fuel stops need planning. And at 367kg, single-track roads and steep mountain passes are simply off the menu — Hardknott Pass would be genuinely dangerous, and the Bealach na Ba would require serious bravery. If your British tour sticks to A-roads, motorways, and the gentler scenic routes, the Gold Wing is the most comfortable way to see the country on two wheels. Just don't try to be a hero on the passes.",
    strengths: [
      "Flat-six engine is the smoothest, most refined motorcycle powerplant ever made",
      "DCT gearbox makes every mile effortless",
      "Pillion comfort is unmatched — armchair-level luxury",
      "Apple CarPlay, airbag option, and integrated luggage — touring nirvana"
    ],
    weaknesses: [
      "367kg — the heaviest motorcycle on this list by a huge margin",
      "21-litre tank on a bike this thirsty limits range to 186 miles",
      "Steep mountain passes and single-track roads are effectively impossible"
    ],
    bestRoutes: ["channel-islands-explorer", "nc500-complete", "coastal-cornwall"],
    gearRecommendations: [
      {
        category: "Luggage",
        items: [
          { name: "Honda Integrated Top Box 61L", price: "£580", url: "https://www.sportsbikeshop.co.uk/search/?search=Honda%20Integrated%20Top%20Box%2061L", note: "Massive OEM top case with passenger backrest" },
          { name: "Goldstrike Trunk Rack", price: "£120", url: "https://www.sportsbikeshop.co.uk/search/?search=Goldstrike%20Trunk%20Rack", note: "Extra rack for dry bags on top of the trunk" }
        ]
      },
      {
        category: "Protection",
        items: [
          { name: "Honda OEM Engine Guard", price: "£220", url: "https://www.sportsbikeshop.co.uk/search/?search=Honda%20OEM%20Engine%20Guard", note: "Chrome or black, full lower coverage" },
          { name: "Kuryakyn Highway Pegs", price: "£95", url: "https://www.sportsbikeshop.co.uk/search/?search=Kuryakyn%20Highway%20Pegs", note: "Rest your feet on long straights" }
        ]
      },
      {
        category: "Comfort",
        items: [
          { name: "Corbin Dual Touring Saddle", price: "£550", url: "https://www.sportsbikeshop.co.uk/search/?search=Corbin%20Dual%20Touring%20Saddle", note: "Custom-shaped all-day seat" },
          { name: "Honda Tall Windscreen", price: "£210", url: "https://www.sportsbikeshop.co.uk/search/?search=Honda%20Tall%20Windscreen", note: "Extended height electric screen" }
        ]
      },
      {
        category: "Electronics",
        items: [
          { name: "Sena 50S Mesh Intercom", price: "£300", url: "https://www.sportsbikeshop.co.uk/search/?search=Sena%2050S%20Mesh%20Intercom", note: "Rider-pillion Bluetooth comms" },
          { name: "Oxford USB Dual Charger", price: "£25", url: "https://www.sportsbikeshop.co.uk/search/?search=Oxford%20USB%20Dual%20Charger", note: "Backup charging for multiple devices" }
        ]
      }
    ],
    touringTips: [
      "Use the walking mode (low-speed reverse and forward assist) in tight car parks — it's not cheating, it's survival",
      "The Gold Wing handles far better than its weight suggests, but never forget the weight on steep descents — engine braking in a low gear is your friend",
      "Plan fuel stops carefully — the 186-mile range is the Gold Wing's weakest touring attribute"
    ]
  },

  // ──────────────────────────────────────────────────────────
  // SPORT BIKES USED FOR TOURING
  // ──────────────────────────────────────────────────────────

  {
    slug: "suzuki-gsx-r1000r",
    name: "Suzuki GSX-R1000R",
    manufacturer: "Suzuki",
    category: "Sport",
    year: "2024",
    image: "public/images/bikes/suzuki-gsx-r1000r.jpg",
    heroImage: "public/images/bikes/suzuki-gsx-r1000r-hero.jpg",
    specs: {
      engine: "999cc Inline-4",
      power: "202 bhp",
      torque: "117 Nm",
      weight: "203 kg (wet)",
      seatHeight: "825 mm",
      tankCapacity: "16 litres",
      mpg: "38 mpg",
      fuelRange: "134 miles"
    },
    scores: {
      touring: 35,
      comfort: 25,
      handling: 98,
      value: 72,
      offroad: 0,
      pillion: 20
    },
    price: "From £16,599",
    overview: "The GSX-R1000R is an uncompromising litre-class superbike: 202bhp, a chassis developed on the MotoGP grid, and an aggressive riding position that leaves no doubt about its intended purpose. Variable valve timing, a bi-directional quickshifter, and launch control make it devastatingly fast on track. It's not a touring bike by any rational measure. But rationality has never stopped bikers from strapping a tail bag to a sportsbike and pointing it at Scotland, and there's a long tradition of exactly this kind of glorious stupidity in British motorcycling.",
    touringReview: "Let's be honest: touring on a GSX-R1000R is an exercise in masochism that's perversely rewarding. The riding position turns your wrists into pain conductors after 90 minutes, your lower back will file a formal complaint after two hours, and the 16-litre tank gives you a pathetic 134-mile range that means fuel stops every hour and a half. Wind protection is non-existent, the seat is a plank, and the pillion perch is decorative at best. But — and this is a significant but — on the actual riding bits of a British tour, nothing on this list comes close. Threading the Quiraing on Skye with 202bhp and a chassis this precise is a life-defining experience. The A4069 Black Mountain Pass on a Gixxer thousand is the stuff biker dreams are made of. You'll suffer on the motorways, you'll suffer at fuel stations, you'll suffer setting up camp with aching wrists — but the riding itself will be transcendent. Touring on a GSX-R is not sensible. It is, however, unforgettable.",
    strengths: [
      "202bhp and the best handling on this list — unmatched on fast roads",
      "Lightweight at 203kg — nimble through everything",
      "The riding experience on good roads is transcendent",
      "Quickshifter makes fast-road riding seamless"
    ],
    weaknesses: [
      "Riding position is agony after 90 minutes",
      "134-mile range means constant fuel stops",
      "Zero wind protection, zero luggage, zero comfort"
    ],
    bestRoutes: ["welsh-mountain-passes", "lake-district-ultimate", "scottish-highlands-loop"],
    gearRecommendations: [
      {
        category: "Luggage",
        items: [
          { name: "Kriega US-20 Drypack", price: "£75", url: "https://www.sportsbikeshop.co.uk/search/?search=Kriega%20US-20%20Drypack", note: "Waterproof tail bag — all the luggage you'll manage" },
          { name: "Kriega R20 Backpack", price: "£115", url: "https://www.sportsbikeshop.co.uk/search/?search=Kriega%20R20%20Backpack", note: "Waterproof rucksack when the tail is full" }
        ]
      },
      {
        category: "Protection",
        items: [
          { name: "R&G Aero Crash Protectors", price: "£55", url: "https://www.sportsbikeshop.co.uk/search/?search=R%26G%20Aero%20Crash%20Protectors", note: "Frame bobbins — essential for touring drops" },
          { name: "Evotech Tail Tidy", price: "£60", url: "https://www.sportsbikeshop.co.uk/search/?search=Evotech%20Tail%20Tidy", note: "Cleaner rear end and number plate protection" }
        ]
      },
      {
        category: "Comfort",
        items: [
          { name: "Airhawk Seat Cushion", price: "£90", url: "https://www.sportsbikeshop.co.uk/search/?search=Airhawk%20Seat%20Cushion", note: "Air cell pad — difference between agony and merely uncomfortable" },
          { name: "Puig Racing Screen Tall", price: "£80", url: "https://www.sportsbikeshop.co.uk/search/?search=Puig%20Racing%20Screen%20Tall", note: "Slightly better wind protection than standard" }
        ]
      },
      {
        category: "Electronics",
        items: [
          { name: "Quad Lock Motorcycle Mount", price: "£70", url: "https://www.sportsbikeshop.co.uk/search/?search=Quad%20Lock%20Motorcycle%20Mount", note: "Vibration-dampened phone mount" },
          { name: "Oxford USB Socket", price: "£22", url: "https://www.sportsbikeshop.co.uk/search/?search=Oxford%20USB%20Socket", note: "Essential — the phone is your only navigation" }
        ]
      }
    ],
    touringTips: [
      "Plan 130-mile fuel stops and stick to them — running dry on the A9 is not a story you want to tell",
      "Stretch every hour — genuinely, stop, get off, stretch your wrists and back, then carry on",
      "Pack half of what you think you need and accept that the GSX-R touring experience is about the riding, not the comfort"
    ]
  },

  {
    slug: "kawasaki-ninja-650",
    name: "Kawasaki Ninja 650",
    manufacturer: "Kawasaki",
    category: "Sport",
    year: "2024",
    image: "public/images/bikes/kawasaki-ninja-650.jpg",
    heroImage: "public/images/bikes/kawasaki-ninja-650-hero.jpg",
    specs: {
      engine: "649cc Parallel Twin",
      power: "68 bhp",
      torque: "64 Nm",
      weight: "192 kg (wet)",
      seatHeight: "790 mm",
      tankCapacity: "15 litres",
      mpg: "55 mpg",
      fuelRange: "182 miles"
    },
    scores: {
      touring: 65,
      comfort: 68,
      handling: 82,
      value: 92,
      offroad: 5,
      pillion: 60
    },
    price: "From £7,199",
    overview: "The Ninja 650 is one of the most deceptive motorcycles on sale. It looks like a sportsbike — the full fairing, the twin headlights, the aggressive stance — but ride it and you discover an upright, comfortable riding position, a smooth and tractable parallel twin, and manners so friendly that complete beginners feel at home within minutes. It's A2-licence compliant, which means it's many riders' first big bike, but it's also genuinely capable enough that experienced riders keep them for years. The fairing provides useful wind protection that the naked Z650 completely lacks, making the Ninja significantly more comfortable for touring.",
    touringReview: "The Ninja 650 is the accidental touring bike. Thousands of UK riders have discovered that the bike they bought as a stylish commuter is actually a surprisingly competent tourer. The fairing gives it a meaningful advantage over the naked Z650 for longer rides — you'll manage four-hour motorway stints without the wind exhaustion that plagues unfaired bikes. The parallel twin has just enough power for comfortable overtakes and enough economy for 182-mile range, which is respectable from a 15-litre tank. At 192kg it's light enough for confident handling on Cornish lanes and Welsh mountain passes, and the friendly chassis means newer riders can tackle the Lake District passes without fear. The limitations are all in the details: the seat gets uncomfortable after three hours, there's no cruise control, and the lack of luggage provisions means you need aftermarket soft bags. For budget-conscious riders who want a bike that looks sharp, commutes through the week, and tours at weekends, the Ninja 650 is an outstanding choice. It's proof that you don't need a £20k adventure bike to have a brilliant time on British roads.",
    strengths: [
      "Full fairing gives useful wind protection for touring",
      "Lightweight, friendly, and confidence-inspiring for all skill levels",
      "A2-licence compliant — accessible for newer riders",
      "Outstanding value — leaves thousands in budget for gear and fuel"
    ],
    weaknesses: [
      "Seat comfort deteriorates after three hours",
      "No cruise control or electronic rider aids",
      "15-litre tank requires regular fuel stops in remote areas"
    ],
    bestRoutes: ["coastal-cornwall", "channel-islands-explorer", "welsh-mountain-passes"],
    gearRecommendations: [
      {
        category: "Luggage",
        items: [
          { name: "Givi E22 Side Cases", price: "£180 pair", url: "https://www.sportsbikeshop.co.uk/search/?search=Givi%20E22%20Side%20Cases", note: "Budget hard panniers, 22L each" },
          { name: "Oxford T-40 Tail Pack", price: "£60", url: "https://www.sportsbikeshop.co.uk/search/?search=Oxford%20T-40%20Tail%20Pack", note: "Expandable waterproof seat bag" }
        ]
      },
      {
        category: "Protection",
        items: [
          { name: "R&G Aero Crash Protectors", price: "£50", url: "https://www.sportsbikeshop.co.uk/search/?search=R%26G%20Aero%20Crash%20Protectors", note: "Frame-mount crash bobbins" },
          { name: "Evotech Radiator Guard", price: "£45", url: "https://www.sportsbikeshop.co.uk/search/?search=Evotech%20Radiator%20Guard", note: "Stainless steel mesh protection" }
        ]
      },
      {
        category: "Comfort",
        items: [
          { name: "Kawasaki Comfort Seat", price: "£230", url: "https://www.sportsbikeshop.co.uk/search/?search=Kawasaki%20Comfort%20Seat", note: "Wider padding, better shape" },
          { name: "Puig Touring Screen", price: "£85", url: "https://www.sportsbikeshop.co.uk/search/?search=Puig%20Touring%20Screen", note: "Taller screen for improved motorway comfort" }
        ]
      },
      {
        category: "Electronics",
        items: [
          { name: "Quad Lock Motorcycle Mount", price: "£70", url: "https://www.sportsbikeshop.co.uk/search/?search=Quad%20Lock%20Motorcycle%20Mount", note: "Vibration-dampened phone mount" },
          { name: "Oxford Heated Grips", price: "£45", url: "https://www.sportsbikeshop.co.uk/search/?search=Oxford%20Heated%20Grips", note: "Essential for year-round UK riding" }
        ]
      }
    ],
    touringTips: [
      "The fairing gives the Ninja a big touring advantage over the Z650 — if you're choosing between them for touring, pick the Ninja",
      "Upgrade the seat before your first big tour — the OEM seat is the weakest link for long distances",
      "The parallel twin loves being revved — don't lug it in top gear on A-roads, short-shift and keep it singing"
    ]
  },

  // ──────────────────────────────────────────────────────────
  // VERSATILE
  // ──────────────────────────────────────────────────────────

  {
    slug: "kawasaki-versys-650",
    name: "Kawasaki Versys 650",
    manufacturer: "Kawasaki",
    category: "Versatile",
    year: "2024",
    image: "public/images/bikes/kawasaki-versys-650.jpg",
    heroImage: "public/images/bikes/kawasaki-versys-650-hero.jpg",
    specs: {
      engine: "649cc Parallel Twin",
      power: "69 bhp",
      torque: "64 Nm",
      weight: "216 kg (wet)",
      seatHeight: "840 mm",
      tankCapacity: "21 litres",
      mpg: "55 mpg",
      fuelRange: "254 miles"
    },
    scores: {
      touring: 84,
      comfort: 82,
      handling: 78,
      value: 92,
      offroad: 20,
      pillion: 76
    },
    price: "From £7,749",
    overview: "The Versys 650 is Kawasaki's Swiss Army knife — a bike designed to do everything reasonably well rather than one thing brilliantly. The 649cc parallel twin is shared with the Z650 and Ninja 650, but here it's wrapped in a taller, more upright chassis with a 21-litre tank, a decent screen, and available hard panniers. It looks a bit odd — the high-mounted twin headlights and long-legged stance divide opinion — but ride it and the ergonomics make perfect sense for all-day comfort. It's a touring bike disguised as something more utilitarian, and it's quietly brilliant.",
    touringReview: "The Versys 650 is the secret weapon of UK touring. That 21-litre tank combined with 55mpg economy gives you a staggering 254-mile range — comfortably the longest legs in the middleweight class. You can ride the entire NC500 north coast from Durness to John o'Groats without thinking about fuel, which is a genuine luxury. The upright riding position is all-day comfortable, the screen works well enough for motorway cruising, and the long-travel suspension copes admirably with Britain's potholed B-roads. It's not exciting — the engine is willing but bland, the chassis is stable but uninspiring, and the styling won't win any beauty contests. But it covers ground with a quiet efficiency that lets you focus on the scenery rather than the bike, and there's something genuinely liberating about that. For budget-conscious riders who want to tour Britain seriously without spending adventure-bike money, the Versys 650 with a set of panniers is the smartest purchase on this list.",
    strengths: [
      "254-mile fuel range — longest in the middleweight class",
      "All-day comfort from the upright touring position",
      "Excellent value with optional pannier package",
      "Reliable parallel twin engine — proven over millions of miles"
    ],
    weaknesses: [
      "Engine character is willing but uninspiring",
      "Styling divides opinion — it's not a looker",
      "Heavier than Z650 and Ninja 650 despite sharing the engine"
    ],
    bestRoutes: ["nc500-complete", "coastal-cornwall", "scottish-highlands-loop"],
    gearRecommendations: [
      {
        category: "Luggage",
        items: [
          { name: "Kawasaki 28L Panniers", price: "£500 pair", url: "https://www.sportsbikeshop.co.uk/search/?search=Kawasaki%2028L%20Panniers", note: "OEM colour-matched hard cases" },
          { name: "Givi Trekker 33L", price: "£220 each", url: "https://www.sportsbikeshop.co.uk/search/?search=Givi%20Trekker%2033L", note: "Rugged aluminium alternative" }
        ]
      },
      {
        category: "Protection",
        items: [
          { name: "SW-Motech Crash Bars", price: "£140", url: "https://www.sportsbikeshop.co.uk/search/?search=SW-Motech%20Crash%20Bars", note: "Steel engine protection" },
          { name: "Givi Sump Guard", price: "£75", url: "https://www.sportsbikeshop.co.uk/search/?search=Givi%20Sump%20Guard", note: "Aluminium lower protection" }
        ]
      },
      {
        category: "Comfort",
        items: [
          { name: "Kawasaki Comfort Seat", price: "£240", url: "https://www.sportsbikeshop.co.uk/search/?search=Kawasaki%20Comfort%20Seat", note: "Wider padding OEM seat" },
          { name: "MRA Vario Touring Screen", price: "£110", url: "https://www.sportsbikeshop.co.uk/search/?search=MRA%20Vario%20Touring%20Screen", note: "Height-adjustable screen upgrade" }
        ]
      },
      {
        category: "Electronics",
        items: [
          { name: "Quad Lock Motorcycle Mount", price: "£70", url: "https://www.sportsbikeshop.co.uk/search/?search=Quad%20Lock%20Motorcycle%20Mount", note: "Vibration-dampened phone mount" },
          { name: "Oxford Heated Grips", price: "£45", url: "https://www.sportsbikeshop.co.uk/search/?search=Oxford%20Heated%20Grips", note: "Essential for UK touring comfort" }
        ]
      }
    ],
    touringTips: [
      "The Versys's biggest touring asset is the 21L tank — embrace the range advantage and skip fuel stops that other riders need",
      "Add heated grips and a taller screen and the Versys transforms from 'adequate tourer' to 'genuinely good tourer'",
      "The parallel twin is smooth but characterless — keep it above 5,000rpm on twisty roads for the best experience"
    ]
  },

  {
    slug: "honda-cb500x",
    name: "Honda CB500X",
    manufacturer: "Honda",
    category: "Versatile",
    year: "2024",
    image: "public/images/bikes/honda-cb500x.jpg",
    heroImage: "public/images/bikes/honda-cb500x-hero.jpg",
    specs: {
      engine: "471cc Parallel Twin",
      power: "47 bhp",
      torque: "43 Nm",
      weight: "197 kg (wet)",
      seatHeight: "830 mm",
      tankCapacity: "17.7 litres",
      mpg: "65 mpg",
      fuelRange: "253 miles"
    },
    scores: {
      touring: 74,
      comfort: 75,
      handling: 80,
      value: 94,
      offroad: 30,
      pillion: 62
    },
    price: "From £6,499",
    overview: "The CB500X is Honda's entry into the adventure-touring world and it's one of the most intelligent motorcycles you can buy. At 47bhp it's A2-licence friendly, which means newer riders can access its touring capability from day one. The 471cc parallel twin is impeccably smooth, the build quality is pure Honda excellence, and the 19-inch front wheel gives it genuine adventure-bike proportions. It's not fast, it's not flashy, and it won't impress the café racer crowd — but it will run for 100,000 miles without breaking, return 65mpg while doing it, and take you anywhere in Britain with quiet competence.",
    touringReview: "The CB500X is the ultimate proof that you don't need a big, expensive adventure bike to tour Britain properly. The combination of Honda's bulletproof 471cc twin, a 17.7-litre tank, and 65mpg economy delivers a remarkable 253-mile range — you'll ride past fuel stations that bigger bikes need to stop at. The light weight and friendly power delivery make it perfect for newer riders tackling their first Scottish tour, and experienced riders will appreciate how relaxing it is on long days. Wind protection from the adjustable screen is reasonable for a bike at this price, and the upright position suits six-hour riding days without complaint. The limitations are real: 47bhp feels thin on motorways, overtaking requires commitment and planning, and dual carriageways above 70mph are near the bike's comfort zone. Pillion touring is possible but not recommended for long distances. But stick to A-roads and B-roads at 50-60mph and the CB500X reveals itself as one of the sweetest touring experiences available — smooth, economical, reliable, and genuinely pleasant. It's the bike that reminds you touring is about the journey, not the horsepower.",
    strengths: [
      "253-mile range from exceptional fuel economy",
      "A2-licence friendly — perfect first touring bike",
      "Honda reliability over enormous mileages",
      "Lightest adventure-styled bike — easy for all riders"
    ],
    weaknesses: [
      "47bhp is genuinely limiting for motorway overtaking",
      "Pillion touring is cramped on longer rides",
      "Wind protection adequate but not class-leading"
    ],
    bestRoutes: ["coastal-cornwall", "channel-islands-explorer", "welsh-mountain-passes"],
    gearRecommendations: [
      {
        category: "Luggage",
        items: [
          { name: "Honda 35L Panniers", price: "£420 pair", url: "https://www.sportsbikeshop.co.uk/search/?search=Honda%2035L%20Panniers", note: "OEM colour-matched hard cases" },
          { name: "Kriega OS-18 Adventure Packs", price: "£120 each", url: "https://www.sportsbikeshop.co.uk/search/?search=Kriega%20OS-18%20Adventure%20Packs", note: "Modular waterproof soft bags" }
        ]
      },
      {
        category: "Protection",
        items: [
          { name: "Honda OEM Crash Bars", price: "£110", url: "https://www.sportsbikeshop.co.uk/search/?search=Honda%20OEM%20Crash%20Bars", note: "Steel engine protection" },
          { name: "SW-Motech Sump Guard", price: "£80", url: "https://www.sportsbikeshop.co.uk/search/?search=SW-Motech%20Sump%20Guard", note: "Aluminium lower protection" }
        ]
      },
      {
        category: "Comfort",
        items: [
          { name: "Honda Comfort Seat", price: "£200", url: "https://www.sportsbikeshop.co.uk/search/?search=Honda%20Comfort%20Seat", note: "Wider, softer OEM seat" },
          { name: "Givi Touring Screen", price: "£75", url: "https://www.sportsbikeshop.co.uk/search/?search=Givi%20Touring%20Screen", note: "Taller replacement windscreen" }
        ]
      },
      {
        category: "Electronics",
        items: [
          { name: "Quad Lock Motorcycle Mount", price: "£70", url: "https://www.sportsbikeshop.co.uk/search/?search=Quad%20Lock%20Motorcycle%20Mount", note: "Vibration-dampened phone mount" },
          { name: "Oxford Heated Grips", price: "£45", url: "https://www.sportsbikeshop.co.uk/search/?search=Oxford%20Heated%20Grips", note: "Essential for year-round UK riding" }
        ]
      }
    ],
    touringTips: [
      "Accept the CB500X's pace and it'll reward you — trying to hustle it on motorways is frustrating, but B-roads at 50mph are blissful",
      "The 19-inch front wheel handles gravel tracks and rough car parks far better than most road bikes — use that capability",
      "Pack even lighter than you think you need — every kilogram matters more at 47bhp than on any other bike here"
    ]
  }

];
