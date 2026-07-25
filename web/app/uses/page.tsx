import { fetchPersonal } from '@/lib/api';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { ProseLayout, SectionLabel } from '@/components/layout/ProseLayout';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'uses' };

export default async function UsesPage() {
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
  return (
    <>
      <SiteHeader name={personal.name} />
      <ProseLayout>
        <SectionLabel>uses</SectionLabel>
        <p className="font-mono text-xs text-[--color-faint] mb-6">
          <span className="text-[--color-muted]">$</span> the tools · hardware · software i reach for
        </p>
        {personal.uses_page ? (
          <MarkdownRenderer>{personal.uses_page}</MarkdownRenderer>
        ) : (
          <p className="font-mono text-sm text-[--color-faint]">nothing here yet.</p>
        )}
      </ProseLayout>
      <SiteFooter />
    </>
  );
}
