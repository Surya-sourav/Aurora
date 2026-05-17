import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { API_URL } from '@/lib/api';
import { BlogEditor } from '@/components/admin/BlogEditor';
import type { BlogDetail } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function fetchAdminBlog(slug: string): Promise<BlogDetail | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('aurora_token')?.value;
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/blog/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { success: boolean; blog: BlogDetail };
    return data.blog;
  } catch {
    return null;
  }
}

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await fetchAdminBlog(slug);
  if (!blog) notFound();
  return <BlogEditor mode="edit" initial={blog} />;
}
