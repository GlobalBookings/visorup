export type GpxWaypoint = { latitude: number; longitude: number; name: string };
export type ParsedGpx = { name: string; waypoints: GpxWaypoint[] };

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .trim();
}

function extractTag(block: string, tag: string): string | null {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return m ? decodeEntities(m[1]) : null;
}

/** Evenly downsample a list to at most `max` items, always keeping first and last. */
function downsample<T>(items: T[], max: number): T[] {
  if (items.length <= max) return items;
  const out: T[] = [];
  const step = (items.length - 1) / (max - 1);
  for (let i = 0; i < max; i++) out.push(items[Math.round(i * step)]);
  return out;
}

/**
 * Parses a GPX 1.1 document into route waypoints.
 * Priority: explicit <wpt>/<rtept> points; falls back to a downsampled <trkpt> track.
 * Track points are capped so OSRM (max 25 waypoints) stays happy.
 */
export function parseGpx(xml: string, maxWaypoints = 25): ParsedGpx {
  const name = extractTag(xml, 'name') || 'Imported route';

  const readPoints = (tag: string): GpxWaypoint[] => {
    const points: GpxWaypoint[] = [];
    const re = new RegExp(`<${tag}\\b[^>]*?lat=["']([\\-0-9.]+)["'][^>]*?lon=["']([\\-0-9.]+)["'][^>]*?(\\/>|>([\\s\\S]*?)<\\/${tag}>)`, 'gi');
    let m: RegExpExecArray | null;
    let idx = 0;
    while ((m = re.exec(xml)) !== null) {
      const lat = parseFloat(m[1]);
      const lng = parseFloat(m[2]);
      if (Number.isNaN(lat) || Number.isNaN(lng)) continue;
      const inner = m[4] || '';
      const ptName = inner ? extractTag(inner, 'name') : null;
      idx += 1;
      points.push({ latitude: lat, longitude: lng, name: ptName || `Point ${idx}` });
    }
    return points;
  };

  const wpts = readPoints('wpt');
  const rtepts = readPoints('rtept');
  const trkpts = readPoints('trkpt');

  let waypoints: GpxWaypoint[];
  if (rtepts.length >= 2) {
    waypoints = rtepts;
  } else if (wpts.length >= 2) {
    waypoints = wpts;
  } else {
    waypoints = trkpts;
  }

  waypoints = downsample(waypoints, maxWaypoints);
  return { name, waypoints };
}
