export type GpxWaypoint = { latitude: number; longitude: number; name: string };
export type ParsedGpx = { name: string; waypoints: GpxWaypoint[] };

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export type LatLng = { latitude: number; longitude: number };

/**
 * Builds a GPX 1.1 document from named waypoints and/or a track line.
 * Waypoints become <wpt> + <rtept> (so other apps keep the stops), and the
 * full geometry becomes a <trk> so the exact road line is preserved.
 */
export function buildGpx(opts: {
  name: string;
  waypoints?: GpxWaypoint[];
  track?: LatLng[];
}): string {
  const name = escapeXml(opts.name || 'VisorUp route');
  const wpts = opts.waypoints ?? [];
  const track = opts.track ?? [];

  const wptXml = wpts
    .map((w) => `  <wpt lat="${w.latitude}" lon="${w.longitude}"><name>${escapeXml(w.name)}</name></wpt>`)
    .join('\n');

  const rteXml = wpts.length >= 2
    ? `  <rte>\n    <name>${name}</name>\n${wpts
        .map((w) => `    <rtept lat="${w.latitude}" lon="${w.longitude}"><name>${escapeXml(w.name)}</name></rtept>`)
        .join('\n')}\n  </rte>`
    : '';

  const trkXml = track.length >= 2
    ? `  <trk>\n    <name>${name}</name>\n    <trkseg>\n${track
        .map((c) => `      <trkpt lat="${c.latitude}" lon="${c.longitude}"></trkpt>`)
        .join('\n')}\n    </trkseg>\n  </trk>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="VisorUp" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>${name}</name></metadata>
${[wptXml, rteXml, trkXml].filter(Boolean).join('\n')}
</gpx>`;
}

/** Slugifies a route name into a safe .gpx filename. */
export function gpxFileName(name: string): string {
  const base = name.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
  return `${base || 'route'}.gpx`;
}

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
