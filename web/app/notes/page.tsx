import Link from 'next/link';
import { fetchNotes, fetchPersonal } from '@/lib/api';
import { ProseLayout, SectionLabel } from '@/components/layout/ProseLayout';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'notes' };

export default async function NotesPage() {
  let notes;
  let personal;
  try {
    [notes, personal] = await Promise.all([
      fetchNotes(),
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
          notes · {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </SectionLabel>
        <p className="font-mono text-xs text-[--color-faint] mb-6">
          <span className="text-[--color-muted]">$</span> short-form · TILs · scratch pad
        </p>
        {notes.length === 0 ? (
          <p className="font-mono text-sm text-[--color-faint] py-8 text-center">
            <span className="text-[--color-muted]">$</span> nothing here yet
          </p>
        ) : (
          <ul className="divide-y divide-[--color-border] border-y border-[--color-border]">
            {notes.map((n) => (
              <li key={n.id}>
                <Link
                  href={`/notes/${n.slug}`}
                  className="flex items-baseline gap-3 py-3 group"
                >
                  <span className="text-[--color-faint] text-xs shrink-0">▸</span>
                  <span className="font-mono text-sm text-[--color-fg] group-hover:text-[--color-accent] flex-1 min-w-0 truncate transition-colors">
                    {n.heading}
                  </span>
                  <span className="font-mono text-[10px] text-[--color-faint] shrink-0">
                    {new Date(n.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </ProseLayout>
      <SiteFooter />
    </>
  );
}
