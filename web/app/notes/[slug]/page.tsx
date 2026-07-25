import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchNoteBySlug, fetchPersonal } from '@/lib/api';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { ProseLayout } from '@/components/layout/ProseLayout';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { TagChip } from '@/components/blog/TagChip';
import { ViewCountBadge } from '@/components/layout/ViewCountBadge';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const note = await fetchNoteBySlug(slug);
    return { title: note.heading };
  } catch {
    return { title: 'note not found' };
  }
}

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let note;
  let personal;
  try {
    [note, personal] = await Promise.all([
      fetchNoteBySlug(slug),
      fetchPersonal().catch(() => null),
    ]);
  } catch {
    notFound();
  }
  const date = new Date(note.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <>
      <SiteHeader name={personal?.name ?? 'aurora'} />
      <ProseLayout>
        <Link
          href="/notes"
          className="font-mono text-xs text-[--color-muted] hover:text-[--color-accent] inline-flex items-center gap-1 mb-6"
        >
          ← all notes
        </Link>
        <header className="space-y-2 mb-6 pb-4 border-b border-[--color-border]">
          <h1 className="font-mono text-xl font-medium tracking-tight">
            {note.heading}
          </h1>
          <div className="flex items-center gap-2 flex-wrap font-mono text-xs text-[--color-faint]">
            <time>{date}</time>
            <ViewCountBadge count={note.view_count} />
            {note.tags.map((t) => (
              <TagChip key={t} tag={t} />
            ))}
          </div>
        </header>
        <MarkdownRenderer>{note.body}</MarkdownRenderer>
      </ProseLayout>
      <SiteFooter />
    </>
  );
}
