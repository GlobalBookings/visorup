#!/usr/bin/env node
/**
 * Fetches UK fuel stations from OpenStreetMap Overpass API
 * and writes them to fuel-stations-uk.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const QUERY = '[out:json][timeout:120];(node["amenity"="fuel"](49.5,-8.5,61.0,2.5);way["amenity"="fuel"](49.5,-8.5,61.0,2.5);relation["amenity"="fuel"](49.5,-8.5,61.0,2.5););out center body;';
const OUTPUT_FILE = path.join(__dirname, '..', 'fuel-stations-uk.js');
const DEDUP_DISTANCE_METERS = 50;

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function fetchOverpass(query) {
  return new Promise((resolve, reject) => {
    const postData = `data=${encodeURIComponent(query)}`;
    const url = new URL(OVERPASS_URL);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'MotorbikeTourApp/1.0'
      }
    };

    console.log('Querying Overpass API for UK fuel stations...');
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 500)}`));
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`JSON parse error: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(180000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.write(postData);
    req.end();
  });
}

function parseStations(osmData) {
  return osmData.elements.map(el => {
    const tags = el.tags || {};
    const name = tags.name || tags.brand || 'Fuel Station';
    const brand = tags.brand || '';
    // For ways/relations, use center coordinates
    const lat = el.lat || (el.center && el.center.lat);
    const lng = el.lon || (el.center && el.center.lon);
    if (!lat || !lng) return null;
    return {
      lat: Math.round(lat * 100000) / 100000,
      lng: Math.round(lng * 100000) / 100000,
      name: name,
      brand: brand
    };
  }).filter(Boolean);
}

function deduplicateStations(stations) {
  // Sort so named stations come first (prefer keeping named ones)
  stations.sort((a, b) => {
    const aHasName = a.name !== 'Fuel Station' ? 0 : 1;
    const bHasName = b.name !== 'Fuel Station' ? 0 : 1;
    return aHasName - bHasName;
  });

  const kept = [];
  const removed = new Set();

  for (let i = 0; i < stations.length; i++) {
    if (removed.has(i)) continue;
    kept.push(stations[i]);

    for (let j = i + 1; j < stations.length; j++) {
      if (removed.has(j)) continue;
      const dist = haversineDistance(
        stations[i].lat, stations[i].lng,
        stations[j].lat, stations[j].lng
      );
      if (dist < DEDUP_DISTANCE_METERS) {
        removed.add(j);
      }
    }
  }

  return kept;
}

function writeOutputFile(stations) {
  let content = '/* UK Fuel Stations - sourced from OpenStreetMap via Overpass API */\n';
  content += `/* Generated: ${new Date().toISOString()} | Total: ${stations.length} stations */\n\n`;
  content += 'const UK_FUEL_STATIONS = [\n';

  for (let i = 0; i < stations.length; i++) {
    const s = stations[i];
    const nameEsc = s.name.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const brandEsc = s.brand.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    content += `  { lat: ${s.lat}, lng: ${s.lng}, name: '${nameEsc}', brand: '${brandEsc}' }`;
    if (i < stations.length - 1) content += ',';
    content += '\n';
  }

  content += '];\n';

  fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
  console.log(`Written ${stations.length} stations to ${OUTPUT_FILE}`);
}

async function main() {
  try {
    const osmData = await fetchOverpass(QUERY);
    console.log(`Received ${osmData.elements.length} raw fuel station nodes from OSM`);

    const stations = parseStations(osmData);
    console.log(`Parsed ${stations.length} stations`);

    const deduped = deduplicateStations(stations);
    console.log(`After deduplication (${DEDUP_DISTANCE_METERS}m): ${deduped.length} stations (removed ${stations.length - deduped.length} duplicates)`);

    writeOutputFile(deduped);
    console.log(`Total count: ${deduped.length}`);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
