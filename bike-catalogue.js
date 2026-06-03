/**
 * Motorcycle catalogue for garage dropdowns and fuel/range calculations.
 * Each entry has make, models with tank size (litres) and typical MPG.
 * Used by the garage "Add Bike" form and the route builder fuel range tool.
 */
const BIKE_CATALOGUE = {
  "Aprilia": [
    { model: "Tuareg 660", tank: 18, mpg: 55, category: "Adventure" },
    { model: "Tuono V4 1100", tank: 18.5, mpg: 36, category: "Naked" },
    { model: "RS 660", tank: 15, mpg: 52, category: "Sport" },
    { model: "RSV4", tank: 18.5, mpg: 35, category: "Sport" },
    { model: "Caponord 1200", tank: 24, mpg: 45, category: "Adventure" }
  ],
  "BMW": [
    { model: "R 1250 GS", tank: 20, mpg: 48, category: "Adventure" },
    { model: "R 1250 GS Adventure", tank: 30, mpg: 46, category: "Adventure" },
    { model: "R 1300 GS", tank: 19.5, mpg: 50, category: "Adventure" },
    { model: "R 1300 GS Adventure", tank: 30, mpg: 48, category: "Adventure" },
    { model: "F 900 GS", tank: 14.5, mpg: 55, category: "Adventure" },
    { model: "F 900 GS Adventure", tank: 23, mpg: 53, category: "Adventure" },
    { model: "F 850 GS", tank: 15, mpg: 55, category: "Adventure" },
    { model: "F 850 GS Adventure", tank: 23, mpg: 53, category: "Adventure" },
    { model: "F 750 GS", tank: 15, mpg: 58, category: "Adventure" },
    { model: "G 310 GS", tank: 11, mpg: 72, category: "Adventure" },
    { model: "S 1000 XR", tank: 20, mpg: 43, category: "Sport Tourer" },
    { model: "S 1000 RR", tank: 16.5, mpg: 35, category: "Sport" },
    { model: "K 1600 GT", tank: 26.5, mpg: 40, category: "Grand Tourer" },
    { model: "K 1600 GTL", tank: 26.5, mpg: 40, category: "Grand Tourer" },
    { model: "K 1600 B", tank: 26.5, mpg: 40, category: "Grand Tourer" },
    { model: "R 1250 RT", tank: 25, mpg: 47, category: "Grand Tourer" },
    { model: "R NineT", tank: 18, mpg: 45, category: "Retro" },
    { model: "R 12", tank: 15, mpg: 48, category: "Retro" },
    { model: "F 900 R", tank: 13, mpg: 55, category: "Naked" },
    { model: "M 1000 R", tank: 16.5, mpg: 32, category: "Sport" },
    { model: "R 18", tank: 16, mpg: 42, category: "Cruiser" },
    { model: "R 18 Transcontinental", tank: 24, mpg: 40, category: "Grand Tourer" },
    { model: "CE 04", tank: 0, mpg: 0, category: "Electric", rangeKm: 130 }
  ],
  "Benelli": [
    { model: "TRK 502", tank: 20, mpg: 55, category: "Adventure" },
    { model: "TRK 502 X", tank: 20, mpg: 53, category: "Adventure" },
    { model: "Leoncino 500", tank: 12.5, mpg: 55, category: "Naked" },
    { model: "752 S", tank: 14, mpg: 48, category: "Naked" }
  ],
  "CFMOTO": [
    { model: "800MT", tank: 19, mpg: 50, category: "Adventure" },
    { model: "450MT", tank: 15, mpg: 60, category: "Adventure" },
    { model: "700CL-X Sport", tank: 12, mpg: 55, category: "Naked" },
    { model: "450NK", tank: 13.5, mpg: 62, category: "Naked" }
  ],
  "Ducati": [
    { model: "Multistrada V4 S", tank: 22, mpg: 44, category: "Adventure" },
    { model: "Multistrada V4 Rally", tank: 30, mpg: 42, category: "Adventure" },
    { model: "Multistrada V2 S", tank: 18, mpg: 48, category: "Adventure" },
    { model: "DesertX", tank: 21, mpg: 48, category: "Adventure" },
    { model: "DesertX Rally", tank: 21, mpg: 46, category: "Adventure" },
    { model: "Scrambler 800", tank: 13.5, mpg: 52, category: "Retro" },
    { model: "Monster", tank: 15, mpg: 45, category: "Naked" },
    { model: "Streetfighter V4 S", tank: 16, mpg: 35, category: "Naked" },
    { model: "Panigale V4 S", tank: 16, mpg: 32, category: "Sport" },
    { model: "Diavel V4", tank: 17, mpg: 40, category: "Cruiser" },
    { model: "Hypermotard 950", tank: 14.5, mpg: 42, category: "Supermoto" },
    { model: "Scrambler Icon", tank: 13.5, mpg: 54, category: "Retro" }
  ],
  "Harley-Davidson": [
    { model: "Pan America 1250", tank: 17.5, mpg: 42, category: "Adventure" },
    { model: "Road Glide", tank: 22.7, mpg: 38, category: "Grand Tourer" },
    { model: "Street Glide", tank: 22.7, mpg: 38, category: "Grand Tourer" },
    { model: "Road King", tank: 22.7, mpg: 38, category: "Grand Tourer" },
    { model: "Fat Boy", tank: 18.9, mpg: 40, category: "Cruiser" },
    { model: "Heritage Classic", tank: 18.9, mpg: 40, category: "Cruiser" },
    { model: "Sportster S", tank: 11.8, mpg: 42, category: "Cruiser" },
    { model: "Nightster", tank: 11.8, mpg: 45, category: "Cruiser" },
    { model: "Low Rider ST", tank: 18.9, mpg: 40, category: "Cruiser" },
    { model: "LiveWire", tank: 0, mpg: 0, category: "Electric", rangeKm: 235 }
  ],
  "Honda": [
    { model: "CRF1100L Africa Twin", tank: 18.8, mpg: 50, category: "Adventure" },
    { model: "CRF1100L Africa Twin Adventure Sports", tank: 24.8, mpg: 48, category: "Adventure" },
    { model: "NT1100", tank: 20.1, mpg: 55, category: "Sport Tourer" },
    { model: "Gold Wing Tour", tank: 21.1, mpg: 40, category: "Grand Tourer" },
    { model: "Gold Wing", tank: 21.1, mpg: 40, category: "Grand Tourer" },
    { model: "CB500X", tank: 17.7, mpg: 65, category: "Adventure" },
    { model: "CB750 Hornet", tank: 15.2, mpg: 58, category: "Naked" },
    { model: "CB650R", tank: 15.4, mpg: 52, category: "Naked" },
    { model: "CBR650R", tank: 15.4, mpg: 50, category: "Sport" },
    { model: "CBR1000RR-R Fireblade", tank: 16.1, mpg: 33, category: "Sport" },
    { model: "XL750 Transalp", tank: 16.9, mpg: 58, category: "Adventure" },
    { model: "CRF300L", tank: 7.8, mpg: 78, category: "Dual Sport" },
    { model: "Rebel 1100", tank: 13.6, mpg: 50, category: "Cruiser" },
    { model: "Rebel 500", tank: 11.2, mpg: 62, category: "Cruiser" },
    { model: "CB125R", tank: 10, mpg: 100, category: "Naked" },
    { model: "PCX 125", tank: 8.1, mpg: 120, category: "Scooter" }
  ],
  "Husqvarna": [
    { model: "Norden 901", tank: 19, mpg: 50, category: "Adventure" },
    { model: "Norden 901 Expedition", tank: 19, mpg: 48, category: "Adventure" },
    { model: "Svartpilen 401", tank: 13.5, mpg: 58, category: "Retro" },
    { model: "Vitpilen 401", tank: 13.5, mpg: 58, category: "Retro" }
  ],
  "Indian": [
    { model: "Challenger", tank: 22.7, mpg: 38, category: "Grand Tourer" },
    { model: "Pursuit", tank: 22.7, mpg: 38, category: "Grand Tourer" },
    { model: "Chieftain", tank: 20.8, mpg: 38, category: "Grand Tourer" },
    { model: "Scout", tank: 12.5, mpg: 48, category: "Cruiser" },
    { model: "Chief", tank: 15.1, mpg: 42, category: "Cruiser" },
    { model: "FTR 1200", tank: 12.9, mpg: 42, category: "Naked" }
  ],
  "Kawasaki": [
    { model: "Versys 1000 SE", tank: 21, mpg: 48, category: "Adventure" },
    { model: "Versys 650", tank: 21, mpg: 55, category: "Adventure" },
    { model: "Ninja 1000SX", tank: 19, mpg: 45, category: "Sport Tourer" },
    { model: "Ninja H2 SX SE", tank: 19, mpg: 40, category: "Sport Tourer" },
    { model: "Ninja 650", tank: 15, mpg: 55, category: "Sport" },
    { model: "Ninja ZX-10R", tank: 17, mpg: 35, category: "Sport" },
    { model: "Z900", tank: 17, mpg: 45, category: "Naked" },
    { model: "Z650", tank: 15, mpg: 56, category: "Naked" },
    { model: "Z H2", tank: 19, mpg: 38, category: "Naked" },
    { model: "Vulcan S", tank: 14, mpg: 52, category: "Cruiser" },
    { model: "KLR 650", tank: 23, mpg: 58, category: "Dual Sport" },
    { model: "Ninja 400", tank: 14, mpg: 60, category: "Sport" },
    { model: "Z400", tank: 14, mpg: 62, category: "Naked" }
  ],
  "KTM": [
    { model: "1290 Super Adventure S", tank: 23, mpg: 42, category: "Adventure" },
    { model: "1290 Super Adventure R", tank: 23, mpg: 40, category: "Adventure" },
    { model: "890 Adventure", tank: 20, mpg: 52, category: "Adventure" },
    { model: "890 Adventure R", tank: 20, mpg: 50, category: "Adventure" },
    { model: "390 Adventure", tank: 14.5, mpg: 62, category: "Adventure" },
    { model: "1390 Super Duke R", tank: 17.5, mpg: 36, category: "Naked" },
    { model: "890 Duke R", tank: 14.5, mpg: 48, category: "Naked" },
    { model: "390 Duke", tank: 13.4, mpg: 62, category: "Naked" },
    { model: "RC 390", tank: 13.7, mpg: 60, category: "Sport" }
  ],
  "Moto Guzzi": [
    { model: "V85 TT", tank: 21, mpg: 50, category: "Adventure" },
    { model: "V85 TT Travel", tank: 23, mpg: 48, category: "Adventure" },
    { model: "V7 Stone", tank: 21, mpg: 52, category: "Retro" },
    { model: "V100 Mandello", tank: 18, mpg: 45, category: "Sport Tourer" },
    { model: "Stelvio", tank: 21, mpg: 48, category: "Adventure" }
  ],
  "MV Agusta": [
    { model: "Turismo Veloce 800", tank: 21.5, mpg: 42, category: "Sport Tourer" },
    { model: "Brutale 1000 RR", tank: 16, mpg: 32, category: "Naked" },
    { model: "F3 800", tank: 16.5, mpg: 40, category: "Sport" }
  ],
  "Norton": [
    { model: "V4 SV", tank: 15, mpg: 38, category: "Sport" },
    { model: "Commando 961", tank: 16, mpg: 42, category: "Retro" }
  ],
  "Royal Enfield": [
    { model: "Himalayan 450", tank: 17, mpg: 65, category: "Adventure" },
    { model: "Interceptor 650", tank: 13.7, mpg: 55, category: "Retro" },
    { model: "Continental GT 650", tank: 12.5, mpg: 55, category: "Retro" },
    { model: "Meteor 350", tank: 15, mpg: 70, category: "Cruiser" },
    { model: "Classic 350", tank: 13, mpg: 70, category: "Retro" },
    { model: "Super Meteor 650", tank: 15.7, mpg: 55, category: "Cruiser" },
    { model: "Shotgun 650", tank: 13.7, mpg: 55, category: "Retro" },
    { model: "Hunter 350", tank: 13, mpg: 72, category: "Naked" }
  ],
  "Suzuki": [
    { model: "V-Strom 1050DE", tank: 20, mpg: 48, category: "Adventure" },
    { model: "V-Strom 1050", tank: 20, mpg: 48, category: "Adventure" },
    { model: "V-Strom 800DE", tank: 20, mpg: 52, category: "Adventure" },
    { model: "V-Strom 650", tank: 20, mpg: 58, category: "Adventure" },
    { model: "V-Strom 250", tank: 17.3, mpg: 80, category: "Adventure" },
    { model: "GSX-S1000GT", tank: 19, mpg: 42, category: "Sport Tourer" },
    { model: "GSX-R1000R", tank: 16, mpg: 38, category: "Sport" },
    { model: "GSX-8S", tank: 14, mpg: 52, category: "Naked" },
    { model: "Katana", tank: 12, mpg: 42, category: "Retro" },
    { model: "SV650", tank: 14, mpg: 55, category: "Naked" },
    { model: "Hayabusa", tank: 20, mpg: 36, category: "Sport" }
  ],
  "Triumph": [
    { model: "Tiger 1200 Rally Explorer", tank: 30, mpg: 45, category: "Adventure" },
    { model: "Tiger 1200 GT Explorer", tank: 30, mpg: 46, category: "Adventure" },
    { model: "Tiger 1200 Rally Pro", tank: 20, mpg: 46, category: "Adventure" },
    { model: "Tiger 1200 GT Pro", tank: 20, mpg: 47, category: "Adventure" },
    { model: "Tiger 900 Rally Pro", tank: 20, mpg: 52, category: "Adventure" },
    { model: "Tiger 900 GT Pro", tank: 20, mpg: 53, category: "Adventure" },
    { model: "Tiger Sport 660", tank: 17, mpg: 58, category: "Sport Tourer" },
    { model: "Tiger 660 Sport", tank: 17, mpg: 58, category: "Sport Tourer" },
    { model: "Sprint ST 1050", tank: 20, mpg: 42, category: "Sport Tourer" },
    { model: "Speed Triple 1200 RS", tank: 15.5, mpg: 38, category: "Naked" },
    { model: "Street Triple 765 RS", tank: 17.4, mpg: 48, category: "Naked" },
    { model: "Trident 660", tank: 14, mpg: 55, category: "Naked" },
    { model: "Scrambler 1200 XE", tank: 16, mpg: 45, category: "Retro" },
    { model: "Scrambler 400 X", tank: 12, mpg: 62, category: "Retro" },
    { model: "Bonneville T120", tank: 14.5, mpg: 52, category: "Retro" },
    { model: "Bonneville T100", tank: 14.5, mpg: 55, category: "Retro" },
    { model: "Bonneville Speedmaster", tank: 12, mpg: 50, category: "Cruiser" },
    { model: "Thruxton RS", tank: 14.5, mpg: 42, category: "Retro" },
    { model: "Rocket 3", tank: 18, mpg: 35, category: "Cruiser" },
    { model: "Speed 400", tank: 13, mpg: 60, category: "Naked" },
    { model: "Daytona 660", tank: 17, mpg: 50, category: "Sport" }
  ],
  "Yamaha": [
    { model: "Ténéré 700", tank: 16, mpg: 58, category: "Adventure" },
    { model: "Ténéré 700 World Raid", tank: 23, mpg: 55, category: "Adventure" },
    { model: "Tracer 9 GT+", tank: 18, mpg: 50, category: "Sport Tourer" },
    { model: "Tracer 9 GT", tank: 18, mpg: 50, category: "Sport Tourer" },
    { model: "Tracer 7 GT", tank: 17, mpg: 55, category: "Sport Tourer" },
    { model: "FJR1300", tank: 25, mpg: 40, category: "Grand Tourer" },
    { model: "MT-10", tank: 17, mpg: 40, category: "Naked" },
    { model: "MT-09", tank: 14, mpg: 48, category: "Naked" },
    { model: "MT-07", tank: 14, mpg: 56, category: "Naked" },
    { model: "MT-03", tank: 14, mpg: 62, category: "Naked" },
    { model: "XSR900", tank: 14, mpg: 46, category: "Retro" },
    { model: "XSR700", tank: 13, mpg: 55, category: "Retro" },
    { model: "YZF-R1", tank: 17, mpg: 34, category: "Sport" },
    { model: "YZF-R7", tank: 13, mpg: 50, category: "Sport" },
    { model: "YZF-R3", tank: 14, mpg: 65, category: "Sport" },
    { model: "NIKEN GT", tank: 18, mpg: 42, category: "Sport Tourer" },
    { model: "TMAX", tank: 15, mpg: 55, category: "Scooter" }
  ]
};

/**
 * Generate a nickname for a bike based on make and model.
 * Returns a short punchy name riders might actually use.
 */
function generateBikeNickname(make, model) {
  var words = [
    'Thunder', 'Shadow', 'Phoenix', 'Storm', 'Ghost', 'Raven', 'Fury',
    'Valkyrie', 'Titan', 'Bandit', 'Rebel', 'Viper', 'Hawk', 'Bolt',
    'Blaze', 'Nomad', 'Drifter', 'Beast', 'Bullet', 'Rocket', 'Phantom',
    'Legend', 'Ace', 'Duke', 'Baron', 'Tank', 'Bruiser', 'Sabre',
    'Fang', 'Archer', 'Mustang', 'Maverick', 'Diesel', 'Viking',
    'Spartan', 'Atlas', 'Griffin', 'Charger', 'Torque', 'Ironside'
  ];

  var colours = [
    'Black', 'Silver', 'Red', 'Midnight', 'Iron', 'Dark', 'Steel',
    'Slate', 'Copper', 'Ash', 'Storm', 'Smoke', 'Rust', 'Chrome'
  ];

  var suffixes = [
    'Runner', 'Rider', 'Machine', 'Express', 'Special', 'Mk II',
    'One', 'Zero', 'Prime', 'Custom'
  ];

  var seed = 0;
  var str = make + model;
  for (var i = 0; i < str.length; i++) seed = ((seed << 5) - seed + str.charCodeAt(i)) | 0;
  var abs = Math.abs(seed);

  var patterns = [
    function() { return 'The ' + words[abs % words.length]; },
    function() { return colours[(abs >> 3) % colours.length] + ' ' + words[(abs >> 5) % words.length]; },
    function() { return words[(abs >> 2) % words.length] + ' ' + suffixes[(abs >> 4) % suffixes.length]; },
    function() {
      var m = model.split(/[\s-]+/);
      var short = m[m.length - 1];
      return 'The ' + short;
    },
    function() {
      var m = model.split(/[\s-]+/);
      return m[0] + ' ' + words[(abs >> 6) % words.length];
    }
  ];

  var results = [];
  for (var p = 0; p < patterns.length; p++) {
    results.push(patterns[p]());
  }
  return results;
}

/**
 * Calculate fuel range for a given bike.
 * @param {number} tankLitres - Tank capacity in litres
 * @param {number} mpg - Miles per gallon
 * @param {number} reserveLitres - Reserve to keep (default 2L)
 * @returns {{ totalRange: number, safeRange: number, reserveRange: number }}
 */
function calculateBikeRange(tankLitres, mpg, reserveLitres) {
  if (!tankLitres || !mpg) return { totalRange: 0, safeRange: 0, reserveRange: 0 };
  reserveLitres = reserveLitres || 2;
  var litresPerGallon = 4.546;
  var totalGallons = tankLitres / litresPerGallon;
  var usableGallons = (tankLitres - reserveLitres) / litresPerGallon;
  var totalRange = Math.round(totalGallons * mpg);
  var safeRange = Math.round(usableGallons * mpg);
  return { totalRange: totalRange, safeRange: safeRange, reserveRange: totalRange - safeRange };
}
