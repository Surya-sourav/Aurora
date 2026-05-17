import { fetchPersonal } from '@/lib/api';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { ProseLayout } from '@/components/layout/ProseLayout';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'interests' };

export default async function InterestsPage() {
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
        {personal.interests ? (
          <MarkdownRenderer>{personal.interests}</MarkdownRenderer>
        ) : (
          <p className="font-mono text-sm text-[--color-faint]">
            nothing here yet.
          </p>
        )}
      </ProseLayout>
      <SiteFooter />
    </>
  );
}
