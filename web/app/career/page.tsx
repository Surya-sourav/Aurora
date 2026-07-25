import { fetchCareer, fetchPersonal } from '@/lib/api';
import { CareerTimeline } from '@/components/career/CareerTimeline';
import { ProseLayout, SectionLabel } from '@/components/layout/ProseLayout';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'career' };

export default async function CareerPage() {
  let personal;
  let items;
  try {
    [personal, items] = await Promise.all([
      fetchPersonal().catch(() => null),
      fetchCareer(),
    ]);
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
      <SiteHeader name={personal?.name ?? 'aurora'} />
      <ProseLayout>
        <SectionLabel>career · {items.length} {items.length === 1 ? 'position' : 'positions'}</SectionLabel>
        {items.length === 0 ? (
          <p className="font-mono text-sm text-[--color-faint] py-8">
            <span className="text-[--color-muted]">$</span> journey not documented yet
          </p>
        ) : (
          <CareerTimeline items={items} />
        )}
      </ProseLayout>
      <SiteFooter />
    </>
  );
}
