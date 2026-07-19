#!/usr/bin/env node
/**
 * Generate bike images using Gemini API.
 * Usage: node scripts/generate-bike-images.mjs [--dry-run] [--limit N] [--only slug]
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const envPath = resolve(ROOT, '.env');
if (!existsSync(envPath)) { console.error('Missing .env file'); process.exit(1); }
const envContent = readFileSync(envPath, 'utf8');
const GEMINI_API_KEY = envContent.match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();
if (!GEMINI_API_KEY) { console.error('Missing GEMINI_API_KEY in .env'); process.exit(1); }

const MODEL = 'gemini-3.1-flash-image-preview';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const limitIdx = args.indexOf('--limit');
const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1]) : Infinity;
const onlyIdx = args.indexOf('--only');
const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;
const forceRegen = args.includes('--force');

const BIKES = [
  {
    slug: "bmw-r-1250-gs",
    name: "BMW R 1250 GS",
    cardPrompt: "A BMW R 1250 GS adventure motorcycle parked on a scenic Scottish Highland road with mountains and a loch in the background, the bike shown in three-quarter front view with panniers fitted, grey/black colorway, golden hour lighting, dramatic landscape behind. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A BMW R 1250 GS adventure motorcycle riding along a dramatic Highland single-track road, shot from a low angle showing the bike in motion with mountains stretching behind, panniers loaded for touring, atmospheric Scottish weather with clouds and golden light breaking through. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "triumph-tiger-900",
    name: "Triumph Tiger 900 Rally Pro",
    cardPrompt: "A Triumph Tiger 900 Rally Pro adventure motorcycle parked at a viewpoint overlooking the Welsh mountains, three-quarter front view, white and blue colorway with wire spoke wheels, rugged terrain around, warm afternoon light. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Triumph Tiger 900 Rally Pro riding through a winding Welsh mountain pass road, rider in full touring gear, green hillsides dropping away on both sides, the road curving ahead into the mountains, bright overcast light. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "honda-africa-twin",
    name: "Honda CRF1100L Africa Twin",
    cardPrompt: "A Honda Africa Twin CRF1100L adventure motorcycle parked on a gravel layby beside a dramatic Highland loch, the bike shown in three-quarter view with aluminium panniers, red and black colorway, mountains reflected in the still water behind. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Honda Africa Twin riding along the NC500 coast road in Scotland, dramatic cliffs and turquoise sea on one side, the rider leaning slightly into a bend, panniers loaded, wild Highland landscape stretching ahead, warm sunset lighting. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "yamaha-tenere-700",
    name: "Yamaha Tenere 700",
    cardPrompt: "A Yamaha Tenere 700 adventure motorcycle parked on a remote single-track road in the Scottish Highlands, three-quarter front view, blue and white rally-inspired livery, soft luggage strapped to the rear, heather-covered moorland and distant mountains behind. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Yamaha Tenere 700 riding a remote single-track road through the Scottish Highlands with passing places, mountains rising on both sides, clouds rolling over peaks, the narrow road disappearing into wild empty landscape, atmospheric lighting. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "ktm-1290-super-adventure-s",
    name: "KTM 1290 Super Adventure S",
    cardPrompt: "A KTM 1290 Super Adventure S motorcycle parked at the summit of a dramatic mountain pass road, three-quarter front view, orange and black KTM colorway, touring panniers fitted, the road visible winding down the mountainside behind, dramatic sky. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A KTM 1290 Super Adventure S in motion on the Bealach na Ba pass road in Scotland, dramatic switchback road climbing steeply, the sea visible far below, orange bike standing out against grey and green landscape, rider leaning into a bend, epic scale. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "ducati-multistrada-v4-s",
    name: "Ducati Multistrada V4 S",
    cardPrompt: "A Ducati Multistrada V4 S motorcycle parked on a sweeping British A-road through rolling countryside, three-quarter front view, red Ducati livery, touring panniers fitted, autumn-colored trees lining the road, warm golden light. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Ducati Multistrada V4 S riding through the Yorkshire Dales, flowing A-road with dry stone walls on both sides, green rolling hills beyond, the red bike in motion with rider, dramatic cumulus clouds overhead, warm afternoon light. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "suzuki-v-strom-650",
    name: "Suzuki V-Strom 650",
    cardPrompt: "A Suzuki V-Strom 650 adventure motorcycle parked beside a stone bridge over a Highland river, three-quarter front view, silver and black colorway, practical touring setup with top box and panniers, green glen with mountains behind. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Suzuki V-Strom 650 touring along a quiet B-road through the Scottish Borders, rolling green hills and old stone walls, the bike loaded with touring luggage, peaceful countryside, warm afternoon light, sense of accessible adventure. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "royal-enfield-himalayan-450",
    name: "Royal Enfield Himalayan 450",
    cardPrompt: "A Royal Enfield Himalayan 450 motorcycle parked on a rugged moorland track in the Peak District, three-quarter front view, adventure-style with spoke wheels and rugged styling, misty hills in the background, atmospheric lighting. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Royal Enfield Himalayan 450 riding along a narrow moorland road in Northumberland, Hadrian's Wall visible on the hillside, the compact adventure bike with rider in full gear, wild open landscape, atmospheric clouds, sense of exploration on a budget. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "kawasaki-ninja-1000sx",
    name: "Kawasaki Ninja 1000SX",
    cardPrompt: "A Kawasaki Ninja 1000SX sport touring motorcycle parked at a scenic viewpoint overlooking the Lake District, three-quarter front view, green Kawasaki colorway, touring panniers fitted, mountains and a lake visible behind. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Kawasaki Ninja 1000SX sport touring bike riding through the Kirkstone Pass in the Lake District, sweeping uphill road with mountain scenery, rider in sport-touring position, green bike with panniers, dramatic fell landscape, bright overcast light. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "yamaha-tracer-9-gt",
    name: "Yamaha Tracer 9 GT",
    cardPrompt: "A Yamaha Tracer 9 GT sport touring motorcycle parked on a bridge in the Scottish Highlands, three-quarter front view, dark grey metallic colorway, integrated panniers, a river and forested glen below, afternoon light. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Yamaha Tracer 9 GT in motion on the A82 through Glencoe, the Three Sisters mountains towering on both sides, the sport-touring bike with rider threading through the dramatic valley, moody clouds, patches of sunlight on the peaks. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "honda-nt1100",
    name: "Honda NT1100",
    cardPrompt: "A Honda NT1100 touring motorcycle parked at a harbour in a coastal fishing village, three-quarter front view, dark blue colorway, integrated panniers and touring screen, boats in the harbour, colourful houses climbing the hillside behind. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Honda NT1100 touring along the Northumberland coast road, Bamburgh Castle visible on the headland ahead, wide sandy beach on one side, the touring bike loaded and riding comfortably, warm golden hour light reflecting on wet sand. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "bmw-s-1000-xr",
    name: "BMW S 1000 XR",
    cardPrompt: "A BMW S 1000 XR sport adventure motorcycle parked on a sweeping Highland A-road, three-quarter front view, blue and white BMW Motorsport colorway, touring panniers fitted, mountains and open road stretching behind, dramatic sky. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A BMW S 1000 XR riding fast on a flowing A-road through the Scottish Highlands, rider tucked in slightly, the sporty adventure bike with touring luggage, sweeping bends through green glen with mountains, sense of speed and capability, dramatic lighting. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "triumph-bonneville-t120",
    name: "Triumph Bonneville T120",
    cardPrompt: "A Triumph Bonneville T120 classic motorcycle parked outside a traditional English country pub, three-quarter front view, chrome and black classic styling, leather panniers, stone pub building with hanging baskets, warm summer afternoon light. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Triumph Bonneville T120 riding through the Cotswolds on a narrow lane lined with honey-colored stone walls, classic British countryside with rolling fields, the vintage-styled bike with rider in retro gear, golden afternoon light, quintessentially British atmosphere. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "kawasaki-z650",
    name: "Kawasaki Z650",
    cardPrompt: "A Kawasaki Z650 naked motorcycle parked on a coastal road overlooking dramatic cliffs and the sea, three-quarter front view, green Kawasaki colorway, minimalist naked styling, blue ocean and rugged coastline behind. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Kawasaki Z650 naked bike riding along the Atlantic Highway in Cornwall, dramatic coastal scenery with cliffs and surf, the rider on the nimble naked bike leaning into a coastal bend, bright summer day, blue sea stretching to the horizon. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "bmw-k-1600-gt",
    name: "BMW K 1600 GT",
    cardPrompt: "A BMW K 1600 GT luxury touring motorcycle parked at an elegant Highland hotel entrance, three-quarter front view, dark blue metallic colorway, full touring setup with integrated panniers and top case, majestic building and Scottish landscape behind. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A BMW K 1600 GT grand touring motorcycle cruising along a sweeping A-road through the Scottish Borders, the large touring bike with rider in comfort, rolling green hills and River Tweed valley, effortless long-distance touring atmosphere, warm light. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "honda-gold-wing",
    name: "Honda Gold Wing",
    cardPrompt: "A Honda Gold Wing touring motorcycle parked at a scenic lakeside viewpoint in the Lake District, three-quarter front view, dark red and chrome luxury touring styling, mountains reflected in the still lake behind, warm golden hour light. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Honda Gold Wing touring motorcycle riding along the shore of Ullswater in the Lake District, the grand touring bike with pillion passenger, serene lake and mountain scenery, autumn colours on trees, warm afternoon light, ultimate long-distance comfort. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "suzuki-gsx-r1000r",
    name: "Suzuki GSX-R1000R",
    cardPrompt: "A Suzuki GSX-R1000R superbike parked at the top of a dramatic mountain pass, three-quarter front view, blue and white Suzuki racing livery, aggressive sport styling, a winding road visible descending the mountain behind, dramatic sky. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Suzuki GSX-R1000R superbike riding the Cat and Fiddle road in the Peak District, the sport bike leaned into a fast sweeping bend, green moorland on both sides, rider in full race leathers, sense of speed on an iconic British biking road. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "kawasaki-ninja-650",
    name: "Kawasaki Ninja 650",
    cardPrompt: "A Kawasaki Ninja 650 sport motorcycle parked on a coastal clifftop road in Cornwall, three-quarter front view, green Kawasaki sportbike styling, the sea and rocky coastline visible behind, wildflowers on the clifftop, bright summer light. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Kawasaki Ninja 650 riding along the coastal road near Land's End in Cornwall, dramatic Atlantic cliffs and crashing waves, the sport bike with rider navigating the curving coastal road, bright sunny day, turquoise sea, sense of accessible sportbike touring. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "kawasaki-versys-650",
    name: "Kawasaki Versys 650",
    cardPrompt: "A Kawasaki Versys 650 versatile motorcycle parked at a trailhead in Snowdonia Wales, three-quarter front view, green colorway, touring luggage fitted, mountain peaks and slate valleys behind, atmospheric misty conditions. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Kawasaki Versys 650 riding through Snowdonia on the A5, mountain roads with dramatic rock faces on both sides, waterfalls visible, the versatile bike loaded for touring, rider in adventure gear, moody Welsh weather with patches of sun. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "honda-cb500x",
    name: "Honda CB500X",
    cardPrompt: "A Honda CB500X adventure motorcycle parked on a quiet lane on Guernsey, Channel Islands, three-quarter front view, silver and black colorway, the harbour and sea visible below, granite walls and wildflowers, warm summer day. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Honda CB500X riding along a narrow lane on Jersey, Channel Islands, granite walls on one side, the sea and Elizabeth Castle visible in the distance, the compact adventure bike perfect for island touring, warm golden light, relaxed island atmosphere. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "honda-transalp-xl750",
    name: "Honda XL750 Transalp",
    cardPrompt: "A Honda XL750 Transalp adventure motorcycle parked at a viewpoint in Snowdonia, Wales, three-quarter front view, red and white Transalp livery, soft luggage fitted, slate mountains and a lake behind, warm afternoon light. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Honda XL750 Transalp riding a flowing Welsh mountain pass on the A44, green hillsides and dry stone walls, the mid-weight adventure bike in motion with rider, bright overcast light breaking through clouds. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "ktm-890-adventure",
    name: "KTM 890 Adventure",
    cardPrompt: "A KTM 890 Adventure motorcycle parked on a remote Scottish Highland moorland road, three-quarter front view, orange and black KTM livery, rally-style tank and luggage, heather moorland and distant peaks behind, atmospheric light. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A KTM 890 Adventure riding a single-track Highland road with passing places, mountains rising on both sides, the agile adventure bike leaning into a bend, moody Scottish weather with shafts of sunlight. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "aprilia-tuareg-660",
    name: "Aprilia Tuareg 660",
    cardPrompt: "An Aprilia Tuareg 660 adventure motorcycle parked beside a tarn in the Lake District, three-quarter front view, rally-inspired yellow, blue and white livery with spoked wheels, fells reflected in still water behind. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "An Aprilia Tuareg 660 riding over a Lake District mountain pass, dramatic fell scenery and a winding road, the mid-weight adventure bike with rider in full gear, bright overcast Cumbrian light. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "bmw-f-900-gs",
    name: "BMW F 900 GS",
    cardPrompt: "A BMW F 900 GS adventure motorcycle parked on a moorland track in the Peak District, three-quarter front view, GS rallye white, red and blue livery, soft luggage fitted, misty gritstone edges behind. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A BMW F 900 GS riding the Snake Pass in the Peak District, sweeping moorland road with dramatic hills, the lightweight GS in motion with rider, atmospheric clouds and patches of sun. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "suzuki-gsx-s1000gt",
    name: "Suzuki GSX-S1000GT",
    cardPrompt: "A Suzuki GSX-S1000GT sport touring motorcycle parked at a scenic A-road viewpoint in the Yorkshire Dales, three-quarter front view, metallic blue colorway, colour-matched panniers fitted, dry stone walls and rolling hills behind. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Suzuki GSX-S1000GT sport tourer riding a fast flowing A-road through the Yorkshire Dales, green hills and dramatic clouds, the bike with panniers leaning through a sweeping bend, warm afternoon light. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "kawasaki-versys-1000-se",
    name: "Kawasaki Versys 1000 SE",
    cardPrompt: "A Kawasaki Versys 1000 SE sport touring motorcycle parked at a Highland loch viewpoint, three-quarter front view, green and black Kawasaki colorway, full touring panniers and top box, mountains reflected in the loch behind. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Kawasaki Versys 1000 SE touring the A82 through Glencoe, the Three Sisters mountains towering above, the loaded sport-touring bike with rider threading the valley, moody dramatic light. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "bmw-r-1250-rt",
    name: "BMW R 1250 RT",
    cardPrompt: "A BMW R 1250 RT luxury sport touring motorcycle parked outside an elegant hotel in the Scottish Borders, three-quarter front view, dark blue metallic colorway, integrated panniers and top case, grand building and rolling countryside behind. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A BMW R 1250 RT grand tourer cruising a sweeping A-road through the River Tweed valley in the Scottish Borders, effortless long-distance comfort, rolling green hills, warm settled light. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "triumph-tiger-sport-660",
    name: "Triumph Tiger Sport 660",
    cardPrompt: "A Triumph Tiger Sport 660 motorcycle parked at a Welsh mountain viewpoint, three-quarter front view, grey and red Triumph colorway, colour-matched panniers, green valleys and mountain road behind, warm light. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Triumph Tiger Sport 660 riding a winding Welsh mountain pass on the A5, rock faces and green hillsides, the accessible sport-tourer in motion with rider, bright overcast Welsh light. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "honda-nc750x",
    name: "Honda NC750X",
    cardPrompt: "A Honda NC750X motorcycle parked on a quiet British B-road through rolling countryside, three-quarter front view, grey and black colorway, top box fitted, hedgerows and green fields behind, warm afternoon light. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Honda NC750X touring a flowing A-road through the English countryside, the practical commuter-tourer in motion with rider, rolling fields and big skies, relaxed accessible touring atmosphere, warm light. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "royal-enfield-interceptor-650",
    name: "Royal Enfield Interceptor 650",
    cardPrompt: "A Royal Enfield Interceptor 650 classic motorcycle parked outside a traditional Cotswold pub, three-quarter front view, chrome tank and retro styling, leather panniers, honey-coloured stone building with hanging baskets, warm summer light. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Royal Enfield Interceptor 650 riding a narrow Cotswold lane lined with honey-coloured stone walls, classic British countryside, the retro roadster with rider in relaxed gear, golden afternoon light. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "moto-guzzi-v85-tt",
    name: "Moto Guzzi V85 TT",
    cardPrompt: "A Moto Guzzi V85 TT retro adventure motorcycle parked on a moorland road in the Peak District, three-quarter front view, classic yellow, red and white heritage livery with spoked wheels, misty gritstone hills behind. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Moto Guzzi V85 TT riding a moorland road through the Peak District, distinctive retro-adventure styling, the bike with rider on a flowing route, atmospheric clouds and patches of sun over gritstone edges. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "triumph-scrambler-1200",
    name: "Triumph Scrambler 1200 XE",
    cardPrompt: "A Triumph Scrambler 1200 XE motorcycle parked on a rugged moorland track in Northumberland, three-quarter front view, matte green and brushed metal scrambler styling with high exhaust, wild open landscape behind, atmospheric light. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Triumph Scrambler 1200 XE riding a remote moorland road in Northumberland, Hadrian's Wall country, the muscular retro scrambler with rider in heritage gear, wild landscape and dramatic clouds. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "harley-davidson-road-glide",
    name: "Harley-Davidson Road Glide",
    cardPrompt: "A Harley-Davidson Road Glide bagger touring motorcycle parked on a coastal road overlooking the Northumberland coast, three-quarter front view, dark colorway with frame-mounted fairing and hard bags, wide sandy beach and castle on the headland behind. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Harley-Davidson Road Glide cruising the Northumberland coast road, Bamburgh Castle on the headland ahead, the big bagger with rider in relaxed touring style, wide beach and golden hour light on wet sand. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "triumph-rocket-3-gt",
    name: "Triumph Rocket 3 GT",
    cardPrompt: "A Triumph Rocket 3 GT muscle cruiser motorcycle parked at a sweeping A-road viewpoint in the Scottish Borders, three-quarter front view, black and chrome with its huge triple engine prominent, rolling green hills behind, warm afternoon light. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Triumph Rocket 3 GT cruising a sweeping A-road through the Scottish Borders, the enormous power cruiser with rider in relaxed touring position, rolling hills and big skies, effortless muscle-touring atmosphere. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "benelli-trk-502",
    name: "Benelli TRK 502",
    cardPrompt: "A Benelli TRK 502 adventure motorcycle parked at a viewpoint in the Brecon Beacons, Wales, three-quarter front view, grey and red colorway with aluminium-look panniers, green mountains and open moorland behind. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Benelli TRK 502 riding a flowing road through the Brecon Beacons, Wales, the value adventure bike loaded for touring with rider, green rolling mountains and dramatic Welsh skies. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "zero-dsr-x",
    name: "Zero DSR/X",
    cardPrompt: "A Zero DSR/X electric adventure motorcycle parked beside a Highland loch charging point, three-quarter front view, matte grey modern electric adventure styling with no exhaust, mountains and still water behind, clean atmospheric light. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Zero DSR/X electric adventure motorcycle riding a quiet Highland single-track road, the silent modern electric bike with rider gliding through wild Scottish scenery, mountains and dramatic light, sense of clean future touring. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  },
  {
    slug: "honda-forza-750",
    name: "Honda Forza 750",
    cardPrompt: "A Honda Forza 750 maxi-scooter parked on a coastal road in Cornwall, three-quarter front view, dark metallic colorway with large touring screen and integrated storage, blue sea and rugged clifftop behind, bright summer light. Landscape orientation, 4:3 aspect ratio. Photorealistic motorcycle photography. No text, watermarks, or logos.",
    heroPrompt: "A Honda Forza 750 maxi-scooter riding the Atlantic Highway along the Cornish coast, dramatic cliffs and turquoise sea, the comfortable twist-and-go tourer with rider on a coastal bend, bright sunny day. Landscape orientation, 21:9 ultrawide aspect ratio. Cinematic motorcycle photography. No text, watermarks, or logos."
  }
];

async function generateImage(prompt) {
  const res = await fetch(`${ENDPOINT}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API ${res.status}: ${txt.substring(0, 300)}`);
  }
  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData?.mimeType?.startsWith('image/')) {
      return Buffer.from(part.inlineData.data, 'base64');
    }
  }
  throw new Error('No image in response');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  let bikes = BIKES;
  if (only) bikes = bikes.filter(b => b.slug === only);

  const images = [];
  for (const bike of bikes) {
    images.push({ file: `public/images/bikes/${bike.slug}.jpg`, prompt: bike.cardPrompt, slug: bike.slug, type: 'card' });
    images.push({ file: `public/images/bikes/${bike.slug}-hero.jpg`, prompt: bike.heroPrompt, slug: bike.slug, type: 'hero' });
  }

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  console.log(`Generating ${images.length} bike images...\n`);

  for (const img of images) {
    if (generated >= limit) break;
    const fullPath = resolve(ROOT, img.file);

    if (existsSync(fullPath) && !forceRegen) {
      console.log(`  SKIP ${img.file} (exists)`);
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log(`  DRY  ${img.file}`);
      console.log(`       ${img.prompt.substring(0, 80)}...`);
      generated++;
      continue;
    }

    console.log(`  GEN  ${img.file} (${img.slug} ${img.type})...`);
    try {
      const dir = dirname(fullPath);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

      const buffer = await generateImage(img.prompt);
      writeFileSync(fullPath, buffer);
      const kb = Math.round(buffer.length / 1024);
      console.log(`       OK (${kb}KB)`);
      generated++;
      await sleep(2500);
    } catch (e) {
      console.error(`       FAIL: ${e.message}`);
      failed++;
      await sleep(3000);
    }
  }

  console.log(`\nDone: ${generated} generated, ${skipped} skipped, ${failed} failed`);
}

main().catch(e => { console.error(e); process.exit(1); });
