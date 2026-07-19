import { supabase } from './supabase';

export type ExpenseType = 'fuel' | 'service' | 'gear' | 'insurance' | 'tax' | 'other';

export type Expense = {
  id: string;
  user_id: string;
  bike_id: string | null;
  type: ExpenseType;
  amount: number;
  litres: number | null;
  mileage: number | null;
  notes: string | null;
  spent_at: string;
  created_at: string;
};

export const EXPENSE_TYPES: { type: ExpenseType; label: string; icon: string }[] = [
  { type: 'fuel', label: 'Fuel', icon: 'water' },
  { type: 'service', label: 'Service', icon: 'construct' },
  { type: 'gear', label: 'Gear', icon: 'shirt' },
  { type: 'insurance', label: 'Insurance', icon: 'shield-checkmark' },
  { type: 'tax', label: 'Tax', icon: 'document-text' },
  { type: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
];

const LITRES_PER_GALLON = 4.54609;

export async function fetchExpenses(bikeId: string | null): Promise<Expense[]> {
  try {
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) return [];
    let query = supabase
      .from('expenses')
      .select('*')
      .eq('user_id', u.id)
      .order('spent_at', { ascending: false });
    if (bikeId) query = query.eq('bike_id', bikeId);
    const { data, error } = await query;
    if (error || !data) return [];
    return data as Expense[];
  } catch {
    return [];
  }
}

export async function addExpense(input: {
  bike_id: string | null;
  type: ExpenseType;
  amount: number;
  litres: number | null;
  mileage: number | null;
  notes: string | null;
  spent_at: string;
}): Promise<{ error: string | null }> {
  try {
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) return { error: 'Sign in to log expenses.' };
    const { error } = await supabase.from('expenses').insert({
      user_id: u.id,
      bike_id: input.bike_id,
      type: input.type,
      amount: input.amount,
      litres: input.litres,
      mileage: input.mileage,
      notes: input.notes,
      spent_at: input.spent_at,
    });
    if (error) return { error: error.message };
    return { error: null };
  } catch (e: any) {
    return { error: e?.message || 'Could not save expense.' };
  }
}

export async function deleteExpense(id: string): Promise<void> {
  try {
    await supabase.from('expenses').delete().eq('id', id);
  } catch {}
}

export type ExpenseSummary = {
  total: number;
  byType: Record<ExpenseType, number>;
  fuelLitres: number;
  fuelSpend: number;
  avgPricePerLitre: number | null;
};

export function summarise(expenses: Expense[]): ExpenseSummary {
  const byType: Record<ExpenseType, number> = {
    fuel: 0,
    service: 0,
    gear: 0,
    insurance: 0,
    tax: 0,
    other: 0,
  };
  let total = 0;
  let fuelLitres = 0;
  let fuelSpend = 0;
  for (const e of expenses) {
    const amount = e.amount || 0;
    total += amount;
    byType[e.type] = (byType[e.type] || 0) + amount;
    if (e.type === 'fuel') {
      fuelSpend += amount;
      fuelLitres += e.litres || 0;
    }
  }
  const avgPricePerLitre = fuelLitres > 0 ? fuelSpend / fuelLitres : null;
  return { total, byType, fuelLitres, fuelSpend, avgPricePerLitre };
}

export function estimateMpg(expenses: Expense[]): number | null {
  const fuelWithMileage = expenses
    .filter((e) => e.type === 'fuel' && typeof e.mileage === 'number' && e.mileage !== null)
    .sort((a, b) => (a.mileage as number) - (b.mileage as number));
  if (fuelWithMileage.length < 2) return null;

  const first = fuelWithMileage[0];
  const last = fuelWithMileage[fuelWithMileage.length - 1];
  const miles = (last.mileage as number) - (first.mileage as number);
  if (miles <= 0) return null;

  // Litres from all fills except the first, which only establishes the start odometer.
  let litres = 0;
  for (let i = 1; i < fuelWithMileage.length; i++) {
    litres += fuelWithMileage[i].litres || 0;
  }
  if (litres <= 0) return null;

  const gallons = litres / LITRES_PER_GALLON;
  if (gallons <= 0) return null;

  return miles / gallons;
}
