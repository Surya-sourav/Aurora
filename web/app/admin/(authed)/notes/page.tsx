import Link from 'next/link';
import { cookies } from 'next/headers';
import { Plus } from 'lucide-react';
import { API_URL } from '@/lib/api';
import type { Note } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function fetchAdminNotes(): Promise<Note[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get('aurora_token')?.value;
  if (!token) return [];
  try {
    const res = await fetch(`${API_URL}/notes`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items: Note[] };
    return data.items;
  } catch {
    return [];
  }
}

export default async function AdminNotesList() {
  const items = await fetchAdminNotes();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-lg">
          <span className="text-[--color-faint]">## </span>notes ({items.length})
        </h2>
        <Link
          href="/admin/notes/new"
          className="inline-flex items-center gap-1.5 h-9 px-3 bg-[--color-accent] text-[--color-accent-fg] rounded-md font-mono text-sm hover:opacity-90"
        >
          <Plus size={14} /> new note
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="font-mono text-sm text-[--color-faint] text-center py-12">
          <span className="text-[--color-muted]">$</span> nothing here yet · write your first TIL
        </p>
      ) : (
        <ul className="divide-y divide-[--color-border] border-y border-[--color-border]">
          {items.map((n) => (
            <li key={n.id} className="py-3">
              <Link
                href={`/admin/notes/${n.id}/edit`}
                className="block group"
              >
                <div className="font-mono text-sm group-hover:text-[--color-accent] transition-colors">
                  {n.heading}
                </div>
                <div className="font-mono text-xs text-[--color-faint] mt-0.5">
                  {n.slug} · {new Date(n.created_at).toLocaleDateString()} ·{' '}
                  {n.view_count} views
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
