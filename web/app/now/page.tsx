import { fetchPersonal } from '@/lib/api';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { ProseLayout, SectionLabel } from '@/components/layout/ProseLayout';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'now' };

export default async function NowPage() {
  let personal;
  try {
    personal = await fetchPersonal();
  } catch {
    return (
      <>
        <SiteHeader />
        <ProseLayout>
          <p className="font-mono text-sm text-[--color-danger]">
            backend unavailable
          </p>
        </ProseLayout>
        <SiteFooter />
      </>
    );
  }
  const updated = personal.updated_at
    ? new Date(personal.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;
  return (
    <>
      <SiteHeader name={personal.name} />
      <ProseLayout>
        <SectionLabel>now</SectionLabel>
        <p className="font-mono text-xs text-[--color-faint] mb-6">
          <span className="text-[--color-muted]">$</span> what i'm focused on this month · a{' '}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[--color-accent] hover:underline"
          >
            /now page
          </a>
          {updated && <span> · last updated {updated}</span>}
        </p>
        {personal.now_page ? (
          <MarkdownRenderer>{personal.now_page}</MarkdownRenderer>
        ) : (
          <p className="font-mono text-sm text-[--color-faint]">nothing here yet.</p>
        )}
      </ProseLayout>
      <SiteFooter />
    </>
  );
}
