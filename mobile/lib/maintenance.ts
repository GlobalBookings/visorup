import { supabase } from './supabase';

export type ServiceType = 'oil' | 'tyres' | 'chain' | 'brakes' | 'coolant' | 'general';

export type MaintenanceLog = {
  id: string;
  user_id: string;
  bike_id: string;
  service_type: ServiceType;
  mileage: number | null;
  cost: number | null;
  notes: string | null;
  serviced_at: string;
  created_at: string;
};

export const SERVICE_ITEMS: {
  type: ServiceType;
  label: string;
  icon: string;
  intervalMiles: number;
  intervalMonths: number;
}[] = [
  { type: 'oil', label: 'Oil & filter', icon: 'water-outline', intervalMiles: 4000, intervalMonths: 12 },
  { type: 'tyres', label: 'Tyres', icon: 'ellipse-outline', intervalMiles: 8000, intervalMonths: 36 },
  { type: 'chain', label: 'Chain lube & adjust', icon: 'link-outline', intervalMiles: 500, intervalMonths: 1 },
  { type: 'brakes', label: 'Brakes & pads', icon: 'disc-outline', intervalMiles: 12000, intervalMonths: 24 },
  { type: 'coolant', label: 'Coolant', icon: 'thermometer-outline', intervalMiles: 24000, intervalMonths: 24 },
  { type: 'general', label: 'General service', icon: 'construct-outline', intervalMiles: 6000, intervalMonths: 12 },
];

export async function fetchLogs(bikeId: string): Promise<MaintenanceLog[]> {
  try {
    const { data, error } = await supabase
      .from('bike_maintenance')
      .select('*')
      .eq('bike_id', bikeId)
      .order('serviced_at', { ascending: false });
    if (error) return [];
    return (data as MaintenanceLog[]) || [];
  } catch {
    return [];
  }
}

export async function addLog(input: {
  bike_id: string;
  service_type: ServiceType;
  mileage: number | null;
  cost: number | null;
  notes: string | null;
  serviced_at: string;
}): Promise<{ error: string | null }> {
  try {
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) return { error: 'Sign in to log maintenance.' };
    const { error } = await supabase.from('bike_maintenance').insert({
      user_id: u.id,
      bike_id: input.bike_id,
      service_type: input.service_type,
      mileage: input.mileage,
      cost: input.cost,
      notes: input.notes,
      serviced_at: input.serviced_at,
    });
    if (error) return { error: error.message };
    return { error: null };
  } catch (e: any) {
    return { error: e?.message || 'Could not save maintenance log.' };
  }
}

export async function deleteLog(id: string): Promise<void> {
  try {
    await supabase.from('bike_maintenance').delete().eq('id', id);
  } catch {}
}

export type DueStatus = {
  type: ServiceType;
  label: string;
  icon: string;
  lastMileage: number | null;
  lastDate: string | null;
  dueInMiles: number | null;
  dueInDays: number | null;
  status: 'ok' | 'soon' | 'overdue' | 'unknown';
};

const DAY_MS = 1000 * 60 * 60 * 24;

export function computeDue(logs: MaintenanceLog[], currentMileage: number | null): DueStatus[] {
  const now = Date.now();
  return SERVICE_ITEMS.map((item) => {
    const last = logs.find((l) => l.service_type === item.type) || null;
    if (!last) {
      return {
        type: item.type,
        label: item.label,
        icon: item.icon,
        lastMileage: null,
        lastDate: null,
        dueInMiles: null,
        dueInDays: null,
        status: 'unknown' as const,
      };
    }

    let dueInDays: number | null = null;
    if (last.serviced_at) {
      const due = new Date(last.serviced_at);
      due.setMonth(due.getMonth() + item.intervalMonths);
      dueInDays = Math.round((due.getTime() - now) / DAY_MS);
    }

    let dueInMiles: number | null = null;
    if (currentMileage != null && last.mileage != null) {
      dueInMiles = last.mileage + item.intervalMiles - currentMileage;
    }

    let status: DueStatus['status'] = 'ok';
    const overdue =
      (dueInDays != null && dueInDays <= 0) || (dueInMiles != null && dueInMiles <= 0);
    const soon =
      (dueInDays != null && dueInDays <= 30) || (dueInMiles != null && dueInMiles <= 500);
    if (overdue) status = 'overdue';
    else if (soon) status = 'soon';

    return {
      type: item.type,
      label: item.label,
      icon: item.icon,
      lastMileage: last.mileage,
      lastDate: last.serviced_at,
      dueInMiles,
      dueInDays,
      status,
    };
  });
}

export type TclocsItem = { key: string; label: string; detail: string };

export const TCLOCS: TclocsItem[] = [
  {
    key: 'tyres',
    label: 'Tyres & wheels',
    detail: 'Pressures cold and correct, tread depth legal, no cuts or bulges, wheels true and spokes tight.',
  },
  {
    key: 'controls',
    label: 'Controls',
    detail: 'Levers, cables and throttle move freely and snap back, bars turn lock to lock, no fraying or kinks.',
  },
  {
    key: 'lights',
    label: 'Lights & electrics',
    detail: 'Headlight, brake light, indicators and horn all work, battery secure, wiring undamaged.',
  },
  {
    key: 'oil',
    label: 'Oil & fluids',
    detail: 'Engine oil, coolant, brake and clutch fluid at level, no leaks or drips under the bike.',
  },
  {
    key: 'chassis',
    label: 'Chassis',
    detail: 'Frame free of cracks, chain tension and lube good, sprockets sound, suspension and bearings solid.',
  },
  {
    key: 'stands',
    label: 'Stands',
    detail: 'Side stand and centre stand spring up firmly and hold, cut-out switch working.',
  },
];
