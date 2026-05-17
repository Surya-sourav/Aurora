import Link from 'next/link';
import { cookies } from 'next/headers';
import { API_URL } from '@/lib/api';
import { Plus } from 'lucide-react';
import type { BlogListResult } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function fetchAdminBlogList(): Promise<BlogListResult | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('aurora_token')?.value;
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/blog?pageSize=50`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as BlogListResult;
  } catch {
    return null;
  }
}

export default async function AdminBlogList() {
  const data = await fetchAdminBlogList();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-lg">
          <span className="text-[--color-faint]">## </span>blogs ({data?.total ?? 0})
        </h2>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-1.5 h-9 px-3 bg-[--color-accent] text-[--color-accent-fg] rounded-md font-mono text-sm hover:opacity-90"
        >
          <Plus size={14} /> new post
        </Link>
      </div>

      {!data || data.items.length === 0 ? (
        <p className="font-mono text-sm text-[--color-faint] text-center py-12">
          <span className="text-[--color-muted]">$</span> nothing here yet · write something
        </p>
      ) : (
        <ul className="divide-y divide-[--color-border] border-y border-[--color-border]">
          {data.items.map((b) => (
            <li key={b.id} className="py-3 flex items-center gap-3">
              <Link
                href={`/admin/blog/${b.slug}/edit`}
                className="flex-1 min-w-0 group"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm group-hover:text-[--color-accent]">
                    {b.heading}
                  </span>
                  {!b.is_published && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[--color-danger] border border-[--color-danger] rounded px-1.5 py-0.5">
                      draft
                    </span>
                  )}
                </div>
                <div className="font-mono text-xs text-[--color-faint] mt-0.5">
                  {b.slug} ·{' '}
                  {b.published_at
                    ? new Date(b.published_at).toLocaleDateString()
                    : 'unpublished'}{' '}
                  · {b.view_count} views · {b.reading_time_minutes} min
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
