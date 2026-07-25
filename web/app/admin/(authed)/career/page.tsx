import Link from 'next/link';
import { cookies } from 'next/headers';
import { API_URL } from '@/lib/api';
import { Plus } from 'lucide-react';
import type { Career } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function fetchAdminCareer(): Promise<Career[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get('aurora_token')?.value;
  if (!token) return [];
  try {
    const res = await fetch(`${API_URL}/career`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items: Career[] };
    return data.items;
  } catch {
    return [];
  }
}

function fmt(d: string | null) {
  if (!d) return 'present';
  const [y, m] = d.split('-');
  if (!y || !m) return d;
  return `${y}.${m}`;
}

export default async function AdminCareerList() {
  const items = await fetchAdminCareer();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-lg">
          <span className="text-[--color-faint]">## </span>career ({items.length})
        </h2>
        <Link
          href="/admin/career/new"
          className="inline-flex items-center gap-1.5 h-9 px-3 bg-[--color-accent] text-[--color-accent-fg] rounded-md font-mono text-sm hover:opacity-90"
        >
          <Plus size={14} /> new position
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="font-mono text-sm text-[--color-faint] text-center py-12">
          <span className="text-[--color-muted]">$</span> nothing here yet · add your first position
        </p>
      ) : (
        <ul className="divide-y divide-[--color-border] border-y border-[--color-border]">
          {items.map((c) => (
            <li key={c.id} className="py-3 flex items-center gap-3">
              <Link
                href={`/admin/career/${c.id}/edit`}
                className="flex-1 min-w-0 group"
              >
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-mono text-sm group-hover:text-[--color-accent] transition-colors">
                    {c.job_title}
                  </span>
                  <span className="font-mono text-xs text-[--color-faint]">@</span>
                  <span className="font-mono text-sm text-[--color-accent]">
                    {c.company_name}
                  </span>
                  {!c.end_date && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[--color-accent] border border-[--color-accent] rounded px-1.5 py-0.5">
                      current
                    </span>
                  )}
                </div>
                <div className="font-mono text-xs text-[--color-faint] mt-0.5">
                  {fmt(c.start_date)} — {fmt(c.end_date)}
                  {c.location && ` · ${c.location}`}
                  {c.employment_type && ` · ${c.employment_type}`}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
