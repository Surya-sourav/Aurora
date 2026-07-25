import { cookies } from 'next/headers';
import { API_URL } from '@/lib/api';
import { BookmarkManager } from '@/components/admin/BookmarkManager';
import type { Bookmark } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function fetchAdminBookmarks(): Promise<Bookmark[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get('aurora_token')?.value;
  if (!token) return [];
  try {
    const res = await fetch(`${API_URL}/bookmarks`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items: Bookmark[] };
    return data.items;
  } catch {
    return [];
  }
}

export default async function AdminBookmarksPage() {
  const items = await fetchAdminBookmarks();
  return (
    <div className="space-y-6">
      <h2 className="font-mono text-lg">
        <span className="text-[--color-faint]">## </span>bookmarks
      </h2>
      <BookmarkManager initial={items} />
    </div>
  );
}
