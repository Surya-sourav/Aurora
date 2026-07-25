import { ExternalLink, Star } from 'lucide-react';
import { fetchBookmarks, fetchPersonal } from '@/lib/api';
import { ProseLayout, SectionLabel } from '@/components/layout/ProseLayout';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { TagChip } from '@/components/blog/TagChip';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'bookmarks' };

function domain(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default async function BookmarksPage() {
  let items;
  let personal;
  try {
    [items, personal] = await Promise.all([
      fetchBookmarks(),
      fetchPersonal().catch(() => null),
    ]);
  } catch {
    return (
      <>
        <SiteHeader />
        <ProseLayout>
          <p className="font-mono text-sm text-[--color-danger]">backend unavailable</p>
        </ProseLayout>
        <SiteFooter />
      </>
    );
  }
  return (
    <>
      <SiteHeader name={personal?.name ?? 'aurora'} />
      <ProseLayout>
        <SectionLabel>
          bookmarks · {items.length}
        </SectionLabel>
        <p className="font-mono text-xs text-[--color-faint] mb-6">
          <span className="text-[--color-muted]">$</span> things worth saving · with commentary
        </p>
        {items.length === 0 ? (
          <p className="font-mono text-sm text-[--color-faint] py-8 text-center">
            <span className="text-[--color-muted]">$</span> nothing saved yet
          </p>
        ) : (
          <ul className="space-y-4">
            {items.map((b) => (
              <li
                key={b.id}
                className="border-l-2 border-[--color-border] pl-4 py-1 hover:border-[--color-accent] transition-colors group"
              >
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block space-y-1"
                >
                  <div className="flex items-baseline gap-2">
                    {b.is_favorite && (
                      <Star size={11} className="text-[--color-accent] shrink-0" fill="currentColor" />
                    )}
                    <span className="font-mono text-sm text-[--color-fg] group-hover:text-[--color-accent] transition-colors">
                      {b.title || b.url}
                    </span>
                    <ExternalLink
                      size={10}
                      className="text-[--color-faint] shrink-0"
                    />
                  </div>
                  <div className="font-mono text-[10px] text-[--color-faint]">
                    {domain(b.url)}
                  </div>
                  {b.note && (
                    <p className="font-serif text-sm text-[--color-muted] italic pt-1">
                      {b.note}
                    </p>
                  )}
                </a>
                {b.tags.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap mt-2">
                    {b.tags.map((t) => (
                      <TagChip key={t} tag={t} />
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </ProseLayout>
      <SiteFooter />
    </>
  );
}
