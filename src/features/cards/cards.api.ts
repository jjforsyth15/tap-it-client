import { apiFetchWithAuth } from '@/src/features/auth/auth.api';
import type { UserNfcCard } from '@/src/features/profile/profileTypes';

export type MyCardApiRow = Record<string, unknown>;

type MyCardsResponse = {
  cards: MyCardApiRow[];
};

function rowId(row: MyCardApiRow): string {
  const id = row._id ?? row.id;
  return typeof id === 'string' ? id : '';
}

export function mapCardRowToUserNfcCard(row: MyCardApiRow, index: number): UserNfcCard | null {
  const id = rowId(row);
  if (!id) return null;
  const label = typeof row.label === 'string' ? row.label.trim() : '';
  const hw = typeof row.hardware_id === 'string' ? row.hardware_id.trim() : '';
  const title = label || hw || `TapIt card · ${id.slice(-6)}`;
  const v = row.variant;
  const variant =
    v === 'light' || v === 'dark' ? v : index % 2 === 0 ? 'light' : 'dark';
  return { id, title, variant };
}

export function mapCardRowsToUserNfcCards(rows: MyCardApiRow[]): UserNfcCard[] {
  const out: UserNfcCard[] = [];
  rows.forEach((row, i) => {
    const card = mapCardRowToUserNfcCard(row, i);
    if (card) out.push(card);
  });
  return out;
}

export async function fetchMyCards(skip: number = 0, limit: number = 50): Promise<MyCardApiRow[]> {
  const q = new URLSearchParams({
    skip: String(Math.max(0, skip)),
    limit: String(Math.min(200, Math.max(1, limit))),
  });
  const res = await apiFetchWithAuth<MyCardsResponse>(`/api/v1/cards/mine?${q.toString()}`);
  return Array.isArray(res.cards) ? res.cards : [];
}

export async function fetchMyCardsAsUserNfcCards(): Promise<UserNfcCard[]> {
  const rows = await fetchMyCards();
  return mapCardRowsToUserNfcCards(rows);
}
