import { cookies } from 'next/headers';
import { API_URL } from '@/lib/api';
import { SeriesManager } from '@/components/admin/SeriesManager';
import type { Series } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function fetchAdminSeries(): Promise<Series[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get('aurora_token')?.value;
  if (!token) return [];
  try {
    const res = await fetch(`${API_URL}/series`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items: Series[] };
    return data.items;
  } catch {
    return [];
  }
}

export default async function AdminSeriesPage() {
  const items = await fetchAdminSeries();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-mono text-lg">
          <span className="text-[--color-faint]">## </span>series
        </h2>
        <p className="font-mono text-xs text-[--color-faint] mt-1">
          multi-part write-ups · each blog can be assigned to one series with an order
        </p>
      </div>
      <SeriesManager initial={items} />
    </div>
  );
}
