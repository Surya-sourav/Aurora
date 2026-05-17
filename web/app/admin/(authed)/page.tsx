import Link from 'next/link';
import { fetchPersonal, API_URL } from '@/lib/api';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function fetchTotals(): Promise<{ total: number; published: number; drafts: number } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('aurora_token')?.value;
    if (!token) return null;
    const res = await fetch(`${API_URL}/blog/totals`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as { total: number; published: number; drafts: number };
  } catch {
    return null;
  }
}

export default async function AdminDashboard() {
  let personal;
  let totals;
  try {
    [personal, totals] = await Promise.all([
      fetchPersonal().catch(() => null),
      fetchTotals(),
    ]);
  } catch {
    /* ignore */
  }

  return (
    <div className="space-y-8">
      <h2 className="font-mono text-lg">
        <span className="text-[--color-faint]">## </span>dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Stat label="portfolio views" value={personal?.portfolio_view_count ?? 0} />
        <Stat label="published posts" value={totals?.published ?? 0} />
        <Stat label="drafts" value={totals?.drafts ?? 0} />
      </div>

      <div className="space-y-2">
        <h3 className="font-mono text-sm text-[--color-muted]">
          <span className="text-[--color-faint]">$ </span>quick actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <ActionCard
            href="/admin/blog/new"
            title="write a new post"
            desc="open the markdown editor"
          />
          <ActionCard
            href="/admin/portfolio"
            title="edit portfolio"
            desc="update bio, headings, gallery"
          />
          <ActionCard
            href="/admin/blog"
            title="manage posts"
            desc="drafts, edits, deletes"
          />
          <ActionCard href="/" title="visit live site" desc="see what readers see" />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-[--color-border] rounded-md p-4">
      <div className="font-mono text-[10px] uppercase text-[--color-faint] tracking-wider">
        {label}
      </div>
      <div className="font-mono text-2xl mt-1 text-[--color-accent]">
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function ActionCard({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="block border border-[--color-border] rounded-md p-4 hover:border-[--color-accent] transition-colors"
    >
      <div className="font-mono text-sm">
        <span className="text-[--color-faint]">→ </span>
        {title}
      </div>
      <div className="font-mono text-xs text-[--color-muted] mt-1">{desc}</div>
    </Link>
  );
}
