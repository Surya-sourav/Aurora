import { fetchBlogList, fetchTags, fetchPersonal } from '@/lib/api';
import { SearchAndFilter } from '@/components/blog/SearchAndFilter';
import { ProseLayout, SectionLabel } from '@/components/layout/ProseLayout';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'blog' };

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const sp = await searchParams;
  let blogs;
  let tags;
  let personal;
  try {
    [blogs, tags, personal] = await Promise.all([
      fetchBlogList({
        tag: sp.tag,
        page: sp.page ? parseInt(sp.page, 10) : 1,
        pageSize: 50,
      }),
      fetchTags(),
      fetchPersonal().catch(() => null),
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
        <SectionLabel>blog · {blogs.total} posts</SectionLabel>
        <SearchAndFilter items={blogs.items} tags={tags} activeTag={sp.tag} />
      </ProseLayout>
      <SiteFooter />
    </>
  );
}
