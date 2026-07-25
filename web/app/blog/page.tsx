import {
  fetchBlogList,
  fetchCategories,
  fetchPersonal,
  fetchTags,
} from '@/lib/api';
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
  searchParams: Promise<{ tag?: string; category?: string; page?: string }>;
}) {
  const sp = await searchParams;
  let blogs;
  let tags;
  let categories;
  let personal;
  try {
    [blogs, tags, categories, personal] = await Promise.all([
      fetchBlogList({
        tag: sp.tag,
        category: sp.category,
        page: sp.page ? parseInt(sp.page, 10) : 1,
        pageSize: 50,
      }),
      fetchTags(),
      fetchCategories(),
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
        <SectionLabel>
          blog · {blogs.total} {blogs.total === 1 ? 'post' : 'posts'}
        </SectionLabel>
        <SearchAndFilter
          items={blogs.items}
          tags={tags}
          categories={categories}
          activeTag={sp.tag}
          activeCategory={sp.category}
        />
      </ProseLayout>
      <SiteFooter />
    </>
  );
}
